"use client";

import { useState, useMemo, useCallback } from "react";
import pokemonData from "@/data/generated/pokemon.json";
import naturesData from "@/data/generated/natures.json";
import movesData from "@/data/generated/moves.json";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { HELD_ITEMS } from "@/data/items";
import { RAID_BOSSES } from "@/data/raid-bosses";
import { STAT_NAMES, STAT_LABELS, MAX_EV_PER_STAT, MAX_IV } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { calculateStat, getNatureModifier } from "@/lib/stat-calculator";
import { clampEVs } from "@/lib/ev-calculator";
import { exportShowdown, parseShowdown } from "@/lib/showdown-parser";
import { PageHeader } from "@/components/shared/PageHeader";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { useI18n } from "@/i18n";
import { BuildCard } from "./BuildCard";
import { BuildExport } from "./BuildExport";

interface Pokemon {
  nationalDex: number;
  name: string;
  types: string[];
  baseStats: Record<string, number>;
  abilities: { name: string; isHidden: boolean }[];
  sprite: string;
}

interface Nature {
  name: string;
  increased: string | null;
  decreased: string | null;
}

interface Move {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  pp: number | null;
  accuracy: number | null;
}

const allPokemon = pokemonData as Pokemon[];
const natures = naturesData as Nature[];
const allMoves = movesData as Move[];

const STAT_COLORS: Record<StatName, string> = {
  HP: "#FF5959", Atk: "#F5AC78", Def: "#FAE078",
  SpA: "#9DB7F5", SpD: "#A7DB8D", Spe: "#FA92B2",
};

// ── Build State ───────────────────────────────────────────────────────────────

interface BuildState {
  pokemon: Pokemon | null;
  teraType: PokemonType | null;
  nature: Nature;
  ability: string;
  item: string;
  moves: (string | null)[];
  evs: Record<StatName, number>;
  ivs: Record<StatName, number>;
  level: number;
  notes: string;
}

function createEmptyBuild(): BuildState {
  return {
    pokemon: null,
    teraType: null,
    nature: natures.find((n) => n.name === "Adamant") || natures[0],
    ability: "",
    item: "",
    moves: [null, null, null, null],
    evs: Object.fromEntries(STAT_NAMES.map((s) => [s, 0])) as Record<StatName, number>,
    ivs: Object.fromEntries(STAT_NAMES.map((s) => [s, MAX_IV])) as Record<StatName, number>,
    level: 100,
    notes: "",
  };
}

// ── Searchable Dropdown ───────────────────────────────────────────────────────

function SearchDropdown<T>({
  items,
  value,
  onSelect,
  renderItem,
  getLabel,
  placeholder,
  filterFn,
}: {
  items: T[];
  value: string;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  getLabel: (item: T) => string;
  placeholder: string;
  filterFn: (item: T, query: string) => boolean;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 30);
    return items.filter((item) => filterFn(item, query.toLowerCase())).slice(0, 30);
  }, [items, query, filterFn]);

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? query : value}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-violet-500/50"
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-white/10 bg-gray-900 shadow-xl">
            {filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => { onSelect(item); setOpen(false); setQuery(""); }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
              >
                {renderItem(item)}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-500">{t("common.noResults")}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface AIBossTarget {
  name: string;
  stars: number;
  teraType: string;
}

export function RaidBuildMaker() {
  const { t } = useI18n();
  const [build, setBuild] = useState<BuildState>(createEmptyBuild);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [tab, setTab] = useState<"build" | "bosses">("build");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiTarget, setAiTarget] = useState<AIBossTarget | null>(null);
  const [aiProvider, setAiProvider] = useState<"anthropic" | "gemini">("anthropic");

  const totalEvs = Object.values(build.evs).reduce((a, b) => a + b, 0);

  // Calculated stats
  const calcStats = useMemo(() => {
    if (!build.pokemon) return null;
    const stats: Record<StatName, number> = {} as Record<StatName, number>;
    for (const stat of STAT_NAMES) {
      const base = build.pokemon.baseStats[stat] ?? 0;
      const mod = getNatureModifier(stat, build.nature.increased, build.nature.decreased);
      stats[stat] = calculateStat({
        stat, base, iv: build.ivs[stat], ev: build.evs[stat],
        level: build.level, natureModifier: mod,
      });
    }
    return stats;
  }, [build.pokemon, build.nature, build.ivs, build.evs, build.level]);

  const updateEV = useCallback((stat: StatName, delta: number) => {
    setBuild((prev) => ({ ...prev, evs: clampEVs(prev.evs, stat, delta) }));
  }, []);

  const handleImport = useCallback(() => {
    const parsed = parseShowdown(importText);
    if (!parsed) return;
    const pokemon = allPokemon.find(
      (p) => p.name.toLowerCase() === parsed.name.toLowerCase()
    );
    const nature = natures.find(
      (n) => n.name.toLowerCase() === parsed.nature.toLowerCase()
    ) || natures[0];
    setBuild({
      pokemon: pokemon || null,
      teraType: (parsed.teraType as PokemonType) || null,
      nature,
      ability: parsed.ability,
      item: parsed.item,
      moves: [
        parsed.moves[0] || null, parsed.moves[1] || null,
        parsed.moves[2] || null, parsed.moves[3] || null,
      ],
      evs: parsed.evs,
      ivs: parsed.ivs,
      level: parsed.level,
      notes: "",
    });
    setShowImport(false);
    setImportText("");
  }, [importText]);

  const exportText = useMemo(() => {
    if (!build.pokemon) return "";
    return exportShowdown({
      name: build.pokemon.name,
      item: build.item,
      ability: build.ability,
      teraType: build.teraType || "",
      nature: build.nature.name,
      evs: build.evs,
      ivs: build.ivs,
      moves: build.moves.filter(Boolean) as string[],
      level: build.level,
    });
  }, [build]);

  const generateAIBuild = useCallback(async (target: AIBossTarget) => {
    setAiLoading(true);
    setAiError("");
    setAiTarget(target);
    try {
      const res = await fetch("/api/generate-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bossName: target.name,
          bossStars: target.stars,
          bossTeraType: target.teraType,
          provider: aiProvider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar build");

      const ai = data.build;
      const pokemon = allPokemon.find(
        (p) => p.name.toLowerCase() === ai.pokemonName.toLowerCase()
      );
      const nature = natures.find(
        (n) => n.name.toLowerCase() === ai.nature.toLowerCase()
      ) || natures[0];

      setBuild({
        pokemon: pokemon || null,
        teraType: ai.teraType as PokemonType,
        nature,
        ability: ai.ability,
        item: ai.item,
        moves: [
          ai.moves[0] || null, ai.moves[1] || null,
          ai.moves[2] || null, ai.moves[3] || null,
        ],
        evs: ai.evs,
        ivs: Object.fromEntries(STAT_NAMES.map((s) => [s, 31])) as Record<StatName, number>,
        level: 100,
        notes: `🤖 AI Build — Counter para ${target.stars}★ ${target.name} (Tera ${target.teraType})\n\n${ai.strategy}`,
      });
      setTab("build");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const pokemonFilter = useCallback((p: Pokemon, q: string) => p.name.toLowerCase().includes(q), []);
  const moveFilter = useCallback((m: Move, q: string) => m.name.toLowerCase().includes(q), []);
  const itemFilter = useCallback((i: { name: string }, q: string) => i.name.toLowerCase().includes(q), []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="⚔️"
        title={t("raid.title")}
        subtitle={t("raid.subtitle")}
        gradient="linear-gradient(135deg, #8B5CF6, #6D28D9, #4C1D95)"
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setTab("build")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            tab === "build" ? "bg-violet-500/15 text-white" : "text-gray-400"
          }`}
        >
          {t("raid.tabBuild")}
        </button>
        <button
          onClick={() => setTab("bosses")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            tab === "bosses" ? "bg-violet-500/15 text-white" : "text-gray-400"
          }`}
        >
          {t("raid.tabAI")}
        </button>
      </div>

      {/* Raid Bosses Tab */}
      {tab === "bosses" && (
        <div>
          {/* Provider Selector */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">{t("raid.aiProvider")}</span>
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
              {(["anthropic", "gemini"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setAiProvider(p)}
                  disabled={aiLoading}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all disabled:opacity-50 ${
                    aiProvider === p
                      ? "bg-violet-500/20 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {p === "anthropic" ? "Claude" : "Gemini"}
                </button>
              ))}
            </div>
          </div>

          {/* AI Loading Overlay */}
          {aiLoading && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              <div>
                <div className="text-sm font-bold text-violet-300">
                  {t("raid.aiGenerating")}
                </div>
                {aiTarget && (
                  <div className="text-xs text-gray-400">
                    {t("raid.aiAnalyzing", { stars: aiTarget.stars, name: aiTarget.name, teraType: aiTarget.teraType })}
                  </div>
                )}
              </div>
            </div>
          )}
          {aiError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {aiError}
            </div>
          )}

          {[7, 6, 5].map((stars) => {
            const bosses = RAID_BOSSES.filter((b) => b.stars === stars);
            if (bosses.length === 0) return null;
            return (
              <div key={stars} className="mb-6">
                <h3 className="mb-3 text-sm font-bold text-gray-300">
                  {"★".repeat(stars)} {t("raid.starRaids", { stars })}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {bosses.map((boss) => (
                    <BuildCard key={`${boss.name}-${boss.teraType}`} boss={boss} onClick={() => {
                      generateAIBuild({
                        name: boss.name,
                        stars: boss.stars,
                        teraType: boss.teraType,
                      });
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Build Maker Tab */}
      {tab === "build" && (
        <div className="space-y-4">
          {/* AI Generate Banner */}
          {aiLoading && (
            <div className="flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              <div>
                <div className="text-sm font-bold text-violet-300">{t("raid.aiGenerating")}</div>
                {aiTarget && (
                  <div className="text-xs text-gray-400">
                    {t("raid.aiAnalyzing", { stars: aiTarget.stars, name: aiTarget.name, teraType: aiTarget.teraType })}
                  </div>
                )}
              </div>
            </div>
          )}
          {aiError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {aiError}
            </div>
          )}

          {/* Import/Export Bar */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white"
            >
              {t("raid.importShowdown")}
            </button>
            <button
              onClick={() => setShowExport(!showExport)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white"
              disabled={!build.pokemon}
            >
              {t("raid.exportShowdown")}
            </button>
            {aiTarget && !aiLoading && (
              <button
                onClick={() => generateAIBuild(aiTarget)}
                className="rounded-lg border border-violet-500/30 bg-violet-500/15 px-3 py-1.5 text-xs font-semibold text-violet-300 hover:bg-violet-500/25"
              >
                {t("raid.aiRegenerate")}
              </button>
            )}
            <button
              onClick={() => setBuild(createEmptyBuild())}
              className="ml-auto rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              {t("common.reset")}
            </button>
          </div>

          {/* Import Modal */}
          {showImport && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-sm font-bold text-gray-300">
                {t("raid.pasteShowdown")}
              </div>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`Garchomp @ Choice Band\nAbility: Rough Skin\nTera Type: Dragon\nEVs: 252 Atk / 252 Spe / 4 HP\nJolly Nature\n- Earthquake\n- Outrage\n- Stone Edge\n- Swords Dance`}
                className="mb-2 h-40 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-gray-100 placeholder-gray-600 outline-none"
              />
              <button
                onClick={handleImport}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-500"
              >
                {t("raid.import")}
              </button>
            </div>
          )}

          {/* Export Modal */}
          {showExport && build.pokemon && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-sm font-bold text-gray-300">
                {t("raid.showdownFormat")}
              </div>
              <textarea
                readOnly
                value={exportText}
                className="mb-2 h-40 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-gray-100 outline-none"
              />
              <button
                onClick={() => { navigator.clipboard.writeText(exportText); }}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-500"
              >
                {t("common.copy")}
              </button>
            </div>
          )}

          {/* Pokémon + Tera Type */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-bold text-gray-400">{t("common.pokemon")}</div>
              <SearchDropdown
                items={allPokemon}
                value={build.pokemon?.name || ""}
                onSelect={(p) => setBuild((prev) => ({
                  ...prev,
                  pokemon: p,
                  ability: p.abilities[0]?.name || "",
                }))}
                renderItem={(p) => (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.sprite} alt={p.name} width={28} height={28} className="pixelated" />
                    <span className="font-semibold text-gray-100">{p.name}</span>
                    <span className="text-xs text-gray-500">#{p.nationalDex}</span>
                  </>
                )}
                getLabel={(p) => p.name}
                placeholder={t("raid.searchPokemon")}
                filterFn={pokemonFilter}
              />
              {build.pokemon && (
                <div className="mt-2 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={build.pokemon.sprite} alt={build.pokemon.name} width={40} height={40} className="pixelated" />
                  <div className="flex gap-1">
                    {build.pokemon.types.map((tp) => (
                      <TypeBadge key={tp} type={tp as PokemonType} small />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-bold text-gray-400">{t("raid.teraType")}</div>
              <div className="flex flex-wrap gap-1">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setBuild((prev) => ({ ...prev, teraType: build.teraType === t ? null : t }))}
                    className="rounded-full border px-2 py-0.5 text-[10px] font-bold text-white transition-all"
                    style={{
                      background: build.teraType === t ? TYPE_COLORS[t] : "rgba(255,255,255,0.05)",
                      borderColor: build.teraType === t ? TYPE_COLORS[t] : "rgba(255,255,255,0.1)",
                      opacity: build.teraType === t ? 1 : 0.5,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nature + Ability + Item */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-bold text-gray-400">{t("common.nature")}</div>
              <select
                value={build.nature.name}
                onChange={(e) => {
                  const n = natures.find((x) => x.name === e.target.value);
                  if (n) setBuild((prev) => ({ ...prev, nature: n }));
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100"
              >
                {natures.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}{n.increased ? ` (+${n.increased}/-${n.decreased})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-bold text-gray-400">{t("common.ability")}</div>
              {build.pokemon ? (
                <select
                  value={build.ability}
                  onChange={(e) => setBuild((prev) => ({ ...prev, ability: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100"
                >
                  {build.pokemon.abilities.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}{a.isHidden ? " (H)" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-500">
                  {t("raid.selectPokemon")}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-bold text-gray-400">{t("raid.heldItem")}</div>
              <SearchDropdown
                items={HELD_ITEMS}
                value={build.item}
                onSelect={(i) => setBuild((prev) => ({ ...prev, item: i.name }))}
                renderItem={(i) => (
                  <div>
                    <span className="font-semibold text-gray-100">{i.name}</span>
                    <span className="ml-1.5 text-[10px] text-gray-500">{i.description}</span>
                  </div>
                )}
                getLabel={(i) => i.name}
                placeholder={t("raid.searchItem")}
                filterFn={itemFilter}
              />
            </div>
          </div>

          {/* Moves */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-xs font-bold text-gray-400">{t("raid.moves")}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {build.moves.map((move, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-4 text-center text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <SearchDropdown
                      items={allMoves}
                      value={move || ""}
                      onSelect={(m) => setBuild((prev) => {
                        const moves = [...prev.moves];
                        moves[i] = m.name;
                        return { ...prev, moves };
                      })}
                      renderItem={(m) => (
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: TYPE_COLORS[m.type as PokemonType] || "#888" }}
                          />
                          <span className="font-semibold text-gray-100">{m.name}</span>
                          <span className="text-[10px] text-gray-500">
                            {m.category} {m.power ? `· ${m.power}bp` : ""}
                          </span>
                        </div>
                      )}
                      getLabel={(m) => m.name}
                      placeholder={`Move ${i + 1}...`}
                      filterFn={moveFilter}
                    />
                  </div>
                  {move && (
                    <button
                      onClick={() => setBuild((prev) => {
                        const moves = [...prev.moves];
                        moves[i] = null;
                        return { ...prev, moves };
                      })}
                      className="text-xs text-gray-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EVs + IVs + Stats */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400">{t("raid.evsAndStats")}</div>
              <div className="text-xs text-gray-500">
                {t("raid.evsCount", { count: totalEvs })}
              </div>
            </div>

            {/* Total EV bar */}
            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(totalEvs / 510) * 100}%`,
                  background: totalEvs >= 510 ? "#10B981" : "#8B5CF6",
                }}
              />
            </div>

            <div className="space-y-2">
              {STAT_NAMES.map((stat) => {
                const mod = getNatureModifier(stat, build.nature.increased, build.nature.decreased);
                const finalStat = calcStats?.[stat] ?? 0;
                return (
                  <div key={stat} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-right text-xs font-bold text-gray-400">
                      {stat}
                    </span>
                    {/* EV */}
                    <input
                      type="number"
                      min={0}
                      max={MAX_EV_PER_STAT}
                      value={build.evs[stat]}
                      onChange={(e) => {
                        const val = Math.min(MAX_EV_PER_STAT, Math.max(0, parseInt(e.target.value) || 0));
                        setBuild((prev) => ({ ...prev, evs: { ...prev.evs, [stat]: val } }));
                      }}
                      className="w-14 rounded border border-white/10 bg-white/5 px-1.5 py-1 text-center text-xs text-gray-100"
                      title="EVs"
                    />
                    {/* Quick EV buttons */}
                    <div className="flex gap-0.5">
                      <button onClick={() => updateEV(stat, -4)} className="rounded bg-white/5 px-1 py-0.5 text-[9px] font-bold text-gray-400 hover:bg-white/10">-4</button>
                      <button onClick={() => updateEV(stat, 4)} className="rounded bg-white/5 px-1 py-0.5 text-[9px] font-bold text-gray-400 hover:bg-white/10">+4</button>
                      <button onClick={() => updateEV(stat, 252 - build.evs[stat])} className="rounded bg-violet-500/15 px-1 py-0.5 text-[9px] font-bold text-violet-300 hover:bg-violet-500/25">MAX</button>
                    </div>
                    {/* IV */}
                    <input
                      type="number"
                      min={0}
                      max={MAX_IV}
                      value={build.ivs[stat]}
                      onChange={(e) => {
                        const val = Math.min(MAX_IV, Math.max(0, parseInt(e.target.value) || 0));
                        setBuild((prev) => ({ ...prev, ivs: { ...prev.ivs, [stat]: val } }));
                      }}
                      className="w-12 rounded border border-white/10 bg-white/5 px-1.5 py-1 text-center text-xs text-gray-100"
                      title="IVs"
                    />
                    {/* Nature indicator */}
                    <span className={`w-8 text-center text-[10px] font-bold ${
                      mod > 1 ? "text-emerald-400" : mod < 1 ? "text-red-400" : "text-gray-600"
                    }`}>
                      {mod > 1 ? "↑" : mod < 1 ? "↓" : ""}
                    </span>
                    {/* Stat bar + final */}
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all"
                        style={{
                          width: build.pokemon ? `${Math.min((finalStat / 500) * 100, 100)}%` : "0%",
                          background: STAT_COLORS[stat],
                        }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs font-bold text-white">
                      {build.pokemon ? finalStat : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-xs font-bold text-gray-400">
              {t("raid.notes")}
            </div>
            <textarea
              value={build.notes}
              onChange={(e) => setBuild((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder={t("raid.notesPlaceholder")}
              className="h-24 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none"
            />
          </div>

          {/* Share Link + Export PNG */}
          {build.pokemon && calcStats && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const data = {
                    p: build.pokemon!.nationalDex,
                    t: build.teraType,
                    n: build.nature.name,
                    a: build.ability,
                    i: build.item,
                    m: build.moves.filter(Boolean),
                    e: build.evs,
                    v: build.ivs,
                    l: build.level,
                    o: build.notes,
                  };
                  const jsonString = JSON.stringify(data);
                  const hash = btoa(unescape(encodeURIComponent(jsonString)));
                  const url = `${window.location.origin}/raid-builder?b=${hash}`;
                  navigator.clipboard.writeText(url);
                }}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                {t("raid.copyLink")}
              </button>
              <BuildExport
                pokemon={build.pokemon}
                teraType={build.teraType}
                nature={build.nature.name}
                ability={build.ability}
                item={build.item}
                moves={build.moves}
                evs={build.evs}
                stats={calcStats}
                notes={build.notes}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
