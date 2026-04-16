import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal · PokéTrainer SV",
  description: "Aviso legal e isenção de responsabilidade do PokéTrainer SV.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
