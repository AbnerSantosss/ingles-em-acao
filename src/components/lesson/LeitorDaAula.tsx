'use client';

/**
 * A casca do leitor da aula: cabeçalho, barra de progresso, a página de blocos e
 * a navegação de baixo. Réplica do protótipo (`prototype/mobile.dc.html`,
 * cabeçalho ~561–580, navegação ~959–975). A partir de 1024px valem as medidas
 * do design de desktop do Claude Designer (`Ingles em Acao.dc.html`, ~577–930):
 * botão de voltar de 48px, título de 19px, cartão com 30px/28px de recuo e o
 * rótulo ANTERIOR por extenso.
 *
 * A página corrente é estado do cliente — virar página não recarrega nada do
 * servidor, porque a aula inteira já veio junto. A posição é **gravada em
 * segundo plano**: a virada nunca espera o banco. Se a gravação falhar, o aluno
 * continua lendo e só perde o "continue de onde parou" — trocar isso por uma
 * tela travada seria pior.
 *
 * Onde melhoramos o protótipo:
 *   • A troca de página é anunciada (`aria-live`) e o foco vai para o cartão da
 *     página nova — sem isso, quem usa leitor de tela fica no botão e não percebe
 *     que o conteúdo inteiro mudou.
 *   • ANTERIOR na primeira página é `disabled` de verdade, não só opacidade .45.
 *   • A rolagem para o topo é instantânea (`scrollTo(0, 0)`), como no protótipo:
 *     não há animação para `prefers-reduced-motion` desligar.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { BlockRenderer } from '@/components/lesson/BlockRenderer';
import type { LinksDeCompra, Plano } from '@/components/lesson/blocks/interativos';
import type { Lesson } from '@/lib/content/types';

export type PropsDoLeitor = {
  /** A aula inteira, com todas as páginas. */
  aula: Lesson;
  /** Slug da rota — usado para ir ao resultado. */
  slug: string;
  /** Tempo estimado já formatado ("8 a 12 minutos"). */
  tempo: string;
  /** `LessonProgress.currentPage` — já com clamp feito no servidor. */
  paginaInicial: number;
  plano: Plano;
  /**
   * A aula tem o painel de videoaula na tela (`#videoaula`). O `cta` de vídeo
   * passa a levar até ele em vez de dizer "em produção".
   */
  temVideoaula?: boolean;
  /** Checkout por plano, para o `cta` de quem ainda não tem o recurso. */
  linksDeCompra?: LinksDeCompra;
  /** Grava a posição. Não bloqueia a virada; falhar aqui é silencioso. */
  aoVirarPagina: (pagina: number) => Promise<void>;
  /** Fecha a aula. O placar é recontado no servidor, nunca enviado daqui. */
  aoConcluir: () => Promise<{ ok: boolean; erro?: string }>;
};

const TRACO_ICONE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const FALHA_AO_CONCLUIR =
  'Não conseguimos registrar sua conclusão agora. Sua aula continua aqui — tente de novo em instantes.';

export function LeitorDaAula({
  aula,
  slug,
  tempo,
  paginaInicial,
  plano,
  temVideoaula = false,
  linksDeCompra,
  aoVirarPagina,
  aoConcluir,
}: PropsDoLeitor) {
  const total = Math.max(aula.pages.length, 1);
  const ultima = total - 1;

  const [pagina, setPagina] = useState(() =>
    Math.min(Math.max(Math.trunc(paginaInicial), 0), ultima),
  );
  const [erro, setErro] = useState<string | null>(null);
  const [concluindo, iniciarConclusao] = useTransition();

  const router = useRouter();
  const cartaoRef = useRef<HTMLElement | null>(null);
  const jaMontou = useRef(false);

  // A montagem não mexe na rolagem nem no foco: o aluno acabou de chegar e pode
  // estar retomando a aula no meio. Só as viradas seguintes reposicionam.
  useEffect(() => {
    if (!jaMontou.current) {
      jaMontou.current = true;
      return;
    }
    window.scrollTo(0, 0);
    cartaoRef.current?.focus();
  }, [pagina]);

  const irPara = useCallback(
    (destino: number) => {
      setPagina(destino);
      setErro(null);
      startTransition(async () => {
        try {
          await aoVirarPagina(destino);
        } catch {
          // A leitura não depende da gravação: a página já virou na tela.
        }
      });
    },
    [aoVirarPagina],
  );

  const avancar = useCallback(() => {
    if (pagina < ultima) {
      irPara(pagina + 1);
      return;
    }

    iniciarConclusao(async () => {
      try {
        const resultado = await aoConcluir();
        if (!resultado.ok) {
          setErro(resultado.erro ?? FALHA_AO_CONCLUIR);
          return;
        }
        setErro(null);
        router.push(`/aula/${slug}/resultado`);
      } catch {
        setErro(FALHA_AO_CONCLUIR);
      }
    });
  }, [aoConcluir, irPara, pagina, router, slug, ultima]);

  const blocos = aula.pages[pagina]?.blocks ?? [];
  const percentual = Math.round(((pagina + 1) / total) * 100);
  const naUltima = pagina === ultima;
  const rotuloDoAvanco = naUltima ? 'CONCLUIR AULA' : 'PRÓXIMA PÁGINA';

  return (
    <div className="flex flex-col">
      {/* ───────────────────────────── cabeçalho ───────────────────────────── */}
      {/* No desktop, as medidas do design do Claude Designer (48px, 19px, 16px). */}
      <div className="mb-3 flex items-center gap-[10px] lg:mb-[14px] lg:gap-[14px]">
        <Link
          href="/trilha"
          aria-label="Voltar para a trilha"
          className="grid size-[46px] flex-none place-items-center rounded-[15px] lg:size-12 bg-surface text-navy shadow-[0_4px_14px_rgba(11,31,75,.08)] transition-colors hover:text-navy-light"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2.6" aria-hidden="true" {...TRACO_ICONE}>
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
          </svg>
        </Link>

        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="m-0 text-[13px] font-extrabold tracking-[.11em] text-blue">
            {aula.code} · PÁGINA {pagina + 1} DE {total}
          </p>
          <p className="m-0 truncate text-[16px] font-black text-navy lg:text-[19px]">{aula.title}</p>
        </div>

        <p className="m-0 flex flex-none items-center gap-[9px] rounded-pill bg-surface px-[13px] py-[9px] shadow-[0_4px_14px_rgba(11,31,75,.08)] lg:px-[18px] lg:py-[10px]">
          <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2.3" className="text-navy" aria-hidden="true" {...TRACO_ICONE}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
          </svg>
          <span className="whitespace-nowrap text-[13px] font-extrabold text-navy lg:text-[16px]">{tempo}</span>
          <span className="sr-only">de leitura estimada</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Progresso na aula"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={pagina + 1}
        aria-valuetext={`Página ${pagina + 1} de ${total}`}
        className="mb-5 h-[10px] overflow-hidden rounded-pill bg-[#E3EAF3]"
      >
        <div className="h-full rounded-pill bg-teal" style={{ width: `${percentual}%` }} />
      </div>

      {/* ─────────────────────────── a página atual ────────────────────────── */}
      <section
        ref={cartaoRef}
        tabIndex={-1}
        aria-label={`Página ${pagina + 1} de ${total} — ${aula.title}`}
        className="flex flex-col gap-4 rounded-card bg-surface px-4 py-[18px] shadow-[0_10px_34px_rgba(11,31,75,.06)] lg:gap-[18px] lg:rounded-[24px] lg:px-7 lg:py-[30px]"
      >
        {blocos.map((bloco, i) => (
          <div key={`${pagina}-${i}`}>
            <BlockRenderer
              bloco={bloco}
              lessonId={aula.id}
              plano={plano}
              temVideoaula={temVideoaula}
              linksDeCompra={linksDeCompra}
            />
          </div>
        ))}
      </section>

      {erro === null ? null : (
        <p
          role="alert"
          className="m-0 mt-3 rounded-card border-[1.5px] border-solid border-[#F9D3D9] bg-[#FEF0F2] px-4 py-3 text-[14px] font-bold leading-snug text-[#B21F31]"
        >
          {erro}
        </p>
      )}

      {/* ───────────────────────────── navegação ───────────────────────────── */}
      {/*
        Fica colada acima da BottomNav (que o layout do app já reserva) e, por ser
        `sticky` dentro do fluxo, ocupa espaço no fim da coluna: nunca cobre o
        último bloco da página.
      */}
      <div
        className="sticky z-30 mt-[18px] flex gap-2 lg:mt-5 lg:gap-[10px]"
        style={{ bottom: 'calc(var(--altura-nav) + 10px + env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={() => irPara(pagina - 1)}
          disabled={pagina === 0}
          aria-label="Página anterior"
          className="flex min-h-[44px] flex-none items-center gap-[10px] rounded-pill border-[1.5px] border-solid border-border bg-surface px-[18px] py-[15px] text-[16px] font-extrabold text-navy transition-colors hover:border-navy-light disabled:cursor-not-allowed disabled:opacity-[.45] disabled:hover:border-border sm:px-6 sm:py-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2.6" aria-hidden="true" {...TRACO_ICONE}>
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
          </svg>
          {/* Em 375px só cabe a seta; com espaço, o rótulo do design volta. */}
          <span aria-hidden="true" className="hidden sm:inline">
            ANTERIOR
          </span>
        </button>

        <button
          type="button"
          onClick={avancar}
          disabled={concluindo}
          aria-busy={concluindo || undefined}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-3 rounded-pill bg-navy px-6 py-4 text-[16px] font-extrabold tracking-[.02em] text-white transition-colors hover:bg-navy-light disabled:opacity-70"
        >
          {concluindo ? 'CONCLUINDO…' : rotuloDoAvanco}
          <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.6" aria-hidden="true" {...TRACO_ICONE}>
            <path d="M4 12h15" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
