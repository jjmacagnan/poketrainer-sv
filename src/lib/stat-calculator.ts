import type { StatName } from "./constants";

/**
 * Gen 9 stat formula.
 *
 * HP = floor((2 × Base + IV + floor(EV/4)) × Level / 100) + Level + 10
 * Other = floor((floor((2 × Base + IV + floor(EV/4)) × Level / 100) + 5) × NatureModifier)
 */
export function calculateStat(params: {
  stat: StatName;
  base: number;
  iv: number;
  ev: number;
  level: number;
  natureModifier: number; // 1.1, 0.9, or 1.0
}): number {
  const { stat, base, iv, ev, level, natureModifier } = params;
  const evBonus = Math.floor(ev / 4);

  if (stat === "HP") {
    // Shedinja special case
    if (base === 1) return 1;
    return (
      Math.floor(((2 * base + iv + evBonus) * level) / 100) + level + 10
    );
  }

  return Math.floor(
    (Math.floor(((2 * base + iv + evBonus) * level) / 100) + 5) *
      natureModifier
  );
}

export function getNatureModifier(
  stat: StatName,
  increased: string | null,
  decreased: string | null
): number {
  if (stat === increased) return 1.1;
  if (stat === decreased) return 0.9;
  return 1.0;
}
