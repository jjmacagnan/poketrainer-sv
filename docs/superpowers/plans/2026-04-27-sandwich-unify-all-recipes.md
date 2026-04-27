# Sandwich Unify ALL_RECIPES Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale `ALL_RECIPES` array in `sandwich-recipes.ts` with a derived export from `sandwich-guide.ts` that covers all recipe categories and uses correct herba combos.

**Architecture:** Add `ALL_RECIPES` to the end of `sandwich-guide.ts` by flattening SHINY_GUIDE, ENCOUNTER_GUIDE, RAID_GUIDE, UTILITY_RECIPES, and BREEDING_RECIPES. Remove the now-dead `SHINY_RECIPES`, `ENCOUNTER_RECIPES`, and `ALL_RECIPES` from `sandwich-recipes.ts`. Update the one import site in `SandwichBuilder.tsx`.

**Tech Stack:** TypeScript, Next.js 16 (App Router), ESLint

---

### Task 1: Export ALL_RECIPES from sandwich-guide.ts

**Files:**
- Modify: `src/data/sandwich-guide.ts` (end of file, after BREEDING_RECIPES)

- [ ] **Step 1: Add ALL_RECIPES export at the end of sandwich-guide.ts**

Open `src/data/sandwich-guide.ts`. After the closing of `BREEDING_RECIPES`, append:

```ts
export const ALL_RECIPES: SandwichRecipe[] = [
  ...SHINY_GUIDE.flatMap((e) => e.recipes),
  ...ENCOUNTER_GUIDE.flatMap((e) => e.recipes),
  ...RAID_GUIDE.flatMap((e) => e.recipes),
  ...UTILITY_RECIPES,
  ...BREEDING_RECIPES,
];
```

`SandwichRecipe` is already imported at the top of this file (`import type { SandwichRecipe } from "./sandwich-recipes"`). No new imports needed.

- [ ] **Step 2: Verify TypeScript accepts the new export**

```bash
npx tsc --noEmit
```

Expected: no errors. If there are type errors, check that `UtilitySandwichRecipe` (which extends `SandwichRecipe`) is assignable to `SandwichRecipe[]` — it is, by structural subtyping.

- [ ] **Step 3: Commit**

```bash
git add src/data/sandwich-guide.ts
git commit -m "feat(data): export ALL_RECIPES from sandwich-guide"
```

---

### Task 2: Update SandwichBuilder.tsx import

**Files:**
- Modify: `src/components/sandwich/SandwichBuilder.tsx` (line 22)

- [ ] **Step 1: Split the import on line 22**

Find this line in `SandwichBuilder.tsx`:

```ts
import { ALL_RECIPES, MEAL_POWERS } from "@/data/sandwich-recipes";
```

Replace with:

```ts
import { ALL_RECIPES } from "@/data/sandwich-guide";
import { MEAL_POWERS } from "@/data/sandwich-recipes";
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```

Expected: no errors or warnings related to the import change.

- [ ] **Step 3: Commit**

```bash
git add src/components/sandwich/SandwichBuilder.tsx
git commit -m "feat(sandwich): import ALL_RECIPES from sandwich-guide"
```

---

### Task 3: Remove dead code from sandwich-recipes.ts

**Files:**
- Modify: `src/data/sandwich-recipes.ts`

- [ ] **Step 1: Delete SHINY_RECIPES, ENCOUNTER_RECIPES, and ALL_RECIPES**

Remove the entire block from line 27 to the end of the file — that is, everything from `export const SHINY_RECIPES` through `export const ALL_RECIPES = [...SHINY_RECIPES, ...ENCOUNTER_RECIPES]`.

The file should end after `HERBA_FARM_INFO`. The remaining exports are:

```ts
export interface SandwichRecipe { ... }
export const MEAL_POWERS = [ ... ]
export const HERBA_MYSTICA = [ ... ]
export const HERBA_FARM_INFO: Record<string, string> = { ... }
```

- [ ] **Step 2: Verify the build succeeds**

```bash
npm run build
```

Expected: clean build with no type errors and no "module has no exported member" errors. If any file still imports `SHINY_RECIPES`, `ENCOUNTER_RECIPES`, or `ALL_RECIPES` from `sandwich-recipes`, the build will fail — fix those imports.

- [ ] **Step 3: Commit**

```bash
git add src/data/sandwich-recipes.ts
git commit -m "chore(data): remove stale SHINY_RECIPES and ENCOUNTER_RECIPES"
```

---

### Task 4: Verify search behaviour

**Files:** none — this is a manual verification step.

- [ ] **Step 1: Run the dev server and open the Sandwich Builder**

```bash
npm run dev
```

Navigate to `http://localhost:3000/sandwich-builder` and go to the **Search** tab → **Search by Power**.

- [ ] **Step 2: Confirm Raid and Utility recipes now appear in search**

Select "Raid" as the power. Confirm recipes like "Ultra Five-Alarm Sandwich #122" appear in the results (they were invisible before this change).

Select "Egg" as the power. Confirm "Great Peanut Butter Sandwich #17" and "Jam Sandwich — Egg Power Lv.3" appear.

- [ ] **Step 3: Confirm shiny recipes use corrected herba combos**

Select "Sparkling" as the power and "Grass" as the type. Confirm the primary result shows **Salty + Sour** (not 2×Salty).

Select type "Electric". Confirm primary result shows **Salty + Spicy**.

Select type "Dark". Confirm primary result shows **Salty + Sweet**.
