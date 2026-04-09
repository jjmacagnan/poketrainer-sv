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
  Sweet: "5★ & 6★ Tera Raids — mais comum em raids de tipo Normal, Water, Grass",
  Salty: "5★ & 6★ Tera Raids — mais comum em raids de tipo Rock, Steel, Ice",
  Sour: "5★ & 6★ Tera Raids — mais comum em raids de tipo Poison, Ground, Fighting",
  Bitter: "5★ & 6★ Tera Raids — mais comum em raids de tipo Dragon, Psychic, Ghost",
  Spicy: "5★ & 6★ Tera Raids — mais comum em raids de tipo Fire, Electric, Dark",
};

export const SHINY_RECIPES: SandwichRecipe[] = [
  { name: "Shiny Normal", type: "Normal", ingredients: ["Chorizo x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Normal Lv.3", "Encounter Power: Normal Lv.3", "Title Power: Normal Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Fire", type: "Fire", ingredients: ["Red Pepper x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Fire Lv.3", "Encounter Power: Fire Lv.3", "Title Power: Fire Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Water", type: "Water", ingredients: ["Cucumber x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Water Lv.3", "Encounter Power: Water Lv.3", "Title Power: Water Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Electric", type: "Electric", ingredients: ["Yellow Pepper x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Electric Lv.3", "Encounter Power: Electric Lv.3", "Title Power: Electric Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Grass", type: "Grass", ingredients: ["Lettuce x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Grass Lv.3", "Encounter Power: Grass Lv.3", "Title Power: Grass Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Ice", type: "Ice", ingredients: ["Klawf Stick x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Ice Lv.3", "Encounter Power: Ice Lv.3", "Title Power: Ice Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Fighting", type: "Fighting", ingredients: ["Pickle x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Fighting Lv.3", "Encounter Power: Fighting Lv.3", "Title Power: Fighting Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Poison", type: "Poison", ingredients: ["Green Pepper x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Poison Lv.3", "Encounter Power: Poison Lv.3", "Title Power: Poison Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Ground", type: "Ground", ingredients: ["Ham x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Ground Lv.3", "Encounter Power: Ground Lv.3", "Title Power: Ground Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Flying", type: "Flying", ingredients: ["Prosciutto x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Flying Lv.3", "Encounter Power: Flying Lv.3", "Title Power: Flying Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Psychic", type: "Psychic", ingredients: ["Onion x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Psychic Lv.3", "Encounter Power: Psychic Lv.3", "Title Power: Psychic Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Bug", type: "Bug", ingredients: ["Cherry Tomato x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Bug Lv.3", "Encounter Power: Bug Lv.3", "Title Power: Bug Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Rock", type: "Rock", ingredients: ["Jalapeno x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Rock Lv.3", "Encounter Power: Rock Lv.3", "Title Power: Rock Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Ghost", type: "Ghost", ingredients: ["Red Onion x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Ghost Lv.3", "Encounter Power: Ghost Lv.3", "Title Power: Ghost Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Dragon", type: "Dragon", ingredients: ["Avocado x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Dragon Lv.3", "Encounter Power: Dragon Lv.3", "Title Power: Dragon Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Dark", type: "Dark", ingredients: ["Smoked Fillet x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Dark Lv.3", "Encounter Power: Dark Lv.3", "Title Power: Dark Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Steel", type: "Steel", ingredients: ["Hamburger x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Steel Lv.3", "Encounter Power: Steel Lv.3", "Title Power: Steel Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Fairy", type: "Fairy", ingredients: ["Tomato x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Fairy Lv.3", "Encounter Power: Fairy Lv.3", "Title Power: Fairy Lv.3"], herba: ["Salty", "Salty"] },
  // Alternative herba recipes
  { name: "Shiny Fire (Sweet)", type: "Fire", ingredients: ["Basil x1"], condiments: ["Sweet Herba Mystica x2"], powers: ["Sparkling Power: Fire Lv.3", "Encounter Power: Fire Lv.3", "Egg Power: Fire Lv.3"], herba: ["Sweet", "Sweet"] },
  { name: "Shiny Grass (Sweet)", type: "Grass", ingredients: ["Lettuce x1"], condiments: ["Sweet Herba Mystica x2"], powers: ["Sparkling Power: Grass Lv.3", "Encounter Power: Grass Lv.3", "Egg Power: Grass Lv.3"], herba: ["Sweet", "Sweet"] },
  { name: "Shiny Dragon (Bitter)", type: "Dragon", ingredients: ["Avocado x1"], condiments: ["Bitter Herba Mystica x2"], powers: ["Sparkling Power: Dragon Lv.3", "Encounter Power: Dragon Lv.3", "Raid Power: Dragon Lv.3"], herba: ["Bitter", "Bitter"] },
];

export const ENCOUNTER_RECIPES: SandwichRecipe[] = [
  { name: "Encounter Normal Lv.2", type: "Normal", ingredients: ["Chorizo x1", "Chorizo x1"], condiments: ["Salt"], powers: ["Encounter Power: Normal Lv.2"], herba: [] },
  { name: "Encounter Fire Lv.2", type: "Fire", ingredients: ["Red Pepper x1", "Red Pepper x1"], condiments: ["Salt"], powers: ["Encounter Power: Fire Lv.2"], herba: [] },
  { name: "Encounter Water Lv.2", type: "Water", ingredients: ["Cucumber x1", "Cucumber x1"], condiments: ["Salt"], powers: ["Encounter Power: Water Lv.2"], herba: [] },
  { name: "Encounter Grass Lv.2", type: "Grass", ingredients: ["Lettuce x1", "Lettuce x1"], condiments: ["Salt"], powers: ["Encounter Power: Grass Lv.2"], herba: [] },
];

export const ALL_RECIPES = [...SHINY_RECIPES, ...ENCOUNTER_RECIPES];
