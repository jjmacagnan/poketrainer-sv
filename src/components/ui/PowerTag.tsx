"use client";

interface PowerTagProps {
  power: string;
}

export function PowerTag({ power }: PowerTagProps) {
  const isShiny = power.includes("Sparkling");
  const isEncounter = power.includes("Encounter");
  const isLv3 = power.includes("Lv.3");

  return (
    <span
      className="inline-flex items-center gap-1 rounded-md text-xs font-semibold"
      style={{
        background: isShiny
          ? "linear-gradient(135deg, #FFD700, #FFA500)"
          : isEncounter
            ? "linear-gradient(135deg, #4ECDC4, #2C8C85)"
            : "rgba(255,255,255,0.08)",
        color: isShiny || isEncounter ? "#fff" : "#F0F0F0",
        padding: "3px 10px",
        border: isLv3
          ? "1px solid rgba(255,255,255,0.3)"
          : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {isShiny && "✨ "}
      {power}
    </span>
  );
}
