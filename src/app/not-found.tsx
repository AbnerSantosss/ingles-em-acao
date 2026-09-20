import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { LogoWSA } from '@/components/ui/LogoWSA';
import { NOME_COOKIE_SESSAO } from '@/lib/auth/next-url';

/**
 * Tela de endereço inexistente (404) com a marca, no lugar da tela padrão do
 * Next, que vem em inglês e sem logo.
 *
 * O caminho de volta muda com quem está lendo: aluno com sessão vai para
 * `/inicio`, visitante vai para a landing. A conferência é só a presença do
 * cookie, sem consultar o banco: numa 404 não vale a pena abrir conexão, e um
 * cookie vencido acaba em `/entrar` de qualquer forma, porque `/inicio` exige
 * sessão válida. É a mesma peneira que o middleware faz.
 *
 * Ler o cookie deixa esta tela dinâmica. É o preço de mandar cada pessoa para o
 * lugar certo, e 404 não é rota de volume.
 */
export const metadata: Metadata = {
  // O modelo do layout raiz completa: "Página não encontrada · WSA English".
  title: 'Página não encontrada',
  description: 'Este endereço não existe no WSA English.',
};

const BOTAO = [
  'mt-7 inline-flex h-[54px] w-full items-center justify-center gap-3 sm:w-auto',
  'rounded-pill bg-navy px-7 text-[17px] font-extrabold tracking-[0.03em] text-white',
  'transition-colors duration-150 hover:bg-navy-light',
].join(' ');

export default async function PaginaNaoEncontrada() {
  const armazem = await cookies();
  const temSessao = Boolean(armazem.get(NOME_COOKIE_SESSAO)?.value);

  const destino = temSessao ? '/inicio' : '/';
  const rotulo = temSessao ? 'Voltar para as minhas aulas' : 'Ir para a página inicial';

  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <main className="w-full max-w-[460px]">
        <div className="mb-[26px] flex justify-center">
          <Link href={destino} aria-label="WSA English, página inicial" className="inline-flex rounded-field">
            <LogoWSA fundo="claro" altura={52} prioridade className="h-11! sm:h-13!" />
          </Link>
        </div>

        <section className="rounded-hero bg-surface px-[22px] py-8 text-center shadow-hero sm:px-[34px] sm:py-10">
          <p className="m-0 text-[13px] font-extrabold tracking-[0.1em] text-muted-2 uppercase">Erro 404</p>

          <h1 className="mt-2 text-[28px] leading-tight font-black text-navy sm:text-[32px]">
            Página não encontrada
          </h1>

          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            Este endereço não existe ou saiu do ar. Confira o link, ou volte e siga a partir daí.
          </p>

          <Link href={destino} className={BOTAO}>
            {rotulo}
          </Link>
        </section>
      </main>
    </div>
  );
}
