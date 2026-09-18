import type { NextConfig } from "next";

// A allowlist de embed de vídeo mora num arquivo só (BACKOFFICE §2.6): o mesmo
// módulo alimenta o `parseVideoSource` do servidor e o `frame-src` daqui. Se as
// duas listas fossem escritas à mão em lugares diferentes, o dia em que elas
// divergissem daria tela preta sem erro nenhum para ninguém ver.
import { CSP_DE_VIDEO, ROTAS_COM_VIDEO } from "./src/lib/video/csp";

const nextConfig: NextConfig = {
  // Gera .next/standalone (server.js + só as dependências que o app usa de fato).
  // É o que a imagem Docker de produção copia — veja o Dockerfile e docs/DEPLOY.md.
  output: "standalone",

  // Pacotes com binário nativo ou carregamento dinâmico próprio: o bundler não
  // deve empacotá-los, só exigi-los em runtime a partir de node_modules.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "@node-rs/argon2",
    "nodemailer",
  ],

  // O padrão do Next é 1 MB por Server Action, e a biblioteca de mídia promete
  // imagens de até 5 MB (BACKOFFICE §4.3). Sem isto, a imagem de 2 MB é recusada
  // pelo runtime antes de a action rodar, com um erro genérico que ninguém entende.
  // A folga acima de 5 MB cobre o overhead do multipart (fronteiras e cabeçalhos).
  // ⚠️ O limite é global — vale para toda Server Action, não só para o upload.
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  // Segunda tranca do vídeo: mesmo que um `videoRef` torto chegue à tela, o
  // navegador se recusa a carregar um iframe de origem fora desta lista.
  //
  // ⚠️ Só a diretiva `frame-src`, e só nas rotas que embutem vídeo. Uma política
  // completa (script-src, style-src...) é outra tarefa: escrita às pressas aqui,
  // ela quebraria telas que nada têm a ver com vídeo.
  async headers() {
    return ROTAS_COM_VIDEO.map((source) => ({
      source,
      headers: [{ key: "Content-Security-Policy", value: CSP_DE_VIDEO }],
    }));
  },
};

export default nextConfig;
