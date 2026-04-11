"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/sandwich-builder", key: "sandwich" },
  { href: "/ev-pokedex", key: "evPokedex" },
  { href: "/ev-tracker", key: "evTracker" },
  { href: "/raid-builder", key: "raidBuilder" },
  { href: "/nature-calc", key: "natureCalc" },
  { href: "/comunidade", key: "comunidade" },
];

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-3">
        {/* Logo — never hidden */}
        <Link
          href="/"
          className="shrink-0 text-lg font-black tracking-tight text-white"
        >
          PokéTrainer SV
        </Link>

        {/* Nav links — scrollable on narrow screens */}
        <div className="mx-4 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>

        {/* Locale Switcher — always visible */}
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
          {(["pt", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                locale === l
                  ? "bg-violet-500/20 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {l === "pt" ? "PT" : "EN"}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
