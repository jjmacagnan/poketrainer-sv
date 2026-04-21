// src/components/sandwich/RecipeCard.tsx
"use client";

import { useState } from "react";
import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { TYPE_COLORS } from "@/data/types";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PowerTag } from "@/components/ui/PowerTag";
import { getIngredientSprite } from "@/lib/ingredient-sprites";
import Image from "next/image";

function CardSprite({ name }: { name: string }) {
  const sprite = getIngredientSprite(name);
  const [failed, setFailed] = useState(false);
  if (!sprite || failed) return null;
  return (
    <Image
      src={sprite}
      alt={name}
      title={name}
      width={28}
      height={28}
      onError={() => setFailed(true)}
      style={{ imageRendering: "pixelated", objectFit: "contain" }}
    />
  );
}

interface RecipeCardProps {
  recipe: SandwichRecipe;
  onSelect: (recipe: SandwichRecipe) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <button
      onClick={() => onSelect(recipe)}
      className="group relative w-full cursor-pointer overflow-hidden border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = TYPE_COLORS[recipe.type];
        e.currentTarget.style.boxShadow = `0 8px 24px ${TYPE_COLORS[recipe.type]}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--pt-border-dim)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute right-0 top-0 h-20 w-20"
        style={{
          background: `radial-gradient(circle at top right, ${TYPE_COLORS[recipe.type]}15, transparent)`,
        }}
      />
      <div className="mb-2.5 flex items-start justify-between">
        <div>
          <div className="mb-1 text-ui-lg font-extrabold text-[var(--pt-text)]">
            {recipe.name}
          </div>
          <TypeBadge type={recipe.type} small />
        </div>
        {recipe.herba.length > 0 && (
          <span className="border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.08)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[1px] text-[var(--pt-gold)]">
            HERBA ×{recipe.herba.length}
          </span>
        )}
      </div>
      {/* Ingredient sprites */}
      {recipe.ingredients.length > 0 && (
        <div className="mb-2 flex items-center gap-1.5">
          {recipe.ingredients.map((ing, i) => {
            const name = ing.replace(/\s*x\d+$/, "").trim();
            return <CardSprite key={i} name={name} />;
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {recipe.powers.map((p, i) => (
          <PowerTag key={i} power={p} />
        ))}
      </div>
    </button>
  );
}
