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
        <div className="mb-3 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[5px] text-[var(--pt-gold)]">
          ▶ POKÉMON SCARLET &amp; VIOLET
        </div>
        <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-4xl uppercase tracking-[3px] text-[var(--pt-text)] sm:text-5xl">
          POKÉ<span className="text-[var(--pt-gold)]">TRAINER</span>
        </h1>
        <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[var(--pt-gold)] to-transparent" />
        <p className="font-[family-name:var(--font-share-tech-mono)] text-ui-base uppercase tracking-[3px] text-[var(--pt-text-dim)]">
          {t("home.selectYourTool")}
        </p>
      </div>

      {/* Section label */}
      <div className="mb-4 flex items-center gap-3 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[4px] text-[var(--pt-gold)]">
        ▶ {t("home.availableTools")}
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

            <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-gold)]">
              {tool.number}
            </div>
            <div className="mb-2 text-2xl">{tool.emoji}</div>
            <div className="mb-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-base uppercase leading-snug tracking-[1px] text-[var(--pt-text)]">
              {t(tool.titleKey)}
            </div>
            <p className="text-ui-md leading-relaxed text-[var(--pt-text-dim)]">
              {t(tool.descKey)}
            </p>
            <div className="mt-3 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] text-[var(--pt-gold)] opacity-0 transition-opacity group-hover:opacity-100">
              ▶ {t("home.openTool")} →
            </div>
          </Link>
        ))}

        {/* Locked slot */}
        <div className="relative border border-dashed border-[var(--pt-border-dim)] bg-[var(--pt-card)] p-4 opacity-35">
          <div className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-ui-xs uppercase tracking-[2px] text-[var(--pt-text-dim)]">
            #???
          </div>
          <div className="mb-2 text-2xl">🔒</div>
          <div className="font-[family-name:var(--font-share-tech-mono)] text-ui-base uppercase tracking-[1px] text-[var(--pt-text-dim)]">
            {t("home.comingSoon")}
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-sm text-[var(--pt-text-dim)]">
        {t("kofi.cta")} <BuyMeCoffeeLink variant="inline" />
      </p>
    </div>
  );
}
