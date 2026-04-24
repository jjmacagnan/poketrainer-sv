import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { sandwichShinyContent } from "@/data/guides/sandwich-shiny";

export const metadata: Metadata = {
  title: sandwichShinyContent.pt.title,
  description: sandwichShinyContent.pt.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
      en: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    },
  },
  openGraph: {
    title: sandwichShinyContent.pt.title,
    description: sandwichShinyContent.pt.description,
    url: "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "article",
  },
};

export default function GuiaSanduicheShinyPage() {
  return (
    <GuidePage
      content={sandwichShinyContent}
      locale="pt"
      ptHref="/guia-sanduiche-shiny"
      enHref="/shiny-sandwich-guide"
    />
  );
}
