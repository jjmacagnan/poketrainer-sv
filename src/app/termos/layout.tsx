import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso · PokéTrainer SV",
  description: "Termos de uso do PokéTrainer SV Tools.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
