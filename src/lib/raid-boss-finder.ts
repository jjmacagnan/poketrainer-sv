import movesData from "@/data/generated/moves.json";
import typesData from "@/data/generated/types.json";
import type { RaidTierEntry } from "@/data/raid-tier-list";
import {
  PHYSICAL_DEFENSIVE_COUNTER_MOVES,
  RAID_DAMAGE_SETUP_MOVES,
  SPECIAL_DEFENSIVE_COUNTER_MOVES,
  type BossAttackCategory,
} from "@/data/raid-boss-categories";
import type { PokemonType } from "@/data/types";

interface Move {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  pp: number | null;
  accuracy: number | null;
  priority: number;
  target: string;
  tm: number | null;
  effect?: string;
}

export interface BossRecommendation {
  entry: RaidTierEntry;
  score: number;
  seMovesForBoss: string[];
  seMoveTypesForBoss: Record<string, PokemonType>;
  counterMovesForBoss: string[];
  setupMovesForBoss: string[];
  bestBuildIndex: number;
}

const allMoves = movesData as Move[];
const allTypesData = typesData as {
  name: string;
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}[];
const VARIABLE_POWER_DAMAGING_MOVES = new Set(["Low Kick"]);

function normalizeLookupName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findMoveByName(name: string) {
  const normalized = normalizeLookupName(name);
  return allMoves.find((m) => normalizeLookupName(m.name) === normalized);
}

function isDamagingMove(move: Move | undefined) {
  return Boolean(
    move &&
      move.category.toLowerCase() !== "status" &&
      ((move.power !== null && move.power > 0) || VARIABLE_POWER_DAMAGING_MOVES.has(move.name)),
  );
}

function getEffectiveMoveType(
  buildData: RaidTierEntry["builds"][number],
  moveData: Move,
): PokemonType {
  return (buildData.effectiveMoveTypes?.[moveData.name] ?? moveData.type) as PokemonType;
}

export function getBossRecommendations(
  tierEntries: RaidTierEntry[],
  bossTeraType: string,
  bossStars: number | null,
  bossAttackCategory: BossAttackCategory | null,
  maxResults = 6,
): BossRecommendation[] {
  const bossTypeData = allTypesData.find(
    (td) => td.name.toLowerCase() === bossTeraType.toLowerCase(),
  );
  const bossWeaknesses = new Set(
    (bossTypeData?.weaknesses ?? []).map((w) => w.toLowerCase()),
  );

  return tierEntries
    .map((entry) => {
      let bestBuildIndex = 0;
      let bestScore = -1;
      let seMovesForBoss: string[] = [];
      let seMoveTypesForBoss: Record<string, PokemonType> = {};
      let counterMovesForBoss: string[] = [];
      let setupMovesForBoss: string[] = [];

      entry.builds.forEach((buildData, idx) => {
        const seMoves: string[] = [];
        const seMoveTypes: Record<string, PokemonType> = {};
        const counterMoves: string[] = [];
        const setupMoves: string[] = [];

        for (const moveName of buildData.moves) {
          const moveData = findMoveByName(moveName);
          if (moveData && isDamagingMove(moveData)) {
            const effectiveMoveType = getEffectiveMoveType(buildData, moveData);
            if (bossWeaknesses.has(effectiveMoveType.toLowerCase())) {
              seMoves.push(moveName);
              seMoveTypes[moveName] = effectiveMoveType;
            }
          }
          if (RAID_DAMAGE_SETUP_MOVES.has(moveName)) {
            setupMoves.push(moveName);
          }
          if (
            bossAttackCategory === "physical" &&
            PHYSICAL_DEFENSIVE_COUNTER_MOVES.has(moveName)
          ) {
            counterMoves.push(moveName);
          }
          if (
            bossAttackCategory === "special" &&
            SPECIAL_DEFENSIVE_COUNTER_MOVES.has(moveName)
          ) {
            counterMoves.push(moveName);
          }
          if (bossAttackCategory === "both") {
            if (
              PHYSICAL_DEFENSIVE_COUNTER_MOVES.has(moveName) ||
              SPECIAL_DEFENSIVE_COUNTER_MOVES.has(moveName)
            ) {
              counterMoves.push(moveName);
            }
          }
        }

        const buildScore =
          seMoves.length * 2 +
          counterMoves.length * 0.75 +
          (seMoves.length > 0 ? setupMoves.length * 0.25 : 0);
        if (buildScore > bestScore) {
          bestScore = buildScore;
          bestBuildIndex = idx;
          seMovesForBoss = seMoves;
          seMoveTypesForBoss = seMoveTypes;
          counterMovesForBoss = counterMoves;
          setupMovesForBoss = setupMoves;
        }
      });

      let score =
        seMovesForBoss.length * 2 +
        counterMovesForBoss.length * 0.75 +
        (seMovesForBoss.length > 0 ? setupMovesForBoss.length * 0.25 : 0);
      if (entry.tags.includes("Top Pick")) score += 1;
      if (entry.tags.includes("Solo Viable")) score += 1;
      if (entry.tags.includes("7★ Ready") && bossStars === 7) score += 1;
      if (entry.tags.includes("Budget Pick")) score += 0.5;

      return {
        entry,
        score,
        seMovesForBoss,
        seMoveTypesForBoss,
        counterMovesForBoss,
        setupMovesForBoss,
        bestBuildIndex,
      };
    })
    .filter((r) => r.seMovesForBoss.length > 0 || r.counterMovesForBoss.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
