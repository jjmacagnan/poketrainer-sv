"use client";

import { useI18n } from "@/i18n";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import typesData from "@/data/generated/types.json";

const allTypesData = typesData as {
  name: string;
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}[];

const TYPE_ID: Record<PokemonType, number> = {
  Normal: 1, Fighting: 2, Flying: 3, Poison: 4, Ground: 5,
  Rock: 6, Bug: 7, Ghost: 8, Steel: 9, Fire: 10,
  Water: 11, Grass: 12, Electric: 13, Psychic: 14, Ice: 15,
  Dragon: 16, Dark: 17, Fairy: 18,
};

const SV_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet";

function nameIcon(type: PokemonType) {
  return `${SV_BASE}/${TYPE_ID[type]}.png`;
}

function symbolIcon(type: PokemonType) {
  return `${SV_BASE}/small/${TYPE_ID[type]}.png`;
}

const SORTED_TYPES = [...TYPES].sort() as PokemonType[];

function getMatchups(defType: PokemonType) {
  const d = allTypesData.find((t) => t.name === defType);
  if (!d) return { se: [] as PokemonType[], nve: [] as PokemonType[], immune: [] as PokemonType[] };
  return {
    se:     d.weaknesses  as PokemonType[],
    nve:    d.resistances as PokemonType[],
    immune: d.immunities  as PokemonType[],
  };
}

function TypeDot({ type, immune = false }: { type: PokemonType; immune?: boolean }) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: 24, height: 24 }}
      title={type}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={symbolIcon(type)}
        alt={type}
        width={24}
        height={24}
        style={{
          opacity: immune ? 0.35 : 1,
          display: "block",
          objectFit: "contain",
        }}
      />
      {immune && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: "11px", fontWeight: 900, color: TYPE_COLORS[type], lineHeight: 1 }}
        >
          ✕
        </div>
      )}
    </div>
  );
}

interface TypeChartGridProps {
  highlightTypes?: PokemonType[];
}

export function TypeChartGrid({ highlightTypes = [] }: TypeChartGridProps) {
  const { locale } = useI18n();
  const pt = locale === "pt";

  return (
    <div>
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-8 items-center justify-center rounded-sm font-[family-name:var(--font-share-tech-mono)] text-[11px] font-black"
            style={{ background: "rgba(239,68,68,0.18)", color: "#f87171", border: "1px solid rgba(239,68,68,0.35)" }}
          >
            2×
          </span>
          <span className="font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase tracking-widest text-[var(--pt-text-dim)]">
            {pt ? "Super efetivo" : "Super effective"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-8 items-center justify-center rounded-sm font-[family-name:var(--font-share-tech-mono)] text-[11px] font-black"
            style={{ background: "rgba(96,165,250,0.15)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.3)" }}
          >
            ½×
          </span>
          <span className="font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase tracking-widest text-[var(--pt-text-dim)]">
            {pt ? "Pouco efetivo" : "Not very effective"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-8 items-center justify-center rounded-sm font-[family-name:var(--font-share-tech-mono)] text-[11px] font-black"
            style={{ background: "rgba(113,113,122,0.15)", color: "#a1a1aa", border: "1px solid rgba(113,113,122,0.3)", opacity: 0.7 }}
          >
            0×
          </span>
          <span className="font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase tracking-widest text-[var(--pt-text-dim)]">
            {pt ? "Sem efeito" : "No effect"}
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="mb-1 flex items-center gap-2 px-1">
        <div className="flex flex-1 justify-end">
          <span className="font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-widest text-red-400/70">
            {pt ? "← Super efetivo" : "← Super effective"}
          </span>
        </div>
        <div style={{ width: 96 }} />
        <div className="flex flex-1 justify-start">
          <span className="font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-widest text-blue-400/70">
            {pt ? "Pouco efetivo / Imune →" : "Not very effective / Immune →"}
          </span>
        </div>
      </div>

      {/* Flow chart rows */}
      <div className="space-y-[3px]">
        {SORTED_TYPES.map((defType) => {
          const { se, nve, immune } = getMatchups(defType);
          const isHL = highlightTypes.length > 0 && highlightTypes.includes(defType);
          const dimmed = highlightTypes.length > 0 && !isHL;

          return (
            <div
              key={defType}
              className="flex items-center gap-2 py-[3px] pl-1 pr-2 transition-all duration-150"
              style={{
                opacity: dimmed ? 0.22 : 1,
                background: isHL ? `${TYPE_COLORS[defType]}12` : "transparent",
                borderLeft: `3px solid ${isHL ? TYPE_COLORS[defType] : "transparent"}`,
              }}
            >
              {/* Left: super effective attackers (right-aligned) */}
              <div className="flex min-w-0 flex-1 flex-wrap content-center justify-end gap-[3px]">
                {se.map((t) => (
                  <TypeDot key={t} type={t} />
                ))}
              </div>

              {/* Center: name_icon badge */}
              <div
                className="flex flex-shrink-0 items-center justify-center"
                style={{
                  width: 96,
                  boxShadow: isHL
                    ? `0 0 16px ${TYPE_COLORS[defType]}70, 0 0 4px ${TYPE_COLORS[defType]}50`
                    : "0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nameIcon(defType)}
                  alt={defType}
                  height={30}
                  style={{ width: "auto", display: "block" }}
                />
              </div>

              {/* Right: NVE + immune (left-aligned) */}
              <div className="flex min-w-0 flex-1 flex-wrap content-center gap-[3px]">
                {nve.map((t) => (
                  <TypeDot key={t} type={t} />
                ))}
                {immune.map((t) => (
                  <TypeDot key={t} type={t} immune />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
