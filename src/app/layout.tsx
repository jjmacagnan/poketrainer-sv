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
  title: "PokéTrainer SV Tools",
  description:
    "Ferramentas práticas para jogadores de Pokémon Scarlet & Violet — Sandwich Builder, EV Pokédex, Raid Builder & mais",
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
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
