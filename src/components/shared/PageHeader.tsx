"use client";

interface PageHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  gradient?: string;
}

export function PageHeader({
  emoji,
  title,
  subtitle,
  gradient = "linear-gradient(135deg, #FB923C, #FBBF24, #A78BFA)",
}: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-2 text-5xl">{emoji}</div>
      <h1
        className="mb-1.5 text-3xl font-[family-name:var(--font-syne)] font-extrabold tracking-tight"
        style={{
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h1>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
