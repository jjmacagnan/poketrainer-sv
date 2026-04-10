import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandwich Builder — PokéTrainer SV",
  description:
    "Receitas de sanduíche para Shiny Hunt com Sparkling Power Lv.3 e Encounter Power no Pokémon Scarlet & Violet. Inclui todas as combinações com Herba Mystica.",
  openGraph: {
    title: "Sandwich Builder — PokéTrainer SV",
    description:
      "Encontre a receita certa para fazer Shiny Hunt e Encounter Power no Pokémon SV.",
    url: "https://poketrainer.jbit.app.br/sandwich-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
