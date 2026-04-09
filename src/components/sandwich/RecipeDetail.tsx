"use client";

import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { HERBA_FARM_INFO } from "@/data/sandwich-recipes";
import { TYPE_COLORS } from "@/data/types";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PowerTag } from "@/components/ui/PowerTag";

interface RecipeDetailProps {
  recipe: SandwichRecipe;
  onBack: () => void;
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
      <div
        className="absolute left-0 right-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${TYPE_COLORS[recipe.type]}, ${TYPE_COLORS[recipe.type]}66)`,
        }}
      />

      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
      >
        ← Voltar
      </button>

      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-2xl font-black text-gray-100">{recipe.name}</h2>
        <TypeBadge type={recipe.type} />
      </div>

      {/* Ingredients */}
      <div className="mb-5">
        <h3 className="mb-2.5 text-sm font-bold uppercase tracking-widest text-gray-400">
          🥪 Ingredientes
        </h3>
        <div className="flex flex-col gap-1.5">
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-gray-100"
            >
              <span className="text-lg">🥬</span> {ing}
            </div>
          ))}
        </div>
      </div>

      {/* Condiments */}
      <div className="mb-5">
        <h3 className="mb-2.5 text-sm font-bold uppercase tracking-widest text-gray-400">
          🧂 Condimentos
        </h3>
        <div className="flex flex-col gap-1.5">
          {recipe.condiments.map((cond, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-gray-100"
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
                {cond.includes("Herba") ? "🌿" : "🧂"}
              </span>{" "}
              {cond}
            </div>
          ))}
        </div>
      </div>

      {/* Meal Powers */}
      <div className="mb-5">
        <h3 className="mb-2.5 text-sm font-bold uppercase tracking-widest text-gray-400">
          ⚡ Meal Powers
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
          className="rounded-xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(109,40,217,0.07))",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <h3 className="mb-2 text-sm font-bold text-violet-400">
            🌿 Como farmar Herba Mystica
          </h3>
          {[...new Set(recipe.herba)].map((h, i) => (
            <div key={i} className="mb-1 text-sm text-gray-400">
              <strong>{h} Herba Mystica:</strong> {HERBA_FARM_INFO[h]}
            </div>
          ))}
          <div className="mt-2 text-xs italic text-gray-500">
            💡 Dica: Faça raids 5★+ com amigos ou online pra maximizar drops.
            Cada raid pode dropar 0-2 Herbas.
          </div>
        </div>
      )}
    </div>
  );
}
