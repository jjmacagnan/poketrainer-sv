# PokéTrainer SV &nbsp;·&nbsp; [🇧🇷 Português](README.md)

Practical tools for **Pokémon Scarlet & Violet** players. Look up sandwich recipes, track EV training, build Tera Raid sets, and more — right from your phone while you play.

**Stack:** Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / React 19  
**Deploy:** Vercel  
**Theme:** Dark mode only  
**i18n:** Portuguese (PT-BR) and English (EN)  
**PWA:** Installable as a mobile app  

---

## Features

### 🥪 Sandwich Builder
Sandwich recipe tool with curated recipes for Shiny Hunting, Encounter Power, Raid Power, and Breeding.
- Community-verified recipes (1 ingredient + 2× Herba Mystica = Lv. 3)
- 5 tabs: Shiny Hunt, Encounter, Raid Power, Breeding, Reverse Search
- Filter by Pokémon type with colored badges
- How to farm each type of Herba Mystica from raids
- Reverse search: pick the Meal Power you want and find the recipe
- Ingredient flavor data and berry equivalents

### 📖 EV Yield Pokédex
Searchable list of 685 Pokémon (Paldea + Kitakami + Blueberry) with the EVs each one yields on defeat.
- Search by name, filter by stat, type, and EV yield amount
- "Best Spot" indicator per stat
- Legendary (★) and Mythical (✦) badges
- Toggle between card view (with sprite) and compact table
- Detail modal with:
  - Full data: base stats, weight, height, catch rate, egg groups
  - In-game flavor text (prioritizes Scarlet/Violet)
  - Evolution chain with sprites
  - Scarlet/Violet movepool (level-up, TM, egg, tutor)
  - Alternate forms with sprites
  - Encounter locations (Scarlet / Violet)

### 📊 EV Training Tracker
EV training progress tracker for your full team.
- 6 Pokémon slots
- Visual bar per stat with 252/stat and 510 total limits
- Increment buttons: manual, vitamin (+10), reset
- Modifiers: Pokérus (2×), Power Item (+8), Macho Brace (2×)
- Pre-defined templates (Physical Sweeper, Special Attacker, Bulk, etc.)
- Suggested farming locations per stat
- Persisted in localStorage

### ⚔️ Tera Raid Build Maker
Build and share optimized sets for 5★/6★/7★ Tera Raids.
- Pokémon selector with official artwork, Legendary/Mythical badges, and flavor text
- Nature, Ability, Held Item, and 4 Moves selectors
- EV/IV distribution with real-time stat calculation (Gen 9 formula)
- Move effect badges (Drain, Recoil, Multi-hit, Priority, Flinch, etc.)
- Defensive type matchups (with Tera Type)
- Ability and item effects shown on the build card
- Import/export in Pokémon Showdown format
- Export as PNG image (optimized for Discord)
- Pokémon raid guide with tags (Solo Viable, Top Pick, 7★ Ready, Budget Pick, etc.)

### 🧮 Nature Calculator
Quick nature and final stat calculator.
- Visual table of all 25 natures with +10%/−10% highlights
- Calculator: Base Stat + IV + EV + Nature + Level = final stat
- Side-by-side comparison of two natures on the same Pokémon
- Mint suggestion by role
- Berry preferences by nature

### 🤝 Community
Dedicated page for the JJ Bit community.
- Link to the YouTube channel
- Link to the Discord server
- Featured video section

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/jjmacagnan/poketrainer-sv.git
cd poketrainer-sv
npm install
```

### PokéAPI Data

Static data (Pokémon, natures, moves, abilities, items, berries, etc.) is pre-generated from PokéAPI. Run after cloning or when updating data:

```bash
npm run fetch-all           # Fetch all data sequentially
npm run fetch-pokemon       # Pokémon only (685 entries with species data)
npm run fetch-natures       # Natures only
npm run fetch-moves         # Moves only
npm run fetch-abilities     # Abilities only
npm run fetch-items         # Items only
npm run fetch-types         # Types only
npm run fetch-berries       # Berries only
npm run fetch-berry-flavors # Berry Flavors
npm run fetch-evolution-chains  # Evolution Chains
npm run fetch-move-meta     # Move Meta data
npm run fetch-version-groups    # Version Groups
```

Generated files are placed in `src/data/generated/`.

### Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
├── app/                              # Routes (App Router)
│   ├── page.tsx                      # Landing page (tool grid)
│   ├── layout.tsx                    # Root layout (Navbar + Footer + PWA)
│   ├── globals.css                   # Global styles
│   ├── manifest.ts                   # PWA manifest
│   ├── sandwich-builder/             # Sandwich Builder
│   ├── ev-pokedex/                   # EV Yield Pokédex
│   ├── ev-tracker/                   # EV Training Tracker
│   ├── raid-builder/                 # Tera Raid Build Maker
│   ├── nature-calc/                  # Nature/Stats Calculator
│   ├── comunidade/                   # Community page (YouTube + Discord)
│   ├── termos/                       # Terms of Use
│   ├── privacidade/                  # Privacy Policy
│   └── aviso-legal/                  # Legal Notice
├── components/
│   ├── ui/                           # TypeBadge, StatBar, Navbar, Footer, PowerTag
│   ├── sandwich/                     # RecipeCard, RecipeDetail, SandwichBuilder
│   ├── ev/                           # EVPokedex, EVTracker, PokemonSlot, PokemonDetailModal
│   ├── raid/                         # RaidBuildMaker, BuildCard, BuildExport
│   ├── nature/                       # NatureCalc
│   ├── shared/                       # PageHeader, SearchInput, FilterBar, ToolDisclaimer
│   ├── Providers.tsx                 # I18nProvider wrapper
│   └── ServiceWorkerRegistration.tsx # PWA service worker
├── data/
│   ├── generated/                    # PokéAPI data (11 JSON files)
│   │   ├── pokemon.json              # 685 Pokémon with base stats, EV yields, species data
│   │   │                             # (isLegendary, isMythical, flavorText, formVariants,
│   │   │                             #  evolutionChainId, eggGroups, captureRate, etc.)
│   │   ├── natures.json, moves.json, move-meta.json
│   │   ├── abilities.json, items.json, berries.json
│   │   ├── berry-flavors.json, evolution-chains.json
│   │   ├── types.json, version-groups.json
│   ├── types.ts                      # 18 types + colors (TYPE_COLORS)
│   ├── sandwich-recipes.ts           # Sandwich recipes (Shiny + Encounter)
│   ├── sandwich-guide.ts             # Sandwich guide
│   ├── items.ts                      # Held items
│   ├── raid-bosses.ts                # 5★/6★/7★ raid bosses
│   ├── raid-tier-list.ts             # SS/S/A/B/C raid tier list
│   ├── training-locations.ts         # EV training locations
│   └── pokemon-utils.ts              # Pokémon utilities
├── lib/
│   ├── constants.ts                  # MAX_EV, STAT_NAMES, etc.
│   ├── ev-calculator.ts              # EV calculation with modifiers
│   ├── stat-calculator.ts            # Gen 9 final stat formula
│   ├── showdown-parser.ts            # Pokémon Showdown import/export
│   ├── berry-utils.ts                # Berry utilities
│   ├── ingredient-flavors.ts         # Ingredient flavors
│   └── farming-logic.ts              # Farming logic
├── hooks/
│   ├── useLocalStorage.ts            # localStorage-persisted state
│   └── usePokemonSearch.ts           # Fuzzy Pokémon name search
└── i18n/
    ├── index.tsx                     # I18nProvider + useI18n (custom implementation)
    ├── pt.json                       # PT-BR translations
    └── en.json                       # EN translations
```

---

## Data Sources

- **PokéAPI** — base stats, types, EV yields, moves, abilities, berries, evolution chains, species data
- **Serebii.net** — in-game locations, Tera Raid mechanics, sandwich recipes, raid bosses
- **Smogon / Reddit** — tier list and builds based on community consensus

Sprites via GitHub:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

---

## Deploy

The project is optimized for deployment on **Vercel**:

1. Import the repo on [Vercel](https://vercel.com)
2. Set your custom domain under Settings > Domains

---

## Legal

This is an unofficial fan project not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company. Pokémon and all related names are trademarks of their respective owners.

- [Terms of Use](https://poketrainer.jbit.app.br/termos)
- [Privacy Policy](https://poketrainer.jbit.app.br/privacidade)
- [Legal Notice](https://poketrainer.jbit.app.br/aviso-legal)

---

## License

[MIT](LICENSE)
