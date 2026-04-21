"use client";

import React, { useState, useMemo } from "react";
import naturesData from "@/data/generated/natures.json";
import berryFlavorsData from "@/data/generated/berry-flavors.json";
import { wildPokemonData } from "@/data/pokemon-utils";
import { STAT_NAMES, STAT_LABELS, MAX_EV_PER_STAT, MAX_IV } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { calculateStat, getNatureModifier } from "@/lib/stat-calculator";
import { useI18n } from "@/i18n";
import { PageHeader } from "@/components/shared/PageHeader";
import { ToolDisclaimer } from "@/components/shared/ToolDisclaimer";
import { getBerriesByFlavor, getBerry } from "@/lib/berry-utils";

interface BerryFlavor {
  id: number;
  name: string;
  contestType: string;
  localizedName: string;
  berries: { potency: number; berry: string }[];
}

interface Nature {
  name: string;
  increased: string | null;
  decreased: string | null;
  likes: string | null;
  dislikes: string | null;
}

interface Pokemon {
  nationalDex: number;
  name: string;
  types: string[];
  baseStats: Record<string, number>;
  sprite: string;
  pokedex: string;
}

const natures = naturesData as Nature[];
const allFlavors = berryFlavorsData as BerryFlavor[];
const allPokemon = wildPokemonData as unknown as Pokemon[];

/** Map nature's likes/dislikes to flavor names */
function getNatureBerryInfo(nature: Nature) {
  const likeFlavor = nature.likes
    ? allFlavors.find((f) => f.localizedName.toLowerCase() === nature.likes!.toLowerCase())
    : null;
  const dislikeFlavor = nature.dislikes
    ? allFlavors.find((f) => f.localizedName.toLowerCase() === nature.dislikes!.toLowerCase())
    : null;

  const likeBerries = likeFlavor
    ? getBerriesByFlavor(likeFlavor.name, 10).slice(0, 6)
    : [];
  const dislikeBerries = dislikeFlavor
    ? getBerriesByFlavor(dislikeFlavor.name, 10).slice(0, 6)
    : [];

  return { likeFlavor, dislikeFlavor, likeBerries, dislikeBerries };
}

const ROLE_SUGGESTIONS: { role: string; nature: string; desc: string }[] = [
  { role: "Physical Attacker", nature: "Adamant", desc: "+Atk / -SpA" },
  { role: "Special Attacker", nature: "Modest", desc: "+SpA / -Atk" },
  { role: "Fast Physical", nature: "Jolly", desc: "+Spe / -SpA" },
  { role: "Fast Special", nature: "Timid", desc: "+Spe / -Atk" },
  { role: "Physical Wall", nature: "Impish", desc: "+Def / -SpA" },
  { role: "Special Wall", nature: "Careful", desc: "+SpD / -SpA" },
  { role: "Bulky Physical", nature: "Brave", desc: "+Atk / -Spe" },
  { role: "Bulky Special", nature: "Quiet", desc: "+SpA / -Spe" },
  { role: "Mixed Wall", nature: "Bold", desc: "+Def / -Atk" },
  { role: "Relaxed Tank", nature: "Relaxed", desc: "+Def / -Spe" },
];

type Tab = "table" | "calculator" | "comparator";

export function NatureCalc() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("table");
  const [selectedNature, setSelectedNature] = useState<Nature | null>(null);

  // Calculator state
  const [calcPokemon, setCalcPokemon] = useState<Pokemon | null>(null);
  const [calcSearch, setCalcSearch] = useState("");
  const [calcNature, setCalcNature] = useState<Nature>(natures[0]);
  const [calcLevel, setCalcLevel] = useState(100);
  const [calcIVs, setCalcIVs] = useState<Record<StatName, number>>(
    Object.fromEntries(STAT_NAMES.map((s) => [s, MAX_IV])) as Record<StatName, number>
  );
  const [calcEVs, setCalcEVs] = useState<Record<StatName, number>>(
    Object.fromEntries(STAT_NAMES.map((s) => [s, 0])) as Record<StatName, number>
  );

  // Comparator state
  const [compNature1, setCompNature1] = useState<Nature>(natures.find((n) => n.name === "Adamant") || natures[0]);
  const [compNature2, setCompNature2] = useState<Nature>(natures.find((n) => n.name === "Modest") || natures[1]);
  const [compPokemon, setCompPokemon] = useState<Pokemon | null>(null);
  const [compSearch, setCompSearch] = useState("");

  const filteredCalcPokemon = useMemo(() => {
    if (!calcSearch.trim()) return [];
    const q = calcSearch.toLowerCase();
    return allPokemon.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [calcSearch]);

  const filteredCompPokemon = useMemo(() => {
    if (!compSearch.trim()) return [];
    const q = compSearch.toLowerCase();
    return allPokemon.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [compSearch]);

  const natureBerryInfoMap = useMemo(
    () => new Map(natures.map((n) => [n.name, getNatureBerryInfo(n)])),
    []
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "table", label: t("natureCalc.tabTable") },
    { id: "calculator", label: t("natureCalc.tabCalc") },
    { id: "comparator", label: t("natureCalc.tabCompare") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="🧮"
        title={t("natureCalc.title")}
        subtitle={t("natureCalc.subtitle")}
        gradient="linear-gradient(135deg, #F95587, #FA92B2, #D685AD)"
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 bg-[var(--pt-card)] p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2.5 text-center text-sm font-bold transition-all ${
              tab === t.id
                ? "border-b-2 border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                : "border-b-2 border-transparent text-[var(--pt-text-dim)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Nature Table */}
      {tab === "table" && (
        <div>
          {/* Mint Suggestions */}
          <div className="mb-5 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <h3 className="mb-3 font-[family-name:var(--font-share-tech-mono)] text-sm uppercase tracking-[2px] text-[var(--pt-gold)]">
              {t("natureCalc.mintSuggestion")}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLE_SUGGESTIONS.map((r) => (
                <div
                  key={r.role}
                  className="flex items-center justify-between bg-[var(--pt-card)] px-3 py-2"
                >
                  <span className="text-sm font-semibold text-gray-200">
                    {r.role}
                  </span>
                  <span className="border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-2 py-0.5 text-xs font-bold text-[var(--pt-gold)]">
                    {r.nature} ({r.desc})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nature Grid */}
          <div className="overflow-x-auto border border-[var(--pt-border-dim)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pt-border-dim)] bg-[var(--pt-card)]">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--pt-text-dim)]">
                    {t("common.nature")}
                  </th>
                  {STAT_NAMES.filter((s) => s !== "HP").map((stat) => (
                    <th
                      key={stat}
                      className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]"
                    >
                      {STAT_LABELS[stat]}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">
                    {t("natureCalc.flavor")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {natures.map((nature) => (
                  <React.Fragment key={nature.name}>
                  <tr
                    onClick={() =>
                      setSelectedNature(
                        selectedNature?.name === nature.name ? null : nature
                      )
                    }
                    className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5 ${
                      selectedNature?.name === nature.name ? "bg-[rgba(255,215,0,0.05)]" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold text-gray-100">
                      {nature.name}
                      {!nature.increased && (
                        <span className="ml-1.5 text-ui-base text-[var(--pt-text-dim)]">
                          {t("natureCalc.neutral")}
                        </span>
                      )}
                    </td>
                    {STAT_NAMES.filter((s) => s !== "HP").map((stat) => {
                      const isUp = nature.increased === stat;
                      const isDown = nature.decreased === stat;
                      return (
                        <td
                          key={stat}
                          className={`px-3 py-2 text-center text-xs font-bold ${
                            isUp
                              ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                              : isDown
                                ? "bg-[rgba(255,255,255,0.04)] text-[var(--pt-text-dim)]"
                                : "text-[var(--pt-text-dim)]"
                          }`}
                        >
                          {isUp ? "▲ +10%" : isDown ? "▼ -10%" : "—"}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center text-xs">
                      {(() => {
                        const berryInfo = natureBerryInfoMap.get(nature.name) ?? getNatureBerryInfo(nature);
                        if (!berryInfo.likeFlavor || !berryInfo.dislikeFlavor) {
                          return <span className="text-[var(--pt-text-dim)]">—</span>;
                        }
                        const isOpen = selectedNature?.name === nature.name;
                        return (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 justify-center">
                              <span className="text-ui-sm text-[var(--pt-gold)]">♥</span>
                              <span className="text-ui-base text-[var(--pt-text-dim)]">{nature.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 justify-center">
                              <span className="text-ui-sm text-red-400">✕</span>
                              <span className="text-ui-base text-[var(--pt-text-dim)]">{nature.dislikes}</span>
                            </div>
                            <span className="text-ui-xs text-[var(--pt-text-dim)]">{isOpen ? "▲" : "▼"}</span>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                  {selectedNature?.name === nature.name && (() => {
                    const berryInfo = getNatureBerryInfo(nature);
                    if (!berryInfo.likeFlavor || !berryInfo.dislikeFlavor) return null;
                    return (
                      <tr>
                        <td colSpan={7} className="px-3 pb-3 pt-0">
                          <div className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-3">
                            <div className="mb-2 flex items-center gap-1.5">
                              <span className="font-[family-name:var(--font-share-tech-mono)] text-ui-base font-bold uppercase tracking-[2px] text-[var(--pt-gold)]">
                                {t("natureCalc.berryPreferences")}
                              </span>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <div className="border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                                <div className="mb-1 flex items-center gap-1">
                                  <span className="text-ui-base text-[var(--pt-gold)]">♥</span>
                                  <span className="text-ui-base font-bold text-[var(--pt-gold)]">{t("natureCalc.likesFlavor")}</span>
                                  <span className="border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-1 py-0.5 text-ui-sm font-bold text-[var(--pt-gold)]">
                                    {berryInfo.likeFlavor.localizedName}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {berryInfo.likeBerries.map((b) => (
                                    <span
                                      key={b.berry.name}
                                      className="bg-[rgba(255,215,0,0.06)] px-1.5 py-0.5 text-ui-sm text-[var(--pt-gold)]"
                                      title={`Potency: ${b.potency}`}
                                    >
                                      {b.berry.name} ({b.potency})
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="border border-red-500/20 bg-red-500/5 p-2.5">
                                <div className="mb-1 flex items-center gap-1">
                                  <span className="text-ui-base text-red-400">✕</span>
                                  <span className="text-ui-base font-bold text-red-400">{t("natureCalc.dislikesFlavor")}</span>
                                  <span className="border border-red-500/30 bg-red-500/10 px-1 py-0.5 text-ui-sm font-bold text-red-300">
                                    {berryInfo.dislikeFlavor.localizedName}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {berryInfo.dislikeBerries.map((b) => (
                                    <span
                                      key={b.berry.name}
                                      className="bg-red-500/10 px-1.5 py-0.5 text-ui-sm text-red-300/80"
                                      title={`Potency: ${b.potency}`}
                                    >
                                      {b.berry.name} ({b.potency})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="mt-1.5 text-ui-sm italic text-[var(--pt-text-dim)]">
                              {t("natureCalc.berryNote")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })()}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calculator */}
      {tab === "calculator" && (
        <div className="space-y-4">
          {/* Pokemon Selector */}
          <div className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-3 text-sm font-bold text-gray-300">
              {t("natureCalc.selectPokemon")}
            </div>
            <div className="relative">
              <input
                type="text"
                value={calcPokemon ? calcPokemon.name : calcSearch}
                onChange={(e) => {
                  setCalcSearch(e.target.value);
                  setCalcPokemon(null);
                }}
                placeholder={t("natureCalc.searchPokemon")}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100 placeholder-[var(--pt-text-dim)] outline-none focus:border-[var(--pt-gold)]/50"
              />
              {filteredCalcPokemon.length > 0 && !calcPokemon && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border border-[var(--pt-border-dim)] bg-gray-900">
                  {filteredCalcPokemon.map((p) => (
                    <button
                      key={p.nationalDex}
                      onClick={() => {
                        setCalcPokemon(p);
                        setCalcSearch("");
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.sprite} alt={p.name} width={28} height={28} className="pixelated" />
                      <span className="font-semibold text-gray-100">{p.name}</span>
                      <span className="text-xs text-[var(--pt-text-dim)]">#{p.nationalDex}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {calcPokemon && (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={calcPokemon.sprite} alt={calcPokemon.name} width={48} height={48} className="pixelated" />
                <div>
                  <div className="text-sm font-bold text-gray-100">{calcPokemon.name}</div>
                  <div className="text-xs text-[var(--pt-text-dim)]">
                    Base: {STAT_NAMES.map((s) => `${s} ${calcPokemon.baseStats[s]}`).join(" / ")}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nature + Level */}
          <div className="flex gap-3">
            <div className="flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-bold text-[var(--pt-text-dim)]">Nature</div>
              <select
                value={calcNature.name}
                onChange={(e) => {
                  const n = natures.find((x) => x.name === e.target.value);
                  if (n) setCalcNature(n);
                }}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
              >
                {natures.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}
                    {n.increased ? ` (+${n.increased} / -${n.decreased})` : " (Neutral)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-bold text-[var(--pt-text-dim)]">Level</div>
              <input
                type="number"
                min={1}
                max={100}
                value={calcLevel}
                onChange={(e) => setCalcLevel(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
              />
            </div>
          </div>

          {/* Stats Table */}
          <div className="overflow-x-auto border border-[var(--pt-border-dim)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pt-border-dim)] bg-[var(--pt-card)]">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--pt-text-dim)]">Stat</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">Base</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">IV</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">EV</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">Nature</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">Final</th>
                </tr>
              </thead>
              <tbody>
                {STAT_NAMES.map((stat) => {
                  const base = calcPokemon?.baseStats[stat] ?? 0;
                  const mod = getNatureModifier(stat, calcNature.increased, calcNature.decreased);
                  const final_ = calcPokemon
                    ? calculateStat({
                        stat,
                        base,
                        iv: calcIVs[stat],
                        ev: calcEVs[stat],
                        level: calcLevel,
                        natureModifier: mod,
                      })
                    : 0;
                  return (
                    <tr key={stat} className="border-b border-white/5">
                      <td className="px-3 py-2 font-semibold text-gray-200">
                        {STAT_LABELS[stat]}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-[var(--pt-text-dim)]">
                        {base || "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={MAX_IV}
                          value={calcIVs[stat]}
                          onChange={(e) =>
                            setCalcIVs((prev) => ({
                              ...prev,
                              [stat]: Math.min(MAX_IV, Math.max(0, parseInt(e.target.value) || 0)),
                            }))
                          }
                          className="w-14 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-center text-xs text-gray-100"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={MAX_EV_PER_STAT}
                          value={calcEVs[stat]}
                          onChange={(e) =>
                            setCalcEVs((prev) => ({
                              ...prev,
                              [stat]: Math.min(MAX_EV_PER_STAT, Math.max(0, parseInt(e.target.value) || 0)),
                            }))
                          }
                          className="w-14 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-center text-xs text-gray-100"
                        />
                      </td>
                      <td
                        className={`px-3 py-2 text-center text-xs font-bold ${
                          mod > 1
                            ? "text-[var(--pt-gold)]"
                            : mod < 1
                              ? "text-red-400"
                              : "text-[var(--pt-text-dim)]"
                        }`}
                      >
                        {mod > 1 ? "×1.1" : mod < 1 ? "×0.9" : "×1.0"}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-lg font-bold text-white">
                        {calcPokemon ? final_ : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparator */}
      {tab === "comparator" && (
        <div className="space-y-4">
          {/* Pokemon Selector */}
          <div className="border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-3 text-sm font-bold text-gray-300">
              {t("natureCalc.selectToCompare")}
            </div>
            <div className="relative">
              <input
                type="text"
                value={compPokemon ? compPokemon.name : compSearch}
                onChange={(e) => {
                  setCompSearch(e.target.value);
                  setCompPokemon(null);
                }}
                placeholder={t("natureCalc.searchPokemon")}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100 placeholder-[var(--pt-text-dim)] outline-none focus:border-[var(--pt-gold)]/50"
              />
              {filteredCompPokemon.length > 0 && !compPokemon && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border border-[var(--pt-border-dim)] bg-gray-900">
                  {filteredCompPokemon.map((p) => (
                    <button
                      key={p.nationalDex}
                      onClick={() => {
                        setCompPokemon(p);
                        setCompSearch("");
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.sprite} alt={p.name} width={28} height={28} className="pixelated" />
                      <span className="font-semibold text-gray-100">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nature Selectors */}
          <div className="flex gap-3">
            <div className="flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-bold text-[var(--pt-text-dim)]">{t("natureCalc.natureA")}</div>
              <select
                value={compNature1.name}
                onChange={(e) => {
                  const n = natures.find((x) => x.name === e.target.value);
                  if (n) setCompNature1(n);
                }}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
              >
                {natures.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}
                    {n.increased ? ` (+${n.increased}/-${n.decreased})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-bold text-[var(--pt-text-dim)]">{t("natureCalc.natureB")}</div>
              <select
                value={compNature2.name}
                onChange={(e) => {
                  const n = natures.find((x) => x.name === e.target.value);
                  if (n) setCompNature2(n);
                }}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
              >
                {natures.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}
                    {n.increased ? ` (+${n.increased}/-${n.decreased})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          {compPokemon && (
            <div className="overflow-x-auto border border-[var(--pt-border-dim)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--pt-border-dim)] bg-[var(--pt-card)]">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--pt-text-dim)]">Stat</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">Base</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-gold)]">
                      {compNature1.name}
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">
                      {compNature2.name}
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--pt-text-dim)]">{t("natureCalc.diff")}</th>
                  </tr>
                </thead>
                <tbody>
                  {STAT_NAMES.map((stat) => {
                    const base = compPokemon.baseStats[stat] ?? 0;
                    const mod1 = getNatureModifier(stat, compNature1.increased, compNature1.decreased);
                    const mod2 = getNatureModifier(stat, compNature2.increased, compNature2.decreased);
                    const val1 = calculateStat({ stat, base, iv: MAX_IV, ev: 252, level: 100, natureModifier: mod1 });
                    const val2 = calculateStat({ stat, base, iv: MAX_IV, ev: 252, level: 100, natureModifier: mod2 });
                    const diff = val2 - val1;
                    return (
                      <tr key={stat} className="border-b border-white/5">
                        <td className="px-3 py-2 font-semibold text-gray-200">
                          {STAT_LABELS[stat]}
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-[var(--pt-text-dim)]">
                          {base}
                        </td>
                        <td className={`px-3 py-2 text-center font-mono font-bold ${mod1 > 1 ? "text-[var(--pt-gold)]" : mod1 < 1 ? "text-red-400" : "text-gray-300"}`}>
                          {val1}
                        </td>
                        <td className={`px-3 py-2 text-center font-mono font-bold ${mod2 > 1 ? "text-[var(--pt-gold)]" : mod2 < 1 ? "text-red-400" : "text-gray-300"}`}>
                          {val2}
                        </td>
                        <td
                          className={`px-3 py-2 text-center font-mono text-xs font-bold ${
                            diff > 0
                              ? "text-[var(--pt-gold)]"
                              : diff < 0
                                ? "text-red-400"
                                : "text-[var(--pt-text-dim)]"
                          }`}
                        >
                          {diff > 0 ? `+${diff}` : diff === 0 ? "—" : diff}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-xs text-[var(--pt-text-dim)]">
                {t("natureCalc.compareNote")}
              </div>
            </div>
          )}

          {!compPokemon && (
            <div className="py-10 text-center text-[var(--pt-text-dim)]">
              {t("natureCalc.selectToComparePrompt")}
            </div>
          )}
        </div>
      )}

      <ToolDisclaimer
        toolName={t("nav.natureCalc")}
        note={t("natureCalc.disclaimerNote")}
        sources={[
          { label: "PokéAPI", url: "https://pokeapi.co/docs/v2#info" },
        ]}
      />
    </div>
  );
}
