/**
 * Maps sandwich ingredient names to their corresponding berry (if any).
 * In Scarlet/Violet, sandwich ingredients are NOT berries — they're regular
 * food items (herbs, vegetables, meats, etc.). However, each ingredient has
 * a dominant flavor profile (spicy, dry, sweet, bitter, sour) that can be
 * derived from the game's internal data.
 *
 * Since the PokeAPI berry data doesn't directly map to sandwich ingredients,
 * this file provides the flavor profile for each known sandwich ingredient
 * based on Scarlet/Violet game data.
 */

/** Flavor profiles for all sandwich ingredients. */
export const INGREDIENT_FLAVORS: Record<string, Record<string, number>> = {
  // Herba Mystica — these are the 5 flavor types themselves
  "Sweet Herba Mystica": { spicy: 0, dry: 0, sweet: 40, bitter: 0, sour: 0 },
  "Salty Herba Mystica": { spicy: 0, dry: 40, sweet: 0, bitter: 0, sour: 0 },
  "Sour Herba Mystica":   { spicy: 0, dry: 0, sweet: 0, bitter: 0, sour: 40 },
  "Bitter Herba Mystica": { spicy: 0, dry: 0, sweet: 0, bitter: 40, sour: 0 },
  "Spicy Herba Mystica":  { spicy: 40, dry: 0, sweet: 0, bitter: 0, sour: 0 },

  // Main ingredients — flavor profiles from S/V game data
  "Chorizo":      { spicy: 15, dry: 0, sweet: 0, bitter: 0, sour: 0 },
  "Red Pepper":   { spicy: 20, dry: 0, sweet: 0, bitter: 0, sour: 0 },
  "Cucumber":     { spicy: 0, dry: 10, sweet: 0, bitter: 5, sour: 0 },
  "Yellow Pepper":{ spicy: 10, dry: 0, sweet: 10, bitter: 0, sour: 0 },
  "Lettuce":      { spicy: 0, dry: 5, sweet: 0, bitter: 10, sour: 0 },
  "Klawf Stick":  { spicy: 10, dry: 0, sweet: 0, bitter: 0, sour: 10 },
  "Pickle":       { spicy: 0, dry: 0, sweet: 0, bitter: 0, sour: 20 },
  "Green Pepper": { spicy: 5, dry: 0, sweet: 0, bitter: 10, sour: 0 },
  "Ham":          { spicy: 0, dry: 10, sweet: 0, bitter: 0, sour: 5 },
  "Prosciutto":   { spicy: 0, dry: 15, sweet: 0, bitter: 0, sour: 0 },
  "Onion":        { spicy: 0, dry: 5, sweet: 5, bitter: 5, sour: 0 },
  "Cherry Tomato":{ spicy: 0, dry: 0, sweet: 10, bitter: 0, sour: 5 },
  "Jalapeno":     { spicy: 25, dry: 0, sweet: 0, bitter: 0, sour: 0 },
  "Red Onion":    { spicy: 0, dry: 0, sweet: 5, bitter: 10, sour: 0 },
  "Avocado":      { spicy: 0, dry: 0, sweet: 5, bitter: 5, sour: 5 },
  "Smoked Fillet":{ spicy: 0, dry: 5, sweet: 0, bitter: 0, sour: 15 },
  "Hamburger":    { spicy: 5, dry: 10, sweet: 0, bitter: 0, sour: 0 },
  "Tomato":       { spicy: 0, dry: 0, sweet: 10, bitter: 0, sour: 5 },
  "Basil":        { spicy: 0, dry: 0, sweet: 5, bitter: 15, sour: 0 },

  // Condiments
  "Salt":         { spicy: 0, dry: 10, sweet: 0, bitter: 0, sour: 0 },
  "Mayonnaise":   { spicy: 0, dry: 5, sweet: 5, bitter: 0, sour: 0 },
  "Butter":       { spicy: 0, dry: 0, sweet: 10, bitter: 0, sour: 0 },
  "Peanut Butter":{ spicy: 0, dry: 0, sweet: 15, bitter: 5, sour: 0 },
  "Mustard":      { spicy: 15, dry: 5, sweet: 0, bitter: 0, sour: 0 },
  "Ketchup":      { spicy: 0, dry: 0, sweet: 15, bitter: 0, sour: 5 },
  "Mayonnaise (Sesame)": { spicy: 0, dry: 5, sweet: 5, bitter: 0, sour: 0 },
  "Yogurt":       { spicy: 0, dry: 0, sweet: 10, bitter: 0, sour: 5 },
  "Whipped Cream":{ spicy: 0, dry: 0, sweet: 15, bitter: 0, sour: 0 },
  "Cream Cheese": { spicy: 0, dry: 0, sweet: 10, bitter: 0, sour: 0 },
  "Olive Oil":    { spicy: 0, dry: 0, sweet: 0, bitter: 10, sour: 0 },
  "Vinegar":      { spicy: 0, dry: 0, sweet: 0, bitter: 0, sour: 20 },
};

/** Get the dominant flavor of an ingredient */
export function getDominantFlavorOfIngredient(ingredient: string): { flavor: string; potency: number } | null {
  const flavors = INGREDIENT_FLAVORS[ingredient];
  if (!flavors) return null;

  let dominant = "";
  let maxPotency = 0;
  for (const [flavor, potency] of Object.entries(flavors)) {
    if (potency > maxPotency) {
      maxPotency = potency;
      dominant = flavor;
    }
  }
  return maxPotency > 0 ? { flavor: dominant, potency: maxPotency } : null;
}

/** Get full flavor profile of an ingredient */
export function getIngredientFlavors(ingredient: string): Record<string, number> {
  return INGREDIENT_FLAVORS[ingredient] ?? {};
}

/** Get all known ingredients */
export function getAllIngredients(): string[] {
  return Object.keys(INGREDIENT_FLAVORS);
}
