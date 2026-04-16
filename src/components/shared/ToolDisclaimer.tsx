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
    <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
      <div className="mb-1 font-semibold text-gray-400">
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
            className="text-violet-400/70 hover:text-violet-300 transition-colors"
          >
            {s.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
