/**
 * `/criar-conta` — cadastro.
 *
 * Campos mínimos (contrato §7): nome, e-mail, senha e o aceite dos termos.
 * Quanto menos caixinhas entre a pessoa e a primeira aula, melhor.
 */
import type { Metadata } from 'next';

import { DESTINO_PADRAO, safeNext } from '@/lib/auth/next-url';

import { FormularioDeCadastro } from './form';

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie sua conta do Inglês em Ação e comece a trilha de 42 aulas.',
};

type Busca = Record<string, string | string[] | undefined>;

function primeiro(valor: string | string[] | undefined): string | null {
  if (Array.isArray(valor)) return valor[0] ?? null;
  return valor ?? null;
}

export default async function PaginaCriarConta({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const busca = await searchParams;

  const destino = safeNext(primeiro(busca.next));
  const carona = destino !== DESTINO_PADRAO ? `?next=${encodeURIComponent(destino)}` : '';

  return <FormularioDeCadastro next={destino} linkEntrar={`/entrar${carona}`} />;
}
