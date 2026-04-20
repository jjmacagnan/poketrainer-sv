import type { Metadata } from "next";
import { Outfit, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Providers } from "@/components/Providers";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
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
  twitter: { card: "summary" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PokéTrainer SV",
  },
  formatDetection: { telephone: false },
  icons: { apple: "/icons/icon-192.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${shareTechMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--pt-bg)] font-[family-name:var(--font-outfit)] text-[var(--pt-text)]">
        <ServiceWorkerRegistration />
        <Providers>
          <div className="flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
