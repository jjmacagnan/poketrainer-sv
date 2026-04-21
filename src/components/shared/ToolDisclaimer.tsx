"use client";

interface DisclaimerSource {
  label: string;
  url: string;
}

interface ToolDisclaimerProps {
  toolName: string;
  version?: string;
  note: string;
  sources: DisclaimerSource[];
}

export function ToolDisclaimer({
  toolName,
  version = "v1.0",
  note,
  sources,
}: ToolDisclaimerProps) {
  return (
    <div className="mt-8 border-t border-[var(--pt-border-dim)] pt-4 text-center text-xs text-[var(--pt-text-dim)]">
      <div className="mb-1 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-[var(--pt-text-dim)]">
        PokéTrainer SV Tools — {toolName} {version}
      </div>
      <div className="mb-2">{note}</div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {sources.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--pt-text-dim)] hover:text-[var(--pt-gold)] transition-colors"
          >
            {s.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
