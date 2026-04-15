"use client";

import { useEffect, useState, useCallback } from "react";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "@/components/ui/StatBar";
import type { PokemonType } from "@/data/types";
import { STAT_NAMES } from "@/lib/constants";
import abilitiesData from "@/data/generated/abilities.json";
import itemsData from "@/data/generated/items.json";

const abilitiesList = abilitiesData as { name: string; effect: string; shortEffect: string; flavorText: string }[];
const itemsList = itemsData as { name: string; description: string; officialDescription: string; sprite: string }[];

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
}

// ── PokéAPI types ─────────────────────────────────────────────────────────────

interface SpeciesData {
  habitat: { name: string } | null;
  egg_groups: { name: string }[];
  gender_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
  color: { name: string };
  generation: { name: string };
  capture_rate: number;
  growth_rate: { name: string };
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  evolution_chain: { url: string };
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

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

interface EncounterData {
  location_area: { name: string; url: string };
  version_details: {
    version: { name: string };
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      method: { name: string };
    }[];
  }[];
}

interface SVMove {
  name: string;
  level: number;
  method: string;
}

interface EvoNode {
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
  evolves_to: EvoNode[];
}

interface EvoChain {
  chain: EvoNode;
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

function formatTrigger(detail: EvoNode["evolution_details"][0]): string {
  if (!detail) return "";
  const trigger = detail.trigger?.name;
  if (trigger === "level-up") {
    if (detail.min_level) return `Lv. ${detail.min_level}`;
    if (detail.happiness) return `Friendship`;
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
  if (trigger === "tower-of-darkness") return "Tower of Darkness";
  if (trigger === "tower-of-waters") return "Tower of Waters";
  if (trigger === "three-critical-hits") return "3 Critical Hits";
  if (trigger === "take-damage") return "Take Damage";
  return capitalize(trigger ?? "");
}

function flattenChain(node: EvoNode): EvoStep[] {
  const steps: EvoStep[] = [];
  function walk(n: EvoNode) {
    for (const child of n.evolves_to) {
      steps.push({
        from: { name: n.species.name, id: extractId(n.species.url) },
        to: { name: child.species.name, id: extractId(child.species.url) },
        trigger: formatTrigger(child.evolution_details[0]),
      });
      walk(child);
    }
  }
  walk(node);
  return steps;
}

function formatLocationName(name: string): string {
  return name
    .replace(/-area$/, "")
    .split("-")
    .map(capitalize)
    .join(" ");
}

function formatMethodName(name: string): string {
  return name.split("-").map(capitalize).join(" ");
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
  "red":                { label: "RD",  name: "Pokémon Red",             color: "#CC0000" },
  "blue":               { label: "BL",  name: "Pokémon Blue",            color: "#0000AA" },
  "yellow":             { label: "YW",  name: "Pokémon Yellow",          color: "#FFD700" },
  "gold":               { label: "GD",  name: "Pokémon Gold",            color: "#B8860B" },
  "silver":             { label: "SV",  name: "Pokémon Silver",          color: "#C0C0C0" },
  "crystal":            { label: "CY",  name: "Pokémon Crystal",         color: "#4FC3F7" },
  "ruby":               { label: "RB",  name: "Pokémon Ruby",            color: "#B22222" },
  "sapphire":           { label: "SP",  name: "Pokémon Sapphire",        color: "#1565C0" },
  "emerald":            { label: "EM",  name: "Pokémon Emerald",         color: "#2E7D32" },
  "firered":            { label: "FR",  name: "Pokémon FireRed",         color: "#FF6F00" },
  "leafgreen":          { label: "LG",  name: "Pokémon LeafGreen",       color: "#388E3C" },
  "diamond":            { label: "DM",  name: "Pokémon Diamond",         color: "#5C6BC0" },
  "pearl":              { label: "PL",  name: "Pokémon Pearl",           color: "#EC407A" },
  "platinum":           { label: "PT",  name: "Pokémon Platinum",        color: "#78909C" },
  "heartgold":          { label: "HG",  name: "Pokémon HeartGold",       color: "#FFB300" },
  "soulsilver":         { label: "SS",  name: "Pokémon SoulSilver",      color: "#90A4AE" },
  "black":              { label: "BK",  name: "Pokémon Black",           color: "#212121" },
  "white":              { label: "WT",  name: "Pokémon White",           color: "#EEEEEE" },
  "black-2":            { label: "B2",  name: "Pokémon Black 2",         color: "#37474F" },
  "white-2":            { label: "W2",  name: "Pokémon White 2",         color: "#CFD8DC" },
  "x":                  { label: "X",   name: "Pokémon X",               color: "#1565C0" },
  "y":                  { label: "Y",   name: "Pokémon Y",               color: "#C62828" },
  "omega-ruby":         { label: "OR",  name: "Pokémon Omega Ruby",      color: "#B71C1C" },
  "alpha-sapphire":     { label: "AS",  name: "Pokémon Alpha Sapphire",  color: "#1A237E" },
  "sun":                { label: "SN",  name: "Pokémon Sun",             color: "#FF8F00" },
  "moon":               { label: "MN",  name: "Pokémon Moon",            color: "#283593" },
  "ultra-sun":          { label: "US",  name: "Pokémon Ultra Sun",       color: "#E65100" },
  "ultra-moon":         { label: "UM",  name: "Pokémon Ultra Moon",      color: "#1A237E" },
  "sword":              { label: "SW",  name: "Pokémon Sword",           color: "#1E88E5" },
  "shield":             { label: "SH",  name: "Pokémon Shield",          color: "#E53935" },
  "brilliant-diamond":  { label: "BD",  name: "Brilliant Diamond",       color: "#5E35B1" },
  "shining-pearl":      { label: "SP2", name: "Shining Pearl",           color: "#F06292" },
  "legends-arceus":     { label: "LA",  name: "Legends: Arceus",         color: "#6D4C41" },
  "scarlet":            { label: "SC",  name: "Pokémon Scarlet",         color: "#E53935" },
  "violet":             { label: "VT",  name: "Pokémon Violet",          color: "#7B1FA2" },
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
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label} · </span>
      <span className="font-semibold text-gray-200">{value}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PokemonDetailModal({
  pokemon,
  onClose,
}: {
  pokemon: PokemonEntry;
  onClose: () => void;
}) {
  const [species, setSpecies] = useState<SpeciesData | null>(null);
  const [evoSteps, setEvoSteps] = useState<EvoStep[]>([]);
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [baseExperience, setBaseExperience] = useState<number | null>(null);
  const [svMoves, setSvMoves] = useState<SVMove[]>([]);
  const [encounters, setEncounters] = useState<{ location: string; versions: string[]; levels: string; method: string }[]>([]);
  const [showAllMoves, setShowAllMoves] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shiny, setShiny] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sp, pkm, enc] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.nationalDex}/`).then((r) => r.json()) as Promise<SpeciesData>,
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.nationalDex}/`).then((r) => r.json()) as Promise<PokemonApiData>,
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.nationalDex}/encounters`).then((r) => r.json()).catch(() => []) as Promise<EncounterData[]>,
      ]);
      setSpecies(sp);
      setBaseExperience(pkm.base_experience);
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

      // Filter encounters for SV
      const svEncounters: typeof encounters = [];
      for (const e of enc) {
        const svVersions = e.version_details.filter(
          (vd) => vd.version.name === "scarlet" || vd.version.name === "violet"
        );
        if (svVersions.length > 0) {
          const details = svVersions[0].encounter_details[0];
          const levelRange = details
            ? details.min_level === details.max_level
              ? `Lv. ${details.min_level}`
              : `Lv. ${details.min_level}–${details.max_level}`
            : "";
          svEncounters.push({
            location: formatLocationName(e.location_area.name),
            versions: svVersions.map((v) => capitalize(v.version.name)),
            levels: levelRange,
            method: details ? formatMethodName(details.method.name) : "",
          });
        }
      }
      setEncounters(svEncounters);

      const chain: EvoChain = await fetch(sp.evolution_chain.url).then((r) => r.json());
      setEvoSteps(flattenChain(chain.chain));
    } catch {
      // silently fail — data might just not be available
    } finally {
      setLoading(false);
    }
  }, [pokemon.nationalDex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const flavorText = species?.flavor_text_entries
    .filter((e) => e.language.name === "en")
    .reverse()
    .find((e) => ["scarlet", "violet", "sword", "shield"].includes(e.version.name))
    ?.flavor_text?.replace(/\f/g, " ")
    .replace(/\u00ad/g, "")
    ?? species?.flavor_text_entries.find((e) => e.language.name === "en")?.flavor_text?.replace(/\f/g, " ") ?? "";

  const totalStats = STAT_NAMES.reduce((s, stat) => s + (pokemon.baseStats[stat] ?? 0), 0);

  // All forms from varieties (excluding default)
  const forms = (species?.varieties ?? []).filter((v) => !v.is_default);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1.5 text-gray-400 hover:bg-white/20 hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

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
              className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-all ${
                shiny
                  ? "border-yellow-400/50 bg-yellow-500/20 text-yellow-300"
                  : "border-white/10 bg-white/5 text-gray-500 hover:text-gray-300"
              }`}
            >
              ✨ Shiny
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="font-mono">#{String(pokemon.nationalDex).padStart(4, "0")}</span>
              <span>·</span>
              <span className="capitalize">{pokemon.pokedex}</span>
              {species?.is_legendary && (
                <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                  Legendary
                </span>
              )}
              {species?.is_mythical && (
                <span className="rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-300">
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
              <p className="mb-3 text-sm italic leading-relaxed text-gray-400">
                "{flavorText}"
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
              {species?.color && (
                <InfoRow label="Color" value={capitalize(species.color.name)} />
              )}
              {species && (
                <InfoRow label="Gender" value={genderLabel(species.gender_rate)} />
              )}
              {species?.habitat && (
                <InfoRow label="Habitat" value={capitalize(species.habitat.name)} />
              )}
              {species?.generation && (
                <InfoRow
                  label="Generation"
                  value={species.generation.name
                    .replace("generation-", "Gen ")
                    .toUpperCase()
                    .replace("GEN ", "Gen ")}
                />
              )}
              <InfoRow label="Region" value={capitalize(pokemon.pokedex)} />
              {baseExperience !== null && (
                <InfoRow label="Base EXP" value={String(baseExperience)} />
              )}
              {species?.capture_rate !== undefined && (
                <InfoRow label="Catch Rate" value={String(species.capture_rate)} />
              )}
              {species?.growth_rate && (
                <InfoRow label="Growth" value={formatGrowthRate(species.growth_rate.name)} />
              )}
              {pokemon.abilities.length > 0 && (
                <div className="col-span-2">
                  <span className="text-gray-500">Abilities · </span>
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
        <div className="space-y-6 border-t border-white/10 p-6">

          {/* Game Availability */}
          <Section title="Game Availability">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
            ) : gameVersions.length === 0 ? (
              <p className="text-sm text-gray-500">No data</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {gameVersions.map((version) => {
                  const meta = GAME_META[version];
                  if (!meta) return null;
                  return (
                    <div key={version} className="group relative">
                      <span
                        className="inline-flex h-7 w-9 cursor-default items-center justify-center rounded-md text-[10px] font-black text-white"
                        style={{ backgroundColor: meta.color + "CC", border: `1px solid ${meta.color}` }}
                      >
                        {meta.label}
                      </span>
                      {/* Custom tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
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
          <Section title="Encounter Locations (Scarlet / Violet)">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
            ) : encounters.length === 0 ? (
              <p className="text-sm text-gray-500">No wild encounter data for Scarlet/Violet</p>
            ) : (
              <div className="space-y-1.5">
                {encounters.map((enc, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-gray-200">{enc.location}</span>
                    {enc.levels && (
                      <span className="text-xs text-gray-500">{enc.levels}</span>
                    )}
                    {enc.method && (
                      <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                        {enc.method}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-gray-600">
                      {enc.versions.join(" / ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Abilities */}
          <Section title="Abilities">
            <div className="flex flex-col gap-2">
              {pokemon.abilities.map((a) => {
                const abilityData = abilitiesList.find((ab) => ab.name === a.name);
                return (
                  <div
                    key={a.name}
                    className={`flex flex-col rounded-lg border px-3 py-2 ${
                      a.isHidden
                        ? "border-violet-400/30 bg-violet-500/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`text-sm font-bold ${a.isHidden ? "text-violet-300" : "text-gray-200"}`}>
                        {a.name}
                      </span>
                      {a.isHidden && (
                        <span className="ml-2 rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-black text-violet-400">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    {(abilityData?.shortEffect || abilityData?.flavorText) && (
                      <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
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
                  className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-sm font-bold text-emerald-300"
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
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
            ) : svMoves.length === 0 ? (
              <p className="text-sm text-gray-500">No move data for Scarlet/Violet</p>
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
                        {levelUp.slice(0, visibleLimit).map((m) => (
                          <span
                            key={`lu-${m.name}`}
                            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300"
                          >
                            <span className="font-mono text-[10px] text-emerald-400/70">
                              {m.level > 0 ? m.level : "—"}
                            </span>
                            {formatItemName(m.name)}
                          </span>
                        ))}
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
                        {tm.slice(0, visibleLimit).map((m) => (
                          <span
                            key={`tm-${m.name}`}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300"
                          >
                            {formatItemName(m.name)}
                          </span>
                        ))}
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
                        {egg.map((m) => (
                          <span
                            key={`egg-${m.name}`}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300"
                          >
                            {formatItemName(m.name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tutor moves */}
                  {tutor.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-amber-400">Tutor ({tutor.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.map((m) => (
                          <span
                            key={`tut-${m.name}`}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300"
                          >
                            {formatItemName(m.name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show all toggle */}
                  {(showAllMoves || svMoves.length > 12) && (
                    <button
                      onClick={() => setShowAllMoves(!showAllMoves)}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300"
                    >
                      {showAllMoves ? "Show less" : `Show all ${svMoves.length} moves`}
                    </button>
                  )}
                </div>
              );
            })()}
          </Section>

          {/* Egg Groups */}
          {species?.egg_groups && species.egg_groups.length > 0 && (
            <Section title="Egg Groups">
              <div className="flex gap-2">
                {species.egg_groups.map((eg) => (
                  <span
                    key={eg.name}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300"
                  >
                    {capitalize(eg.name)}
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
                      className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      {itemData?.sprite ? (
                        <img src={itemData.sprite} alt={itemName} className="h-8 w-8 shrink-0 pixelated" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] text-white/40">
                          ?
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-200">{itemName}</span>
                        {(itemData?.officialDescription || itemData?.description) && (
                          <p className="mt-0.5 text-[10px] leading-relaxed text-gray-400">
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
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                Loading...
              </div>
            ) : evoSteps.length === 0 ? (
              <p className="text-sm text-gray-500">Does not evolve</p>
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
                          <span className="max-w-[80px] text-[9px] font-semibold text-violet-400">
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
          {forms.length > 0 && (
            <Section title="Other Forms">
              <div className="flex flex-wrap gap-3">
                {forms.map((v) => {
                  const formId = extractId(v.pokemon.url.replace("pokemon/", "pokemon-species/"));
                  const displayName = v.pokemon.name
                    .split("-")
                    .slice(1)
                    .map(capitalize)
                    .join(" ") || v.pokemon.name;
                  // For forms, use the pokemon endpoint ID directly from URL
                  const pokemonId = extractId(v.pokemon.url);
                  return (
                    <div key={v.pokemon.name} className="flex flex-col items-center gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                        alt={v.pokemon.name}
                        width={56}
                        height={56}
                        className="pixelated"
                      />
                      <span className="text-[10px] text-gray-500">{displayName}</span>
                    </div>
                  );
                })}
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
              <span className="text-sm text-gray-500">Shiny sprite</span>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

function EvoSprite({ id, name, active }: { id: number; name: string; active: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border p-2 ${
      active
        ? "border-violet-500/40 bg-violet-500/10"
        : "border-white/10 bg-white/5"
    }`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spriteUrl(id)}
        alt={name}
        width={48}
        height={48}
        className="pixelated"
      />
      <span className={`text-[10px] font-semibold capitalize ${active ? "text-violet-300" : "text-gray-400"}`}>
        {name}
      </span>
    </div>
  );
}
