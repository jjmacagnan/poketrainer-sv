import type { Metadata } from "next";
import GuidePage from "@/components/guides/GuidePage";
import { teraRaidBuildsContent } from "@/data/guides/tera-raid-builds";

export const metadata: Metadata = {
  title: teraRaidBuildsContent.pt.title,
  description: teraRaidBuildsContent.pt.description,
  alternates: {
    canonical: "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
    languages: {
      "pt-BR": "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
      en: "https://poketrainer.jbit.app.br/best-tera-raid-builds",
    },
  },
  openGraph: {
    title: teraRaidBuildsContent.pt.title,
    description: teraRaidBuildsContent.pt.description,
    url: "https://poketrainer.jbit.app.br/melhores-builds-tera-raid",
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "article",
  },
};

export default function MelhoresBuildsTeraRaidPage() {
  return (
    <GuidePage
      content={teraRaidBuildsContent}
      locale="pt"
      ptHref="/melhores-builds-tera-raid"
      enHref="/best-tera-raid-builds"
    />
  );
}
