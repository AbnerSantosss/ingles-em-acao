'use client';

/**
 * Botão de ouvir ao lado de um texto da aula (pacote 08 do plano v2).
 *
 * Um toque toca. Outro toque, enquanto toca, para. Com `clip.lento`, aparece ao
 * lado o botão "Devagar" (80% da velocidade, mesmo arquivo), como pede a seção 11
 * do prompt-mestre de áudios. Só um áudio toca por vez: quem garante é o
 * `tocador.ts`, não este componente.
 *
 * O botão tem sempre 44px de altura de área de toque (piso do contrato, seção 4).
 * No `compacto`, para dentro de pastilha, tabela, balão e lista, o desenho tem
 * 28px e fica no meio da área; margens negativas fazem o botão ocupar na linha o
 * espaço de um ícone pequeno, sem empurrar o texto nem a tabela.
 *
 * A mensagem de erro visível fica no `OuvirTexto`. Aqui o erro aparece como
 * ícone vermelho e `title`.
 */
import type { AudioClip } from '@/lib/content/types';
import { cn } from '@/lib/ui/cn';

import { ERRO_AO_TOCAR, ROTULO_DEVAGAR, rotuloDeOuvir, rotuloDeOuvirDevagar } from './rotulos';
import { TAXA_DEVAGAR, TAXA_NORMAL, parar, tocar, type EstadoDoTocador } from './tocador';
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
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" strokeWidth="2.2" aria-hidden="true" focusable="false" {...TRACO}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function IconeParar({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
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
  if (estado === 'tocando') return <IconeParar tamanho={tamanho} />;
  if (estado === 'erro') return <IconeAlerta tamanho={tamanho} />;
  return <IconeAltoFalante tamanho={tamanho} />;
}

/** Tocando ou carregando: o botão fica aceso e o próximo toque para. */
function estaAtivo(estado: EstadoDoTocador): boolean {
  return estado === 'tocando' || estado === 'carregando';
}

/** Cores do desenho. O `group-hover` vem do botão, que é maior que o desenho no compacto. */
function classesDoEstado(estado: EstadoDoTocador): string {
  if (estaAtivo(estado)) return 'border-navy bg-navy text-white';
  if (estado === 'erro') return 'border-[#9B1C2E] bg-surface text-[#9B1C2E]';
  return 'border-border bg-surface text-navy group-hover:border-navy';
}

export function BotaoDeAudio({
  clip,
  textoExibido,
  compacto = false,
}: {
  clip: AudioClip;
  /** O texto que está na tela ao lado do botão. Vai para o nome acessível. */
  textoExibido: string;
  compacto?: boolean;
}) {
  const estado = useEstadoDoClipe(clip.src);
  const taxa = useTaxaDoClipe(clip.src);
  // O mesmo arquivo toca nas duas velocidades: cada botão só acende na sua.
  const devagarAtivo = taxa === TAXA_DEVAGAR;
  const estadoNormal: EstadoDoTocador = devagarAtivo ? 'parado' : estado;
  const estadoDevagar: EstadoDoTocador = devagarAtivo ? estado : 'parado';
  const dica = estado === 'erro' ? ERRO_AO_TOCAR : undefined;

  function alternar(velocidade: number, estadoDoBotao: EstadoDoTocador) {
    if (estaAtivo(estadoDoBotao)) {
      parar();
      return;
    }
    tocar(clip.src, { taxa: velocidade });
  }

  return (
    <span className="inline-flex flex-none items-center gap-2 align-middle">
      <button
        type="button"
        onClick={() => alternar(TAXA_NORMAL, estadoNormal)}
        aria-label={rotuloDeOuvir(textoExibido)}
        aria-pressed={estaAtivo(estadoNormal)}
        title={dica}
        className={cn(
          'group grid size-11 flex-none cursor-pointer place-items-center rounded-full',
          // 44px de área, 28px x 20px de espaço na linha.
          compacto && '-mx-2 -my-3',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'grid place-items-center rounded-full border border-solid transition-colors',
            compacto ? 'size-7' : 'size-11',
            classesDoEstado(estadoNormal),
          )}
        >
          <Icone estado={estadoNormal} tamanho={compacto ? 14 : 20} />
        </span>
      </button>
      {clip.lento ? (
        <button
          type="button"
          onClick={() => alternar(TAXA_DEVAGAR, estadoDevagar)}
          aria-label={rotuloDeOuvirDevagar(textoExibido)}
          aria-pressed={estaAtivo(estadoDevagar)}
          title={dica}
          className={cn(
            'group inline-flex h-11 flex-none cursor-pointer items-center rounded-pill',
            // 44px de altura de área, 20px de espaço na linha.
            compacto && '-my-3',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex items-center rounded-pill border border-solid font-extrabold tracking-normal transition-colors',
              compacto ? 'h-7 px-2.5 text-[12px]' : 'h-11 px-3.5 text-[14px]',
              classesDoEstado(estadoDevagar),
            )}
          >
            {ROTULO_DEVAGAR}
          </span>
        </button>
      ) : null}
    </span>
  );
}
