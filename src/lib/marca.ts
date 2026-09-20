/**
 * Marca do produto: nome, modelos de título, cor do tema e endereço público do site.
 *
 * Um lugar só para o que aparece em `<title>`, `metadata`, `aria-label` e e-mail.
 * Sem `'use client'` e sem importar `env.ts`: o arquivo é lido pelo layout raiz
 * (servidor), pelos e-mails (`src/lib/mail/layout.ts`) e pelos testes, e o
 * `env.ts` lança quando falta variável.
 *
 * O que NÃO muda com a marca (e por quê) está na seção 3.2 do pacote 04 do plano v2
 * (`docs/plano-v2/04-marca.md`): cookie `iea_session`, container `iea-db`, banco,
 * volumes e o `name` do `package.json`.
 */

/** Nome do produto em títulos, `aria-label`, `alt` e e-mails. */
export const NOME_DO_PRODUTO = 'WSA English';

/** Modelo de título das telas do app e do site (`title.template` do Next). */
export const MODELO_DE_TITULO = '%s · WSA English';

/** Modelo de título das telas do painel. */
export const MODELO_DE_TITULO_DO_PAINEL = '%s · Painel · WSA English';

/** Título do painel quando a tela não informa o seu. */
export const TITULO_PADRAO_DO_PAINEL = 'Painel · WSA English';

/** Cor da barra do navegador no celular (`themeColor`): navy da marca. */
export const COR_DO_TEMA = '#0A1F4E';

/** Descrição padrão (layout raiz). As telas que têm a sua sobrescrevem. */
export const DESCRICAO_DO_PRODUTO =
  'O inglês que você usa de verdade: 42 aulas, no seu ritmo e com objetivos reais.';

/**
 * Logo do cabeçalho dos e-mails, servida pelo próprio app a partir de `public/`.
 * PNG e não WebP: Outlook e clientes antigos não abrem WebP.
 */
export const CAMINHO_DA_LOGO_DO_EMAIL = '/brand/email/wsa-logo-email.png';

/** Endereço usado quando `APP_URL` falta ou é inválida (desenvolvimento local). */
const URL_PADRAO_DO_SITE = 'http://localhost:3000';

/**
 * Base pública do site para o `metadataBase` do Next (URLs absolutas de `og:image`).
 * Lê `APP_URL` direto do `process.env`, sem passar pelo `env.ts`. Atenção: telas
 * estáticas (`/termos`, `/privacidade`, a 404) guardam o valor do momento do
 * build. Por isso o Dockerfile recebe `APP_URL` como `ARG` e o
 * docker-compose.prod.yml a repassa em `build.args`: mudar a URL pública pede
 * imagem nova, reiniciar o container não basta.
 */
export function baseDoSite(): URL {
  const bruto = (process.env.APP_URL ?? '').trim().replace(/\/+$/, '');
  try {
    const url = new URL(bruto);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url;
  } catch {
    // Vazia ou inválida: cai no padrão abaixo.
  }
  return new URL(URL_PADRAO_DO_SITE);
}
