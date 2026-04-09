"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/sandwich-builder", label: "Sandwich Builder" },
  { href: "/ev-pokedex", label: "EV Pokédex" },
  { href: "/ev-tracker", label: "EV Tracker" },
  { href: "/raid-builder", label: "Raid Builder" },
  { href: "/nature-calc", label: "Nature Calc" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-6 overflow-x-auto px-4 py-3">
        <Link
          href="/"
          className="shrink-0 text-lg font-black tracking-tight text-white"
        >
          PokéTrainer SV
        </Link>
        <div className="flex items-center gap-1">
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
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
