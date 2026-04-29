"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { TypeChartGrid } from "./TypeChartGrid";
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
import { RAID_TIER_LIST, TAG_COLORS, TAG_NAMES, TAG_LABELS, type RaidTag, type RaidRole, type RaidTierEntry, type RaidBuild } from "@/data/raid-tier-list";
import { RAID_BOSSES } from "@/data/raid-bosses";
import { getBossAttackCategory, type BossAttackCategory } from "@/data/raid-boss-categories";
import { getBossRecommendations, type BossRecommendation } from "@/lib/raid-boss-finder";
import { STAT_NAMES, MAX_EV_PER_STAT, MAX_IV } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { calculateStat, getNatureModifier } from "@/lib/stat-calculator";
import { clampEVs } from "@/lib/ev-calculator";
import { exportShowdown, parseShowdown } from "@/lib/showdown-parser";
import { PageHeader } from "@/components/shared/PageHeader";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ToolDisclaimer } from "@/components/shared/ToolDisclaimer";
import { GuideBanner } from "@/components/shared/GuideBanner";
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
const EXTRA_HELD_ITEMS: { name: string; description: string; officialDescription: string; sprite: string }[] = [
  {
    name: "Earth Plate",
    description: "Boosts Ground-type moves and changes Arceus's type.",
    officialDescription: "An item to be held by a Pokémon. It boosts the power of Ground-type moves.",
    sprite: "",
  },
  {
    name: "Pixie Plate",
    description: "Boosts Fairy-type moves and changes Arceus's type.",
    officialDescription: "An item to be held by a Pokémon. It boosts the power of Fairy-type moves.",
    sprite: "",
  },
  {
    name: "Spooky Plate",
    description: "Boosts Ghost-type moves and changes Arceus's type.",
    officialDescription: "An item to be held by a Pokémon. It boosts the power of Ghost-type moves.",
    sprite: "",
  },
  {
    name: "Heat Rock",
    description: "Extends harsh sunlight created by the holder.",
    officialDescription: "An item to be held by a Pokémon. It extends the duration of Sunny Day.",
    sprite: "",
  },
];
const HELD_ITEMS = [
  ...(itemsData as { name: string; description: string; officialDescription: string; sprite: string }[]),
  ...EXTRA_HELD_ITEMS,
];
const allTypesData = typesData as { name: string; weaknesses: string[]; resistances: string[]; immunities: string[] }[];

const TYPE_ID: Record<string, number> = {
  Normal: 1, Fighting: 2, Flying: 3, Poison: 4, Ground: 5,
  Rock: 6, Bug: 7, Ghost: 8, Steel: 9, Fire: 10,
  Water: 11, Grass: 12, Electric: 13, Psychic: 14, Ice: 15,
  Dragon: 16, Dark: 17, Fairy: 18,
};
const SV_TYPE_SYMBOL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small";

function normalizeLookupName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findMoveByName(name: string) {
  const normalized = normalizeLookupName(name);
  return allMoves.find((move) => normalizeLookupName(move.name) === normalized);
}

function isDamagingMove(move: Move | undefined) {
  return Boolean(move && move.power !== null && move.power > 0 && move.category.toLowerCase() !== "status");
}

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

interface CustomTierEntry extends RaidTierEntry {
  isCustom: true;
  customId: string;
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
        className="w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100 placeholder-[var(--pt-text-dim)] outline-none focus:border-[var(--pt-gold)]"
      />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-surface)] shadow-xl">
            {filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => { onSelect(item); setOpen(false); setQuery(""); }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[var(--pt-card)]"
              >
                {renderItem(item)}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-[var(--pt-text-dim)]">{t("common.noResults")}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MatchupPills({
  items,
  emptyLabel,
}: {
  items: (PokemonType | TypeMatchupGroup)[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <span className="text-ui-base text-[var(--pt-text-dim)]">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => {
        const type = typeof item === "string" ? item : item.type;
        const multiplier = typeof item === "string" ? null : item.multiplier;
        return (
          <span
            key={`${type}-${multiplier ?? "plain"}`}
            className="inline-flex items-center gap-1 rounded-none border px-2 py-1 text-ui-sm font-bold text-white"
            style={{
              background: TYPE_COLORS[type] + "33",
              borderColor: TYPE_COLORS[type] + "99",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SV_TYPE_SYMBOL}/${TYPE_ID[type]}.png`} alt="" aria-hidden style={{ width: 14, height: 14 }} />
            {type}
            {multiplier !== null && <span className="text-white/70">{multiplier}x</span>}
          </span>
        );
      })}
    </div>
  );
}

// ── Tier List Helpers ────────────────────────────────────────────────────────

const ALL_TAGS: RaidTag[] = ["Solo Viable", "Top Pick", "7★ Ready", "Budget Pick", "Support Star", "Niche Pick"];
const ROLES: RaidRole[] = ["physical", "special", "support"];

const ROLE_LABELS: Record<RaidRole, { pt: string; en: string; emoji: string }> = {
  physical: { pt: "Atacante Físico", en: "Physical Attacker", emoji: "⚔️" },
  special:  { pt: "Atacante Especial", en: "Special Attacker", emoji: "🔮" },
  support:  { pt: "Suporte", en: "Support", emoji: "🛡️" },
};

interface TypeMatchupGroup {
  type: PokemonType;
  multiplier: number;
}

function getIncomingMultiplier(attackingType: PokemonType, defenderTypes: PokemonType[]) {
  return defenderTypes.reduce((multiplier, defenderType) => {
    const defenderData = allTypesData.find((type) => type.name === defenderType);
    if (!defenderData) return multiplier;

    if (defenderData.immunities.includes(attackingType)) return 0;
    if (defenderData.weaknesses.includes(attackingType)) return multiplier * 2;
    if (defenderData.resistances.includes(attackingType)) return multiplier * 0.5;
    return multiplier;
  }, 1);
}

function getDefensiveTypeMatchups(defenderTypes: PokemonType[]) {
  const groups = {
    superEffective: [] as TypeMatchupGroup[],
    notVeryEffective: [] as TypeMatchupGroup[],
    noEffect: [] as TypeMatchupGroup[],
    normal: [] as TypeMatchupGroup[],
  };

  TYPES.forEach((attackingType) => {
    const multiplier = getIncomingMultiplier(attackingType, defenderTypes);
    const matchup = { type: attackingType, multiplier };
    if (multiplier === 0) groups.noEffect.push(matchup);
    else if (multiplier > 1) groups.superEffective.push(matchup);
    else if (multiplier < 1) groups.notVeryEffective.push(matchup);
    else groups.normal.push(matchup);
  });

  return groups;
}

function getOffensiveTypeMatchups(attackingType: PokemonType) {
  const groups = {
    superEffective: [] as PokemonType[],
    notVeryEffective: [] as PokemonType[],
    noEffect: [] as PokemonType[],
  };

  allTypesData.forEach((defenderData) => {
    const defenderType = defenderData.name as PokemonType;
    if (defenderData.weaknesses.includes(attackingType)) groups.superEffective.push(defenderType);
    if (defenderData.resistances.includes(attackingType)) groups.notVeryEffective.push(defenderType);
    if (defenderData.immunities.includes(attackingType)) groups.noEffect.push(defenderType);
  });

  return groups;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function RaidBuildMaker() {
  const { t, locale } = useI18n();
  const [build, setBuild] = useLocalStorage<BuildState>("raid-builder-build", createEmptyBuild());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [tab, setTab] = useState<"build" | "tierlist" | "typechart">("build");
  const [tagFilter, setTagFilter] = useState<RaidTag | "all">("all");
  const [roleFilter, setRoleFilter] = useState<RaidRole | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<RaidTierEntry | null>(null);

  // Custom tier list entries (user-saved builds)
  const [customEntries, setCustomEntries] = useLocalStorage<CustomTierEntry[]>("raid-custom-tier-entries", []);
  const [showSaveTierList, setShowSaveTierList] = useState(false);
  const [saveBuildName, setSaveBuildName] = useState("");
  const [saveTags, setSaveTags] = useState<RaidTag[]>([]);
  const [saveRole, setSaveRole] = useState<RaidRole>("physical");

  // Boss Finder state
  const [bossFinderOpen, setBossFinderOpen] = useState(false);
  const [bossPokemon, setBossPokemon] = useState<Pokemon | null>(null);
  const [bossTeraType, setBossTeraType] = useState<PokemonType | null>(null);
  const [bossStars, setBossStars] = useState<5 | 6 | 7 | null>(null);
  const [typeChartPokemon, setTypeChartPokemon] = useState<Pokemon | null>(null);
  const [typeChartTypes, setTypeChartTypes] = useState<PokemonType[]>(["Dragon"]);

  // URL parameter hydration
  const searchParams = useSearchParams();
  const didApplyUrlParam = useRef(false);

  useEffect(() => {
    if (didApplyUrlParam.current) return;
    didApplyUrlParam.current = true;

    const buildParam = searchParams.get("b");
    if (buildParam) {
      try {
        const json = decodeURIComponent(escape(atob(buildParam)));
        const data = JSON.parse(json) as {
          p: number; t: string | null; n: string; a: string;
          i: string; m: (string | null)[]; e: Record<string, number>;
          v: Record<string, number>; l: number; o: string;
        };
        const pokemon = allPokemon.find((p) => p.nationalDex === data.p) ?? null;
        const nature = natures.find((n) => n.name === data.n) ?? natures[0];
        if (pokemon) {
          setBuild({
            pokemon,
            pokemonFallback: null,
            teraType: data.t as PokemonType | null,
            nature,
            ability: data.a,
            item: data.i,
            moves: (data.m as (string | null)[]).concat([null, null, null, null]).slice(0, 4) as (string | null)[],
            evs: data.e as Record<StatName, number>,
            ivs: data.v as Record<StatName, number>,
            level: data.l,
            notes: data.o,
          });
        }
      } catch {
        // malformed ?b= param — ignore silently
      }
      return;
    }

    const pokemonParam = searchParams.get("pokemon");
    if (!pokemonParam) return;
    const match = allPokemon.find(
      (p) => p.name.toLowerCase() === pokemonParam.toLowerCase()
    );
    if (match) {
      setBuild((prev) => ({ ...prev, pokemon: match, pokemonFallback: null }));
    }
  }, [searchParams, setBuild]);

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

    const multiplierMap: Record<string, number> = {};
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
  }, [setBuild]);

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
  }, [importText, setBuild]);

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
  }, [setBuild]);

  const allTierEntries = useMemo(
    () => [...(customEntries as RaidTierEntry[]), ...RAID_TIER_LIST],
    [customEntries]
  );

  const filteredTierList = useMemo(() => {
    return allTierEntries.filter((entry) => {
      if (tagFilter !== "all" && !entry.tags.includes(tagFilter)) return false;
      if (roleFilter !== "all" && entry.role !== roleFilter) return false;
      return true;
    });
  }, [allTierEntries, tagFilter, roleFilter]);

  const handleSaveToTierList = useCallback(() => {
    const pkmName = build.pokemon?.name ?? build.pokemonFallback?.name ?? "";
    const dex = build.pokemon?.nationalDex ?? build.pokemonFallback?.nationalDex ?? 0;
    const entry: CustomTierEntry = {
      isCustom: true,
      customId: String(Date.now()),
      name: pkmName,
      nationalDex: dex,
      tags: saveTags.length > 0 ? saveTags : ["Niche Pick"],
      role: saveRole,
      builds: [{
        name: saveBuildName.trim() || `Build de ${pkmName}`,
        teraType: build.teraType ?? "Normal",
        nature: build.nature.name,
        ability: build.ability,
        item: build.item,
        moves: [
          build.moves[0] ?? "—",
          build.moves[1] ?? "—",
          build.moves[2] ?? "—",
          build.moves[3] ?? "—",
        ] as [string, string, string, string],
        evs: build.evs,
        strategy: build.notes,
      }],
    };
    setCustomEntries((prev) => [...prev, entry]);
    setShowSaveTierList(false);
    setSaveBuildName("");
    setSaveTags([]);
    setTab("tierlist");
  }, [build, saveBuildName, saveTags, saveRole, setCustomEntries]);

  const handleDeleteCustomEntry = useCallback((customId: string) => {
    setCustomEntries((prev) => prev.filter((e) => e.customId !== customId));
  }, [setCustomEntries]);

  const bossAttackCategory = useMemo((): BossAttackCategory | null => {
    if (!bossPokemon) return null;
    return getBossAttackCategory(bossPokemon.name);
  }, [bossPokemon]);

  // Boss Finder: score tier list entries by type effectiveness against boss tera type
  const bossRecommendations = useMemo((): BossRecommendation[] => {
    if (!bossTeraType) return [];
    return getBossRecommendations(
      allTierEntries,
      bossTeraType,
      bossStars,
      bossAttackCategory,
      (bossPokemon?.types ?? []) as PokemonType[],
    );
  }, [allTierEntries, bossTeraType, bossStars, bossAttackCategory, bossPokemon]);

  const typeChartMatchups = useMemo(
    () => getDefensiveTypeMatchups(typeChartTypes),
    [typeChartTypes],
  );

  const offensiveTypeMatchups = useMemo(
    () => typeChartTypes.map((type) => ({ type, matchups: getOffensiveTypeMatchups(type) })),
    [typeChartTypes],
  );

  const handleTypeChartPokemonSelect = useCallback((pokemon: Pokemon) => {
    setTypeChartPokemon(pokemon);
    setTypeChartTypes(pokemon.types as PokemonType[]);
  }, []);

  const toggleTypeChartType = useCallback((type: PokemonType) => {
    setTypeChartPokemon(null);
    setTypeChartTypes((current) => {
      if (current.includes(type)) {
        return current.length === 1 ? current : current.filter((item) => item !== type);
      }
      return [...current, type].slice(-2);
    });
  }, []);

  const pokemonFilter = useCallback((p: Pokemon, q: string) => p.name.toLowerCase().includes(q), []);
  const moveFilter = useCallback((m: Move, q: string) => m.name.toLowerCase().includes(q), []);
  const itemFilter = useCallback((i: { name: string }, q: string) => i.name.toLowerCase().includes(q), []);

  const selectKnownBoss = useCallback((boss: typeof RAID_BOSSES[number]) => {
    const pokemon =
      allPokemon.find((p) => p.name.toLowerCase() === boss.name.toLowerCase()) ??
      allPokemon.find((p) => p.nationalDex === boss.nationalDex) ??
      null;
    setBossPokemon(pokemon);
    setBossTeraType(boss.teraType);
    setBossStars(boss.stars);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="⚔️"
        title={t("raid.title")}
        subtitle={t("raid.subtitle")}
        gradient="linear-gradient(135deg, #8B5CF6, #6D28D9, #4C1D95)"
      />

      <GuideBanner
        ptHref="/melhores-builds-tera-raid"
        enHref="/best-tera-raid-builds"
        label={t("common.guideRaidBuilds")}
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-none bg-[var(--pt-card)] p-1">
        <button
          onClick={() => setTab("build")}
          className={`flex-1 rounded-none px-4 py-2.5 text-sm font-bold transition-all ${
            tab === "build" ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"
          }`}
        >
          {t("raid.tabBuild")}
        </button>
        <button
          onClick={() => setTab("tierlist")}
          className={`flex-1 rounded-none px-4 py-2.5 text-sm font-bold transition-all ${
            tab === "tierlist" ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"
          }`}
        >
          {t("raid.tabTierList")}
        </button>
        <button
          onClick={() => setTab("typechart")}
          className={`flex-1 rounded-none px-4 py-2.5 text-sm font-bold transition-all ${
            tab === "typechart" ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"
          }`}
        >
          {locale === "pt" ? "Tipos" : "Types"}
        </button>
      </div>

      {/* Tier List Tab */}
      {tab === "tierlist" && (
        <div>
          {/* Boss Finder Panel */}
          <div className="mb-5 rounded-none border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.04)]">
            <button
              onClick={() => setBossFinderOpen(!bossFinderOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
                <div>
                  <span className="text-sm font-bold text-[var(--pt-gold)]">{t("raid.bossFinder")}</span>
                  {!bossTeraType && (
                    <span className="ml-2 text-xs text-[var(--pt-text-dim)]">{t("raid.bossFinderSubtitle")}</span>
                  )}
                  {bossTeraType && (
                    <div className="ml-2 flex flex-wrap items-center gap-1.5">
                      {bossPokemon && (
                        <>
                          <span className="text-xs font-bold text-[var(--pt-text)]">{bossPokemon.name}</span>
                          {bossPokemon.types.map((tp) => (
                            <TypeBadge key={tp} type={tp as PokemonType} small />
                          ))}
                          <span className="text-xs text-[var(--pt-text-dim)]">→</span>
                        </>
                      )}
                      {bossTeraType && <TypeBadge type={bossTeraType} small />}
                      {bossTeraType && <span className="text-xs text-[var(--pt-text-dim)]">Tera</span>}
                      {bossStars && <span className="text-xs font-bold text-yellow-400">{bossStars}★</span>}
                      <span className="text-xs text-[var(--pt-text-dim)]">· {bossRecommendations.length} builds</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-[var(--pt-text-dim)]">{bossFinderOpen ? "▲" : "▼"}</span>
            </button>

            {bossFinderOpen && (
              <div className="border-t border-[var(--pt-border-dim)] px-4 pb-4 pt-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Boss Pokemon search */}
                  <div>
                    <div className="mb-1.5 text-ui-base font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">
                      {locale === "pt" ? "Pokémon Boss (opcional)" : "Boss Pokémon (optional)"}
                    </div>
                    <SearchDropdown
                      items={allPokemon}
                      value={bossPokemon?.name || ""}
                      onSelect={(p) => setBossPokemon(p)}
                      renderItem={(p) => (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.sprite} alt={p.name} width={24} height={24} className="pixelated" />
                          <span className="font-semibold text-gray-100">{p.name}</span>
                          <span className="text-xs text-[var(--pt-text-dim)]">#{p.nationalDex}</span>
                        </>
                      )}
                      getLabel={(p) => p.name}
                      placeholder={t("raid.searchBoss")}
                      filterFn={pokemonFilter}
                    />
                    {bossPokemon && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bossPokemon.sprite} alt={bossPokemon.name} width={28} height={28} className="pixelated" />
                        <div className="flex flex-wrap gap-0.5">
                          {bossPokemon.types.map((tp) => (
                            <TypeBadge key={tp} type={tp as PokemonType} small />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Boss Tera Type */}
                  <div>
                    <div className="mb-1.5 text-ui-base font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">
                      {t("raid.bossTeraType")}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {TYPES.map((tp) => (
                        <button
                          key={tp}
                          onClick={() => setBossTeraType(bossTeraType === tp ? null : tp)}
                          className="flex items-center gap-1 rounded-none border px-2 py-0.5 text-ui-base font-bold text-white transition-all"
                          style={{
                            background: bossTeraType === tp ? TYPE_COLORS[tp] : "rgba(255,255,255,0.05)",
                            borderColor: bossTeraType === tp ? TYPE_COLORS[tp] : "rgba(255,255,255,0.1)",
                            opacity: bossTeraType === tp ? 1 : 0.5,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`${SV_TYPE_SYMBOL}/${TYPE_ID[tp]}.png`} alt="" aria-hidden style={{ width: 16, height: 16 }} />
                          {tp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Star level */}
                  <div>
                    <div className="mb-1.5 text-ui-base font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">
                      {t("raid.starLevel")}
                    </div>
                    <div className="flex gap-1.5">
                      {([5, 6, 7] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setBossStars(bossStars === s ? null : s)}
                          className={`rounded-none border px-3 py-1.5 text-sm font-bold transition-all ${
                            bossStars === s
                              ? "border-yellow-500/50 bg-yellow-500/15 text-yellow-300"
                              : "border-[var(--pt-border-dim)] bg-[var(--pt-card)] text-[var(--pt-text-dim)] hover:text-white"
                          }`}
                        >
                          {s}★
                        </button>
                      ))}
                    </div>
                    {bossTeraType && (
                      <button
                        onClick={() => { setBossPokemon(null); setBossTeraType(null); setBossStars(null); }}
                        className="mt-3 text-xs text-[var(--pt-text-dim)] underline hover:text-red-400"
                      >
                        {t("raid.clearBoss")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Known boss quick-select chips */}
                <div className="mt-3 border-t border-[var(--pt-border-dim)] pt-3">
                  <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">
                    {t("raid.knownBosses")}
                  </div>

                  {/* 7★ chips */}
                  <div className="mb-2">
                    <span className="mr-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs text-yellow-400">7★</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {RAID_BOSSES.filter((b) => b.stars === 7).map((boss) => {
                        const isActive = bossPokemon?.nationalDex === boss.nationalDex && bossTeraType === boss.teraType;
                        return (
                          <button
                            key={`${boss.name}-${boss.teraType}`}
                            onClick={() => selectKnownBoss(boss)}
                            className="flex items-center gap-1 rounded-none border px-2 py-0.5 text-ui-xs font-semibold transition-all"
                            style={{
                              borderColor: isActive ? TYPE_COLORS[boss.teraType] : "rgba(255,255,255,0.1)",
                              background: isActive ? TYPE_COLORS[boss.teraType] + "22" : "rgba(255,255,255,0.04)",
                              color: isActive ? TYPE_COLORS[boss.teraType] : "var(--pt-text-dim)",
                            }}
                          >
                            {boss.name}
                            <span
                              className="rounded px-1 text-ui-xs font-bold text-white"
                              style={{ background: TYPE_COLORS[boss.teraType] + "BB" }}
                            >
                              {boss.teraType}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6★ chips */}
                  <div>
                    <span className="mr-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs text-[var(--pt-text-dim)]">6★</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {RAID_BOSSES.filter((b) => b.stars === 6).map((boss) => {
                        const isActive = bossPokemon?.nationalDex === boss.nationalDex && bossTeraType === boss.teraType;
                        return (
                          <button
                            key={`${boss.name}-${boss.teraType}`}
                            onClick={() => selectKnownBoss(boss)}
                            className="flex items-center gap-1 rounded-none border px-2 py-0.5 text-ui-xs font-semibold transition-all"
                            style={{
                              borderColor: isActive ? TYPE_COLORS[boss.teraType] : "rgba(255,255,255,0.1)",
                              background: isActive ? TYPE_COLORS[boss.teraType] + "22" : "rgba(255,255,255,0.04)",
                              color: isActive ? TYPE_COLORS[boss.teraType] : "var(--pt-text-dim)",
                            }}
                          >
                            {boss.name}
                            <span
                              className="rounded px-1 text-ui-xs font-bold text-white"
                              style={{ background: TYPE_COLORS[boss.teraType] + "BB" }}
                            >
                              {boss.teraType}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommended builds section */}
          {bossTeraType && (
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-base">⭐</span>
                <span className="text-sm font-bold text-yellow-300">{t("raid.recommended")}</span>
                <span className="rounded-none bg-yellow-500/15 px-2 py-0.5 text-ui-base font-bold text-yellow-400">
                  {t("raid.recommendedCount", { count: bossRecommendations.length })}
                </span>
                {bossTeraType && (
                  <TypeBadge type={bossTeraType} small />
                )}
                {bossStars && (
                  <span className="text-xs font-bold text-[var(--pt-text-dim)]">{bossStars}★</span>
                )}
                {bossAttackCategory === "physical" && (
                  <span className="rounded-none border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-ui-sm font-bold text-orange-300">
                    ⚔️ {locale === "pt" ? "Físico — invista em DEF" : "Physical — invest in DEF"}
                  </span>
                )}
                {bossAttackCategory === "special" && (
                  <span className="rounded-none border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-ui-sm font-bold text-purple-300">
                    🔮 {locale === "pt" ? "Especial — invista em SpD" : "Special — invest in SpD"}
                  </span>
                )}
                {bossAttackCategory === "both" && (
                  <span className="rounded-none border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-ui-sm font-bold text-blue-300">
                    ⚔️🔮 {locale === "pt" ? "Físico+Especial — defesas equilibradas" : "Physical+Special — balanced defenses"}
                  </span>
                )}
              </div>

              {bossRecommendations.length === 0 ? (
                <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 text-sm text-[var(--pt-text-dim)]">
                  {t("raid.noBossRecommendations")}
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {bossRecommendations.map(({ entry, seMovesForBoss, seMoveTypesForBoss, counterMovesForBoss, bestBuildIndex }) => {
                    const spriteNum = entry.spriteId ?? entry.nationalDex;
                    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteNum}.png`;
                    const bestBuild = entry.builds[bestBuildIndex];
                    const isSelected = selectedEntry?.name === entry.name && selectedEntry?.role === entry.role;
                    return (
                      <div key={`rec-${entry.name}-${entry.role}`} className="flex flex-col gap-1">
                        <button
                          onClick={() => setSelectedEntry(isSelected ? null : entry)}
                          className={`group flex items-center gap-3 rounded-none border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                            isSelected
                              ? "border-yellow-500/50 bg-yellow-500/10"
                              : "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sprite} alt={entry.name} width={48} height={48} className="pixelated" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-gray-100">{entry.name}</span>
                              {entry.tags.slice(0, 1).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded px-1.5 py-0.5 text-ui-sm font-bold text-white"
                                  style={{ background: TAG_COLORS[tag] + "CC" }}
                                >
                                  {locale === "pt" ? TAG_NAMES[tag].pt : TAG_NAMES[tag].en}
                                </span>
                              ))}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <TypeBadge type={bestBuild.teraType as PokemonType} small />
                              <span className="text-ui-base text-[var(--pt-text-dim)]">{bestBuild.nature} · {bestBuild.ability}</span>
                            </div>
                            {seMovesForBoss.length > 0 && (
                              <div className="mt-1 flex flex-wrap items-center gap-0.5">
                                <span className="text-ui-sm font-bold text-green-400">{t("raid.coverageLabel")}</span>
                                {seMovesForBoss.map((mv) => {
                                  const moveData = findMoveByName(mv);
                                  const moveType = seMoveTypesForBoss[mv] ?? moveData?.type;
                                  return (
                                    <span
                                      key={mv}
                                      className="rounded px-1 py-0.5 text-ui-sm font-bold"
                                      style={{
                                        background: (TYPE_COLORS[moveType as PokemonType] || "#888") + "33",
                                        color: TYPE_COLORS[moveType as PokemonType] || "#aaa",
                                      }}
                                    >
                                      {mv} <span className="text-green-400">SE</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            {counterMovesForBoss.length > 0 && (
                              <div className="mt-1 flex flex-wrap items-center gap-0.5">
                                <span className="text-ui-sm font-bold text-sky-400">🛡️</span>
                                {counterMovesForBoss.map((mv) => (
                                  <span
                                    key={mv}
                                    className="rounded border border-sky-500/30 bg-sky-500/10 px-1 py-0.5 text-ui-sm font-bold text-sky-300"
                                  >
                                    {mv}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Build picker — same pattern as main tier list */}
                        {isSelected && (
                          <div className="rounded-none border border-yellow-500/30 bg-[var(--pt-surface)] p-2">
                            <div className="mb-1.5 px-1 text-ui-base font-semibold text-[var(--pt-text-dim)]">
                              {locale === "pt" ? "Selecione uma build:" : "Select a build:"}
                            </div>
                            {entry.builds.map((buildOption, idx) => (
                              <button
                                key={idx}
                                onClick={() => loadTierBuild(entry, buildOption)}
                                className="mb-1 w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-left transition-all hover:border-yellow-500/30 hover:bg-yellow-500/10 last:mb-0"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-200">{buildOption.name}</span>
                                  <TypeBadge type={buildOption.teraType as PokemonType} small />
                                </div>
                                <div className="mt-0.5 text-ui-base text-[var(--pt-text-dim)]">
                                  {buildOption.nature} · {buildOption.ability} · {buildOption.item}
                                </div>
                                <div className="mt-0.5 text-ui-base text-gray-600">
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
              )}

              <div className="mt-4 border-t border-[var(--pt-border-dim)] pt-4">
                <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-xs text-[var(--pt-gold)]">
                  {locale === "pt" ? "Guia Completo" : "Full Guide"}
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Tag filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--pt-text-dim)]">Tag</span>
              <div className="flex flex-wrap gap-0.5 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-0.5">
                <button
                  onClick={() => setTagFilter("all")}
                  className={`rounded-none px-2.5 py-1 text-xs font-bold transition-all ${
                    tagFilter === "all" ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)] hover:text-gray-300"
                  }`}
                >
                  {t("common.all")}
                </button>
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? "all" : tag)}
                    className={`rounded-none px-2.5 py-1 text-xs font-bold transition-all ${
                      tagFilter === tag ? "text-white" : "text-[var(--pt-text-dim)] hover:text-gray-300"
                    }`}
                    style={tagFilter === tag ? { background: TAG_COLORS[tag] + "33" } : undefined}
                    title={locale === "pt" ? TAG_LABELS[tag].pt : TAG_LABELS[tag].en}
                  >
                    {locale === "pt" ? TAG_NAMES[tag].pt : TAG_NAMES[tag].en}
                  </button>
                ))}
              </div>
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--pt-text-dim)]">Role</span>
              <div className="flex gap-0.5 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-0.5">
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`rounded-none px-2.5 py-1 text-xs font-bold transition-all ${
                    roleFilter === "all" ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)] hover:text-gray-300"
                  }`}
                >
                  {t("common.all")}
                </button>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
                    className={`rounded-none px-2.5 py-1 text-xs font-bold transition-all ${
                      roleFilter === role ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)] hover:text-gray-300"
                    }`}
                  >
                    {ROLE_LABELS[role].emoji} {locale === "pt" ? ROLE_LABELS[role].pt : ROLE_LABELS[role].en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role groups */}
          {ROLES.map((role) => {
            const entriesInRole = filteredTierList.filter((e) => e.role === role);
            if (entriesInRole.length === 0) return null;

            return (
              <div key={role} className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{ROLE_LABELS[role].emoji}</span>
                  <span className="text-sm font-bold text-gray-200">
                    {locale === "pt" ? ROLE_LABELS[role].pt : ROLE_LABELS[role].en}
                  </span>
                  <span className="text-xs text-gray-600">({entriesInRole.length})</span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {entriesInRole.map((entry) => {
                    const custom = (entry as CustomTierEntry).isCustom ? (entry as CustomTierEntry) : null;
                    const spriteNum = entry.spriteId ?? entry.nationalDex;
                    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteNum}.png`;
                    const primaryBuild = entry.builds[0];
                    const isSelected = selectedEntry?.name === entry.name && selectedEntry?.role === entry.role;
                    const cardKey = custom ? `custom-${custom.customId}` : `${entry.name}-${entry.role}`;
                    return (
                      <div key={cardKey} className="flex flex-col gap-1">
                        <div className={`group flex flex-col rounded-none border transition-all ${
                          isSelected
                            ? custom ? "border-emerald-500/60 bg-emerald-500/8" : "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)]"
                            : custom ? "border-emerald-500/25 bg-emerald-500/4 hover:border-emerald-500/50" : "border-[var(--pt-border-dim)] bg-[var(--pt-card)] hover:border-[var(--pt-gold)]"
                        }`}>
                          <button
                            onClick={() => setSelectedEntry(isSelected ? null : entry)}
                            className="flex items-center gap-3 p-3 text-left hover:-translate-y-0.5"
                          >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sprite} alt={entry.name} width={48} height={48} className="pixelated" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm font-bold text-gray-100">{entry.name}</span>
                              {custom && (
                                <span className="rounded px-1.5 py-0.5 text-ui-sm font-bold text-white" style={{ background: "#10B98199" }}>
                                  {locale === "pt" ? "Minha Build" : "My Build"}
                                </span>
                              )}
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded px-1.5 py-0.5 text-ui-sm font-bold text-white"
                                  style={{ background: TAG_COLORS[tag] + "CC" }}
                                  title={locale === "pt" ? TAG_LABELS[tag].pt : TAG_LABELS[tag].en}
                                >
                                  {locale === "pt" ? TAG_NAMES[tag].pt : TAG_NAMES[tag].en}
                                </span>
                              ))}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <TypeBadge type={primaryBuild.teraType as PokemonType} small />
                              <span className="text-ui-base text-[var(--pt-text-dim)]">{primaryBuild.nature} · {primaryBuild.ability}</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-ui-base text-gray-600">
                              <span>{primaryBuild.item}</span>
                              <span className="text-[var(--pt-gold)]">{entry.builds.length} build{entry.builds.length > 1 ? "s" : ""} →</span>
                            </div>
                          </div>
                          </button>
                          {custom && (
                            <button
                              onClick={() => handleDeleteCustomEntry(custom.customId)}
                              className="border-t border-emerald-500/20 px-3 py-1.5 text-left text-ui-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                            >
                              {locale === "pt" ? "Remover da Tier List" : "Remove from Tier List"}
                            </button>
                          )}
                        </div>

                        {/* Build picker — expands below the card */}
                        {isSelected && (
                          <div className={`col-span-full rounded-none border bg-[var(--pt-surface)] p-2 ${custom ? "border-emerald-500/40" : "border-[var(--pt-gold)]"}`}>
                            <div className="mb-1.5 px-1 text-ui-base font-semibold text-[var(--pt-text-dim)]">
                              {locale === "pt" ? "Selecione uma build:" : "Select a build:"}
                            </div>
                            {entry.builds.map((buildOption, idx) => (
                              <button
                                key={idx}
                                onClick={() => loadTierBuild(entry, buildOption)}
                                className={`mb-1 w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-left transition-all last:mb-0 ${custom ? "hover:border-emerald-500/40 hover:bg-emerald-500/8" : "hover:border-[var(--pt-gold)] hover:bg-[rgba(255,215,0,0.08)]"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-200">{buildOption.name}</span>
                                  <TypeBadge type={buildOption.teraType as PokemonType} small />
                                </div>
                                <div className="mt-0.5 text-ui-base text-[var(--pt-text-dim)]">
                                  {buildOption.nature} · {buildOption.ability} · {buildOption.item}
                                </div>
                                <div className="mt-0.5 text-ui-base text-gray-600">
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
            <div className="py-8 text-center text-sm text-[var(--pt-text-dim)]">
              {t("common.noResults")}
            </div>
          )}
        </div>
      )}

      {/* Type Chart Tab */}
      {tab === "typechart" && (
        <div className="space-y-5">
          <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              {/* Pokémon search */}
              <div>
                <div className="mb-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-gold)]">
                  {locale === "pt" ? "Verificar Pokémon" : "Check Pokémon"}
                </div>
                <SearchDropdown
                  items={allPokemon}
                  value={typeChartPokemon?.name || ""}
                  onSelect={handleTypeChartPokemonSelect}
                  renderItem={(pokemon) => (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pokemon.sprite} alt={pokemon.name} width={24} height={24} />
                      <span className="font-semibold text-gray-100">{pokemon.name}</span>
                      <span className="text-xs text-[var(--pt-text-dim)]">#{pokemon.nationalDex}</span>
                    </>
                  )}
                  getLabel={(pokemon) => pokemon.name}
                  placeholder={locale === "pt" ? "Buscar Pokémon..." : "Search Pokémon..."}
                  filterFn={pokemonFilter}
                />
              </div>

              {/* Selected Pokémon + types preview */}
              {(typeChartPokemon || typeChartTypes.length > 0) && (
                <div className="flex items-center gap-3 sm:justify-end">
                  {typeChartPokemon && (
                    <div className="flex flex-col items-center gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={typeChartPokemon.sprite}
                        alt={typeChartPokemon.name}
                        width={56}
                        height={56}
                        style={{ imageRendering: "pixelated" }}
                      />
                      <span className="text-[10px] font-bold text-gray-300">{typeChartPokemon.name}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {typeChartTypes.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Type selector */}
            <div className="mt-4">
              <div className="mb-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-gold)]">
                {locale === "pt" ? "Ou escolha até 2 tipos" : "Or choose up to 2 types"}
              </div>
              <div className="flex flex-wrap gap-1">
                {TYPES.map((type) => {
                  const selected = typeChartTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleTypeChartType(type)}
                      className="flex items-center gap-1 rounded-none border px-2.5 py-1 text-ui-base font-bold text-white transition-all"
                      style={{
                        background: selected ? TYPE_COLORS[type] : "rgba(255,255,255,0.05)",
                        borderColor: selected ? TYPE_COLORS[type] : "rgba(255,255,255,0.1)",
                        opacity: selected ? 1 : 0.55,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${SV_TYPE_SYMBOL}/${TYPE_ID[type]}.png`} alt="" aria-hidden style={{ width: 16, height: 16 }} />
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Type Flow Chart */}
          <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-3 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-gold)]">
              {locale === "pt" ? "Tabela de efetividade" : "Type flow chart"}
            </div>
            <TypeChartGrid highlightTypes={typeChartTypes} />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-none border border-red-500/30 bg-red-500/8 p-4">
              <div className="mb-2 text-sm font-bold text-red-300">
                {locale === "pt" ? "Super efetivo contra você" : "Super effective against you"}
              </div>
              <MatchupPills
                items={typeChartMatchups.superEffective}
                emptyLabel={locale === "pt" ? "Nenhuma fraqueza." : "No weaknesses."}
              />
            </div>

            <div className="rounded-none border border-sky-500/30 bg-sky-500/8 p-4">
              <div className="mb-2 text-sm font-bold text-sky-300">
                {locale === "pt" ? "Não muito efetivo contra você" : "Not very effective against you"}
              </div>
              <MatchupPills
                items={typeChartMatchups.notVeryEffective}
                emptyLabel={locale === "pt" ? "Nenhuma resistência." : "No resistances."}
              />
            </div>

            <div className="rounded-none border border-zinc-500/40 bg-zinc-500/10 p-4">
              <div className="mb-2 text-sm font-bold text-zinc-200">
                {locale === "pt" ? "Sem efeito contra você" : "No effect against you"}
              </div>
              <MatchupPills
                items={typeChartMatchups.noEffect}
                emptyLabel={locale === "pt" ? "Nenhuma imunidade." : "No immunities."}
              />
            </div>
          </div>

          <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-3 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-gold)]">
              {locale === "pt" ? "Referência ofensiva dos tipos selecionados" : "Offensive reference for selected types"}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {offensiveTypeMatchups.map(({ type, matchups }) => (
                <div key={type} className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-surface)] p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <TypeBadge type={type} small />
                    <span className="text-sm font-bold text-gray-100">
                      {locale === "pt" ? "Golpes deste tipo" : "Moves of this type"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 text-ui-base font-bold text-red-300">
                        {locale === "pt" ? "Super efetivo" : "Super effective"}
                      </div>
                      <MatchupPills
                        items={matchups.superEffective}
                        emptyLabel={locale === "pt" ? "Nenhum tipo." : "No types."}
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-ui-base font-bold text-sky-300">
                        {locale === "pt" ? "Não muito efetivo" : "Not very effective"}
                      </div>
                      <MatchupPills
                        items={matchups.notVeryEffective}
                        emptyLabel={locale === "pt" ? "Nenhum tipo." : "No types."}
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-ui-base font-bold text-zinc-200">
                        {locale === "pt" ? "Sem efeito" : "No effect"}
                      </div>
                      <MatchupPills
                        items={matchups.noEffect}
                        emptyLabel={locale === "pt" ? "Nenhum tipo." : "No types."}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Build Maker Tab */}
      {tab === "build" && (
        <div className="space-y-4">
          {/* Import/Export Bar */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-1.5 text-xs font-semibold text-[var(--pt-text-dim)] hover:text-white"
            >
              {t("raid.importShowdown")}
            </button>
            <button
              onClick={() => setShowExport(!showExport)}
              className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-1.5 text-xs font-semibold text-[var(--pt-text-dim)] hover:text-white"
              disabled={!build.pokemon && !build.pokemonFallback}
            >
              {t("raid.exportShowdown")}
            </button>
            <button
              onClick={() => setBuild(createEmptyBuild())}
              className="ml-auto rounded-none border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              {t("common.reset")}
            </button>
          </div>

          {/* Import Modal */}
          {showImport && (
            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-sm font-bold text-gray-300">
                {t("raid.pasteShowdown")}
              </div>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`Garchomp @ Choice Band\nAbility: Rough Skin\nTera Type: Dragon\nEVs: 252 Atk / 252 Spe / 4 HP\nJolly Nature\n- Earthquake\n- Outrage\n- Stone Edge\n- Swords Dance`}
                className="mb-2 h-40 w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-surface)] px-3 py-2 font-mono text-xs text-gray-100 placeholder-gray-600 outline-none"
              />
              <button
                onClick={handleImport}
                className="rounded-none border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-4 py-1.5 text-sm font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)] hover:bg-[rgba(255,215,0,0.15)]"
              >
                {t("raid.import")}
              </button>
            </div>
          )}

          {/* Export Modal */}
          {showExport && (build.pokemon || build.pokemonFallback) && (
            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-sm font-bold text-gray-300">
                {t("raid.showdownFormat")}
              </div>
              <textarea
                readOnly
                value={exportText}
                className="mb-2 h-40 w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-surface)] px-3 py-2 font-mono text-xs text-gray-100 outline-none"
              />
              <button
                onClick={() => { navigator.clipboard.writeText(exportText); }}
                className="rounded-none border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-4 py-1.5 text-sm font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)] hover:bg-[rgba(255,215,0,0.15)]"
              >
                {t("common.copy")}
              </button>
            </div>
          )}

          {/* Pokémon + Tera Type */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("common.pokemon")}</div>
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
                    <span className="text-xs text-[var(--pt-text-dim)]">#{p.nationalDex}</span>
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
                        <span className="rounded-none bg-yellow-500/15 px-1.5 py-0.5 text-ui-sm font-bold text-yellow-300">★ Legendary</span>
                      )}
                      {build.pokemon.isMythical && (
                        <span className="rounded-none bg-pink-500/15 px-1.5 py-0.5 text-ui-sm font-bold text-pink-300">✦ Mythical</span>
                      )}
                    </div>
                    <div className="text-ui-base text-[var(--pt-text-dim)]">
                      #{build.pokemon.nationalDex}
                      {build.pokemon.height ? ` · ${(build.pokemon.height / 10).toFixed(1)}m` : ""}
                      {build.pokemon.weight ? ` · ${(build.pokemon.weight / 10).toFixed(1)}kg` : ""}
                    </div>
                    {build.pokemon.flavorText && (
                      <p className="mt-1 text-ui-base italic leading-relaxed text-[var(--pt-text-dim)] line-clamp-2">
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
                    <span className="text-ui-base text-amber-500/80">#{build.pokemonFallback.nationalDex} · {t("raid.statsUnavailable")}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("raid.teraType")}</div>
              <div className="flex flex-wrap gap-1">
                {TYPES.map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setBuild((prev) => ({ ...prev, teraType: build.teraType === tp ? null : tp }))}
                    className="flex items-center gap-1 rounded-none border px-2 py-0.5 text-ui-base font-bold text-white transition-all"
                    style={{
                      background: build.teraType === tp ? TYPE_COLORS[tp] : "rgba(255,255,255,0.05)",
                      borderColor: build.teraType === tp ? TYPE_COLORS[tp] : "rgba(255,255,255,0.1)",
                      opacity: build.teraType === tp ? 1 : 0.5,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${SV_TYPE_SYMBOL}/${TYPE_ID[tp]}.png`} alt="" aria-hidden style={{ width: 16, height: 16 }} />
                    {tp}
                  </button>
                ))}
              </div>
              {defenses && (
                <div className="mt-4 border-t border-[var(--pt-border-dim)] pt-3">
                  <div className="text-ui-base font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("raid.defensiveMatchup", { defaultValue: "Defensive Matchups" })}</div>
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {defenses.weaknesses.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="w-12 text-ui-base text-red-400">Weak:</span>
                        {defenses.weaknesses.map((w) => (
                          <div key={w.type} className="flex items-center">
                            <TypeBadge type={w.type} small />
                            <span className="ml-0.5 text-ui-sm font-bold text-red-400">x{w.mult}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {defenses.resistances.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="w-12 text-ui-base text-green-400">Resist:</span>
                        {defenses.resistances.map((r) => (
                          <TypeBadge key={r} type={r} small />
                        ))}
                      </div>
                    )}
                    {defenses.immunities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="w-12 text-ui-base text-[var(--pt-text-dim)]">Immune:</span>
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
            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("common.nature")}</div>
              <select
                value={build.nature.name}
                onChange={(e) => {
                  const n = natures.find((x) => x.name === e.target.value);
                  if (n) setBuild((prev) => ({ ...prev, nature: n }));
                }}
                className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
              >
                {natures.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}{n.increased ? ` (+${n.increased}/-${n.decreased})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("common.ability")}</div>
              {build.pokemon ? (
                <select
                  value={build.ability}
                  onChange={(e) => setBuild((prev) => ({ ...prev, ability: e.target.value }))}
                  className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
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
                  className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
                />
              ) : (
                <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-[var(--pt-text-dim)]">
                  {t("raid.selectPokemon")}
                </div>
              )}
              {build.ability && (
                <div className="mt-2 rounded-none bg-black/20 p-2 text-ui-base text-[var(--pt-text-dim)]">
                  {abilities.find(a => a.name === build.ability)?.shortEffect || "No description available."}
                </div>
              )}
            </div>

            <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
              <div className="mb-2 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("raid.heldItem")}</div>
              <SearchDropdown
                items={HELD_ITEMS}
                value={build.item}
                onSelect={(i) => setBuild((prev) => ({ ...prev, item: i.name }))}
                renderItem={(i) => (
                  <div className="flex items-center gap-2">
                    {i.sprite && <img src={i.sprite} alt={i.name} className="h-6 w-6 pixelated" />}
                    <div>
                      <span className="font-semibold text-gray-100">{i.name}</span>
                      <span className="block text-ui-base text-[var(--pt-text-dim)]">{i.description}</span>
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
                    <div className="flex-1 text-ui-base text-[var(--pt-text-dim)]">
                      {selectedItem.officialDescription || selectedItem.description}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Moves */}
          <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-3 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("raid.moves")}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {build.moves.map((move, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-4 text-center text-xs font-bold text-[var(--pt-text-dim)]">
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
                              className="h-2 w-2 shrink-0 rounded-none"
                              style={{ background: TYPE_COLORS[m.type as PokemonType] || "#888" }}
                            />
                            <span className="flex-1 truncate font-semibold text-gray-100">{m.name}</span>
                            <div className="flex shrink-0 items-center gap-1">
                              {m.tm !== null && (
                                <span className="rounded bg-yellow-500/20 px-1 py-0.5 text-ui-sm font-bold text-yellow-400">
                                  TM{String(m.tm).padStart(3, "0")}
                                </span>
                              )}
                              <span className="text-ui-base text-[var(--pt-text-dim)]">
                                {m.category} {m.power ? `· ${m.power}bp` : ""}
                              </span>
                            </div>
                          </div>
                          {m.effect && (
                            <span className="mt-1 w-full truncate text-ui-base text-[var(--pt-text-dim)]">
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
                      const selectedMove = findMoveByName(move);
                      const moveKey = move.toLowerCase().replace(/ /g, "-");
                      const meta = allMoveMeta.find((m) => m.name === moveKey);
                      if (!selectedMove) return null;
                      return (
                        <div className="mt-1.5 space-y-1.5">
                          {selectedMove.effect && (
                            <div className="flex items-start gap-1.5 rounded bg-black/20 p-2">
                              <span className="text-ui-base text-blue-400/80">ⓘ</span>
                              <div className="flex-1 text-ui-base leading-relaxed text-blue-400/80">
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
                            for (const sc of (meta.statChanges ?? [])) {
                              const sign = sc.change > 0 ? "+" : "";
                              tags.push({ label: `${sc.stat.toUpperCase()} ${sign}${sc.change}`, color: sc.change > 0 ? "#A3E635" : "#F87171" });
                            }
                            if (tags.length === 0) return null;
                            return (
                              <div className="flex flex-wrap gap-1">
                                {tags.map((tag, ti) => (
                                  <span
                                    key={ti}
                                    className="rounded px-1.5 py-0.5 text-ui-sm font-bold text-white/90"
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
                      className="mt-2 text-xs text-[var(--pt-text-dim)] hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EVs + IVs + Stats */}
          <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">{t("raid.evsAndStats")}</div>
              <div className="text-xs text-[var(--pt-text-dim)]">
                {t("raid.evsCount", { count: totalEvs })}
              </div>
            </div>

            {/* Total EV bar */}
            <div className="mb-3 h-1.5 overflow-hidden rounded-none bg-white/10">
              <div
                className="h-full transition-all"
                style={{
                  width: `${(totalEvs / 510) * 100}%`,
                  background: totalEvs >= 510 ? "#10B981" : "var(--pt-gold)",
                }}
              />
            </div>

            <div className="space-y-2">
              {STAT_NAMES.map((stat) => {
                const mod = getNatureModifier(stat, build.nature.increased, build.nature.decreased);
                const finalStat = calcStats?.[stat] ?? 0;
                return (
                  <div key={stat} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-right text-xs font-bold text-[var(--pt-text-dim)]">
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
                      className="w-14 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-1.5 py-1 text-center text-xs text-gray-100"
                      title="EVs"
                    />
                    {/* Quick EV buttons */}
                    <div className="flex gap-0.5">
                      <button onClick={() => updateEV(stat, -4)} className="rounded-none bg-[var(--pt-card)] px-1 py-0.5 text-ui-sm font-bold text-[var(--pt-text-dim)] hover:bg-white/10">-4</button>
                      <button onClick={() => updateEV(stat, 4)} className="rounded-none bg-[var(--pt-card)] px-1 py-0.5 text-ui-sm font-bold text-[var(--pt-text-dim)] hover:bg-white/10">+4</button>
                      <button onClick={() => updateEV(stat, 252 - build.evs[stat])} className="rounded-none bg-[rgba(255,215,0,0.08)] px-1 py-0.5 text-ui-sm font-bold text-[var(--pt-gold)] hover:bg-[rgba(255,215,0,0.15)]">MAX</button>
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
                      className="w-12 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-1.5 py-1 text-center text-xs text-gray-100"
                      title="IVs"
                    />
                    {/* Nature indicator */}
                    <span className={`w-8 text-center text-ui-base font-bold ${
                      mod > 1 ? "text-emerald-400" : mod < 1 ? "text-red-400" : "text-gray-600"
                    }`}>
                      {mod > 1 ? "↑" : mod < 1 ? "↓" : ""}
                    </span>
                    {/* Stat bar + final */}
                    <div className="relative h-2 flex-1 overflow-hidden rounded-none bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 transition-all"
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
          <div className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
            <div className="mb-2 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]">
              {t("raid.notes")}
            </div>
            <textarea
              value={build.notes}
              onChange={(e) => setBuild((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder={t("raid.notesPlaceholder")}
              className="h-24 w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-surface)] px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none"
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
                  const hash = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
                  const url = `${window.location.origin}/raid-builder?b=${hash}`;
                  navigator.clipboard.writeText(url);
                }}
                className="border border-[var(--pt-border-dim)] px-4 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-[var(--pt-text-dim)] transition-colors hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]"
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
                defenses={defenses}
              />
            </div>
          )}

          {/* Save to Tier List */}
          {(build.pokemon || build.pokemonFallback) && (
            <>
              <button
                onClick={() => setShowSaveTierList(!showSaveTierList)}
                className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                {locale === "pt" ? "Salvar na Tier List" : "Save to Tier List"}
              </button>

              {showSaveTierList && (
                <div className="rounded-none border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="mb-3 text-xs font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-emerald-400">
                    {locale === "pt" ? "Cadastrar build na Tier List" : "Register build in Tier List"}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 text-ui-base text-[var(--pt-text-dim)]">
                        {locale === "pt" ? "Nome da build" : "Build name"}
                      </div>
                      <input
                        type="text"
                        value={saveBuildName}
                        onChange={(e) => setSaveBuildName(e.target.value)}
                        placeholder={`Build de ${build.pokemon?.name ?? build.pokemonFallback?.name ?? "Pokémon"}`}
                        className="w-full rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100 placeholder-[var(--pt-text-dim)] outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <div className="mb-1 text-ui-base text-[var(--pt-text-dim)]">Role</div>
                      <div className="flex flex-wrap gap-1">
                        {ROLES.map((role) => (
                          <button
                            key={role}
                            onClick={() => setSaveRole(role)}
                            className={`rounded-none border px-3 py-1.5 text-xs font-bold transition-all ${
                              saveRole === role
                                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                                : "border-[var(--pt-border-dim)] bg-[var(--pt-card)] text-[var(--pt-text-dim)] hover:text-white"
                            }`}
                          >
                            {ROLE_LABELS[role].emoji} {locale === "pt" ? ROLE_LABELS[role].pt : ROLE_LABELS[role].en}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-ui-base text-[var(--pt-text-dim)]">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {ALL_TAGS.map((tag) => {
                          const active = saveTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => setSaveTags((prev) =>
                                active ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )}
                              className="rounded px-2 py-0.5 text-xs font-bold text-white transition-all"
                              style={{
                                background: active ? TAG_COLORS[tag] + "CC" : "rgba(255,255,255,0.05)",
                                border: `1px solid ${active ? TAG_COLORS[tag] : "rgba(255,255,255,0.1)"}`,
                                opacity: active ? 1 : 0.5,
                              }}
                            >
                              {locale === "pt" ? TAG_NAMES[tag].pt : TAG_NAMES[tag].en}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSaveToTierList}
                        className="rounded-none border border-emerald-500/50 bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/25"
                      >
                        {locale === "pt" ? "Salvar" : "Save"}
                      </button>
                      <button
                        onClick={() => setShowSaveTierList(false)}
                        className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-4 py-2 text-sm text-[var(--pt-text-dim)] hover:text-white"
                      >
                        {locale === "pt" ? "Cancelar" : "Cancel"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <ToolDisclaimer
        toolName={t("nav.raidBuilder")}
        note={t("raid.disclaimerNote")}
        sources={[
          { label: "Serebii.net (Tera Raids)", url: "https://www.serebii.net/scarletviolet/teraraidbattles.shtml" },
          { label: "PokéAPI", url: "https://pokeapi.co/docs/v2#info" },
        ]}
      />
    </div>
  );
}
