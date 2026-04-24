"use client";

import { useRef, useCallback, useEffect, useState } from "react";
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
  const [itemSpriteB64, setItemSpriteB64] = useState<string | null>(null);

  const itemData = itemsList.find(i => i.name === item);

  useEffect(() => {
    if (!itemData?.sprite) { setItemSpriteB64(null); return; }
    let cancelled = false;
    fetch(itemData.sprite)
      .then(r => r.blob())
      .then(blob => new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      }))
      .then(b64 => { if (!cancelled) setItemSpriteB64(b64); })
      .catch(() => { if (!cancelled) setItemSpriteB64(null); });
    return () => { cancelled = true; };
  }, [itemData?.sprite]);

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#08080f",
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
        className="rounded-none border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-4 py-2 text-ui-sm font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)] hover:bg-[rgba(255,215,0,0.15)]"
      >
        {t("raid.exportPng")}
      </button>

      {/* Card for export — rendered off-screen, inline styles required for html-to-image */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={cardRef}
          style={{
            width: 480,
            background: "#08080f",
            border: "2px solid #FFD700",
            fontFamily: "'Outfit', 'Segoe UI', sans-serif",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold top accent bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #FFD700, #F97316)", width: "100%" }} />

          <div style={{ padding: 24 }}>
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
                <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#888888", marginBottom: 4, fontFamily: "monospace" }}>
                  TERA RAID BUILD
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>
                  {pokemon.name}
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      style={{
                        background: TYPE_COLORS[type as PokemonType] || "#888",
                        color: "#fff",
                        padding: "2px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                {teraType && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#888888", fontFamily: "monospace" }}>TERA</span>
                    <span
                      style={{
                        background: teraColor,
                        color: "#fff",
                        padding: "2px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {teraType}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Row */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12, alignItems: "stretch" }}>
              {nature && (
                <div style={{ background: "#0a0a16", border: "1px solid #2a2a3a", padding: "8px 12px", minWidth: 100 }}>
                  <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: "#FFD700", textTransform: "uppercase", marginBottom: 3 }}>{t("common.nature")}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{nature}</div>
                </div>
              )}
              {ability && (() => {
                const abilityData = abilitiesList.find(a => a.name === ability);
                return (
                  <div style={{ background: "#0a0a16", border: "1px solid #2a2a3a", padding: "8px 12px", flex: 1.5 }}>
                    <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: "#FFD700", textTransform: "uppercase", marginBottom: 3 }}>{t("common.ability")}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{ability}</div>
                    {abilityData && (
                      <div style={{ fontSize: 9, color: "#888888", marginTop: 4, lineHeight: 1.3 }}>
                        {abilityData.shortEffect || abilityData.flavorText}
                      </div>
                    )}
                  </div>
                );
              })()}
              {item && (
                <div style={{ background: "#0a0a16", border: "1px solid #2a2a3a", padding: "8px 12px", flex: 1, display: "flex", gap: 8 }}>
                  {itemSpriteB64 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={itemSpriteB64} alt={item} style={{ width: 28, height: 28, imageRendering: "pixelated" }} />
                  )}
                  <div>
                    <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: "#FFD700", textTransform: "uppercase", marginBottom: 3 }}>{t("raid.heldItem")}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{item}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Defenses */}
            {defenses && (defenses.weaknesses.length > 0 || defenses.resistances.length > 0) && (
              <div style={{ marginBottom: 12, display: "flex", gap: 12, flexWrap: "wrap", paddingBottom: 12, borderBottom: "1px solid #2a2a3a" }}>
                {defenses.weaknesses.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: "#f87171", marginRight: 4, textTransform: "uppercase" }}>WEAK</span>
                    {defenses.weaknesses.map(w => (
                      <div key={w.type} style={{ display: "flex", alignItems: "center", border: "1px solid rgba(248,113,113,0.3)", padding: "2px 6px" }}>
                        <span style={{ color: TYPE_COLORS[w.type as PokemonType], fontSize: 9, fontWeight: 700 }}>{w.type.toUpperCase()}</span>
                        <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, color: "#f87171" }}>×{w.mult}</span>
                      </div>
                    ))}
                  </div>
                )}
                {defenses.resistances.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: "#4ade80", marginRight: 4, textTransform: "uppercase" }}>RESIST</span>
                    {defenses.resistances.map(r => (
                      <div key={r} style={{ border: "1px solid rgba(74,222,128,0.3)", padding: "2px 6px" }}>
                        <span style={{ color: TYPE_COLORS[r as PokemonType], fontSize: 9, fontWeight: 700 }}>{r.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Moves */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 3, color: "#FFD700", textTransform: "uppercase", marginBottom: 6 }}>
                {t("raid.moves")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {moves.filter(Boolean).map((move, i) => {
                  const moveData = movesList.find(m => m.name === move);
                  return (
                    <div
                      key={i}
                      style={{
                        background: "#0a0a16",
                        border: "1px solid #2a2a3a",
                        padding: "6px 10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffff" }}>{move}</div>
                      {moveData?.effect && (
                        <div style={{ marginTop: 3, fontSize: 8, color: "#888888", lineHeight: 1.3 }}>
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
              <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 3, color: "#FFD700", textTransform: "uppercase", marginBottom: 6 }}>
                {t("raid.evsAndStats")}
              </div>
              {STAT_NAMES.map((stat) => (
                <div key={stat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 28, textAlign: "right", fontSize: 9, fontFamily: "monospace", letterSpacing: 1, color: "#888888", textTransform: "uppercase" }}>
                    {stat}
                  </span>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min((stats[stat] / 500) * 100, 100)}%`,
                        background: STAT_COLORS[stat],
                      }}
                    />
                  </div>
                  <span style={{ width: 32, textAlign: "right", fontSize: 12, fontWeight: 700, color: "#ffffff", fontFamily: "monospace" }}>
                    {stats[stat]}
                  </span>
                  {evs[stat] > 0 && (
                    <span style={{ fontSize: 9, color: "#888888", width: 40, fontFamily: "monospace" }}>
                      ({evs[stat]})
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Notes */}
            {notes && (
              <div style={{ background: "#0a0a16", border: "1px solid #2a2a3a", padding: "8px 12px", fontSize: 11, color: "#888888", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {notes.slice(0, 200)}
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 3, color: "#FFD700", textTransform: "uppercase" }}>
                ▶ POKÉTRAINER·SV
              </div>
              <div style={{ fontSize: 8, fontFamily: "monospace", letterSpacing: 2, color: "#888888", textTransform: "uppercase" }}>
                poketrainer.jbit.app.br
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
