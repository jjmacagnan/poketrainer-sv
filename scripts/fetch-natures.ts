/**
 * Fetches all 25 natures from PokéAPI.
 * Outputs: src/data/generated/natures.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface NatureResponse {
  id: number;
  name: string;
  increased_stat: { name: string } | null;
  decreased_stat: { name: string } | null;
  likes_flavor: { name: string } | null;
  hates_flavor: { name: string } | null;
}

const STAT_NAME_MAP: Record<string, string> = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "Spe",
};

interface OutputNature {
  name: string;
  increased: string | null;
  decreased: string | null;
  likes: string | null;
  dislikes: string | null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchNature(id: number): Promise<OutputNature> {
  const data = await fetchApi<NatureResponse>(`/nature/${id}/`);
  return {
    name: capitalize(data.name),
    increased: data.increased_stat
      ? STAT_NAME_MAP[data.increased_stat.name] || data.increased_stat.name
      : null,
    decreased: data.decreased_stat
      ? STAT_NAME_MAP[data.decreased_stat.name] || data.decreased_stat.name
      : null,
    likes: data.likes_flavor ? capitalize(data.likes_flavor.name) : null,
    dislikes: data.hates_flavor ? capitalize(data.hates_flavor.name) : null,
  };
}

async function main() {
  console.log("🔄 Fetching natures from PokéAPI...\n");

  const ids = Array.from({ length: 25 }, (_, i) => i + 1);
  const natures = await fetchBatch(ids, fetchNature, "natures");

  const outPath = path.join(__dirname, "../src/data/generated/natures.json");
  writeJsonFile(outPath, natures);

  console.log(`\n✅ ${natures.length} natures fetched`);
}

main().catch(console.error);
