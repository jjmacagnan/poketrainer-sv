# Design: Unify ALL_RECIPES — Single Source of Truth

**Date:** 2026-04-27
**Status:** Approved

## Problem

`sandwich-recipes.ts` exports `SHINY_RECIPES` and `ENCOUNTER_RECIPES` as standalone arrays, plus `ALL_RECIPES = [...SHINY_RECIPES, ...ENCOUNTER_RECIPES]`. These are a second, older copy of data that already exists — more accurately — in `sandwich-guide.ts`.

Two consequences:
1. The search feature (`ALL_RECIPES`) uses stale herba combos for several types (Grass: 2×Salty instead of Salty+Sour; Electric: 2×Salty instead of Salty+Spicy; Dark/Steel: 2×Salty instead of Salty+Sweet).
2. Recipes from Utility, Raid, and Breeding tabs are invisible to search, even though they exist in the guide data.

## Goal

- One source of truth for recipe data: `sandwich-guide.ts`
- `ALL_RECIPES` is derived from the guide arrays, not maintained separately
- Search finds recipes from all tabs (shiny, encounter, raid, utility, breeding)

## Out of Scope

- `MASS_OUTBREAK_GUIDE` and `VGC_ANY_HERBA_GUIDE` are excluded from `ALL_RECIPES` — they use `MassOutbreakRecipe` (no `name` or `herba` fields) and are already surfaced in the Outbreak tab.
- No UI changes — the existing search UI works as-is with the enriched data.

## Changes

### 1. `src/data/sandwich-guide.ts`

Add at the end of the file:

```ts
export const ALL_RECIPES: SandwichRecipe[] = [
  ...SHINY_GUIDE.flatMap((e) => e.recipes),
  ...ENCOUNTER_GUIDE.flatMap((e) => e.recipes),
  ...RAID_GUIDE.flatMap((e) => e.recipes),
  ...UTILITY_RECIPES,
  ...BREEDING_RECIPES,
];
```

### 2. `src/data/sandwich-recipes.ts`

Remove:
- `SHINY_RECIPES` array (dead code — data lives in SHINY_GUIDE)
- `ENCOUNTER_RECIPES` array (dead code — data lives in ENCOUNTER_GUIDE)
- `ALL_RECIPES` export (moved to sandwich-guide.ts)

Keep:
- `SandwichRecipe` interface
- `MEAL_POWERS` constant
- `HERBA_MYSTICA` constant
- `HERBA_FARM_INFO` constant

### 3. `src/components/sandwich/SandwichBuilder.tsx`

Update import:
```ts
// Before
import { ALL_RECIPES, MEAL_POWERS } from "@/data/sandwich-recipes";
// After
import { ALL_RECIPES } from "@/data/sandwich-guide";
import { MEAL_POWERS } from "@/data/sandwich-recipes";
```

### 4. `src/components/sandwich/PokemonSandwichSearch.tsx`

No changes needed — already imports from `@/data/sandwich-guide` and does not use `ALL_RECIPES`.

## Data Correctness After Change

The SHINY_GUIDE already has the community-verified herba combos:

| Type    | Old (sandwich-recipes.ts) | New (sandwich-guide.ts) |
|---------|---------------------------|--------------------------|
| Normal  | Chorizo + 2×Salty         | Tofu + Salty+Sour        |
| Fire    | Red Bell Pepper + 2×Salty | Red Bell Pepper + Salty+Spicy |
| Grass   | Lettuce + 2×Salty         | Lettuce + Salty+Sour     |
| Electric| Yellow Bell Pepper + 2×Salty | Yellow Bell Pepper + Salty+Spicy |
| Poison  | Sliced Green Pepper + 2×Salty | Green Bell Pepper + Salty+Spicy |
| Dark    | Smoked Fillet + 2×Salty   | Smoked Fillet + Salty+Sweet |
| Steel   | Hamburger + 2×Salty       | Hamburger + Salty+Sweet  |

## Search Coverage After Change

| Category       | Before | After |
|----------------|--------|-------|
| Shiny recipes  | ✅ (stale combos) | ✅ (correct combos + alts) |
| Encounter Lv.2 (simple) | ✅ | ✅ |
| Encounter (named, no herba) | ❌ | ✅ |
| Raid power     | ❌ | ✅ |
| Utility picks  | ❌ | ✅ |
| Breeding / Egg | ❌ | ✅ |
