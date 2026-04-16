"use client";

import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { STAT_NAMES } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { useI18n } from "@/i18n";
import abilitiesData from "@/data/generated/abilities.json";
import itemsData from "@/data/generated/items.json";
import movesData from "@/data/generated/moves.json";

const abilitiesList = abilitiesData as { name: string; shortEffect: string; flavorText: string }[];
const itemsList = itemsData as { name: string; description: string; officialDescription: string; sprite: string }[];
const movesList = movesData as { name: string; effect?: string }[];

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
  defenses?: {
    weaknesses: { type: string; mult: number }[];
    resistances: string[];
    immunities: string[];
  } | null;
}

export function BuildExport({
  pokemon, teraType, nature, ability, item, moves, evs, stats, notes, defenses
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
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "stretch" }}>
            {/* Nature */}
            {nature && (
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 12px", minWidth: 100 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{t("common.nature")}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f3f4f6" }}>{nature}</div>
              </div>
            )}

            {/* Ability */}
            {ability && (() => {
              const abilityData = abilitiesList.find(a => a.name === ability);
              return (
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 12px", flex: 1.5 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{t("common.ability")}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f3f4f6" }}>{ability}</div>
                  {abilityData && (
                    <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 4, lineHeight: 1.3 }}>
                      {abilityData.shortEffect || abilityData.flavorText}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Item */}
            {item && (() => {
              const itemData = itemsList.find(i => i.name === item);
              return (
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 12px", flex: 1, display: "flex", gap: 8 }}>
                  {itemData?.sprite && (
                    <img src={itemData.sprite} alt={item} style={{ width: 28, height: 28, imageRendering: "pixelated" }} crossOrigin="anonymous" />
                  )}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{t("raid.heldItem")}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f3f4f6" }}>{item}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Defenses */}
          {defenses && (defenses.weaknesses.length > 0 || defenses.resistances.length > 0) && (
            <div style={{ marginBottom: 12, display: "flex", gap: 12, flexWrap: "wrap", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {defenses.weaknesses.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#f87171", marginRight: 4 }}>WEAK:</span>
                  {defenses.weaknesses.map(w => (
                    <div key={w.type} style={{ display: "flex", alignItems: "center", background: "rgba(248,113,113,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                      <span style={{ color: TYPE_COLORS[w.type as PokemonType], fontSize: 9, fontWeight: 700 }}>{w.type.toUpperCase()}</span>
                      <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, color: "#f87171" }}>x{w.mult}</span>
                    </div>
                  ))}
                </div>
              )}
              {defenses.resistances.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#4ade80", marginRight: 4 }}>RESIST:</span>
                  {defenses.resistances.map(r => (
                    <div key={r} style={{ background: "rgba(74,222,128,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                      <span style={{ color: TYPE_COLORS[r as PokemonType], fontSize: 9, fontWeight: 700 }}>{r.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Moves */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 6 }}>
              {t("raid.moves")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {moves.filter(Boolean).map((move, i) => {
                const moveData = movesList.find(m => m.name === move);
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 6,
                      padding: "6px 10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#f3f4f6" }}>
                      {move}
                    </div>
                    {moveData?.effect && (
                      <div style={{ marginTop: 3, fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}>
                        {moveData.effect}
                      </div>
                    )}
                  </div>
                );
              })}
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
