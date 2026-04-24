import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { sandwichShinyContent } from "@/data/guides/sandwich-shiny";

export const metadata: Metadata = {
  title: sandwichShinyContent.en.title,
  description: sandwichShinyContent.en.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    languages: {
      "x-default": "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
      "pt-BR": "https://poketrainer.jbit.app.br/guia-sanduiche-shiny",
      en: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    },
  },
  openGraph: {
    title: sandwichShinyContent.en.title,
    description: sandwichShinyContent.en.description,
    url: "https://poketrainer.jbit.app.br/shiny-sandwich-guide",
    siteName: "PokéTrainer SV",
    locale: "en_US",
    type: "article",
  },
};

export default function ShinySandwichGuidePage() {
  return (
    <GuidePage
      content={sandwichShinyContent}
      locale="en"
      ptHref="/guia-sanduiche-shiny"
      enHref="/shiny-sandwich-guide"
    />
  );
}
