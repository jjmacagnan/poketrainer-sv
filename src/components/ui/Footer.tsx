"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const TOOLS = [
  { href: "/sandwich-builder", key: "sandwich" },
  { href: "/ev-pokedex", key: "evPokedex" },
  { href: "/ev-tracker", key: "evTracker" },
  { href: "/raid-builder", key: "raidBuilder" },
  { href: "/nature-calc", key: "natureCalc" },
];

function JbitLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Jbit"
    >
      <rect width="400" height="400" rx="60" fill="#0A0F2C" />
      {/* Left bracket */}
      <rect x="60" y="180" width="80" height="80" fill="white" />
      <rect x="60" y="260" width="160" height="60" fill="white" />
      {/* Right bracket */}
      <rect x="260" y="180" width="80" height="80" fill="white" />
      <rect x="180" y="260" width="160" height="60" fill="white" />
      {/* Cyan dot */}
      <rect x="260" y="80" width="80" height="80" fill="#22D3EE" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <JbitLogo />
              <span className="text-lg font-black tracking-tight text-white">
                Jbit
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              {t("footer.tagline")}
            </p>
            <a
              href="https://github.com/jjmacagnan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-white"
            >
              <GitHubIcon />
              jjmacagnan
            </a>
          </div>

          {/* Tools */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
              {t("footer.tools")}
            </p>
            <ul className="flex flex-col gap-2">
              {TOOLS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Game */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
              {t("footer.about")}
            </p>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li>{t("footer.disclaimer")}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-600">
            © {year} Jbit · PokéTrainer SV
          </p>
          <p className="text-xs text-gray-700">
            {t("footer.trademark")}
          </p>
        </div>
      </div>
    </footer>
  );
}
