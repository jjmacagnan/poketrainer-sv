/**
 * Fetches all berries from PokéAPI.
 * Used for Sandwich Builder — flavor potency, growth time, item mappings.
 * Outputs: src/data/generated/berries.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface BerryResponse {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: { name: string };
  flavors: { potency: number; flavor: { name: string } }[];
  item: { name: string };
  natural_gift_type: { name: string };
}

interface OutputBerry {
  id: number;
  name: string;
  growthTime: number;
  maxHarvest: number;
  naturalGiftPower: number;
  size: number;
  smoothness: number;
  soilDryness: number;
  firmness: string;
  flavors: Record<string, number>;
  item: string;
  naturalGiftType: string;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchBerry(id: number): Promise<OutputBerry> {
  const data = await fetchApi<BerryResponse>(`/berry/${id}/`);

  const flavors: Record<string, number> = {};
  for (const f of data.flavors) {
    flavors[f.flavor.name] = f.potency;
  }

  return {
    id: data.id,
    name: data.name,
    growthTime: data.growth_time,
    maxHarvest: data.max_harvest,
    naturalGiftPower: data.natural_gift_power,
    size: data.size,
    smoothness: data.smoothness,
    soilDryness: data.soil_dryness,
    firmness: data.firmness.name,
    flavors,
    item: data.item.name,
    naturalGiftType: capitalize(data.natural_gift_type.name),
  };
}

async function main() {
  console.log("🔄 Fetching berries from PokéAPI...\n");

  // PokéAPI has ~64 berries
  interface BerryListResponse {
    count: number;
    results: { name: string; url: string }[];
  }

  const list = await fetchApi<BerryListResponse>("/berry/?limit=100");
  console.log(`  Found ${list.count} berries in API`);

  const ids = list.results
    .map((r) => {
      const match = r.url.match(/\/berry\/(\d+)\//);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((id) => id > 0)
    .sort((a, b) => a - b);

  const berries = await fetchBatch(ids, fetchBerry, "berries");

  const outPath = path.join(__dirname, "../src/data/generated/berries.json");
  writeJsonFile(outPath, berries);

  console.log(`\n✅ ${berries.length} berries fetched`);
}

main().catch(console.error);
