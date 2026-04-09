import { MAX_EV_PER_STAT, MAX_EV_TOTAL } from "./constants";
import type { StatName } from "./constants";

export interface EVModifiers {
  pokerus: boolean;
  powerItem: StatName | null; // which stat the Power Item boosts
  machoBrace: boolean;
}

const POWER_ITEM_BONUS = 8;
const VITAMIN_AMOUNT = 10;

/**
 * Calculate EVs gained from a single KO.
 *
 * Formula:
 *   EVs = (base_yield + power_item_bonus) × multiplier
 *
 * - Power Item: +8 to the corresponding stat (stacks with Pokérus)
 * - Macho Brace: 2× total (stacks with Pokérus for 4×, but NOT used with Power Items)
 * - Pokérus: 2× total
 */
export function calculateEVGain(
  baseYield: { stat: StatName; amount: number }[],
  modifiers: EVModifiers
): { stat: StatName; amount: number }[] {
  const gains: { stat: StatName; amount: number }[] = [];

  for (const { stat, amount } of baseYield) {
    let total = amount;

    // Power Item adds +8 to its specific stat
    if (modifiers.powerItem === stat) {
      total += POWER_ITEM_BONUS;
    }

    // Macho Brace doubles (only when NOT using a Power Item)
    if (modifiers.machoBrace && !modifiers.powerItem) {
      total *= 2;
    }

    // Pokérus doubles everything
    if (modifiers.pokerus) {
      total *= 2;
    }

    gains.push({ stat, amount: total });
  }

  // Power Item also gives EVs for its stat even if the defeated Pokémon
  // doesn't yield that stat
  if (modifiers.powerItem) {
    const alreadyHasStat = gains.some((g) => g.stat === modifiers.powerItem);
    if (!alreadyHasStat) {
      let bonus = POWER_ITEM_BONUS;
      if (modifiers.pokerus) bonus *= 2;
      gains.push({ stat: modifiers.powerItem, amount: bonus });
    }
  }

  return gains;
}

/**
 * Clamp EV values to respect per-stat and total limits.
 */
export function clampEVs(
  evs: Record<StatName, number>,
  stat: StatName,
  delta: number
): Record<StatName, number> {
  const result = { ...evs };
  const currentTotal = Object.values(result).reduce((a, b) => a + b, 0);
  const currentStat = result[stat];

  let newValue = currentStat + delta;

  // Clamp per-stat
  newValue = Math.max(0, Math.min(MAX_EV_PER_STAT, newValue));

  // Clamp total
  const newTotal = currentTotal - currentStat + newValue;
  if (newTotal > MAX_EV_TOTAL) {
    newValue -= newTotal - MAX_EV_TOTAL;
  }

  newValue = Math.max(0, newValue);
  result[stat] = newValue;
  return result;
}

export { VITAMIN_AMOUNT, POWER_ITEM_BONUS };
