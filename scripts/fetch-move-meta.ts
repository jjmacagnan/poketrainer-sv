/**
 * Fetches move meta data from PokéAPI.
 * Complements existing moves.json with detailed battle mechanics:
 * drain, healing, crit_rate, flinch_chance, stat_chance, ailments, categories.
 * Used for Raid Builder — calculating DPS and move utility.
 * Outputs: src/data/generated/move-meta.json
 */

import { fetchApi, fetchBatch, writeJsonFile } from "./api-helper";
import path from "path";

interface MoveMetaResponse {
  id: number;
  name: string;
  meta: {
    ailment: { name: string } | null;
    category: { name: string; description: string } | null;
    min_hits: number | null;
    max_hits: number | null;
    min_turns: number | null;
    max_turns: number | null;
    drain: number;
    healing: number;
    crit_rate: number;
    ailment_chance: number;
    flinch_chance: number;
    stat_chance: number;
  } | null;
  stat_changes: { change: number; stat: { name: string } }[];
  past_values: { accuracy: number | null; power: number | null }[];
}

interface OutputMoveMeta {
  id: number;
  name: string;
  meta: {
    ailment: string | null;
    category: string | null;
    categoryDescription: string | null;
    minHits: number | null;
    maxHits: number | null;
    minTurns: number | null;
    maxTurns: number | null;
    drain: number;
    healing: number;
    critRate: number;
    ailmentChance: number;
    flinchChance: number;
    statChance: number;
  } | null;
  statChanges: { change: number; stat: string }[];
}


async function fetchMoveMeta(id: number): Promise<OutputMoveMeta> {
  const data = await fetchApi<MoveMetaResponse>(`/move/${id}/`);

  let metaOutput: OutputMoveMeta["meta"] = null;
  if (data.meta) {
    metaOutput = {
      ailment: data.meta.ailment?.name || null,
      category: data.meta.category?.name || null,
      categoryDescription: data.meta.category?.description || null,
      minHits: data.meta.min_hits,
      maxHits: data.meta.max_hits,
      minTurns: data.meta.min_turns,
      maxTurns: data.meta.max_turns,
      drain: data.meta.drain,
      healing: data.meta.healing,
      critRate: data.meta.crit_rate,
      ailmentChance: data.meta.ailment_chance,
      flinchChance: data.meta.flinch_chance,
      statChance: data.meta.stat_chance,
    };
  }

  return {
    id: data.id,
    name: data.name,
    meta: metaOutput,
    statChanges: data.stat_changes.map((sc) => ({
      change: sc.change,
      stat: sc.stat.name,
    })),
  };
}

async function main() {
  console.log("🔄 Fetching move meta data from PokéAPI...\n");

  // Get all moves (paginated)
  interface MoveListResponse {
    count: number;
    results: { name: string; url: string }[];
  }

  const allMovesResp = await fetchApi<MoveListResponse>(
    "/move/?limit=1000&offset=0"
  );

  let allMoveRefs = [...allMovesResp.results];
  if (allMovesResp.count > 1000) {
    const page2 = await fetchApi<MoveListResponse>(
      `/move/?limit=1000&offset=1000`
    );
    allMoveRefs = [...allMoveRefs, ...page2.results];
  }

  // Filter: only moves with id <= 920 (Gen 9 cap), skip variants
  const filteredRefs = allMoveRefs
    .map((m) => {
      const idMatch = m.url.match(/\/move\/(\d+)\//);
      return idMatch ? { id: parseInt(idMatch[1]), ref: m } : null;
    })
    .filter((x): x is { id: number; ref: { name: string; url: string } } =>
      x !== null && x.id <= 920
    );

  console.log(`  Fetching meta for ${filteredRefs.length} moves (id ≤ 920)...`);

  const moveMetas = await fetchBatch(
    filteredRefs.map((x) => x.id),
    fetchMoveMeta,
    "move-meta"
  );

  const outPath = path.join(
    __dirname,
    "../src/data/generated/move-meta.json"
  );
  writeJsonFile(outPath, moveMetas);

  console.log(`\n✅ ${moveMetas.length} move metas fetched`);
}

main().catch(console.error);
