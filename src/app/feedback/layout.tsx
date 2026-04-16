import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback — PokéTrainer SV",
  description: "Envie sugestões, reporte bugs ou sugira melhorias para o PokéTrainer SV.",
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
