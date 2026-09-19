'use client';

/**
 * Texto da aula com botão de ouvir (pacote 08 do plano v2).
 *
 * Pergunta ao `ProvedorDeAudio` se a página tem um clipe cuja âncora é este
 * texto. Não tem: devolve só o texto, sem nenhuma caixa a mais, e a página fica
 * igual à de antes do áudio. Tem: põe o botão ao lado do texto. O texto continua
 * visível e o áudio diz o mesmo que ele (prompt-mestre de áudios, seção 16).
 *
 * Formas:
 * - 'linha' (padrão): o botão vem logo depois do texto, na mesma linha. Serve
 *   para palavra, célula de tabela, título curto e fala de diálogo.
 * - 'lado': o texto ocupa a largura e o botão fica na coluna da direita. Serve
 *   para parágrafo e linha de lista.
 */
import type { ReactNode } from 'react';

import { BotaoDeAudio } from './BotaoDeAudio';
import { useClip } from './ContextoDeAudio';
import { ERRO_AO_TOCAR } from './rotulos';
import { useEstadoDoClipe } from './useEstadoDoTocador';

/** Aviso de falha. Visível embaixo do texto, ou só para leitor de tela dentro de pastilha e balão. */
function MensagemDeErro({ src, visivel }: { src: string; visivel: boolean }) {
  const estado = useEstadoDoClipe(src);
  if (estado !== 'erro') return null;
  return (
    <span
      role="alert"
      className={visivel ? 'mt-1 block text-[14px] font-bold leading-[1.35] text-[#9B1C2E]' : 'sr-only'}
    >
      {ERRO_AO_TOCAR}
    </span>
  );
}

export function OuvirTexto({
  texto,
  children,
  forma = 'linha',
  compacto = false,
}: {
  /** O texto exato que está na tela. É ele que casa com a âncora do clipe. */
  texto: string;
  /** O texto já desenhado pelo bloco, com as classes dele. */
  children: ReactNode;
  forma?: 'linha' | 'lado';
  compacto?: boolean;
}) {
  const clip = useClip(texto);
  if (!clip) return <>{children}</>;

  if (forma === 'lado') {
    return (
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">{children}</div>
          <BotaoDeAudio clip={clip} textoExibido={texto} compacto={compacto} />
        </div>
        <MensagemDeErro src={clip.src} visivel />
      </div>
    );
  }

  return (
    <>
      <span className="inline-flex max-w-full items-center gap-2 align-middle">
        <span className="min-w-0">{children}</span>
        <BotaoDeAudio clip={clip} textoExibido={texto} compacto={compacto} />
      </span>
      <MensagemDeErro src={clip.src} visivel={!compacto} />
    </>
  );
}
