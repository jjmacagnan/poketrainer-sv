import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://poketrainer.jbit.app.br"),
  title: {
    default: "PokéTrainer SV Tools",
    template: "%s",
  },
  description:
    "Ferramentas práticas para jogadores de Pokémon Scarlet & Violet — Sandwich Builder, EV Pokédex, EV Tracker, Raid Builder & Nature Calculator.",
  openGraph: {
    siteName: "PokéTrainer SV",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-950 font-[family-name:var(--font-outfit)] text-gray-100">
        <Providers>
          <div className="flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
