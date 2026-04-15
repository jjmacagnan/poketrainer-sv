"use client";

import { useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import pokemonData from "@/data/generated/pokemon.json";
import naturesData from "@/data/generated/natures.json";
import movesData from "@/data/generated/moves.json";
import moveMetaData from "@/data/generated/move-meta.json";
import abilitiesData from "@/data/generated/abilities.json";
import itemsData from "@/data/generated/items.json";
import typesData from "@/data/generated/types.json";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { RAID_TIER_LIST, TIER_COLORS, TIER_DESCRIPTIONS, type TierRank, type RaidRole, type RaidTierEntry, type RaidBuild } from "@/data/raid-tier-list";
import { STAT_NAMES, MAX_EV_PER_STAT, MAX_IV } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { calculateStat, getNatureModifier } from "@/lib/stat-calculator";
import { clampEVs } from "@/lib/ev-calculator";
import { exportShowdown, parseShowdown } from "@/lib/showdown-parser";
import { PageHeader } from "@/components/shared/PageHeader";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { useI18n } from "@/i18n";
import { BuildExport } from "./BuildExport";

interface Pokemon {
  dexNumber: number;
  nationalDex: number;
  name: string;
  types: string[];
  baseStats: Record<string, number>;
  evYield: { stat: string; amount: number }[];
  abilities: { name: string; isHidden: boolean }[];
  sprite: string;
  artwork: string;
  pokedex: string;
  height?: number;
  weight?: number;
  heldItems?: string[];
  isLegendary?: boolean;
  isMythical?: boolean;
  captureRate?: number;
  genderRate?: number;
  eggGroups?: string[];
  habitat?: string | null;
  generation?: string;
  color?: string;
  growthRate?: string;
  baseHappiness?: number;
  flavorText?: string;
  evolutionChainId?: number;
  baseExperience?: number | null;
  formVariants?: { name: string; id: number }[];
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
  priority: number;
  target: string;
  tm: number | null;
  effect?: string;
}

interface MoveMeta {
  id: number;
  name: string;
  meta: {
    ailment: string;
    category: string;
    minHits: number | null;
    maxHits: number | null;
    drain: number;
    healing: number;
    critRate: number;
    ailmentChance: number;
    flinchChance: number;
    statChance: number;
  } | null;
  statChanges: { stat: string; change: number }[];
}

const allPokemon = pokemonData as Pokemon[];
const natures = naturesData as Nature[];
const allMoves = movesData as Move[];
const allMoveMeta = moveMetaData as MoveMeta[];
const abilities = abilitiesData as { name: string; effect: string; shortEffect: string; flavorText: string }[];
const HELD_ITEMS = itemsData as { name: string; description: string; officialDescription: string; sprite: string }[];
const allTypesData = typesData as { name: string; weaknesses: string[]; resistances: string[]; immunities: string[] }[];

const STAT_COLORS: Record<StatName, string> = {
  HP: "#FF5959", Atk: "#F5AC78", Def: "#FAE078",
  SpA: "#9DB7F5", SpD: "#A7DB8D", Spe: "#FA92B2",
};

// ── Build State ───────────────────────────────────────────────────────────────

interface PokemonFallback {
  name: string;
  sprite: string;
  nationalDex: number;
}

interface BuildState {
  pokemon: Pokemon | null;
  /** Used when a tier list entry Pokémon is not in pokemon.json */
  pokemonFallback: PokemonFallback | null;
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
    pokemonFallback: null,
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

// ── Tier List Helpers ────────────────────────────────────────────────────────

const TIERS: TierRank[] = ["SS", "S", "A", "B", "C"];
const ROLES: RaidRole[] = ["physical", "special", "support"];

const ROLE_LABELS: Record<RaidRole, { pt: string; en: string; emoji: string }> = {
  physical: { pt: "Atacante Físico", en: "Physical Attacker", emoji: "⚔️" },
  special:  { pt: "Atacante Especial", en: "Special Attacker", emoji: "🔮" },
  support:  { pt: "Suporte", en: "Support", emoji: "🛡️" },
};

// ── Main Component ────────────────────────────────────────────────────────────

export function RaidBuildMaker() {
  const { t, locale } = useI18n();
  const [build, setBuild] = useLocalStorage<BuildState>("raid-builder-build", createEmptyBuild());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [tab, setTab] = useState<"build" | "tierlist">("build");
  const [tierFilter, setTierFilter] = useState<TierRank | "all">("all");
  const [roleFilter, setRoleFilter] = useState<RaidRole | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<RaidTierEntry | null>(null);

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

  // Calculated Defenses Matchups
  const defenses = useMemo(() => {
    const activeTypes = build.teraType ? [build.teraType] : (build.pokemon?.types || []);
    if (activeTypes.length === 0) return null;

    let multiplierMap: Record<string, number> = {};
    TYPES.forEach((t) => { multiplierMap[t] = 1; });

    activeTypes.forEach((t) => {
      const typeInfo = allTypesData.find((x) => x.name.toLowerCase() === t.toLowerCase());
      if (!typeInfo) return;
      typeInfo.weaknesses.forEach((w) => {
        if (multiplierMap[w]) multiplierMap[w] *= 2;
      });
      typeInfo.resistances.forEach((r) => {
        if (multiplierMap[r]) multiplierMap[r] *= 0.5;
      });
      typeInfo.immunities.forEach((i) => {
        if (multiplierMap[i]) multiplierMap[i] = 0;
      });
    });

    const weaknesses = Object.entries(multiplierMap).filter(([_, m]) => m > 1).map(([t, m]) => ({ type: t as PokemonType, mult: m }));
    const resistances = Object.entries(multiplierMap).filter(([_, m]) => m < 1 && m > 0).map(([t]) => t as PokemonType);
    const immunities = Object.entries(multiplierMap).filter(([_, m]) => m === 0).map(([t]) => t as PokemonType);

    return { weaknesses, resistances, immunities };
  }, [build.teraType, build.pokemon]);

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
      pokemonFallback: null,
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

  const pokemonName = build.pokemon?.name ?? build.pokemonFallback?.name ?? "";

  const exportText = useMemo(() => {
    if (!pokemonName) return "";
    return exportShowdown({
      name: pokemonName,
      item: build.item,
      ability: build.ability,
      teraType: build.teraType || "",
      nature: build.nature.name,
      evs: build.evs,
      ivs: build.ivs,
      moves: build.moves.filter(Boolean) as string[],
      level: build.level,
    });
  }, [build, pokemonName]);

  const loadTierBuild = useCallback((entry: RaidTierEntry, buildData: RaidBuild) => {
    // Alternate forms (have spriteId) share nationalDex with their base form,
    // so name-first avoids hitting the wrong variant (e.g. Calyrex-Shadow vs Ice Rider).
    // Standard Pokémon use nationalDex-first to handle name mismatches
    // (e.g. "Mimikyu" → "Mimikyu Disguised" in the JSON).
    const byName = allPokemon.find(
      (p) => p.name.toLowerCase() === entry.name.toLowerCase()
    );
    const byDex = allPokemon.find((p) => p.nationalDex === entry.nationalDex);
    const pokemon = entry.spriteId
      ? (byName ?? byDex)   // form: name is the unique key
      : (byDex ?? byName);  // standard: dex is more reliable

    const nature = natures.find(
      (n) => n.name.toLowerCase() === buildData.nature.toLowerCase()
    ) || natures[0];

    // Build a fallback for Pokémon not present in pokemon.json
    const spriteNum = entry.spriteId ?? entry.nationalDex;
    const fallback: PokemonFallback | null = pokemon ? null : {
      name: entry.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteNum}.png`,
      nationalDex: entry.nationalDex,
    };

    setBuild({
      pokemon: pokemon || null,
      pokemonFallback: fallback,
      teraType: buildData.teraType,
      nature,
      ability: buildData.ability,
      item: buildData.item,
      moves: [buildData.moves[0], buildData.moves[1], buildData.moves[2], buildData.moves[3]],
      evs: buildData.evs,
      ivs: Object.fromEntries(STAT_NAMES.map((s) => [s, 31])) as Record<StatName, number>,
      level: 100,
      notes: buildData.strategy,
    });
    setSelectedEntry(null);
    setTab("build");
  }, []);

  const filteredTierList = useMemo(() => {
    return RAID_TIER_LIST.filter((entry) => {
      if (tierFilter !== "all" && entry.tier !== tierFilter) return false;
      if (roleFilter !== "all" && entry.role !== roleFilter) return false;
      return true;
    });
  }, [tierFilter, roleFilter]);

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
          onClick={() => setTab("tierlist")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            tab === "tierlist" ? "bg-violet-500/15 text-white" : "text-gray-400"
          }`}
        >
          {t("raid.tabTierList")}
        </button>
      </div>

      {/* Tier List Tab */}
      {tab === "tierlist" && (
        <div>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Tier filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500">Tier</span>
              <div className="flex gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
                <button
                  onClick={() => setTierFilter("all")}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    tierFilter === "all" ? "bg-violet-500/20 text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t("common.all")}
                </button>
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tierFilter === tier ? "all" : tier)}
                    className={`rounded-md px-2.5 py-1 text-xs font-black transition-all ${
                      tierFilter === tier ? "text-white" : "text-gray-500 hover:text-gray-300"
                    }`}
                    style={tierFilter === tier ? { background: TIER_COLORS[tier] + "33" } : undefined}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500">Role</span>
              <div className="flex gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    roleFilter === "all" ? "bg-violet-500/20 text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t("common.all")}
                </button>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                      roleFilter === role ? "bg-violet-500/20 text-white" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {ROLE_LABELS[role].emoji} {locale === "pt" ? ROLE_LABELS[role].pt : ROLE_LABELS[role].en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tier groups */}
          {TIERS.map((tier) => {
            const entriesInTier = filteredTierList.filter((e) => e.tier === tier);
            if (entriesInTier.length === 0) return null;

            return (
              <div key={tier} className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="rounded-lg px-3 py-1 text-sm font-black text-white"
                    style={{ background: TIER_COLORS[tier] }}
                  >
                    {tier}
                  </span>
                  <span className="text-xs text-gray-500">
                    {locale === "pt" ? TIER_DESCRIPTIONS[tier].pt : TIER_DESCRIPTIONS[tier].en}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {entriesInTier.map((entry) => {
                    const spriteNum = entry.spriteId ?? entry.nationalDex;
                    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteNum}.png`;
                    const primaryBuild = entry.builds[0];
                    const isSelected = selectedEntry?.name === entry.name && selectedEntry?.role === entry.role;
                    return (
                      <div key={`${entry.name}-${entry.role}`} className="flex flex-col gap-1">
                        <button
                          onClick={() => setSelectedEntry(isSelected ? null : entry)}
                          className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                            isSelected
                              ? "border-violet-500/50 bg-violet-500/10"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sprite} alt={entry.name} width={48} height={48} className="pixelated" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-100">{entry.name}</span>
                              <span
                                className="rounded px-1.5 py-0.5 text-[10px] font-black text-white"
                                style={{ background: TIER_COLORS[entry.tier] + "AA" }}
                              >
                                {entry.tier}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="text-[10px] text-gray-500">
                                {ROLE_LABELS[entry.role].emoji} {locale === "pt" ? ROLE_LABELS[entry.role].pt : ROLE_LABELS[entry.role].en}
                              </span>
                              <span className="text-gray-700">·</span>
                              <TypeBadge type={primaryBuild.teraType as PokemonType} small />
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-gray-600">
                              <span>{primaryBuild.item}</span>
                              <span className="text-violet-400">{entry.builds.length} build{entry.builds.length > 1 ? "s" : ""} →</span>
                            </div>
                          </div>
                        </button>

                        {/* Build picker — expands below the card */}
                        {isSelected && (
                          <div className="col-span-full rounded-xl border border-violet-500/30 bg-gray-900/80 p-2">
                            <div className="mb-1.5 px-1 text-[10px] font-semibold text-gray-500">
                              {locale === "pt" ? "Selecione uma build:" : "Select a build:"}
                            </div>
                            {entry.builds.map((buildOption, idx) => (
                              <button
                                key={idx}
                                onClick={() => loadTierBuild(entry, buildOption)}
                                className="mb-1 w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-left transition-all hover:border-violet-500/30 hover:bg-violet-500/10 last:mb-0"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-200">{buildOption.name}</span>
                                  <TypeBadge type={buildOption.teraType as PokemonType} small />
                                </div>
                                <div className="mt-0.5 text-[10px] text-gray-500">
                                  {buildOption.nature} · {buildOption.ability} · {buildOption.item}
                                </div>
                                <div className="mt-0.5 text-[10px] text-gray-600">
                                  {buildOption.moves.join(" · ")}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredTierList.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              {t("common.noResults")}
            </div>
          )}
        </div>
      )}

      {/* Build Maker Tab */}
      {tab === "build" && (
        <div className="space-y-4">
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
              disabled={!build.pokemon && !build.pokemonFallback}
            >
              {t("raid.exportShowdown")}
            </button>
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
          {showExport && (build.pokemon || build.pokemonFallback) && (
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
                  <img src={build.pokemon.artwork} alt={build.pokemon.name} width={48} height={48} className="object-contain" />
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {build.pokemon.types.map((tp) => (
                        <TypeBadge key={tp} type={tp as PokemonType} small />
                      ))}
                      {build.pokemon.isLegendary && (
                        <span className="rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-[9px] font-bold text-yellow-300">★ Legendary</span>
                      )}
                      {build.pokemon.isMythical && (
                        <span className="rounded-full bg-pink-500/15 px-1.5 py-0.5 text-[9px] font-bold text-pink-300">✦ Mythical</span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      #{build.pokemon.nationalDex}
                      {build.pokemon.height ? ` · ${(build.pokemon.height / 10).toFixed(1)}m` : ""}
                      {build.pokemon.weight ? ` · ${(build.pokemon.weight / 10).toFixed(1)}kg` : ""}
                    </div>
                    {build.pokemon.flavorText && (
                      <p className="mt-1 text-[10px] italic leading-relaxed text-gray-500 line-clamp-2">
                        {build.pokemon.flavorText}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!build.pokemon && build.pokemonFallback && (
                <div className="mt-2 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={build.pokemonFallback.sprite} alt={build.pokemonFallback.name} width={40} height={40} className="pixelated" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-200">{build.pokemonFallback.name}</span>
                    <span className="text-[10px] text-amber-500/80">#{build.pokemonFallback.nationalDex} · {t("raid.statsUnavailable")}</span>
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
              {defenses && (
                <div className="mt-4 border-t border-white/5 pt-3">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">{t("raid.defensiveMatchup", { defaultValue: "Defensive Matchups" })}</div>
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {defenses.weaknesses.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="w-12 text-[10px] text-red-400">Weak:</span>
                        {defenses.weaknesses.map((w) => (
                          <div key={w.type} className="flex items-center">
                            <TypeBadge type={w.type} small />
                            <span className="ml-0.5 text-[9px] font-bold text-red-400">x{w.mult}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {defenses.resistances.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="w-12 text-[10px] text-green-400">Resist:</span>
                        {defenses.resistances.map((r) => (
                          <TypeBadge key={r} type={r} small />
                        ))}
                      </div>
                    )}
                    {defenses.immunities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="w-12 text-[10px] text-gray-400">Immune:</span>
                        {defenses.immunities.map((i) => (
                          <TypeBadge key={i} type={i} small />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              ) : build.ability ? (
                <input
                  type="text"
                  value={build.ability}
                  onChange={(e) => setBuild((prev) => ({ ...prev, ability: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100"
                />
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-500">
                  {t("raid.selectPokemon")}
                </div>
              )}
              {build.ability && (
                <div className="mt-2 rounded bg-black/20 p-2 text-[10px] text-gray-400">
                  {abilities.find(a => a.name === build.ability)?.shortEffect || "No description available."}
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
                  <div className="flex items-center gap-2">
                    {i.sprite && <img src={i.sprite} alt={i.name} className="h-6 w-6 pixelated" />}
                    <div>
                      <span className="font-semibold text-gray-100">{i.name}</span>
                      <span className="block text-[10px] text-gray-500">{i.description}</span>
                    </div>
                  </div>
                )}
                getLabel={(i) => i.name}
                placeholder={t("raid.searchItem")}
                filterFn={itemFilter}
              />
              {build.item && (() => {
                const selectedItem = HELD_ITEMS.find((i) => i.name === build.item);
                if (!selectedItem) return null;
                return (
                  <div className="mt-2 flex items-start gap-2 rounded bg-black/20 p-2">
                    {selectedItem.sprite && (
                      <img src={selectedItem.sprite} alt={selectedItem.name} className="h-6 w-6 shrink-0 pixelated" />
                    )}
                    <div className="flex-1 text-[10px] text-gray-400">
                      {selectedItem.officialDescription || selectedItem.description}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Moves */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-xs font-bold text-gray-400">{t("raid.moves")}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {build.moves.map((move, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-4 text-center text-xs font-bold text-gray-500">
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
                        <div className="flex w-full flex-col items-start">
                          <div className="flex w-full items-center gap-2">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ background: TYPE_COLORS[m.type as PokemonType] || "#888" }}
                            />
                            <span className="flex-1 truncate font-semibold text-gray-100">{m.name}</span>
                            <div className="flex shrink-0 items-center gap-1">
                              {m.tm !== null && (
                                <span className="rounded bg-yellow-500/20 px-1 py-0.5 text-[9px] font-bold text-yellow-400">
                                  TM{String(m.tm).padStart(3, "0")}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-500">
                                {m.category} {m.power ? `· ${m.power}bp` : ""}
                              </span>
                            </div>
                          </div>
                          {m.effect && (
                            <span className="mt-1 w-full truncate text-[10px] text-gray-500">
                              {m.effect}
                            </span>
                          )}
                        </div>
                      )}
                      getLabel={(m) => m.name}
                      placeholder={`Move ${i + 1}...`}
                      filterFn={moveFilter}
                    />
                    {move && (() => {
                      const selectedMove = allMoves.find((m) => m.name === move);
                      const moveKey = move.toLowerCase().replace(/ /g, "-");
                      const meta = allMoveMeta.find((m) => m.name === moveKey);
                      if (!selectedMove) return null;
                      return (
                        <div className="mt-1.5 space-y-1.5">
                          {selectedMove.effect && (
                            <div className="flex items-start gap-1.5 rounded bg-black/20 p-2">
                              <span className="text-[10px] text-blue-400/80">ⓘ</span>
                              <div className="flex-1 text-[10px] leading-relaxed text-blue-400/80">
                                {selectedMove.effect}
                              </div>
                            </div>
                          )}
                          {meta && (() => {
                            const tags: { label: string; color: string }[] = [];
                            // TM badge
                            if (selectedMove.tm !== null) tags.push({ label: `TM${String(selectedMove.tm).padStart(3, "0")}`, color: "#EAB308" });
                            // Priority
                            if (selectedMove.priority > 0) tags.push({ label: `Priority +${selectedMove.priority}`, color: "#06B6D4" });
                            if (selectedMove.priority < 0) tags.push({ label: `Priority ${selectedMove.priority}`, color: "#6B7280" });
                            // Target
                            const TARGET_LABELS: Record<string, string> = {
                              "all-opponents": "Hits all foes",
                              "all-other-pokemon": "Hits all others",
                              "entire-field": "Affects field",
                              "users-field": "User's field",
                              "opponents-field": "Foe's field",
                              "random-opponent": "Random foe",
                              "all-allies": "Hits all allies",
                              "ally": "Hits ally",
                              "all-pokemon": "Hits everyone",
                              "user-and-allies": "User + allies",
                            };
                            if (TARGET_LABELS[selectedMove.target]) {
                              tags.push({ label: TARGET_LABELS[selectedMove.target], color: "#818CF8" });
                            }
                            // Move meta
                            if (meta.meta) {
                              if (meta.meta.drain > 0) tags.push({ label: `Drain ${meta.meta.drain}%`, color: "#10B981" });
                              if (meta.meta.drain < 0) tags.push({ label: `Recoil ${Math.abs(meta.meta.drain)}%`, color: "#EF4444" });
                              if (meta.meta.healing > 0) tags.push({ label: `Heal ${meta.meta.healing}%`, color: "#34D399" });
                              if (meta.meta.critRate > 0) tags.push({ label: `Crit +${meta.meta.critRate}`, color: "#F59E0B" });
                              if (meta.meta.flinchChance > 0) tags.push({ label: `Flinch ${meta.meta.flinchChance}%`, color: "#8B5CF6" });
                              if (meta.meta.ailment !== "none" && meta.meta.ailmentChance > 0) tags.push({ label: `${meta.meta.ailment} ${meta.meta.ailmentChance}%`, color: "#EC4899" });
                              if (meta.meta.ailment !== "none" && meta.meta.ailmentChance === 0 && meta.meta.category !== "damage") tags.push({ label: meta.meta.ailment, color: "#EC4899" });
                              if (meta.meta.minHits && meta.meta.maxHits) {
                                const hitsLabel = meta.meta.minHits === meta.meta.maxHits
                                  ? `${meta.meta.minHits} hits`
                                  : `${meta.meta.minHits}–${meta.meta.maxHits} hits`;
                                tags.push({ label: hitsLabel, color: "#60A5FA" });
                              }
                            }
                            for (const sc of meta.statChanges) {
                              const sign = sc.change > 0 ? "+" : "";
                              tags.push({ label: `${sc.stat.toUpperCase()} ${sign}${sc.change}`, color: sc.change > 0 ? "#A3E635" : "#F87171" });
                            }
                            if (tags.length === 0) return null;
                            return (
                              <div className="flex flex-wrap gap-1">
                                {tags.map((tag, ti) => (
                                  <span
                                    key={ti}
                                    className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white/90"
                                    style={{ background: tag.color + "33", border: `1px solid ${tag.color}55`, color: tag.color }}
                                  >
                                    {tag.label}
                                  </span>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })()}
                  </div>
                  {move && (
                    <button
                      onClick={() => setBuild((prev) => {
                        const moves = [...prev.moves];
                        moves[i] = null;
                        return { ...prev, moves };
                      })}
                      className="mt-2 text-xs text-gray-500 hover:text-red-400"
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
              {/* <button
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
              </button> */}
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
                defenses={defenses}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
