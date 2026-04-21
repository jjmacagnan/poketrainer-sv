"use client";

import type { ReactNode } from "react";
import { useI18n, type Locale } from "@/i18n";

export type LegalSection = { title: string; body: ReactNode };
export type LegalMeta = Record<Locale, { title: string; updated: string }>;

const GITHUB_ISSUES = "https://github.com/jjmacagnan/poketrainer-sv/issues";

export function GithubLink() {
  return (
    <a
      href={GITHUB_ISSUES}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline hover:text-blue-300"
    >
      GitHub Issues
    </a>
  );
}

interface LegalPageTemplateProps {
  meta: LegalMeta;
  getSections: (locale: Locale) => LegalSection[];
}

export function LegalPageTemplate({ meta, getSections }: LegalPageTemplateProps) {
  const { locale } = useI18n();
  const { title, updated } = meta[locale] ?? meta["pt"];
  const sections = getSections(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-3xl font-black uppercase tracking-[2px] text-[var(--pt-gold)]">{title}</h1>
      <p className="mb-10 text-sm text-[var(--pt-text-dim)]">{updated}</p>
      <div className="flex flex-col gap-8 text-gray-300">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="mb-3 font-[family-name:var(--font-share-tech-mono)] text-lg font-bold uppercase tracking-[2px] text-[var(--pt-text)]">{s.title}</h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  );
}
