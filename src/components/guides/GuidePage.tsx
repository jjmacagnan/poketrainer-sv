"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import type { GuideContent } from "@/data/guides/types";

interface GuidePageProps {
  content: GuideContent;
  ptHref: string;
  enHref: string;
}

export default function GuidePage({ content, ptHref, enHref }: GuidePageProps) {
  const { locale } = useI18n();
  const guide = content[locale];

  const BASE_URL = "https://poketrainer.jbit.app.br";
  const canonicalUrl = `${BASE_URL}${locale === "pt" ? ptHref : enHref}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: canonicalUrl,
    datePublished: "2026-04-23",
    inLanguage: locale === "pt" ? "pt-BR" : "en",
    publisher: {
      "@type": "Organization",
      name: "PokéTrainer SV",
      url: "https://poketrainer.jbit.app.br",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
          {guide.title}
        </h1>

        {/* Intro */}
        <div className="text-gray-300 leading-relaxed space-y-4 mb-10">
          {guide.intro.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Sections */}
        {guide.sections.map((section) => (
          <section key={section.id} className="mb-10">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
              {section.heading}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">{section.body}</p>
            {section.items && section.items.length > 0 && (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-yellow-400 font-medium shrink-0">{item.name}:</span>
                    <span className="text-gray-300">{item.detail}</span>
                    {item.note && (
                      <span className="text-gray-500 text-sm ml-1">({item.note})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* CTA Block */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-6 mb-10 text-center">
          <p className="text-gray-300 mb-4 text-lg">
            {locale === "pt"
              ? "Pronto para aplicar? Use nossa ferramenta agora:"
              : "Ready to apply this? Use our tool now:"}
          </p>
          <Link
            href={guide.cta.href}
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            {guide.cta.label}
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            {locale === "pt" ? "Perguntas Frequentes" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {guide.faq.map((item, i) => (
              <details key={i} className="border border-gray-700 rounded-lg">
                <summary className="px-4 py-3 cursor-pointer text-gray-200 font-medium hover:text-white select-none">
                  {item.question}
                </summary>
                <p className="px-4 pb-4 text-gray-400 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related guides */}
        {guide.relatedLinks.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-300 mb-3">
              {locale === "pt" ? "Guias Relacionados" : "Related Guides"}
            </h2>
            <ul className="space-y-2">
              {guide.relatedLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-yellow-400 hover:text-yellow-300 underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
