"use client";

import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { TYPE_COLORS } from "@/data/types";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PowerTag } from "@/components/ui/PowerTag";
import { useI18n } from "@/i18n";
import { getDominantFlavorOfIngredient, getIngredientFlavors } from "@/lib/ingredient-flavors";
import { getBerriesByFlavor, getBerry } from "@/lib/berry-utils";
import { useState } from "react";

interface RecipeDetailProps {
  recipe: SandwichRecipe;
  onBack: () => void;
}

/** Parse "Ingredient x2" → { name: "Ingredient", qty: 2 } */
function parseIngredient(ing: string): { name: string; qty: number } {
  const match = ing.match(/^(.+?)\s*x(\d+)$/);
  if (match) return { name: match[1], qty: parseInt(match[2]) };
  return { name: ing, qty: 1 };
}

const INGREDIENT_EMOJI: Record<string, string> = {
  // Main ingredients
  "Chorizo":        "🥩",
  "Red Pepper":     "🫑",
  "Cucumber":       "🥒",
  "Yellow Pepper":  "🫑",
  "Lettuce":        "🥬",
  "Klawf Stick":    "🦀",
  "Pickle":         "🥒",
  "Green Pepper":   "🫑",
  "Ham":            "🍖",
  "Prosciutto":     "🍖",
  "Onion":          "🧅",
  "Cherry Tomato":  "🍅",
  "Jalapeno":       "🌶️",
  "Red Onion":      "🧅",
  "Avocado":        "🥑",
  "Smoked Fillet":  "🐟",
  "Hamburger":      "🥩",
  "Tomato":         "🍅",
  "Basil":          "🌿",
  // Condiments
  "Salt":                 "🧂",
  "Mayonnaise":           "🫙",
  "Butter":               "🧈",
  "Peanut Butter":        "🥜",
  "Mustard":              "🟡",
  "Ketchup":              "🍅",
  "Mayonnaise (Sesame)":  "🫙",
  "Yogurt":               "🥛",
  "Whipped Cream":        "🍦",
  "Cream Cheese":         "🧀",
  "Olive Oil":            "🫒",
  "Vinegar":              "🍶",
  // Herba Mystica
  "Sweet Herba Mystica":  "🌿",
  "Salty Herba Mystica":  "🌿",
  "Sour Herba Mystica":   "🌿",
  "Bitter Herba Mystica": "🌿",
  "Spicy Herba Mystica":  "🌿",
};

function getIngredientEmoji(name: string): string {
  return INGREDIENT_EMOJI[name] ?? "🥬";
}

const FLAVOR_COLORS: Record<string, string> = {
  spicy: "#FF6B35",
  dry: "#6CB4E4",
  sweet: "#FF9CC2",
  bitter: "#9B59B6",
  sour: "#8AC926",
};

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const { t } = useI18n();
  const [showFlavorDetails, setShowFlavorDetails] = useState(false);

  return (
    <div className="relative overflow-hidden border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-6">
      <div
        className="absolute left-0 right-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${TYPE_COLORS[recipe.type]}, ${TYPE_COLORS[recipe.type]}66)`,
        }}
      />

      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3.5 py-1.5 text-sm font-semibold text-[var(--pt-text-dim)] transition-colors hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]"
      >
        {t("common.back")}
      </button>

      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-2xl font-black text-gray-100">{recipe.name}</h2>
        <TypeBadge type={recipe.type} />
      </div>

      {/* Ingredients with Flavor Profiles */}
      <div className="mb-5">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-share-tech-mono)] text-sm uppercase tracking-[2px] text-[var(--pt-gold)]">
            {t("sandwich.ingredients")}
          </h3>
          <button
            onClick={() => setShowFlavorDetails(!showFlavorDetails)}
            className="rounded px-2 py-0.5 text-[10px] font-semibold text-[var(--pt-text-dim)] transition-colors hover:text-[var(--pt-gold)]"
          >
            {showFlavorDetails ? t("sandwich.hideFlavors") : t("sandwich.showFlavors")}
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {recipe.ingredients.map((ing, i) => {
            const parsed = parseIngredient(ing);
            const flavorInfo = getDominantFlavorOfIngredient(parsed.name);
            const allFlavors = getIngredientFlavors(parsed.name);
            const hasFlavors = Object.values(allFlavors).some(v => v > 0);

            return (
              <div
                key={i}
                className="flex flex-col bg-[var(--pt-card)] px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getIngredientEmoji(parsed.name)}</span>
                  <span className="text-sm font-semibold text-gray-100">
                    {parsed.name}
                  </span>
                  {parsed.qty > 1 && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--pt-text-dim)]">
                      ×{parsed.qty}
                    </span>
                  )}
                  {flavorInfo && (
                    <span
                      className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: FLAVOR_COLORS[flavorInfo.flavor] ?? "#666" }}
                    >
                      {flavorInfo.flavor}
                    </span>
                  )}
                </div>
                {showFlavorDetails && hasFlavors && (
                  <div className="mt-1.5 flex gap-1">
                    {Object.entries(allFlavors)
                      .filter(([, v]) => v > 0)
                      .map(([flavor, potency]) => (
                        <span
                          key={flavor}
                          className="rounded px-1.5 py-0.5 text-[9px] font-semibold text-white/80"
                          style={{ background: (FLAVOR_COLORS[flavor] ?? "#666") + "99" }}
                        >
                          {flavor}: {potency}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Berry Alternatives */}
      {showFlavorDetails && recipe.herba.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2.5 font-[family-name:var(--font-share-tech-mono)] text-sm uppercase tracking-[2px] text-[var(--pt-gold)]">
            {t("sandwich.berryAlternatives")}
          </h3>
          <div className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-3">
            <p className="mb-2 text-[11px] text-[var(--pt-text-dim)]">
              {t("sandwich.berryAltNote")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recipe.herba.map((herba, i) => {
                // Map herba to flavor name
                const herbaToFlavor: Record<string, string> = {
                  "Sweet": "sweet",
                  "Salty": "dry",
                  "Sour": "sour",
                  "Bitter": "bitter",
                  "Spicy": "spicy",
                };
                const flavorName = herbaToFlavor[herba];
                if (!flavorName) return null;
                const topBerries = getBerriesByFlavor(flavorName, 15).slice(0, 4);
                return (
                  <div key={i} className="bg-[var(--pt-card)] px-2.5 py-1.5">
                    <div className="text-[10px] font-bold text-[var(--pt-text-dim)]">
                      {herba} →
                    </div>
                    <div className="mt-0.5 flex gap-1">
                      {topBerries.map((b) => {
                        const berry = getBerry(b.berry.name);
                        return (
                          <span
                            key={b.berry.name}
                            className="rounded px-1 py-0.5 text-[9px] font-semibold text-white/80"
                            style={{ background: FLAVOR_COLORS[flavorName] + "66" }}
                            title={`Potency: ${b.potency}`}
                          >
                            {b.berry.name} ({b.potency})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Condiments */}
      {recipe.condiments.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2.5 font-[family-name:var(--font-share-tech-mono)] text-sm uppercase tracking-[2px] text-[var(--pt-gold)]">
            {t("sandwich.condiments")}
          </h3>
          <div className="flex flex-col gap-1.5">
            {recipe.condiments.map((cond, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-gray-100"
                style={{
                  background: cond.includes("Herba")
                    ? "linear-gradient(135deg, rgba(139,92,246,0.13), rgba(109,40,217,0.13))"
                    : "rgba(255,255,255,0.05)",
                  border: cond.includes("Herba")
                    ? "1px solid rgba(139,92,246,0.27)"
                    : "1px solid transparent",
                }}
              >
                <span className="text-lg">
                  {getIngredientEmoji(cond.replace(/ x\d+$/, "").trim())}
                </span>{" "}
                {cond}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Powers */}
      <div className="mb-5">
        <h3 className="mb-2.5 text-sm font-bold uppercase tracking-widest text-[var(--pt-text-dim)]">
          {t("sandwich.mealPowers")}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {recipe.powers.map((p, i) => (
            <PowerTag key={i} power={p} />
          ))}
        </div>
      </div>

      {/* Herba farming info */}
      {recipe.herba.length > 0 && (
        <div
          className="p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(109,40,217,0.07))",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <h3 className="mb-2 text-sm font-bold text-[var(--pt-gold)]">
            {t("sandwich.herbaTipTitle")}
          </h3>
          {[...new Set(recipe.herba)].map((h, i) => (
            <div key={i} className="mb-1 text-sm text-[var(--pt-text-dim)]">
              <strong>{h} Herba Mystica:</strong>{" "}
              {t(`sandwich.herba.${h}`)}
            </div>
          ))}
          <div className="mt-2 text-xs italic text-[var(--pt-text-dim)]">
            {t("sandwich.herbaTipNote")}
          </div>
        </div>
      )}
    </div>
  );
}
