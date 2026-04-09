# CLAUDE.md — PokéTrainer SV Tools

## Projeto

Site de ferramentas para jogadores de Pokémon Scarlet & Violet. Foco em funcionalidades práticas que a comunidade mais consulta durante gameplay.

**Stack:** Next.js 14+ (App Router) / TypeScript / Tailwind CSS
**Deploy:** Vercel
**Repo:** github.com/jjmacagnan/poketrainer-sv

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx                 # Layout com fonte Outfit, Navbar, tema dark
│   ├── page.tsx                   # Landing com cards das ferramentas
│   ├── globals.css
│   ├── sandwich-builder/page.tsx  # Módulo 1 — Sandwich Recipe Builder
│   ├── ev-pokedex/page.tsx        # Módulo 2 — EV Yield Pokédex
│   ├── ev-tracker/page.tsx        # Módulo 3 — EV Training Tracker
│   ├── raid-builder/page.tsx      # Módulo 4 — Tera Raid Build Maker
│   └── nature-calc/page.tsx       # Módulo 5 — Nature/Stats Calculator
├── components/
│   ├── ui/                        # Design system: TypeBadge, PowerTag, Navbar, StatBar
│   ├── sandwich/                  # RecipeCard, RecipeDetail, SandwichBuilder
│   ├── ev/                        # EVPokedex, EVTracker components
│   ├── raid/                      # RaidBuildMaker, BuildCard, BuildExport
│   └── shared/                    # PageHeader, SearchInput, FilterBar
├── data/
│   ├── types.ts                   # TYPES array, TYPE_COLORS map, PokemonType type
│   ├── sandwich-recipes.ts        # Shiny/Encounter recipes com Herba Mystica info
│   ├── pokemon-ev-yields.ts       # Todos os Pokémon de Paldea + DLC com EV yields
│   ├── moves.ts                   # Move list (nome, tipo, categoria, power, PP)
│   ├── items.ts                   # Held items relevantes (Power Items, Choice, etc.)
│   ├── abilities.ts               # Abilities relevantes pra raids
│   ├── natures.ts                 # 25 natures com +/- stat
│   └── raid-bosses.ts             # 5★/6★/7★ raid bosses com tipo Tera e stats
├── lib/
│   ├── constants.ts               # MAX_EV_PER_STAT=252, MAX_EV_TOTAL=510, etc.
│   ├── utils.ts                   # Helpers gerais
│   ├── ev-calculator.ts           # Lógica de cálculo de EVs (Pokérus, Power Items)
│   ├── stat-calculator.ts         # Fórmula de stat final (Gen 9)
│   ├── sandwich-solver.ts         # Busca reversa de receitas
│   └── showdown-parser.ts         # Import/export formato Showdown
└── hooks/
    ├── useLocalStorage.ts         # State persistido em localStorage
    └── usePokemonSearch.ts        # Busca fuzzy por nome de Pokémon
```

---

## Design System

- **Tema:** Dark mode only (bg-gray-950, text-gray-100)
- **Fonte principal:** Outfit (Google Fonts) — variável `--font-outfit`
- **Cores de tipo:** Cada tipo Pokémon tem cor fixa definida em `TYPE_COLORS` (data/types.ts)
- **Componentes reutilizáveis:**
  - `TypeBadge` — badge colorido com nome do tipo
  - `StatBar` — barra horizontal com fill proporcional (pra EVs e stats)
  - `PowerTag` — tag de Meal Power com gradiente contextual (dourado pra Sparkling, teal pra Encounter)
- **Estilo:** Tailwind utility classes. Sem CSS modules. Gradientes nos headers e CTAs.
- **Responsivo:** Mobile-first. Grid columns se adaptam com `grid-cols-1 sm:grid-cols-2`

---

## Módulos — Especificações

### Módulo 1: Sandwich Builder ✅ (PRONTO)
**Rota:** `/sandwich-builder`

Montador de sanduíches com receitas curadas pra Shiny Hunt e Encounter Power.

- 3 abas: Shiny Hunt (Sparkling Lv.3), Encounter, Busca Reversa
- Filtro por tipo Pokémon com badges coloridos
- Card de receita com ingredientes, condimentos, Meal Powers
- Info de como farmar Herba Mystica (quais raids dão cada tipo)
- Receitas verificadas pela comunidade (1 ingrediente + 2x Herba = Lv.3)

### Módulo 2: EV Yield Pokédex
**Rota:** `/ev-pokedex`

Lista pesquisável de todos os Pokémon de Paldea + DLC com EVs que dão ao derrotar.

**Funcionalidades:**
- Busca por nome (fuzzy search)
- Filtro por stat de EV (HP, Atk, Def, SpA, SpD, Spe)
- Filtro por quantidade de EV yield (1, 2, 3)
- Filtro por tipo do Pokémon
- Localização in-game (área/rota onde encontrar)
- Indicador "Melhor Spot" por stat (ex: "Speed → Rookidee, South Province Area 1")
- Toggle modo tabela compacta vs modo card com sprite
- Sprite do Pokémon via URL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{dex_number}.png`

**Dados necessários (pokemon-ev-yields.ts):**
```ts
interface PokemonEVYield {
  dexNumber: number;
  name: string;
  types: PokemonType[];
  evYield: { stat: StatName; amount: number }[];
  locations: string[];     // áreas in-game
  isBestSpot?: boolean;    // flag pra "melhor opção" daquele stat
}
```

### Módulo 3: EV Training Tracker
**Rota:** `/ev-tracker`

Rastrear progresso de EV training de cada Pokémon do time.

**Funcionalidades:**
- Até 6 slots de Pokémon (time completo)
- Barra visual por stat (HP/Atk/Def/SpA/SpD/Spe) com limite 252/stat, 510 total
- Botões +/- com incrementos: manual (1), KO yield, vitamina (+10)
- Toggles: Pokérus (2x), Power Item (+8 ao stat correspondente), Macho Brace (2x geral)
- EV restante calculado automaticamente (510 - total usado)
- Templates pré-definidos: "Physical Sweeper 252 Atk/252 Spe/4 HP", "Bulk 252 HP/252 Def/4 SpD", etc.
- Botão Reset por Pokémon
- Persistência em localStorage

**Fórmula de EVs por KO:**
```
EVs ganhos = (base_yield + power_item_bonus) × pokérus_multiplier
- power_item_bonus: +8 se segurando Power Item correspondente
- pokérus_multiplier: 2x se ativo
- macho_brace: 2x (stacks com Pokérus → 4x com ambos, mas sem Power Item)
```

### Módulo 4: Tera Raid Build Maker
**Rota:** `/raid-builder`

Montar e compartilhar builds otimizadas pra Tera Raids 5★/6★/7★.

**Funcionalidades:**
- Seletor de Pokémon (busca por nome com sprite)
- Seletor de: Tera Type, Nature, Ability, Held Item
- Seletor de 4 moves
- Distribuição de EVs visual (integrar componente do Módulo 3)
- IVs: toggle "All 31" ou "Hyper Trained" ou valor manual
- Cálculo de stats finais em tempo real usando fórmula Gen 9
- Campo de notas/estratégia (textarea)
- Seção de "Builds Populares" organizadas por raid boss
- Exportar build como imagem (html-to-image → PNG pra Discord)
- Import/export formato Showdown
- Link compartilhável (state serializado na URL com query params ou hash)

**Fórmula de stat final Gen 9:**
```
HP = floor((2 × Base + IV + floor(EV/4)) × Level / 100) + Level + 10
Other = floor((floor((2 × Base + IV + floor(EV/4)) × Level / 100) + 5) × NatureModifier)
NatureModifier: 1.1 (positive), 0.9 (negative), 1.0 (neutral)
```

### Módulo 5: Nature/Stats Calculator
**Rota:** `/nature-calc`

Calculadora rápida de natures e stats.

**Funcionalidades:**
- Tabela visual das 25 natures com highlight de +10%/-10%
- Seletor de Nature → mostra qual stat sobe e qual desce
- Calculadora: input Base Stat + IV + EV + Nature + Level → stat final
- Sugestão de Mint baseada no role (Physical Attacker → Adamant, Special → Modest, etc.)
- Comparador: mostra diff entre 2 natures no mesmo Pokémon

**Dados (natures.ts):**
```ts
interface Nature {
  name: string;
  increased: StatName | null;  // null pra neutras
  decreased: StatName | null;
  flavor?: { likes: string; dislikes: string };  // Hardy, Bashful, etc. = neutras
}
```

---

## Prioridade de Implementação

1. ✅ Sandwich Builder (PRONTO)
2. 🔜 EV Yield Pokédex — dados de todos os Pokémon + filtros + sprites
3. 🔜 EV Training Tracker — lógica de cálculo + persistência
4. 🔜 Tera Raid Build Maker — mais complexo, depende de moves/items/abilities
5. 🔜 Nature Calculator — mais simples, pode ser feito rápido

---

## Fontes de Dados

- **PokéAPI** (pokeapi.co): base stats, types, EV yields, moves, abilities → gerar JSON estático no build pra performance
- **Serebii.net**: localizações in-game, receitas de sanduíche, raid bosses, detalhes de DLC
- **Bulbapedia**: dados complementares de EV yields e mecânicas
- **Smogon/Reddit**: builds populares de raids pra seed inicial

Para sprites de Pokémon:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

---

## Convenções de Código

- Componentes: PascalCase (`RecipeCard.tsx`)
- Hooks: camelCase com prefixo use (`useLocalStorage.ts`)
- Data files: kebab-case (`sandwich-recipes.ts`)
- Todas as páginas em `app/` usam `"use client"` quando têm state
- Server components quando possível (data fetching no server)
- Tipagem TypeScript strict — sem `any`
- Tailwind pra styling, inline styles só quando dinâmico (cores de tipo)

---

## Diferenciais do Projeto

- **Bilíngue PT/EN** (futuro — i18n com next-intl)
- **Sandwich solver reverso** (busca por poder desejado → retorna receitas)
- **Build export como imagem** otimizada pra Discord
- **PWA** — funciona offline no celular durante gameplay
- **Mobile-first** — jogadores usam no celular enquanto jogam
- **SEO otimizado** — cada ferramenta é uma página indexável

---

## Comandos Úteis

```bash
npm run dev          # Dev server em localhost:3000
npm run build        # Build de produção
npm run lint         # ESLint
npm run start        # Serve build de produção
```