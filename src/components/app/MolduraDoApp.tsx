'use client';

/**
 * Decide, pela rota, se a tela logada leva a moldura do app (cabeçalho fixo em
 * cima, barra de navegação fixa embaixo, coluna `.tela` no meio) ou se entra em
 * modo foco (aula e resultado: casca própria em tela cheia, ver `modo-foco.ts`).
 *
 * Por que um componente de cliente: o layout `(app)` é Server Component e não
 * sabe a rota; `usePathname` só funciona em Client Component (guia
 * `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-pathname.md`).
 * O cabeçalho e a barra chegam prontos do layout como `ReactNode`.
 *
 * O aviso do guia sobre rotas reescritas (valor diferente entre servidor e
 * cliente) não se aplica: as telas de `(app)` são dinâmicas (`requireUser` lê o
 * cookie), nunca pré-renderizadas estáticas.
 *
 * A `<main>` fica sempre na mesma posição da lista de filhos (cabeçalho ou nada,
 * `<main>`, barra ou nada): assim o React não desmonta a página ao entrar ou
 * sair do modo foco.
 */
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { ehRotaDeFoco } from '@/components/app/modo-foco';

type PropsDaMoldura = {
  /** `<AppHeader />`, montado no layout. */
  cabecalho: ReactNode;
  /** `<BottomNav />`, montado no layout. */
  navegacao: ReactNode;
  children: ReactNode;
};

/*
  Fora do modo foco, o espaço de cima compensa o cabeçalho fixo
  (ALTURA_CABECALHO + 16 / ALTURA_CABECALHO_DESKTOP + 14) mais a área segura do
  topo, que o AppHeader passou a respeitar com viewport-fit=cover; o de baixo, a
  barra de navegação (ALTURA_NAV + 16) mais a área segura do iPhone. Sem eles o
  último cartão de cada tela fica escondido atrás da barra. No desktop não há barra.
  No modo foco, `.modo-foco` zera `--altura-nav`: sem a BottomNav, o aviso de
  gravação (`interacao.tsx`) pousa logo acima da barra de botões da casca.
*/
const CLASSE_DA_MOLDURA =
  'tela pb-[calc(90px+env(safe-area-inset-bottom))] pt-[calc(84px+env(safe-area-inset-top))] lg:pb-[60px] lg:pt-[102px]';

export function MolduraDoApp({ cabecalho, navegacao, children }: PropsDaMoldura) {
  const foco = ehRotaDeFoco(usePathname());

  return (
    <>
      {foco ? null : cabecalho}
      <main className={foco ? 'modo-foco' : CLASSE_DA_MOLDURA}>{children}</main>
      {foco ? null : navegacao}
    </>
  );
}
