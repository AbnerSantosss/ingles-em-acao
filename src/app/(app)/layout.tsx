/**
 * Moldura das telas logadas (`/inicio`, `/trilha`, `/progresso`, `/perfil`,
 * `/aula/[slug]` e `/aula/[slug]/resultado`).
 *
 * Nas telas de navegação: cabeçalho fixo em cima, barra de navegação fixa embaixo
 * e o conteúdo no meio, numa coluna de 460px. A partir de 1024px a coluna vai a
 * 1024px, a navegação sobe para o cabeçalho e a barra inferior some.
 *
 * Na aula e no resultado (modo foco): nem cabeçalho nem barra. A própria tela
 * monta a casca em tela cheia. Quem decide pela rota é `MolduraDoApp`, um
 * componente de cliente; este layout continua Server Component e continua sendo
 * a guarda de sessão.
 *
 * `overflow-x-clip`: a faixa escura do topo do /inicio sangra até as bordas da
 * janela com `w-screen`, que conta a barra de rolagem; o corte evita a rolagem
 * lateral. `clip` e não `hidden`: não cria contêiner de rolagem nem quebra `sticky`.
 *
 * ⚠️ A guarda de sessão é aqui, não no middleware: o middleware só olha o
 * cookie, quem confere no banco é o `requireUser()` (CONTRACT §5.4). Ele
 * redireciona sozinho quando não há sessão válida: nunca devolve `null`.
 */
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { AppHeader } from '@/components/app/AppHeader';
import { BottomNav } from '@/components/app/BottomNav';
import { MolduraDoApp } from '@/components/app/MolduraDoApp';
import { requireUser } from '@/lib/auth/session';

/**
 * `absolute` e não `default`: num layout filho, o `default` passaria pelo
 * modelo do layout raiz e dobraria a marca (01-CONTRATOS §10.7).
 */
export const metadata: Metadata = {
  title: { template: '%s · WSA English', absolute: 'WSA English' },
};

/**
 * `viewport-fit=cover`: a casca da aula pinta até as bordas da tela (atrás do
 * entalhe do iPhone deitado e da barra de gestos) e se afasta delas com
 * `env(safe-area-inset-*)`. O Next junta este objeto com o `viewport` do layout
 * raiz, chave por chave: o que o raiz define continua valendo (guia
 * `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-viewport.md`).
 */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default async function LayoutDoApp({
  children,
}: Readonly<{ children: ReactNode }>) {
  const usuario = await requireUser();

  return (
    <div className="min-h-dvh overflow-x-clip bg-bg">
      <MolduraDoApp
        cabecalho={<AppHeader name={usuario.name} photoUrl={usuario.photoUrl} />}
        navegacao={<BottomNav />}
      >
        {children}
      </MolduraDoApp>
    </div>
  );
}
