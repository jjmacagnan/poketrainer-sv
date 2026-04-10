"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const TOOLS = [
  {
    href: "/sandwich-builder",
    emoji: "🥪",
    title: "Sandwich Builder",
    descKey: "home.sandwichDesc",
    gradient: "from-yellow-500/20 to-orange-500/20",
    border: "hover:border-yellow-500/40",
  },
  {
    href: "/ev-pokedex",
    emoji: "📖",
    title: "EV Yield Pokédex",
    descKey: "home.evPokedexDesc",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/40",
  },
  {
    href: "/ev-tracker",
    emoji: "📊",
    title: "EV Training Tracker",
    descKey: "home.evTrackerDesc",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "hover:border-green-500/40",
  },
  {
    href: "/raid-builder",
    emoji: "⚔️",
    title: "Tera Raid Build Maker",
    descKey: "home.raidBuilderDesc",
    gradient: "from-purple-500/20 to-violet-500/20",
    border: "hover:border-purple-500/40",
  },
  {
    href: "/nature-calc",
    emoji: "🧮",
    title: "Nature Calculator",
    descKey: "home.natureCalcDesc",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "hover:border-pink-500/40",
  },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1
          className="mb-3 text-4xl font-black tracking-tight sm:text-5xl"
          style={{
            background: "linear-gradient(135deg, #FFD700, #FF6B6B, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PokéTrainer SV
        </h1>
        <p className="text-lg text-gray-400">
          {t("home.tagline")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group relative rounded-2xl border border-white/10 bg-gradient-to-br ${tool.gradient} p-6 transition-all duration-200 hover:-translate-y-1 ${tool.border}`}
          >
            <div className="mb-3 text-4xl">{tool.emoji}</div>
            <h2 className="mb-1 text-lg font-bold text-gray-100">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-400">{t(tool.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
