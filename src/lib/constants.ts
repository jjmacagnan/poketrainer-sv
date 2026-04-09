export const MAX_EV_PER_STAT = 252;
export const MAX_EV_TOTAL = 510;
export const MAX_IV = 31;
export const MAX_LEVEL = 100;

export const STAT_NAMES = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"] as const;
export type StatName = (typeof STAT_NAMES)[number];

export const STAT_LABELS: Record<StatName, string> = {
  HP: "HP",
  Atk: "Attack",
  Def: "Defense",
  SpA: "Sp. Atk",
  SpD: "Sp. Def",
  Spe: "Speed",
};
