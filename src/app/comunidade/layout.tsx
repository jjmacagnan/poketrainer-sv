import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidade — PokéTrainer SV",
  description:
    "Participe da comunidade JJ Bit! Assista vídeos sobre Pokémon Scarlet & Violet, entre no Discord e fique por dentro de tudo sobre o PokéTrainer SV.",
  openGraph: {
    title: "Comunidade JJ Bit — PokéTrainer SV",
    description:
      "Canal no YouTube, servidor no Discord e conteúdo sobre Pokémon SV.",
    url: "https://poketrainer.jbit.app.br/comunidade",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
