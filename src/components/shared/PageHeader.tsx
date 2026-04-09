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
  gradient = "linear-gradient(135deg, #FFD700, #FF6B6B, #8B5CF6)",
}: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-2 text-5xl">{emoji}</div>
      <h1
        className="mb-1.5 text-3xl font-black tracking-tight"
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
