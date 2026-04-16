/**
 * Fetches all version groups from PokéAPI.
 * Used for filtering data specific to Scarlet & Violet.
 * Outputs: src/data/generated/version-groups.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface VersionGroupResponse {
  id: number;
  name: string;
  order: number;
  generation: { name: string };
  move_learn_methods: { name: string }[];
  pokedexes: { name: string }[];
  regions: { name: string }[];
  versions: { name: string }[];
}

interface OutputVersionGroup {
  id: number;
  name: string;
  order: number;
  generation: string;
  moveLearnMethods: string[];
  pokedexes: string[];
  regions: string[];
  versions: string[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatName(name: string): string {
  return name
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
}

async function fetchVersionGroup(id: number): Promise<OutputVersionGroup> {
  const data = await fetchApi<VersionGroupResponse>(`/version-group/${id}/`);
  return {
    id: data.id,
    name: data.name,
    order: data.order,
    generation: data.generation.name,
    moveLearnMethods: data.move_learn_methods.map((m) => formatName(m.name)),
    pokedexes: data.pokedexes.map((p) => formatName(p.name)),
    regions: data.regions.map((r) => formatName(r.name)),
    versions: data.versions.map((v) => formatName(v.name)),
  };
}

async function main() {
  console.log("🔄 Fetching version groups from PokéAPI...\n");

  interface VersionGroupListResponse {
    count: number;
    results: { name: string; url: string }[];
  }

  const list = await fetchApi<VersionGroupListResponse>("/version-group/?limit=50");
  console.log(`  Found ${list.count} version groups in API`);

  const ids = list.results
    .map((r) => {
      const match = r.url.match(/\/version-group\/(\d+)\//);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((id) => id > 0)
    .sort((a, b) => a - b);

  const groups = await fetchBatch(ids, fetchVersionGroup, "version-groups");

  // Highlight Scarlet/Violet
  const svGroup = groups.find((g) => g.name.includes("scarlet-violet"));
  if (svGroup) {
    console.log(`\n  🎮 Scarlet & Violet version group: ID ${svGroup.id}`);
  }

  const outPath = path.join(
    __dirname,
    "../src/data/generated/version-groups.json"
  );
  writeJsonFile(outPath, groups);

  console.log(`\n✅ ${groups.length} version groups fetched`);
}

main().catch(console.error);
