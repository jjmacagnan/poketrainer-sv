import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { evSpotsContent } from "@/data/guides/ev-spots";

export const metadata: Metadata = {
  title: evSpotsContent.en.title,
  description: evSpotsContent.en.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
      en: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    },
  },
  openGraph: {
    title: evSpotsContent.en.title,
    description: evSpotsContent.en.description,
    url: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    siteName: "PokéTrainer SV",
    locale: "en_US",
    type: "article",
  },
};

export default function BestEvTrainingSpotsPage() {
  return (
    <GuidePage
      content={evSpotsContent}
      locale="en"
      ptHref="/melhores-spots-ev-sv"
      enHref="/best-ev-training-spots-sv"
    />
  );
}
