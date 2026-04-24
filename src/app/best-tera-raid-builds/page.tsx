import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { teraRaidBuildsContent } from "@/data/guides/tera-raid-builds";

export const metadata: Metadata = {
  title: teraRaidBuildsContent.en.title,
  description: teraRaidBuildsContent.en.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
      en: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    },
  },
  openGraph: {
    title: teraRaidBuildsContent.en.title,
    description: teraRaidBuildsContent.en.description,
    url: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    siteName: "PokéTrainer SV",
    locale: "en_US",
    type: "article",
  },
};

export default function BestTeraRaidBuildsPage() {
  return (
    <GuidePage
      content={teraRaidBuildsContent}
      locale="en"
      ptHref="/melhores-builds-tera-raid"
      enHref="/best-tera-raid-builds"
    />
  );
}
