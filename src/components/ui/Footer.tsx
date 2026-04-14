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
      <rect x="60" y="180" width="80" height="80" fill="white" />
      <rect x="60" y="260" width="160" height="60" fill="white" />
      <rect x="260" y="180" width="80" height="80" fill="white" />
      <rect x="180" y="260" width="160" height="60" fill="white" />
      <rect x="260" y="80" width="80" height="80" fill="#22D3EE" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.037.05a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .083-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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
          <div className="flex flex-col gap-4">
            {/* Linha 1: Logo Jbit */}
            <div className="flex items-center gap-2.5">
              <JbitLogo />
              <span className="text-lg font-black tracking-tight text-white">
                Jbit
              </span>
            </div>

            {/* Linha 2: Favicon + PokéTrainer SV + Tagline */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <img 
                  src="/favicon.ico" 
                  alt="Favicon" 
                  className="h-4 w-4"
                />
                <p className="text-sm font-bold text-white/90">
                  PokéTrainer SV
                </p>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-2 mt-1">
              <a
                href="https://github.com/jjmacagnan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-white"
              >
                <GitHubIcon />
                jjmacagnan
              </a>
              <a
                href="https://www.youtube.com/@JJBit-games"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400"
              >
                <YouTubeIcon />
                JJ Bit
              </a>
              <a
                href="https://discord.gg/AdReDaWmBw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-indigo-500/30 hover:text-indigo-400"
              >
                <DiscordIcon />
                Discord
              </a>
            </div>
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

          {/* Game / Disclaimer */}
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
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs text-gray-600">
            © {year} Jbit · PokéTrainer SV
          </p>
        </div>
      </div>
    </footer>
  );
}