/**
 * Sandwich Guide — multi-recipe entries per type, based on community-verified recipes
 * Sources: Serebii.net, Smogon, Reddit r/PokemonScarletViolet
 *
 * Structure mirrors raid-tier-list.ts: each TypeEntry has at least one recipe
 * (index 0 = recommended), plus optional alternatives.
 */

import type { PokemonType } from "./types";
import type { SandwichRecipe } from "./sandwich-recipes";

export interface SandwichGuideEntry {
  type: PokemonType;
  /** At least one recipe required; index 0 is always the primary/recommended. */
  recipes: [SandwichRecipe, ...SandwichRecipe[]];
}

export type UtilityRecipeGoal = "egg" | "raid" | "encounter" | "catching" | "item-drop" | "shiny";

export interface UtilitySandwichRecipe extends SandwichRecipe {
  goal: UtilityRecipeGoal;
  note: string;
}

export interface MassOutbreakRecipe {
  type: PokemonType;
  ingredients: string[];
  condiments: string[];
  powers: string[];
  note: string;
}

// ─── Shiny Hunting (Sparkling Power Lv.3) ────────────────────────────────────
// Primary recipes are the "optimal" (fewest ingredients) from community sources.
// Alternatives use different Herba Mystica combos for flexibility.

export const SHINY_GUIDE: SandwichGuideEntry[] = [
  {
    type: "Normal",
    recipes: [
      {
        name: "Tofu Sandwich (Optimal)",
        type: "Normal",
        ingredients: ["Tofu x1"],
        condiments: ["Salty Herba Mystica x1", "Sour Herba Mystica x1"],
        powers: ["Sparkling Power: Normal Lv.3", "Encounter Power: Normal Lv.3", "Title Power: Normal Lv.3"],
        herba: ["Salty", "Sour"],
      },
      {
        name: "Chorizo Sandwich (Alt.)",
        type: "Normal",
        ingredients: ["Chorizo x1"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Normal Lv.3", "Encounter Power: Normal Lv.3", "Title Power: Normal Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Fire",
    recipes: [
      {
        name: "Red Bell Pepper Sandwich (Optimal)",
        type: "Fire",
        ingredients: ["Red Bell Pepper x1"],
        condiments: ["Salty Herba Mystica x1", "Spicy Herba Mystica x1"],
        powers: ["Sparkling Power: Fire Lv.3", "Encounter Power: Fire Lv.3", "Title Power: Fire Lv.3"],
        herba: ["Salty", "Spicy"],
      },
      {
        name: "Basil Sandwich (Sweet)",
        type: "Fire",
        ingredients: ["Basil x1"],
        condiments: ["Sweet Herba Mystica x2"],
        powers: ["Sparkling Power: Fire Lv.3", "Encounter Power: Fire Lv.3", "Egg Power Lv.3"],
        herba: ["Sweet", "Sweet"],
      },
      {
        name: "Basil Sandwich (VGC)",
        type: "Fire",
        ingredients: ["Basil x1"],
        condiments: ["Salty Herba Mystica x1", "Sweet Herba Mystica x1"],
        powers: ["Sparkling Power: Fire Lv.3", "Encounter Power: Fire Lv.3", "Title Power: Fire Lv.3"],
        herba: ["Salty", "Sweet"],
      },
    ],
  },
  {
    type: "Water",
    recipes: [
      {
        name: "Cucumber Sandwich (Optimal)",
        type: "Water",
        ingredients: ["Cucumber x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Water Lv.3", "Encounter Power: Water Lv.3", "Title Power: Water Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Electric",
    recipes: [
      {
        name: "Yellow Bell Pepper Sandwich (Optimal)",
        type: "Electric",
        ingredients: ["Yellow Bell Pepper x1"],
        condiments: ["Salty Herba Mystica x1", "Spicy Herba Mystica x1"],
        powers: ["Sparkling Power: Electric Lv.3", "Encounter Power: Electric Lv.3", "Title Power: Electric Lv.3"],
        herba: ["Salty", "Spicy"],
      },
    ],
  },
  {
    type: "Grass",
    recipes: [
      {
        name: "Lettuce Sandwich (Optimal)",
        type: "Grass",
        ingredients: ["Lettuce x1"],
        condiments: ["Salty Herba Mystica x1", "Sour Herba Mystica x1"],
        powers: ["Sparkling Power: Grass Lv.3", "Encounter Power: Grass Lv.3", "Title Power: Grass Lv.3"],
        herba: ["Salty", "Sour"],
      },
      {
        name: "Lettuce Sandwich (Sweet)",
        type: "Grass",
        ingredients: ["Lettuce x1"],
        condiments: ["Sweet Herba Mystica x2"],
        powers: ["Sparkling Power: Grass Lv.3", "Encounter Power: Grass Lv.3", "Egg Power Lv.3"],
        herba: ["Sweet", "Sweet"],
      },
    ],
  },
  {
    type: "Ice",
    recipes: [
      {
        name: "Klawf Stick Sandwich (Optimal)",
        type: "Ice",
        ingredients: ["Klawf Stick x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Ice Lv.3", "Encounter Power: Ice Lv.3", "Title Power: Ice Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Fighting",
    recipes: [
      {
        name: "Pickle Sandwich (Optimal)",
        type: "Fighting",
        ingredients: ["Pickle x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Fighting Lv.3", "Encounter Power: Fighting Lv.3", "Title Power: Fighting Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Poison",
    recipes: [
      {
        name: "Green Bell Pepper Sandwich (Optimal)",
        type: "Poison",
        ingredients: ["Green Bell Pepper x1"],
        condiments: ["Salty Herba Mystica x1", "Spicy Herba Mystica x1"],
        powers: ["Sparkling Power: Poison Lv.3", "Encounter Power: Poison Lv.3", "Title Power: Poison Lv.3"],
        herba: ["Salty", "Spicy"],
      },
      {
        name: "Noodles Sandwich (VGC)",
        type: "Poison",
        ingredients: ["Noodles x1"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Poison Lv.3", "Encounter Power: Poison Lv.3", "Title Power: Poison Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Ground",
    recipes: [
      {
        name: "Ham Sandwich (Optimal)",
        type: "Ground",
        ingredients: ["Ham x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Ground Lv.3", "Encounter Power: Ground Lv.3", "Title Power: Ground Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Flying",
    recipes: [
      {
        name: "Prosciutto Sandwich (Optimal)",
        type: "Flying",
        ingredients: ["Prosciutto x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Flying Lv.3", "Encounter Power: Flying Lv.3", "Title Power: Flying Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Psychic",
    recipes: [
      {
        name: "Onion Sandwich (Optimal)",
        type: "Psychic",
        ingredients: ["Onion x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Psychic Lv.3", "Encounter Power: Psychic Lv.3", "Title Power: Psychic Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Bug",
    recipes: [
      {
        name: "Cherry Tomatoes Sandwich (Optimal)",
        type: "Bug",
        ingredients: ["Cherry Tomatoes x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Bug Lv.3", "Encounter Power: Bug Lv.3", "Title Power: Bug Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Rock",
    recipes: [
      {
        name: "Bacon Sandwich (Optimal)",
        type: "Rock",
        ingredients: ["Bacon x1"],
        condiments: ["Salty Herba Mystica x1", "Sour Herba Mystica x1"],
        powers: ["Sparkling Power: Rock Lv.3", "Encounter Power: Rock Lv.3", "Title Power: Rock Lv.3"],
        herba: ["Salty", "Sour"],
      },
      {
        name: "Jalapeno Sandwich (VGC)",
        type: "Rock",
        ingredients: ["Jalapeno x1"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Rock Lv.3", "Encounter Power: Rock Lv.3", "Title Power: Rock Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Ghost",
    recipes: [
      {
        name: "Red Onion Sandwich (Optimal)",
        type: "Ghost",
        ingredients: ["Red Onion x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Ghost Lv.3", "Encounter Power: Ghost Lv.3", "Title Power: Ghost Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
  {
    type: "Dragon",
    recipes: [
      {
        name: "Avocado Sandwich (Optimal)",
        type: "Dragon",
        ingredients: ["Avocado x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Dragon Lv.3", "Encounter Power: Dragon Lv.3", "Title Power: Dragon Lv.3"],
        herba: ["Salty", "Salty"],
      },
      {
        name: "Avocado Sandwich (Bitter)",
        type: "Dragon",
        ingredients: ["Avocado x2"],
        condiments: ["Bitter Herba Mystica x2"],
        powers: ["Sparkling Power: Dragon Lv.3", "Encounter Power: Dragon Lv.3", "Raid Power: Dragon Lv.3"],
        herba: ["Bitter", "Bitter"],
      },
    ],
  },
  {
    type: "Dark",
    recipes: [
      {
        name: "Smoked Fillet Sandwich (Optimal)",
        type: "Dark",
        ingredients: ["Smoked Fillet x1"],
        condiments: ["Salty Herba Mystica x1", "Sweet Herba Mystica x1"],
        powers: ["Sparkling Power: Dark Lv.3", "Encounter Power: Dark Lv.3", "Title Power: Dark Lv.3"],
        herba: ["Salty", "Sweet"],
      },
    ],
  },
  {
    type: "Steel",
    recipes: [
      {
        name: "Hamburger Sandwich (Optimal)",
        type: "Steel",
        ingredients: ["Hamburger x1"],
        condiments: ["Salty Herba Mystica x1", "Sweet Herba Mystica x1"],
        powers: ["Sparkling Power: Steel Lv.3", "Encounter Power: Steel Lv.3", "Title Power: Steel Lv.3"],
        herba: ["Salty", "Sweet"],
      },
    ],
  },
  {
    type: "Fairy",
    recipes: [
      {
        name: "Tomato Sandwich (Optimal)",
        type: "Fairy",
        ingredients: ["Tomato x2"],
        condiments: ["Salty Herba Mystica x2"],
        powers: ["Sparkling Power: Fairy Lv.3", "Encounter Power: Fairy Lv.3", "Title Power: Fairy Lv.3"],
        herba: ["Salty", "Salty"],
      },
    ],
  },
];

// ─── Mass Outbreak Shiny Hunting ─────────────────────────────────────────────
// These prioritize Sparkling Power during outbreaks, where Encounter Power is
// less important because the target species is already spawning in bulk.

export const MASS_OUTBREAK_GUIDE: MassOutbreakRecipe[] = [
  {
    type: "Bug",
    ingredients: ["Cherry Tomatoes x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Bug Lv.3"],
    note: "Use during Bug-type mass outbreaks.",
  },
  {
    type: "Dark",
    ingredients: ["Smoked Fillet x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Dark Lv.3"],
    note: "Use during Dark-type mass outbreaks.",
  },
  {
    type: "Dragon",
    ingredients: ["Avocado x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Dragon Lv.3"],
    note: "Use during Dragon-type mass outbreaks.",
  },
  {
    type: "Electric",
    ingredients: ["Yellow Bell Pepper x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Electric Lv.3"],
    note: "Use during Electric-type mass outbreaks.",
  },
  {
    type: "Fairy",
    ingredients: ["Tomato x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Fairy Lv.3"],
    note: "Use during Fairy-type mass outbreaks.",
  },
  {
    type: "Fighting",
    ingredients: ["Pickle x2", "Potato Tortilla x2", "Strawberry x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Fighting Lv.3"],
    note: "Use any one listed ingredient pair during Fighting-type mass outbreaks.",
  },
  {
    type: "Fire",
    ingredients: ["Red Bell Pepper x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Fire Lv.3"],
    note: "Use during Fire-type mass outbreaks.",
  },
  {
    type: "Flying",
    ingredients: ["Egg x2", "Apple x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Flying Lv.3"],
    note: "Use either listed ingredient pair during Flying-type mass outbreaks.",
  },
  {
    type: "Ghost",
    ingredients: ["Red Onion x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Ghost Lv.3"],
    note: "Use during Ghost-type mass outbreaks.",
  },
  {
    type: "Grass",
    ingredients: ["Lettuce x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Grass Lv.3"],
    note: "Use during Grass-type mass outbreaks.",
  },
  {
    type: "Ground",
    ingredients: ["Ham x2", "Pineapple x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Ground Lv.3"],
    note: "Use either listed ingredient pair during Ground-type mass outbreaks.",
  },
  {
    type: "Ice",
    ingredients: ["Klawf Stick x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Ice Lv.3"],
    note: "Use during Ice-type mass outbreaks.",
  },
  {
    type: "Normal",
    ingredients: ["Cheese x2", "Banana x2", "Rice x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Normal Lv.3"],
    note: "Use any one listed ingredient pair during Normal-type mass outbreaks.",
  },
  {
    type: "Poison",
    ingredients: ["Noodles x2", "Green Bell Pepper x2", "Kiwi x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Poison Lv.3"],
    note: "Use any one listed ingredient pair during Poison-type mass outbreaks.",
  },
  {
    type: "Psychic",
    ingredients: ["Onion x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Psychic Lv.3"],
    note: "Use during Psychic-type mass outbreaks.",
  },
  {
    type: "Rock",
    ingredients: ["Jalapeno x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Rock Lv.3"],
    note: "Use during Rock-type mass outbreaks.",
  },
  {
    type: "Steel",
    ingredients: ["Hamburger x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Steel Lv.3"],
    note: "Use during Steel-type mass outbreaks.",
  },
  {
    type: "Water",
    ingredients: ["Cucumber x2"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Water Lv.3"],
    note: "Use during Water-type mass outbreaks.",
  },
];

// VGC's flexible shiny list uses larger ingredient stacks and any two Herba.
export const VGC_ANY_HERBA_GUIDE: MassOutbreakRecipe[] = [
  {
    type: "Normal",
    ingredients: ["Hamburger x1", "Cucumber x1", "Smoked Fillet x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Normal Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Fire",
    ingredients: ["Hamburger x1", "Onion x1", "Prosciutto x1", "Red Bell Pepper x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Fire Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Water",
    ingredients: ["Hamburger x1", "Cucumber x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Water Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Grass",
    ingredients: ["Hamburger x1", "Lettuce x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Grass Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Flying",
    ingredients: ["Hamburger x1", "Prosciutto x2", "Rice x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Flying Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Fighting",
    ingredients: ["Hamburger x1", "Pickle x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Fighting Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Poison",
    ingredients: ["Green Bell Pepper x1", "Hamburger x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Poison Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Electric",
    ingredients: ["Hamburger x1", "Prosciutto x1", "Yellow Bell Pepper x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Electric Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Ground",
    ingredients: ["Hamburger x1", "Ham x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Ground Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Rock",
    ingredients: ["Bacon x1", "Hamburger x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Rock Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Psychic",
    ingredients: ["Hamburger x1", "Onion x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Psychic Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Ice",
    ingredients: ["Hamburger x1", "Klawf Stick x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Ice Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Bug",
    ingredients: ["Cherry Tomatoes x1", "Hamburger x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Bug Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Ghost",
    ingredients: ["Hamburger x1", "Prosciutto x1", "Red Onion x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Ghost Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Steel",
    ingredients: ["Hamburger x2", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Steel Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Dragon",
    ingredients: ["Avocado x1", "Hamburger x1", "Prosciutto x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Dragon Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Dark",
    ingredients: ["Hamburger x1", "Prosciutto x1", "Smoked Fillet x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Dark Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
  {
    type: "Fairy",
    ingredients: ["Hamburger x1", "Prosciutto x1", "Tomato x1"],
    condiments: ["Any Herba Mystica x2"],
    powers: ["Sparkling Power: Fairy Lv.3"],
    note: "VGC flexible shiny recipe.",
  },
];

// ─── Encounter (No Herba / Best Spots) ────────────────────────────────────────
// Sandwiches for boosting wild encounter rates. Sorted by Encounter Power level.

export const ENCOUNTER_GUIDE: SandwichGuideEntry[] = [
  {
    type: "Normal",
    recipes: [
      {
        name: "Ultra Curry-and-Rice Sandwich #34",
        type: "Normal",
        ingredients: ["Rice x1", "Jalapeno x1", "Tomato x1"],
        condiments: ["Curry Powder x1", "Mayonnaise x1"],
        powers: ["Encounter Power: Normal Lv.2", "Humungo Power: Grass Lv.2", "Item Drop Power: Fairy Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Fire",
    recipes: [
      {
        name: "Great Pickle Sandwich #21",
        type: "Fire",
        ingredients: ["Pickle x1", "Watercress x1"],
        condiments: ["Olive Oil x1"],
        powers: ["Encounter Power: Fire Lv.1", "Raid Power: Fire Lv.1", "Exp. Point Power: Dragon Lv.1"],
        herba: [],
      },
      {
        name: "Pickle Sandwich #20",
        type: "Fire",
        ingredients: ["Pickle x1"],
        condiments: ["Olive Oil x1"],
        powers: ["Teensy Power: Fighting Lv.1", "Encounter Power: Fire Lv.1", "Catching Power: Ghost Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Water",
    recipes: [
      {
        name: "Vegetable Sandwich #112",
        type: "Water",
        ingredients: ["Green Bell Pepper x1", "Cucumber x1", "Tomato x1"],
        condiments: ["Vinegar x1", "Olive Oil x1", "Salt x1"],
        powers: ["Encounter Power: Water Lv.1", "Item Drop Power: Bug Lv.1", "Exp. Point Power: Grass Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Electric",
    recipes: [
      {
        name: "Avocado Sandwich #44",
        type: "Electric",
        ingredients: ["Avocado x1", "Smoked Fillet x1"],
        condiments: ["Salt x1"],
        powers: ["Encounter Power: Electric Lv.1", "Exp. Point Power: Dark Lv.1", "Catching Power: Flying Lv.1"],
        herba: [],
      },
      {
        name: "Master Klawf Claw Sandwich #107",
        type: "Electric",
        ingredients: ["Klawf Stick x1", "Yellow Bell Pepper x1", "Tomato x1", "Lettuce x1"],
        condiments: ["Spicy Herba Mystica x1", "Olive Oil x1", "Salt x1", "Wasabi x1"],
        powers: ["Encounter Power: Electric Lv.2", "Raid Power: Electric Lv.2", "Exp. Point Power: Ghost Lv.2"],
        herba: ["Spicy"],
      },
    ],
  },
  {
    type: "Grass",
    recipes: [
      {
        name: "Great Klawf Claw Sandwich #105",
        type: "Grass",
        ingredients: ["Klawf Stick x1", "Tomato x1", "Lettuce x1"],
        condiments: ["Olive Oil x1", "Salt x1", "Wasabi x1"],
        powers: ["Encounter Power: Grass Lv.2", "Raid Power: Grass Lv.1", "Exp. Point Power: Bug Lv.1"],
        herba: [],
      },
      {
        name: "Klawf Claw Sandwich #104",
        type: "Grass",
        ingredients: ["Klawf Stick x1", "Tomato x1", "Lettuce x1"],
        condiments: ["Olive Oil x1", "Salt x1"],
        powers: ["Encounter Power: Grass Lv.1", "Item Drop Power: Normal Lv.1", "Exp. Point Power: Water Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Ice",
    recipes: [
      {
        name: "Ultra Sushi Sandwich #150",
        type: "Ice",
        ingredients: ["Rice x1", "Smoked Fillet x2", "Klawf Stick x2", "Watercress x1"],
        condiments: ["Vinegar x1", "Salt x1", "Wasabi x1"],
        powers: ["Encounter Power: Ice Lv.2", "Raid Power: Ice Lv.2", "Exp. Point Power: Water Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Fighting",
    recipes: [
      {
        name: "Great Ham Sandwich #81",
        type: "Fighting",
        ingredients: ["Pickle x1", "Ham x1", "Prosciutto x1"],
        condiments: ["Mayonnaise x1", "Mustard x1"],
        powers: ["Encounter Power: Fighting Lv.2", "Catching Power: Fairy Lv.1", "Exp. Point Power: Ground Lv.1"],
        herba: [],
      },
      {
        name: "Ultra Refreshing Sandwich #70",
        type: "Fighting",
        ingredients: ["Kiwi x1", "Avocado x1", "Pickle x1", "Cherry Tomatoes x1"],
        condiments: ["Marmalade x1", "Salt x1"],
        powers: ["Encounter Power: Fighting Lv.2", "Item Drop Power: Normal Lv.2", "Exp. Point Power: Rock Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Poison",
    recipes: [
      {
        name: "Great Noodle Sandwich #49",
        type: "Poison",
        ingredients: ["Noodles x1", "Lettuce x1"],
        condiments: ["Olive Oil x1", "Ketchup x1"],
        powers: ["Encounter Power: Poison Lv.2", "Item Drop Power: Grass Lv.1", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
      {
        name: "Noodle Sandwich #48",
        type: "Poison",
        ingredients: ["Noodles x1"],
        condiments: ["Olive Oil x1", "Ketchup x1"],
        powers: ["Encounter Power: Poison Lv.1", "Raid Power: Poison Lv.1", "Exp. Point Power: Water Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Ground",
    recipes: [
      {
        name: "Great Herbed-Sausage Sandwich #29",
        type: "Ground",
        ingredients: ["Herbed Sausage x1"],
        condiments: ["Ketchup x1", "Mustard x1"],
        powers: ["Encounter Power: Ground Lv.2", "Item Drop Power: Normal Lv.1", "Raid Power: Bug Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Flying",
    recipes: [
      {
        name: "Ultra Egg Sandwich #62",
        type: "Flying",
        ingredients: ["Egg x1", "Cucumber x1", "Red Onion x1", "Cheese x1"],
        condiments: ["Salt x1", "Mayonnaise x1"],
        powers: ["Encounter Power: Flying Lv.2", "Raid Power: Flying Lv.1", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
      {
        name: "Great Egg Sandwich #61",
        type: "Flying",
        ingredients: ["Egg x1", "Cucumber x1", "Red Onion x1"],
        condiments: ["Salt x1", "Mayonnaise x1"],
        powers: ["Encounter Power: Flying Lv.2", "Catching Power: Steel Lv.1", "Exp. Point Power: Fighting Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Psychic",
    recipes: [
      {
        name: "Smoky Sandwich #92",
        type: "Psychic",
        ingredients: ["Smoked Fillet x1", "Watercress x1"],
        condiments: ["Vinegar x1", "Pepper x1", "Salt x1"],
        powers: ["Encounter Power: Psychic Lv.1", "Raid Power: Psychic Lv.1", "Exp. Point Power: Ghost Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Bug",
    recipes: [
      {
        name: "Ultra Potato Salad Sandwich #54",
        type: "Bug",
        ingredients: ["Potato Salad x1", "Cucumber x1", "Red Bell Pepper x1", "Avocado x1", "Onion x1"],
        condiments: ["Mayonnaise x1"],
        powers: ["Encounter Power: Bug Lv.2", "Item Drop Power: Poison Lv.1", "Exp. Point Power: Ground Lv.1"],
        herba: [],
      },
      {
        name: "Ultra Variety Sandwich #102",
        type: "Bug",
        ingredients: ["Prosciutto x1", "Cherry Tomatoes x1", "Smoked Fillet x1", "Potato Salad x1", "Hamburger x1"],
        condiments: ["Salt x1", "Vinegar x1"],
        powers: ["Encounter Power: Bug Lv.2", "Raid Power: Bug Lv.2", "Exp. Point Power: Steel Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Rock",
    recipes: [
      {
        name: "Ultra BLT Sandwich #74",
        type: "Rock",
        ingredients: ["Bacon x1", "Lettuce x1", "Tomato x1", "Basil x1", "Cheese x1"],
        condiments: ["Mayonnaise x1", "Mustard x1"],
        powers: ["Encounter Power: Rock Lv.2", "Item Drop Power: Normal Lv.1", "Raid Power: Fairy Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Ghost",
    recipes: [
      {
        name: "Ultra Vegetable Sandwich #114",
        type: "Ghost",
        ingredients: ["Watercress x1", "Green Bell Pepper x1", "Red Onion x1", "Cucumber x1", "Tomato x1"],
        condiments: ["Vinegar x1", "Olive Oil x1", "Salt x1"],
        powers: ["Encounter Power: Ghost Lv.2", "Item Drop Power: Fairy Lv.1", "Exp. Point Power: Bug Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Dragon",
    recipes: [
      {
        name: "Great Avocado Sandwich #45",
        type: "Dragon",
        ingredients: ["Avocado x1", "Smoked Fillet x1", "Tomato x1"],
        condiments: ["Salt x1"],
        powers: ["Encounter Power: Dragon Lv.2", "Catching Power: Fairy Lv.1", "Exp. Point Power: Dark Lv.1"],
        herba: [],
      },
      {
        name: "Great Cheese Sandwich #85",
        type: "Dragon",
        ingredients: ["Cheese x1", "Avocado x1", "Cream Cheese x1"],
        condiments: ["Pepper x1", "Salt x1"],
        powers: ["Encounter Power: Dragon Lv.2", "Raid Power: Water Lv.1", "Exp. Point Power: Electric Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Dark",
    recipes: [
      {
        name: "Ultra Avocado Sandwich #46",
        type: "Dark",
        ingredients: ["Avocado x1", "Smoked Fillet x1", "Tomato x1", "Lettuce x1"],
        condiments: ["Salt x1"],
        powers: ["Encounter Power: Dark Lv.2", "Exp. Point Power: Dark Lv.1", "Catching Power: Flying Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Steel",
    recipes: [
      {
        name: "Ultra Tower Sandwich #146",
        type: "Steel",
        ingredients: ["Hamburger x1", "Noodles x1", "Potato Salad x1", "Rice x1", "Klawf Stick x1", "Tofu x1"],
        condiments: ["Olive Oil x1", "Salt x1", "Curry Powder x1"],
        powers: ["Encounter Power: Steel Lv.2", "Raid Power: Steel Lv.1", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
      {
        name: "Potato Salad Sandwich #52",
        type: "Steel",
        ingredients: ["Potato Salad x1", "Cucumber x1", "Red Bell Pepper x1"],
        condiments: ["Mayonnaise x1"],
        powers: ["Encounter Power: Steel Lv.1", "Item Drop Power: Bug Lv.1", "Exp. Point Power: Ground Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Fairy",
    recipes: [
      {
        name: "Ultra Ham Sandwich #82",
        type: "Fairy",
        ingredients: ["Pickle x1", "Ham x1", "Prosciutto x1", "Jalapeno x1"],
        condiments: ["Mayonnaise x1", "Mustard x1"],
        powers: ["Encounter Power: Fairy Lv.2", "Catching Power: Fairy Lv.1", "Raid Power: Fairy Lv.1"],
        herba: [],
      },
      {
        name: "Ultra Nouveau Veggie Sandwich #126",
        type: "Fairy",
        ingredients: ["Watercress x1", "Wasabi x1", "Yellow Bell Pepper x1", "Onion x1", "Cucumber x1", "Tomato x1"],
        condiments: ["Olive Oil x1", "Mayonnaise x1"],
        powers: ["Encounter Power: Fairy Lv.2", "Item Drop Power: Water Lv.1", "Exp. Point Power: Ice Lv.1"],
        herba: [],
      },
    ],
  },
];

// ─── Raid Power Boosts ─────────────────────────────────────────────────────────
// Sandwiches that increase Raid Power to find specific Tera Raid types.

export const RAID_GUIDE: SandwichGuideEntry[] = [
  {
    type: "Ghost",
    recipes: [
      {
        name: "Ultra Herbed-Sausage Sandwich #30",
        type: "Ghost",
        ingredients: ["Herbed Sausage x1", "Lettuce x1"],
        condiments: ["Ketchup x1", "Mustard x1"],
        powers: ["Raid Power: Ghost Lv.2", "Encounter Power: Ground Lv.2", "Item Drop Power: Bug Lv.1"],
        herba: [],
      },
      {
        name: "Master Smoky Sandwich #95",
        type: "Ghost",
        ingredients: ["Smoked Fillet x1", "Red Onion x1", "Watercress x1"],
        condiments: ["Salty Herba Mystica x1", "Vinegar x1", "Pepper x1", "Salt x1", "Basil x1"],
        powers: ["Raid Power: Ghost Lv.2", "Encounter Power: Psychic Lv.2", "Exp. Point Power: Dark Lv.2"],
        herba: ["Salty"],
      },
    ],
  },
  {
    type: "Bug",
    recipes: [
      {
        name: "Salty Jambon-Beurre #4",
        type: "Bug",
        ingredients: ["Ham x1"],
        condiments: ["Salty Herba Mystica x1", "Butter x1"],
        powers: ["Raid Power: Bug Lv.2", "Encounter Power: Ghost Lv.2", "Title Power: Ground Lv.2"],
        herba: ["Salty"],
      },
      {
        name: "Peanut Butter Sandwich #16",
        type: "Bug",
        ingredients: ["Banana x1"],
        condiments: ["Peanut Butter x1"],
        powers: ["Raid Power: Bug Lv.1", "Egg Power Lv.1", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Water",
    recipes: [
      {
        name: "Master Cheese Sandwich #87",
        type: "Water",
        ingredients: ["Cream Cheese x1", "Avocado x1", "Basil x1", "Cheese x1"],
        condiments: ["Salty Herba Mystica x1", "Pepper x1", "Salt x1"],
        powers: ["Raid Power: Water Lv.2", "Title Power: Dragon Lv.2", "Exp. Point Power: Electric Lv.2"],
        herba: ["Salty"],
      },
    ],
  },
  {
    type: "Dragon",
    recipes: [
      {
        name: "Master Hamburger Patty Sandwich #91",
        type: "Dragon",
        ingredients: ["Hamburger x1", "Onion x1", "Watercress x1", "Horseradish x1"],
        condiments: ["Sweet Herba Mystica x1", "Vinegar x1", "Pepper x1"],
        powers: ["Raid Power: Dragon Lv.2", "Encounter Power: Fighting Lv.2", "Exp. Point Power: Normal Lv.2"],
        herba: ["Sweet"],
      },
      {
        name: "Refreshing Sandwich #68",
        type: "Dragon",
        ingredients: ["Avocado x1", "Cherry Tomatoes x1"],
        condiments: ["Marmalade x1", "Salt x1"],
        powers: ["Raid Power: Dragon Lv.1", "Item Drop Power: Normal Lv.1", "Exp. Point Power: Fighting Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Dark",
    recipes: [
      {
        name: "Ultra Fried Fillet Sandwich #78",
        type: "Dark",
        ingredients: ["Fried Fillet x1", "Potato Salad x1", "Lettuce x1"],
        condiments: ["Ketchup x1", "Mayonnaise x1", "Horseradish x1"],
        powers: ["Raid Power: Dark Lv.2", "Encounter Power: Bug Lv.1", "Item Drop Power: Ground Lv.1"],
        herba: [],
      },
      {
        name: "Fried Fillet Sandwich #76",
        type: "Dark",
        ingredients: ["Fried Fillet x1", "Potato Salad x1"],
        condiments: ["Mayonnaise x1", "Ketchup x1"],
        powers: ["Raid Power: Dark Lv.1", "Encounter Power: Rock Lv.1", "Item Drop Power: Ground Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Fire",
    recipes: [
      {
        name: "Ultra Five-Alarm Sandwich #122",
        type: "Fire",
        ingredients: ["Chorizo x1", "Onion x1", "Green Bell Pepper x1", "Basil x1", "Jalapeno x1"],
        condiments: ["Mustard x1", "Ketchup x1", "Pepper x1"],
        powers: ["Humungo Power: Poison Lv.2", "Raid Power: Fire Lv.2", "Exp. Point Power: Dragon Lv.1"],
        herba: [],
      },
      {
        name: "Great Five-Alarm Sandwich #121",
        type: "Fire",
        ingredients: ["Chorizo x1", "Onion x1", "Green Bell Pepper x1", "Basil x1"],
        condiments: ["Mustard x1", "Chili Sauce x1", "Pepper x1"],
        powers: ["Raid Power: Fire Lv.1", "Encounter Power: Dragon Lv.1", "Exp. Point Power: Rock Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Psychic",
    recipes: [
      {
        name: "Ultra Smoky Sandwich #94",
        type: "Psychic",
        ingredients: ["Smoked Fillet x1", "Watercress x1", "Red Onion x1", "Basil x1"],
        condiments: ["Vinegar x1", "Pepper x1", "Salt x1"],
        powers: ["Raid Power: Psychic Lv.2", "Encounter Power: Psychic Lv.2", "Exp. Point Power: Ghost Lv.1"],
        herba: [],
      },
      {
        name: "Great Smoky Sandwich #93",
        type: "Psychic",
        ingredients: ["Smoked Fillet x1", "Watercress x1", "Red Onion x1"],
        condiments: ["Vinegar x1", "Pepper x1", "Salt x1"],
        powers: ["Raid Power: Psychic Lv.1", "Encounter Power: Psychic Lv.1", "Exp. Point Power: Ghost Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Fighting",
    recipes: [
      {
        name: "Ultra Marmalade Sandwich #26",
        type: "Fighting",
        ingredients: ["Cheese x1", "Butter x1", "Cream Cheese x1"],
        condiments: ["Marmalade x1"],
        powers: ["Raid Power: Fighting Lv.1", "Egg Power Lv.2", "Item Drop Power: Poison Lv.1"],
        herba: [],
      },
      {
        name: "Curry-and-Rice-Style Sandwich #32",
        type: "Fighting",
        ingredients: ["Rice x1"],
        condiments: ["Curry Powder x1", "Mayonnaise x1"],
        powers: ["Raid Power: Fighting Lv.1", "Encounter Power: Normal Lv.1", "Item Drop Power: Fairy Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Normal",
    recipes: [
      {
        name: "Ultra Peanut Butter Sandwich #18",
        type: "Normal",
        ingredients: ["Banana x1", "Butter x1", "Jam x1"],
        condiments: ["Peanut Butter x1"],
        powers: ["Raid Power: Normal Lv.2", "Egg Power Lv.2", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Electric",
    recipes: [
      {
        name: "Ultra Cheese Sandwich #86",
        type: "Electric",
        ingredients: ["Cheese x1", "Avocado x1", "Basil x1", "Cream Cheese x1"],
        condiments: ["Pepper x1", "Salt x1"],
        powers: ["Raid Power: Electric Lv.2", "Encounter Power: Dragon Lv.2", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Fairy",
    recipes: [
      {
        name: "Great BLT Sandwich #73",
        type: "Fairy",
        ingredients: ["Bacon x1", "Lettuce x1", "Tomato x1", "Basil x1"],
        condiments: ["Mayonnaise x1", "Mustard x1"],
        powers: ["Raid Power: Fairy Lv.1", "Encounter Power: Rock Lv.1", "Item Drop Power: Normal Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Ground",
    recipes: [
      {
        name: "Ham Sandwich #80",
        type: "Ground",
        ingredients: ["Pickle x1", "Ham x1"],
        condiments: ["Mayonnaise x1", "Mustard x1"],
        powers: ["Raid Power: Ground Lv.1", "Encounter Power: Normal Lv.1", "Teensy Power: Fighting Lv.1"],
        herba: [],
      },
    ],
  },
  {
    type: "Flying",
    recipes: [
      {
        name: "Sweet Sandwich #108",
        type: "Flying",
        ingredients: ["Banana x1", "Apple x1", "Cheese x1", "Whipped Cream x1"],
        condiments: ["Butter x1"],
        powers: ["Raid Power: Flying Lv.1", "Egg Power Lv.1", "Exp. Point Power: Normal Lv.1"],
        herba: [],
      },
    ],
  },
];

// ─── Utility Picks ────────────────────────────────────────────────────────────
// Cross-category recipes highlighted by external guides for specific goals.

export const UTILITY_RECIPES: UtilitySandwichRecipe[] = [
  {
    name: "Great Peanut Butter Sandwich #17",
    type: "Normal",
    goal: "egg",
    note: "Best low-cost Egg Power Lv.2 pick for breeding sessions.",
    ingredients: ["Banana x1", "Butter x1"],
    condiments: ["Peanut Butter x1"],
    powers: ["Egg Power Lv.2", "Raid Power: Electric Lv.1", "Exp. Point Power: Normal Lv.1"],
    herba: [],
  },
  {
    name: "Ultra Five-Alarm Sandwich #122",
    type: "Fire",
    goal: "raid",
    note: "Fire Raid Power Lv.2 without Herba Mystica.",
    ingredients: ["Chorizo x1", "Onion x1", "Green Bell Pepper x1", "Basil x1", "Jalapeno x1"],
    condiments: ["Mustard x1", "Ketchup x1", "Pepper x1"],
    powers: ["Humungo Power: Poison Lv.2", "Raid Power: Fire Lv.2", "Exp. Point Power: Dragon Lv.1"],
    herba: [],
  },
  {
    name: "Pickle Sandwich #20",
    type: "Fire",
    goal: "encounter",
    note: "Early-game Charcadet helper with Encounter Power: Fire.",
    ingredients: ["Pickle x1"],
    condiments: ["Olive Oil x1"],
    powers: ["Teensy Power: Fighting Lv.1", "Encounter Power: Fire Lv.1", "Catching Power: Ghost Lv.1"],
    herba: [],
  },
  {
    name: "Zesty Sandwich #56",
    type: "Water",
    goal: "encounter",
    note: "Budget Water encounter recipe with no Herba Mystica.",
    ingredients: ["Jalapeno x1", "Onion x1", "Herbed Sausage x1"],
    condiments: ["Chili Sauce x1"],
    powers: ["Humungo Power: Psychic Lv.1", "Exp. Point Power: Fighting Lv.1", "Encounter Power: Water Lv.1"],
    herba: [],
  },
  {
    name: "Great Avocado Sandwich #45",
    type: "Dragon",
    goal: "encounter",
    note: "Dragon Encounter Power Lv.2 for Frigibax/Baxcalibur hunts.",
    ingredients: ["Avocado x1", "Smoked Fillet x1", "Tomato x1"],
    condiments: ["Salt x1"],
    powers: ["Encounter Power: Dragon Lv.2", "Catching Power: Fairy Lv.1", "Exp. Point Power: Dark Lv.1"],
    herba: [],
  },
  {
    name: "Great Potato Salad Sandwich #53",
    type: "Dragon",
    goal: "catching",
    note: "Catching Power: Dragon Lv.2 for Koraidon/Miraidon.",
    ingredients: ["Potato Salad x1", "Cucumber x1", "Red Bell Pepper x1", "Avocado x1"],
    condiments: ["Mayonnaise x1"],
    powers: ["Catching Power: Dragon Lv.2", "Encounter Power: Ghost Lv.1", "Humungo Power: Bug Lv.1"],
    herba: [],
  },
  {
    name: "Ultra Jam Sandwich #14",
    type: "Dark",
    goal: "catching",
    note: "Catching Power: Dark Lv.2 for the Treasures of Ruin.",
    ingredients: ["Strawberry x1", "Pineapple x1"],
    condiments: ["Jam x1", "Yogurt x1"],
    powers: ["Catching Power: Dark Lv.2", "Item Drop Power: Ground Lv.2", "Egg Power Lv.1"],
    herba: [],
  },
];

// ─── Breeding (Egg Power) ──────────────────────────────────────────────────────
// Sandwiches that boost egg production at the Picnic basket.
// Egg Power Lv.2 halves hatch steps; Lv.3 (Herba required) is the fastest.
// Sorted best-first: Lv.3 → Lv.2 → Lv.1.

export const BREEDING_RECIPES: SandwichRecipe[] = [
  // ── Egg Power Lv.3 (requires Herba Mystica) ──
  {
    name: "Jam Sandwich — Egg Power Lv.3",
    type: "Normal",
    ingredients: ["Jam x1"],
    condiments: ["Sweet Herba Mystica x2"],
    powers: ["Egg Power Lv.3", "Raid Power: Normal Lv.2", "Catching Power: Fighting Lv.2"],
    herba: ["Sweet", "Sweet"],
  },
  {
    name: "Basil Sandwich — Egg Power Lv.3 (Fire Shiny combo)",
    type: "Fire",
    ingredients: ["Basil x1"],
    condiments: ["Sweet Herba Mystica x2"],
    powers: ["Egg Power Lv.3", "Sparkling Power: Fire Lv.3", "Encounter Power: Fire Lv.3"],
    herba: ["Sweet", "Sweet"],
  },
  {
    name: "Lettuce Sandwich — Egg Power Lv.3 (Grass Shiny combo)",
    type: "Grass",
    ingredients: ["Lettuce x1"],
    condiments: ["Sweet Herba Mystica x2"],
    powers: ["Egg Power Lv.3", "Sparkling Power: Grass Lv.3", "Encounter Power: Grass Lv.3"],
    herba: ["Sweet", "Sweet"],
  },
  // ── Egg Power Lv.2 (no Herba needed) ──
  {
    name: "Great Peanut Butter Sandwich #17",
    type: "Normal",
    ingredients: ["Banana x1", "Butter x1"],
    condiments: ["Peanut Butter x1"],
    powers: ["Egg Power Lv.2", "Raid Power: Electric Lv.1", "Exp. Point Power: Normal Lv.1"],
    herba: [],
  },
  {
    name: "Great Marmalade Sandwich #25",
    type: "Normal",
    ingredients: ["Cheese x1", "Butter x1"],
    condiments: ["Marmalade x1"],
    powers: ["Egg Power Lv.2", "Raid Power: Rock Lv.1", "Item Drop Power: Poison Lv.1"],
    herba: [],
  },
  {
    name: "Ultra Peanut Butter Sandwich #18",
    type: "Normal",
    ingredients: ["Banana x1", "Butter x1", "Jam x1"],
    condiments: ["Peanut Butter x1"],
    powers: ["Egg Power Lv.2", "Raid Power: Normal Lv.2", "Item Drop Power: Bug Lv.1"],
    herba: [],
  },
  {
    name: "Ultra Marmalade Sandwich #26",
    type: "Normal",
    ingredients: ["Cheese x1", "Butter x1", "Cream Cheese x1"],
    condiments: ["Marmalade x1"],
    powers: ["Egg Power Lv.2", "Raid Power: Fighting Lv.1", "Item Drop Power: Poison Lv.2"],
    herba: [],
  },
  // ── Egg Power Lv.1 (budget options) ──
  {
    name: "Jam Sandwich #12",
    type: "Normal",
    ingredients: ["Jam x1", "Strawberry x1"],
    condiments: [],
    powers: ["Egg Power Lv.1", "Catching Power: Fighting Lv.1", "Item Drop Power: Psychic Lv.1"],
    herba: [],
  },
  {
    name: "Peanut Butter Sandwich #16",
    type: "Normal",
    ingredients: ["Banana x1"],
    condiments: ["Peanut Butter x1"],
    powers: ["Egg Power Lv.1", "Raid Power: Bug Lv.1", "Item Drop Power: Electric Lv.1"],
    herba: [],
  },
];

// Excludes MASS_OUTBREAK_GUIDE and VGC_ANY_HERBA_GUIDE — those use MassOutbreakRecipe (no name/herba fields).
// Deduplicates by name: SHINY_GUIDE > ENCOUNTER_GUIDE > RAID_GUIDE > UTILITY > BREEDING (first occurrence wins).
const _seen = new Set<string>();
export const ALL_RECIPES: SandwichRecipe[] = [
  ...SHINY_GUIDE.flatMap((e) => e.recipes),
  ...ENCOUNTER_GUIDE.flatMap((e) => e.recipes),
  ...RAID_GUIDE.flatMap((e) => e.recipes),
  ...UTILITY_RECIPES,
  ...BREEDING_RECIPES,
].filter((r) => {
  if (_seen.has(r.name)) return false;
  _seen.add(r.name);
  return true;
});
