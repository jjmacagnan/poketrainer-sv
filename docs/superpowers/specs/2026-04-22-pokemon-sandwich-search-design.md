# Design: Pokémon-First Sandwich Search

**Date:** 2026-04-22
**Status:** Approved

## Overview

Add a "search by Pokémon" mode to the existing Search tab in the Sandwich Builder. The user types a Pokémon name, picks a goal (Shiny / Encounter / Raid / Breeding), and sees the relevant sandwich recipes for that Pokémon's type(s).

---

## Placement

Inside the existing **Search tab** (`tab === "search"` in `SandwichBuilder.tsx`).

A toggle switches between two modes:
- **"Por Pokémon"** — new Pokémon-first search (default)
- **"Por Poder"** — existing reverse search (select power + type → recipes)

---

## User Flow

```
1. User types Pokémon name
   → Fuzzy dropdown appears with sprite + type badges

2. User selects a Pokémon
   → If dual-type: type toggle appears (e.g. [Fire] [Flying])
   → Single-type: type is auto-selected

3. User picks goal: [Shiny] [Encounter] [Raid] [Breeding]

4. Results render: recipes for that type + goal
   → Reuses existing RecipeCard / TypeGuideCard components
```

---

## Architecture

### New file: `src/components/sandwich/PokemonSandwichSearch.tsx`

Self-contained component responsible for:
- Pokémon name input + fuzzy search via `usePokemonSearch`
- Pokémon selection with sprite + type display
- Type selector (shown only for dual-type Pokémon)
- Goal selector (Shiny / Encounter / Raid / Breeding)
- Recipe results

### Changes to `SandwichBuilder.tsx`

- Add `searchMode: "pokemon" | "power"` state (default `"pokemon"`)
- In the `tab === "search"` block: render toggle + conditionally render `<PokemonSandwichSearch>` or existing reverse search JSX

---

## Data Sources

| Data | Source | Already available |
|---|---|---|
| Pokémon list (name, types, sprite) | `src/data/generated/pokemon.json` | ✅ |
| Shiny recipes by type | `SHINY_GUIDE` in `sandwich-guide.ts` | ✅ |
| Encounter recipes by type | `ENCOUNTER_GUIDE` in `sandwich-guide.ts` | ✅ |
| Raid recipes by type | `RAID_GUIDE` in `sandwich-guide.ts` | ✅ |
| Breeding recipes | `BREEDING_RECIPES` in `sandwich-guide.ts` | ✅ |
| Fuzzy search | `usePokemonSearch` hook | ✅ |

No new data files or API calls needed.

---

## Component Details

### PokemonSandwichSearch props

```ts
onSelectRecipe: (r: SandwichRecipe) => void
// RecipeDetail is controlled by SandwichBuilder — no duplication
```

### PokemonSandwichSearch state

```ts
pokemonQuery: string          // input text
selectedPokemon: Pokemon | null
selectedType: PokemonType | null
goal: "shiny" | "encounter" | "raid" | "breeding"
```

### Recipe resolution logic

```ts
const guideMap = {
  shiny:     SHINY_GUIDE,
  encounter: ENCOUNTER_GUIDE,
  raid:      RAID_GUIDE,
  breeding:  null, // special case — BREEDING_RECIPES is flat, not typed
}

// For shiny/encounter/raid: find the SandwichGuideEntry matching selectedType
// For breeding: show BREEDING_RECIPES directly (type-agnostic)
```

### Dual-type handling

- If `selectedPokemon.types.length === 2`, show two type buttons after selection
- Default to `types[0]` (primary type) — user can switch to secondary
- For breeding goal, type is irrelevant — skip the type selector

### Dropdown behavior

- Show dropdown only when `pokemonQuery.length >= 2`
- Max 8 results in dropdown to avoid overflow
- Click outside closes dropdown (or selecting a result)
- Clicking a result locks in the Pokémon and clears the input

---

## UI Layout (within Search tab)

```
[ Por Pokémon ] [ Por Poder ]     ← toggle

[ 🔍 Search Pokémon...          ]
  ↓ (dropdown)
  [ 🖼 Charizard  Fire  Flying  ]
  [ 🖼 Charmander  Fire         ]
  ...

— after selection —
[ 🖼 Charizard ]  [ Fire ] [ Flying ]   ← type toggle if dual

[ Shiny ] [ Encounter ] [ Raid ] [ Breeding ]   ← goal selector

— results —
[ RecipeCard ... ]
[ RecipeCard ... ]
```

---

## Reused Components

- `RecipeCard` — renders a single recipe row
- `RecipeDetail` — full detail view (already wired in SandwichBuilder)
- `HerbaBadge` — herba color pill (local to SandwichBuilder, may need to export or duplicate)
- `TypeGuideCard` — optional, could reuse for richer display
- `usePokemonSearch` — fuzzy name search hook

---

## Out of Scope

- Saving/bookmarking search history
- Filtering by generation or region within the Pokémon search
- Showing Pokémon that appear only as Raid bosses (excluded via `wildPokemonData` filter if desired, or include all 685)
- i18n strings (can be added in a follow-up)
