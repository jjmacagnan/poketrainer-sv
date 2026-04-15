/**
 * Fetches data for curated held items from PokéAPI.
 * Outputs: src/data/generated/items.json
 */
import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";
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
  const items = await fetchBatch(HELD_ITEMS, fetchItem, "items");
  const outPath = path.join(__dirname, "../src/data/generated/items.json");
  writeJsonFile(outPath, items);
  console.log(`\n✅ ${items.length} items processed`);
}

main().catch(console.error);
