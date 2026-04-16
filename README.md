# PokéTrainer SV &nbsp;·&nbsp; [🇺🇸 English](README.en.md)

Ferramentas práticas para jogadores de **Pokémon Scarlet & Violet**. Consulte receitas de sanduíche, treine EVs, monte builds para Tera Raids e muito mais — tudo direto do celular enquanto joga.

**Stack:** Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / React 19
**Deploy:** Vercel
**Tema:** Dark mode only
**i18n:** Português (PT-BR) e Inglês (EN)
**PWA:** Instalável como app no celular

---

## Funcionalidades

### 🥪 Sandwich Builder
Montador de sanduíches com receitas curadas para Shiny Hunt, Encounter Power, Raid Power e Breeding.
- Receitas verificadas pela comunidade (1 ingrediente + 2x Herba Mystica = Lv.3)
- 5 abas: Shiny Hunt, Encounter, Raid Power, Breeding, Busca Reversa
- Filtro por tipo Pokémon com badges coloridos
- Info de como farmar Herba Mystica por tipo de raid
- Busca reversa: escolha o Meal Power desejado e encontre a receita
- Dados de flavor de ingredientes e berries equivalentes

### 📖 EV Yield Pokédex
Lista pesquisável de 685 Pokémon (Paldea + Kitakami + Blueberry) com EVs que cada um dá ao derrotar.
- Busca por nome, filtros por stat, tipo e quantidade de EV yield
- Indicador de "Melhor Spot" por stat
- Badges de Lendário (★) e Mítico (✦)
- Toggle entre modo card (com sprite) e tabela compacta
- Modal de detalhes com:
  - Dados completos: base stats, peso, altura, taxa de captura, egg groups
  - Flavor text do jogo (prioriza Scarlet/Violet)
  - Cadeia evolutiva com sprites
  - Movepool para Scarlet/Violet (level-up, TM, egg, tutor)
  - Formas alternativas com sprites
  - Locais de encontro (Scarlet / Violet)

### 📊 EV Training Tracker
Rastreador de progresso de EV training para o time completo.
- 6 slots de Pokémon
- Barra visual por stat com limite 252/stat e 510 total
- Botões de incremento: manual, vitamina (+10), reset
- Modifiers: Pokérus (2x), Power Item (+8), Macho Brace (2x)
- Templates pré-definidos (Physical Sweeper, Special Attacker, Bulk, etc.)
- Sugestão de onde farmar cada stat
- Persistência em localStorage

### ⚔️ Tera Raid Build Maker
Monte e compartilhe builds otimizadas para Tera Raids 5★/6★/7★.
- Seletor de Pokémon com artwork oficial, badges Lendário/Mítico e flavor text
- Seletor de Nature, Ability, Held Item e 4 Moves
- Distribuição de EVs/IVs com cálculo de stats em tempo real (fórmula Gen 9)
- Badges de efeito nos moves (Drain, Recoil, Multi-hit, Priority, Flinch, etc.)
- Matchups defensivos por tipo (com Tera Type)
- Efeitos de habilidades e itens no card
- Import/export formato Pokémon Showdown
- Export como imagem PNG (otimizado para Discord)
- Guia de Pokémon para Tera Raids com tags (Solo Viable, Top Pick, 7★ Ready, Budget Pick, etc.)

### 🧮 Nature Calculator
Calculadora rápida de natures e stats finais.
- Tabela visual das 25 natures com highlight de +10%/-10%
- Calculadora: Base Stat + IV + EV + Nature + Level = stat final
- Comparador side-by-side entre duas natures no mesmo Pokémon
- Sugestão de Mint por role
- Preferências de berry por nature

### 🤝 Comunidade
Página dedicada à comunidade JJ Bit.
- Link para canal no YouTube
- Link para servidor do Discord
- Seção de vídeos em destaque

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

### Dados do PokéAPI

Os dados estáticos (Pokémon, natures, moves, abilities, items, berries, etc.) são pré-gerados a partir do PokéAPI. Execute após clonar o repo ou ao atualizar dados:

```bash
npm run fetch-all          # Busca todos os dados sequencialmente
npm run fetch-pokemon      # Busca apenas Pokémon (685 entradas com species data)
npm run fetch-natures      # Busca apenas Natures
npm run fetch-moves        # Busca apenas Moves
npm run fetch-abilities    # Busca apenas Abilities
npm run fetch-items        # Busca apenas Items
npm run fetch-types        # Busca apenas Types
npm run fetch-berries      # Busca apenas Berries
npm run fetch-berry-flavors # Busca Berry Flavors
npm run fetch-evolution-chains # Busca Evolution Chains
npm run fetch-move-meta    # Busca Move Meta data
npm run fetch-version-groups # Busca Version Groups
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

### Lint

```bash
npm run lint
```

---

## Estrutura do Projeto

```
src/
├── app/                              # Rotas (App Router)
│   ├── page.tsx                      # Landing page (grid de ferramentas)
│   ├── layout.tsx                    # Root layout (Navbar + Footer + PWA)
│   ├── globals.css                   # Estilos globais
│   ├── manifest.ts                   # PWA manifest
│   ├── sandwich-builder/             # Sandwich Builder
│   ├── ev-pokedex/                   # EV Yield Pokédex
│   ├── ev-tracker/                   # EV Training Tracker
│   ├── raid-builder/                 # Tera Raid Build Maker
│   ├── nature-calc/                  # Nature/Stats Calculator
│   ├── comunidade/                   # Página da Comunidade (YouTube + Discord)
│   ├── termos/                       # Termos de Uso
│   ├── privacidade/                  # Política de Privacidade
│   └── aviso-legal/                  # Aviso Legal
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
│   ├── generated/                    # Dados do PokéAPI (11 arquivos JSON)
│   │   ├── pokemon.json              # 685 Pokémon com base stats, EV yields, species data
│   │   │                             # (isLegendary, isMythical, flavorText, formVariants,
│   │   │                             #  evolutionChainId, eggGroups, captureRate, etc.)
│   │   ├── natures.json, moves.json, move-meta.json
│   │   ├── abilities.json, items.json, berries.json
│   │   ├── berry-flavors.json, evolution-chains.json
│   │   ├── types.json, version-groups.json
│   ├── types.ts                      # 18 tipos + cores (TYPE_COLORS)
│   ├── sandwich-recipes.ts           # Receitas de sanduíche (Shiny + Encounter)
│   ├── sandwich-guide.ts             # Guia de sanduíches
│   ├── items.ts                      # Held items
│   ├── raid-bosses.ts                # Bosses 5★/6★/7★
│   ├── raid-tier-list.ts             # Tier list SS/S/A/B/C para raids
│   ├── training-locations.ts         # Locais de EV training
│   └── pokemon-utils.ts              # Utilitários de Pokémon
├── lib/
│   ├── constants.ts                  # MAX_EV, STAT_NAMES, etc.
│   ├── ev-calculator.ts              # Cálculo de EVs com modifiers
│   ├── stat-calculator.ts            # Fórmula Gen 9 de stat final
│   ├── showdown-parser.ts            # Import/export Pokémon Showdown
│   ├── berry-utils.ts                # Utilitários de berries
│   ├── ingredient-flavors.ts         # Sabores de ingredientes
│   └── farming-logic.ts              # Lógica de farming
├── hooks/
│   ├── useLocalStorage.ts            # State persistido em localStorage
│   └── usePokemonSearch.ts           # Busca fuzzy por nome
└── i18n/
    ├── index.tsx                     # I18nProvider + useI18n (implementação customizada)
    ├── pt.json                       # Traduções PT-BR
    └── en.json                       # Traduções EN
```

---

## Fontes de Dados

- **PokéAPI** — base stats, types, EV yields, moves, abilities, berries, evolution chains, species data
- **Serebii.net** — localizações in-game, mecânicas de Tera Raids, receitas de sanduíche, raid bosses
- **Smogon / Reddit** — tier list e builds baseadas em consenso da comunidade

Sprites via GitHub:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

---

## Deploy

O projeto é otimizado para deploy na **Vercel**:

1. Importe o repo na [Vercel](https://vercel.com)
2. Configure seu domínio customizado em Settings > Domains

---

## Legal

Este é um projeto de fãs não oficial, sem afiliação ou endosso da Nintendo, Game Freak ou The Pokémon Company. Pokémon e todos os nomes relacionados são marcas registradas de seus respectivos proprietários.

- [Termos de Uso](https://poketrainer.jbit.app.br/termos)
- [Política de Privacidade](https://poketrainer.jbit.app.br/privacidade)
- [Aviso Legal](https://poketrainer.jbit.app.br/aviso-legal)

---

## Licença

MIT
