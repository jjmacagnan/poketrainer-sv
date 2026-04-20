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
