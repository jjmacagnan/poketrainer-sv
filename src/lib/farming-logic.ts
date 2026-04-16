import pokemonData from "@/data/generated/pokemon.json";
import { StatName } from "@/lib/constants";
import { TRAINING_LOCATIONS, TrainingLocation } from "@/data/training-locations";

interface PokemonEntry {
  name: string;
  sprite: string;
  evYield: { stat: string; amount: number }[];
}

export interface EnhancedFarmingTarget {
  name: string;
  sprite: string;
  yieldAmount: number;
  location?: TrainingLocation;
}

const allPokemon = pokemonData as PokemonEntry[];

/**
 * Returns a list of Pokémon that yield the specified stat, 
 * prioritized by yield amount and manual location availability.
 */
export function getBestTrainingTargets(stat: StatName): EnhancedFarmingTarget[] {
  return allPokemon
    .filter((p) => p.evYield.some((y) => y.stat === stat))
    .map((p) => {
      const yieldEntry = p.evYield.find((y) => y.stat === stat);
      return {
        name: p.name,
        sprite: p.sprite,
        yieldAmount: yieldEntry?.amount || 0,
        location: TRAINING_LOCATIONS[p.name],
      };
    })
    // Sort by: 
    // 1. Has manual location (most reliable)
    // 2. Yield amount (highest first)
    // 3. Name
    .sort((a, b) => {
      if (a.location && !b.location) return -1;
      if (!a.location && b.location) return 1;
      if (b.yieldAmount !== a.yieldAmount) return b.yieldAmount - a.yieldAmount;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10); // Return top 10 targets
}
