"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

interface GuideBannerProps {
  ptHref: string;
  enHref: string;
  label: string;
}

export function GuideBanner({ ptHref, enHref, label }: GuideBannerProps) {
  const { locale, t } = useI18n();
  const href = locale === "pt" ? ptHref : enHref;

  return (
    <Link
      href={href}
      className="mb-6 flex items-center justify-between border border-[var(--pt-border-dim)] bg-[var(--pt-card)] px-4 py-2.5 transition-all hover:border-[rgba(255,215,0,0.4)] hover:bg-[rgba(255,215,0,0.02)] group"
    >
      <span className="font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] text-[var(--pt-text-dim)] group-hover:text-[var(--pt-text)]">
        📖 {label}
      </span>
      <span className="font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[1px] text-[var(--pt-gold)] opacity-60 group-hover:opacity-100">
        {t("common.guideRead")} →
      </span>
    </Link>
  );
}
