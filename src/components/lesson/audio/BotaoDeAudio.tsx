'use client';

/**
 * Botão de ouvir ao lado de um texto da aula (pacote 08 do plano v2).
 *
 * Duas formas:
 * - grande (padrão): pastilha com o alto-falante e o nome na tela, "Ouvir
 *   pronúncia". Vai ao lado de parágrafo, frase de fecho, título de card e
 *   exemplo de regra, onde cabe texto.
 * - `compacto`: só o alto-falante, para dentro de pastilha, tabela, balão de
 *   diálogo e lista, onde o nome quebraria a linha. O nome continua no
 *   `aria-label`, que também leva a frase.
 *
 * Toque a toque: tocar, pausar (guarda a posição) e continuar de onde parou.
 * Com `clip.lento`, aparece ao lado o botão "Devagar" (80% da velocidade, mesmo
 * arquivo), como pede a seção 11 do prompt-mestre de áudios. Só um áudio toca
 * por vez: quem garante é o `tocador.ts`, não este componente.
 *
 * Área de toque de 44px nas duas formas (piso do contrato, seção 4). No
 * compacto o desenho tem 28px e os 44px vêm de um quadrado invisível (`::after`)
 * centrado no botão: essa área não ocupa espaço na linha e não empurra o texto,
 * que era o motivo das margens negativas de antes. Sem elas o botão também
 * deixa de invadir a linha de cima e a de baixo.
 *
 * A mensagem de erro visível fica no `OuvirTexto`. Aqui o erro aparece como
 * ícone vermelho e `title`.
 */
import type { AudioClip } from '@/lib/content/types';
import { cn } from '@/lib/ui/cn';

import {
  ERRO_AO_TOCAR,
  ROTULO_CONTINUAR,
  ROTULO_DEVAGAR,
  ROTULO_OUVIR_PRONUNCIA,
  ROTULO_PAUSAR,
  rotuloDeContinuar,
  rotuloDeOuvir,
  rotuloDeOuvirDevagar,
  rotuloDePausar,
} from './rotulos';
import { TAXA_DEVAGAR, TAXA_NORMAL, continuar, pausar, tocar, type EstadoDoTocador } from './tocador';
import { useEstadoDoClipe, useTaxaDoClipe } from './useEstadoDoTocador';

/** O mesmo traço dos ícones do leitor da aula. */
const TRACO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function IconeAltoFalante({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" strokeWidth="2.1" aria-hidden="true" focusable="false" {...TRACO}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/** Enquanto toca: o próximo toque pausa. */
function IconePausar({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7.6" y="5.5" width="3.6" height="13" rx="1.6" fill="currentColor" />
      <rect x="12.8" y="5.5" width="3.6" height="13" rx="1.6" fill="currentColor" />
    </svg>
  );
}

/** Pausado: o próximo toque continua de onde parou. */
function IconeContinuar({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" strokeWidth="2.4" aria-hidden="true" focusable="false" {...TRACO} fill="currentColor">
      <path d="M8.6 6.4v11.2L18 12 8.6 6.4Z" />
    </svg>
  );
}

/** O mesmo giro do `Button` (classe `iea-spinner` do globals.css). */
function IconeCarregando({ tamanho }: { tamanho: number }) {
  return (
    <svg className="iea-spinner shrink-0" width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2.6" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function IconeAlerta({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" strokeWidth="2.4" aria-hidden="true" focusable="false" {...TRACO}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function Icone({ estado, tamanho }: { estado: EstadoDoTocador; tamanho: number }) {
  if (estado === 'carregando') return <IconeCarregando tamanho={tamanho} />;
  if (estado === 'tocando') return <IconePausar tamanho={tamanho} />;
  if (estado === 'pausado') return <IconeContinuar tamanho={tamanho} />;
  if (estado === 'erro') return <IconeAlerta tamanho={tamanho} />;
  return <IconeAltoFalante tamanho={tamanho} />;
}

/** Soando agora: o botão fica aceso e o próximo toque pausa. */
function estaAtivo(estado: EstadoDoTocador): boolean {
  return estado === 'tocando' || estado === 'carregando';
}

/** Texto na tela do botão grande, um por estado. */
function textoDoBotao(estado: EstadoDoTocador): string {
  if (estaAtivo(estado)) return ROTULO_PAUSAR;
  if (estado === 'pausado') return ROTULO_CONTINUAR;
  return ROTULO_OUVIR_PRONUNCIA;
}

/**
 * Nome acessível: começa pelo texto que está na tela (WCAG 2.5.3) e termina na
 * frase que o clipe fala, para quem só ouve saber qual botão é qual.
 */
function nomeDoBotao(estado: EstadoDoTocador, texto: string): string {
  if (estaAtivo(estado)) return rotuloDePausar(texto);
  if (estado === 'pausado') return rotuloDeContinuar(texto);
  return rotuloDeOuvir(texto);
}

/**
 * Cores por estado. O contraste sobe do parado para o tocando: parado é branco
 * com borda azulada e texto navy, tocando é navy cheio, pausado é o azul claro
 * da marca com borda navy (dá para ver que o clipe está no meio).
 *
 * O azul claro do pausado são os tokens `--navy-suave` e `--navy-suave-2` do
 * globals.css. Texto navy em cima deles dá 14,13 e 12,97.
 */
function classesDoEstado(estado: EstadoDoTocador): string {
  if (estaAtivo(estado)) return 'border-navy bg-navy text-white hover:border-navy-light hover:bg-navy-light';
  if (estado === 'pausado') return 'border-navy bg-navy-suave text-navy hover:bg-navy-suave-2';
  if (estado === 'erro') return 'border-[#9B1C2E] bg-surface text-[#9B1C2E] hover:bg-[#FDF2F3]';
  return 'border-border-2 bg-surface text-navy hover:border-navy hover:bg-[#EEF3FA]';
}

/** Base das duas formas: recorte, traço de 1.5px e transição curta de cor. */
const BASE = 'cursor-pointer select-none border-[1.5px] border-solid transition-colors duration-150';

/** 44px de toque em volta de um desenho de 28px, sem ocupar espaço na linha. */
const AREA_REDONDA =
  "relative after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']";

/** 44px de altura de toque numa pastilha baixa ("Devagar" compacto). */
const AREA_LARGA =
  "relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']";

export function BotaoDeAudio({
  clip,
  textoExibido,
  compacto = false,
}: {
  clip: AudioClip;
  /** O texto que está na tela ao lado do botão. Vai para o nome acessível. */
  textoExibido: string;
  /** `true` dentro de pastilha, tabela, balão e lista: só o ícone. */
  compacto?: boolean;
}) {
  const estado = useEstadoDoClipe(clip.src);
  const taxa = useTaxaDoClipe(clip.src);
  // O mesmo arquivo toca nas duas velocidades: cada botão só acende na sua.
  const devagarAtivo = taxa === TAXA_DEVAGAR;
  const estadoNormal: EstadoDoTocador = devagarAtivo ? 'parado' : estado;
  const estadoDevagar: EstadoDoTocador = devagarAtivo ? estado : 'parado';
  const dica = estado === 'erro' ? ERRO_AO_TOCAR : undefined;

  /**
   * Tocando: pausa e guarda a posição. Pausado: continua dali. Nos demais
   * casos (parado, erro, ou o outro botão tocando): toca do começo na
   * velocidade deste botão.
   */
  function alternar(velocidade: number, estadoDoBotao: EstadoDoTocador) {
    if (estaAtivo(estadoDoBotao)) {
      pausar();
      return;
    }
    if (estadoDoBotao === 'pausado') {
      continuar();
      return;
    }
    tocar(clip.src, { taxa: velocidade });
  }

  return (
    <span className="inline-flex max-w-full flex-none flex-wrap items-center gap-2.5 align-middle">
      <button
        type="button"
        onClick={() => alternar(TAXA_NORMAL, estadoNormal)}
        aria-label={nomeDoBotao(estadoNormal, textoExibido)}
        // Aceso só enquanto este clipe soa nesta velocidade. Pausado não está soando.
        aria-pressed={estaAtivo(estadoNormal)}
        title={dica}
        className={cn(
          BASE,
          compacto
            ? cn('inline-grid size-7 flex-none place-items-center rounded-full', AREA_REDONDA)
            : 'inline-flex min-h-11 max-w-full flex-none items-center gap-2 rounded-pill px-3.5 py-2 text-left text-[15px] font-extrabold leading-[1.2] shadow-[0_1px_2px_rgba(11,31,75,0.06)]',
          classesDoEstado(estadoNormal),
        )}
      >
        <Icone estado={estadoNormal} tamanho={compacto ? 15 : 19} />
        {compacto ? null : <span>{textoDoBotao(estadoNormal)}</span>}
      </button>
      {clip.lento ? (
        <button
          type="button"
          onClick={() => alternar(TAXA_DEVAGAR, estadoDevagar)}
          aria-label={rotuloDeOuvirDevagar(textoExibido)}
          aria-pressed={estaAtivo(estadoDevagar)}
          title={dica}
          className={cn(
            BASE,
            'font-extrabold tracking-normal',
            compacto
              ? cn('inline-flex h-7 flex-none items-center rounded-pill px-2.5 text-[12px]', AREA_LARGA)
              : 'inline-flex min-h-11 flex-none items-center rounded-pill px-3.5 text-[14px]',
            classesDoEstado(estadoDevagar),
          )}
        >
          {ROTULO_DEVAGAR}
        </button>
      ) : null}
    </span>
  );
}
