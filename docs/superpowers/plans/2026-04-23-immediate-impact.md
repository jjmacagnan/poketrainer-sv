# Immediate Impact: Pagination + Deep Linking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the 685-item rendering bottleneck in EV Pokédex and enable deep linking to pre-populate filters/Pokémon across EV Pokédex and Raid Builder.

**Architecture:** Two independent tracks. Track A adds client-side pagination to `EVPokedex` (card + table views), resetting page on filter changes. Track B reads `useSearchParams` at component mount to hydrate filter state — EV Pokédex gets `?stat`, `?type`, `?q`; Raid Builder gets `?pokemon` (by name) and `?b` (full base64-encoded build, already partially implemented). URL is kept in sync via `replaceState` so browser history stays clean.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript. No new dependencies — `useSearchParams` from `next/navigation`, `window.history.replaceState` for URL sync. Components need Suspense wrappers when `useSearchParams` is used.

---

## Track A — EV Pokédex Pagination

### Task 1: Add pagination state and reset logic

**Files:**
- Modify: `src/components/ev/EVPokedex.tsx`

- [ ] **Step 1: Add pagination constants and state**

Inside `EVPokedex()`, after existing state declarations (around line 71), add:

```tsx
const CARDS_PER_PAGE = 48;
const ROWS_PER_PAGE = 100;

const [page, setPage] = useState(0);
```

- [ ] **Step 2: Reset page whenever filters change**

After the `sorted` useMemo (around line 122), add:

```tsx
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
```

Add `useRef` to the imports at line 3:
```tsx
import { useState, useMemo, useEffect, useRef } from "react";
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ev/EVPokedex.tsx
git commit -m "feat(ev-pokedex): add pagination state with filter-reset"
```

---

### Task 2: Paginate the card view

**Files:**
- Modify: `src/components/ev/EVPokedex.tsx`

- [ ] **Step 1: Slice the card grid to current page**

Replace the card grid section (around line 256–265):

```tsx
// Before:
) : viewMode === "card" ? (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {sorted.map((pokemon, idx) => (
      <PokemonCard
        key={pokemon.nationalDex}
        pokemon={pokemon}
        selectedStat={selectedStat}
        onClick={() => setSelectedIndex(idx)}
      />
    ))}
  </div>
```

```tsx
// After:
) : viewMode === "card" ? (
  <>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted
        .slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
        .map((pokemon) => {
          const idx = sorted.indexOf(pokemon);
          return (
            <PokemonCard
              key={pokemon.nationalDex}
              pokemon={pokemon}
              selectedStat={selectedStat}
              onClick={() => setSelectedIndex(idx)}
            />
          );
        })}
    </div>
    <PaginationControls
      page={page}
      total={sorted.length}
      perPage={CARDS_PER_PAGE}
      onPageChange={setPage}
    />
  </>
```

- [ ] **Step 2: Add the `PaginationControls` component at the bottom of the file**

After the closing brace of `PokemonTable`, add:

```tsx
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
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ev/EVPokedex.tsx
git commit -m "feat(ev-pokedex): paginate card view (48 per page)"
```

---

### Task 3: Paginate the table view

**Files:**
- Modify: `src/components/ev/EVPokedex.tsx`

- [ ] **Step 1: Slice the table and add pagination below it**

Replace the table section (around line 267–272):

```tsx
// Before:
      ) : (
        <PokemonTable
          pokemon={sorted}
          selectedStat={selectedStat}
          onSelect={(p) => setSelectedIndex(sorted.findIndex((s) => s.nationalDex === p.nationalDex))}
        />
      )}
```

```tsx
// After:
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ev/EVPokedex.tsx
git commit -m "feat(ev-pokedex): paginate table view (100 per page)"
```

---

## Track B — Deep Linking

### Task 4: URL sync for EV Pokédex filters

Enables sharing links like `/ev-pokedex?stat=spe&type=electric&q=jolteon`.

**Files:**
- Modify: `src/components/ev/EVPokedex.tsx`
- Modify: `src/app/ev-pokedex/page.tsx`

- [ ] **Step 1: Wrap the page in Suspense** (required for `useSearchParams` in App Router)

Open `src/app/ev-pokedex/page.tsx` and replace its content:

```tsx
"use client";

import { Suspense } from "react";
import { EVPokedex } from "@/components/ev/EVPokedex";

export default function EVPokedexPage() {
  return (
    <Suspense>
      <EVPokedex />
    </Suspense>
  );
}
```

- [ ] **Step 2: Read URL params to hydrate initial filter state**

In `EVPokedex.tsx`, add the import:
```tsx
import { useSearchParams } from "next/navigation";
```

Inside `EVPokedex()`, before the state declarations, add:
```tsx
const searchParams = useSearchParams();
```

Change the state initializers to read from URL:
```tsx
const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
const [selectedType, setSelectedType] = useState<string | null>(() => searchParams.get("type"));
const [selectedStat, setSelectedStat] = useState<StatName | null>(() => {
  const s = searchParams.get("stat");
  return s && STAT_NAMES.includes(s as StatName) ? (s as StatName) : null;
});
const [selectedAmount, setSelectedAmount] = useState<string | null>(() => searchParams.get("amount"));
```

- [ ] **Step 3: Sync URL when filters change**

After the filter-reset `useEffect` (Task 1, Step 2), add:

```tsx
useEffect(() => {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (selectedType) params.set("type", selectedType);
  if (selectedStat) params.set("stat", selectedStat);
  if (selectedAmount) params.set("amount", selectedAmount);
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}, [search, selectedType, selectedStat, selectedAmount]);
```

- [ ] **Step 4: Verify TypeScript**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ev/EVPokedex.tsx src/app/ev-pokedex/page.tsx
git commit -m "feat(ev-pokedex): sync filters to URL for deep linking"
```

---

### Task 5: Raid Builder — `?pokemon=` pre-selection

Enables `/raid-builder?pokemon=annihilape` to pre-select a Pokémon.

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx`
- Modify: `src/app/raid-builder/page.tsx`

- [ ] **Step 1: Wrap the raid builder page in Suspense**

Replace `src/app/raid-builder/page.tsx`:

```tsx
"use client";

import { Suspense } from "react";
import { RaidBuildMaker } from "@/components/raid/RaidBuildMaker";

export default function RaidBuilderPage() {
  return (
    <Suspense>
      <RaidBuildMaker />
    </Suspense>
  );
}
```

- [ ] **Step 2: Read `?pokemon=` on mount and pre-select**

In `RaidBuildMaker.tsx`, add to imports:
```tsx
import { useSearchParams } from "next/navigation";
```

Inside `RaidBuildMaker()`, after the existing state/hook declarations, find where `build` state is declared (search for `useLocalStorage`) and add below it:

```tsx
const searchParams = useSearchParams();
const didApplyUrlPokemon = useRef(false);

useEffect(() => {
  if (didApplyUrlPokemon.current) return;
  const pokemonParam = searchParams.get("pokemon");
  if (!pokemonParam) return;
  const match = allPokemon.find(
    (p) => p.name.toLowerCase() === pokemonParam.toLowerCase()
  );
  if (match) {
    setBuild((prev) => ({ ...prev, pokemon: match, pokemonFallback: undefined }));
  }
  didApplyUrlPokemon.current = true;
}, [searchParams]);
```

Add `useRef` to the existing React import if not already present. Check line 3 — it already imports `useState, useMemo, useCallback`. Add `useEffect, useRef`:
```tsx
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
```

- [ ] **Step 3: Check that `pokemonFallback` is the correct field name**

```bash
grep -n "pokemonFallback" /Users/jjmacagnan/Development/Jbit/poketrainer-sv/src/components/raid/RaidBuildMaker.tsx | head -10
```

Confirm the field used in `BuildState` to clear the fallback when setting a new Pokémon. If the field name differs, update the `setBuild` call accordingly.

- [ ] **Step 4: Verify TypeScript**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx src/app/raid-builder/page.tsx
git commit -m "feat(raid-builder): pre-select pokemon from ?pokemon= URL param"
```

---

### Task 6: Raid Builder — `?b=` full build share link

The share button and encoding are already written but commented out (lines 1503–1525). This task uncomments, completes, and adds decoding on load.

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx`

- [ ] **Step 1: Add build decoding from `?b=` on mount**

Inside the `useEffect` added in Task 5, extend it to also read `?b=`:

```tsx
useEffect(() => {
  if (didApplyUrlPokemon.current) return;
  didApplyUrlPokemon.current = true;

  const buildParam = searchParams.get("b");
  if (buildParam) {
    try {
      const json = decodeURIComponent(escape(atob(buildParam)));
      const data = JSON.parse(json) as {
        p: number; t: string | null; n: string; a: string;
        i: string; m: (string | null)[]; e: Record<string, number>;
        v: Record<string, number>; l: number; o: string;
      };
      const pokemon = allPokemon.find((p) => p.nationalDex === data.p) ?? null;
      const nature = natures.find((n) => n.name === data.n) ?? natures[0];
      if (pokemon) {
        setBuild({
          pokemon,
          pokemonFallback: undefined,
          teraType: data.t as PokemonType | null,
          nature,
          ability: data.a,
          item: data.i,
          moves: (data.m as (string | null)[]).concat([null, null, null, null]).slice(0, 4) as [string | null, string | null, string | null, string | null],
          evs: data.e as Record<StatName, number>,
          ivs: data.v as Record<StatName, number>,
          level: data.l,
          notes: data.o,
        });
      }
    } catch {
      // malformed ?b= param — ignore
    }
    return;
  }

  const pokemonParam = searchParams.get("pokemon");
  if (!pokemonParam) return;
  const match = allPokemon.find(
    (p) => p.name.toLowerCase() === pokemonParam.toLowerCase()
  );
  if (match) {
    setBuild((prev) => ({ ...prev, pokemon: match, pokemonFallback: undefined }));
  }
}, [searchParams]);
```

- [ ] **Step 2: Uncomment and fix the share button**

Find the commented-out share button block (lines ~1503–1525) and replace it with the active version:

```tsx
<button
  onClick={() => {
    const data = {
      p: build.pokemon!.nationalDex,
      t: build.teraType,
      n: build.nature.name,
      a: build.ability,
      i: build.item,
      m: build.moves.filter(Boolean),
      e: build.evs,
      v: build.ivs,
      l: build.level,
      o: build.notes,
    };
    const hash = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = `${window.location.origin}/raid-builder?b=${hash}`;
    navigator.clipboard.writeText(url);
  }}
  className="border border-[var(--pt-border-dim)] px-4 py-2 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-[var(--pt-text-dim)] transition-colors hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]"
>
  {t("raid.copyLink")}
</button>
```

- [ ] **Step 3: Verify the translation key exists**

```bash
grep "copyLink" /Users/jjmacagnan/Development/Jbit/poketrainer-sv/src/i18n/pt.json /Users/jjmacagnan/Development/Jbit/poketrainer-sv/src/i18n/en.json
```

If the key is missing from either file, add it:
- `pt.json`: `"copyLink": "Copiar link"`
- `en.json`: `"copyLink": "Copy link"`

The key lives inside the `"raid"` object.

- [ ] **Step 4: Verify TypeScript**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx src/i18n/pt.json src/i18n/en.json
git commit -m "feat(raid-builder): enable ?b= deep link share for full builds"
```

---

## Self-Review

**Spec coverage:**
- ✅ EV Pokédex pagination — Tasks 1–3
- ✅ EV Pokédex URL filter sync — Task 4
- ✅ Raid Builder `?pokemon=` — Task 5
- ✅ Raid Builder `?b=` full build share — Task 6

**Placeholder scan:**
- No TBD/TODO placeholders
- Task 5 Step 3 has a verification step for field name — this is intentional (defensive check before modifying a large file)

**Type consistency:**
- `StatName` used consistently (imported from `@/lib/constants` in both files)
- `PokemonType` used in `teraType` cast — matches existing usage in the file
- `BuildState` fields (`pokemon`, `pokemonFallback`, `teraType`, `nature`, `ability`, `item`, `moves`, `evs`, `ivs`, `level`, `notes`) verified against the existing `getDefaultBuild()` shape visible in lines 135–144
