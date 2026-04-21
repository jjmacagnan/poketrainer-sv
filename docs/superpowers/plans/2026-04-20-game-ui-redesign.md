# Game UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar o design de todo o site de uma estética genérica SaaS para um Game UI / RPG inspirado nos próprios jogos Pokémon, com paleta Pokémon Gold (dourado + laranja em fundo navy/preto), tipografia monospace e linguagem visual consistente em todos os componentes.

**Architecture:** Token-first — os CSS variables `--pt-*` em `globals.css` são definidos primeiro, depois os componentes globais (Navbar, Footer), depois os compartilhados (PageHeader, SearchInput, FilterBar), depois os UI primitivos (TypeBadge, StatBar, PowerTag), então a homepage, e por fim os componentes de cada ferramenta. Todos os componentes consomem os tokens; nenhuma ferramenta muda sua lógica ou estrutura de dados.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, Google Fonts (Share Tech Mono + Outfit)

---

## Mapa de Arquivos

| Arquivo | Ação |
|---------|------|
| `src/app/globals.css` | Modificar — tokens + keyframes |
| `src/app/layout.tsx` | Modificar — trocar Syne por Share Tech Mono |
| `src/components/ui/Navbar.tsx` | Modificar — novo visual Game UI |
| `src/components/ui/Footer.tsx` | Modificar — mono font, gold accents |
| `src/components/ui/TypeBadge.tsx` | Modificar — rounded-sm |
| `src/components/ui/StatBar.tsx` | Modificar — barra reta, mono label |
| `src/components/ui/PowerTag.tsx` | Modificar — sem rounded |
| `src/components/ui/BuyMeCoffeeLink.tsx` | Modificar — borda gold |
| `src/components/shared/PageHeader.tsx` | Modificar — mono title, sem gradiente |
| `src/components/shared/SearchInput.tsx` | Modificar — bordas retas, gold focus |
| `src/components/shared/FilterBar.tsx` | Modificar — botões retangulares, gold ativo |
| `src/app/page.tsx` | Modificar — grid Pokédex #001–#007 |
| `src/components/sandwich/SandwichBuilder.tsx` | Modificar — tabs, cards, filtros |
| `src/components/sandwich/RecipeCard.tsx` | Modificar — sem rounded |
| `src/components/sandwich/RecipeDetail.tsx` | Modificar — bordas game UI |
| `src/components/ev/EVPokedex.tsx` | Modificar — cards, tabela, filtros stat |
| `src/components/ev/PokemonDetailModal.tsx` | Modificar — modal, badges, sections |
| `src/components/ev/EVTracker.tsx` | Modificar — slots, botões |
| `src/components/ev/PokemonSlot.tsx` | Modificar — slot ativo/vazio |
| `src/components/raid/RaidBuildMaker.tsx` | Modificar — seletores, cards |
| `src/components/raid/BuildCard.tsx` | Modificar — card sem rounded |
| `src/components/raid/BuildExport.tsx` | Modificar — botão export |
| `src/components/nature/NatureCalc.tsx` | Modificar — tabela, highlight gold |
| `src/components/training/TrainingTips.tsx` | Modificar — headers mono, cards |
| `src/components/legal/LegalPageTemplate.tsx` | Modificar — headers mono |

---

## Task 1: Foundation — globals.css + layout.tsx

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Substituir globals.css**

```css
/* src/app/globals.css */
@import "tailwindcss";

:root {
  --pt-bg:         #08080f;
  --pt-surface:    #0f0f1e;
  --pt-card:       #0a0a16;
  --pt-gold:       #FFD700;
  --pt-gold-dim:   #B8860B;
  --pt-orange:     #F97316;
  --pt-border:     #FFD700;
  --pt-border-dim: #2a2a3a;
  --pt-text:       #ffffff;
  --pt-text-dim:   #888888;
  --background:    #08080f;
  --foreground:    #f3f4f6;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-outfit);
  --font-display: var(--font-share-tech-mono), monospace;
}

body {
  background: var(--pt-bg);
  color: var(--pt-text);
}

select option {
  background: #1f2937;
  color: #f3f4f6;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.blink {
  animation: blink 1s step-end infinite;
}
```

- [ ] **Step 2: Atualizar layout.tsx — trocar Syne por Share Tech Mono**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Outfit, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Providers } from "@/components/Providers";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://poketrainer.jbit.app.br"),
  title: {
    default: "PokéTrainer SV Tools",
    template: "%s",
  },
  description:
    "Ferramentas práticas para jogadores de Pokémon Scarlet & Violet — Sandwich Builder, EV Pokédex, EV Tracker, Raid Builder & Nature Calculator.",
  openGraph: {
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PokéTrainer SV",
  },
  formatDetection: { telephone: false },
  icons: { apple: "/icons/icon-192.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${shareTechMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--pt-bg)] font-[family-name:var(--font-outfit)] text-[var(--pt-text)]">
        <ServiceWorkerRegistration />
        <Providers>
          <div className="flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verificar no browser** — fundo deve ser `#08080f` puro (sem radial gradient SaaS) e a fonte Share Tech Mono deve estar disponível como CSS var

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: add Game UI design tokens and Share Tech Mono font"
```

---

## Task 2: Navbar

**Files:**
- Modify: `src/components/ui/Navbar.tsx`

- [ ] **Step 1: Reescrever Navbar.tsx**

```tsx
// src/components/ui/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n";

const NAV_ITEMS = [
  { href: "/sandwich-builder", key: "sandwich" },
  { href: "/ev-pokedex",       key: "evPokedex" },
  { href: "/ev-tracker",       key: "evTracker" },
  { href: "/raid-builder",     key: "raidBuilder" },
  { href: "/nature-calc",      key: "natureCalc" },
  { href: "/training-tips",    key: "trainingTips" },
  { href: "/comunidade",       key: "comunidade" },
];

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[var(--pt-gold)] bg-[var(--pt-surface)]">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-[family-name:var(--font-share-tech-mono)] text-sm uppercase tracking-[2px] text-[var(--pt-gold)]"
        >
          <span className="inline-block h-3.5 w-2 bg-[var(--pt-gold)] blink" />
          POKÉTRAINER<span className="text-[var(--pt-orange)]">·SV</span>
        </Link>

        {/* Nav links */}
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 border px-3 py-1.5 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-colors ${
                pathname === item.href
                  ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)] text-[var(--pt-gold)]"
                  : "border-transparent text-[var(--pt-text-dim)] hover:border-[var(--pt-border-dim)] hover:text-[var(--pt-text)]"
              }`}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>

        {/* Locale switcher */}
        <div className="flex shrink-0 items-center border border-[var(--pt-border-dim)]">
          {(["pt", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-2 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-all ${
                locale === l
                  ? "bg-[rgba(255,215,0,0.15)] text-[var(--pt-gold)]"
                  : "text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verificar no browser** — logo com cursor piscando, border-bottom gold, links com borda retangular no ativo

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Navbar.tsx
git commit -m "feat: redesign Navbar with Game UI style and blinking cursor logo"
```

---

## Task 3: Footer

**Files:**
- Modify: `src/components/ui/Footer.tsx`

- [ ] **Step 1: Ler o arquivo atual**

```bash
# Verificar o conteúdo completo de Footer.tsx antes de editar
```

- [ ] **Step 2: Aplicar linguagem visual game UI ao Footer**

Localizar no Footer todas as ocorrências de:
- `rounded-*` → remover ou substituir por `rounded-none`/`rounded-sm`
- `border-white/10` → `border-[var(--pt-border-dim)]`
- `bg-white/5` → `bg-[var(--pt-surface)]`
- `text-gray-400` / `text-gray-500` → `text-[var(--pt-text-dim)]`
- `font-[family-name:var(--font-syne)]` ou `font-bold` em headings → `font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px]`
- Link hover: `hover:text-white` → `hover:text-[var(--pt-gold)]`
- Borda superior do footer: `border-white/10` → `border-[var(--pt-border-dim)]`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Footer.tsx
git commit -m "feat: apply Game UI style to Footer"
```

---

## Task 4: Shared Components

**Files:**
- Modify: `src/components/shared/PageHeader.tsx`
- Modify: `src/components/shared/SearchInput.tsx`
- Modify: `src/components/shared/FilterBar.tsx`

- [ ] **Step 1: Reescrever PageHeader.tsx**

```tsx
// src/components/shared/PageHeader.tsx
"use client";

interface PageHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  toolNumber?: string;
  gradient?: string; // mantido para não quebrar callers existentes, ignorado
}

export function PageHeader({ emoji, title, subtitle, toolNumber }: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      {toolNumber && (
        <div className="mb-1 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[3px] text-[var(--pt-text-dim)]">
          {toolNumber}
        </div>
      )}
      <div className="mb-2 text-5xl">{emoji}</div>
      <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-2xl uppercase tracking-[2px] text-[var(--pt-gold)]">
        {title}
      </h1>
      <p className="text-sm text-[var(--pt-text-dim)]">{subtitle}</p>
    </div>
  );
}
```

- [ ] **Step 2: Reescrever SearchInput.tsx**

```tsx
// src/components/shared/SearchInput.tsx
"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pt-text-dim)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[var(--pt-border-dim)] bg-[var(--pt-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--pt-text)] placeholder-[var(--pt-text-dim)] outline-none transition-colors focus:border-[var(--pt-gold)]"
      />
    </div>
  );
}
```

- [ ] **Step 3: Reescrever FilterBar.tsx**

```tsx
// src/components/shared/FilterBar.tsx
"use client";

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: string;
}

export function FilterBar({ options, selected, onSelect, allLabel = "Todos" }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      <button
        onClick={() => onSelect(null)}
        className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-colors ${
          !selected
            ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
            : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] hover:border-[rgba(255,215,0,0.4)] hover:text-[var(--pt-text)]"
        }`}
      >
        {allLabel}
      </button>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(isActive ? null : opt.value)}
            className="border px-3 py-1 text-[11px] font-bold uppercase text-white transition-all"
            style={{
              background: isActive
                ? opt.color || "var(--pt-gold)"
                : opt.color
                  ? `${opt.color}22`
                  : "var(--pt-card)",
              borderColor: isActive
                ? opt.color || "var(--pt-gold)"
                : opt.color
                  ? `${opt.color}44`
                  : "var(--pt-border-dim)",
              opacity: isActive ? 1 : 0.75,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/PageHeader.tsx src/components/shared/SearchInput.tsx src/components/shared/FilterBar.tsx
git commit -m "feat: apply Game UI style to shared components"
```

---

## Task 5: UI Primitives

**Files:**
- Modify: `src/components/ui/TypeBadge.tsx`
- Modify: `src/components/ui/StatBar.tsx`
- Modify: `src/components/ui/PowerTag.tsx`
- Modify: `src/components/ui/BuyMeCoffeeLink.tsx`

- [ ] **Step 1: Atualizar TypeBadge.tsx** — apenas trocar `rounded-full` → `rounded-sm`

```tsx
// src/components/ui/TypeBadge.tsx
"use client";

import type { PokemonType } from "@/data/types";
import { TYPE_COLORS } from "@/data/types";

interface TypeBadgeProps {
  type: PokemonType;
  small?: boolean;
}

export function TypeBadge({ type, small = false }: TypeBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm font-bold uppercase tracking-wide"
      style={{
        background: TYPE_COLORS[type] || "#888",
        color: "#fff",
        padding: small ? "2px 8px" : "4px 12px",
        fontSize: small ? "11px" : "13px",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      {type}
    </span>
  );
}
```

- [ ] **Step 2: Atualizar StatBar.tsx** — barra reta, mono label

```tsx
// src/components/ui/StatBar.tsx
"use client";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

const STAT_COLORS: Record<string, string> = {
  HP:  "#FF5959",
  Atk: "#F5AC78",
  Def: "#FAE078",
  SpA: "#9DB7F5",
  SpD: "#A7DB8D",
  Spe: "#FA92B2",
};

export function StatBar({ label, value, max = 255, color }: StatBarProps) {
  const fill = Math.min((value / max) * 100, 100);
  const barColor = color || STAT_COLORS[label] || "#FFD700";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 shrink-0 text-right font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[1px] text-[var(--pt-text-dim)]">
        {label}
      </span>
      <span className="w-8 shrink-0 text-right font-[family-name:var(--font-share-tech-mono)] text-[10px] text-[var(--pt-text)]">
        {value}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden bg-white/10">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300"
          style={{ width: `${fill}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Atualizar PowerTag.tsx** — sem rounded, border gold para Lv.3

```tsx
// src/components/ui/PowerTag.tsx
"use client";

interface PowerTagProps {
  power: string;
}

export function PowerTag({ power }: PowerTagProps) {
  const isShiny = power.includes("Sparkling");
  const isEncounter = power.includes("Encounter");
  const isLv3 = power.includes("Lv.3");

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold"
      style={{
        background: isShiny
          ? "linear-gradient(135deg, #FFD700, #FFA500)"
          : isEncounter
            ? "linear-gradient(135deg, #4ECDC4, #2C8C85)"
            : "rgba(255,255,255,0.08)",
        color: isShiny || isEncounter ? "#fff" : "#F0F0F0",
        padding: "3px 10px",
        border: isLv3
          ? "1px solid rgba(255,215,0,0.4)"
          : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {isShiny && "✨ "}
      {power}
    </span>
  );
}
```

- [ ] **Step 4: Ler e atualizar BuyMeCoffeeLink.tsx**

Localizar no arquivo qualquer `rounded-*` e substituir por `rounded-none`. Substituir `border-white/10` por `border-[var(--pt-gold)]`. Substituir cores de fundo genéricas por `bg-[rgba(255,215,0,0.08)]`. Texto do link em `text-[var(--pt-gold)]`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TypeBadge.tsx src/components/ui/StatBar.tsx src/components/ui/PowerTag.tsx src/components/ui/BuyMeCoffeeLink.tsx
git commit -m "feat: apply Game UI style to UI primitives"
```

---

## Task 6: Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Reescrever page.tsx com grid Pokédex**

```tsx
// src/app/page.tsx
"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { BuyMeCoffeeLink } from "@/components/ui/BuyMeCoffeeLink";

const TOOLS = [
  { href: "/sandwich-builder",  number: "#001", emoji: "🥪",  titleKey: "home.sandwichTitle",    descKey: "home.sandwichDesc" },
  { href: "/ev-pokedex",        number: "#002", emoji: "📖",  titleKey: "home.evPokedexTitle",   descKey: "home.evPokedexDesc" },
  { href: "/ev-tracker",        number: "#003", emoji: "📊",  titleKey: "home.evTrackerTitle",   descKey: "home.evTrackerDesc" },
  { href: "/raid-builder",      number: "#004", emoji: "⚔️",  titleKey: "home.raidBuilderTitle", descKey: "home.raidBuilderDesc" },
  { href: "/nature-calc",       number: "#005", emoji: "🧮",  titleKey: "home.natureCalcTitle",  descKey: "home.natureCalcDesc" },
  { href: "/training-tips",     number: "#006", emoji: "💡",  titleKey: "home.trainingTipsTitle",descKey: "home.trainingTipsDesc" },
  { href: "/comunidade",        number: "#007", emoji: "🌐",  titleKey: "home.comunidadeTitle",  descKey: "home.comunidadeDesc" },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Hero */}
      <div className="mb-12 text-center animate-fade-up">
        <div className="mb-3 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[5px] text-[var(--pt-gold)]">
          ▶ POKÉMON SCARLET &amp; VIOLET
        </div>
        <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-4xl uppercase tracking-[3px] text-[var(--pt-text)] sm:text-5xl">
          POKÉ<span className="text-[var(--pt-gold)]">TRAINER</span>
        </h1>
        <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[var(--pt-gold)] to-transparent" />
        <p className="font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase tracking-[3px] text-[var(--pt-text-dim)]">
          SELECT YOUR TOOL
        </p>
      </div>

      {/* Section label */}
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[4px] text-[var(--pt-gold)]">
        ▶ AVAILABLE TOOLS — 7/8 UNLOCKED
        <div className="h-px flex-1 bg-[var(--pt-border-dim)]" />
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TOOLS.map((tool, i) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="animate-fade-up group relative border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 transition-all hover:border-[rgba(255,215,0,0.5)] hover:bg-[rgba(255,215,0,0.02)]"
            style={{ animationDelay: `${80 + i * 60}ms` }}
          >
            {/* Top accent on hover */}
            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[var(--pt-gold)] to-[var(--pt-orange)] transition-transform duration-300 group-hover:scale-x-100" />

            <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[2px] text-[var(--pt-gold)]">
              {tool.number}
            </div>
            <div className="mb-2 text-2xl">{tool.emoji}</div>
            <div className="mb-1.5 font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase leading-snug tracking-[1px] text-[var(--pt-text)]">
              {t(tool.titleKey)}
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--pt-text-dim)]">
              {t(tool.descKey)}
            </p>
            <div className="mt-3 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[1px] text-[var(--pt-gold)] opacity-0 transition-opacity group-hover:opacity-100">
              ▶ OPEN →
            </div>
          </Link>
        ))}

        {/* Locked slot */}
        <div className="relative border border-dashed border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 opacity-35">
          <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[2px] text-[var(--pt-text-dim)]">
            #???
          </div>
          <div className="mb-2 text-2xl">🔒</div>
          <div className="font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase tracking-[1px] text-[var(--pt-text-dim)]">
            COMING SOON
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-sm text-[var(--pt-text-dim)]">
        {t("kofi.cta")} <BuyMeCoffeeLink variant="inline" />
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verificar no browser** — grid 2/3 colunas com numeração #001–#007, slot locked dashed, hero com cursor e divider

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign homepage with Pokédex grid layout"
```

---

## Task 7: Sandwich Components

**Files:**
- Modify: `src/components/sandwich/SandwichBuilder.tsx`
- Modify: `src/components/sandwich/RecipeCard.tsx`
- Modify: `src/components/sandwich/RecipeDetail.tsx`

- [ ] **Step 1: Atualizar SandwichBuilder.tsx**

Mudanças específicas (não reescrever a lógica):

**Header interno** (linhas 246–259) — substituir:
```tsx
{/* Header */}
<div className="mb-8 text-center">
  <div className="mb-2 text-5xl">🥪</div>
  <h1
    className="mb-1.5 text-3xl font-[family-name:var(--font-syne)] font-extrabold tracking-tight"
    style={{
      background: "linear-gradient(135deg, #F59E0B, #F97316, #EF4444)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      paddingBottom: "0.1em",
    }}
  >
    {t("sandwich.title")}
  </h1>
  <p className="text-sm text-gray-400">{t("sandwich.subtitle")}</p>
</div>
```
Por:
```tsx
{/* Header */}
<div className="mb-8 text-center">
  <div className="mb-1 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[3px] text-[var(--pt-text-dim)]">#001</div>
  <div className="mb-2 text-5xl">🥪</div>
  <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-2xl uppercase tracking-[2px] text-[var(--pt-gold)]">
    {t("sandwich.title")}
  </h1>
  <p className="text-sm text-[var(--pt-text-dim)]">{t("sandwich.subtitle")}</p>
</div>
```

**Tab bar** (linhas 263–287) — substituir container e botões:
```tsx
{/* Tabs */}
<div className="mb-5 flex gap-0 border border-[var(--pt-border-dim)]">
  {tabs.map((tb) => (
    <button
      key={tb.id}
      onClick={() => { setTab(tb.id); setSelectedType(null); setSelectedEntry(null); }}
      className={`flex-1 px-2 py-2.5 text-center text-sm font-bold transition-all border-b-2 ${
        tab === tb.id
          ? "bg-[rgba(255,215,0,0.06)] text-white"
          : "border-transparent text-[var(--pt-text-dim)] hover:text-[var(--pt-text)]"
      }`}
      style={tab === tb.id ? { borderColor: tb.color } : undefined}
    >
      <div className="font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[1px]">{tb.label}</div>
      <div className="text-[10px] font-normal opacity-70">{tb.desc}</div>
    </button>
  ))}
</div>
```

**TypeGuideCard** (linhas 66–160) — substituir className dos containers:
- `rounded-xl border border-white/10 bg-white/5` → `border border-[var(--pt-border-dim)] bg-[var(--pt-card)]`
- `rounded-lg px-2.5 py-1 text-xs font-bold text-white` (type badge inline) → `rounded-sm px-2.5 py-1 text-xs font-bold text-white`
- `rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300` (alt badge) → `border border-[var(--pt-border-dim)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-text-dim)]`
- `rounded-lg border border-white/10 bg-white/5` (inner recipe picker) → `border border-[var(--pt-border-dim)] bg-[var(--pt-card)]`
- `rounded-lg border border-white/10 bg-white/5 p-2.5` (recipe button) → `border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-2.5`
- `rounded bg-yellow-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-yellow-400` (best badge) → `border border-[rgba(255,215,0,0.4)] px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-gold)]`

**Search tab containers** (linhas 325–356):
- `rounded-xl border border-white/10 bg-white/5 p-4` → `border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4`
- `rounded-lg border border-white/10 bg-white/5 px-3 py-2` (selects) → `border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-3 py-2`

**Breeding level badges** (linhas 396–404):
- `rounded-full px-2.5 py-0.5 text-xs font-bold` → remover `rounded-full`, manter padding e font
- `bg-yellow-500/20 text-yellow-400` → `border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]`
- `bg-orange-500/20 text-orange-400` → `border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.08)] text-[var(--pt-orange)]`
- `bg-white/10 text-gray-400` → `border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]`

**Type filter buttons** (linhas 292–319):
- `rounded-full border px-3 py-1` → `border px-3 py-1`

- [ ] **Step 2: Atualizar RecipeCard.tsx**

```tsx
// src/components/sandwich/RecipeCard.tsx
"use client";

import type { SandwichRecipe } from "@/data/sandwich-recipes";
import { TYPE_COLORS } from "@/data/types";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PowerTag } from "@/components/ui/PowerTag";

interface RecipeCardProps {
  recipe: SandwichRecipe;
  onSelect: (recipe: SandwichRecipe) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <button
      onClick={() => onSelect(recipe)}
      className="group relative w-full cursor-pointer overflow-hidden border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = TYPE_COLORS[recipe.type];
        e.currentTarget.style.boxShadow = `0 8px 24px ${TYPE_COLORS[recipe.type]}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--pt-border-dim)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute right-0 top-0 h-20 w-20"
        style={{
          background: `radial-gradient(circle at top right, ${TYPE_COLORS[recipe.type]}15, transparent)`,
        }}
      />
      <div className="mb-2.5 flex items-start justify-between">
        <div>
          <div className="mb-1 text-[15px] font-extrabold text-[var(--pt-text)]">
            {recipe.name}
          </div>
          <TypeBadge type={recipe.type} small />
        </div>
        {recipe.herba.length > 0 && (
          <span className="border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.08)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[1px] text-[var(--pt-gold)]">
            HERBA ×{recipe.herba.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {recipe.powers.map((p, i) => (
          <PowerTag key={i} power={p} />
        ))}
      </div>
    </button>
  );
}
```

- [ ] **Step 3: Ler e atualizar RecipeDetail.tsx**

Aplicar padrões:
- `rounded-*` → `rounded-none` / `rounded-sm`
- `border-white/10` → `border-[var(--pt-border-dim)]`
- `bg-white/5` → `bg-[var(--pt-card)]`
- `text-gray-400/500` → `text-[var(--pt-text-dim)]`
- Headings de seção → `font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]`
- Botão "voltar" → `border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]`

- [ ] **Step 4: Commit**

```bash
git add src/components/sandwich/
git commit -m "feat: apply Game UI style to Sandwich components"
```

---

## Task 8: EV Components

**Files:**
- Modify: `src/components/ev/EVPokedex.tsx`
- Modify: `src/components/ev/PokemonDetailModal.tsx`
- Modify: `src/components/ev/EVTracker.tsx`
- Modify: `src/components/ev/PokemonSlot.tsx`

- [ ] **Step 1: Atualizar EVPokedex.tsx**

**PokemonCard** (linhas 305–383):
```tsx
// Substituir className do card container:
// De:
className="relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/40 hover:bg-white/8"
// Para:
className="relative cursor-pointer overflow-hidden border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 transition-all hover:border-[rgba(255,215,0,0.5)] hover:bg-[rgba(255,215,0,0.02)]"
```

Badges `rounded-full` no PokemonCard:
```tsx
// "best" badge — de:
className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300"
// para:
className="border border-[rgba(255,215,0,0.4)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-gold)]"

// legendary/mythical badges — trocar rounded-full por sem arredondamento, manter cores
className="border border-yellow-500/30 px-2 py-0.5 text-[10px] font-bold text-yellow-400/70"
className="border border-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-400/70"
```

EV yield badges no PokemonCard:
```tsx
// De:
className={`rounded-md px-2 py-0.5 text-xs font-bold ${
  selectedStat === ev.stat ? "bg-violet-500/25 text-violet-300" : "bg-white/10 text-gray-300"
}`}
// Para:
className={`px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase ${
  selectedStat === ev.stat
    ? "border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
    : "border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
}`}
```

**Stat filter buttons** (linhas 148–177):
```tsx
// "All stats" button — de:
className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
  !selectedStat ? "border-white/30 bg-white/15 text-white" : "border-white/10 bg-white/5 text-gray-400"
}`}
// para:
className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-colors ${
  !selectedStat
    ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
    : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"
}`}

// Stat buttons — de:
className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
  selectedStat === stat ? "border-violet-400/50 bg-violet-500/20 text-violet-300" : "border-white/10 bg-white/5 text-gray-400 opacity-70"
}`}
// para:
className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-all ${
  selectedStat === stat
    ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
    : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] opacity-70"
}`}
```

**EV amount + best spot buttons** (linhas 182–208):
```tsx
// EV amount — de:
className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
  selectedAmount === opt.value ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300" : "border-white/10 bg-white/5 text-gray-400 opacity-70"
}`}
// para:
className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-all ${
  selectedAmount === opt.value
    ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
    : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] opacity-70"
}`}

// Best spot button — de:
className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
  showBestOnly ? "border-yellow-400/50 bg-yellow-500/20 text-yellow-300" : "border-white/10 bg-white/5 text-gray-400 opacity-70"
}`}
// para:
className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-all ${
  showBestOnly
    ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
    : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] opacity-70"
}`}
```

**View toggle** (linhas 226–247):
```tsx
// De:
<div className="flex gap-1 rounded-lg bg-white/5 p-0.5">
  <button className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${viewMode === "card" ? "bg-white/10 text-white" : "text-gray-400"}`}>
// Para:
<div className="flex border border-[var(--pt-border-dim)]">
  <button className={`px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-colors ${viewMode === "card" ? "bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"}`}>
```

**PokemonTable** (linhas 388–489):
```tsx
// Container — de:
className="overflow-x-auto rounded-xl border border-white/10"
// para:
className="overflow-x-auto border border-[var(--pt-border-dim)]"

// thead — de:
className="border-b border-white/10 bg-white/5"
// para:
className="border-b border-[var(--pt-border-dim)] bg-[var(--pt-surface)]"

// th — de:
className="px-3 py-2 text-xs font-semibold text-gray-400"
// para:
className="px-3 py-2 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[2px] text-[var(--pt-text-dim)]"

// selected stat th — de:
className={`px-2 py-2 text-center text-xs font-semibold ${selectedStat === stat ? "text-violet-400" : "text-gray-400"}`}
// para:
className={`px-2 py-2 text-center font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[1px] ${selectedStat === stat ? "text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"}`}

// tr hover — de:
className="cursor-pointer border-b border-white/5 transition-colors hover:bg-violet-500/5"
// para:
className="cursor-pointer border-b border-[var(--pt-border-dim)] transition-colors hover:bg-[rgba(255,215,0,0.02)]"

// EV yield badges na tabela — de:
className={`rounded px-1.5 py-0.5 text-xs font-bold ${selectedStat === ev.stat ? "bg-violet-500/25 text-violet-300" : "bg-white/10 text-gray-300"}`}
// para:
className={`px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase ${selectedStat === ev.stat ? "border border-[rgba(255,215,0,0.4)] text-[var(--pt-gold)]" : "border border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"}`}

// stat cells — de:
className={`px-2 py-2 text-center font-mono text-xs ${selectedStat === stat ? "font-bold text-violet-300" : "text-gray-400"}`}
// para:
className={`px-2 py-2 text-center font-[family-name:var(--font-share-tech-mono)] text-[9px] ${selectedStat === stat ? "font-bold text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"}`}
```

- [ ] **Step 2: Atualizar PokemonDetailModal.tsx**

**Modal container** (linha 448):
```tsx
// De:
className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 shadow-2xl"
// Para:
className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-[var(--pt-gold)] bg-[var(--pt-bg)] shadow-2xl"
```

**Close button** (linha 453):
```tsx
// De:
className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1.5 text-gray-400 hover:bg-white/20 hover:text-white"
// Para:
className="absolute right-4 top-4 z-10 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-1.5 text-[var(--pt-text-dim)] hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]"
```

**Shiny toggle button** (linha 474):
```tsx
// De:
className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-all ${shiny ? "border-yellow-400/50 bg-yellow-500/20 text-yellow-300" : "border-white/10 bg-white/5 text-gray-500 hover:text-gray-300"}`}
// Para:
className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[1px] transition-all ${shiny ? "border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]" : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)]"}`}
```

**Legendary/Mythical badges** (linhas 491–499):
```tsx
// De:
className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-bold text-yellow-300"
// Para:
className="border border-[rgba(255,215,0,0.3)] px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-gold)]"

// De:
className="rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-300"
// Para:
className="border border-pink-500/30 px-2 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-pink-300"
```

**Section titles** — `Section` component (linha 331):
```tsx
// De:
<p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
// Para:
<p className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[3px] text-[var(--pt-gold)]">
```

**Body border** (linha 565):
```tsx
// De:
className="space-y-6 border-t border-white/10 p-6"
// Para:
className="space-y-6 border-t border-[var(--pt-border-dim)] p-6"
```

**EV Yield badges** (linha 692–700):
```tsx
// De:
className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-sm font-bold text-emerald-300"
// Para:
className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-[family-name:var(--font-share-tech-mono)] text-[10px] uppercase text-emerald-300"
```

**Ability cards** (linhas 663–686):
```tsx
// De:
className={`flex flex-col rounded-lg border px-3 py-2 ${a.isHidden ? "border-violet-400/30 bg-violet-500/10" : "border-white/10 bg-white/5"}`}
// Para:
className={`flex flex-col border px-3 py-2 ${a.isHidden ? "border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.04)]" : "border-[var(--pt-border-dim)] bg-[var(--pt-card)]"}`}

// HIDDEN badge — de:
className="ml-2 rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-black text-violet-400"
// para:
className="ml-2 border border-[rgba(255,215,0,0.3)] px-1.5 py-0.5 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase text-[var(--pt-gold)]"
```

**EvoSprite** (linha 1029):
```tsx
// De:
className={`flex flex-col items-center gap-1 rounded-xl border p-2 ${active ? "border-violet-500/40 bg-violet-500/10" : "border-white/10 bg-white/5"}`}
// Para:
className={`flex flex-col items-center gap-1 border p-2 ${active ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.06)]" : "border-[var(--pt-border-dim)] bg-[var(--pt-card)]"}`}

// active name — de:
className={`text-[10px] font-semibold capitalize ${active ? "text-violet-300" : "text-gray-400"}`}
// para:
className={`text-[10px] font-semibold capitalize ${active ? "text-[var(--pt-gold)]" : "text-[var(--pt-text-dim)]"}`}
```

**Move badges** (linhas 740–860):
```tsx
// Todos os move span — de:
className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300"
// para:
className="inline-flex items-center gap-1 border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-2 py-1 text-xs text-[var(--pt-text)]"
```

- [ ] **Step 3: Ler e atualizar EVTracker.tsx e PokemonSlot.tsx**

Em **EVTracker.tsx**, aplicar:
- Containers `rounded-*` → sem arredondamento
- `border-white/10` → `border-[var(--pt-border-dim)]`
- `bg-white/5` → `bg-[var(--pt-card)]`
- Select de template: `rounded-lg border border-white/10 bg-white/5` → `border border-[var(--pt-border-dim)] bg-[var(--pt-card)]`
- Heading de seção "Time de treinamento": Share Tech Mono uppercase gold

Em **PokemonSlot.tsx**, aplicar:
- Slot vazio: `border border-dashed border-[var(--pt-border-dim)] bg-[var(--pt-card)]` (borda dashed, consistente com locked slot da homepage)
- Slot com Pokémon: `border border-[var(--pt-gold)] bg-[var(--pt-card)]`
- Botões +/-: `border border-[var(--pt-border-dim)] bg-[var(--pt-card)] hover:border-[var(--pt-gold)] hover:text-[var(--pt-gold)]`
- Botão Reset: sem `rounded-*`

- [ ] **Step 4: Commit**

```bash
git add src/components/ev/
git commit -m "feat: apply Game UI style to EV components"
```

---

## Task 9: Raid Components

**Files:**
- Modify: `src/components/raid/RaidBuildMaker.tsx`
- Modify: `src/components/raid/BuildCard.tsx`
- Modify: `src/components/raid/BuildExport.tsx`

- [ ] **Step 1: Ler os três arquivos**

```bash
# Ler cada arquivo antes de editar
```

- [ ] **Step 2: Aplicar linguagem visual em RaidBuildMaker.tsx, BuildCard.tsx, BuildExport.tsx**

Padrões a aplicar em todos os três:
- `rounded-*` → `rounded-none` ou `rounded-sm`
- `border-white/10` → `border-[var(--pt-border-dim)]`
- `bg-white/5` → `bg-[var(--pt-card)]`
- `text-gray-400/500` → `text-[var(--pt-text-dim)]`
- `border-violet-*` / `bg-violet-*` → substituir por `border-[var(--pt-gold)]` / `bg-[rgba(255,215,0,0.08)]`
- Headings de seção → Share Tech Mono uppercase gold
- Botão Export → `border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] font-[family-name:var(--font-share-tech-mono)] uppercase tracking-[2px] text-[var(--pt-gold)]`
- Selects de Nature/Ability/Item: `border border-[var(--pt-border-dim)] bg-[var(--pt-card)]`

- [ ] **Step 3: Commit**

```bash
git add src/components/raid/
git commit -m "feat: apply Game UI style to Raid components"
```

---

## Task 10: Nature, Training e Legal

**Files:**
- Modify: `src/components/nature/NatureCalc.tsx`
- Modify: `src/components/training/TrainingTips.tsx`
- Modify: `src/components/legal/LegalPageTemplate.tsx`

- [ ] **Step 1: Ler os três arquivos**

- [ ] **Step 2: Atualizar NatureCalc.tsx**

Padrões a aplicar:
- Tabela de natures: `border-white/10` → `border-[var(--pt-border-dim)]`; `bg-white/5` → `bg-[var(--pt-card)]`
- Célula com stat +10%: `bg-emerald-500/15 text-emerald-300` → `bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]`
- Célula com stat -10%: `bg-red-500/15 text-red-300` → `bg-[rgba(255,255,255,0.04)] text-[var(--pt-text-dim)]`
- Célula neutra: `bg-white/3 text-gray-500` → `text-[var(--pt-text-dim)]`
- Heading "Natures": Share Tech Mono uppercase gold
- Botões de seleção: `rounded-full` → sem arredondamento; ativo → `border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]`
- Inputs de stat/level: `border border-[var(--pt-border-dim)] bg-[var(--pt-card)]`
- Botão calcular: `border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] font-[family-name:var(--font-share-tech-mono)] uppercase text-[var(--pt-gold)]`

- [ ] **Step 3: Atualizar TrainingTips.tsx**

Padrões a aplicar:
- Cards de dica: `rounded-*` → sem arredondamento; `border-white/10` → `border-[var(--pt-border-dim)]`; `bg-white/5` → `bg-[var(--pt-card)]`
- Headers de seção: Share Tech Mono uppercase gold com `▶` prefix
- Badges de categoria: sem `rounded-full`, borda dim

- [ ] **Step 4: Atualizar LegalPageTemplate.tsx**

Padrões a aplicar:
- Headers `h1`/`h2`: Share Tech Mono uppercase, cor gold para h1, texto normal para h2
- Containers com `rounded-*` → sem arredondamento

- [ ] **Step 5: Commit final**

```bash
git add src/components/nature/ src/components/training/ src/components/legal/
git commit -m "feat: apply Game UI style to Nature, Training and Legal components"
```

---

## Revisão Final

Após todas as tasks, verificar visualmente:
- [ ] Homepage: grid Pokédex #001–#007 + slot locked dashed
- [ ] Navbar: logo com cursor piscando, border-bottom gold, links retangulares
- [ ] Sandwich Builder: tabs retangulares, cards sem rounded, HerbaBadge mantida
- [ ] EV Pokédex: filtros de stat retangulares gold ativo, cards sem rounded, tabela com borders dim
- [ ] EV Tracker: slots vazios com borda dashed, botões +/- sem rounded
- [ ] Raid Builder: seletores sem rounded, botão export gold
- [ ] Nature Calc: tabela com highlight gold para +10%
- [ ] Cores de tipo (TypeBadge) e cores de stat (StatBar): preservadas e inalteradas
