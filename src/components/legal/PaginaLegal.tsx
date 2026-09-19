import Link from 'next/link';
import type { ReactNode } from 'react';

import { LogoWSA } from '@/components/ui/LogoWSA';

/** Caixa de contato citada nos textos legais e no rodapé da landing. */
export const EMAIL_DE_CONTATO = 'contato@wsaenglish.com.br';

type PaginaLegalProps = {
  titulo: string;
  atualizadoEm: string;
  introducao: ReactNode;
  children: ReactNode;
};

/**
 * Casca das páginas `/termos` e `/privacidade`: públicas, sem JS de cliente.
 *
 * ⚠️ O aviso "Versão preliminar" só sai quando o texto passar por revisão
 * jurídica — ele diz ao leitor, com honestidade, em que pé o documento está.
 */
export function PaginaLegal({ titulo, atualizadoEm, introducao, children }: PaginaLegalProps) {
  return (
    <div className="min-h-dvh bg-bg">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-pill focus:bg-yellow focus:px-4 focus:py-2 focus:font-extrabold focus:text-navy"
      >
        Pular para o conteúdo
      </a>

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:py-5">
          <Link href="/" aria-label="WSA English, página inicial" className="inline-flex min-h-11 items-center">
            <LogoWSA fundo="claro" altura={40} compacta className="h-8! lg:h-10!" />
          </Link>
          <Link
            href="/entrar"
            className="inline-flex min-h-11 items-center rounded-pill px-4 text-[15px] font-extrabold text-navy underline underline-offset-4"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-[32px] leading-tight font-extrabold text-navy sm:text-[40px]">{titulo}</h1>
        <p className="mt-2 text-[14px] text-muted">Última atualização: {atualizadoEm}</p>

        <div
          role="note"
          className="mt-6 rounded-card border border-yellow bg-yellow/15 px-5 py-4 text-[15px] leading-relaxed text-navy"
        >
          <strong className="font-extrabold">Versão preliminar.</strong> Este texto ainda passa por revisão
          jurídica e pode mudar. Dúvidas? Escreva para{' '}
          <a href={`mailto:${EMAIL_DE_CONTATO}`} className="font-bold underline underline-offset-4">
            {EMAIL_DE_CONTATO}
          </a>
          .
        </div>

        <div className="mt-8 text-[17px] leading-relaxed text-muted-3">{introducao}</div>

        <div className="mt-10 flex flex-col gap-10">{children}</div>

        <nav aria-label="Documentos legais" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6">
          <Link href="/termos" className="inline-flex min-h-11 items-center font-bold text-navy underline underline-offset-4">
            Termos de uso
          </Link>
          <Link href="/privacidade" className="inline-flex min-h-11 items-center font-bold text-navy underline underline-offset-4">
            Política de privacidade
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center font-bold text-navy underline underline-offset-4">
            Voltar ao início
          </Link>
        </nav>
      </main>
    </div>
  );
}

export function SecaoLegal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 text-[16px] leading-relaxed text-muted-3">
      <h2 className="text-[22px] leading-snug font-extrabold text-navy">{titulo}</h2>
      {children}
    </section>
  );
}

export function ListaLegal({ itens }: { itens: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-blue">
      {itens.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
