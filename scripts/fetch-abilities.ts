/**
 * Fetches all abilities from PokéAPI.
 * Outputs: src/data/generated/abilities.json
 */
import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface AbilityListResponse {
  results: { name: string; url: string }[];
}

interface AbilityResponse {
  id: number;
  name: string;
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

interface OutputAbility {
  name: string;
  effect: string;
  shortEffect: string;
  flavorText: string;
}

function formatName(name: string): string {
  return name.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

async function fetchAbility(url: string): Promise<OutputAbility | null> {
  try {
    const data = await fetchApi<AbilityResponse>(url);
    const engEffect = data.effect_entries.find(e => e.language.name === "en");
    const engFlavor = data.flavor_text_entries.find(e => e.language.name === "en");

    return {
      name: formatName(data.name),
      effect: engEffect ? engEffect.effect.replace(/\n/g, " ") : "",
      shortEffect: engEffect ? engEffect.short_effect.replace(/\n/g, " ") : "",
      flavorText: engFlavor ? engFlavor.flavor_text.replace(/\n/g, " ") : ""
    };
  } catch (err) {
    console.error(`\n  ⚠ Failed to fetch ability ${url}:`, err);
    return null;
  }
}

async function main() {
  console.log("🔄 Fetching abilities from PokéAPI...\n");
  const list = await fetchApi<AbilityListResponse>("/ability?limit=1000");
  const urls = list.results.map(r => r.url);
  const abilities = await fetchBatch(urls, fetchAbility, "abilities");
  const validAbilities = abilities.filter(Boolean) as OutputAbility[];
  validAbilities.sort((a, b) => a.name.localeCompare(b.name));
  const outPath = path.join(__dirname, "../src/data/generated/abilities.json");
  writeJsonFile(outPath, validAbilities);
  console.log(`\n✅ ${validAbilities.length} abilities fetched`);
}

main().catch(console.error);
