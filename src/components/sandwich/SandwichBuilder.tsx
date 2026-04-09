"use client";

import { useState, useMemo } from "react";
import { TYPES, TYPE_COLORS } from "@/data/types";
import type { PokemonType } from "@/data/types";
import {
  SHINY_RECIPES,
  ENCOUNTER_RECIPES,
  ALL_RECIPES,
  MEAL_POWERS,
} from "@/data/sandwich-recipes";
import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetail } from "./RecipeDetail";

type Tab = "shiny" | "encounter" | "search";

export function SandwichBuilder() {
  const [tab, setTab] = useState<Tab>("shiny");
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<SandwichRecipe | null>(
    null
  );
  const [searchPower, setSearchPower] = useState("");
  const [searchType, setSearchType] = useState("");

  const filteredShiny = useMemo(() => {
    if (!selectedType) return SHINY_RECIPES;
    return SHINY_RECIPES.filter((x) => x.type === selectedType);
  }, [selectedType]);

  const filteredEncounter = useMemo(() => {
    if (!selectedType) return ENCOUNTER_RECIPES;
    return ENCOUNTER_RECIPES.filter((x) => x.type === selectedType);
  }, [selectedType]);

  const searchResults = useMemo(() => {
    if (!searchPower && !searchType) return [];
    return ALL_RECIPES.filter((r) => {
      const matchPower =
        !searchPower ||
        r.powers.some((p) =>
          p.toLowerCase().includes(searchPower.toLowerCase())
        );
      const matchType = !searchType || r.type === searchType;
      return matchPower && matchType;
    });
  }, [searchPower, searchType]);

  if (selectedRecipe) {
    return (
      <div className="mx-auto max-w-xl px-4 py-6">
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
        />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; desc: string }[] = [
    { id: "shiny", label: "✨ Shiny Hunt", desc: "Sparkling Lv.3" },
    { id: "encounter", label: "🔍 Encounter", desc: "Encounter Power" },
    { id: "search", label: "🔎 Buscar", desc: "Busca reversa" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-2 text-5xl">🥪</div>
        <h1
          className="mb-1.5 text-3xl font-black tracking-tight"
          style={{
            background: "linear-gradient(135deg, #FFD700, #FF6B6B, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sandwich Builder
        </h1>
        <p className="text-sm text-gray-400">
          Pokémon Scarlet & Violet — Receitas para Shiny Hunt, Encounter & mais
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setSelectedType(null);
            }}
            className={`flex-1 rounded-lg px-2 py-2.5 text-center text-sm font-bold transition-all ${
              tab === t.id
                ? "border-b-2 border-violet-500 bg-violet-500/15 text-white"
                : "border-b-2 border-transparent text-gray-400"
            }`}
          >
            <div>{t.label}</div>
            <div className="text-[10px] font-normal opacity-70">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Type Filter */}
      {tab !== "search" && (
        <div className="mb-5 flex flex-wrap justify-center gap-1.5">
          <button
            onClick={() => setSelectedType(null)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              !selectedType
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-gray-400"
            }`}
          >
            Todos
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() =>
                setSelectedType(selectedType === t ? null : t)
              }
              className="rounded-full border px-3 py-1 text-[11px] font-bold text-white transition-all"
              style={{
                background:
                  selectedType === t
                    ? TYPE_COLORS[t]
                    : "rgba(255,255,255,0.05)",
                borderColor:
                  selectedType === t
                    ? TYPE_COLORS[t]
                    : "rgba(255,255,255,0.1)",
                opacity: selectedType === t ? 1 : 0.6,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Search Tab */}
      {tab === "search" && (
        <div className="mb-5">
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-sm font-bold text-gray-100">
              🔎 Busca Reversa — &quot;Quero tal poder, qual receita?&quot;
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={searchPower}
                onChange={(e) => setSearchPower(e.target.value)}
                className="min-w-[180px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100"
              >
                <option value="">Qualquer Power...</option>
                {MEAL_POWERS.map((p) => (
                  <option key={p} value={p}>
                    {p} Power
                  </option>
                ))}
              </select>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="min-w-[140px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100"
              >
                <option value="">Qualquer Tipo...</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid gap-2.5">
              {searchResults.map((r, i) => (
                <RecipeCard key={i} recipe={r} onSelect={setSelectedRecipe} />
              ))}
            </div>
          ) : searchPower || searchType ? (
            <div className="py-10 text-center text-gray-500">
              Nenhuma receita encontrada com esses filtros 😅
            </div>
          ) : null}
        </div>
      )}

      {/* Shiny Tab */}
      {tab === "shiny" && (
        <div>
          <div
            className="mb-4 rounded-xl p-3.5 text-sm text-gray-400"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.07), rgba(255,107,107,0.07))",
              border: "1px solid rgba(255,215,0,0.2)",
            }}
          >
            <strong className="text-yellow-400">✨ Shiny Hunt Recipes</strong>{" "}
            — Todas dão <strong>Sparkling Power Lv.3</strong> +{" "}
            <strong>Encounter Power Lv.3</strong>. Precisam de{" "}
            <strong>2x Herba Mystica</strong> do mesmo tipo.
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {filteredShiny.map((r, i) => (
              <RecipeCard key={i} recipe={r} onSelect={setSelectedRecipe} />
            ))}
          </div>
        </div>
      )}

      {/* Encounter Tab */}
      {tab === "encounter" && (
        <div>
          <div
            className="mb-4 rounded-xl p-3.5 text-sm text-gray-400"
            style={{
              background:
                "linear-gradient(135deg, rgba(78,205,196,0.07), rgba(44,140,133,0.07))",
              border: "1px solid rgba(78,205,196,0.2)",
            }}
          >
            <strong className="text-teal-400">🔍 Encounter Recipes</strong> —
            Sem Herba Mystica. Boas pra farm de EVs e completar Pokédex.
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {filteredEncounter.map((r, i) => (
              <RecipeCard key={i} recipe={r} onSelect={setSelectedRecipe} />
            ))}
          </div>
          {filteredEncounter.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              Nenhuma receita de Encounter pra esse tipo ainda 🔧
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
        PokéTrainer SV Tools — Sandwich Builder v1.0
        <br />
        Dados baseados em receitas verificadas pela comunidade
      </div>
    </div>
  );
}
