# Design Spec — Game UI Redesign
**Date:** 2026-04-20  
**Scope:** Design system completo — tokens, Navbar, homepage, todos os componentes compartilhados e específicos de cada ferramenta

---

## Contexto

O design atual do PokéTrainer SV tem estética genérica de SaaS (glass cards, gradientes neutros, fonte Syne). O objetivo é refatorar para um visual autoral com identidade de jogo Pokémon, preparado para escalar para outros jogos no futuro.

---

## Direção Estética

**Estilo:** Game UI / RPG — inspirado na interface dos próprios jogos Pokémon.  
**Tipografia:** Pixel/Retro — fonte monospace em maiúsculas com tracking largo para labels, títulos e navegação. Outfit mantida para corpo de texto (legibilidade).  
**Paleta:** Pokémon Gold — `#FFD700` (gold) + `#F97316` (orange) como acentos sobre fundo preto/navy profundo.  
**Layout homepage:** Grid Pokédex 3 colunas com numeração `#001`/`#002`... Ferramentas futuras aparecem como `#???` com borda dashed e estado "LOCKED".

---

## Tokens de Design (`globals.css`)

```css
:root {
  --pt-bg:          #08080f;   /* background principal */
  --pt-surface:     #0f0f1e;   /* navbar, cards surface */
  --pt-card:        #0a0a16;   /* cards das ferramentas */
  --pt-gold:        #FFD700;   /* acento primário */
  --pt-gold-dim:    #B8860B;   /* gold escurecido (hover states) */
  --pt-orange:      #F97316;   /* acento secundário */
  --pt-border:      #FFD700;   /* borda ativa */
  --pt-border-dim:  #2a2a3a;   /* borda inativa */
  --pt-text:        #ffffff;
  --pt-text-dim:    #888888;
  --pt-mono:        'Share Tech Mono', monospace;
  --pt-body:        'Outfit', sans-serif;
}
```

**Fonte adicionada:** `Share Tech Mono` (Google Fonts) — substitui `Syne` como fonte display. Outfit permanece como fonte de corpo.

---

## Navbar

**Arquivo:** `src/components/ui/Navbar.tsx`

- Background: `var(--pt-surface)` com `border-bottom: 2px solid var(--pt-gold)`
- Logo: `▶ POKÉTRAINER·SV` em Share Tech Mono, gold + orange no `·SV`, com cursor piscando animado (CSS `@keyframes blink`)
- Links de navegação: Share Tech Mono 9px, uppercase, `letter-spacing: 2px`. Estado ativo: texto gold + borda gold + fundo `rgba(255,215,0,0.06)`. Estado hover: texto branco + borda dim.
- Locale switcher: mantém estrutura atual, estilizado com borda dim e estado ativo gold.
- Remove: `backdrop-blur`, `bg-gray-950/80` — substitui por surface sólida.

---

## Homepage (`src/app/page.tsx`)

### Hero
- Label superior: `▶ POKÉMON SCARLET & VIOLET` em mono 9px gold
- Título: `POKÉTRAINER / SV TOOLS` em Share Tech Mono uppercase, sem gradiente de texto
- Divider: linha fina com gradient `transparent → gold → transparent`
- Subtítulo: `SELECT YOUR TOOL` em mono uppercase dim

### Grid de Ferramentas
- Layout: `grid-template-columns: repeat(3, 1fr)`, gap 8px. Mobile: 2 colunas.
- Section label acima do grid: `▶ AVAILABLE TOOLS — 7/8 UNLOCKED` com linha separadora

**Estrutura de cada card:**
```
#001              ← Share Tech Mono 8px gold
🥪                ← emoji 22px
SANDWICH          ← Share Tech Mono 10px uppercase white
BUILDER
Descrição curta   ← Outfit 11px text-dim
▶ OPEN →          ← mono 9px gold, visível só no hover/active
```

**Estados:**
- **Default:** borda `var(--pt-border-dim)`, background `var(--pt-card)`
- **Hover:** borda `rgba(255,215,0,0.5)`, background `rgba(255,215,0,0.02)`
- **Active (página atual):** borda gold sólida, barra top `linear-gradient(gold → orange)`, background `rgba(255,215,0,0.04)`
- **Locked (#???):** borda dashed dim, opacity 0.35, sem hover, emoji 🔒

**Ferramentas e números:**
| # | Ferramenta | Emoji |
|---|-----------|-------|
| #001 | Sandwich Builder | 🥪 |
| #002 | EV Pokédex | 📖 |
| #003 | EV Tracker | 📊 |
| #004 | Raid Builder | ⚔️ |
| #005 | Nature Calc | 🧮 |
| #006 | Dicas de Treino | 💡 |
| #007 | Comunidade | 🌐 |
| #??? | Coming Soon | 🔒 |

---

## globals.css — Alterações

1. Substituir variáveis atuais pelos tokens `--pt-*` acima
2. Background do body: `var(--pt-bg)` sólido — remove os `radial-gradient` atuais (muito SaaS)
3. Adicionar `@keyframes blink` para o cursor do logo
4. Manter `@keyframes fade-up` e `.animate-fade-up`
5. Adicionar `Share Tech Mono` ao import de fontes em `layout.tsx`

---

## layout.tsx — Alterações

- Adicionar import da fonte `ShareTechMono` via `next/font/google`
- Expor como variável CSS `--font-share-tech-mono`
- Remover import de `Syne` (substituída)
- Atualizar className do `<html>` para incluir a nova variável

---

## Linguagem visual a aplicar em todos os componentes

Estes princípios guiam as mudanças em todos os arquivos abaixo:

- **Bordas:** `rounded-xl` / `rounded-full` / `rounded-lg` → `rounded-none` ou `rounded-sm` (cantos retos, game UI)
- **Bordas de cor:** `border-white/10` → `border-[var(--pt-border-dim)]`; borda ativa → `border-[var(--pt-gold)]`
- **Backgrounds:** `bg-white/5`, `bg-gray-900` → `bg-[var(--pt-card)]` ou `bg-[var(--pt-surface)]`
- **Texto secundário:** `text-gray-400` / `text-gray-500` → `text-[var(--pt-text-dim)]`
- **Focus rings:** `focus:border-violet-500` → `focus:border-[var(--pt-gold)]`
- **Fonte de heading/label:** `font-syne` / `font-bold` em títulos → `font-[family-name:var(--font-share-tech-mono)]` uppercase
- **Botões ativos:** sem `rounded-full` — borda gold retangular + fundo `rgba(255,215,0,0.08)`
- **Gradientes SaaS** (violeta/azul genérico) → substituir por gold/orange ou remover

---

## Componentes Compartilhados (`src/components/shared/`)

### `PageHeader.tsx`
- Remover gradiente de texto (`WebkitBackgroundClip`) e `font-syne`
- Título: Share Tech Mono uppercase, cor `var(--pt-gold)`
- Adicionar `prop: number` (ex: `toolNumber: "#001"`) exibido acima do título em mono dim
- Subtítulo: Outfit, `var(--pt-text-dim)`

### `SearchInput.tsx`
- `rounded-xl` → `rounded-none`
- `border-white/10` → `border-[var(--pt-border-dim)]`
- `bg-white/5` → `bg-[var(--pt-card)]`
- `focus:border-violet-500` → `focus:border-[var(--pt-gold)]`
- Ícone de busca: `var(--pt-text-dim)` → `var(--pt-gold)` no focus

### `FilterBar.tsx`
- Botões: `rounded-full` → `rounded-none`
- Estilo inativo: `border-[var(--pt-border-dim)]` + texto dim
- Estilo ativo: `border-[var(--pt-gold)]` + texto gold + fundo `rgba(255,215,0,0.08)`
- TypeBadge filters (tipos Pokémon): mantém cores de tipo — são identidade do jogo, não SaaS

---

## Componentes UI (`src/components/ui/`)

### `TypeBadge.tsx`
- Manter cores de tipo (são canônicas do Pokémon)
- `rounded-full` → `rounded-sm` (levemente menos pill, mais sharp)

### `StatBar.tsx`
- Manter cores por stat (HP vermelho, Atk laranja, etc. — canônicas)
- Barra: `rounded-full` → `rounded-none` (barra reta, estilo game)
- Label: `font-mono` → Share Tech Mono

### `PowerTag.tsx`
- Gold/teal gradients já batem com a paleta — manter
- `rounded-md` → `rounded-none`
- Border: `rgba(255,255,255,0.3)` → `rgba(255,215,0,0.4)` para Lv.3

### `Footer.tsx`
- Texto: Share Tech Mono uppercase, `var(--pt-text-dim)`
- `border-top`: `var(--pt-border-dim)`
- Links de ferramenta: mono, hover → gold
- Remove qualquer `rounded-*` dos botões internos

### `BuyMeCoffeeLink.tsx`
- Estilizar inline com borda gold, mono, sem `rounded-xl`

---

## Componentes de Ferramenta

### `sandwich/SandwichBuilder.tsx`, `RecipeCard.tsx`, `RecipeDetail.tsx`
- Cards: `rounded-2xl` → `rounded-none`, `border-white/[0.08]` → `border-[var(--pt-border-dim)]`
- Headers de seção: Share Tech Mono uppercase gold
- Tabs: borda retangular, ativa com gold underline ou border

### `ev/EVPokedex.tsx`, `PokemonDetailModal.tsx`
- Tabela/grid: bordas dim, sem rounded
- Modal: `border-[var(--pt-gold)]` 2px, background `var(--pt-surface)`
- Badges de stat: Share Tech Mono

### `ev/EVTracker.tsx`, `PokemonSlot.tsx`
- Slots vazios: borda dashed dim (consistente com card LOCKED da homepage)
- Slot ativo: borda gold
- Barras de EV: `StatBar` já atualizado (rounded-none)
- Botões +/-: retangulares, borda dim, hover gold

### `raid/RaidBuildMaker.tsx`, `BuildCard.tsx`, `BuildExport.tsx`
- Cards de build: sem rounded, borda dim
- Seletor de Tera Type: usa TypeBadge (já atualizado)
- Export button: borda gold, Share Tech Mono

### `nature/NatureCalc.tsx`
- Tabela de natures: bordas dim, célula ativa com background gold `rgba`
- Highlight +10% / -10%: gold / text-dim (substituir violeta/vermelho genérico)

### `training/TrainingTips.tsx`
- Headers de seção: Share Tech Mono uppercase gold
- Cards de dica: borda dim, sem rounded

### `legal/LegalPageTemplate.tsx`
- Headers: Share Tech Mono
- Conteúdo: Outfit (corpo de texto — correto)

---

## O que NÃO muda neste redesign

- Estrutura de rotas e páginas internas
- Lógica de i18n (`useI18n`, chaves de tradução)
- Cores de tipo Pokémon em `TypeBadge` / `FilterBar` (são identidade canônica)
- Cores de stat em `StatBar` (HP, Atk, Def, etc. — canônicas)
- Dados (`pokemon-ev-yields.ts`, `sandwich-recipes.ts`, etc.)
- PWA / Service Worker / manifest

---

## Critérios de Sucesso

- Visual imediatamente reconhecível como "jogo Pokémon" em qualquer página do site
- Navbar com identidade forte — o cursor piscando como detalhe memorável
- Grid numerado que escala naturalmente para novos jogos/ferramentas
- Componentes internos consistentes — sem mistura de estilo SaaS e Game UI
- Cores de tipo e stat preservadas — identidade do jogo intacta
