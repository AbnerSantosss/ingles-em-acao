import type { Metadata, Viewport } from "next";
import { Caveat, Figtree } from "next/font/google";

import {
  COR_DO_TEMA,
  DESCRICAO_DO_PRODUTO,
  MODELO_DE_TITULO,
  NOME_DO_PRODUTO,
  baseDoSite,
} from "@/lib/marca";

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

/*
 * Metadados de todo o app. Guias: node_modules/next/dist/docs/01-app/
 * 03-api-reference/04-functions/generate-metadata.md (title, metadataBase,
 * openGraph) e generate-viewport.md (themeColor).
 *
 * Os ícones (favicon.ico, icon.png, apple-icon.png) e a imagem de
 * compartilhamento (opengraph-image.png, com o texto de opengraph-image.alt.txt)
 * são arquivos desta pasta: o Next gera as tags sozinho. Não declare `icons`
 * nem `openGraph.images` aqui, senão o arquivo deixa de valer.
 *
 * Nenhuma página deve declarar `openGraph`: a junção de metadados é rasa e o
 * `openGraph` da página apagaria o deste arquivo inteiro (siteName, locale e
 * imagem). O título, sim: cada tela dá o seu e o modelo completa com a marca.
 */
export const metadata: Metadata = {
  metadataBase: baseDoSite(),
  title: {
    template: MODELO_DE_TITULO,
    default: NOME_DO_PRODUTO,
  },
  applicationName: NOME_DO_PRODUTO,
  description: DESCRICAO_DO_PRODUTO,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: NOME_DO_PRODUTO,
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Sem `maximumScale`: ele impede a pessoa de ampliar a tela (WCAG 1.4.4).
// Resolução do orquestrador, seção 10 do 01-CONTRATOS.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: COR_DO_TEMA,
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
