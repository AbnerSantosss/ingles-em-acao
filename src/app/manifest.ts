/**
 * Manifesto do app instalável (PWA) — servido em `/manifest.webmanifest`.
 *
 * É o que faz o Chrome do Android oferecer "Instalar app" e abrir o WSA English
 * em tela cheia, com ícone próprio, sem a barra do navegador.
 *
 * ⚠️ Sem service worker de propósito: o Chrome instala sem ele, e um cache de
 * páginas num app em que quase tudo fica atrás do login é o caminho mais curto
 * para mostrar a aula de ontem (ou a tela de outra pessoa) a quem abriu hoje.
 *
 * Os ícones moram em `public/icons/pwa/` — o proxy deixa passar, sem login,
 * qualquer caminho cujo último segmento tenha ponto.
 */
import type { MetadataRoute } from 'next';

import { COR_DO_TEMA, DESCRICAO_DO_PRODUTO, NOME_DO_PRODUTO } from '@/lib/marca';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NOME_DO_PRODUTO,
    short_name: NOME_DO_PRODUTO,
    description: DESCRICAO_DO_PRODUTO,
    lang: 'pt-BR',
    // Quem já está logado é levado pelo proxy direto para `/inicio`; quem não
    // está cai na tela de entrada, onde escolhe "aluno" ou "admin".
    start_url: '/entrar',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: COR_DO_TEMA,
    theme_color: COR_DO_TEMA,
    icons: [
      { src: '/icons/pwa/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/pwa/icone-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    // Aparecem ao segurar o dedo no ícone do app.
    shortcuts: [
      {
        name: 'Entrar como aluno',
        short_name: 'Aluno',
        url: '/inicio',
        icons: [{ src: '/icons/pwa/icone-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Painel do admin',
        short_name: 'Admin',
        url: '/admin',
        icons: [{ src: '/icons/pwa/icone-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
