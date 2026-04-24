# CLAUDE.md — PokéTrainer SV Tools

## Projeto

Site de ferramentas para jogadores de Pokémon Scarlet & Violet. Foco em funcionalidades práticas que a comunidade mais consulta durante gameplay.

**Stack:** Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / React 19
**Deploy:** Vercel
**Tema:** Dark mode only
**i18n:** Português (PT-BR) e Inglês (EN) — implementado com solução customizada em `src/i18n/`
**PWA:** Instalável como app no celular
**Repo:** github.com/jjmacagnan/poketrainer-sv

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (Navbar + Footer + PWA)
│   ├── page.tsx                      # Landing page (grid de ferramentas)
│   ├── globals.css
│   ├── manifest.ts                   # PWA manifest
│   ├── sandwich-builder/             # Módulo 1 — Sandwich Builder
│   ├── ev-pokedex/                   # Módulo 2 — EV Yield Pokédex
│   ├── ev-tracker/                   # Módulo 3 — EV Training Tracker
│   ├── raid-builder/                 # Módulo 4 — Tera Raid Build Maker
│   ├── nature-calc/                  # Módulo 5 — Nature/Stats Calculator
│   ├── comunidade/                   # Página da Comunidade (YouTube + Discord)
│   ├── termos/                       # Termos de Uso
│   ├── privacidade/                  # Política de Privacidade
│   └── aviso-legal/                  # Aviso Legal
├── components/
│   ├── ui/                           # TypeBadge, StatBar, Navbar, Footer, PowerTag
│   ├── sandwich/                     # RecipeCard, RecipeDetail, SandwichBuilder, PokemonSandwichSearch
│   ├── ev/                           # EVPokedex, EVTracker, PokemonSlot, PokemonDetailModal
│   ├── raid/                         # RaidBuildMaker, BuildCard, BuildExport
│   ├── nature/                       # NatureCalc
│   ├── shared/                       # PageHeader, SearchInput, FilterBar, ToolDisclaimer
│   ├── Providers.tsx                 # I18nProvider wrapper
│   └── ServiceWorkerRegistration.tsx # PWA service worker
├── data/
│   ├── generated/                    # Dados do PokéAPI (JSON estático gerado pelos scripts fetch-*)
│   │   ├── pokemon.json              # 685 Pokémon com base stats, EV yields, species data
│   │   │                             # (isLegendary, isMythical, flavorText, formVariants,
│   │   │                             #  evolutionChainId, eggGroups, captureRate, etc.)
│   │   ├── natures.json, moves.json, move-meta.json
│   │   ├── abilities.json, items.json, berries.json
│   │   ├── berry-flavors.json, evolution-chains.json
│   │   └── types.json, version-groups.json
│   ├── types.ts                      # 18 tipos + TYPE_COLORS map + PokemonType type
│   ├── sandwich-recipes.ts           # Receitas de sanduíche (Shiny + Encounter + Raid + Breeding)
│   ├── sandwich-guide.ts             # Guia de sanduíches
│   ├── items.ts                      # Held items relevantes
│   ├── raid-bosses.ts                # 5★/6★/7★ raid bosses com tipo Tera e stats
│   ├── raid-tier-list.ts             # Tier list SS/S/A/B/C para raids
│   ├── training-locations.ts         # Locais de EV training por stat
│   └── pokemon-utils.ts             # Utilitários de Pokémon
├── lib/
│   ├── constants.ts                  # MAX_EV_PER_STAT=252, MAX_EV_TOTAL=510, STAT_NAMES, etc.
│   ├── ev-calculator.ts              # Cálculo de EVs com modifiers (Power Items, Macho Brace)
│   ├── stat-calculator.ts            # Fórmula de stat final Gen 9
│   ├── showdown-parser.ts            # Import/export formato Pokémon Showdown
│   ├── berry-utils.ts                # Utilitários de berries
│   ├── ingredient-flavors.ts         # Sabores de ingredientes de sanduíche
│   └── farming-logic.ts              # Lógica de farming de EVs
├── hooks/
│   ├── useLocalStorage.ts            # State persistido em localStorage
│   └── usePokemonSearch.ts           # Busca fuzzy por nome de Pokémon
└── i18n/
    ├── index.tsx                     # I18nProvider + useI18n (implementação customizada)
    ├── pt.json                       # Traduções PT-BR
    └── en.json                       # Traduções EN
```

---

## Design System

- **Tema:** Dark mode only (bg-gray-950, text-gray-100)
- **Fonte principal:** Outfit (Google Fonts)
- **Cores de tipo:** Cada tipo Pokémon tem cor fixa definida em `TYPE_COLORS` (`data/types.ts`)
- **Componentes reutilizáveis:**
  - `TypeBadge` — badge colorido com nome do tipo
  - `StatBar` — barra horizontal com fill proporcional (EVs e stats)
  - `PowerTag` — tag de Meal Power com gradiente contextual
- **Estilo:** Tailwind utility classes. Sem CSS modules. Gradientes nos headers e CTAs.
- **Responsivo:** Mobile-first. Grid columns se adaptam com `grid-cols-1 sm:grid-cols-2`

---

## Módulos — Estado Atual

### Módulo 1: Sandwich Builder ✅
**Rota:** `/sandwich-builder`

- 5 abas: Shiny Hunt, Encounter, Raid Power, Breeding, Busca Reversa
- Toggle de busca Pokémon-first (`PokemonSandwichSearch`): busca por Pokémon e mostra quais sanduíches fazer para ele
- Filtro por tipo com badges coloridos
- Card de receita com ingredientes, condimentos, Meal Powers
- Info de como farmar Herba Mystica por tipo de raid
- Receitas verificadas pela comunidade (1 ingrediente + 2x Herba = Lv.3)

### Módulo 2: EV Yield Pokédex ✅
**Rota:** `/ev-pokedex`

- 685 Pokémon (Paldea + Kitakami + Blueberry)
- Busca por nome, filtros por stat, tipo e quantidade de EV yield
- Indicador de "Melhor Spot" por stat
- Badges Lendário (★) e Mítico (✦)
- Toggle card (com sprite) vs tabela compacta
- Modal de detalhes: base stats, cadeia evolutiva, movepool SV, formas alternativas, locais de encontro
- Navegação prev/next no modal

### Módulo 3: EV Training Tracker ✅
**Rota:** `/ev-tracker`

- 6 slots de Pokémon
- Barra visual por stat (252/stat, 510 total)
- Modifiers: Power Item (+8), Macho Brace (2x) — Pokérus não existe em SV
- Templates pré-definidos (Physical Sweeper, Special Attacker, Bulk, etc.)
- Sugestão de onde farmar cada stat
- Persistência em localStorage

### Módulo 4: Tera Raid Build Maker ✅
**Rota:** `/raid-builder`

- Seletor de Pokémon com artwork oficial, badges Lendário/Mítico e flavor text
- Seletor de Nature, Ability, Held Item e 4 Moves
- Distribuição de EVs/IVs com cálculo de stats em tempo real (fórmula Gen 9)
- Badges de efeito nos moves (Drain, Recoil, Multi-hit, Priority, Flinch, etc.)
- Matchups defensivos por tipo (com Tera Type)
- Import/export formato Pokémon Showdown
- Export como imagem PNG (otimizado para Discord)
- Guia de Pokémon para raids com tags (Solo Viable, Top Pick, 7★ Ready, Budget Pick, etc.)

### Módulo 5: Nature Calculator ✅
**Rota:** `/nature-calc`

- Tabela visual das 25 natures com highlight de +10%/-10%
- Calculadora: Base Stat + IV + EV + Nature + Level = stat final
- Comparador side-by-side entre duas natures no mesmo Pokémon
- Sugestão de Mint por role
- Preferências de berry por nature

**Fórmula de stat final Gen 9:**
```
HP    = floor((2 × Base + IV + floor(EV/4)) × Level / 100) + Level + 10
Other = floor((floor((2 × Base + IV + floor(EV/4)) × Level / 100) + 5) × NatureModifier)
NatureModifier: 1.1 (positivo), 0.9 (negativo), 1.0 (neutro)
```

---

## Fontes de Dados

- **PokéAPI** — base stats, types, EV yields, moves, abilities, berries, evolution chains, species data → JSON estático gerado pelos scripts `fetch-*`
- **Serebii.net** — localizações in-game, mecânicas de Tera Raids, receitas de sanduíche, raid bosses
- **Bulbapedia** — dados complementares de EV yields e mecânicas
- **Smogon / Reddit** — tier list e builds baseadas em consenso da comunidade

Sprites via GitHub:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

---

## Convenções de Código

- Componentes: PascalCase (`RecipeCard.tsx`)
- Hooks: camelCase com prefixo use (`useLocalStorage.ts`)
- Data files: kebab-case (`sandwich-recipes.ts`)
- Páginas em `app/` usam `"use client"` quando têm state; server components quando possível
- TypeScript strict — sem `any`
- Tailwind para styling; inline styles só para valores dinâmicos (cores de tipo)
- i18n: usar `useI18n()` e chaves de tradução em `pt.json` / `en.json`

---

## Comandos Úteis

```bash
npm run dev               # Dev server em localhost:3000
npm run build             # Build de produção
npm run lint              # ESLint
npm run start             # Serve build de produção

# Atualizar dados do PokéAPI:
npm run fetch-all              # Busca todos os dados sequencialmente
npm run fetch-pokemon          # Pokémon (685 entradas com species data)
npm run fetch-natures          # Natures
npm run fetch-moves            # Moves
npm run fetch-abilities        # Abilities
npm run fetch-items            # Items
npm run fetch-types            # Types
npm run fetch-berries          # Berries
npm run fetch-berry-flavors    # Berry Flavors
npm run fetch-evolution-chains # Evolution Chains
npm run fetch-move-meta        # Move Meta data
npm run fetch-version-groups   # Version Groups
```
