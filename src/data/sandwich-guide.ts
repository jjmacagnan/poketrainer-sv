/**
 * Sandwich Guide — multi-recipe entries per type, sourced from game8.co
 * https://game8.co/games/Pokemon-Scarlet-Violet/archives/397743
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

// ─── Shiny Hunting (Sparkling Power Lv.3) ────────────────────────────────────
// Primary recipes are the "optimal" (fewest ingredients) from game8.
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
        powers: ["Encounter Power: Fire Lv.1", "Item Drop Power: Ground Lv.1", "Exp. Point Power: Fighting Lv.1"],
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
        powers: ["Encounter Power: Dragon Lv.2", "Exp. Point Power: Dark Lv.1", "Catching Power: Flying Lv.1"],
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
        condiments: ["Mustard x1", "Chili Sauce x1", "Pepper x1"],
        powers: ["Raid Power: Fire Lv.2", "Encounter Power: Dragon Lv.1", "Exp. Point Power: Rock Lv.1"],
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
