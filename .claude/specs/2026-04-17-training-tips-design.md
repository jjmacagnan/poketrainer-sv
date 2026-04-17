# Training Tips Page — Design Spec

**Date:** 2026-04-17  
**Status:** Approved  

---

## Overview

A new independent page (`/training-tips`) serving as a broad reference guide for in-game training mechanics in Pokémon Scarlet & Violet. Covers EV training optimization, EV resetting, and Tera Type changing. Targets players consulting the guide on mobile while actively playing.

---

## Route & Files

| Path | Purpose |
|------|---------|
| `src/app/training-tips/page.tsx` | Page wrapper (`"use client"`) |
| `src/components/training/TrainingTips.tsx` | Main component |
| `src/data/training-tips.ts` | Static data (power items, berries) |

**Home card** added to `TOOLS` array in `src/app/page.tsx`:
- Emoji: 💡
- Title: "Training Tips"
- Gradient: green-to-teal (e.g. `#34D399` → `#06B6D4`)

---

## Page Structure

```
PageHeader (💡 Training Tips / "Guia rápido de treino")
↓
Sticky anchor nav — [⚡ Power Items | 🍓 Berries | 🔮 Tera Type]
↓
Section #power-items
  - 6 Power Item cards (grid 2-col on sm:)
  - Battle Calculator card
↓
Section #berries
  - Compact table: Berry name | Stat | −10 EVs
↓
Section #tera-type
  - Location card: Medali → Treasure Eatery → Chef
  - Requirements: defeat Larry + 50 Tera Shards of target type
  - How it works (3-step)
  - Tip: Shards come from Tera Raids
```

---

## Sticky Anchor Nav

- Fixed/sticky below `Navbar`, pill-style buttons
- Highlight active section using `IntersectionObserver`
- Smooth scroll to anchor on click
- Colors match section theme (green for Power Items, red for Berries, gold for Tera Type)

---

## Section: Power Items

### Data model

```ts
interface PowerItem {
  name: string;        // "Power Bracer"
  stat: StatName;      // "atk"
  bonus: number;       // always 8
  where: string;       // "Delibird Presents — Mesagoza / Cascarrafa"
}
```

### Items

| Item | Stat |
|------|------|
| Power Weight | HP |
| Power Bracer | Attack |
| Power Belt | Defense |
| Power Lens | Sp. Atk |
| Power Band | Sp. Def |
| Power Anklet | Speed |

Each card shows: item name, stat badge (colored by stat, reusing EV Tracker palette), +8 bonus, purchase location.

### Battle Calculator

Inputs:
- **Base EV yield** — dropdown: 1 / 2 / 3
- **Power Item equipped?** — toggle (+8 to matching stat)
- **Pokérus active?** — toggle (×2 multiplier)
- **Macho Brace?** — toggle (×2 general, only shown when Power Item = off; stacks with Pokérus for ×4)

Formula:
```
power_bonus        = power_item ? 8 : 0
macho_multiplier   = (macho_brace && !power_item) ? 2 : 1
pokerus_multiplier = pokerus ? 2 : 1
total_multiplier   = macho_multiplier × pokerus_multiplier  // max ×4 (both active)
evs_per_ko         = (base_yield + power_bonus) × total_multiplier
battles_252        = ceil(252 / evs_per_ko)
battles_152        = ceil(152 / evs_per_ko)  // after 10 vitamins (100 EVs covered)
```

Output shown in real-time:
- EVs per battle
- Battles to reach 252
- Battles to reach 252 (starting from 100 via vitamins)

---

## Section: Berries

Compact table. No interactivity needed.

| Berry | Stat reduced | Amount |
|-------|-------------|--------|
| Pomeg | HP | −10 EVs |
| Kelpsy | Attack | −10 EVs |
| Qualot | Defense | −10 EVs |
| Hondew | Sp. Atk | −10 EVs |
| Grepa | Sp. Def | −10 EVs |
| Tamato | Speed | −10 EVs |

Notes shown below table:
- Use multiple times to fully reset a stat to 0
- Found: shining on ground, Porto Marinada auctions, random drops
- Status screen: yellow graph turns to base when EVs are cleared

---

## Section: Tera Type

Static info card with gold accent (matching Sparkling Power style in Sandwich Builder).

**Location:** Medali → Treasure Eatery → Chef  
**Prerequisite:** Defeat gym leader Larry (Medali gym)  
**Cost:** 50 Tera Shards of the desired type  
**Process:** Hand shards → chef cooks special dish → Tera Type changes  
**Tip:** Tera Shards drop primarily from Tera Raids; collecting 50 of a specific type takes time

---

## Visual Style

Follows existing design system:

- Background: `bg-gray-950`
- Cards: `bg-white/[0.03]` + `border border-white/[0.08]`
- Stat badges: same color palette as EV Tracker
- Tera Type card: gold border/accent (`#FFD700`)
- Responsive: `grid-cols-1 sm:grid-cols-2` for Power Item cards
- No new dependencies — uses existing `TypeBadge`, `PageHeader`, `StatBar` where applicable

---

## Out of Scope

- No persistence (localStorage) — pure reference, no state to save
- No i18n in this iteration
- No Macho Brace + Power Item combination (game mechanic: they don't stack)
