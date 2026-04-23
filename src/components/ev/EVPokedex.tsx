"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { wildPokemonData } from "@/data/pokemon-utils";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import { STAT_NAMES, STAT_LABELS } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { useI18n } from "@/i18n";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterBar } from "@/components/shared/FilterBar";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "@/components/ui/StatBar";
import { PokemonDetailModal } from "./PokemonDetailModal";
import { ToolDisclaimer } from "@/components/shared/ToolDisclaimer";

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
}

const allPokemon = wildPokemonData as unknown as Pokemon[];

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

const CARDS_PER_PAGE = 48;
const ROWS_PER_PAGE = 100;

export function EVPokedex() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [selectedType, setSelectedType] = useState<string | null>(() => searchParams.get("type"));
  const [selectedStat, setSelectedStat] = useState<StatName | null>(() => {
    const s = searchParams.get("stat");
    return s && STAT_NAMES.includes(s as StatName) ? (s as StatName) : null;
  });
  const [selectedAmount, setSelectedAmount] = useState<string | null>(() => searchParams.get("amount"));
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [showBestOnly, setShowBestOnly] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [page, setPage] = useState(0);

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

  const prevFiltersRef = useRef({ selectedType, selectedStat, selectedAmount, showBestOnly, search });
  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (
      prev.selectedType !== selectedType ||
      prev.selectedStat !== selectedStat ||
      prev.selectedAmount !== selectedAmount ||
      prev.showBestOnly !== showBestOnly ||
      prev.search !== search
    ) {
      setPage(0);
      prevFiltersRef.current = { selectedType, selectedStat, selectedAmount, showBestOnly, search };
    }
  }, [selectedType, selectedStat, selectedAmount, showBestOnly, search]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedType) params.set("type", selectedType);
    if (selectedStat) params.set("stat", selectedStat);
    if (selectedAmount) params.set("amount", selectedAmount);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [search, selectedType, selectedStat, selectedAmount]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageHeader
        emoji="📖"
        title={t("evPokedex.title")}
        subtitle={t("evPokedex.subtitle")}
        gradient="linear-gradient(135deg, #6390F0, #4ECDC4, #7AC74C)"
      />

      {/* Search */}
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("evPokedex.searchPlaceholder")}
        />
      </div>

      {/* Stat Filter */}
      <div className="mb-3">
        <div className="mb-1.5 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-wider text-[var(--pt-text-dim)]">
          {t("evPokedex.filterByStat")}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          <button
            onClick={() => {
              setSelectedStat(null);
              setShowBestOnly(false);
            }}
            className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] transition-colors ${
              !selectedStat
                ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
            }`}
          >
            {t("evPokedex.allStats")}
          </button>
          {STAT_NAMES.map((stat) => (
            <button
              key={stat}
              onClick={() => {
                setSelectedStat(selectedStat === stat ? null : stat);
                if (selectedStat === stat) setShowBestOnly(false);
              }}
              className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] transition-all ${
                selectedStat === stat
                  ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                  : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] opacity-70"
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
            className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] transition-all ${
              selectedAmount === opt.value
                ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] opacity-70"
            }`}
          >
            {opt.label}
          </button>
        ))}
        {selectedStat && (
          <button
            onClick={() => setShowBestOnly(!showBestOnly)}
            className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] transition-all ${
              showBestOnly
                ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] opacity-70"
            }`}
          >
            {t("evPokedex.bestSpot")}
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="mb-5">
        <FilterBar
          options={typeFilterOptions}
          selected={selectedType}
          onSelect={setSelectedType}
          allLabel={t("evPokedex.allTypes")}
        />
      </div>

      {/* View Toggle + Count */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[var(--pt-text-dim)]">
          {t("evPokedex.pokemonFound", { count: sorted.length })}
        </span>
        <div className="flex border border-[var(--pt-border-dim)]">
          <button
            onClick={() => {
              setViewMode("card");
              setPage(0);
            }}
            className={`px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] transition-colors ${
              viewMode === "card"
                ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                : "text-[var(--pt-text-dim)]"
            }`}
          >
            {t("evPokedex.cards")}
          </button>
          <button
            onClick={() => {
              setViewMode("table");
              setPage(0);
            }}
            className={`px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] transition-colors ${
              viewMode === "table"
                ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                : "text-[var(--pt-text-dim)]"
            }`}
          >
            {t("evPokedex.table")}
          </button>
        </div>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center text-[var(--pt-text-dim)]">
          {t("evPokedex.noResults")}
        </div>
      ) : viewMode === "card" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted
              .slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
              .map((pokemon, sliceIdx) => (
                <PokemonCard
                  key={pokemon.nationalDex}
                  pokemon={pokemon}
                  selectedStat={selectedStat}
                  onClick={() => setSelectedIndex(page * CARDS_PER_PAGE + sliceIdx)}
                />
              ))}
          </div>
          <PaginationControls
            page={page}
            total={sorted.length}
            perPage={CARDS_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          <PokemonTable
            pokemon={sorted.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE)}
            selectedStat={selectedStat}
            onSelect={(p) => setSelectedIndex(sorted.findIndex((s) => s.nationalDex === p.nationalDex))}
          />
          <PaginationControls
            page={page}
            total={sorted.length}
            perPage={ROWS_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Detail Modal */}
      {selectedIndex !== null && sorted[selectedIndex] && (
        <PokemonDetailModal
          pokemon={sorted[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < sorted.length - 1}
          onPrev={() => setSelectedIndex((i) => {
            if (i === null || i <= 0) return i;
            const prev = i - 1;
            const perPage = viewMode === "card" ? CARDS_PER_PAGE : ROWS_PER_PAGE;
            const prevPage = Math.floor(prev / perPage);
            if (prevPage !== page) setPage(prevPage);
            return prev;
          })}
          onNext={() => setSelectedIndex((i) => {
            if (i === null || i >= sorted.length - 1) return i;
            const next = i + 1;
            const perPage = viewMode === "card" ? CARDS_PER_PAGE : ROWS_PER_PAGE;
            const nextPage = Math.floor(next / perPage);
            if (nextPage !== page) setPage(nextPage);
            return next;
          })}
        />
      )}

      <ToolDisclaimer
        toolName={t("nav.evPokedex")}
        note={t("evPokedex.disclaimerNote")}
        sources={[
          { label: "PokéAPI", url: "https://pokeapi.co/docs/v2#info" },
        ]}
      />
    </div>
  );
}

// ── Card View ─────────────────────────────────────────────────────────────────

function PokemonCard({
  pokemon,
  selectedStat,
  onClick,
}: {
  pokemon: Pokemon;
  selectedStat: StatName | null;
  onClick: () => void;
}) {
  const { t } = useI18n();
  const isBest =
    selectedStat &&
    bestSpots[selectedStat]?.some((p) => p.nationalDex === pokemon.nationalDex);

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 transition-all hover:border-[rgba(255,215,0,0.5)] hover:bg-[rgba(255,215,0,0.02)]"
    >
      <div className="absolute right-2 top-2 flex flex-col items-end gap-0.5">
        {isBest && (
          <div className="border border-[rgba(255,215,0,0.4)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase text-[var(--pt-gold)]">
            {t("evPokedex.best")}
          </div>
        )}
        {(pokemon as { isLegendary?: boolean }).isLegendary && (
          <div className="border border-yellow-500/30 px-2 py-0.5 text-ui-base font-bold text-yellow-400/70">
            ★
          </div>
        )}
        {(pokemon as { isMythical?: boolean }).isMythical && (
          <div className="border border-pink-500/20 px-2 py-0.5 text-ui-base font-bold text-pink-400/70">
            ✦
          </div>
        )}
      </div>

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
          <div className="text-xs font-semibold text-[var(--pt-text-dim)]">
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
        <span className="text-xs font-semibold text-[var(--pt-text-dim)]">{t("evPokedex.evYield")}</span>
        <div className="flex gap-1.5">
          {pokemon.evYield.map((ev) => (
            <span
              key={ev.stat}
              className={`px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase ${
                selectedStat === ev.stat
                  ? "border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
                  : "border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
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
  onSelect,
}: {
  pokemon: Pokemon[];
  selectedStat: StatName | null;
  onSelect: (p: Pokemon) => void;
}) {
  return (
    <div className="overflow-x-auto border border-[var(--pt-border-dim)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--pt-border-dim)] bg-[var(--pt-surface)]">
            <th className="px-3 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">#</th>
            <th className="px-3 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">
              Pokémon
            </th>
            <th className="px-3 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">
              Tipo
            </th>
            <th className="px-3 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">
              EV Yield
            </th>
            {STAT_NAMES.map((stat) => (
              <th
                key={stat}
                className={`px-2 py-2 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[1px] ${
                  selectedStat === stat ? "text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"
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
              onClick={() => onSelect(p)}
              className="cursor-pointer border-b border-[var(--pt-border-dim)] transition-colors hover:bg-[rgba(255,215,0,0.02)]"
            >
              <td className="px-3 py-2 font-mono text-xs text-[var(--pt-text-dim)]">
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
                      className={`px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase ${
                        selectedStat === ev.stat
                          ? "border border-[rgba(255,215,0,0.4)] text-[var(--pt-gold)]"
                          : "border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
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
                  className={`px-2 py-2 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-sm ${
                    selectedStat === stat
                      ? "font-bold text-[var(--pt-gold)]"
                      : "text-[var(--pt-text-dim)]"
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

// ── Pagination Controls ────────────────────────────────────────────────────────

function PaginationControls({
  page,
  total,
  perPage,
  onPageChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="border border-[var(--pt-border-dim)] px-4 py-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-[var(--pt-text-dim)] transition-colors disabled:opacity-30 enabled:hover:border-[var(--pt-gold)] enabled:hover:text-[var(--pt-gold)]"
      >
        ←
      </button>
      <span className="font-[family-name:var(--font-share-tech-mono)] text-ui-sm text-[var(--pt-text-dim)]">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="border border-[var(--pt-border-dim)] px-4 py-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-[var(--pt-text-dim)] transition-colors disabled:opacity-30 enabled:hover:border-[var(--pt-gold)] enabled:hover:text-[var(--pt-gold)]"
      >
        →
      </button>
    </div>
  );
}
