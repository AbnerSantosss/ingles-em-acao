'use client';

/**
 * A casca do leitor da aula, em tela cheia (plano v2, pacote 05; 01-CONTRATOS §4).
 *
 * Três faixas numa grade da altura exata da tela (`.casca-aula`, `100dvh`):
 *   1. topo fixo: voltar para a trilha, código e página, título, tempo e a barra
 *      de progresso;
 *   2. miolo: a única parte que rola (videoaula, quando houver, e o cartão da
 *      página);
 *   3. base fixa: ANTERIOR e PRÓXIMA PÁGINA (ou CONCLUIR AULA), sempre à vista.
 * Atrás de tudo, parado, o fundo da WSA (`FundoDaAula`). O cabeçalho e a barra de
 * navegação do app somem nesta tela (modo foco, `MolduraDoApp`).
 *
 * Tamanhos de texto e de botão vêm dos tokens por dispositivo (`fs-rotulo`,
 * `fs-leitura`, `fs-apoio`, `fs-botao`, `alt-botao` em `globals.css`), nunca de
 * `text-[Npx]` solto.
 *
 * A página corrente é estado do cliente: virar página não recarrega nada do
 * servidor, porque a aula inteira já veio junto. A posição é **gravada em
 * segundo plano**: a virada nunca espera o banco. Se a gravação falhar, o aluno
 * continua lendo e só perde o "continue de onde parou". Trocar isso por uma
 * tela travada seria pior.
 *
 * Acessibilidade:
 *   • A troca de página é anunciada (`aria-live`) e o foco vai para o cartão da
 *     página nova. Sem isso, quem usa leitor de tela fica no botão e não percebe
 *     que o conteúdo inteiro mudou.
 *   • ANTERIOR na primeira página é `disabled` de verdade, não só opacidade.
 *   • A volta ao topo do miolo é instantânea: não há animação para
 *     `prefers-reduced-motion` desligar.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react';

import { BlockRenderer, type PropsDoBlockRenderer } from '@/components/lesson/BlockRenderer';
import { FundoDaAula } from '@/components/lesson/FundoDaAula';
import { ProvedorDeAudio } from '@/components/lesson/audio/ContextoDeAudio';
import type { Lesson } from '@/lib/content/types';

export type PropsDoLeitor = {
  /** A aula inteira, com todas as páginas. */
  aula: Lesson;
  /** Slug da rota, usado para ir ao resultado. */
  slug: string;
  /** Tempo estimado já formatado ("8 a 12 minutos"). */
  tempo: string;
  /** `LessonProgress.currentPage`, já com clamp feito no servidor. */
  paginaInicial: number;
  /** Plano do aluno. O tipo vem do `BlockRenderer`, que o repassa ao cartão do fim. */
  plano: NonNullable<PropsDoBlockRenderer['plano']>;
  /**
   * A aula tem o painel de videoaula na tela (`#videoaula`). O `cta` de vídeo
   * passa a levar até ele em vez de dizer "em produção".
   */
  temVideoaula?: boolean;
  /** Checkout, para o `cta` de quem ainda não tem o recurso. */
  linksDeCompra?: PropsDoBlockRenderer['linksDeCompra'];
  /** Prompt de prática da aula (01-CONTRATOS §3.3). Só repassado ao `BlockRenderer`. */
  pratica: NonNullable<PropsDoBlockRenderer['pratica']>;
  /**
   * O painel de videoaula, já montado pela página (com `id="videoaula"`). Entra no
   * topo do miolo, acima do cartão, e rola junto com ele.
   */
  videoaula?: ReactNode;
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
  'Não conseguimos registrar sua conclusão agora. Sua aula continua aqui: tente de novo em instantes.';

export function LeitorDaAula({
  aula,
  slug,
  tempo,
  paginaInicial,
  plano,
  temVideoaula = false,
  linksDeCompra,
  pratica,
  videoaula,
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
  const mioloRef = useRef<HTMLDivElement | null>(null);
  const cartaoRef = useRef<HTMLElement | null>(null);
  const paginaExibida = useRef(pagina);
  const idDoRotulo = useId();
  const idDoTitulo = useId();

  // A montagem não mexe na rolagem nem no foco: o aluno acabou de chegar e pode
  // estar retomando a aula no meio. Só uma virada de verdade (a página mudou)
  // leva o miolo ao topo e o foco ao cartão. Comparar com a última página
  // exibida, e não usar um "já montou", faz o efeito duplo do modo estrito do
  // React não roubar o foco na entrada.
  useEffect(() => {
    if (paginaExibida.current === pagina) return;
    paginaExibida.current = pagina;
    mioloRef.current?.scrollTo({ top: 0, left: 0 });
    cartaoRef.current?.focus({ preventScroll: true });
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

  const paginaAtual = aula.pages[pagina];
  const blocos = paginaAtual?.blocks ?? [];
  const percentual = Math.round(((pagina + 1) / total) * 100);
  const naUltima = pagina === ultima;
  const rotuloDoAvanco = naUltima ? 'CONCLUIR AULA' : 'PRÓXIMA PÁGINA';

  return (
    <>
      <FundoDaAula />

      <div className="casca-aula">
        {/* ─────────────────────────────── topo ─────────────────────────────── */}
        <div className="casca-aula__topo">
          <div className="coluna-aula casca-aula__controles">
            <Link
              href="/trilha"
              aria-label="Voltar para a trilha"
              className="alvo-toque grid size-11 flex-none place-items-center rounded-[14px] border-[1.5px] border-solid border-border bg-surface text-navy transition-colors hover:border-navy-light hover:text-navy-light"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2.6" aria-hidden="true" {...TRACO_ICONE}>
                <path d="M19 12H5" />
                <path d="m11 6-6 6 6 6" />
              </svg>
            </Link>

            <div className="min-w-0 flex-1">
              <p
                id={idDoRotulo}
                aria-live="polite"
                className="fs-rotulo m-0 truncate font-extrabold leading-tight tracking-[.08em] text-blue"
              >
                {aula.code} · PÁGINA {pagina + 1} DE {total}
              </p>
              <p id={idDoTitulo} className="fs-leitura m-0 truncate font-black leading-tight text-navy">
                {aula.title}
              </p>
            </div>

            {/* O tempo estimado some abaixo de 640px: ali o título precisa do espaço. */}
            <p className="m-0 hidden flex-none items-center gap-2 rounded-pill border-[1.5px] border-solid border-border bg-surface px-3 py-1.5 sm:flex">
              <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2.3" className="text-navy" aria-hidden="true" {...TRACO_ICONE}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </svg>
              <span className="fs-rotulo whitespace-nowrap font-extrabold text-navy">{tempo}</span>
              <span className="sr-only">de leitura estimada</span>
            </p>
          </div>

          <div className="coluna-aula casca-aula__progresso">
            <div
              role="progressbar"
              aria-label="Progresso na aula"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={pagina + 1}
              aria-valuetext={`Página ${pagina + 1} de ${total}`}
              className="h-full overflow-hidden rounded-pill bg-[#E3EAF3]"
            >
              <div className="h-full rounded-pill bg-teal" style={{ width: `${percentual}%` }} />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────── miolo ────────────────────────────── */}
        <div ref={mioloRef} className="casca-aula__miolo">
          <div className="coluna-aula casca-aula__conteudo">
            {videoaula ? <div className="mb-4">{videoaula}</div> : null}

            {/* Um provedor de áudio por página: a chave nova desmonta o anterior. */}
            <ProvedorDeAudio key={pagina} audios={paginaAtual?.audios}>
              <section
                ref={cartaoRef}
                tabIndex={-1}
                aria-labelledby={`${idDoRotulo} ${idDoTitulo}`}
                data-cartao-da-pagina=""
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
                      pratica={pratica}
                    />
                  </div>
                ))}
              </section>
            </ProvedorDeAudio>
          </div>
        </div>

        {/* ─────────────────────────────── base ─────────────────────────────── */}
        <nav aria-label="Navegação da aula" className="casca-aula__base">
          <div className="coluna-aula casca-aula__acoes">
            {erro === null ? null : (
              <p
                role="alert"
                className="fs-apoio m-0 rounded-card border-[1.5px] border-solid border-[#F9D3D9] bg-[#FEF0F2] px-4 py-2.5 font-bold leading-snug text-[#B21F31]"
              >
                {erro}
              </p>
            )}

            <div className="flex gap-2 lg:gap-[10px]">
              <button
                type="button"
                onClick={() => irPara(pagina - 1)}
                disabled={pagina === 0}
                aria-label="Página anterior"
                className="alt-botao fs-botao flex flex-none items-center justify-center gap-[10px] rounded-pill border-[1.5px] border-solid border-border bg-surface px-[18px] font-extrabold text-navy transition-colors hover:border-navy-light disabled:cursor-not-allowed disabled:opacity-[.45] disabled:hover:border-border sm:px-6"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2.6" aria-hidden="true" {...TRACO_ICONE}>
                  <path d="M19 12H5" />
                  <path d="m11 6-6 6 6 6" />
                </svg>
                {/* No celular só cabe a seta; com espaço, o rótulo do design volta. */}
                <span aria-hidden="true" className="hidden sm:inline">
                  ANTERIOR
                </span>
              </button>

              <button
                type="button"
                onClick={avancar}
                disabled={concluindo}
                aria-busy={concluindo || undefined}
                className="alt-botao fs-botao flex min-w-0 flex-1 items-center justify-center gap-3 rounded-pill bg-navy px-4 font-extrabold tracking-[.02em] text-white transition-colors hover:bg-navy-light disabled:opacity-70 sm:px-6"
              >
                {concluindo ? 'CONCLUINDO…' : rotuloDoAvanco}
                <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.6" aria-hidden="true" {...TRACO_ICONE}>
                  <path d="M4 12h15" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
