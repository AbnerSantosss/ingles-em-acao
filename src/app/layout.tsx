import type { Metadata, Viewport } from "next";
import { Caveat, Figtree } from "next/font/google";

import "./globals.css";

// Figtree carrega toda a interface; Caveat só as frases manuscritas.
const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inglês em Ação",
  description:
    "O inglês que você usa de verdade: 42 aulas, no seu ritmo e com objetivos reais.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A1F4E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
