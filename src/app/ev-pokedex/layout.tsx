import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Yield Pokédex — PokéTrainer SV",
  description:
    "Lista completa de todos os Pokémon de Paldea, Kitakami e Blueberry Academy com EV yields ao derrotar. Filtre por stat, tipo e quantidade de EVs.",
  openGraph: {
    title: "EV Yield Pokédex — PokéTrainer SV",
    description:
      "Encontre os melhores Pokémon para treinar cada stat no Pokémon Scarlet & Violet.",
    url: "https://poketrainer.jbit.app.br/ev-pokedex",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
