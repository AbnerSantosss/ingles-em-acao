/**
 * `/entrar` — a tela de login.
 *
 * Server Component: só lê a query (`searchParams` é uma Promise no Next 16),
 * decide o destino e passa tudo pronto para o formulário cliente.
 */
import type { Metadata } from 'next';

import {
  DESTINO_PADRAO,
  PARAM_SESSAO,
  VALOR_SESSAO_EXPIRADA,
  safeNext,
} from '@/lib/auth/next-url';

import { EntradaDemo } from './entrada-demo';
import { FormularioDeEntrada } from './form';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Entre na sua conta do Inglês em Ação e continue sua trilha de 42 aulas.',
};

type Busca = Record<string, string | string[] | undefined>;

/** `?next=a&next=b` chega como array; ficamos com o primeiro valor. */
function primeiro(valor: string | string[] | undefined): string | null {
  if (Array.isArray(valor)) return valor[0] ?? null;
  return valor ?? null;
}

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const busca = await searchParams;

  // `safeNext` é a única autoridade sobre o destino: tudo que não for caminho
  // interno conhecido vira `/inicio` (contrato §5.7, redirecionamento aberto).
  const destino = safeNext(primeiro(busca.next));

  // Combinado com o `requireUser()`: `?sessao=expirada` diz que a pessoa foi
  // trazida para cá por uma sessão que venceu, não por um clique. O middleware
  // também usa esse parâmetro para não devolver quem chegou assim ao app.
  const sessaoExpirada = primeiro(busca[PARAM_SESSAO]) === VALOR_SESSAO_EXPIRADA;

  // O destino viaja junto nos links de saída: quem veio de `/aula/7`, clicou em
  // "criar conta" e se cadastrou continua indo parar em `/aula/7`.
  const carona = destino !== DESTINO_PADRAO ? `?next=${encodeURIComponent(destino)}` : '';

  return (
    <>
      <FormularioDeEntrada
        next={destino}
        sessaoExpirada={sessaoExpirada}
        linkCriarConta={`/criar-conta${carona}`}
        linkEsqueciSenha={`/esqueci-senha${carona}`}
      />
      {/* TEMPORÁRIO: acesso rápido de desenvolvimento. Nunca em produção. */}
      {process.env.NODE_ENV !== 'production' ? <EntradaDemo /> : null}
    </>
  );
}
