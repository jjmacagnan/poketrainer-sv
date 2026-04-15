/**
 * Fetches type damage relations from PokéAPI.
 * Outputs: src/data/generated/types.json
 */
import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

const ALL_TYPES = [
  "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel",
  "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"
];

interface TypeResponse {
  name: string;
  damage_relations: {
    double_damage_from: { name: string }[];
    double_damage_to: { name: string }[];
    half_damage_from: { name: string }[];
    half_damage_to: { name: string }[];
    no_damage_from: { name: string }[];
    no_damage_to: { name: string }[];
  };
}

interface OutputType {
  name: string;
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchType(name: string): Promise<OutputType | null> {
  try {
    const data = await fetchApi<TypeResponse>(`/type/${name}/`);
    return {
      name: capitalize(data.name),
      weaknesses: data.damage_relations.double_damage_from.map(t => capitalize(t.name)),
      resistances: data.damage_relations.half_damage_from.map(t => capitalize(t.name)),
      immunities: data.damage_relations.no_damage_from.map(t => capitalize(t.name))
    };
  } catch (err) {
    console.error(`\n  ⚠ Failed to fetch type ${name}:`, err);
    return null;
  }
}

async function main() {
  console.log("🔄 Fetching types from PokéAPI...\n");
  const types = await fetchBatch(ALL_TYPES, fetchType, "types");
  const validTypes = types.filter(Boolean) as OutputType[];
  const outPath = path.join(__dirname, "../src/data/generated/types.json");
  writeJsonFile(outPath, validTypes);
  console.log(`\n✅ ${validTypes.length} types fetched`);
}

main().catch(console.error);
