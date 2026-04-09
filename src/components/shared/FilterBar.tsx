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

export function FilterBar({
  options,
  selected,
  onSelect,
  allLabel = "Todos",
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
          !selected
            ? "border-white/30 bg-white/15 text-white"
            : "border-white/10 bg-white/5 text-gray-400"
        }`}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(selected === opt.value ? null : opt.value)}
          className="rounded-full border px-3 py-1 text-[11px] font-bold text-white transition-all"
          style={{
            background:
              selected === opt.value
                ? opt.color || "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.05)",
            borderColor:
              selected === opt.value
                ? opt.color || "rgba(255,255,255,0.3)"
                : "rgba(255,255,255,0.1)",
            opacity: selected === opt.value ? 1 : 0.6,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
