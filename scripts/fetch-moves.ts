/**
 * Fetches moves learnable by Gen 9 Pokémon from PokéAPI.
 * Strategy: fetch the Gen 9 generation endpoint to get the move list,
 * then fetch each move's details.
 * Outputs: src/data/generated/moves.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface GenerationResponse {
  moves: { name: string; url: string }[];
}

interface MoveResponse {
  id: number;
  name: string;
  type: { name: string };
  damage_class: { name: string };
  power: number | null;
  pp: number | null;
  accuracy: number | null;
  priority: number;
  effect_chance: number | null;
  effect_entries: { short_effect: string; effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

interface OutputMove {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  pp: number | null;
  accuracy: number | null;
  priority: number;
  effect: string;
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

async function fetchMove(moveRef: {
  name: string;
  url: string;
}): Promise<OutputMove> {
  const data = await fetchApi<MoveResponse>(moveRef.url);
  
  let effect = "";
  const enEffect = data.effect_entries?.find((e) => e.language.name === "en");
  if (enEffect) {
    effect = enEffect.short_effect || enEffect.effect || "";
  } else {
    const enFlavor = data.flavor_text_entries?.find((e) => e.language.name === "en");
    if (enFlavor) {
      effect = enFlavor.flavor_text.replace(/\n|\f/g, " ");
    }
  }

  if (effect && data.effect_chance) {
    effect = effect.replace(/\$effect_chance/g, data.effect_chance.toString());
  }

  return {
    id: data.id,
    name: formatName(data.name),
    type: capitalize(data.type.name),
    category: capitalize(data.damage_class.name),
    power: data.power,
    pp: data.pp,
    accuracy: data.accuracy,
    priority: data.priority,
    effect: effect,
  };
}

async function main() {
  console.log("🔄 Fetching Gen 9 moves from PokéAPI...\n");

  // Generation 9 = generation/9
  const gen9 = await fetchApi<GenerationResponse>("/generation/9/");
  console.log(`  Found ${gen9.moves.length} moves introduced in Gen 9`);

  // Also fetch all moves that exist (Gen 9 Pokémon can learn moves from older gens)
  // But for the Raid Builder, Gen 9 + popular older moves is enough.
  // Let's fetch Gen 9 new moves + top moves from all gens by fetching move list
  console.log("  Fetching full move list for cross-gen coverage...");

  interface MoveListResponse {
    count: number;
    results: { name: string; url: string }[];
  }

  // Fetch all moves (paginated, up to ~1000)
  const allMovesResp = await fetchApi<MoveListResponse>(
    "/move/?limit=1000&offset=0"
  );
  console.log(`  Total moves in API: ${allMovesResp.count}`);

  // Fetch remaining if any
  let allMoveRefs = [...allMovesResp.results];
  if (allMovesResp.count > 1000) {
    const page2 = await fetchApi<MoveListResponse>(
      `/move/?limit=1000&offset=1000`
    );
    allMoveRefs = [...allMoveRefs, ...page2.results];
  }

  // Filter out moves with id > 10000 (variant/special moves)
  // and only keep moves up to ~id 920ish (Gen 9 cap)
  const filteredRefs = allMoveRefs.filter((m) => {
    const idMatch = m.url.match(/\/move\/(\d+)\//);
    if (!idMatch) return false;
    const id = parseInt(idMatch[1]);
    return id <= 920;
  });

  console.log(`  Fetching ${filteredRefs.length} moves (id ≤ 920)...`);

  const moves = await fetchBatch(filteredRefs, fetchMove, "moves");

  // Sort by id
  moves.sort((a, b) => a.id - b.id);

  const outPath = path.join(__dirname, "../src/data/generated/moves.json");
  writeJsonFile(outPath, moves);

  console.log(`\n✅ ${moves.length} moves fetched`);
}

main().catch(console.error);
