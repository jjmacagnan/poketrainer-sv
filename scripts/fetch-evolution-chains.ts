/**
 * Fetches evolution chains for Gen 9 Pokémon from PokéAPI.
 * Used for EV Pokedex — showing evolution paths and methods.
 * Strategy: fetch all Gen 9 species, get their evolution chain IDs,
 * then fetch each unique chain.
 * Outputs: src/data/generated/evolution-chains.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface SpeciesResponse {
  name: string;
  evolution_chain: { url: string };
}

interface EvolutionDetail {
  item: { name: string } | null;
  trigger: { name: string };
  gender: number | null;
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  known_move_type: { name: string } | null;
  location: { name: string } | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: { name: string } | null;
  party_type: { name: string } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: { name: string } | null;
  turn_upside_down: boolean;
}

interface ChainLink {
  is_baby: boolean;
  species: { name: string };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

interface EvolutionChainResponse {
  id: number;
  baby_trigger_item: { name: string } | null;
  chain: ChainLink;
}

interface OutputEvolutionDetail {
  item: string | null;
  trigger: string;
  gender: number | null;
  heldItem: string | null;
  knownMove: string | null;
  knownMoveType: string | null;
  location: string | null;
  minLevel: number | null;
  minHappiness: number | null;
  needsOverworldRain: boolean;
  partySpecies: string | null;
  partyType: string | null;
  turnUpsideDown: boolean;
  timeOfDay: string;
}

interface OutputChainLink {
  isBaby: boolean;
  species: string;
  evolutionDetails: OutputEvolutionDetail[];
  evolvesTo: OutputChainLink[];
}

interface OutputEvolutionChain {
  id: number;
  babyTriggerItem: string | null;
  chain: OutputChainLink;
}


function simplifyEvolutionDetail(detail: EvolutionDetail): OutputEvolutionDetail {
  return {
    item: detail.item?.name || null,
    trigger: detail.trigger.name,
    gender: detail.gender,
    heldItem: detail.held_item?.name || null,
    knownMove: detail.known_move?.name || null,
    knownMoveType: detail.known_move_type?.name || null,
    location: detail.location?.name || null,
    minLevel: detail.min_level,
    minHappiness: detail.min_happiness,
    needsOverworldRain: detail.needs_overworld_rain,
    partySpecies: detail.party_species?.name || null,
    partyType: detail.party_type?.name || null,
    turnUpsideDown: detail.turn_upside_down,
    timeOfDay: detail.time_of_day,
  };
}

function simplifyChainLink(link: ChainLink): OutputChainLink {
  return {
    isBaby: link.is_baby,
    species: link.species.name,
    evolutionDetails: link.evolution_details.map(simplifyEvolutionDetail),
    evolvesTo: link.evolves_to.map(simplifyChainLink),
  };
}

async function fetchEvolutionChain(id: number): Promise<OutputEvolutionChain> {
  const data = await fetchApi<EvolutionChainResponse>(`/evolution-chain/${id}/`);
  return {
    id: data.id,
    babyTriggerItem: data.baby_trigger_item?.name || null,
    chain: simplifyChainLink(data.chain),
  };
}

async function main() {
  console.log("🔄 Fetching Gen 9 evolution chains from PokéAPI...\n");

  // Get all Gen 9 species (generation/9)
  interface GenerationResponse {
    pokemon_species: { name: string; url: string }[];
  }

  const gen9 = await fetchApi<GenerationResponse>("/generation/9/");
  console.log(`  Found ${gen9.pokemon_species.length} Gen 9 species`);

  // Fetch each species to get its evolution chain URL
  console.log("  Fetching species data to find evolution chain IDs...");

  const speciesData = await fetchBatch(
    gen9.pokemon_species,
    async (ref: { name: string; url: string }) => {
      const species = await fetchApi<SpeciesResponse>(ref.url);
      return { name: species.name, chainUrl: species.evolution_chain.url };
    },
    "species"
  );

  // Extract unique evolution chain IDs
  const chainIds = new Set<number>();
  for (const s of speciesData) {
    const match = s.chainUrl.match(/\/evolution-chain\/(\d+)\//);
    if (match) {
      chainIds.add(parseInt(match[1]));
    }
  }

  const sortedIds = Array.from(chainIds).sort((a, b) => a - b);
  console.log(`  Found ${sortedIds.length} unique evolution chains`);

  const chains = await fetchBatch(sortedIds, fetchEvolutionChain, "chains");

  const outPath = path.join(
    __dirname,
    "../src/data/generated/evolution-chains.json"
  );
  writeJsonFile(outPath, chains);

  console.log(`\n✅ ${chains.length} evolution chains fetched`);
}

main().catch(console.error);
