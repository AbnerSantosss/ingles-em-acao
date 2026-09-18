/**
 * Moldura do painel administrativo (`/admin/**`) — BACKOFFICE §1.1, camada 2.
 *
 * ⚠️ **É aqui que a autorização acontece.** O `src/proxy.ts` só confere a
 * presença do cookie; o papel do usuário mora no banco, e o banco só existe
 * deste lado. `requireAdminNaTela()` faz as três perguntas — há sessão? o papel
 * é ADMIN? a sessão tem menos de 8 horas? — e nunca retorna quando a resposta é
 * não: dá `notFound()` (o painel não existe para quem não é admin, decisão D2)
 * ou redireciona para reautenticar.
 *
 * ⚠️ **E é só isto que o layout protege: a renderização.** Server Action é um
 * endpoint POST; o layout não roda antes dela. Toda ação do painel começa por
 * `await requireAdmin()`, sem exceção.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdminNaTela } from '@/lib/admin/guard';

export const metadata: Metadata = {
  title: { template: '%s · Painel · Inglês em Ação', default: 'Painel · Inglês em Ação' },
  // O painel nunca deve aparecer em buscador — nem a existência dele.
  robots: { index: false, follow: false },
};

/**
 * Nada do painel é estático: tudo depende do cookie desta requisição e do estado
 * atual do banco. Declarado em vez de deduzido, para uma tela futura que só leia
 * conteúdo não ser promovida a estática por engano e passar a servir dados de
 * outra pessoa em cache.
 */
export const dynamic = 'force-dynamic';

export default async function LayoutDoPainel({
  children,
}: Readonly<{ children: ReactNode }>) {
  const admin = await requireAdminNaTela();

  return <AdminShell usuario={admin}>{children}</AdminShell>;
}
