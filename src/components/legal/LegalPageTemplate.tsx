"use client";

import { useI18n, type Locale } from "@/i18n";

export type LegalSection = { title: string; body: React.ReactNode };
export type LegalMeta = Record<Locale, { title: string; updated: string }>;

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
      <h1 className="mb-2 text-3xl font-black text-white">{title}</h1>
      <p className="mb-10 text-sm text-gray-500">{updated}</p>
      <div className="flex flex-col gap-8 text-gray-300">
        {sections.map((s, index) => (
          <section key={index}>
            <h2 className="mb-3 text-lg font-bold text-white">{s.title}</h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  );
}
