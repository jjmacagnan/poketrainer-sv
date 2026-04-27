"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "@/components/ui/StatBar";
import type { PokemonType } from "@/data/types";
import { TYPE_COLORS } from "@/data/types";
import { STAT_NAMES } from "@/lib/constants";
import abilitiesData from "@/data/generated/abilities.json";
import itemsData from "@/data/generated/items.json";
import evolutionChainsData from "@/data/generated/evolution-chains.json";
import pokemonJsonData from "@/data/generated/pokemon.json";
import movesJsonData from "@/data/generated/moves.json";

const abilitiesList = abilitiesData as { name: string; effect: string; shortEffect: string; flavorText: string }[];
const itemsList = itemsData as { name: string; description: string; officialDescription: string; sprite: string }[];

interface MoveData {
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
  effect: string;
}

const movesLookup = (movesJsonData as MoveData[]).reduce<Record<string, MoveData>>(
  (acc, m) => {
    // key by normalized name: "Iron Defense" → "iron-defense"
    acc[m.name.toLowerCase().replace(/ /g, "-")] = m;
    return acc;
  },
  {}
);

function getMoveData(apiName: string): MoveData | undefined {
  return movesLookup[apiName.toLowerCase()];
}

// ── Static Evolution Chain Types ──────────────────────────────────────────────

interface StaticEvoDetail {
  trigger: string;
  minLevel: number | null;
  item: string | null;
  heldItem: string | null;
  knownMove: string | null;
  minHappiness: number | null;
  location: string | null;
  timeOfDay: string;
  needsOverworldRain: boolean;
}

interface StaticEvoNode {
  isBaby: boolean;
  species: string;
  evolutionDetails: StaticEvoDetail[];
  evolvesTo: StaticEvoNode[];
}

interface StaticEvoChain {
  id: number;
  babyTriggerItem: string | null;
  chain: StaticEvoNode;
}

const evolutionChains = evolutionChainsData as StaticEvoChain[];
const allPokemonForEvo = pokemonJsonData as { nationalDex: number; name: string }[];

function getSpeciesId(speciesName: string): number {
  const found = allPokemonForEvo.find(
    (p) => p.name.toLowerCase() === speciesName.toLowerCase()
  );
  return found?.nationalDex ?? 0;
}

function findEvolutionChain(speciesName: string): StaticEvoNode | null {
  const lower = speciesName.toLowerCase();
  function containsSpecies(node: StaticEvoNode): boolean {
    if (node.species === lower) return true;
    return node.evolvesTo.some(containsSpecies);
  }
  const chain = evolutionChains.find((c) => containsSpecies(c.chain));
  return chain ? chain.chain : null;
}

function formatStaticTrigger(detail: StaticEvoDetail): string {
  const { trigger, minLevel, item, heldItem, knownMove, minHappiness, location, timeOfDay } = detail;
  if (trigger === "level-up") {
    if (minLevel) return `Lv. ${minLevel}`;
    if (minHappiness) return "Friendship";
    if (knownMove) return `Know ${formatItemName(knownMove)}`;
    if (location) return `Level up at ${formatItemName(location)}`;
    if (timeOfDay) return `Level up (${timeOfDay})`;
    return "Level up";
  }
  if (trigger === "use-item" && item) return formatItemName(item);
  if (trigger === "use-move" && knownMove) return `Use ${formatItemName(knownMove)}`;
  if (trigger === "trade") {
    if (heldItem) return `Trade w/ ${formatItemName(heldItem)}`;
    return "Trade";
  }
  if (trigger === "shed") return "Shed";
  if (trigger === "spin") return "Spin";
  if (trigger === "three-critical-hits") return "3 Critical Hits";
  if (trigger === "take-damage") return "Take Damage";
  return capitalize(trigger ?? "");
}

function flattenStaticChain(root: StaticEvoNode): EvoStep[] {
  const steps: EvoStep[] = [];
  function walk(node: StaticEvoNode) {
    for (const child of node.evolvesTo) {
      steps.push({
        from: { name: node.species, id: getSpeciesId(node.species) },
        to: { name: child.species, id: getSpeciesId(child.species) },
        trigger: child.evolutionDetails.length > 0 ? formatStaticTrigger(child.evolutionDetails[0]) : "",
      });
      walk(child);
    }
  }
  walk(root);
  return steps;
}

import { TRAINING_LOCATIONS } from "@/data/training-locations";
import { useI18n } from "@/i18n";

export interface PokemonEntry {
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
  // Pre-cached species data (from pokemon-species endpoint)
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

// ── PokéAPI types ─────────────────────────────────────────────────────────────

interface PokemonApiData {
  base_experience: number | null;
  game_indices: { game_index: number; version: { name: string } }[];
  moves: {
    move: { name: string; url: string };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: { name: string };
      version_group: { name: string };
    }[];
  }[];
}

interface SVMove {
  name: string;
  level: number;
  method: string;
}

interface EvoStage {
  name: string;
  id: number;
}

interface EvoStep {
  from: EvoStage;
  to: EvoStage;
  trigger: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractId(url: string): number {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? parseInt(m[1]) : 0;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatItemName(name: string) {
  return name.split("-").map(capitalize).join(" ");
}

// ── Live chain fallback (for non-Gen9 Pokémon not in static data) ─────────────

interface LiveEvoNode {
  species: { name: string; url: string };
  evolution_details: {
    trigger: { name: string };
    min_level: number | null;
    item: { name: string } | null;
    held_item: { name: string } | null;
    happiness: number | null;
    time_of_day: string;
    known_move?: { name: string } | null;
    location?: { name: string } | null;
  }[];
  evolves_to: LiveEvoNode[];
}

function formatLiveTrigger(detail: LiveEvoNode["evolution_details"][0]): string {
  if (!detail) return "";
  const trigger = detail.trigger?.name;
  if (trigger === "level-up") {
    if (detail.min_level) return `Lv. ${detail.min_level}`;
    if (detail.happiness) return "Friendship";
    if (detail.known_move) return `Know ${formatItemName(detail.known_move.name)}`;
    if (detail.location) return `Level up at ${formatItemName(detail.location.name)}`;
    if (detail.time_of_day) return `Level up (${detail.time_of_day})`;
    return "Level up";
  }
  if (trigger === "use-item" && detail.item) return formatItemName(detail.item.name);
  if (trigger === "trade") {
    if (detail.held_item) return `Trade w/ ${formatItemName(detail.held_item.name)}`;
    return "Trade";
  }
  if (trigger === "shed") return "Shed";
  if (trigger === "spin") return "Spin";
  if (trigger === "three-critical-hits") return "3 Critical Hits";
  if (trigger === "take-damage") return "Take Damage";
  return capitalize(trigger ?? "");
}

function flattenLiveChain(node: LiveEvoNode): EvoStep[] {
  const steps: EvoStep[] = [];
  function walk(n: LiveEvoNode) {
    for (const child of n.evolves_to) {
      steps.push({
        from: { name: n.species.name, id: extractId(n.species.url) },
        to: { name: child.species.name, id: extractId(child.species.url) },
        trigger: formatLiveTrigger(child.evolution_details[0]),
      });
      walk(child);
    }
  }
  walk(node);
  return steps;
}

function formatGrowthRate(name: string): string {
  return name.split("-").map(capitalize).join(" ");
}

function genderLabel(rate: number): string {
  if (rate === -1) return "Genderless";
  if (rate === 0) return "100% ♂";
  if (rate === 8) return "100% ♀";
  const female = (rate / 8) * 100;
  return `${100 - female}% ♂ · ${female}% ♀`;
}

// ── Game availability map ──────────────────────────────────────────────────────

const GAME_META: Record<string, { label: string; name: string; color: string }> = {
  "red": { label: "RD", name: "Pokémon Red", color: "#CC0000" },
  "blue": { label: "BL", name: "Pokémon Blue", color: "#0000AA" },
  "yellow": { label: "YW", name: "Pokémon Yellow", color: "#FFD700" },
  "gold": { label: "GD", name: "Pokémon Gold", color: "#B8860B" },
  "silver": { label: "SV", name: "Pokémon Silver", color: "#C0C0C0" },
  "crystal": { label: "CY", name: "Pokémon Crystal", color: "#4FC3F7" },
  "ruby": { label: "RB", name: "Pokémon Ruby", color: "#B22222" },
  "sapphire": { label: "SP", name: "Pokémon Sapphire", color: "#1565C0" },
  "emerald": { label: "EM", name: "Pokémon Emerald", color: "#2E7D32" },
  "firered": { label: "FR", name: "Pokémon FireRed", color: "#FF6F00" },
  "leafgreen": { label: "LG", name: "Pokémon LeafGreen", color: "#388E3C" },
  "diamond": { label: "DM", name: "Pokémon Diamond", color: "#5C6BC0" },
  "pearl": { label: "PL", name: "Pokémon Pearl", color: "#EC407A" },
  "platinum": { label: "PT", name: "Pokémon Platinum", color: "#78909C" },
  "heartgold": { label: "HG", name: "Pokémon HeartGold", color: "#FFB300" },
  "soulsilver": { label: "SS", name: "Pokémon SoulSilver", color: "#90A4AE" },
  "black": { label: "BK", name: "Pokémon Black", color: "#212121" },
  "white": { label: "WT", name: "Pokémon White", color: "#EEEEEE" },
  "black-2": { label: "B2", name: "Pokémon Black 2", color: "#37474F" },
  "white-2": { label: "W2", name: "Pokémon White 2", color: "#CFD8DC" },
  "x": { label: "X", name: "Pokémon X", color: "#1565C0" },
  "y": { label: "Y", name: "Pokémon Y", color: "#C62828" },
  "omega-ruby": { label: "OR", name: "Pokémon Omega Ruby", color: "#B71C1C" },
  "alpha-sapphire": { label: "AS", name: "Pokémon Alpha Sapphire", color: "#1A237E" },
  "sun": { label: "SN", name: "Pokémon Sun", color: "#FF8F00" },
  "moon": { label: "MN", name: "Pokémon Moon", color: "#283593" },
  "ultra-sun": { label: "US", name: "Pokémon Ultra Sun", color: "#E65100" },
  "ultra-moon": { label: "UM", name: "Pokémon Ultra Moon", color: "#1A237E" },
  "sword": { label: "SW", name: "Pokémon Sword", color: "#1E88E5" },
  "shield": { label: "SH", name: "Pokémon Shield", color: "#E53935" },
  "brilliant-diamond": { label: "BD", name: "Brilliant Diamond", color: "#5E35B1" },
  "shining-pearl": { label: "SP2", name: "Shining Pearl", color: "#F06292" },
  "legends-arceus": { label: "LA", name: "Legends: Arceus", color: "#6D4C41" },
  "scarlet": { label: "SC", name: "Pokémon Scarlet", color: "#E53935" },
  "violet": { label: "VT", name: "Pokémon Violet", color: "#7B1FA2" },
};

function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function artworkUrl(id: number, shiny = false) {
  const base = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
  return shiny ? `${base}/shiny/${id}.png` : `${base}/${id}.png`;
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[3px] text-[var(--pt-gold)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--pt-text-dim)]">{label} · </span>
      <span className="font-semibold text-gray-200">{value}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PokemonDetailModal({
  pokemon,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: {
  pokemon: PokemonEntry;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  const [evoSteps, setEvoSteps] = useState<EvoStep[]>([]);
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [baseExperience, setBaseExperience] = useState<number | null>(null);
  const [svMoves, setSvMoves] = useState<SVMove[]>([]);
  const [showAllMoves, setShowAllMoves] = useState(false);
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [shiny, setShiny] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Species data is now pre-cached in pokemon.json — only fetch pokemon
      // endpoint for moves + game availability (too large to pre-cache per pokemon)
      const pkm = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.nationalDex}/`
      ).then((r) => r.json()) as PokemonApiData;

      setBaseExperience(pokemon.baseExperience ?? pkm.base_experience);
      setGameVersions(pkm.game_indices.map((g) => g.version.name));

      // Filter moves for Scarlet/Violet
      const moves: SVMove[] = [];
      for (const m of pkm.moves) {
        for (const vgd of m.version_group_details) {
          if (vgd.version_group.name === "scarlet-violet") {
            moves.push({
              name: m.move.name,
              level: vgd.level_learned_at,
              method: vgd.move_learn_method.name,
            });
          }
        }
      }
      moves.sort((a, b) => {
        const methodOrder: Record<string, number> = { "level-up": 0, "machine": 1, "egg": 2, "tutor": 3 };
        const ma = methodOrder[a.method] ?? 4;
        const mb = methodOrder[b.method] ?? 4;
        if (ma !== mb) return ma - mb;
        if (a.method === "level-up") return a.level - b.level;
        return a.name.localeCompare(b.name);
      });
      setSvMoves(moves);

      // Try static evolution chain first (Gen 9), fall back to live fetch
      // using pre-cached evolutionChainId (avoids fetching species just for this)
      const staticChain = findEvolutionChain(pokemon.name);
      if (staticChain) {
        setEvoSteps(flattenStaticChain(staticChain));
      } else if (pokemon.evolutionChainId) {
        const chain = await fetch(
          `https://pokeapi.co/api/v2/evolution-chain/${pokemon.evolutionChainId}/`
        ).then((r) => r.json());
        setEvoSteps(flattenLiveChain(chain.chain));
      }
    } catch {
      // silently fail — data might just not be available
    } finally {
      setLoading(false);
    }
  }, [pokemon.nationalDex, pokemon.name, pokemon.evolutionChainId, pokemon.baseExperience]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Use pre-cached data; fall back to species live data for backward compat
  const flavorText = pokemon.flavorText ?? "";

  const totalStats = STAT_NAMES.reduce((s, stat) => s + (pokemon.baseStats[stat] ?? 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col border-2 border-[var(--pt-gold)] bg-[var(--pt-bg)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nav + Close bar — outside scroll area so always visible */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2">
          <div className="flex items-center gap-1">
            {(onPrev || onNext) && (
              <>
                <button
                  onClick={onPrev}
                  disabled={!hasPrev}
                  title="Previous (←)"
                  className="flex items-center gap-1.5 border border-[var(--pt-border-dim)] px-2.5 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[1px] text-[var(--pt-text-dim)] transition-colors hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t("common.prev")}
                </button>
                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  title="Next (→)"
                  className="flex items-center gap-1.5 border border-[var(--pt-border-dim)] px-2.5 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[1px] text-[var(--pt-text-dim)] transition-colors hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {t("common.next")}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="border border-[var(--pt-border-dim)] p-1.5 text-[var(--pt-text-dim)] hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row">
          {/* Artwork */}
          <div className="flex shrink-0 flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artworkUrl(pokemon.nationalDex, shiny)}
              alt={pokemon.name}
              width={140}
              height={140}
              className="drop-shadow-lg"
            />
            <button
              onClick={() => setShiny(!shiny)}
              className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] transition-all ${shiny
                  ? "border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                  : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
                }`}
            >
              ✨ Shiny
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2 text-xs text-[var(--pt-text-dim)]">
              <span className="font-mono">#{String(pokemon.nationalDex).padStart(4, "0")}</span>
              <span>·</span>
              <span className="capitalize">{pokemon.pokedex}</span>
              {pokemon.isLegendary && (
                <span className="border border-[rgba(255,215,0,0.3)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase text-[var(--pt-gold)]">
                  Legendary
                </span>
              )}
              {pokemon.isMythical && (
                <span className="border border-pink-500/30 px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase text-pink-300">
                  Mythical
                </span>
              )}
            </div>

            <h2 className="mb-2 text-3xl font-black text-white">{pokemon.name}</h2>

            <div className="mb-3 flex gap-1.5">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type as PokemonType} />
              ))}
            </div>

            {/* Pokédex entry */}
            {flavorText && (
              <p className="mb-3 text-sm italic leading-relaxed text-[var(--pt-text-dim)]">
                &ldquo;{flavorText}&rdquo;
              </p>
            )}

            {/* General Info grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {pokemon.height !== undefined && (
                <InfoRow label="Height" value={`${(pokemon.height / 10).toFixed(2)} m`} />
              )}
              {pokemon.weight !== undefined && (
                <InfoRow label="Weight" value={`${(pokemon.weight / 10).toFixed(2)} kg`} />
              )}
              {pokemon.color && (
                <InfoRow label="Color" value={capitalize(pokemon.color)} />
              )}
              {pokemon.genderRate !== undefined && (
                <InfoRow label="Gender" value={genderLabel(pokemon.genderRate)} />
              )}
              {pokemon.habitat && (
                <InfoRow label="Habitat" value={capitalize(pokemon.habitat)} />
              )}
              {pokemon.generation && (
                <InfoRow
                  label="Generation"
                  value={`Gen ${pokemon.generation}`}
                />
              )}
              <InfoRow label="Region" value={capitalize(pokemon.pokedex)} />
              {baseExperience !== null && (
                <InfoRow label="Base EXP" value={String(baseExperience)} />
              )}
              {pokemon.captureRate !== undefined && (
                <InfoRow label="Catch Rate" value={String(pokemon.captureRate)} />
              )}
              {pokemon.growthRate && (
                <InfoRow label="Growth" value={formatGrowthRate(pokemon.growthRate)} />
              )}
              {pokemon.abilities.length > 0 && (
                <div className="col-span-2">
                  <span className="text-[var(--pt-text-dim)]">Abilities · </span>
                  <span className="text-gray-200">
                    {pokemon.abilities
                      .map((a) => a.isHidden ? `${a.name} (Hidden)` : a.name)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 border-t border-[var(--pt-border-dim)] p-6">

          {/* Game Availability */}
          <Section title="Game Availability">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-none border-2 border-[var(--pt-border-dim)] border-t-transparent" />
            ) : gameVersions.length === 0 ? (
              <p className="text-sm text-[var(--pt-text-dim)]">No data</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {gameVersions.map((version) => {
                  const meta = GAME_META[version];
                  if (!meta) return null;
                  return (
                    <div key={version} className="group relative">
                      <span
                        className="inline-flex h-7 w-9 cursor-default items-center justify-center rounded-none text-ui-base font-black text-white"
                        style={{ backgroundColor: meta.color + "CC", border: `1px solid ${meta.color}` }}
                      >
                        {meta.label}
                      </span>
                      {/* Custom tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-none bg-gray-800 px-2.5 py-1 text-ui-md font-semibold text-white opacity-0 shadow-xl ring-1 ring-[var(--pt-border-dim)] transition-opacity duration-150 group-hover:opacity-100">
                        {meta.name}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Encounter Locations (SV) */}
          {/* <Section title="Encounter Locations (Scarlet / Violet)">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-none border-2 border-[var(--pt-border-dim)] border-t-transparent" />
            ) : encounters.length === 0 ? (
              <p className="text-sm text-[var(--pt-text-dim)]">No wild encounter data for Scarlet/Violet</p>
            ) : (
              <div className="space-y-1.5">
                {encounters.map((enc, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-gray-200">{enc.location}</span>
                    {enc.levels && (
                      <span className="text-xs text-[var(--pt-text-dim)]">{enc.levels}</span>
                    )}
                    {enc.method && (
                      <span className="rounded-none bg-[rgba(255,215,0,0.08)] px-1.5 py-0.5 text-ui-base font-semibold text-[var(--pt-gold)]">
                        {enc.method}
                      </span>
                    )}
                    <span className="ml-auto text-ui-base text-gray-600">
                      {enc.versions.join(" / ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section> */}

          {/* Training Habitat (Best Spots) */}
          {(() => {
            const trainingSpot = TRAINING_LOCATIONS[pokemon.name];
            if (!trainingSpot) return null;
            return (
              <Section title={t("evPokedex.trainingTitle")}>
                <div className="rounded-none border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    <span className="text-sm font-bold text-emerald-300">{t("evPokedex.trainingDungeon")}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-ui-base font-bold text-emerald-500/70 uppercase">{t("evPokedex.trainingLocation")}</div>
                      <div className="text-xs font-semibold text-gray-200">{trainingSpot.location[locale as "pt" | "en"]}</div>
                    </div>
                    <div>
                      <div className="text-ui-base font-bold text-emerald-500/70 uppercase">{t("evPokedex.sandwichTip")}</div>
                      <div className="text-xs font-semibold text-gray-200">{trainingSpot.sandwich[locale as "pt" | "en"]}</div>
                      <div className="text-ui-sm text-emerald-500/60">{trainingSpot.sandwich.effect}</div>
                    </div>
                  </div>
                </div>
              </Section>
            );
          })()}

          {/* Abilities */}
          <Section title="Abilities">
            <div className="flex flex-col gap-2">
              {pokemon.abilities.map((a) => {
                const abilityData = abilitiesList.find((ab) => ab.name === a.name);
                return (
                  <div
                    key={a.name}
                    className={`flex flex-col border px-3 py-2 ${a.isHidden
                        ? "border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.04)]"
                        : "border-[var(--pt-border-dim)] bg-[var(--pt-card)]"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className={`text-sm font-bold ${a.isHidden ? "text-[var(--pt-gold)]" : "text-gray-200"}`}>
                        {a.name}
                      </span>
                      {a.isHidden && (
                        <span className="ml-2 border border-[rgba(255,215,0,0.3)] px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase text-[var(--pt-gold)]">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    {(abilityData?.shortEffect || abilityData?.flavorText) && (
                      <p className="mt-1 text-ui-md leading-relaxed text-[var(--pt-text-dim)]">
                        {abilityData.shortEffect || abilityData.flavorText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* EV Yield */}
          <Section title="EV Yield">
            <div className="flex flex-wrap gap-2">
              {pokemon.evYield.map((ev) => (
                <span
                  key={ev.stat}
                  className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-base uppercase text-emerald-300"
                >
                  +{ev.amount} {ev.stat}
                </span>
              ))}
            </div>
          </Section>

          {/* Base Stats */}
          <Section title={`Base Stats · BST ${totalStats}`}>
            <div className="space-y-1.5">
              {STAT_NAMES.map((stat) => (
                <StatBar
                  key={stat}
                  label={stat}
                  value={pokemon.baseStats[stat] ?? 0}
                />
              ))}
            </div>
          </Section>

          {/* Movepool (SV) */}
          <Section title={`Movepool — Scarlet / Violet${svMoves.length > 0 ? ` (${svMoves.length})` : ""}`}>
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-none border-2 border-[var(--pt-border-dim)] border-t-transparent" />
            ) : svMoves.length === 0 ? (
              <p className="text-sm text-[var(--pt-text-dim)]">No move data for Scarlet/Violet</p>
            ) : (() => {
              const levelUp = svMoves.filter((m) => m.method === "level-up");
              const tm = svMoves.filter((m) => m.method === "machine");
              const egg = svMoves.filter((m) => m.method === "egg");
              const tutor = svMoves.filter((m) => m.method === "tutor");
              const visibleLimit = showAllMoves ? Infinity : 12;

              return (
                <div className="space-y-3">
                  {/* Level-up moves */}
                  {levelUp.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-emerald-400">Level Up ({levelUp.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {levelUp.slice(0, visibleLimit).map((m) => {
                          const md = getMoveData(m.name);
                          return (
                            <span
                              key={`lu-${m.name}`}
                              className="inline-flex items-center gap-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-xs text-[var(--pt-text)]"
                              title={md?.effect ?? ""}
                            >
                              <span className="font-mono text-ui-base text-emerald-400/70 w-4 text-center">
                                {m.level > 0 ? m.level : "—"}
                              </span>
                              {md && (
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: TYPE_COLORS[md.type as PokemonType] ?? "#888" }}
                                />
                              )}
                              <span>{formatItemName(m.name)}</span>
                              {md?.power && (
                                <span className="text-ui-sm text-[var(--pt-text-dim)]">{md.power}</span>
                              )}
                            </span>
                          );
                        })}
                        {!showAllMoves && levelUp.length > visibleLimit && (
                          <span className="text-xs text-gray-600">+{levelUp.length - visibleLimit} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TM moves */}
                  {tm.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-blue-400">TM ({tm.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tm.slice(0, visibleLimit).map((m) => {
                          const md = getMoveData(m.name);
                          return (
                            <span
                              key={`tm-${m.name}`}
                              className="inline-flex items-center gap-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-xs text-[var(--pt-text)]"
                              title={md?.effect ?? ""}
                            >
                              {md?.tm !== null && md?.tm !== undefined && (
                                <span className="font-mono text-ui-sm font-bold text-yellow-500/80">
                                  TM{String(md.tm).padStart(3, "0")}
                                </span>
                              )}
                              {md && (
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: TYPE_COLORS[md.type as PokemonType] ?? "#888" }}
                                />
                              )}
                              <span>{formatItemName(m.name)}</span>
                              {md?.power && (
                                <span className="text-ui-sm text-[var(--pt-text-dim)]">{md.power}</span>
                              )}
                            </span>
                          );
                        })}
                        {!showAllMoves && tm.length > visibleLimit && (
                          <span className="text-xs text-gray-600">+{tm.length - visibleLimit} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Egg moves */}
                  {egg.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-pink-400">Egg ({egg.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {egg.map((m) => {
                          const md = getMoveData(m.name);
                          return (
                            <span
                              key={`egg-${m.name}`}
                              className="inline-flex items-center gap-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-xs text-[var(--pt-text)]"
                              title={md?.effect ?? ""}
                            >
                              {md && (
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: TYPE_COLORS[md.type as PokemonType] ?? "#888" }}
                                />
                              )}
                              <span>{formatItemName(m.name)}</span>
                              {md?.power && (
                                <span className="text-ui-sm text-[var(--pt-text-dim)]">{md.power}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tutor moves */}
                  {tutor.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-amber-400">Tutor ({tutor.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.map((m) => {
                          const md = getMoveData(m.name);
                          return (
                            <span
                              key={`tut-${m.name}`}
                              className="inline-flex items-center gap-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-xs text-[var(--pt-text)]"
                              title={md?.effect ?? ""}
                            >
                              {md && (
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: TYPE_COLORS[md.type as PokemonType] ?? "#888" }}
                                />
                              )}
                              <span>{formatItemName(m.name)}</span>
                              {md?.power && (
                                <span className="text-ui-sm text-[var(--pt-text-dim)]">{md.power}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Show all toggle */}
                  {(showAllMoves || svMoves.length > 12) && (
                    <button
                      onClick={() => setShowAllMoves(!showAllMoves)}
                      className="text-xs font-semibold text-[var(--pt-gold)] hover:text-[var(--pt-gold)]"
                    >
                      {showAllMoves ? "Show less" : `Show all ${svMoves.length} moves`}
                    </button>
                  )}
                </div>
              );
            })()}
          </Section>

          {/* Egg Groups */}
          {pokemon.eggGroups && pokemon.eggGroups.length > 0 && (
            <Section title="Egg Groups">
              <div className="flex gap-2">
                {pokemon.eggGroups.map((eg) => (
                  <span
                    key={eg}
                    className="rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-1.5 text-sm text-gray-300"
                  >
                    {eg}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Held Items */}
          {pokemon.heldItems && pokemon.heldItems.length > 0 && (
            <Section title="Wild Held Items">
              <div className="flex flex-col gap-2">
                {pokemon.heldItems.map((itemName) => {
                  const itemData = itemsList.find((i) => i.name === itemName);
                  return (
                    <div
                      key={itemName}
                      className="flex items-start gap-3 rounded-none border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2"
                    >
                      {itemData?.sprite ? (
                        <Image src={itemData.sprite} alt={itemName} width={32} height={32} className="h-8 w-8 shrink-0 pixelated" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[var(--pt-card)] text-ui-base text-white/40">
                          ?
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-200">{itemName}</span>
                        {(itemData?.officialDescription || itemData?.description) && (
                          <p className="mt-0.5 text-ui-base leading-relaxed text-[var(--pt-text-dim)]">
                            {itemData.officialDescription || itemData.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Evolution Chain */}
          <Section title="Evolution Chain">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-[var(--pt-text-dim)]">
                <div className="h-4 w-4 animate-spin rounded-none border-2 border-[var(--pt-border-dim)] border-t-transparent" />
                Loading...
              </div>
            ) : evoSteps.length === 0 ? (
              <p className="text-sm text-[var(--pt-text-dim)]">Does not evolve</p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  // Render all unique stages in order
                  const rendered = new Set<number>();
                  const nodes: React.ReactNode[] = [];

                  for (const step of evoSteps) {
                    if (!rendered.has(step.from.id)) {
                      rendered.add(step.from.id);
                      nodes.push(
                        <EvoSprite
                          key={`from-${step.from.id}`}
                          id={step.from.id}
                          name={step.from.name}
                          active={step.from.id === pokemon.nationalDex}
                        />
                      );
                    }
                    nodes.push(
                      <div key={`arrow-${step.from.id}-${step.to.id}`} className="flex flex-col items-center text-center">
                        <span className="text-gray-600">→</span>
                        {step.trigger && (
                          <span className="max-w-[80px] text-ui-sm font-semibold text-[var(--pt-gold)]">
                            {step.trigger}
                          </span>
                        )}
                      </div>
                    );
                    if (!rendered.has(step.to.id)) {
                      rendered.add(step.to.id);
                      nodes.push(
                        <EvoSprite
                          key={`to-${step.to.id}`}
                          id={step.to.id}
                          name={step.to.name}
                          active={step.to.id === pokemon.nationalDex}
                        />
                      );
                    }
                  }
                  return nodes;
                })()}
              </div>
            )}
          </Section>

          {/* Alternate Forms */}
          {pokemon.formVariants && pokemon.formVariants.length > 0 && (
            <Section title="Other Forms">
              <div className="flex flex-wrap gap-3">
                {pokemon.formVariants.map((v) => (
                  <div key={v.name} className="flex flex-col items-center gap-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${v.id}.png`}
                      alt={v.name}
                      width={56}
                      height={56}
                      className="pixelated"
                    />
                    <span className="text-ui-base text-[var(--pt-text-dim)]">{v.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Shiny Sprite */}
          <Section title="Shiny">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.nationalDex}.png`}
                alt={`${pokemon.name} shiny`}
                width={56}
                height={56}
                className="pixelated"
              />
              <span className="text-sm text-[var(--pt-text-dim)]">Shiny sprite</span>
            </div>
          </Section>

        </div>
        </div> {/* end overflow-y-auto */}
      </div>
    </div>
  );
}

function EvoSprite({ id, name, active }: { id: number; name: string; active: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 border p-2 ${active
        ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)]"
        : "border-[var(--pt-border-dim)] bg-[var(--pt-card)]"
      }`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spriteUrl(id)}
        alt={name}
        width={48}
        height={48}
        className="pixelated"
      />
      <span className={`text-ui-base font-semibold capitalize ${active ? "text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"}`}>
        {name}
      </span>
    </div>
  );
}
