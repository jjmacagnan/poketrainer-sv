import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PokéTrainer SV Tools",
    short_name: "PokéTrainer SV",
    description:
      "Ferramentas para jogadores de Pokémon Scarlet & Violet — Sandwich Builder, EV Pokédex, Raid Builder e mais.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#030712",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["games", "utilities"],
  };
}
