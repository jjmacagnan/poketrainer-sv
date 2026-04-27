import type { PokemonType } from "./types";

export interface SandwichRecipe {
  name: string;
  type: PokemonType;
  ingredients: string[];
  condiments: string[];
  powers: string[];
  herba: string[];
}

export const MEAL_POWERS = [
  "Encounter", "Sparkling", "Title", "Humungo", "Teensy",
  "Egg", "Item Drop", "Raid", "Catching", "Exp. Point",
] as const;

export const HERBA_MYSTICA = ["Sweet", "Salty", "Sour", "Bitter", "Spicy"] as const;

export const HERBA_FARM_INFO: Record<string, string> = {
  Sweet:  "5★ & 6★ Tera Raids — drop raro; qualquer raid 5★+ pode dropar qualquer Herba Mystica",
  Salty:  "5★ & 6★ Tera Raids — drop raro; qualquer raid 5★+ pode dropar qualquer Herba Mystica",
  Sour:   "5★ & 6★ Tera Raids — drop raro; qualquer raid 5★+ pode dropar qualquer Herba Mystica",
  Bitter: "5★ & 6★ Tera Raids — drop raro; qualquer raid 5★+ pode dropar qualquer Herba Mystica",
  Spicy:  "5★ & 6★ Tera Raids — drop raro; qualquer raid 5★+ pode dropar qualquer Herba Mystica",
};
