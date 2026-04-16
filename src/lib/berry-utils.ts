/**
 * Maps sandwich ingredient names (from sandwich-recipes.ts) to berry data.
 * The ingredient names don't directly match berry names, so this is a manual
 * mapping based on game logic (Scarlet/Violet sandwich ingredients → berries).
 *
 * Each ingredient maps to a berry name and its dominant flavor profile.
 */

import berriesData from "@/data/generated/berries.json";
import berryFlavorsData from "@/data/generated/berry-flavors.json";

interface Berry {
  id: number;
  name: string;
  growthTime: number;
  maxHarvest: number;
  naturalGiftPower: number;
  size: number;
  smoothness: number;
  soilDryness: number;
  firmness: string;
  flavors: Record<string, number>;
  item: string;
  naturalGiftType: string;
}

interface BerryFlavor {
  id: number;
  name: string;
  contestType: string;
  localizedName: string;
  berries: { potency: number; berry: string }[];
}

const berries = berriesData as Berry[];
const flavors = berryFlavorsData as BerryFlavor[];

/** Lookup berry by name */
export function getBerry(name: string): Berry | undefined {
  return berries.find((b) => b.name === name);
}

/** Get all berries sorted by flavor potency for a given flavor */
export function getBerriesByFlavor(
  flavorName: string,
  minPotency = 0
): { berry: Berry; potency: number }[] {
  const flavor = flavors.find((f) => f.name === flavorName);
  if (!flavor) return [];
  return flavor.berries
    .filter((b) => b.potency >= minPotency)
    .reduce<{ berry: Berry; potency: number }[]>((acc, b) => {
      const berry = berries.find((br) => br.name === b.berry);
      if (berry) acc.push({ berry, potency: b.potency });
      return acc;
    }, [])
    .sort((a, b) => b.potency - a.potency);
}

/** Get the dominant flavor of a berry */
export function getDominantFlavor(berryName: string): string | null {
  const berry = getBerry(berryName);
  if (!berry) return null;
  let maxFlavor = "";
  let maxPotency = 0;
  for (const [flavor, potency] of Object.entries(berry.flavors)) {
    if (potency > maxPotency) {
      maxPotency = potency;
      maxFlavor = flavor;
    }
  }
  return maxPotency > 0 ? maxFlavor : null;
}

/** Get all 5 flavor names */
export function getAllFlavors(): string[] {
  return flavors.map((f) => f.name);
}

/** Get flavor display info */
export function getFlavorInfo(flavorName: string): BerryFlavor | undefined {
  return flavors.find((f) => f.name === flavorName);
}

/** Get berry flavor summary for all berries */
export function getBerryFlavorSummary(berryName: string): Record<string, number> {
  const berry = getBerry(berryName);
  return berry ? berry.flavors : {};
}
