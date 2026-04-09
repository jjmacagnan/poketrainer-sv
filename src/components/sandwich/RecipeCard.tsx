"use client";

import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { TYPE_COLORS } from "@/data/types";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PowerTag } from "@/components/ui/PowerTag";

interface RecipeCardProps {
  recipe: SandwichRecipe;
  onSelect: (recipe: SandwichRecipe) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <button
      onClick={() => onSelect(recipe)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = TYPE_COLORS[recipe.type];
        e.currentTarget.style.boxShadow = `0 8px 24px ${TYPE_COLORS[recipe.type]}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute right-0 top-0 h-20 w-20 rounded-br-none rounded-tl-none"
        style={{
          background: `radial-gradient(circle at top right, ${TYPE_COLORS[recipe.type]}15, transparent)`,
        }}
      />
      <div className="mb-2.5 flex items-start justify-between">
        <div>
          <div className="mb-1 text-[15px] font-extrabold text-gray-100">
            {recipe.name}
          </div>
          <TypeBadge type={recipe.type} small />
        </div>
        {recipe.herba.length > 0 && (
          <span className="rounded-md bg-gradient-to-br from-violet-500 to-violet-700 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
            HERBA ×{recipe.herba.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {recipe.powers.map((p, i) => (
          <PowerTag key={i} power={p} />
        ))}
      </div>
    </button>
  );
}
