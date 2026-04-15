/**
 * Fetches all Pokémon from Paldea + DLC pokédexes via PokéAPI.
 * Outputs: src/data/generated/pokemon.json
 *
 * Data per Pokémon: dexNumber, nationalDex, name, types, baseStats, evYield,
 *   abilities, sprite, artwork, pokedex, height, weight, heldItems,
 *   isLegendary, isMythical, captureRate, genderRate, eggGroups, habitat,
 *   generation, color, growthRate, baseHappiness, flavorText,
 *   evolutionChainId, baseExperience, formVariants
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

// PokéAPI pokédex IDs for Scarlet/Violet
const POKEDEX_IDS = {
  paldea: 31,
  kitakami: 32,
  blueberry: 33,
};

// Pokémon available in special Tera Raids but not in any Paldea Pokédex.
// isForm=true → fetch /pokemon/{name} directly (regional/alternate forms).
// isForm=false (default) → fetch /pokemon-species/{name} (uses default variety).
const EXTRA_RAID_POKEMON: {
  name: string;
  displayName: string;
  nationalDex: number;
  isForm?: boolean;
}[] = [
  // Mythicals / legendaries via species
  { name: "mewtwo",    displayName: "Mewtwo",    nationalDex: 150 },
  { name: "mew",       displayName: "Mew",        nationalDex: 151 },
  { name: "kyogre",    displayName: "Kyogre",     nationalDex: 382 },
  { name: "manaphy",   displayName: "Manaphy",    nationalDex: 490 },
  { name: "cresselia", displayName: "Cresselia",  nationalDex: 488 },
  { name: "arceus",    displayName: "Arceus",     nationalDex: 493 },
  { name: "hoopa",     displayName: "Hoopa",      nationalDex: 720 },
  { name: "magearna",  displayName: "Magearna",   nationalDex: 801 },
  { name: "zamazenta", displayName: "Zamazenta",  nationalDex: 889 },
  { name: "urshifu",   displayName: "Urshifu",    nationalDex: 892 },
  { name: "kommo-o",   displayName: "Kommo-o",    nationalDex: 784 },
  { name: "sneasler",  displayName: "Sneasler",   nationalDex: 903 },
  { name: "enamorus",  displayName: "Enamorus",   nationalDex: 905 },
  { name: "perrserker",displayName: "Perrserker", nationalDex: 863 },
  // Alternate / regional forms (fetched directly by form name)
  { name: "samurott-hisui",        displayName: "Hisuian Samurott",    nationalDex: 503, isForm: true },
  { name: "typhlosion-hisui",      displayName: "Hisuian Typhlosion",  nationalDex: 157, isForm: true },
  { name: "zapdos-galar",          displayName: "Galarian Zapdos",     nationalDex: 145, isForm: true },
  { name: "moltres-galar",         displayName: "Galarian Moltres",    nationalDex: 146, isForm: true },
  { name: "ninetales-alola",       displayName: "Alolan Ninetales",    nationalDex: 38,  isForm: true },
  { name: "calyrex-ice",           displayName: "Calyrex (Ice Rider)", nationalDex: 898, isForm: true },
  { name: "calyrex-shadow",        displayName: "Calyrex-Shadow",      nationalDex: 898, isForm: true },
  { name: "urshifu-rapid-strike",  displayName: "Urshifu Rapid Strike",nationalDex: 892, isForm: true },
  { name: "mimikyu",               displayName: "Mimikyu",             nationalDex: 778, isForm: false },
];

interface PokedexResponse {
  pokemon_entries: {
    entry_number: number;
    pokemon_species: { name: string; url: string };
  }[];
}

interface SpeciesResponse {
  id: number;
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
  gender_rate: number;
  egg_groups: { name: string }[];
  habitat: { name: string } | null;
  generation: { name: string };
  color: { name: string };
  growth_rate: { name: string };
  base_happiness: number | null;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  evolution_chain: { url: string };
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

interface PokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
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

// Preferred game versions for flavor text (newest first)
const FLAVOR_TEXT_VERSION_PRIORITY = [
  "scarlet", "violet",
  "sword", "shield",
  "sun", "moon",
  "ultra-sun", "ultra-moon",
  "x", "y",
  "black-2", "white-2",
  "black", "white",
];

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
  // Species data (pre-cached from pokemon-species endpoint)
  isLegendary: boolean;
  isMythical: boolean;
  captureRate: number;
  genderRate: number;
  eggGroups: string[];
  habitat: string | null;
  generation: string;
  color: string;
  growthRate: string;
  baseHappiness: number;
  flavorText: string;
  evolutionChainId: number;
  // Pokemon data
  baseExperience: number | null;
  // Alternate forms (sprites use pokemonId)
  formVariants: { name: string; id: number }[];
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

function extractChainId(url: string): number {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? parseInt(m[1]) : 0;
}

function getBestFlavorText(entries: SpeciesResponse["flavor_text_entries"]): string {
  const en = entries.filter((e) => e.language.name === "en");
  for (const version of FLAVOR_TEXT_VERSION_PRIORITY) {
    const entry = en.find((e) => e.version.name === version);
    if (entry) {
      return entry.flavor_text
        .replace(/\f/g, " ")
        .replace(/\u00ad/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
  }
  return en[0]?.flavor_text
    .replace(/\f/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .trim() ?? "";
}

/** Fetch IDs for non-default form varieties (up to 8 forms). */
async function fetchFormVariants(
  varieties: SpeciesResponse["varieties"]
): Promise<{ name: string; id: number }[]> {
  const nonDefault = varieties.filter((v) => !v.is_default).slice(0, 8);
  const results: { name: string; id: number }[] = [];
  for (const v of nonDefault) {
    try {
      const pokemon = await fetchApi<PokemonResponse>(v.pokemon.url);
      const displayName = v.pokemon.name
        .split("-")
        .slice(1)
        .map(capitalize)
        .join(" ") || v.pokemon.name;
      results.push({ name: displayName, id: pokemon.id });
    } catch {
      // skip if form fetch fails
    }
  }
  return results;
}

async function fetchPokedex(id: number): Promise<PokedexResponse> {
  return fetchApi<PokedexResponse>(`/pokedex/${id}/`);
}

/** Fetch a Pokémon directly by its form/pokemon name (for regional variants). */
async function fetchPokemonByForm(
  formName: string,
  displayName: string,
  nationalDex: number,
  pokedex: string
): Promise<OutputPokemon | null> {
  try {
    const pokemon = await fetchApi<PokemonResponse>(`/pokemon/${formName}/`);

    // Also fetch species data using the nationalDex
    let speciesData: SpeciesResponse | null = null;
    try {
      speciesData = await fetchApi<SpeciesResponse>(`/pokemon-species/${nationalDex}/`);
    } catch {
      // species might not be available for all forms
    }

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
      dexNumber: nationalDex,
      nationalDex,
      name: displayName,
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
      // Species data (from species endpoint if available)
      isLegendary: speciesData?.is_legendary ?? false,
      isMythical: speciesData?.is_mythical ?? false,
      captureRate: speciesData?.capture_rate ?? 0,
      genderRate: speciesData?.gender_rate ?? -1,
      eggGroups: speciesData?.egg_groups.map((eg) => capitalize(eg.name)) ?? [],
      habitat: speciesData?.habitat?.name ?? null,
      generation: speciesData?.generation.name.replace("generation-", "").toUpperCase() ?? "",
      color: speciesData?.color.name ?? "",
      growthRate: speciesData?.growth_rate.name ?? "",
      baseHappiness: speciesData?.base_happiness ?? 0,
      flavorText: speciesData ? getBestFlavorText(speciesData.flavor_text_entries) : "",
      evolutionChainId: speciesData ? extractChainId(speciesData.evolution_chain.url) : 0,
      baseExperience: pokemon.base_experience,
      formVariants: speciesData ? await fetchFormVariants(speciesData.varieties) : [],
    };
  } catch (err) {
    console.error(`\n  ⚠ Failed to fetch form ${formName}: ${err}`);
    return null;
  }
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
      // Species data
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      captureRate: species.capture_rate,
      genderRate: species.gender_rate,
      eggGroups: species.egg_groups.map((eg) => capitalize(eg.name)),
      habitat: species.habitat?.name ?? null,
      generation: species.generation.name.replace("generation-", "").toUpperCase(),
      color: species.color.name,
      growthRate: species.growth_rate.name,
      baseHappiness: species.base_happiness ?? 0,
      flavorText: getBestFlavorText(species.flavor_text_entries),
      evolutionChainId: extractChainId(species.evolution_chain.url),
      baseExperience: pokemon.base_experience,
      formVariants: await fetchFormVariants(species.varieties),
    };
  } catch (err) {
    console.error(`\n  ⚠ Failed to fetch ${speciesName}: ${err}`);
    return null;
  }
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

  // Fetch extra raid Pokémon not covered by Paldea Pokédexes
  console.log(`\n📖 Fetching ${EXTRA_RAID_POKEMON.length} extra raid Pokémon...`);
  for (const extra of EXTRA_RAID_POKEMON) {
    if (seen.has(extra.name)) {
      console.log(`  ↩ Skipping ${extra.displayName} (already fetched)`);
      continue;
    }
    seen.add(extra.name);

    let result: OutputPokemon | null;
    if (extra.isForm) {
      result = await fetchPokemonByForm(
        extra.name,
        extra.displayName,
        extra.nationalDex,
        "raid-extra"
      );
    } else {
      result = await fetchPokemonData(extra.name, extra.nationalDex, "raid-extra");
      // Override auto-generated name with the display name
      if (result) result.name = extra.displayName;
    }

    if (result) {
      allPokemon.push(result);
      console.log(`  ✓ ${extra.displayName}`);
    }
  }

  allPokemon.sort((a, b) => a.nationalDex - b.nationalDex);

  const outPath = path.join(__dirname, "../src/data/generated/pokemon.json");
  writeJsonFile(outPath, allPokemon);

  console.log(`\n✅ Total: ${allPokemon.length} Pokémon fetched`);
}

main().catch(console.error);
