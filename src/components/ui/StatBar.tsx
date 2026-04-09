"use client";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

const STAT_COLORS: Record<string, string> = {
  HP: "#FF5959",
  Atk: "#F5AC78",
  Def: "#FAE078",
  SpA: "#9DB7F5",
  SpD: "#A7DB8D",
  Spe: "#FA92B2",
};

export function StatBar({ label, value, max = 255, color }: StatBarProps) {
  const fill = Math.min((value / max) * 100, 100);
  const barColor = color || STAT_COLORS[label] || "#8B5CF6";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 shrink-0 text-right text-xs font-bold text-gray-400">
        {label}
      </span>
      <span className="w-8 shrink-0 text-right font-mono text-xs font-semibold text-gray-200">
        {value}
      </span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{ width: `${fill}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
