# SEO Content Pages — Design Spec

## Goal

Create bilingual (PT-BR + EN) content pages optimized for organic search traffic. Each page targets a specific keyword cluster, contains editorial content, and integrates with an existing tool via a deep-linked CTA.

## Architecture

### Routes

6 new App Router routes — 3 PT + 3 EN:

| Topic | PT route | EN route |
|-------|----------|----------|
| Shiny sandwich guide | `/guia-sanduiche-shiny` | `/shiny-sandwich-guide` |
| EV training spots | `/melhores-spots-ev-sv` | `/best-ev-training-spots-sv` |
| Tera Raid builds | `/melhores-builds-tera-raid` | `/best-tera-raid-builds` |

PT and EN routes are separate files that import the same `GuidePage` component, passing `locale="pt"` or `locale="en"`.

### Server Components

All 6 pages are **pure Server Components** (no `"use client"`). This ensures full indexation by search engines. No client-side state on the guide pages themselves — interactivity lives in the linked tools.

### Data Layer

Guide content lives in `/src/data/guides/`. One file per topic, exporting a `GuideContent` object with `pt` and `en` keys. Updating content is a PR — no CMS or database needed. Build output is static (Vercel edge cache).

---

## Data Types

```ts
// src/data/guides/types.ts

export interface GuideItem {
  name: string;
  detail: string;   // e.g., ingredient name, Pokémon name, move name
  note?: string;    // optional extra context
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
  href: string;     // deep link into a tool, e.g., /sandwich-builder?tab=shiny
}

export interface GuideLocale {
  title: string;        // used in <h1> and metadata title
  description: string;  // used in metadata description
  intro: string;        // 2-3 paragraph intro text
  sections: GuideSection[];
  faq: FAQ[];
  cta: GuideCTA;
}

export interface GuideContent {
  pt: GuideLocale;
  en: GuideLocale;
}
```

Guide data files:
- `src/data/guides/types.ts` — type definitions above
- `src/data/guides/sandwich-shiny.ts` — exports `GuideContent`
- `src/data/guides/ev-spots.ts` — exports `GuideContent`
- `src/data/guides/tera-raid-builds.ts` — exports `GuideContent`

---

## Page Structure

Each guide page renders in this order:

1. **H1** — `guideLocale.title` (keyword-rich)
2. **Intro** — `guideLocale.intro` (2-3 paragraphs, rendered as HTML paragraphs)
3. **Sections** — for each `GuideSection`:
   - H2 heading
   - Body paragraph
   - Optional items list/table
4. **CTA block** — prominent card linking to the relevant tool with pre-applied filters
5. **FAQ** — accordion or static Q&A, rendered as `<details><summary>` for zero JS
6. **Related guides** — cross-links to the other 5 guide pages

### CTA Deep Links

| Guide | CTA href |
|-------|----------|
| Shiny sandwich (PT) | `/sandwich-builder?tab=shiny` |
| Shiny sandwich (EN) | `/sandwich-builder?tab=shiny` |
| EV spots (PT) | `/ev-pokedex?stat=spe` (default to Speed as most searched) |
| EV spots (EN) | `/ev-pokedex?stat=spe` |
| Tera Raid builds (PT) | `/raid-builder` |
| Tera Raid builds (EN) | `/raid-builder` |

---

## SEO Metadata

Each page exports `metadata` with:

```ts
export const metadata: Metadata = {
  title: guideLocale.title,
  description: guideLocale.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/<route>",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/<pt-route>",
      "en":    "https://poketrainer.jbit.app.br/<en-route>",
    },
  },
  openGraph: {
    title: guideLocale.title,
    description: guideLocale.description,
    url: "https://poketrainer.jbit.app.br/<route>",
    siteName: "PokéTrainer SV",
    locale: locale === "pt" ? "pt_BR" : "en_US",
    type: "article",
  },
};
```

### JSON-LD

Each page includes two JSON-LD blocks injected via a plain `<script type="application/ld+json">` tag in the Server Component JSX (not Next.js `<Script>` — that's for client-side scripts):

1. **Article** schema — title, description, datePublished, url
2. **FAQPage** schema — built from `guideLocale.faq`

---

## Shared GuidePage Component

`src/components/guides/GuidePage.tsx` — Server Component, accepts:

```ts
interface GuidePageProps {
  content: GuideContent;
  locale: "pt" | "en";
  ptHref: string;   // URL of the PT version (for hreflang UI toggle)
  enHref: string;   // URL of the EN version
}
```

Renders all sections, CTA, FAQ, related links, and JSON-LD. Styled with existing Tailwind design system (dark theme, Outfit font, gold accents).

---

## Sitemap

`src/app/sitemap.ts` is updated to include all 6 new routes with:
- `changeFrequency: "monthly"`
- `priority: 0.8` (same as main tools)

---

## File Structure

```
src/
├── app/
│   ├── guia-sanduiche-shiny/page.tsx       # PT — Shiny sandwich
│   ├── shiny-sandwich-guide/page.tsx        # EN — Shiny sandwich
│   ├── melhores-spots-ev-sv/page.tsx        # PT — EV spots
│   ├── best-ev-training-spots-sv/page.tsx   # EN — EV spots
│   ├── melhores-builds-tera-raid/page.tsx   # PT — Raid builds
│   ├── best-tera-raid-builds/page.tsx       # EN — Raid builds
│   └── sitemap.ts                           # updated with 6 new routes
├── components/
│   └── guides/
│       └── GuidePage.tsx                    # shared Server Component
└── data/
    └── guides/
        ├── types.ts                         # GuideContent type definitions
        ├── sandwich-shiny.ts                # Shiny sandwich content (PT + EN)
        ├── ev-spots.ts                      # EV spots content (PT + EN)
        └── tera-raid-builds.ts              # Raid builds content (PT + EN)
```

---

## Out of Scope

- No CMS integration — content is code, updated via PR
- No user-generated content
- No comments or ratings
- No dynamic personalization
- No images beyond existing sprites (can be added later)
- `/training-tips` refactor — separate initiative
