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
  title: 'WSA English: inglês do zero e conversa com IA',
  description:
    'Do zero ao inglês que você usa de verdade, em 42 aulas curtas. No WSA Premium, pratique conversação com roteiros para abrir na IA que preferir.',
};

export default async function RaizPage() {
  const usuario = await getCurrentUser();
  if (usuario) redirect('/inicio');

  // ⚠️ Os links daqui saem **sem** a referência do aluno (`lerLinksDeCompra`):
  // quem tem sessão nunca chega a esta linha (vai para `/inicio`) e o visitante
  // anônimo ainda não tem conta a que a compra possa voltar. Pagamento que chega
  // por aqui é gravado órfão pelo webhook e liberado pelo suporte, à mão — o
  // que a landing e os termos prometem hoje ("liberado pela equipe").
  const checkout = await lerLinksDeCheckout();

  return (
    <Landing
      ofertas={{
        ESSENCIAL: linkDoPlano(checkout, 'ESSENCIAL'),
        PREMIUM: linkDoPlano(checkout, 'PREMIUM'),
      }}
    />
  );
}
