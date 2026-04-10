import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nature Calculator — PokéTrainer SV",
  description:
    "Tabela completa das 25 natures, calculadora de stats com fórmula Gen 9 e comparador de natures. Sugestão de Mints por role (Physical, Special, Bulk).",
  openGraph: {
    title: "Nature Calculator — PokéTrainer SV",
    description:
      "Calcule stats finais e compare natures para qualquer Pokémon de Scarlet & Violet.",
    url: "https://poketrainer.jbit.app.br/nature-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
