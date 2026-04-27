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

export const SHINY_RECIPES: SandwichRecipe[] = [
  // Standard recipes — 1 ingrediente + 2x Salty Herba = Sparkling Lv.3 + Encounter Lv.3 + Title Lv.3
  { name: "Shiny Normal",    type: "Normal",   ingredients: ["Chorizo x1"],            condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Normal Lv.3",   "Encounter Power: Normal Lv.3",   "Title Power: Normal Lv.3"],   herba: ["Salty", "Salty"] },
  { name: "Shiny Fire",      type: "Fire",     ingredients: ["Red Bell Pepper x1"],    condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Fire Lv.3",     "Encounter Power: Fire Lv.3",     "Title Power: Fire Lv.3"],     herba: ["Salty", "Salty"] },
  { name: "Shiny Fire (VGC)",type: "Fire",     ingredients: ["Basil x1"],              condiments: ["Salty Herba Mystica x1", "Sweet Herba Mystica x1"], powers: ["Sparkling Power: Fire Lv.3",     "Encounter Power: Fire Lv.3",     "Title Power: Fire Lv.3"],     herba: ["Salty", "Sweet"] },
  { name: "Shiny Water",     type: "Water",    ingredients: ["Cucumber x1"],           condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Water Lv.3",    "Encounter Power: Water Lv.3",    "Title Power: Water Lv.3"],    herba: ["Salty", "Salty"] },
  { name: "Shiny Electric",  type: "Electric", ingredients: ["Yellow Bell Pepper x1"], condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Electric Lv.3", "Encounter Power: Electric Lv.3", "Title Power: Electric Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Grass",     type: "Grass",    ingredients: ["Lettuce x1"],            condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Grass Lv.3",    "Encounter Power: Grass Lv.3",    "Title Power: Grass Lv.3"],    herba: ["Salty", "Salty"] },
  { name: "Shiny Ice",       type: "Ice",      ingredients: ["Klawf Stick x1"],        condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Ice Lv.3",      "Encounter Power: Ice Lv.3",      "Title Power: Ice Lv.3"],      herba: ["Salty", "Salty"] },
  { name: "Shiny Fighting",  type: "Fighting", ingredients: ["Pickle x1"],             condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Fighting Lv.3", "Encounter Power: Fighting Lv.3", "Title Power: Fighting Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Poison",             type: "Poison",   ingredients: ["Sliced Green Pepper x1"], condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Poison Lv.3", "Encounter Power: Poison Lv.3", "Title Power: Poison Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Poison (Noodles)",   type: "Poison",   ingredients: ["Noodles x1"],             condiments: ["Salty Herba Mystica x2"], powers: ["Sparkling Power: Poison Lv.3", "Encounter Power: Poison Lv.3", "Title Power: Poison Lv.3"], herba: ["Salty", "Salty"] },
  { name: "Shiny Ground",    type: "Ground",   ingredients: ["Ham x1"],                condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Ground Lv.3",   "Encounter Power: Ground Lv.3",   "Title Power: Ground Lv.3"],   herba: ["Salty", "Salty"] },
  { name: "Shiny Flying",    type: "Flying",   ingredients: ["Prosciutto x1"],         condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Flying Lv.3",   "Encounter Power: Flying Lv.3",   "Title Power: Flying Lv.3"],   herba: ["Salty", "Salty"] },
  { name: "Shiny Psychic",   type: "Psychic",  ingredients: ["Onion x1"],              condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Psychic Lv.3",  "Encounter Power: Psychic Lv.3",  "Title Power: Psychic Lv.3"],  herba: ["Salty", "Salty"] },
  { name: "Shiny Bug",       type: "Bug",      ingredients: ["Cherry Tomatoes x1"],    condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Bug Lv.3",      "Encounter Power: Bug Lv.3",      "Title Power: Bug Lv.3"],      herba: ["Salty", "Salty"] },
  // Rock usa Salty+Sour pois Bacon tem valores de sabor que conflitam com 2x Salty
  { name: "Shiny Rock",      type: "Rock",     ingredients: ["Bacon x1"],              condiments: ["Salty Herba Mystica x1", "Sour Herba Mystica x1"], powers: ["Sparkling Power: Rock Lv.3",   "Encounter Power: Rock Lv.3",     "Title Power: Rock Lv.3"],     herba: ["Salty", "Sour"] },
  { name: "Shiny Rock (VGC)",type: "Rock",     ingredients: ["Jalapeno x1"],           condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Rock Lv.3",     "Encounter Power: Rock Lv.3",     "Title Power: Rock Lv.3"],     herba: ["Salty", "Salty"] },
  { name: "Shiny Ghost",     type: "Ghost",    ingredients: ["Red Onion x1"],          condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Ghost Lv.3",    "Encounter Power: Ghost Lv.3",    "Title Power: Ghost Lv.3"],    herba: ["Salty", "Salty"] },
  { name: "Shiny Dragon",    type: "Dragon",   ingredients: ["Avocado x1"],            condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Dragon Lv.3",   "Encounter Power: Dragon Lv.3",   "Title Power: Dragon Lv.3"],   herba: ["Salty", "Salty"] },
  { name: "Shiny Dark",      type: "Dark",     ingredients: ["Smoked Fillet x1"],      condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Dark Lv.3",     "Encounter Power: Dark Lv.3",     "Title Power: Dark Lv.3"],     herba: ["Salty", "Salty"] },
  { name: "Shiny Steel",     type: "Steel",    ingredients: ["Hamburger x1"],          condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Steel Lv.3",    "Encounter Power: Steel Lv.3",    "Title Power: Steel Lv.3"],    herba: ["Salty", "Salty"] },
  { name: "Shiny Fairy",     type: "Fairy",    ingredients: ["Tomato x1"],             condiments: ["Salty Herba Mystica x2"],                       powers: ["Sparkling Power: Fairy Lv.3",    "Encounter Power: Fairy Lv.3",    "Title Power: Fairy Lv.3"],    herba: ["Salty", "Salty"] },

  // Sweet x2 — 3º poder: Egg Power Lv.3 (ótimo para shiny hunt + breeding simultâneo)
  { name: "Shiny Fire (Sweet)",     type: "Fire",     ingredients: ["Basil x1"],            condiments: ["Sweet Herba Mystica x2"], powers: ["Sparkling Power: Fire Lv.3",     "Encounter Power: Fire Lv.3",     "Egg Power Lv.3"], herba: ["Sweet", "Sweet"] },
  { name: "Shiny Grass (Sweet)",    type: "Grass",    ingredients: ["Lettuce x1"],          condiments: ["Sweet Herba Mystica x2"], powers: ["Sparkling Power: Grass Lv.3",    "Encounter Power: Grass Lv.3",    "Egg Power Lv.3"], herba: ["Sweet", "Sweet"] },
  { name: "Shiny Water (Sweet)",    type: "Water",    ingredients: ["Cucumber x1"],         condiments: ["Sweet Herba Mystica x2"], powers: ["Sparkling Power: Water Lv.3",    "Encounter Power: Water Lv.3",    "Egg Power Lv.3"], herba: ["Sweet", "Sweet"] },
  { name: "Shiny Normal (Sweet)",   type: "Normal",   ingredients: ["Chorizo x1"],          condiments: ["Sweet Herba Mystica x2"], powers: ["Sparkling Power: Normal Lv.3",   "Encounter Power: Normal Lv.3",   "Egg Power Lv.3"], herba: ["Sweet", "Sweet"] },

  // Bitter x2 — 3º poder: Raid Power Lv.3 (shiny hunt + bônus em Tera Raids)
  { name: "Shiny Dragon (Bitter)",  type: "Dragon",   ingredients: ["Avocado x1"],          condiments: ["Bitter Herba Mystica x2"], powers: ["Sparkling Power: Dragon Lv.3",  "Encounter Power: Dragon Lv.3",  "Raid Power: Dragon Lv.3"],   herba: ["Bitter", "Bitter"] },
  { name: "Shiny Electric (Bitter)",type: "Electric", ingredients: ["Yellow Bell Pepper x1"],condiments: ["Bitter Herba Mystica x2"], powers: ["Sparkling Power: Electric Lv.3","Encounter Power: Electric Lv.3","Raid Power: Electric Lv.3"], herba: ["Bitter", "Bitter"] },
  { name: "Shiny Ghost (Bitter)",   type: "Ghost",    ingredients: ["Red Onion x1"],        condiments: ["Bitter Herba Mystica x2"], powers: ["Sparkling Power: Ghost Lv.3",   "Encounter Power: Ghost Lv.3",   "Raid Power: Ghost Lv.3"],    herba: ["Bitter", "Bitter"] },
  { name: "Shiny Steel (Bitter)",   type: "Steel",    ingredients: ["Hamburger x1"],        condiments: ["Bitter Herba Mystica x2"], powers: ["Sparkling Power: Steel Lv.3",   "Encounter Power: Steel Lv.3",   "Raid Power: Steel Lv.3"],    herba: ["Bitter", "Bitter"] },

  // Sour x2 — 3º poder: Teensy Power Lv.3 (Pokémon menores são mais fáceis de ver)
  { name: "Shiny Ice (Sour)",       type: "Ice",      ingredients: ["Klawf Stick x1"],      condiments: ["Sour Herba Mystica x2"],   powers: ["Sparkling Power: Ice Lv.3",      "Encounter Power: Ice Lv.3",      "Teensy Power: Ice Lv.3"],      herba: ["Sour", "Sour"] },
  { name: "Shiny Fighting (Sour)",  type: "Fighting", ingredients: ["Pickle x1"],           condiments: ["Sour Herba Mystica x2"],   powers: ["Sparkling Power: Fighting Lv.3", "Encounter Power: Fighting Lv.3", "Teensy Power: Fighting Lv.3"], herba: ["Sour", "Sour"] },

  // Spicy x2 — 3º poder: Humungo Power Lv.3 (Pokémon maiores são mais fáceis de ver)
  { name: "Shiny Normal (Spicy)",   type: "Normal",   ingredients: ["Chorizo x1"],          condiments: ["Spicy Herba Mystica x2"],  powers: ["Sparkling Power: Normal Lv.3",   "Encounter Power: Normal Lv.3",   "Humungo Power: Normal Lv.3"],  herba: ["Spicy", "Spicy"] },
  { name: "Shiny Dark (Spicy)",     type: "Dark",     ingredients: ["Smoked Fillet x1"],    condiments: ["Spicy Herba Mystica x2"],  powers: ["Sparkling Power: Dark Lv.3",     "Encounter Power: Dark Lv.3",     "Humungo Power: Dark Lv.3"],    herba: ["Spicy", "Spicy"] },
];

export const ENCOUNTER_RECIPES: SandwichRecipe[] = [
  // Receitas rápidas sem Herba Mystica — 2x mesmo ingrediente + Salt = Encounter [Tipo] Lv.2
  { name: "Encounter Normal Lv.2",   type: "Normal",   ingredients: ["Chorizo x1",             "Chorizo x1"],            condiments: ["Salt x1"], powers: ["Encounter Power: Normal Lv.2"],   herba: [] },
  { name: "Encounter Fire Lv.2",     type: "Fire",     ingredients: ["Red Bell Pepper x1",     "Red Bell Pepper x1"],    condiments: ["Salt x1"], powers: ["Encounter Power: Fire Lv.2"],     herba: [] },
  { name: "Encounter Water Lv.2",    type: "Water",    ingredients: ["Cucumber x1",            "Cucumber x1"],           condiments: ["Salt x1"], powers: ["Encounter Power: Water Lv.2"],    herba: [] },
  { name: "Encounter Electric Lv.2", type: "Electric", ingredients: ["Yellow Bell Pepper x1",  "Yellow Bell Pepper x1"], condiments: ["Salt x1"], powers: ["Encounter Power: Electric Lv.2"], herba: [] },
  { name: "Encounter Grass Lv.2",    type: "Grass",    ingredients: ["Lettuce x1",             "Lettuce x1"],            condiments: ["Salt x1"], powers: ["Encounter Power: Grass Lv.2"],    herba: [] },
  { name: "Encounter Ice Lv.2",      type: "Ice",      ingredients: ["Klawf Stick x1",         "Klawf Stick x1"],        condiments: ["Salt x1"], powers: ["Encounter Power: Ice Lv.2"],      herba: [] },
  { name: "Encounter Fighting Lv.2", type: "Fighting", ingredients: ["Pickle x1",              "Pickle x1"],             condiments: ["Salt x1"], powers: ["Encounter Power: Fighting Lv.2"], herba: [] },
  { name: "Encounter Poison Lv.2",   type: "Poison",   ingredients: ["Sliced Green Pepper x1", "Sliced Green Pepper x1"],condiments: ["Salt x1"], powers: ["Encounter Power: Poison Lv.2"],   herba: [] },
  { name: "Encounter Ground Lv.2",   type: "Ground",   ingredients: ["Ham x1",                 "Ham x1"],                condiments: ["Salt x1"], powers: ["Encounter Power: Ground Lv.2"],   herba: [] },
  { name: "Encounter Flying Lv.2",   type: "Flying",   ingredients: ["Prosciutto x1",          "Prosciutto x1"],         condiments: ["Salt x1"], powers: ["Encounter Power: Flying Lv.2"],   herba: [] },
  { name: "Encounter Psychic Lv.2",  type: "Psychic",  ingredients: ["Onion x1",               "Onion x1"],              condiments: ["Salt x1"], powers: ["Encounter Power: Psychic Lv.2"],  herba: [] },
  { name: "Encounter Bug Lv.2",      type: "Bug",      ingredients: ["Cherry Tomatoes x1",     "Cherry Tomatoes x1"],    condiments: ["Salt x1"], powers: ["Encounter Power: Bug Lv.2"],      herba: [] },
  { name: "Encounter Rock Lv.2",     type: "Rock",     ingredients: ["Bacon x1",               "Bacon x1"],              condiments: ["Salt x1"], powers: ["Encounter Power: Rock Lv.2"],     herba: [] },
  { name: "Encounter Ghost Lv.2",    type: "Ghost",    ingredients: ["Red Onion x1",           "Red Onion x1"],          condiments: ["Salt x1"], powers: ["Encounter Power: Ghost Lv.2"],    herba: [] },
  { name: "Encounter Dragon Lv.2",   type: "Dragon",   ingredients: ["Avocado x1",             "Avocado x1"],            condiments: ["Salt x1"], powers: ["Encounter Power: Dragon Lv.2"],   herba: [] },
  { name: "Encounter Dark Lv.2",     type: "Dark",     ingredients: ["Smoked Fillet x1",       "Smoked Fillet x1"],      condiments: ["Salt x1"], powers: ["Encounter Power: Dark Lv.2"],     herba: [] },
  { name: "Encounter Steel Lv.2",    type: "Steel",    ingredients: ["Hamburger x1",           "Hamburger x1"],          condiments: ["Salt x1"], powers: ["Encounter Power: Steel Lv.2"],    herba: [] },
  { name: "Encounter Fairy Lv.2",    type: "Fairy",    ingredients: ["Tomato x1",              "Tomato x1"],             condiments: ["Salt x1"], powers: ["Encounter Power: Fairy Lv.2"],    herba: [] },
];

export const ALL_RECIPES = [...SHINY_RECIPES, ...ENCOUNTER_RECIPES];
