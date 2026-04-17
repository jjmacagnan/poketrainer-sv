import { MAX_EV_PER_STAT, MAX_EV_TOTAL } from "./constants";
import type { StatName } from "./constants";

export interface EVModifiers {
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
 * - Power Item: +8 to the corresponding stat
 * - Macho Brace: 2× total (NOT used with Power Items)
 */
export function calculateEVGain(
  baseYield: { stat: StatName; amount: number }[],
  modifiers: EVModifiers
): { stat: StatName; amount: number }[] {
  const gains: { stat: StatName; amount: number }[] = [];

  for (const { stat, amount } of baseYield) {
    let total = amount;

    if (modifiers.powerItem === stat) {
      total += POWER_ITEM_BONUS;
    }

    if (modifiers.machoBrace && !modifiers.powerItem) {
      total *= 2;
    }

    gains.push({ stat, amount: total });
  }

  if (modifiers.powerItem) {
    const alreadyHasStat = gains.some((g) => g.stat === modifiers.powerItem);
    if (!alreadyHasStat) {
      gains.push({ stat: modifiers.powerItem, amount: POWER_ITEM_BONUS });
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
