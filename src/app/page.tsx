"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const TOOLS = [
  {
    href: "/sandwich-builder",
    emoji: "🥪",
    title: "Sandwich Builder",
    descKey: "home.sandwichDesc",
    color: "#F59E0B",
    colorEnd: "#F97316",
  },
  {
    href: "/ev-pokedex",
    emoji: "📖",
    title: "EV Yield Pokédex",
    descKey: "home.evPokedexDesc",
    color: "#22D3EE",
    colorEnd: "#3B82F6",
  },
  {
    href: "/ev-tracker",
    emoji: "📊",
    title: "EV Training Tracker",
    descKey: "home.evTrackerDesc",
    color: "#34D399",
    colorEnd: "#10B981",
  },
  {
    href: "/raid-builder",
    emoji: "⚔️",
    title: "Tera Raid Build Maker",
    descKey: "home.raidBuilderDesc",
    color: "#F87171",
    colorEnd: "#8B5CF6",
  },
  {
    href: "/nature-calc",
    emoji: "🧮",
    title: "Nature Calculator",
    descKey: "home.natureCalcDesc",
    color: "#F472B6",
    colorEnd: "#EC4899",
  },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Hero */}
      <div className="mb-14 text-center animate-fade-up">
        <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
          Pokémon Scarlet &amp; Violet
        </div>
        <h1
          className="mb-3 text-5xl font-[family-name:var(--font-syne)] font-extrabold tracking-tight sm:text-6xl"
          style={{
            background: "linear-gradient(135deg, #FB923C 0%, #FBBF24 40%, #A78BFA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            paddingBottom: "0.1em",
          }}
        >
          PokéTrainer SV
        </h1>
        <p className="text-base text-gray-500">{t("home.tagline")}</p>
      </div>

      {/* Tool cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map((tool, i) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="animate-fade-up group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.06]"
            style={{ animationDelay: `${80 + i * 70}ms` }}
          >
            {/* Top accent bar */}
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${tool.color}, ${tool.colorEnd})` }}
            />

            {/* Corner glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse 90% 70% at 0% 0%, ${tool.color}18, transparent 65%)`,
              }}
            />

            {/* Icon container */}
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
              style={{ background: `${tool.color}1f` }}
            >
              {tool.emoji}
            </div>

            <h2 className="mb-1.5 text-base font-bold text-white">{tool.title}</h2>
            <p className="text-sm leading-relaxed text-gray-500">{t(tool.descKey)}</p>

            {/* Arrow on hover */}
            <div
              className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-200 group-hover:opacity-100"
              style={{ color: tool.color }}
            >
              {t("home.openTool")} →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
