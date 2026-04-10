import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tera Raid Build Maker — PokéTrainer SV",
  description:
    "Monte e compartilhe builds otimizadas para Tera Raids 5★, 6★ e 7★ no Pokémon Scarlet & Violet. Geração de builds com IA, export para Showdown e PNG para Discord.",
  openGraph: {
    title: "Tera Raid Build Maker — PokéTrainer SV",
    description:
      "Builds otimizadas com IA para todos os raid bosses do Pokémon SV.",
    url: "https://poketrainer.jbit.app.br/raid-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
