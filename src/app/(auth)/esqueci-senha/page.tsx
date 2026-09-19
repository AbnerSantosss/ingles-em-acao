/**
 * `/esqueci-senha` — pedido do link de redefinição.
 *
 * Uma caixinha só. A resposta é sempre a mesma, exista a conta ou não
 * (contrato §5.5): esta tela não pode virar um verificador de e-mails.
 */
import type { Metadata } from 'next';

import { DESTINO_PADRAO, safeNext } from '@/lib/auth/next-url';

import { FormularioDeRecuperacao } from './form';

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
  description: 'Receba um link para criar uma nova senha do WSA English.',
};

type Busca = Record<string, string | string[] | undefined>;

function primeiro(valor: string | string[] | undefined): string | null {
  if (Array.isArray(valor)) return valor[0] ?? null;
  return valor ?? null;
}

export default async function PaginaEsqueciSenha({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const busca = await searchParams;

  const destino = safeNext(primeiro(busca.next));
  const carona = destino !== DESTINO_PADRAO ? `?next=${encodeURIComponent(destino)}` : '';

  return <FormularioDeRecuperacao linkEntrar={`/entrar${carona}`} />;
}
