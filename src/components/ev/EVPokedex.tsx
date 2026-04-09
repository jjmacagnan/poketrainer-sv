"use client";

import { useState, useMemo } from "react";
import pokemonData from "@/data/generated/pokemon.json";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { STAT_NAMES, STAT_LABELS } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterBar } from "@/components/shared/FilterBar";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "@/components/ui/StatBar";

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
}

const allPokemon = pokemonData as Pokemon[];

const typeFilterOptions = TYPES.map((t) => ({
  value: t,
  label: t,
  color: TYPE_COLORS[t],
}));

const EV_AMOUNT_OPTIONS = [
  { value: "1", label: "+1 EV" },
  { value: "2", label: "+2 EV" },
  { value: "3", label: "+3 EV" },
];

// Precompute best spots per stat
const bestSpots: Record<string, Pokemon[]> = {};
for (const stat of STAT_NAMES) {
  const maxYield = Math.max(
    ...allPokemon
      .map((p) => p.evYield.find((e) => e.stat === stat)?.amount ?? 0)
  );
  bestSpots[stat] = allPokemon.filter((p) =>
    p.evYield.some((e) => e.stat === stat && e.amount === maxYield)
  );
}

type ViewMode = "card" | "table";

export function EVPokedex() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<StatName | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [showBestOnly, setShowBestOnly] = useState(false);

  // Filter pipeline
  const filtered = useMemo(() => {
    let result = allPokemon;

    // Only Pokémon that give EVs
    result = result.filter((p) => p.evYield.length > 0);

    if (selectedType) {
      result = result.filter((p) =>
        p.types.includes(selectedType)
      );
    }

    if (selectedStat) {
      result = result.filter((p) =>
        p.evYield.some((e) => e.stat === selectedStat)
      );
    }

    if (selectedAmount) {
      const amount = parseInt(selectedAmount);
      result = result.filter((p) =>
        p.evYield.some(
          (e) =>
            e.amount === amount &&
            (!selectedStat || e.stat === selectedStat)
        )
      );
    }

    if (showBestOnly && selectedStat) {
      const bestIds = new Set(bestSpots[selectedStat].map((p) => p.nationalDex));
      result = result.filter((p) => bestIds.has(p.nationalDex));
    }

    return result;
  }, [selectedType, selectedStat, selectedAmount, showBestOnly]);

  const searchResults = usePokemonSearch(filtered, search);

  // Sort: by selected stat yield desc, then national dex
  const sorted = useMemo(() => {
    if (!selectedStat) return searchResults;
    return [...searchResults].sort((a, b) => {
      const aYield = a.evYield.find((e) => e.stat === selectedStat)?.amount ?? 0;
      const bYield = b.evYield.find((e) => e.stat === selectedStat)?.amount ?? 0;
      if (bYield !== aYield) return bYield - aYield;
      return a.nationalDex - b.nationalDex;
    });
  }, [searchResults, selectedStat]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="📖"
        title="EV Yield Pokédex"
        subtitle="Todos os Pokémon de Paldea + DLC com EV yields ao derrotar"
        gradient="linear-gradient(135deg, #6390F0, #4ECDC4, #7AC74C)"
      />

      {/* Search */}
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar Pokémon por nome..."
        />
      </div>

      {/* Stat Filter */}
      <div className="mb-3">
        <div className="mb-1.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
          Filtrar por Stat
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          <button
            onClick={() => {
              setSelectedStat(null);
              setShowBestOnly(false);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              !selectedStat
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-gray-400"
            }`}
          >
            Todos Stats
          </button>
          {STAT_NAMES.map((stat) => (
            <button
              key={stat}
              onClick={() => {
                setSelectedStat(selectedStat === stat ? null : stat);
                if (selectedStat === stat) setShowBestOnly(false);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                selectedStat === stat
                  ? "border-violet-400/50 bg-violet-500/20 text-violet-300"
                  : "border-white/10 bg-white/5 text-gray-400 opacity-70"
              }`}
            >
              {STAT_LABELS[stat]}
            </button>
          ))}
        </div>
      </div>

      {/* EV Amount Filter */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
        {EV_AMOUNT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() =>
              setSelectedAmount(selectedAmount === opt.value ? null : opt.value)
            }
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
              selectedAmount === opt.value
                ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-white/5 text-gray-400 opacity-70"
            }`}
          >
            {opt.label}
          </button>
        ))}
        {selectedStat && (
          <button
            onClick={() => setShowBestOnly(!showBestOnly)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
              showBestOnly
                ? "border-yellow-400/50 bg-yellow-500/20 text-yellow-300"
                : "border-white/10 bg-white/5 text-gray-400 opacity-70"
            }`}
          >
            ⭐ Best Spot
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="mb-5">
        <FilterBar
          options={typeFilterOptions}
          selected={selectedType}
          onSelect={setSelectedType}
          allLabel="Todos os Tipos"
        />
      </div>

      {/* View Toggle + Count */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {sorted.length} Pokémon encontrados
        </span>
        <div className="flex gap-1 rounded-lg bg-white/5 p-0.5">
          <button
            onClick={() => setViewMode("card")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              viewMode === "card"
                ? "bg-white/10 text-white"
                : "text-gray-400"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              viewMode === "table"
                ? "bg-white/10 text-white"
                : "text-gray-400"
            }`}
          >
            Tabela
          </button>
        </div>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          Nenhum Pokémon encontrado com esses filtros 😅
        </div>
      ) : viewMode === "card" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((pokemon) => (
            <PokemonCard key={pokemon.nationalDex} pokemon={pokemon} selectedStat={selectedStat} />
          ))}
        </div>
      ) : (
        <PokemonTable pokemon={sorted} selectedStat={selectedStat} />
      )}
    </div>
  );
}

// ── Card View ─────────────────────────────────────────────────────────────────

function PokemonCard({
  pokemon,
  selectedStat,
}: {
  pokemon: Pokemon;
  selectedStat: StatName | null;
}) {
  const isBest =
    selectedStat &&
    bestSpots[selectedStat]?.some((p) => p.nationalDex === pokemon.nationalDex);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20"
    >
      {isBest && (
        <div className="absolute right-2 top-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
          ⭐ Best
        </div>
      )}

      <div className="mb-3 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          width={56}
          height={56}
          className="pixelated"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-gray-500">
            #{pokemon.nationalDex}
          </div>
          <div className="truncate text-sm font-bold text-gray-100">
            {pokemon.name}
          </div>
          <div className="mt-1 flex gap-1">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t as PokemonType} small />
            ))}
          </div>
        </div>
      </div>

      {/* EV Yield */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-500">EV Yield:</span>
        <div className="flex gap-1.5">
          {pokemon.evYield.map((ev) => (
            <span
              key={ev.stat}
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                selectedStat === ev.stat
                  ? "bg-violet-500/25 text-violet-300"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              +{ev.amount} {ev.stat}
            </span>
          ))}
        </div>
      </div>

      {/* Base Stats */}
      <div className="space-y-1">
        {STAT_NAMES.map((stat) => (
          <StatBar
            key={stat}
            label={stat}
            value={pokemon.baseStats[stat] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}

// ── Table View ────────────────────────────────────────────────────────────────

function PokemonTable({
  pokemon,
  selectedStat,
}: {
  pokemon: Pokemon[];
  selectedStat: StatName | null;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-3 py-2 text-xs font-semibold text-gray-400">#</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400">
              Pokémon
            </th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400">
              Tipo
            </th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-400">
              EV Yield
            </th>
            {STAT_NAMES.map((stat) => (
              <th
                key={stat}
                className={`px-2 py-2 text-center text-xs font-semibold ${
                  selectedStat === stat ? "text-violet-400" : "text-gray-400"
                }`}
              >
                {stat}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pokemon.map((p) => (
            <tr
              key={p.nationalDex}
              className="border-b border-white/5 transition-colors hover:bg-white/5"
            >
              <td className="px-3 py-2 font-mono text-xs text-gray-500">
                {p.nationalDex}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.sprite}
                    alt={p.name}
                    width={32}
                    height={32}
                    className="pixelated"
                    loading="lazy"
                  />
                  <span className="font-semibold text-gray-100">{p.name}</span>
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t as PokemonType} small />
                  ))}
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-1">
                  {p.evYield.map((ev) => (
                    <span
                      key={ev.stat}
                      className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                        selectedStat === ev.stat
                          ? "bg-violet-500/25 text-violet-300"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      +{ev.amount} {ev.stat}
                    </span>
                  ))}
                </div>
              </td>
              {STAT_NAMES.map((stat) => (
                <td
                  key={stat}
                  className={`px-2 py-2 text-center font-mono text-xs ${
                    selectedStat === stat
                      ? "font-bold text-violet-300"
                      : "text-gray-400"
                  }`}
                >
                  {p.baseStats[stat] ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
