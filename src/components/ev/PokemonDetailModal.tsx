"use client";

import { useEffect, useState, useCallback } from "react";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "@/components/ui/StatBar";
import type { PokemonType } from "@/data/types";
import { STAT_NAMES } from "@/lib/constants";

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
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }[];
  evolution_chain: { url: string };
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

interface PokemonApiData {
  game_indices: { game_index: number; version: { name: string } }[];
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

function genderLabel(rate: number): string {
  if (rate === -1) return "Genderless";
  if (rate === 0) return "100% ♂";
  if (rate === 8) return "100% ♀";
  const female = (rate / 8) * 100;
  return `${100 - female}% ♂ · ${female}% ♀`;
}

// ── Game availability map ──────────────────────────────────────────────────────

interface GameMeta {
  label: string;
  top: string;    // gradient top color
  bottom: string; // gradient bottom color
  text: string;   // label text color
  symbol: string; // single-char symbol shown inside cartridge
}

const GAME_META: Record<string, GameMeta> = {
  "red":               { label: "Red",             top: "#DC2626", bottom: "#991B1B", text: "#FCA5A5", symbol: "R" },
  "blue":              { label: "Blue",            top: "#2563EB", bottom: "#1E40AF", text: "#BFDBFE", symbol: "B" },
  "yellow":            { label: "Yellow",          top: "#EAB308", bottom: "#A16207", text: "#FEF08A", symbol: "Y" },
  "gold":              { label: "Gold",            top: "#D97706", bottom: "#92400E", text: "#FDE68A", symbol: "G" },
  "silver":            { label: "Silver",          top: "#94A3B8", bottom: "#475569", text: "#F1F5F9", symbol: "S" },
  "crystal":           { label: "Crystal",         top: "#06B6D4", bottom: "#0E7490", text: "#A5F3FC", symbol: "C" },
  "ruby":              { label: "Ruby",            top: "#BE123C", bottom: "#881337", text: "#FDA4AF", symbol: "R" },
  "sapphire":          { label: "Sapphire",        top: "#1D4ED8", bottom: "#1E3A8A", text: "#BFDBFE", symbol: "S" },
  "emerald":           { label: "Emerald",         top: "#059669", bottom: "#065F46", text: "#A7F3D0", symbol: "E" },
  "firered":           { label: "FireRed",         top: "#EA580C", bottom: "#9A3412", text: "#FED7AA", symbol: "F" },
  "leafgreen":         { label: "LeafGreen",       top: "#16A34A", bottom: "#14532D", text: "#BBF7D0", symbol: "L" },
  "diamond":           { label: "Diamond",         top: "#818CF8", bottom: "#4338CA", text: "#E0E7FF", symbol: "D" },
  "pearl":             { label: "Pearl",           top: "#F472B6", bottom: "#BE185D", text: "#FCE7F3", symbol: "P" },
  "platinum":          { label: "Platinum",        top: "#64748B", bottom: "#334155", text: "#CBD5E1", symbol: "Pt" },
  "heartgold":         { label: "HeartGold",       top: "#F59E0B", bottom: "#B45309", text: "#FEF3C7", symbol: "HG" },
  "soulsilver":        { label: "SoulSilver",      top: "#CBD5E1", bottom: "#64748B", text: "#F8FAFC", symbol: "SS" },
  "black":             { label: "Black",           top: "#1C1917", bottom: "#0C0A09", text: "#D6D3D1", symbol: "B" },
  "white":             { label: "White",           top: "#E7E5E4", bottom: "#A8A29E", text: "#1C1917", symbol: "W" },
  "black-2":           { label: "Black 2",         top: "#292524", bottom: "#1C1917", text: "#E7E5E4", symbol: "B2" },
  "white-2":           { label: "White 2",         top: "#F5F5F4", bottom: "#D6D3D1", text: "#292524", symbol: "W2" },
  "x":                 { label: "X",               top: "#1D4ED8", bottom: "#1E3A8A", text: "#DBEAFE", symbol: "X" },
  "y":                 { label: "Y",               top: "#C026D3", bottom: "#86198F", text: "#F5D0FE", symbol: "Y" },
  "omega-ruby":        { label: "Omega Ruby",      top: "#DC2626", bottom: "#7F1D1D", text: "#FCA5A5", symbol: "α" },
  "alpha-sapphire":    { label: "Alpha Sapphire",  top: "#2563EB", bottom: "#1E3A8A", text: "#BFDBFE", symbol: "α" },
  "sun":               { label: "Sun",             top: "#F97316", bottom: "#C2410C", text: "#FED7AA", symbol: "☀" },
  "moon":              { label: "Moon",            top: "#4338CA", bottom: "#312E81", text: "#C7D2FE", symbol: "☾" },
  "ultra-sun":         { label: "Ultra Sun",       top: "#FB923C", bottom: "#EA580C", text: "#FFEDD5", symbol: "☀" },
  "ultra-moon":        { label: "Ultra Moon",      top: "#6D28D9", bottom: "#4C1D95", text: "#EDE9FE", symbol: "☾" },
  "sword":             { label: "Sword",           top: "#3B82F6", bottom: "#1D4ED8", text: "#DBEAFE", symbol: "⚔" },
  "shield":            { label: "Shield",          top: "#EC4899", bottom: "#BE185D", text: "#FCE7F3", symbol: "🛡" },
  "brilliant-diamond": { label: "Brilliant Diamond", top: "#A78BFA", bottom: "#6D28D9", text: "#EDE9FE", symbol: "◆" },
  "shining-pearl":     { label: "Shining Pearl",  top: "#FB7185", bottom: "#E11D48", text: "#FFE4E6", symbol: "◆" },
  "legends-arceus":    { label: "Legends: Arceus", top: "#78716C", bottom: "#44403C", text: "#F5F5F4", symbol: "A" },
  "scarlet":           { label: "Scarlet",         top: "#EF4444", bottom: "#B91C1C", text: "#FEE2E2", symbol: "S" },
  "violet":            { label: "Violet",          top: "#8B5CF6", bottom: "#6D28D9", text: "#EDE9FE", symbol: "V" },
};

// SVG Nintendo Switch cartridge icon
function CartridgeIcon({ version }: { version: string }) {
  const meta = GAME_META[version];
  if (!meta) return null;
  const gradId = `g-${version}`;
  const small = meta.symbol.length > 1;
  return (
    <svg
      width="36"
      height="44"
      viewBox="0 0 36 44"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={meta.label}
      title={meta.label}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={meta.top} />
          <stop offset="100%" stopColor={meta.bottom} />
        </linearGradient>
      </defs>
      {/* Cartridge body with notch at top-center */}
      <path
        d={`M5,6 L13,6 Q14,6 14,5 A4,4 0 0,1 22,5 Q22,6 23,6 L31,6 Q35,6 35,10 L35,39 Q35,43 31,43 L5,43 Q1,43 1,39 L1,10 Q1,6 5,6 Z`}
        fill={`url(#${gradId})`}
      />
      {/* Connector pins at bottom */}
      <rect x="6"  y="37" width="4" height="5" rx="1" fill="rgba(0,0,0,0.25)" />
      <rect x="12" y="37" width="4" height="5" rx="1" fill="rgba(0,0,0,0.25)" />
      <rect x="18" y="37" width="4" height="5" rx="1" fill="rgba(0,0,0,0.25)" />
      <rect x="24" y="37" width="4" height="5" rx="1" fill="rgba(0,0,0,0.25)" />
      {/* Label text */}
      <text
        x="18"
        y={small ? "26" : "27"}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={meta.text}
        fontSize={small ? "9" : "13"}
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        {meta.symbol}
      </text>
    </svg>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [shiny, setShiny] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sp, pkm] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.nationalDex}/`).then((r) => r.json()) as Promise<SpeciesData>,
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.nationalDex}/`).then((r) => r.json()) as Promise<PokemonApiData>,
      ]);
      setSpecies(sp);
      setGameVersions(pkm.game_indices.map((g) => g.version.name));

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
              <div className="flex flex-wrap gap-2">
                {gameVersions.map((version) => (
                  <CartridgeIcon key={version} version={version} />
                ))}
              </div>
            )}
          </Section>

          {/* Abilities */}
          <Section title="Abilities">
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <div
                  key={a.name}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    a.isHidden
                      ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                      : "border-white/10 bg-white/5 text-gray-200"
                  }`}
                >
                  {a.name}
                  {a.isHidden && (
                    <span className="ml-1.5 text-[10px] text-violet-400">(H)</span>
                  )}
                </div>
              ))}
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
              <div className="flex flex-wrap gap-2">
                {pokemon.heldItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300"
                  >
                    {item}
                  </span>
                ))}
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
