# Pokémon-First Sandwich Search — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Por Pokémon" mode to the Search tab of SandwichBuilder so users can find sandwich recipes by searching a Pokémon name and selecting a goal.

**Architecture:** A new `PokemonSandwichSearch` component handles Pokémon fuzzy search, type selection, goal selection, and recipe display. `SandwichBuilder` gains a `searchMode` toggle that swaps between this component and the existing reverse search.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS. No test framework — use `npx tsc --noEmit` for type-checking.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Create** | `src/components/sandwich/PokemonSandwichSearch.tsx` | Pokémon input, dropdown, type picker, goal picker, recipe results |
| **Modify** | `src/components/sandwich/SandwichBuilder.tsx` | Add `searchMode` state, toggle UI, import + render `PokemonSandwichSearch` |

---

## Task 1: Create `PokemonSandwichSearch.tsx` with full implementation

**Files:**
- Create: `src/components/sandwich/PokemonSandwichSearch.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
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

const HERBA_COLORS: Record<string, string> = {
  Salty: "#6CB4E4",
  Sweet: "#FF9CC2",
  Spicy: "#FF6B35",
  Sour: "#8AC926",
  Bitter: "#9B59B6",
};

function HerbaBadge({ herba }: { herba: string }) {
  return (
    <span
      className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
      style={{ background: HERBA_COLORS[herba] ?? "#666" }}
    >
      {herba}
    </span>
  );
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
                  <Image
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
          <Image
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
          {recipes.map((r, i) => (
            <RecipeCard key={i} recipe={r} onSelect={onSelectRecipe} />
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sandwich/PokemonSandwichSearch.tsx
git commit -m "feat: add PokemonSandwichSearch component"
```

---

## Task 2: Wire `PokemonSandwichSearch` into `SandwichBuilder.tsx`

**Files:**
- Modify: `src/components/sandwich/SandwichBuilder.tsx`

The existing Search tab block is at lines ~312–358. You will:
1. Add `searchMode` state
2. Import the new component
3. Replace the search tab content with a toggle + conditional render

- [ ] **Step 1: Add import at the top of `SandwichBuilder.tsx`**

After the existing imports (around line 18), add:

```tsx
import { PokemonSandwichSearch } from "./PokemonSandwichSearch";
```

- [ ] **Step 2: Add `searchMode` state**

In the `SandwichBuilder` function body, after the existing `useState` calls (around line 169), add:

```tsx
const [searchMode, setSearchMode] = useState<"pokemon" | "power">("pokemon");
```

- [ ] **Step 3: Replace the Search tab block**

Find this block (starts around line 312):
```tsx
{/* Search Tab */}
{tab === "search" && (
  <div className="mb-5">
    <div className="mb-4 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
```

Replace the entire `{tab === "search" && ( ... )}` block with:

```tsx
{/* Search Tab */}
{tab === "search" && (
  <div className="mb-5">
    {/* Mode toggle */}
    <div className="mb-4 flex gap-0 border border-[var(--pt-border-dim)]">
      <button
        onClick={() => setSearchMode("pokemon")}
        className={`flex-1 border-b-2 px-3 py-2.5 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] transition-all ${
          searchMode === "pokemon"
            ? "border-b-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)] text-white"
            : "border-b-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
        }`}
      >
        {t("sandwich.searchByPokemon")}
      </button>
      <button
        onClick={() => setSearchMode("power")}
        className={`flex-1 border-b-2 border-l border-l-[var(--pt-border-dim)] px-3 py-2.5 text-center font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] transition-all ${
          searchMode === "power"
            ? "border-b-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)] text-white"
            : "border-b-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
        }`}
      >
        {t("sandwich.searchByPower")}
      </button>
    </div>

    {searchMode === "pokemon" ? (
      <PokemonSandwichSearch onSelectRecipe={setSelectedRecipe} />
    ) : (
      <div>
        <div className="mb-4 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4">
          <div className="mb-3 text-sm font-bold text-gray-100">
            {t("sandwich.reverseSearch")}
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={searchPower}
              onChange={(e) => setSearchPower(e.target.value)}
              className="min-w-[180px] flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
            >
              <option value="">{t("sandwich.anyPower")}</option>
              {MEAL_POWERS.map((p) => (
                <option key={p} value={p}>
                  {p} {t("sandwich.power")}
                </option>
              ))}
            </select>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="min-w-[140px] flex-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2 text-sm text-gray-100"
            >
              <option value="">{t("sandwich.anyType")}</option>
              {TYPES.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
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
          <div className="py-10 text-center text-[var(--pt-text-dim)]">
            {t("sandwich.noRecipes")}
          </div>
        ) : null}
      </div>
    )}
  </div>
)}
```

- [ ] **Step 4: Add i18n keys to both locale files**

In `src/i18n/pt.json`, find the `"sandwich"` object and add:

```json
"searchByPokemon": "Por Pokémon",
"searchByPower": "Por Poder"
```

In `src/i18n/en.json`, find the `"sandwich"` object and add:

```json
"searchByPokemon": "By Pokémon",
"searchByPower": "By Power"
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/sandwich/SandwichBuilder.tsx src/i18n/pt.json src/i18n/en.json
git commit -m "feat: add Pokémon-first search toggle to sandwich builder"
```

---

## Self-Review

**Spec coverage:**
- ✅ Toggle "Por Pokémon" / "Por Poder" in Search tab
- ✅ Pokémon fuzzy search with dropdown (8 results max, activates at 2+ chars)
- ✅ Sprite + type badges in dropdown
- ✅ Dual-type → type selector shown; single-type → auto-selected
- ✅ Goal selector (Shiny / Encounter / Raid / Breeding)
- ✅ Breeding goal is type-agnostic (uses `BREEDING_RECIPES` flat list)
- ✅ Recipe results via `RecipeCard`
- ✅ `onSelectRecipe` prop — RecipeDetail controlled by SandwichBuilder
- ✅ Click-outside closes dropdown
- ✅ "No results" empty state
- ✅ No new data files or API calls

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:**
- `Pokemon` interface defined in Task 1, used throughout Task 1 only (self-contained)
- `SandwichRecipe` imported from `@/data/sandwich-recipes` in Task 1, passed via `onSelectRecipe` prop
- `setSelectedRecipe` passed as `onSelectRecipe` in Task 2 — matches `(r: SandwichRecipe) => void` ✅
- `searchMode` state added in Task 2 Step 2, used in Task 2 Step 3 ✅
