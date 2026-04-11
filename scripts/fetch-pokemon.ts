/**
 * Fetches all Pokémon from Paldea + DLC pokédexes via PokéAPI.
 * Outputs: src/data/generated/pokemon.json
 *
 * Data per Pokémon: dexNumber, nationalDex, name, types, baseStats, evYield,
 *   abilities, sprite, artwork, pokedex, height, weight, heldItems
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

// PokéAPI pokédex IDs for Scarlet/Violet
const POKEDEX_IDS = {
  paldea: 31,
  kitakami: 32,
  blueberry: 33,
};

interface PokedexResponse {
  pokemon_entries: {
    entry_number: number;
    pokemon_species: { name: string; url: string };
  }[];
}

interface SpeciesResponse {
  id: number;
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

interface PokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; effort: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean; slot: number }[];
  held_items: { item: { name: string } }[];
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": { front_default: string | null };
    };
  };
}

const STAT_NAME_MAP: Record<string, string> = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "Spe",
};

interface OutputPokemon {
  dexNumber: number;
  nationalDex: number;
  name: string;
  types: string[];
  baseStats: Record<string, number>;
  evYield: { stat: string; amount: number }[];
  abilities: { name: string; isHidden: boolean }[];
  sprite: string;
  artwork: string;
  pokedex: string;
  height: number;
  weight: number;
  heldItems: string[];
}

async function fetchPokedex(id: number): Promise<PokedexResponse> {
  return fetchApi<PokedexResponse>(`/pokedex/${id}/`);
}

async function fetchPokemonData(
  speciesName: string,
  dexNumber: number,
  pokedex: string
): Promise<OutputPokemon | null> {
  try {
    const species = await fetchApi<SpeciesResponse>(
      `/pokemon-species/${speciesName}/`
    );
    const defaultVariety =
      species.varieties.find((v) => v.is_default) || species.varieties[0];
    const pokemon = await fetchApi<PokemonResponse>(defaultVariety.pokemon.url);

    const baseStats: Record<string, number> = {};
    const evYield: { stat: string; amount: number }[] = [];

    for (const s of pokemon.stats) {
      const statName = STAT_NAME_MAP[s.stat.name] || s.stat.name;
      baseStats[statName] = s.base_stat;
      if (s.effort > 0) {
        evYield.push({ stat: statName, amount: s.effort });
      }
    }

    return {
      dexNumber,
      nationalDex: species.id,
      name: formatName(pokemon.name),
      types: pokemon.types
        .sort((a, b) => a.slot - b.slot)
        .map((t) => capitalize(t.type.name)),
      baseStats,
      evYield,
      abilities: pokemon.abilities
        .sort((a, b) => a.slot - b.slot)
        .map((a) => ({
          name: formatName(a.ability.name),
          isHidden: a.is_hidden,
        })),
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      pokedex,
      height: pokemon.height,
      weight: pokemon.weight,
      heldItems: pokemon.held_items.map((h) => formatName(h.item.name)),
    };
  } catch (err) {
    console.error(`\n  ⚠ Failed to fetch ${speciesName}: ${err}`);
    return null;
  }
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

async function main() {
  console.log("🔄 Fetching Pokémon data from PokéAPI...\n");

  const allPokemon: OutputPokemon[] = [];
  const seen = new Set<string>();

  for (const [name, id] of Object.entries(POKEDEX_IDS)) {
    console.log(`📖 Fetching pokédex: ${name} (id=${id})`);
    const dex = await fetchPokedex(id);
    console.log(`  Found ${dex.pokemon_entries.length} entries`);

    const toFetch = dex.pokemon_entries.filter(
      (e) => !seen.has(e.pokemon_species.name)
    );
    toFetch.forEach((e) => seen.add(e.pokemon_species.name));

    const results = await fetchBatch(
      toFetch,
      (entry) =>
        fetchPokemonData(entry.pokemon_species.name, entry.entry_number, name),
      `${name} pokémon`
    );

    allPokemon.push(...(results.filter(Boolean) as OutputPokemon[]));
  }

  allPokemon.sort((a, b) => a.nationalDex - b.nationalDex);

  const outPath = path.join(__dirname, "../src/data/generated/pokemon.json");
  writeJsonFile(outPath, allPokemon);

  console.log(`\n✅ Total: ${allPokemon.length} Pokémon fetched`);
}

main().catch(console.error);
