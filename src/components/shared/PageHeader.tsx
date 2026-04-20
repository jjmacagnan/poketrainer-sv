// src/components/shared/PageHeader.tsx
"use client";

interface PageHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  toolNumber?: string;
  gradient?: string; // kept for backward compat with existing callers, ignored
}

export function PageHeader({ emoji, title, subtitle, toolNumber }: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      {toolNumber && (
        <div className="mb-1 font-[family-name:var(--font-share-tech-mono)] text-[8px] uppercase tracking-[3px] text-[var(--pt-text-dim)]">
          {toolNumber}
        </div>
      )}
      <div className="mb-2 text-5xl">{emoji}</div>
      <h1 className="mb-2 font-[family-name:var(--font-share-tech-mono)] text-2xl uppercase tracking-[2px] text-[var(--pt-gold)]">
        {title}
      </h1>
      <p className="text-sm text-[var(--pt-text-dim)]">{subtitle}</p>
    </div>
  );
}
