"use client";

import type { PokemonType } from "@/data/types";
import { TYPE_COLORS } from "@/data/types";
import { TypeBadge } from "@/components/ui/TypeBadge";
import type { RaidBoss } from "@/data/raid-bosses";

interface BuildCardProps {
  boss: RaidBoss;
  onClick: () => void;
}

export function BuildCard({ boss, onClick }: BuildCardProps) {
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${boss.nationalDex}.png`;

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-white/20"
      style={{
        boxShadow: undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${TYPE_COLORS[boss.teraType]}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={sprite} alt={boss.name} width={48} height={48} className="pixelated" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-100">{boss.name}</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-gray-300">
            {boss.stars}★
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-gray-500">TERA</span>
          <TypeBadge type={boss.teraType as PokemonType} small />
        </div>
        {boss.notes && (
          <div className="mt-0.5 text-[10px] text-gray-500">{boss.notes}</div>
        )}
      </div>
    </button>
  );
}
