/**
 * Fetches data for curated held items from PokéAPI.
 * Outputs: src/data/generated/items.json
 */
import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";
import fs from "fs/promises";
import { HELD_ITEMS } from "../src/data/items";

interface ItemResponse {
  name: string;
  flavor_text_entries: { text: string; language: { name: string } }[];
  sprites: { default: string };
}

interface OutputItem {
  name: string;
  category: string;
  description: string;
  officialDescription: string;
  sprite: string;
}

function toPokeApiName(name: string): string {
  return name.toLowerCase().replace(/ \/ | /g, "-").replace(/\./g, "").replace(/'/g, "");
}

async function fetchItem(itemInfo: typeof HELD_ITEMS[0]): Promise<OutputItem> {
  try {
    const apiName = toPokeApiName(itemInfo.name);
    const data = await fetchApi<ItemResponse>(`/item/${apiName}/`);
    const engFlavor = data.flavor_text_entries.find(e => e.language.name === "en");

    return {
      name: itemInfo.name,
      category: itemInfo.category,
      description: itemInfo.description,
      officialDescription: engFlavor ? engFlavor.text.replace(/\n/g, " ") : itemInfo.description,
      sprite: data.sprites.default || ""
    };
  } catch (err) {
    console.error(`\n  ⚠ Failed to fetch item ${itemInfo.name}: maybe not in PokeAPI yet?`);
    return {
      name: itemInfo.name,
      category: itemInfo.category,
      description: itemInfo.description,
      officialDescription: itemInfo.description,
      sprite: "" 
    };
  }
}

async function main() {
  console.log("🔄 Fetching items from PokéAPI...\n");
  
  const itemMap = new Map<string, typeof HELD_ITEMS[0]>();
  for (const i of HELD_ITEMS) {
    itemMap.set(i.name, i);
  }

  try {
    const rawData = await fs.readFile(path.join(__dirname, "../src/data/generated/pokemon.json"), "utf8");
    const pokemonData = JSON.parse(rawData);
    for (const p of pokemonData) {
      if (p.heldItems) {
        for (const item of p.heldItems) {
          if (!itemMap.has(item)) {
            itemMap.set(item, {
              name: item,
              category: "Wild Held Item",
              description: "Item dropped or held by wild Pokémon",
            });
          }
        }
      }
    }
  } catch (err) {
    console.log("⚠ Could not read pokemon.json, skipping dynamic wild items.");
  }

  const allItemsToFetch = Array.from(itemMap.values());
  const items = await fetchBatch(allItemsToFetch, fetchItem, "items");
  const outPath = path.join(__dirname, "../src/data/generated/items.json");
  writeJsonFile(outPath, items);
  console.log(`\n✅ ${items.length} items processed`);
}

main().catch(console.error);
