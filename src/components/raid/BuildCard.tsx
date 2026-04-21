"use client";

import type { PokemonType } from "@/data/types";
import { TYPE_COLORS } from "@/data/types";
import { useI18n } from "@/i18n";
import { TypeBadge } from "@/components/ui/TypeBadge";
import type { RaidBoss } from "@/data/raid-bosses";

interface BuildCardProps {
  boss: RaidBoss;
  onClick: () => void;
}

export function BuildCard({ boss, onClick }: BuildCardProps) {
  const { t } = useI18n();
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${boss.nationalDex}.png`;

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-3 text-left transition-all hover:-translate-y-0.5 hover:border-white/20"
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
          <span className="rounded-sm bg-[var(--pt-card)] px-1.5 py-0.5 text-[10px] font-bold text-gray-300">
            {boss.stars}★
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-[var(--pt-text-dim)]">{t("raid.teraType").toUpperCase()}</span>
          <TypeBadge type={boss.teraType as PokemonType} small />
        </div>
        {boss.notes && (
          <div className="mt-0.5 text-[10px] text-[var(--pt-text-dim)]">{boss.notes}</div>
        )}
      </div>
    </button>
  );
}
