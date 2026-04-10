"use client";

import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { STAT_NAMES } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { useI18n } from "@/i18n";

const STAT_COLORS: Record<StatName, string> = {
  HP: "#FF5959", Atk: "#F5AC78", Def: "#FAE078",
  SpA: "#9DB7F5", SpD: "#A7DB8D", Spe: "#FA92B2",
};

interface BuildExportProps {
  pokemon: {
    name: string;
    nationalDex: number;
    types: string[];
  };
  teraType: PokemonType | null;
  nature: string;
  ability: string;
  item: string;
  moves: (string | null)[];
  evs: Record<StatName, number>;
  stats: Record<StatName, number>;
  notes: string;
}

export function BuildExport({
  pokemon, teraType, nature, ability, item, moves, evs, stats, notes,
}: BuildExportProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#0a0a1a",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${pokemon.name}-raid-build.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert(t("raid.exportError"));
    }
  }, [pokemon.name, t]);

  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.nationalDex}.png`;
  const teraColor = teraType ? TYPE_COLORS[teraType] : "#888";

  return (
    <div>
      <button
        onClick={handleExport}
        className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25"
      >
        {t("raid.exportPng")}
      </button>

      {/* Card for export — rendered off-screen */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={cardRef}
          style={{
            width: 480,
            padding: 24,
            background: "linear-gradient(135deg, #111127 0%, #0a0a1a 100%)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "'Outfit', 'Segoe UI', sans-serif",
            color: "#e5e7eb",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sprite}
              alt={pokemon.name}
              width={96}
              height={96}
              style={{ imageRendering: "auto" }}
              crossOrigin="anonymous"
            />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
                {pokemon.name}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    style={{
                      background: TYPE_COLORS[type as PokemonType] || "#888",
                      color: "#fff",
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
              {teraType && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af" }}>TERA</span>
                  <span
                    style={{
                      background: teraColor,
                      color: "#fff",
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {teraType}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info Row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { label: t("common.nature"), value: nature },
              { label: t("common.ability"), value: ability },
              { label: t("raid.heldItem"), value: item },
            ].map((info) => (
              info.value && (
                <div
                  key={info.label}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    flex: 1,
                    minWidth: 120,
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
                    {info.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f3f4f6" }}>
                    {info.value}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Moves */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 6 }}>
              {t("raid.moves")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {moves.filter(Boolean).map((move, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {move}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 6 }}>
              {t("raid.evsAndStats")}
            </div>
            {STAT_NAMES.map((stat) => (
              <div
                key={stat}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}
              >
                <span style={{ width: 28, textAlign: "right", fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
                  {stat}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min((stats[stat] / 500) * 100, 100)}%`,
                      background: STAT_COLORS[stat],
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span style={{ width: 32, textAlign: "right", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>
                  {stats[stat]}
                </span>
                {evs[stat] > 0 && (
                  <span style={{ fontSize: 10, color: "#6b7280", width: 40 }}>
                    ({evs[stat]})
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Notes */}
          {notes && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 11,
                color: "#9ca3af",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {notes.slice(0, 200)}
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 12, fontSize: 10, color: "#4b5563", textAlign: "right" }}>
            poketrainer.jbit.app.br
          </div>
        </div>
      </div>
    </div>
  );
}
