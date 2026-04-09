"use client";

import type { PokemonType } from "@/data/types";
import { TYPE_COLORS } from "@/data/types";

interface TypeBadgeProps {
  type: PokemonType;
  small?: boolean;
}

export function TypeBadge({ type, small = false }: TypeBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide"
      style={{
        background: TYPE_COLORS[type] || "#888",
        color: "#fff",
        padding: small ? "2px 8px" : "4px 12px",
        fontSize: small ? "11px" : "13px",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      {type}
    </span>
  );
}
