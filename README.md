# PokéTrainer SV

Ferramentas práticas para jogadores de **Pokémon Scarlet & Violet**. Consulte receitas de sanduíche, treine EVs, monte builds para Tera Raids e muito mais — tudo direto do celular enquanto joga.

**Stack:** Next.js 16 (App Router) / TypeScript / Tailwind CSS v4
**Deploy:** Vercel
**Tema:** Dark mode only

---

## Funcionalidades

### Sandwich Builder
Montador de sanduíches com receitas curadas para Shiny Hunt e Encounter Power.
- Receitas verificadas pela comunidade (1 ingrediente + 2x Herba Mystica = Lv.3)
- Filtro por tipo Pokémon
- Info de como farmar Herba Mystica por tipo de raid
- Busca reversa: escolha o Meal Power desejado e encontre a receita

### EV Yield Pokédex
Lista pesquisável de 664 Pokémon (Paldea + Kitakami + Blueberry) com EVs que cada um dá ao derrotar.
- Busca por nome (fuzzy search)
- Filtros por stat, tipo e quantidade de EV yield
- Indicador de "Melhor Spot" por stat
- Toggle entre modo card (com sprite) e tabela compacta

### EV Training Tracker
Rastreador de progresso de EV training para o time completo.
- 6 slots de Pokémon
- Barra visual por stat com limite 252/stat e 510 total
- Botões de incremento: manual, vitamina (+10), reset
- Modifiers: Pokérus (2x), Power Item (+8), Macho Brace (2x)
- Templates pré-definidos (Physical Sweeper, Special Attacker, Bulk, etc.)
- Persistência em localStorage

### Tera Raid Build Maker
Monte e compartilhe builds otimizadas para Tera Raids 5★/6★/7★.
- Seletor de Pokémon, Nature, Ability, Held Item e 4 Moves
- Distribuição de EVs/IVs com cálculo de stats em tempo real (fórmula Gen 9)
- **Geração de build com IA** — Claude sugere a melhor counter build para cada raid boss
- Import/export formato Pokémon Showdown
- Link compartilhável (state serializado na URL)

### Nature/Stats Calculator
Calculadora rápida de natures e stats finais.
- Tabela visual das 25 natures com highlight de +10%/-10%
- Calculadora: Base Stat + IV + EV + Nature + Level = stat final
- Comparador side-by-side entre duas natures no mesmo Pokémon

---

## Getting Started

### Pré-requisitos
- Node.js 20+
- npm

### Instalação

```bash
git clone https://github.com/jjmacagnan/poketrainer-sv.git
cd poketrainer-sv
npm install
```

### Configuração

Para usar a geração de builds com IA, crie um arquivo `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-api03-sua-chave-aqui
```

Obtenha sua chave em [console.anthropic.com](https://console.anthropic.com/).

### Dados do PokéAPI

Os dados estáticos (Pokémon, natures, moves) são pré-gerados a partir do PokéAPI:

```bash
npm run fetch-data    # Busca todos os dados (Pokémon + Natures + Moves)
```

Arquivos gerados ficam em `src/data/generated/`.

### Dev Server

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de Produção

```bash
npm run build
npm run start
```

---

## Estrutura do Projeto

```
src/
├── app/                          # Rotas (App Router)
│   ├── page.tsx                  # Landing page
│   ├── sandwich-builder/         # Sandwich Builder
│   ├── ev-pokedex/               # EV Yield Pokédex
│   ├── ev-tracker/               # EV Training Tracker
│   ├── raid-builder/             # Tera Raid Build Maker
│   ├── nature-calc/              # Nature/Stats Calculator
│   └── api/generate-build/       # API route — Claude AI build generation
├── components/
│   ├── ui/                       # TypeBadge, StatBar, Navbar, PowerTag
│   ├── sandwich/                 # RecipeCard, RecipeDetail, SandwichBuilder
│   ├── ev/                       # EVPokedex, EVTracker, PokemonSlot
│   ├── raid/                     # RaidBuildMaker, BuildCard
│   ├── nature/                   # NatureCalc
│   └── shared/                   # PageHeader, SearchInput, FilterBar
├── data/
│   ├── generated/                # pokemon.json, natures.json, moves.json
│   ├── types.ts                  # 18 tipos + cores
│   ├── sandwich-recipes.ts       # Receitas de sanduíche
│   ├── items.ts                  # Held items
│   ├── natures.ts                # 25 natures
│   └── raid-bosses.ts            # Bosses 5★/6★/7★
├── lib/
│   ├── constants.ts              # MAX_EV, STAT_NAMES, etc.
│   ├── ev-calculator.ts          # Cálculo de EVs com modifiers
│   ├── stat-calculator.ts        # Fórmula Gen 9 de stat final
│   ├── showdown-parser.ts        # Import/export Showdown
│   └── sandwich-solver.ts        # Busca reversa de receitas
└── hooks/
    ├── useLocalStorage.ts        # State persistido em localStorage
    └── usePokemonSearch.ts       # Busca fuzzy por nome
```

---

## Fontes de Dados

- **PokéAPI** — base stats, types, EV yields, moves, abilities
- **Serebii.net** — localizações, receitas de sanduíche, raid bosses
- **Smogon/Reddit** — builds populares de raids

Sprites via GitHub:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
```

---

## Deploy

O projeto é otimizado para deploy na **Vercel**:

1. Importe o repo na [Vercel](https://vercel.com)
2. Adicione `ANTHROPIC_API_KEY` em Settings > Environment Variables
3. Configure seu domínio customizado em Settings > Domains

---

## Licença

MIT
