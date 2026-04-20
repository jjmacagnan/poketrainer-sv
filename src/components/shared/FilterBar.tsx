// src/components/shared/FilterBar.tsx
"use client";

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: string;
}

export function FilterBar({ options, selected, onSelect, allLabel = "Todos" }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      <button
        onClick={() => onSelect(null)}
        className={`border px-3 py-1 font-[family-name:var(--font-share-tech-mono)] text-[9px] uppercase tracking-[2px] transition-colors ${
          !selected
            ? "border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] text-[var(--pt-gold)]"
            : "border-[var(--pt-border-dim)] text-[var(--pt-text-dim)] hover:border-[rgba(255,215,0,0.4)] hover:text-[var(--pt-text)]"
        }`}
      >
        {allLabel}
      </button>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(isActive ? null : opt.value)}
            className="border px-3 py-1 text-[11px] font-bold uppercase text-white transition-all"
            style={{
              background: isActive
                ? opt.color || "var(--pt-gold)"
                : opt.color
                  ? `${opt.color}22`
                  : "var(--pt-card)",
              borderColor: isActive
                ? opt.color || "var(--pt-gold)"
                : opt.color
                  ? `${opt.color}44`
                  : "var(--pt-border-dim)",
              opacity: isActive ? 1 : 0.75,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
