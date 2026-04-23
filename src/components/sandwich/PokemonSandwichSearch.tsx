"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import {
  SHINY_GUIDE,
  ENCOUNTER_GUIDE,
  RAID_GUIDE,
  BREEDING_RECIPES,
} from "@/data/sandwich-guide";
import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { RecipeCard } from "./RecipeCard";
import pokemonData from "@/data/generated/pokemon.json";

interface Pokemon {
  dexNumber: number;
  nationalDex: number;
  name: string;
  types: PokemonType[];
  sprite: string;
}

type Goal = "shiny" | "encounter" | "raid" | "breeding";

const GUIDE_MAP = {
  shiny: SHINY_GUIDE,
  encounter: ENCOUNTER_GUIDE,
  raid: RAID_GUIDE,
} as const;

const GOAL_LABELS: Record<Goal, string> = {
  shiny: "✨ Shiny",
  encounter: "🔍 Encounter",
  raid: "⚔️ Raid",
  breeding: "🥚 Breeding",
};

const GOAL_COLORS: Record<Goal, string> = {
  shiny: "#FFD700",
  encounter: "#4ECDC4",
  raid: "#E040FB",
  breeding: "#F9A825",
};

interface PokemonSandwichSearchProps {
  onSelectRecipe: (r: SandwichRecipe) => void;
}

export function PokemonSandwichSearch({ onSelectRecipe }: PokemonSandwichSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [goal, setGoal] = useState<Goal>("shiny");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allPokemon = pokemonData as unknown as Pokemon[];
  const searchResults = usePokemonSearch(allPokemon, query);
  const dropdownResults = useMemo(() => searchResults.slice(0, 8), [searchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(pokemon: Pokemon) {
    setSelectedPokemon(pokemon);
    setSelectedType(pokemon.types[0]);
    setQuery("");
    setShowDropdown(false);
  }

  function handleClear() {
    setSelectedPokemon(null);
    setSelectedType(null);
    setQuery("");
  }

  const recipes = useMemo((): SandwichRecipe[] => {
    if (!selectedPokemon) return [];
    if (goal === "breeding") return BREEDING_RECIPES;
    const type = selectedType ?? selectedPokemon.types[0];
    const guide = GUIDE_MAP[goal];
    const entry = guide.find((e) => e.type === type);
    return entry ? [...entry.recipes] : [];
  }, [selectedPokemon, selectedType, goal]);

  return (
    <div>
      {/* Search input + dropdown */}
      {!selectedPokemon && (
        <div ref={containerRef} className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(e.target.value.length >= 2);
            }}
            placeholder="Buscar Pokémon..."
            className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-4 py-3 text-sm text-gray-100 placeholder-[var(--pt-text-dim)] outline-none focus:border-white/30"
          />
          {showDropdown && dropdownResults.length > 0 && (
            <div className="absolute z-10 w-full border border-[var(--pt-border-dim)] bg-[var(--pt-bg)] shadow-xl">
              {dropdownResults.map((p) => (
                <button
                  key={p.dexNumber}
                  onMouseDown={() => handleSelect(p)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.sprite}
                    alt={p.name}
                    width={32}
                    height={32}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span className="flex-1 text-sm font-semibold text-gray-100">{p.name}</span>
                  <div className="flex gap-1">
                    {p.types.map((t) => (
                      <span
                        key={t}
                        className="rounded-sm px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: TYPE_COLORS[t] }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDropdown && query.length >= 2 && dropdownResults.length === 0 && (
            <div className="absolute z-10 w-full border border-[var(--pt-border-dim)] bg-[var(--pt-bg)] px-4 py-3 text-sm text-[var(--pt-text-dim)]">
              Nenhum Pokémon encontrado
            </div>
          )}
        </div>
      )}

      {/* Selected Pokémon card */}
      {selectedPokemon && (
        <div className="mb-4 flex items-center gap-3 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedPokemon.sprite}
            alt={selectedPokemon.name}
            width={40}
            height={40}
            style={{ imageRendering: "pixelated" }}
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-100">{selectedPokemon.name}</div>
            {goal !== "breeding" && (
              <div className="mt-1 flex gap-1">
                {selectedPokemon.types.length === 2 ? (
                  selectedPokemon.types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      aria-pressed={selectedType === t}
                      className="rounded-sm px-2.5 py-0.5 text-xs font-bold text-white transition-opacity"
                      style={{
                        background: TYPE_COLORS[t],
                        opacity: selectedType === t ? 1 : 0.4,
                      }}
                    >
                      {t}
                    </button>
                  ))
                ) : (
                  <span
                    className="rounded-sm px-2.5 py-0.5 text-xs font-bold text-white"
                    style={{ background: TYPE_COLORS[selectedPokemon.types[0]] }}
                  >
                    {selectedPokemon.types[0]}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleClear}
            aria-label="Limpar seleção"
            className="shrink-0 text-sm text-[var(--pt-text-dim)] transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Goal selector */}
      <div className="mb-5 flex gap-0 border border-[var(--pt-border-dim)]">
        {(["shiny", "encounter", "raid", "breeding"] as Goal[]).map((g, i) => (
          <button
            key={g}
            onClick={() => setGoal(g)}
            className={`flex-1 border-b-2 px-2 py-2.5 text-center text-xs font-bold transition-all ${
              i > 0 ? "border-l border-l-[var(--pt-border-dim)]" : ""
            }`}
            style={{
              borderBottomColor: goal === g ? GOAL_COLORS[g] : "transparent",
              background: goal === g ? `${GOAL_COLORS[g]}10` : "transparent",
              color: goal === g ? GOAL_COLORS[g] : "var(--pt-text-dim)",
            }}
          >
            {GOAL_LABELS[g]}
          </button>
        ))}
      </div>

      {/* Recipe results */}
      {selectedPokemon && recipes.length > 0 && (
        <div className="grid gap-2.5">
          {recipes.map((r) => (
            <RecipeCard key={`${r.type}-${r.name}`} recipe={r} onSelect={onSelectRecipe} />
          ))}
        </div>
      )}

      {selectedPokemon && recipes.length === 0 && (
        <div className="py-8 text-center text-sm text-[var(--pt-text-dim)]">
          Nenhuma receita encontrada para esse tipo e objetivo.
        </div>
      )}

      {!selectedPokemon && (
        <div className="py-6 text-center text-sm text-[var(--pt-text-dim)]">
          Busque um Pokémon para ver as receitas recomendadas.
        </div>
      )}
    </div>
  );
}
