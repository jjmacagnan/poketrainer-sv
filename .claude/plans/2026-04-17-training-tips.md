# Training Tips Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/training-tips` reference page with Power Items cards, a battle calculator, a berries reset table, and a Tera Type location guide — all in PT/EN.

**Architecture:** Single scrollable page with sticky anchor nav (IntersectionObserver). Static data lives in `src/data/training-tips.ts`. Calculator logic is a pure function co-located in the component. All text goes through `useI18n()`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, `useI18n` hook (src/i18n), existing `PageHeader` and `StatName` types from `@/lib/constants`.

> **Note:** No test framework is set up in this project. Steps that would normally contain test code instead contain browser verification instructions.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/training-tips.ts` | Create | Static data: power items, berries |
| `src/i18n/pt.json` | Modify | Add `trainingTips.*` and `nav.trainingTips` keys |
| `src/i18n/en.json` | Modify | Add `trainingTips.*` and `nav.trainingTips` keys |
| `src/app/training-tips/page.tsx` | Create | Page wrapper |
| `src/components/training/TrainingTips.tsx` | Create | Full page component (nav, sections, calculator) |
| `src/app/page.tsx` | Modify | Add Training Tips card to TOOLS array |
| `src/components/ui/Navbar.tsx` | Modify | Add `trainingTips` to NAV_ITEMS |

---

## Task 1: Static Data Layer

**Files:**
- Create: `src/data/training-tips.ts`

- [ ] **Step 1: Create the data file**

```ts
import type { StatName } from "@/lib/constants";

export interface PowerItem {
  name: string;
  stat: StatName;
  bonus: 8;
  where: string;
}

export interface EVBerry {
  name: string;
  stat: StatName;
  reduction: 10;
}

export const POWER_ITEMS_DATA: PowerItem[] = [
  { name: "Power Weight", stat: "HP",  bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Bracer", stat: "Atk", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Belt",   stat: "Def", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Lens",   stat: "SpA", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Band",   stat: "SpD", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
  { name: "Power Anklet", stat: "Spe", bonus: 8, where: "Delibird Presents — Mesagoza / Cascarrafa" },
];

export const EV_BERRIES_DATA: EVBerry[] = [
  { name: "Pomeg Berry",  stat: "HP",  reduction: 10 },
  { name: "Kelpsy Berry", stat: "Atk", reduction: 10 },
  { name: "Qualot Berry", stat: "Def", reduction: 10 },
  { name: "Hondew Berry", stat: "SpA", reduction: 10 },
  { name: "Grepa Berry",  stat: "SpD", reduction: 10 },
  { name: "Tamato Berry", stat: "Spe", reduction: 10 },
];

export function calcBattles(
  baseYield: number,
  powerItem: boolean,
  pokerus: boolean,
  machoBrace: boolean
): { evsPerBattle: number; battles252: number; battles152: number } {
  const powerBonus = powerItem ? 8 : 0;
  const machoMultiplier = machoBrace && !powerItem ? 2 : 1;
  const pokerusMultiplier = pokerus ? 2 : 1;
  const totalMultiplier = machoMultiplier * pokerusMultiplier;
  const evsPerBattle = (baseYield + powerBonus) * totalMultiplier;
  return {
    evsPerBattle,
    battles252: Math.ceil(252 / evsPerBattle),
    battles152: Math.ceil(152 / evsPerBattle),
  };
}
```

- [ ] **Step 2: Verify the calc function mentally**

Spot-check: `calcBattles(1, true, false, false)` → evsPerBattle=9, battles252=28, battles152=17. ✓  
Spot-check: `calcBattles(2, true, true, false)` → evsPerBattle=20, battles252=13, battles152=8. ✓

- [ ] **Step 3: Commit**

```bash
git add src/data/training-tips.ts
git commit -m "feat: add training tips static data and battle calc logic"
```

---

## Task 2: i18n Keys

**Files:**
- Modify: `src/i18n/pt.json`
- Modify: `src/i18n/en.json`

- [ ] **Step 1: Add keys to `src/i18n/pt.json`**

Add `"trainingTips"` section (before the closing `}` of the JSON) and update the `"nav"` and `"home"` sections:

In `"nav"` object, add:
```json
"trainingTips": "Dicas de Treino"
```

In `"home"` object, add:
```json
"trainingTipsDesc": "Guia de Power Items, frutas para resetar EVs e como trocar Tera Type"
```

Add new top-level section:
```json
"trainingTips": {
  "title": "Dicas de Treino",
  "subtitle": "Guia rápido de treino para Pokémon SV",
  "navPowerItems": "⚡ Power Items",
  "navBerries": "🍓 Frutas",
  "navTeraType": "🔮 Tera Type",
  "powerItemsTitle": "Power Items — Maximize seus EVs",
  "powerItemsDesc": "Cada Power Item adiciona +8 EVs fixos no stat correspondente por batalha, além dos EVs normais do Pokémon derrotado.",
  "powerItemsWhere": "Onde comprar",
  "calcTitle": "Calculadora de Batalhas",
  "calcYield": "EV yield base do Pokémon",
  "calcPowerItem": "Power Item equipado?",
  "calcPokerus": "Pokérus ativo?",
  "calcMacho": "Macho Brace?",
  "calcEvsPerBattle": "EVs por batalha",
  "calcBattles252": "Batalhas para 252",
  "calcBattlesVitamins": "Batalhas (após 10 vitaminas)",
  "berriesTitle": "Frutas para Resetar EVs",
  "berriesDesc": "Cada fruta reduz 10 EVs do stat correspondente e aumenta amizade. Use várias vezes até zerar.",
  "berriesWhere": "Onde encontrar: brilhando no chão, leilões de Porto Marinada, drops aleatórios.",
  "berriesStat": "Stat",
  "berriesEffect": "Efeito",
  "teraTypeTitle": "Onde Trocar o Tera Type",
  "teraTypeLocation": "Restaurante Treasure Eatery — Medali",
  "teraTypeStep1": "Vá para a cidade de Medali",
  "teraTypeStep2": "Entre no restaurante Treasure Eatery",
  "teraTypeStep3": "Fale com o chef lá dentro",
  "teraTypeReq": "Pré-requisitos",
  "teraTypeReqDefeated": "Derrote o líder de ginásio Larry (ginásio de Medali)",
  "teraTypeReqShards": "50 Tera Shards do tipo desejado",
  "teraTypeTip": "Dica: Tera Shards são obtidos principalmente em Tera Raids — pode demorar juntar 50 de um tipo específico."
}
```

- [ ] **Step 2: Add keys to `src/i18n/en.json`**

In `"nav"` object, add:
```json
"trainingTips": "Training Tips"
```

In `"home"` object, add:
```json
"trainingTipsDesc": "Guide to Power Items, EV-resetting berries, and how to change Tera Type"
```

Add new top-level section:
```json
"trainingTips": {
  "title": "Training Tips",
  "subtitle": "Quick training guide for Pokémon SV",
  "navPowerItems": "⚡ Power Items",
  "navBerries": "🍓 Berries",
  "navTeraType": "🔮 Tera Type",
  "powerItemsTitle": "Power Items — Maximize your EVs",
  "powerItemsDesc": "Each Power Item adds +8 fixed EVs to the matching stat per battle, on top of the defeated Pokémon's normal EV yield.",
  "powerItemsWhere": "Where to buy",
  "calcTitle": "Battle Calculator",
  "calcYield": "Pokémon base EV yield",
  "calcPowerItem": "Power Item equipped?",
  "calcPokerus": "Pokérus active?",
  "calcMacho": "Macho Brace?",
  "calcEvsPerBattle": "EVs per battle",
  "calcBattles252": "Battles to reach 252",
  "calcBattlesVitamins": "Battles (after 10 vitamins)",
  "berriesTitle": "Berries to Reset EVs",
  "berriesDesc": "Each berry reduces 10 EVs from the matching stat and raises friendship. Use multiple times to fully reset.",
  "berriesWhere": "Where to find: shining on ground, Porto Marinada auctions, random drops.",
  "berriesStat": "Stat",
  "berriesEffect": "Effect",
  "teraTypeTitle": "Where to Change Tera Type",
  "teraTypeLocation": "Treasure Eatery Restaurant — Medali",
  "teraTypeStep1": "Go to the city of Medali",
  "teraTypeStep2": "Enter the Treasure Eatery restaurant",
  "teraTypeStep3": "Talk to the chef inside",
  "teraTypeReq": "Requirements",
  "teraTypeReqDefeated": "Defeat gym leader Larry (Medali gym)",
  "teraTypeReqShards": "50 Tera Shards of the desired type",
  "teraTypeTip": "Tip: Tera Shards drop mainly from Tera Raids — collecting 50 of a specific type takes time."
}
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/pt.json src/i18n/en.json
git commit -m "feat: add trainingTips i18n keys in PT and EN"
```

---

## Task 3: Routing, Home Card, and Navbar

**Files:**
- Create: `src/app/training-tips/page.tsx`
- Modify: `src/app/page.tsx` (add card to TOOLS)
- Modify: `src/components/ui/Navbar.tsx` (add nav item)

- [ ] **Step 1: Create the page wrapper**

Create `src/app/training-tips/page.tsx`:
```tsx
"use client";

import { TrainingTips } from "@/components/training/TrainingTips";

export default function TrainingTipsPage() {
  return <TrainingTips />;
}
```

- [ ] **Step 2: Add card to home page**

In `src/app/page.tsx`, add to the `TOOLS` array (after the `natureCalc` entry):
```tsx
{
  href: "/training-tips",
  emoji: "💡",
  title: "Training Tips",
  descKey: "home.trainingTipsDesc",
  color: "#34D399",
  colorEnd: "#06B6D4",
},
```

- [ ] **Step 3: Add to Navbar**

In `src/components/ui/Navbar.tsx`, add to the `NAV_ITEMS` array (after `natureCalc`):
```tsx
{ href: "/training-tips", key: "trainingTips" },
```

- [ ] **Step 4: Commit**

```bash
git add src/app/training-tips/page.tsx src/app/page.tsx src/components/ui/Navbar.tsx
git commit -m "feat: add training-tips route, home card, and navbar link"
```

---

## Task 4: TrainingTips Component Shell + Sticky Anchor Nav

**Files:**
- Create: `src/components/training/TrainingTips.tsx`

- [ ] **Step 1: Create the component with shell and sticky nav**

Create `src/components/training/TrainingTips.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n";
import { PageHeader } from "@/components/shared/PageHeader";
import { STAT_LABELS } from "@/lib/constants";
import type { StatName } from "@/lib/constants";
import { POWER_ITEMS_DATA, EV_BERRIES_DATA, calcBattles } from "@/data/training-tips";

const STAT_COLORS: Record<StatName, string> = {
  HP: "#FF5959",
  Atk: "#F5AC78",
  Def: "#FAE078",
  SpA: "#9DB7F5",
  SpD: "#A7DB8D",
  Spe: "#FA92B2",
};

const SECTIONS = [
  { id: "power-items", labelKey: "trainingTips.navPowerItems", color: "#34D399" },
  { id: "berries",      labelKey: "trainingTips.navBerries",     color: "#F87171" },
  { id: "tera-type",   labelKey: "trainingTips.navTeraType",    color: "#FFD700" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function TrainingTips() {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState<SectionId>("power-items");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id as SectionId); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        emoji="💡"
        title={t("trainingTips.title")}
        subtitle={t("trainingTips.subtitle")}
        gradient="linear-gradient(135deg, #34D399, #06B6D4)"
      />

      {/* Sticky anchor nav */}
      <div className="sticky top-[57px] z-40 mb-8 flex gap-2 rounded-xl border border-white/[0.08] bg-gray-950/90 p-2 backdrop-blur-md">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive ? `${s.color}22` : "transparent",
                color: isActive ? s.color : "#9CA3AF",
                border: isActive ? `1px solid ${s.color}44` : "1px solid transparent",
              }}
            >
              {t(s.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-14">
        {/* Sections rendered in Task 5, 6, 7 */}
        <section
          id="power-items"
          ref={(el) => { sectionRefs.current["power-items"] = el; }}
        >
          <p className="text-gray-400 text-sm">{t("trainingTips.powerItemsTitle")}</p>
        </section>

        <section
          id="berries"
          ref={(el) => { sectionRefs.current["berries"] = el; }}
        >
          <p className="text-gray-400 text-sm">{t("trainingTips.berriesTitle")}</p>
        </section>

        <section
          id="tera-type"
          ref={(el) => { sectionRefs.current["tera-type"] = el; }}
        >
          <p className="text-gray-400 text-sm">{t("trainingTips.teraTypeTitle")}</p>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`, open `http://localhost:3000/training-tips`. You should see:
- PageHeader with "💡 Dicas de Treino"
- 3 sticky nav pills (Power Items, Frutas, Tera Type)
- 3 placeholder sections

- [ ] **Step 3: Commit**

```bash
git add src/components/training/TrainingTips.tsx
git commit -m "feat: add TrainingTips component shell with sticky anchor nav"
```

---

## Task 5: Power Items Section

**Files:**
- Modify: `src/components/training/TrainingTips.tsx`

- [ ] **Step 1: Replace the power-items section placeholder with full content**

Replace the `<section id="power-items" ...>` block with:

```tsx
<section
  id="power-items"
  ref={(el) => { sectionRefs.current["power-items"] = el; }}
>
  <h2 className="mb-1 text-xl font-bold text-white">{t("trainingTips.powerItemsTitle")}</h2>
  <p className="mb-6 text-sm text-gray-400">{t("trainingTips.powerItemsDesc")}</p>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
    {POWER_ITEMS_DATA.map((item) => (
      <div
        key={item.name}
        className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <span
            className="rounded-lg px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: STAT_COLORS[item.stat] + "33", color: STAT_COLORS[item.stat] }}
          >
            {STAT_LABELS[item.stat]}
          </span>
          <span
            className="ml-auto text-xs font-bold"
            style={{ color: STAT_COLORS[item.stat] }}
          >
            +8 EVs
          </span>
        </div>
        <p className="font-semibold text-white text-sm mb-1">{item.name}</p>
        <p className="text-xs text-gray-500">
          {t("trainingTips.powerItemsWhere")}: {item.where}
        </p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Verify in browser**

Check `http://localhost:3000/training-tips`. The Power Items section should show 6 cards, each with a colored stat badge, item name, +8 EVs label, and purchase location.

- [ ] **Step 3: Commit**

```bash
git add src/components/training/TrainingTips.tsx
git commit -m "feat: add Power Items cards to TrainingTips"
```

---

## Task 6: Battle Calculator

**Files:**
- Modify: `src/components/training/TrainingTips.tsx`

- [ ] **Step 1: Add calculator state at the top of the component**

Inside `TrainingTips()`, add these state declarations after the existing `useEffect`:

```tsx
const [calcYield, setCalcYield] = useState(1);
const [calcPowerItem, setCalcPowerItem] = useState(false);
const [calcPokerus, setCalcPokerus] = useState(false);
const [calcMacho, setCalcMacho] = useState(false);

const calcResult = calcBattles(calcYield, calcPowerItem, calcPokerus, calcMacho);
```

- [ ] **Step 2: Add the calculator card below the Power Items grid**

Inside the `<section id="power-items">`, after the `</div>` that closes the items grid, add:

```tsx
{/* Battle Calculator */}
<div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
  <h3 className="mb-4 font-bold text-white">{t("trainingTips.calcTitle")}</h3>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* Base EV yield */}
    <div>
      <label className="mb-1 block text-xs text-gray-400">{t("trainingTips.calcYield")}</label>
      <select
        value={calcYield}
        onChange={(e) => setCalcYield(Number(e.target.value))}
        className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none"
      >
        <option value={1}>1 EV</option>
        <option value={2}>2 EVs</option>
        <option value={3}>3 EVs</option>
      </select>
    </div>

    {/* Toggles */}
    <div className="flex flex-col gap-2">
      {[
        { key: "calcPowerItem", value: calcPowerItem, set: setCalcPowerItem, label: t("trainingTips.calcPowerItem") },
        { key: "calcPokerus",   value: calcPokerus,   set: setCalcPokerus,   label: t("trainingTips.calcPokerus") },
        ...(!calcPowerItem
          ? [{ key: "calcMacho", value: calcMacho, set: setCalcMacho, label: t("trainingTips.calcMacho") }]
          : []),
      ].map(({ key, value, set, label }) => (
        <button
          key={key}
          onClick={() => set(!value)}
          className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors"
          style={{
            borderColor: value ? "#34D399" : "rgba(255,255,255,0.08)",
            background: value ? "#34D39911" : "transparent",
            color: value ? "#34D399" : "#9CA3AF",
          }}
        >
          {label}
          <span className="font-bold">{value ? "ON" : "OFF"}</span>
        </button>
      ))}
    </div>
  </div>

  {/* Results */}
  <div className="mt-5 grid grid-cols-3 gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
    {[
      { label: t("trainingTips.calcEvsPerBattle"), value: calcResult.evsPerBattle },
      { label: t("trainingTips.calcBattles252"),   value: `~${calcResult.battles252}` },
      { label: t("trainingTips.calcBattlesVitamins"), value: `~${calcResult.battles152}` },
    ].map(({ label, value }) => (
      <div key={label} className="text-center">
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="mt-1 text-[11px] text-gray-500 leading-tight">{label}</div>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Check `http://localhost:3000/training-tips`. The calculator should:
- Show 3 outputs (EVs/batalha, batalhas 252, batalhas 152) updating in real time
- When Power Item = ON → Macho Brace toggle disappears
- Default (1 EV yield, no items): 1 EV/battle, 252 battles, 152 battles
- With Power Item ON (1 EV yield): 9 EVs/battle, ~28 battles, ~17 battles

- [ ] **Step 4: Commit**

```bash
git add src/components/training/TrainingTips.tsx
git commit -m "feat: add battle calculator to TrainingTips"
```

---

## Task 7: Berries Section

**Files:**
- Modify: `src/components/training/TrainingTips.tsx`

- [ ] **Step 1: Replace the berries section placeholder**

Replace the `<section id="berries" ...>` block with:

```tsx
<section
  id="berries"
  ref={(el) => { sectionRefs.current["berries"] = el; }}
>
  <h2 className="mb-1 text-xl font-bold text-white">{t("trainingTips.berriesTitle")}</h2>
  <p className="mb-4 text-sm text-gray-400">{t("trainingTips.berriesDesc")}</p>

  <div className="overflow-hidden rounded-xl border border-white/[0.08]">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/[0.08] bg-white/[0.03]">
          <th className="px-4 py-3 text-left font-semibold text-gray-400">Berry</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-400">{t("trainingTips.berriesStat")}</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-400">{t("trainingTips.berriesEffect")}</th>
        </tr>
      </thead>
      <tbody>
        {EV_BERRIES_DATA.map((berry, i) => (
          <tr
            key={berry.name}
            className={i % 2 === 0 ? "bg-white/[0.01]" : ""}
          >
            <td className="px-4 py-3 font-medium text-white">{berry.name}</td>
            <td className="px-4 py-3">
              <span
                className="rounded px-2 py-0.5 text-xs font-bold"
                style={{
                  background: STAT_COLORS[berry.stat] + "33",
                  color: STAT_COLORS[berry.stat],
                }}
              >
                {STAT_LABELS[berry.stat]}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-400">−10 EVs</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <p className="mt-3 text-xs text-gray-500">{t("trainingTips.berriesWhere")}</p>
</section>
```

- [ ] **Step 2: Verify in browser**

The Berries section should show a table with 6 rows (Pomeg → Tamato), each with berry name, colored stat badge, and "−10 EVs". Alternating row background.

- [ ] **Step 3: Commit**

```bash
git add src/components/training/TrainingTips.tsx
git commit -m "feat: add Berries reset table to TrainingTips"
```

---

## Task 8: Tera Type Section

**Files:**
- Modify: `src/components/training/TrainingTips.tsx`

- [ ] **Step 1: Replace the tera-type section placeholder**

Replace the `<section id="tera-type" ...>` block with:

```tsx
<section
  id="tera-type"
  ref={(el) => { sectionRefs.current["tera-type"] = el; }}
>
  <h2 className="mb-1 text-xl font-bold text-white">{t("trainingTips.teraTypeTitle")}</h2>
  <p className="mb-4 text-sm text-gray-400">{t("trainingTips.teraTypeLocation")}</p>

  <div className="rounded-xl border bg-white/[0.03] p-5" style={{ borderColor: "#FFD70033" }}>
    {/* Steps */}
    <div className="mb-5 flex flex-col gap-3">
      {[
        t("trainingTips.teraTypeStep1"),
        t("trainingTips.teraTypeStep2"),
        t("trainingTips.teraTypeStep3"),
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
            style={{ background: "#FFD70033", color: "#FFD700" }}
          >
            {i + 1}
          </span>
          <span className="text-sm text-gray-300">{step}</span>
        </div>
      ))}
    </div>

    {/* Requirements */}
    <div className="mb-4 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        {t("trainingTips.teraTypeReq")}
      </p>
      <ul className="flex flex-col gap-1">
        {[
          t("trainingTips.teraTypeReqDefeated"),
          t("trainingTips.teraTypeReqShards"),
        ].map((req) => (
          <li key={req} className="flex items-start gap-2 text-sm text-gray-300">
            <span style={{ color: "#FFD700" }}>✓</span>
            {req}
          </li>
        ))}
      </ul>
    </div>

    {/* Tip */}
    <p className="text-xs text-gray-500 italic">{t("trainingTips.teraTypeTip")}</p>
  </div>
</section>
```

- [ ] **Step 2: Verify in browser**

The Tera Type section should show a gold-accented card with:
- 3 numbered steps (Medali → Treasure Eatery → Chef)
- Requirements box (Larry defeated + 50 shards)
- Italic tip about Tera Raids

- [ ] **Step 3: Full page smoke test**

Open `http://localhost:3000/training-tips` and verify:
- [ ] Sticky nav highlights correct section as you scroll
- [ ] Clicking nav pills scrolls smoothly to section
- [ ] Calculator updates in real time when toggling inputs
- [ ] Macho Brace disappears when Power Item is ON
- [ ] Language toggle (PT/EN) updates all text
- [ ] Home page shows new 💡 Training Tips card
- [ ] Navbar shows "Dicas de Treino" / "Training Tips" link

- [ ] **Step 4: Commit**

```bash
git add src/components/training/TrainingTips.tsx
git commit -m "feat: add Tera Type section — complete TrainingTips page"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Route `/training-tips` → Task 3
- ✅ Home card with gradient → Task 3
- ✅ Navbar link → Task 3
- ✅ Sticky anchor nav with IntersectionObserver → Task 4
- ✅ 6 Power Item cards with stat badges → Task 5
- ✅ Battle calculator (all inputs + formula) → Task 6
- ✅ Berries table → Task 7
- ✅ Tera Type location card with steps, requirements, tip → Task 8
- ✅ i18n PT + EN for all keys → Task 2
- ✅ `calcBattles()` pure function → Task 1
- ✅ Dark theme, existing design tokens, STAT_COLORS → Tasks 4–8

**Placeholder scan:** No TBDs, no TODOs. All code blocks are complete.

**Type consistency:**
- `calcBattles` defined in Task 1, imported in Task 4 ✓
- `POWER_ITEMS_DATA`, `EV_BERRIES_DATA` defined in Task 1, imported in Task 4 ✓
- `STAT_COLORS`, `STAT_LABELS` used consistently across Tasks 5–8 ✓
- `sectionRefs.current["power-items" | "berries" | "tera-type"]` consistent ✓
