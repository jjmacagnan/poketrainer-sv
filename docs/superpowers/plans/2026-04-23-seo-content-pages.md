# SEO Content Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 6 bilingual Server Component guide pages (PT + EN) targeting organic search traffic, each with structured JSON-LD, hreflang, and deep-linked CTAs into existing tools.

**Architecture:** Pure Next.js App Router Server Components — no `"use client"`. Content lives in static TypeScript data files under `src/data/guides/`. A single shared `GuidePage` component handles all rendering. Build output is statically cacheable.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, JSON-LD (Article + FAQPage schemas)

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/data/guides/types.ts` | Create | GuideContent, GuideLocale, GuideSection, GuideItem, FAQ, GuideCTA type definitions |
| `src/components/guides/GuidePage.tsx` | Create | Shared Server Component — renders H1, intro, sections, CTA, FAQ, related links, JSON-LD |
| `src/data/guides/sandwich-shiny.ts` | Create | Bilingual content for shiny sandwich guide |
| `src/app/guia-sanduiche-shiny/page.tsx` | Create | PT route — shiny sandwich |
| `src/app/shiny-sandwich-guide/page.tsx` | Create | EN route — shiny sandwich |
| `src/data/guides/ev-spots.ts` | Create | Bilingual content for EV training spots guide |
| `src/app/melhores-spots-ev-sv/page.tsx` | Create | PT route — EV spots |
| `src/app/best-ev-training-spots-sv/page.tsx` | Create | EN route — EV spots |
| `src/data/guides/tera-raid-builds.ts` | Create | Bilingual content for Tera Raid builds guide |
| `src/app/melhores-builds-tera-raid/page.tsx` | Create | PT route — Tera Raid builds |
| `src/app/best-tera-raid-builds/page.tsx` | Create | EN route — Tera Raid builds |
| `src/app/sitemap.ts` | Modify | Add 6 new routes with priority 0.8 |

---

## Task 1: Type Definitions

**Files:**
- Create: `src/data/guides/types.ts`

- [ ] **Step 1: Create the types file**

```ts
// src/data/guides/types.ts

export interface GuideItem {
  name: string;
  detail: string;
  note?: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  body: string;
  items?: GuideItem[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface GuideCTA {
  label: string;
  href: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface GuideLocale {
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  faq: FAQ[];
  cta: GuideCTA;
  relatedLinks: RelatedLink[];
}

export interface GuideContent {
  pt: GuideLocale;
  en: GuideLocale;
}
```

- [ ] **Step 2: Verify the file compiles (no TS errors)**

```bash
cd /Users/jjmacagnan/Development/Jbit/poketrainer-sv && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors about `src/data/guides/types.ts`

- [ ] **Step 3: Commit**

```bash
git add src/data/guides/types.ts
git commit -m "feat(guides): add GuideContent type definitions"
```

---

## Task 2: GuidePage Server Component

**Files:**
- Create: `src/components/guides/GuidePage.tsx`

- [ ] **Step 1: Create the shared Server Component**

```tsx
// src/components/guides/GuidePage.tsx
// No "use client" — pure Server Component for full SEO indexation

import Link from "next/link";
import type { GuideContent } from "@/data/guides/types";

interface GuidePageProps {
  content: GuideContent;
  locale: "pt" | "en";
  ptHref: string;
  enHref: string;
}

export default function GuidePage({ content, locale, ptHref, enHref }: GuidePageProps) {
  const guide = content[locale];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    inLanguage: locale === "pt" ? "pt-BR" : "en",
    publisher: {
      "@type": "Organization",
      name: "PokéTrainer SV",
      url: "https://poketrainer.jbit.app.br",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* JSON-LD structured data — static content from our own data files, safe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Language toggle */}
        <div className="flex gap-3 mb-6 text-sm">
          <Link
            href={ptHref}
            className={locale === "pt" ? "text-yellow-400 font-semibold" : "text-gray-400 hover:text-gray-200"}
          >
            PT-BR
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href={enHref}
            className={locale === "en" ? "text-yellow-400 font-semibold" : "text-gray-400 hover:text-gray-200"}
          >
            EN
          </Link>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
          {guide.title}
        </h1>

        {/* Intro */}
        <div className="text-gray-300 leading-relaxed space-y-4 mb-10">
          {guide.intro.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Sections */}
        {guide.sections.map((section) => (
          <section key={section.id} className="mb-10">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
              {section.heading}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">{section.body}</p>
            {section.items && section.items.length > 0 && (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-yellow-400 font-medium shrink-0">{item.name}:</span>
                    <span className="text-gray-300">{item.detail}</span>
                    {item.note && (
                      <span className="text-gray-500 text-sm ml-1">({item.note})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA Block */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-6 mb-10 text-center">
          <p className="text-gray-300 mb-4 text-lg">
            {locale === "pt"
              ? "Pronto para aplicar? Use nossa ferramenta agora:"
              : "Ready to apply this? Use our tool now:"}
          </p>
          <Link
            href={guide.cta.href}
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            {guide.cta.label}
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            {locale === "pt" ? "Perguntas Frequentes" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {guide.faq.map((item, i) => (
              <details key={i} className="border border-gray-700 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer text-gray-200 font-medium hover:text-white select-none">
                  {item.question}
                </summary>
                <p className="px-4 pb-4 text-gray-400 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related guides */}
        {guide.relatedLinks.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-300 mb-3">
              {locale === "pt" ? "Guias Relacionados" : "Related Guides"}
            </h2>
            <ul className="space-y-2">
              {guide.relatedLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-yellow-400 hover:text-yellow-300 underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors in `src/components/guides/GuidePage.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/guides/GuidePage.tsx
git commit -m "feat(guides): add shared GuidePage Server Component with JSON-LD"
```

---

## Task 3: Shiny Sandwich Guide

**Files:**
- Create: `src/data/guides/sandwich-shiny.ts`
- Create: `src/app/guia-sanduiche-shiny/page.tsx`
- Create: `src/app/shiny-sandwich-guide/page.tsx`

- [ ] **Step 1: Create content data file**

```ts
// src/data/guides/sandwich-shiny.ts
import type { GuideContent } from "./types";

export const sandwichShinyContent: GuideContent = {
  pt: {
    title: "Guia de Sanduíche Shiny Pokémon Scarlet e Violet — Receitas com Sparkling Power",
    description:
      "Aprenda a fazer os melhores sanduíches para aumentar a chance de encontrar Pokémon Shiny em SV. Receitas com Herba Mystica e Sparkling Power Lv. 3 por tipo.",
    intro:
      "Os sanduíches são uma das mecânicas mais poderosas de Pokémon Scarlet e Violet para quem quer aumentar as chances de encontrar Pokémon Shiny. Com a combinação certa de ingredientes e Herba Mystica, você ativa o Meal Power Sparkling, que eleva a taxa de Shiny para o tipo escolhido.\n\nNeste guia você vai encontrar as receitas mais eficientes verificadas pela comunidade, dicas de onde farmar Herba Mystica e como usar o Sandwich Builder para montar sua estratégia de Shiny Hunt.",
    sections: [
      {
        id: "como-funciona",
        heading: "Como funciona o Sparkling Power",
        body: "O Meal Power Sparkling aumenta a taxa de encontros com Pokémon Shiny quando ativado no Nível 3. Para atingir o Lv. 3, a receita precisa de 2x Herba Mystica do mesmo tipo. Cada receita funciona por 30 minutos após comer o sanduíche.",
        items: [
          { name: "Sparkling Lv. 1", detail: "Pequeno aumento de taxa Shiny" },
          { name: "Sparkling Lv. 2", detail: "Aumento moderado" },
          { name: "Sparkling Lv. 3", detail: "Máxima taxa Shiny — o que queremos", note: "Requer 2x Herba Mystica" },
        ],
      },
      {
        id: "receitas-basicas",
        heading: "Receita base para qualquer tipo",
        body: "A fórmula universal é: 1 ingrediente principal + 2x Herba Mystica do mesmo sabor. O ingrediente principal determina o tipo de Pokémon afetado pelo Sparkling Power.",
        items: [
          { name: "Tomate", detail: "Fire-type Sparkling Lv. 3" },
          { name: "Pepino", detail: "Grass-type Sparkling Lv. 3" },
          { name: "Pão de hambúrguer", detail: "Normal-type Sparkling Lv. 3" },
          { name: "Alface", detail: "Bug-type Sparkling Lv. 3" },
          { name: "Queijo", detail: "Electric-type Sparkling Lv. 3" },
        ],
      },
      {
        id: "herba-mystica",
        heading: "Como farmar Herba Mystica",
        body: "Herba Mystica é o ingrediente raro que torna possível o Sparkling Lv. 3. A forma mais eficiente de obter é completando Tera Raids de 5★ e 6★. Cada tipo de Herba Mystica tem raids específicas que a dropam com mais frequência.",
        items: [
          { name: "Sweet Herba Mystica", detail: "Raids de Cetitan, Glalie — tipo Ice" },
          { name: "Salty Herba Mystica", detail: "Raids de Orthworm, Palafin — tipo Steel/Water" },
          { name: "Spicy Herba Mystica", detail: "Raids de Scovillain, Tinkaton" },
          { name: "Bitter Herba Mystica", detail: "Raids de Bronzong, Corviknight" },
          { name: "Sour Herba Mystica", detail: "Raids de Basculegion, Gyarados" },
        ],
      },
      {
        id: "dicas",
        heading: "Dicas para Shiny Hunt eficiente",
        body: "Além do sanduíche, outras técnicas aumentam a probabilidade de Shiny: o Shiny Charm (completar Pokédex regional), fazer picnics repetidos na mesma área e usar o Outbreak Mass para concentrar spawns de um tipo específico.",
        items: [
          { name: "Shiny Charm", detail: "Dobra as chances base — prioritize conseguir" },
          { name: "Mass Outbreak", detail: "Concentra spawns de 1 espécie — combine com sanduíche" },
          { name: "30 minutos", detail: "Duração do sanduíche — planeje seu hunt" },
        ],
      },
    ],
    faq: [
      {
        question: "Preciso de 2x Herba Mystica do mesmo tipo?",
        answer: "Sim. Para atingir Sparkling Power Lv. 3 você precisa de 2 Herba Mystica do mesmo sabor (ex: 2x Sweet Herba). Misturar sabores diferentes não atinge Lv. 3.",
      },
      {
        question: "Quanto tempo dura o efeito do sanduíche?",
        answer: "30 minutos após comer. O timer fica visível no menu de Picnic. Planeje sua hunt para esse janela.",
      },
      {
        question: "Qual é o melhor Herba para Shiny Hunt geral?",
        answer: "Depende do tipo de Pokémon que você quer. Cada tipo precisa de um ingrediente e Herba específicos. Use o Sandwich Builder do PokéTrainer SV para encontrar a receita certa.",
      },
      {
        question: "Posso usar o sanduíche durante Mass Outbreak?",
        answer: "Sim, e é a combinação mais eficiente. Ative o Mass Outbreak de um Pokémon e coma o sanduíche com Sparkling do tipo correspondente para maximizar as chances.",
      },
    ],
    cta: {
      label: "Abrir Sandwich Builder — Modo Shiny Hunt",
      href: "/sandwich-builder?tab=shiny",
    },
    relatedLinks: [
      { label: "Melhores Spots de EV Training em SV", href: "/melhores-spots-ev-sv" },
      { label: "Melhores Builds para Tera Raid", href: "/melhores-builds-tera-raid" },
    ],
  },
  en: {
    title: "Shiny Pokémon Sandwich Guide for Scarlet & Violet — Sparkling Power Recipes",
    description:
      "Learn the best sandwich recipes to boost Shiny Pokémon encounter rates in SV. Herba Mystica combinations for Sparkling Power Lv. 3 by type.",
    intro:
      "Sandwiches are one of the most powerful mechanics in Pokémon Scarlet and Violet for Shiny hunting. With the right ingredient and Herba Mystica combination, you can activate Sparkling Meal Power, which significantly boosts the Shiny encounter rate for a chosen type.\n\nThis guide covers the most efficient community-verified recipes, where to farm Herba Mystica, and how to use the Sandwich Builder tool to plan your Shiny hunt strategy.",
    sections: [
      {
        id: "how-it-works",
        heading: "How Sparkling Power works",
        body: "Sparkling Meal Power boosts the Shiny encounter rate when activated at Level 3. To reach Lv. 3, your recipe needs 2x Herba Mystica of the same flavor. The effect lasts 30 minutes after eating.",
        items: [
          { name: "Sparkling Lv. 1", detail: "Small Shiny rate boost" },
          { name: "Sparkling Lv. 2", detail: "Moderate boost" },
          { name: "Sparkling Lv. 3", detail: "Maximum Shiny rate — what you want", note: "Requires 2x Herba Mystica" },
        ],
      },
      {
        id: "basic-recipes",
        heading: "Base recipe for any type",
        body: "The universal formula is: 1 main ingredient + 2x Herba Mystica of the same flavor. The main ingredient determines which Pokémon type gets the Sparkling Power boost.",
        items: [
          { name: "Tomato", detail: "Fire-type Sparkling Lv. 3" },
          { name: "Cucumber", detail: "Grass-type Sparkling Lv. 3" },
          { name: "Hamburger bun", detail: "Normal-type Sparkling Lv. 3" },
          { name: "Lettuce", detail: "Bug-type Sparkling Lv. 3" },
          { name: "Cheese", detail: "Electric-type Sparkling Lv. 3" },
        ],
      },
      {
        id: "herba-mystica",
        heading: "How to farm Herba Mystica",
        body: "Herba Mystica is the rare ingredient that enables Sparkling Lv. 3. The most reliable source is completing 5★ and 6★ Tera Raids. Each Herba flavor drops from specific raid types more frequently.",
        items: [
          { name: "Sweet Herba Mystica", detail: "Cetitan, Glalie raids (Ice-type)" },
          { name: "Salty Herba Mystica", detail: "Orthworm, Palafin raids (Steel/Water)" },
          { name: "Spicy Herba Mystica", detail: "Scovillain, Tinkaton raids" },
          { name: "Bitter Herba Mystica", detail: "Bronzong, Corviknight raids" },
          { name: "Sour Herba Mystica", detail: "Basculegion, Gyarados raids" },
        ],
      },
      {
        id: "tips",
        heading: "Tips for efficient Shiny hunting",
        body: "Beyond sandwiches, other techniques boost Shiny odds: the Shiny Charm (complete the regional Pokédex), repeated picnics in the same area, and using Mass Outbreaks to concentrate spawns of a specific species.",
        items: [
          { name: "Shiny Charm", detail: "Doubles base odds — get this first" },
          { name: "Mass Outbreak", detail: "Concentrates 1 species — stack with sandwich" },
          { name: "30 minutes", detail: "Sandwich duration — plan your hunt window" },
        ],
      },
    ],
    faq: [
      {
        question: "Do I need 2x Herba Mystica of the same flavor?",
        answer: "Yes. To reach Sparkling Power Lv. 3 you need 2 Herba Mystica of the same flavor (e.g. 2x Sweet Herba). Mixing flavors won't reach Lv. 3.",
      },
      {
        question: "How long does the sandwich effect last?",
        answer: "30 minutes after eating. The timer is visible in the Picnic menu. Plan your hunt around this window.",
      },
      {
        question: "Which is the best Herba for general Shiny hunting?",
        answer: "It depends on the Pokémon type you're hunting. Each type needs a specific ingredient + Herba combination. Use the PokéTrainer SV Sandwich Builder to find the right recipe.",
      },
      {
        question: "Can I use a sandwich during a Mass Outbreak?",
        answer: "Yes, and it's the most efficient combination. Trigger a Mass Outbreak and eat a sandwich with the matching type's Sparkling Power to maximize your odds.",
      },
    ],
    cta: {
      label: "Open Sandwich Builder — Shiny Hunt Mode",
      href: "/sandwich-builder?tab=shiny",
    },
    relatedLinks: [
      { label: "Best EV Training Spots in SV", href: "/best-ev-training-spots-sv" },
      { label: "Best Tera Raid Builds", href: "/best-tera-raid-builds" },
    ],
  },
};
```

- [ ] **Step 2: Create PT route**

```tsx
// src/app/guia-sanduiche-shiny/page.tsx
import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { sandwichShinyContent } from "@/data/guides/sandwich-shiny";

export const metadata: Metadata = {
  title: sandwichShinyContent.pt.title,
  description: sandwichShinyContent.pt.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
      en: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    },
  },
  openGraph: {
    title: sandwichShinyContent.pt.title,
    description: sandwichShinyContent.pt.description,
    url: "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "article",
  },
};

export default function GuiaSanduicheShinyPage() {
  return (
    <GuidePage
      content={sandwichShinyContent}
      locale="pt"
      ptHref="/guia-sanduiche-shiny"
      enHref="/shiny-sandwich-guide"
    />
  );
}
```

- [ ] **Step 3: Create EN route**

```tsx
// src/app/shiny-sandwich-guide/page.tsx
import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { sandwichShinyContent } from "@/data/guides/sandwich-shiny";

export const metadata: Metadata = {
  title: sandwichShinyContent.en.title,
  description: sandwichShinyContent.en.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
      en: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    },
  },
  openGraph: {
    title: sandwichShinyContent.en.title,
    description: sandwichShinyContent.en.description,
    url: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    siteName: "PokéTrainer SV",
    locale: "en_US",
    type: "article",
  },
};

export default function ShinySandwichGuidePage() {
  return (
    <GuidePage
      content={sandwichShinyContent}
      locale="en"
      ptHref="/guia-sanduiche-shiny"
      enHref="/shiny-sandwich-guide"
    />
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors in the new files

- [ ] **Step 5: Commit**

```bash
git add src/data/guides/sandwich-shiny.ts src/app/guia-sanduiche-shiny/page.tsx src/app/shiny-sandwich-guide/page.tsx
git commit -m "feat(guides): add bilingual shiny sandwich guide pages"
```

---

## Task 4: EV Training Spots Guide

**Files:**
- Create: `src/data/guides/ev-spots.ts`
- Create: `src/app/melhores-spots-ev-sv/page.tsx`
- Create: `src/app/best-ev-training-spots-sv/page.tsx`

- [ ] **Step 1: Create content data file**

```ts
// src/data/guides/ev-spots.ts
import type { GuideContent } from "./types";

export const evSpotsContent: GuideContent = {
  pt: {
    title: "Melhores Spots de EV Training em Pokémon Scarlet e Violet",
    description:
      "Guia completo dos melhores locais para treinar EVs em Pokémon SV. Spots por stat (HP, Atk, Def, SpA, SpD, Speed) com Pokémon, localização e dicas de eficiência.",
    intro:
      "EV Training em Pokémon Scarlet e Violet é muito mais rápido do que nas gerações anteriores graças ao sistema de batalha em campo aberto. Em vez de batalhas aleatórias, você pode ir direto ao Pokémon que dá o EV que precisa.\n\nNeste guia você encontra os melhores spots para cada stat, os Pokémon mais eficientes, e como usar Power Items e Pokérus para maximizar o ganho de EVs por batalha.",
    sections: [
      {
        id: "como-funciona",
        heading: "Como funcionam os EVs em SV",
        body: "Cada Pokémon derrotado dá 1-3 EVs em um stat específico. Com Power Item (+8 ao stat do item) e Pokérus (2x total), você pode ganhar até 22 EVs por batalha. O limite é 252 por stat e 510 total.",
        items: [
          { name: "Yield base", detail: "1-3 EVs dependendo do Pokémon" },
          { name: "Power Item", detail: "+8 ao stat do item (não stacks com Macho Brace)" },
          { name: "Pokérus", detail: "2x total (stacks com Power Item)" },
          { name: "Vitaminas", detail: "+10 EVs instantâneos (até 100 por stat)" },
        ],
      },
      {
        id: "speed",
        heading: "Speed EV — Melhor Spot",
        body: "Para Speed EVs, o melhor spot é Tagtree Thicket (região leste), onde Flittle e Espathra spawnão em grande quantidade. Ambos dão 1 EV de Speed. Com Koraidon/Miraidon e o Let's Go mode, você pode fazer batalhas automáticas muito rapidamente.",
        items: [
          { name: "Flittle", detail: "1 Speed EV — South Province Area Five" },
          { name: "Espathra", detail: "2 Speed EV — Area Zero / Tagtree Thicket" },
          { name: "Rookidee", detail: "1 Speed EV — South Province Area One (início do jogo)" },
        ],
      },
      {
        id: "attack",
        heading: "Attack EV — Melhor Spot",
        body: "Para Attack EVs, Yungoos e Gumshoos na West Province Area Three são os mais fáceis de encontrar em quantidade. No pós-jogo, Tauros na mesma área é ainda mais eficiente.",
        items: [
          { name: "Yungoos", detail: "1 Atk EV — West Province Area Three" },
          { name: "Gumshoos", detail: "2 Atk EV — West Province Area Three" },
          { name: "Tauros", detail: "1 Atk EV — West Province Area Three (alto nível)" },
        ],
      },
      {
        id: "special-attack",
        heading: "Special Attack EV — Melhor Spot",
        body: "Gastly e Haunter em Alfornada Cavern ou nas ruínas são os melhores para Special Attack EVs. Alternativa: Flaaffy e Electabuzz na East Province.",
        items: [
          { name: "Gastly", detail: "1 SpA EV — Alfornada Cavern" },
          { name: "Haunter", detail: "2 SpA EV — Alfornada Cavern / ruins" },
          { name: "Flaaffy", detail: "2 SpA EV — East Province Area Two" },
        ],
      },
      {
        id: "hp",
        heading: "HP EV — Melhor Spot",
        body: "Dunsparce e Dundunsparce são os melhores para HP EVs no pós-jogo, abundantes em East Province Area Three. Alternativa acessível: Azurill/Marill na costa.",
        items: [
          { name: "Dunsparce", detail: "1 HP EV — East Province Area Three" },
          { name: "Azurill", detail: "1 HP EV — Costa sul" },
          { name: "Marill", detail: "2 HP EV — Próximo a corpos d'água" },
        ],
      },
      {
        id: "defense",
        heading: "Defense EV — Melhor Spot",
        body: "Nacli e Naclstack em West Province Area One e Asado Desert são os mais eficientes para Defense EVs, com yields de 1-2.",
        items: [
          { name: "Nacli", detail: "1 Def EV — West Province Area One" },
          { name: "Naclstack", detail: "2 Def EV — Asado Desert" },
          { name: "Orthworm", detail: "2 Def EV — East Province Area Three" },
        ],
      },
      {
        id: "special-defense",
        heading: "Special Defense EV — Melhor Spot",
        body: "Tentacool e Tentacruel no oceano são os clássicos para SpDef. No pós-jogo, Ditto em West Province Area Two também dá SpDef EVs.",
        items: [
          { name: "Tentacool", detail: "1 SpD EV — oceano (qualquer área costeira)" },
          { name: "Tentacruel", detail: "2 SpD EV — oceano profundo" },
          { name: "Ditto", detail: "1 SpD EV — West Province Area Two" },
        ],
      },
    ],
    faq: [
      {
        question: "Posso usar vitaminas para pular o EV farming?",
        answer: "Sim, mas só até 100 EVs por stat. Para chegar ao máximo (252), você ainda precisará derrotar Pokémon para os últimos 152 EVs. Vitaminas são caras — use com moderação.",
      },
      {
        question: "Let's Go mode conta para EVs?",
        answer: "Sim! Batalhas automáticas no Let's Go mode contam para EVs normalmente. É a forma mais rápida de EV training em SV.",
      },
      {
        question: "Power Item e Pokérus stackam?",
        answer: "Sim. Com Power Item (+8) e Pokérus (2x), a fórmula é: (yield base + 8) × 2. Para um Pokémon com 1 EV base, você ganha 18 EVs por batalha.",
      },
      {
        question: "Como reseto os EVs de um Pokémon?",
        answer: "Use Feathers (EV-lowering items) encontrados na praia ou bagas específicas. No pós-jogo, é mais prático treinar um novo Pokémon do que resetar.",
      },
    ],
    cta: {
      label: "Abrir EV Pokédex — Filtrar por Stat",
      href: "/ev-pokedex?stat=spe",
    },
    relatedLinks: [
      { label: "Guia de Sanduíche Shiny", href: "/guia-sanduiche-shiny" },
      { label: "Melhores Builds para Tera Raid", href: "/melhores-builds-tera-raid" },
    ],
  },
  en: {
    title: "Best EV Training Spots in Pokémon Scarlet and Violet",
    description:
      "Complete guide to the best EV training locations in Pokémon SV. Spots by stat (HP, Atk, Def, SpA, SpD, Speed) with Pokémon, location, and efficiency tips.",
    intro:
      "EV training in Pokémon Scarlet and Violet is much faster than in previous generations thanks to the open-world battle system. Instead of random encounters, you can walk directly to whichever Pokémon yields the stat you need.\n\nThis guide covers the best spots for each stat, the most efficient Pokémon to target, and how to use Power Items and Pokérus to maximize EVs gained per battle.",
    sections: [
      {
        id: "how-it-works",
        heading: "How EVs work in SV",
        body: "Each defeated Pokémon grants 1-3 EVs in a specific stat. With a Power Item (+8 to the item's stat) and Pokérus (2x total), you can gain up to 22 EVs per battle. The cap is 252 per stat and 510 total.",
        items: [
          { name: "Base yield", detail: "1-3 EVs depending on the Pokémon" },
          { name: "Power Item", detail: "+8 to the item's stat (doesn't stack with Macho Brace)" },
          { name: "Pokérus", detail: "2x total (stacks with Power Item)" },
          { name: "Vitamins", detail: "+10 EVs instantly (up to 100 per stat)" },
        ],
      },
      {
        id: "speed",
        heading: "Speed EV — Best Spot",
        body: "For Speed EVs, Tagtree Thicket (eastern region) is the top spot where Flittle and Espathra spawn in large numbers. Both yield Speed EVs. With Let's Go mode, you can chain battles automatically at high speed.",
        items: [
          { name: "Flittle", detail: "1 Speed EV — South Province Area Five" },
          { name: "Espathra", detail: "2 Speed EV — Area Zero / Tagtree Thicket" },
          { name: "Rookidee", detail: "1 Speed EV — South Province Area One (early game)" },
        ],
      },
      {
        id: "attack",
        heading: "Attack EV — Best Spot",
        body: "For Attack EVs, Yungoos and Gumshoos in West Province Area Three are plentiful and easy to farm. In the post-game, Tauros in the same area is even more efficient.",
        items: [
          { name: "Yungoos", detail: "1 Atk EV — West Province Area Three" },
          { name: "Gumshoos", detail: "2 Atk EV — West Province Area Three" },
          { name: "Tauros", detail: "1 Atk EV — West Province Area Three (high level)" },
        ],
      },
      {
        id: "special-attack",
        heading: "Special Attack EV — Best Spot",
        body: "Gastly and Haunter in Alfornada Cavern or the ruins are the go-to for Special Attack EVs. Alternative: Flaaffy and Electabuzz in East Province.",
        items: [
          { name: "Gastly", detail: "1 SpA EV — Alfornada Cavern" },
          { name: "Haunter", detail: "2 SpA EV — Alfornada Cavern / ruins" },
          { name: "Flaaffy", detail: "2 SpA EV — East Province Area Two" },
        ],
      },
      {
        id: "hp",
        heading: "HP EV — Best Spot",
        body: "Dunsparce and Dundunsparce are the best HP EV sources in the post-game, found abundantly in East Province Area Three. Early-game alternative: Azurill/Marill along the coast.",
        items: [
          { name: "Dunsparce", detail: "1 HP EV — East Province Area Three" },
          { name: "Azurill", detail: "1 HP EV — Southern coast" },
          { name: "Marill", detail: "2 HP EV — Near bodies of water" },
        ],
      },
      {
        id: "defense",
        heading: "Defense EV — Best Spot",
        body: "Nacli and Naclstack in West Province Area One and Asado Desert are the most efficient for Defense EVs, with yields of 1-2.",
        items: [
          { name: "Nacli", detail: "1 Def EV — West Province Area One" },
          { name: "Naclstack", detail: "2 Def EV — Asado Desert" },
          { name: "Orthworm", detail: "2 Def EV — East Province Area Three" },
        ],
      },
      {
        id: "special-defense",
        heading: "Special Defense EV — Best Spot",
        body: "Tentacool and Tentacruel in the ocean are the classic SpDef spots. Post-game, Ditto in West Province Area Two also yields SpDef EVs.",
        items: [
          { name: "Tentacool", detail: "1 SpD EV — ocean (any coastal area)" },
          { name: "Tentacruel", detail: "2 SpD EV — deep ocean" },
          { name: "Ditto", detail: "1 SpD EV — West Province Area Two" },
        ],
      },
    ],
    faq: [
      {
        question: "Can I use vitamins to skip EV farming?",
        answer: "Yes, but only up to 100 EVs per stat. To reach the max (252), you still need to battle Pokémon for the remaining 152 EVs. Vitamins are expensive — use them strategically.",
      },
      {
        question: "Does Let's Go mode count for EVs?",
        answer: "Yes! Auto-battles in Let's Go mode count for EVs normally. It's the fastest EV training method in SV.",
      },
      {
        question: "Do Power Item and Pokérus stack?",
        answer: "Yes. With Power Item (+8) and Pokérus (2x), the formula is: (base yield + 8) × 2. For a Pokémon with 1 base EV yield, you gain 18 EVs per battle.",
      },
      {
        question: "How do I reset a Pokémon's EVs?",
        answer: "Use EV-lowering Feathers found on beaches, or specific berries. In the post-game, it's often faster to train a new Pokémon than to fully reset EVs.",
      },
    ],
    cta: {
      label: "Open EV Pokédex — Filter by Stat",
      href: "/ev-pokedex?stat=spe",
    },
    relatedLinks: [
      { label: "Shiny Pokémon Sandwich Guide", href: "/shiny-sandwich-guide" },
      { label: "Best Tera Raid Builds", href: "/best-tera-raid-builds" },
    ],
  },
};
```

- [ ] **Step 2: Create PT route**

```tsx
// src/app/melhores-spots-ev-sv/page.tsx
import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { evSpotsContent } from "@/data/guides/ev-spots";

export const metadata: Metadata = {
  title: evSpotsContent.pt.title,
  description: evSpotsContent.pt.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
      en: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    },
  },
  openGraph: {
    title: evSpotsContent.pt.title,
    description: evSpotsContent.pt.description,
    url: "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "article",
  },
};

export default function MelhoresSpotsEvPage() {
  return (
    <GuidePage
      content={evSpotsContent}
      locale="pt"
      ptHref="/melhores-spots-ev-sv"
      enHref="/best-ev-training-spots-sv"
    />
  );
}
```

- [ ] **Step 3: Create EN route**

```tsx
// src/app/best-ev-training-spots-sv/page.tsx
import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { evSpotsContent } from "@/data/guides/ev-spots";

export const metadata: Metadata = {
  title: evSpotsContent.en.title,
  description: evSpotsContent.en.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
      en: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    },
  },
  openGraph: {
    title: evSpotsContent.en.title,
    description: evSpotsContent.en.description,
    url: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    siteName: "PokéTrainer SV",
    locale: "en_US",
    type: "article",
  },
};

export default function BestEvTrainingSpotsPage() {
  return (
    <GuidePage
      content={evSpotsContent}
      locale="en"
      ptHref="/melhores-spots-ev-sv"
      enHref="/best-ev-training-spots-sv"
    />
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 5: Commit**

```bash
git add src/data/guides/ev-spots.ts src/app/melhores-spots-ev-sv/page.tsx src/app/best-ev-training-spots-sv/page.tsx
git commit -m "feat(guides): add bilingual EV training spots guide pages"
```

---

## Task 5: Tera Raid Builds Guide

**Files:**
- Create: `src/data/guides/tera-raid-builds.ts`
- Create: `src/app/melhores-builds-tera-raid/page.tsx`
- Create: `src/app/best-tera-raid-builds/page.tsx`

- [ ] **Step 1: Create content data file**

```ts
// src/data/guides/tera-raid-builds.ts
import type { GuideContent } from "./types";

export const teraRaidBuildsContent: GuideContent = {
  pt: {
    title: "Melhores Builds para Tera Raid em Pokémon Scarlet e Violet",
    description:
      "Guia das melhores builds para Tera Raids 5★, 6★ e 7★ em SV. Pokémon, moves, EVs e estratégias para todas as raids, incluindo raids de eventos especiais.",
    intro:
      "As Tera Raids de alto nível em Pokémon Scarlet e Violet exigem builds otimizadas para superar a dificuldade e os mecanismos especiais dos bosses. Uma build bem montada pode fazer a diferença entre falhar em raids 6★ e 7★ e completar rapidamente com qualquer time.\n\nNeste guia você encontra as builds mais eficientes para diferentes papéis (DPS, suporte, buff), com EVs, moves e estratégias explicadas. Use o Raid Builder do PokéTrainer SV para montar e compartilhar suas builds.",
    sections: [
      {
        id: "como-funcionam",
        heading: "Como funcionam as Tera Raids de alto nível",
        body: "Raids 5★, 6★ e 7★ têm mecânicas especiais: o boss tem escudo de Tera que reduz dano até ser quebrado, pode remover buffs do time, e às vezes reverte para nivel base quando recebe muito dano de uma vez. Estratégias de suporte e timing de dano são fundamentais.",
        items: [
          { name: "Escudo Tera", detail: "Reduz dano significativamente — quebre primeiro com moves focados" },
          { name: "Buff removal", detail: "Boss pode limpar Swords Dance, Nasty Plot, etc." },
          { name: "Timer", detail: "Limite de turnos — builds de burst DPS são preferíveis" },
          { name: "Cheers", detail: "Use Cheer (Yell) para curar HP, boost de Atk, ou boost de Def do time" },
        ],
      },
      {
        id: "iron-hands",
        heading: "Iron Hands — Build DPS Universal",
        body: "Iron Hands é o Pokémon mais versátil para Tera Raids graças ao Belly Drum + Drain Punch. Com Tera Electric e Thunder Punch, também funciona contra Water/Flying bosses. É a escolha segura para qualquer raid de 6★.",
        items: [
          { name: "Ability", detail: "Quark Drive" },
          { name: "Item", detail: "Punching Glove" },
          { name: "Tera Type", detail: "Electric ou Fighting" },
          { name: "Moves", detail: "Belly Drum / Drain Punch / Thunder Punch / Ice Punch" },
          { name: "EVs", detail: "252 HP / 252 Atk / 4 Def — Adamant" },
          { name: "Estratégia", detail: "Belly Drum no turno 1, Drain Punch para sustain" },
        ],
      },
      {
        id: "flutter-mane",
        heading: "Flutter Mane — Build DPS Especial",
        body: "Flutter Mane é o melhor Special Attacker para raids graças a Protosynthesis e ao enorme Special Attack base. Com Nasty Plot e Moonblast/Shadow Ball, capaz de one-shot bosses em raids 7★ com suporte adequado.",
        items: [
          { name: "Ability", detail: "Protosynthesis (Booster Energy)" },
          { name: "Item", detail: "Booster Energy" },
          { name: "Tera Type", detail: "Fairy ou Ghost" },
          { name: "Moves", detail: "Nasty Plot / Moonblast / Shadow Ball / Mystical Fire" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid ou Modest" },
          { name: "Estratégia", detail: "Nasty Plot +2 antes de atacar, Booster Energy ativa na entrada" },
        ],
      },
      {
        id: "miraidon",
        heading: "Miraidon — Build exclusiva de SV",
        body: "Miraidon com Tera Electric e Hadron Engine é devastador contra qualquer boss que não resiste Electric. Electric Terrain + Parabolic Charge para healing enquanto causa dano massivo.",
        items: [
          { name: "Ability", detail: "Hadron Engine (ativa Electric Terrain)" },
          { name: "Item", detail: "Booster Energy" },
          { name: "Tera Type", detail: "Electric" },
          { name: "Moves", detail: "Parabolic Charge / Electro Drift / Dragon Pulse / Calm Mind" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid" },
          { name: "Estratégia", detail: "Hadron Engine ativa automaticamente, basta atacar com Electro Drift" },
        ],
      },
      {
        id: "suporte",
        heading: "Builds de Suporte para Raids em Grupo",
        body: "Em raids multiplayer, um Pokémon de suporte que buffa o time inteiro é extremamente valioso. Grimmsnarl com Reflect/Light Screen, ou Blissey com Helping Hand e Heal Pulse são os mais populares.",
        items: [
          { name: "Grimmsnarl", detail: "Prankster + Reflect/Light Screen/Thunder Wave" },
          { name: "Blissey", detail: "Helping Hand + Heal Pulse + Soft-Boiled" },
          { name: "Torkoal", detail: "Drought + Sunny Day para boostar Flutter Mane" },
        ],
      },
    ],
    faq: [
      {
        question: "Preciso ter Miraidon/Koraidon para Tera Raids difíceis?",
        answer: "Não. Iron Hands e Flutter Mane são as melhores opções para 6★ e muitos eventos 7★. Miraidon/Koraidon são excelentes mas não obrigatórios.",
      },
      {
        question: "Como funciona o Belly Drum em raid?",
        answer: "Belly Drum corta o HP para 50% e maximiza o Atk (+6 stages). Em raids, o Pokémon tem Drain Punch para recuperar HP enquanto ataca. A estratégia funciona melhor quando o boss não remove buffs.",
      },
      {
        question: "Posso usar qualquer Tera Type?",
        answer: "O Tera Type afeta quais moves ganham o bônus de STAB. Idealmente, use um Tera Type que corresponda ao seu move de ataque principal para maximizar dano.",
      },
      {
        question: "Raids online exigem builds específicas?",
        answer: "Raids públicas (online com desconhecidos) são mais tolerantes. Para raids de eventos 7★, especialmente nos primeiros dias, builds otimizadas como Iron Hands ou Flutter Mane fazem grande diferença.",
      },
    ],
    cta: {
      label: "Abrir Raid Builder — Monte sua Build",
      href: "/raid-builder",
    },
    relatedLinks: [
      { label: "Guia de Sanduíche Shiny", href: "/guia-sanduiche-shiny" },
      { label: "Melhores Spots de EV Training", href: "/melhores-spots-ev-sv" },
    ],
  },
  en: {
    title: "Best Tera Raid Builds for Pokémon Scarlet and Violet",
    description:
      "Guide to the best builds for 5★, 6★, and 7★ Tera Raids in SV. Pokémon, moves, EVs, and strategies for all raids including special event raids.",
    intro:
      "High-level Tera Raids in Pokémon Scarlet and Violet demand optimized builds to overcome tough bosses and their special mechanics. A well-built team can be the difference between repeatedly failing 6★ and 7★ raids and breezing through them.\n\nThis guide covers the most efficient builds for different roles (DPS, support, buff), including EVs, moves, and strategies. Use the PokéTrainer SV Raid Builder to assemble and share your builds.",
    sections: [
      {
        id: "how-raids-work",
        heading: "How high-level Tera Raids work",
        body: "5★, 6★, and 7★ raids have special mechanics: the boss has a Tera Shield that reduces damage until broken, can remove team buffs, and sometimes reverts stats when taking too much burst damage. Support timing and damage sequencing are critical.",
        items: [
          { name: "Tera Shield", detail: "Significantly reduces damage — break it first with focused moves" },
          { name: "Buff removal", detail: "Boss can clear Swords Dance, Nasty Plot, etc." },
          { name: "Turn timer", detail: "Limited turns — burst DPS builds are preferred" },
          { name: "Cheers", detail: "Yell to heal HP, boost team Atk, or boost team Def" },
        ],
      },
      {
        id: "iron-hands",
        heading: "Iron Hands — Universal DPS Build",
        body: "Iron Hands is the most versatile Tera Raid Pokémon thanks to Belly Drum + Drain Punch. With Tera Electric and Thunder Punch, it also handles Water/Flying bosses. It's the safe pick for any 6★ raid.",
        items: [
          { name: "Ability", detail: "Quark Drive" },
          { name: "Item", detail: "Punching Glove" },
          { name: "Tera Type", detail: "Electric or Fighting" },
          { name: "Moves", detail: "Belly Drum / Drain Punch / Thunder Punch / Ice Punch" },
          { name: "EVs", detail: "252 HP / 252 Atk / 4 Def — Adamant" },
          { name: "Strategy", detail: "Belly Drum turn 1, Drain Punch for sustain" },
        ],
      },
      {
        id: "flutter-mane",
        heading: "Flutter Mane — Special DPS Build",
        body: "Flutter Mane is the best Special Attacker for raids thanks to Protosynthesis and an enormous Special Attack base. With Nasty Plot and Moonblast/Shadow Ball, it can one-shot bosses in 7★ raids with proper support.",
        items: [
          { name: "Ability", detail: "Protosynthesis (Booster Energy)" },
          { name: "Item", detail: "Booster Energy" },
          { name: "Tera Type", detail: "Fairy or Ghost" },
          { name: "Moves", detail: "Nasty Plot / Moonblast / Shadow Ball / Mystical Fire" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid or Modest" },
          { name: "Strategy", detail: "Nasty Plot +2 before attacking, Booster Energy activates on entry" },
        ],
      },
      {
        id: "miraidon",
        heading: "Miraidon — SV-exclusive build",
        body: "Miraidon with Tera Electric and Hadron Engine is devastating against any boss that doesn't resist Electric. Electric Terrain + Parabolic Charge provides healing while dealing massive damage.",
        items: [
          { name: "Ability", detail: "Hadron Engine (activates Electric Terrain)" },
          { name: "Item", detail: "Booster Energy" },
          { name: "Tera Type", detail: "Electric" },
          { name: "Moves", detail: "Parabolic Charge / Electro Drift / Dragon Pulse / Calm Mind" },
          { name: "EVs", detail: "252 SpA / 252 Spe / 4 HP — Timid" },
          { name: "Strategy", detail: "Hadron Engine activates automatically; just spam Electro Drift" },
        ],
      },
      {
        id: "support",
        heading: "Support Builds for Multiplayer Raids",
        body: "In multiplayer raids, a support Pokémon that buffs the entire team is extremely valuable. Grimmsnarl with Reflect/Light Screen, or Blissey with Helping Hand and Heal Pulse are the most popular choices.",
        items: [
          { name: "Grimmsnarl", detail: "Prankster + Reflect/Light Screen/Thunder Wave" },
          { name: "Blissey", detail: "Helping Hand + Heal Pulse + Soft-Boiled" },
          { name: "Torkoal", detail: "Drought + Sunny Day to boost Flutter Mane" },
        ],
      },
    ],
    faq: [
      {
        question: "Do I need Miraidon or Koraidon for hard Tera Raids?",
        answer: "No. Iron Hands and Flutter Mane are the top picks for 6★ and many 7★ events. Miraidon/Koraidon are excellent but not required.",
      },
      {
        question: "How does Belly Drum work in a raid?",
        answer: "Belly Drum cuts HP to 50% and maximizes Atk (+6 stages). In raids, you use Drain Punch to recover HP while attacking. The strategy works best when the boss doesn't clear buffs.",
      },
      {
        question: "Can I use any Tera Type?",
        answer: "Tera Type affects which moves get the STAB bonus. Ideally, match your Tera Type to your primary attacking move to maximize damage.",
      },
      {
        question: "Do online raids require specific builds?",
        answer: "Public raids (online with strangers) are more forgiving. For 7★ event raids — especially in the first few days — optimized builds like Iron Hands or Flutter Mane make a big difference.",
      },
    ],
    cta: {
      label: "Open Raid Builder — Build Your Team",
      href: "/raid-builder",
    },
    relatedLinks: [
      { label: "Shiny Pokémon Sandwich Guide", href: "/shiny-sandwich-guide" },
      { label: "Best EV Training Spots in SV", href: "/best-ev-training-spots-sv" },
    ],
  },
};
```

- [ ] **Step 2: Create PT route**

```tsx
// src/app/melhores-builds-tera-raid/page.tsx
import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { teraRaidBuildsContent } from "@/data/guides/tera-raid-builds";

export const metadata: Metadata = {
  title: teraRaidBuildsContent.pt.title,
  description: teraRaidBuildsContent.pt.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
      en: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    },
  },
  openGraph: {
    title: teraRaidBuildsContent.pt.title,
    description: teraRaidBuildsContent.pt.description,
    url: "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "article",
  },
};

export default function MelhoresBuildsTeraRaidPage() {
  return (
    <GuidePage
      content={teraRaidBuildsContent}
      locale="pt"
      ptHref="/melhores-builds-tera-raid"
      enHref="/best-tera-raid-builds"
    />
  );
}
```

- [ ] **Step 3: Create EN route**

```tsx
// src/app/best-tera-raid-builds/page.tsx
import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { teraRaidBuildsContent } from "@/data/guides/tera-raid-builds";

export const metadata: Metadata = {
  title: teraRaidBuildsContent.en.title,
  description: teraRaidBuildsContent.en.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
      en: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    },
  },
  openGraph: {
    title: teraRaidBuildsContent.en.title,
    description: teraRaidBuildsContent.en.description,
    url: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    siteName: "PokéTrainer SV",
    locale: "en_US",
    type: "article",
  },
};

export default function BestTeraRaidBuildsPage() {
  return (
    <GuidePage
      content={teraRaidBuildsContent}
      locale="en"
      ptHref="/melhores-builds-tera-raid"
      enHref="/best-tera-raid-builds"
    />
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 5: Commit**

```bash
git add src/data/guides/tera-raid-builds.ts src/app/melhores-builds-tera-raid/page.tsx src/app/best-tera-raid-builds/page.tsx
git commit -m "feat(guides): add bilingual Tera Raid builds guide pages"
```

---

## Task 6: Sitemap Update

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Read the current sitemap**

```bash
cat src/app/sitemap.ts
```

- [ ] **Step 2: Add 6 new guide routes**

Locate the existing route entries array and append these 6 entries (adjust the exact code to match the existing style):

```ts
// Add inside the routes array (or equivalent structure):
{
  url: "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
{
  url: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
{
  url: "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
{
  url: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
{
  url: "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
{
  url: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
```

- [ ] **Step 3: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add 6 guide routes to sitemap"
```

---

## Self-Review

**Spec coverage check:**
- Types file (Task 1) ✅ — `GuideContent`, `GuideLocale`, `GuideSection`, `GuideItem`, `FAQ`, `GuideCTA` — all defined. Added `RelatedLink` (needed by GuidePage but listed as cross-links in spec).
- `GuidePage` Server Component (Task 2) ✅ — H1, intro, sections, CTA block, FAQ as `<details>`, related guides, JSON-LD (Article + FAQPage), language toggle, no `"use client"`.
- Shiny sandwich routes PT + EN (Task 3) ✅ — with full content, metadata, alternates.
- EV spots routes PT + EN (Task 4) ✅ — with full content, metadata, alternates.
- Tera Raid builds routes PT + EN (Task 5) ✅ — with full content, metadata, alternates.
- Sitemap update (Task 6) ✅ — 6 new routes, `priority: 0.8`, `changeFrequency: "monthly"`.
- CTA deep links ✅ — `/sandwich-builder?tab=shiny`, `/ev-pokedex?stat=spe`, `/raid-builder`.
- JSON-LD Article + FAQPage ✅ — both in GuidePage.tsx.
- `alternates.languages` hreflang ✅ — in every page.tsx.
- OpenGraph metadata ✅ — in every page.tsx.

**Placeholder scan:** No TBD, no TODO, no "add appropriate handling", no incomplete steps.

**Type consistency:** `GuideContent`, `GuideLocale`, `GuideSection`, `GuideItem`, `FAQ`, `GuideCTA`, `RelatedLink` — defined in Task 1, used consistently across Tasks 2-5. `content[locale]` accesses `GuideLocale` correctly. `relatedLinks` added to `GuideLocale` interface — all content files include it.
