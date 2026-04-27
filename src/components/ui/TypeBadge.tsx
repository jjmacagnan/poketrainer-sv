// src/components/ui/TypeBadge.tsx
"use client";

import type { PokemonType } from "@/data/types";
import { TYPE_COLORS } from "@/data/types";

const TYPE_ID: Record<PokemonType, number> = {
  Normal: 1, Fighting: 2, Flying: 3, Poison: 4, Ground: 5,
  Rock: 6, Bug: 7, Ghost: 8, Steel: 9, Fire: 10,
  Water: 11, Grass: 12, Electric: 13, Psychic: 14, Ice: 15,
  Dragon: 16, Dark: 17, Fairy: 18,
};

const SV_SYMBOL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small";

interface TypeBadgeProps {
  type: PokemonType;
  small?: boolean;
}

export function TypeBadge({ type, small = false }: TypeBadgeProps) {
  const fontSize = small ? 11 : 13;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm font-bold uppercase tracking-wide"
      style={{
        background: TYPE_COLORS[type] || "#888",
        color: "#fff",
        padding: small ? "2px 8px" : "4px 12px",
        fontSize,
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${SV_SYMBOL}/${TYPE_ID[type]}.png`}
        alt=""
        aria-hidden="true"
        style={{ height: fontSize, width: "auto", flexShrink: 0, display: "block" }}
      />
      {type}
    </span>
  );
}
