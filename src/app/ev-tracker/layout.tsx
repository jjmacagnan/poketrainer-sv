import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Training Tracker — PokéTrainer SV",
  description:
    "Rastreie o progresso de EV training do seu time completo no Pokémon Scarlet & Violet. Suporte a Pokérus, Power Items e Macho Brace com templates pré-definidos.",
  openGraph: {
    title: "EV Training Tracker — PokéTrainer SV",
    description:
      "Controle os EVs do seu time com barras visuais e cálculo automático de multiplicadores.",
    url: "https://poketrainer.jbit.app.br/ev-tracker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
