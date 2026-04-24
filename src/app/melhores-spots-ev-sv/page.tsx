import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { evSpotsContent } from "@/data/guides/ev-spots";

export const metadata: Metadata = {
  title: evSpotsContent.pt.title,
  description: evSpotsContent.pt.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
      en: "https://poketrainer.jbit.app.br/best-ev-training-spots-sv",
    },
  },
  openGraph: {
    title: evSpotsContent.pt.title,
    description: evSpotsContent.pt.description,
    url: "https://poketrainer.jbit.app.br/melhores-spots-ev-sv",
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "article",
  },
};

export default function MelhoresSpotsEvPage() {
  return (
    <GuidePage
      content={evSpotsContent}
      locale="pt"
      ptHref="/melhores-spots-ev-sv"
      enHref="/best-ev-training-spots-sv"
    />
  );
}
