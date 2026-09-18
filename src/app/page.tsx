import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Landing } from '@/components/landing/Landing';
import { lerLinksDeCheckout, linkDoPlano } from '@/lib/admin/settings';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * Porta de entrada: quem já tem sessão vai para a Home; quem não tem vê a
 * landing page (decisão do PO, 2026-08-28 — `docs/LANDING.md`).
 *
 * `/` é rota pública no middleware (CONTRACT §4) justamente para decidir por si
 * mesma. `getCurrentUser()` e `lerLinksDeCheckout()` nunca lançam — com o banco
 * fora, a landing ainda abre, só que sem botões de compra.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Inglês em Ação — inglês do zero em 42 aulas curtas',
  description:
    'Do zero a falar de você em inglês: se apresentar, falar da família e da rotina, contar o que fez ontem. 42 aulas curtas do método WSA English, no seu ritmo.',
};

export default async function RaizPage() {
  const usuario = await getCurrentUser();
  if (usuario) redirect('/inicio');

  const checkout = await lerLinksDeCheckout();

  return (
    <Landing
      ofertas={{
        ESSENCIAL: linkDoPlano(checkout, 'ESSENCIAL'),
        COMPLETO: linkDoPlano(checkout, 'COMPLETO'),
        PREMIUM: linkDoPlano(checkout, 'PREMIUM'),
      }}
    />
  );
}
