# Raid Boss Finder Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Boss Finder in RaidBuildMaker with three targeted fixes: score all builds per entry (not just primary), add quick-select chips from RAID_BOSSES, and use boss base types in scoring.

**Architecture:** All changes are confined to `src/components/raid/RaidBuildMaker.tsx`. The result type of `bossRecommendations` gains a `bestBuildIndex` field; the scoring memo gains a base-type pass; the boss finder panel gains a chip row powered by the existing `RAID_BOSSES` data.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS v4, React useMemo/useCallback

---

## Files

| Action | Path | What changes |
|--------|------|-------------|
| Modify | `src/components/raid/RaidBuildMaker.tsx` | All three tasks — import RAID_BOSSES, update scoring memo, add chip UI, fix display |

---

### Task 1 — Import RAID_BOSSES and update result type

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx:14`

- [ ] **Step 1: Add RAID_BOSSES import**

In the imports section (around line 14), add:

```ts
import { RAID_BOSSES } from "@/data/raid-bosses";
```

- [ ] **Step 2: Update the bossRecommendations result type**

Find the `bossRecommendations` useMemo signature (line ~386). Change its return type annotation from:

```ts
const bossRecommendations = useMemo((): { entry: RaidTierEntry; score: number; seMovesForBoss: string[] }[] => {
```

to:

```ts
const bossRecommendations = useMemo((): {
  entry: RaidTierEntry;
  score: number;
  seMovesForBoss: string[];
  bestBuildIndex: number;
}[] => {
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx
git commit -m "refactor: add RAID_BOSSES import and extend bossRecommendations result type"
```

---

### Task 2 — B: Score all builds per entry, track bestBuildIndex

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx:386-419` (the `bossRecommendations` useMemo body)

- [ ] **Step 1: Replace the scoring body**

Replace the entire inner `.map()` callback (from `const primaryBuild = entry.builds[0]` to `return { entry, score, seMovesForBoss }`) with:

```ts
.map((entry) => {
  let bestBuildIndex = 0;
  let bestSeCount = -1;
  let seMovesForBoss: string[] = [];

  entry.builds.forEach((build, idx) => {
    const seMoves: string[] = [];
    for (const moveName of build.moves) {
      const moveData = allMoves.find(
        (m) => m.name.toLowerCase() === moveName.toLowerCase()
      );
      if (moveData && bossWeaknesses.has(moveData.type.toLowerCase())) {
        seMoves.push(moveName);
      }
    }
    if (seMoves.length > bestSeCount) {
      bestSeCount = seMoves.length;
      bestBuildIndex = idx;
      seMovesForBoss = seMoves;
    }
  });

  let score = seMovesForBoss.length * 2;
  if (entry.tags.includes("Top Pick")) score += 1;
  if (entry.tags.includes("Solo Viable")) score += 1;
  if (entry.tags.includes("7★ Ready") && bossStars === 7) score += 1;
  if (entry.tags.includes("Budget Pick")) score += 0.5;

  return { entry, score, seMovesForBoss, bestBuildIndex };
})
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Update the recommendation card display to use bestBuildIndex**

In the recommendation grid (line ~598), find the two places that read `entry.builds[0]` and replace both with `entry.builds[bestBuildIndex]`. The map callback destructures `{ entry, seMovesForBoss }` — add `bestBuildIndex` to the destructure:

```tsx
{bossRecommendations.map(({ entry, seMovesForBoss, bestBuildIndex }) => {
  const spriteNum = entry.spriteId ?? entry.nationalDex;
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteNum}.png`;
  const bestBuild = entry.builds[bestBuildIndex];   // ← was: entry.builds[0]
```

Then replace the two uses of `primaryBuild` with `bestBuild`:

```tsx
<TypeBadge type={bestBuild.teraType as PokemonType} small />
<span className="text-ui-base text-[var(--pt-text-dim)]">{bestBuild.nature} · {bestBuild.ability}</span>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx
git commit -m "feat: score all builds per tier entry in boss finder, load best build on click"
```

---

### Task 3 — D: Use boss base types in scoring

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx` — `bossRecommendations` useMemo deps and body

- [ ] **Step 1: Add bossPokemon to useMemo dependencies**

The current dep array is `[bossTeraType, bossStars]`. Change it to:

```ts
}, [bossTeraType, bossStars, bossPokemon]);
```

- [ ] **Step 2: Compute boss base type weaknesses at the top of the memo**

After the `bossWeaknesses` Set is built (from Tera type), add:

```ts
// Boss base type weaknesses (bonus coverage — boss uses base-type STAB offensively)
const bossBaseWeaknesses = new Set<string>();
if (bossPokemon) {
  bossPokemon.types.forEach((baseType) => {
    const baseTypeData = allTypesData.find(
      (td) => td.name.toLowerCase() === baseType.toLowerCase()
    );
    (baseTypeData?.weaknesses ?? []).forEach((w) => bossBaseWeaknesses.add(w.toLowerCase()));
  });
}
```

- [ ] **Step 3: Apply base-type bonus in the score block**

Inside the `forEach` over `entry.builds`, after counting Tera-type SE moves, add a base-type check:

```ts
// Small bonus for moves that also hit boss base types SE
let baseTypeBonus = 0;
if (bossBaseWeaknesses.size > 0) {
  for (const moveName of build.moves) {
    const moveData = allMoves.find(
      (m) => m.name.toLowerCase() === moveName.toLowerCase()
    );
    if (moveData && bossBaseWeaknesses.has(moveData.type.toLowerCase())) {
      baseTypeBonus += 0.5;
    }
  }
}
// Store for potential tiebreaking (not exposed in result type — internal only)
const totalForBuild = seMoves.length + baseTypeBonus;
if (totalForBuild > bestSeCount) {
  bestSeCount = totalForBuild;
  bestBuildIndex = idx;
  seMovesForBoss = seMoves;
}
```

Replace the previous `if (seMoves.length > bestSeCount)` check with this combined check.

Full updated `forEach` body:

```ts
entry.builds.forEach((build, idx) => {
  const seMoves: string[] = [];
  for (const moveName of build.moves) {
    const moveData = allMoves.find(
      (m) => m.name.toLowerCase() === moveName.toLowerCase()
    );
    if (moveData && bossWeaknesses.has(moveData.type.toLowerCase())) {
      seMoves.push(moveName);
    }
  }

  let baseTypeBonus = 0;
  if (bossBaseWeaknesses.size > 0) {
    for (const moveName of build.moves) {
      const moveData = allMoves.find(
        (m) => m.name.toLowerCase() === moveName.toLowerCase()
      );
      if (moveData && bossBaseWeaknesses.has(moveData.type.toLowerCase())) {
        baseTypeBonus += 0.5;
      }
    }
  }

  const totalForBuild = seMoves.length + baseTypeBonus;
  if (totalForBuild > bestSeCount) {
    bestSeCount = totalForBuild;
    bestBuildIndex = idx;
    seMovesForBoss = seMoves;
  }
});
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx
git commit -m "feat: use boss base types as tiebreaker in boss finder scoring"
```

---

### Task 4 — C: Boss quick-select chip row

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx` — boss finder panel JSX (~line 482)

- [ ] **Step 1: Add a handler for selecting a known boss chip**

Add this `useCallback` near the other handlers (around line 421):

```ts
const selectKnownBoss = useCallback((boss: typeof RAID_BOSSES[number]) => {
  const pokemon = allPokemon.find((p) => p.nationalDex === boss.nationalDex) ?? null;
  setBossPokemon(pokemon);
  setBossTeraType(boss.teraType);
  setBossStars(boss.stars);
}, []);
```

- [ ] **Step 2: Add the chip row JSX inside the boss finder panel**

Inside `{bossFinderOpen && (...)}`, after the closing `</div>` of the three-column grid (after the star level block, before the closing `</div>` of the panel body), add:

```tsx
{/* Known boss quick-select chips */}
<div className="mt-3 border-t border-[var(--pt-border-dim)] pt-3">
  <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">
    {locale === "pt" ? "Bosses conhecidos" : "Known bosses"}
  </div>

  {/* 7★ chips */}
  <div className="mb-2">
    <span className="mr-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs text-yellow-400">7★</span>
    <div className="inline-flex flex-wrap gap-1">
      {RAID_BOSSES.filter((b) => b.stars === 7).map((boss) => {
        const isActive = bossPokemon?.nationalDex === boss.nationalDex && bossTeraType === boss.teraType;
        return (
          <button
            key={`${boss.name}-${boss.teraType}`}
            onClick={() => selectKnownBoss(boss)}
            className="flex items-center gap-1 rounded-none border px-2 py-0.5 text-ui-xs font-semibold transition-all"
            style={{
              borderColor: isActive ? TYPE_COLORS[boss.teraType] : "rgba(255,255,255,0.1)",
              background: isActive ? TYPE_COLORS[boss.teraType] + "22" : "rgba(255,255,255,0.04)",
              color: isActive ? TYPE_COLORS[boss.teraType] : "var(--pt-text-dim)",
            }}
          >
            {boss.name}
            <span
              className="rounded px-1 text-ui-xs font-bold text-white"
              style={{ background: TYPE_COLORS[boss.teraType] + "BB" }}
            >
              {boss.teraType}
            </span>
          </button>
        );
      })}
    </div>
  </div>

  {/* 6★ chips */}
  <div>
    <span className="mr-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-xs text-[var(--pt-text-dim)]">6★</span>
    <div className="inline-flex flex-wrap gap-1">
      {RAID_BOSSES.filter((b) => b.stars === 6).map((boss) => {
        const isActive = bossPokemon?.nationalDex === boss.nationalDex && bossTeraType === boss.teraType;
        return (
          <button
            key={`${boss.name}-${boss.teraType}`}
            onClick={() => selectKnownBoss(boss)}
            className="flex items-center gap-1 rounded-none border px-2 py-0.5 text-ui-xs font-semibold transition-all"
            style={{
              borderColor: isActive ? TYPE_COLORS[boss.teraType] : "rgba(255,255,255,0.1)",
              background: isActive ? TYPE_COLORS[boss.teraType] + "22" : "rgba(255,255,255,0.04)",
              color: isActive ? TYPE_COLORS[boss.teraType] : "var(--pt-text-dim)",
            }}
          >
            {boss.name}
            <span
              className="rounded px-1 text-ui-xs font-bold text-white"
              style={{ background: TYPE_COLORS[boss.teraType] + "BB" }}
            >
              {boss.teraType}
            </span>
          </button>
        );
      })}
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx
git commit -m "feat: add known boss quick-select chips to boss finder panel"
```

---

### Task 5 — Boss profile display when chip selected

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx` — boss finder panel header button

- [ ] **Step 1: Enrich the collapsed header summary**

The collapsed header currently shows (line ~470):

```tsx
{bossPokemon ? `${bossPokemon.name} · ` : ""}{bossTeraType} Tera
{bossStars ? ` · ${bossStars}★` : ""}
{" "}· {bossRecommendations.length} builds
```

Replace with a richer inline display that also shows the boss's base types when `bossPokemon` is set:

```tsx
<div className="flex flex-wrap items-center gap-1.5">
  {bossPokemon && (
    <>
      <span className="text-xs font-bold text-[var(--pt-text)]">{bossPokemon.name}</span>
      {bossPokemon.types.map((tp) => (
        <TypeBadge key={tp} type={tp as PokemonType} small />
      ))}
      <span className="text-xs text-[var(--pt-text-dim)]">→</span>
    </>
  )}
  {bossTeraType && <TypeBadge type={bossTeraType} small />}
  {bossTeraType && <span className="text-xs text-[var(--pt-text-dim)]">Tera</span>}
  {bossStars && <span className="text-xs font-bold text-yellow-400">{bossStars}★</span>}
  <span className="text-xs text-[var(--pt-text-dim)]">· {bossRecommendations.length} builds</span>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/raid/RaidBuildMaker.tsx
git commit -m "feat: show boss base types in boss finder collapsed header"
```

---

## Self-Review

**Spec coverage:**
- B (all builds scored): Task 2 ✓
- C (quick chips): Task 4 ✓
- D (base types in scoring): Task 3 ✓
- D (base types in UI): Task 5 ✓

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `bestBuildIndex: number` defined in Task 1 return type, used in Tasks 2 and render
- `boss: typeof RAID_BOSSES[number]` correctly typed from the imported array
- `bossBaseWeaknesses: Set<string>` is local to the memo, not exposed
- `selectKnownBoss` takes `typeof RAID_BOSSES[number]` — consistent with `RAID_BOSSES.filter().map()` usage in Task 4
