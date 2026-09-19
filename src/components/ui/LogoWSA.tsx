import Image from 'next/image';
import type { CSSProperties } from 'react';

import { cn } from '@/lib/ui/cn';

export type LogoWSAProps = {
  /**
   * Sobre que fundo a logo vai. O letreiro oficial é branco; em fundo claro ele
   * some, então existe a versão com o letreiro em navy. O globo é o mesmo.
   */
  fundo: 'escuro' | 'claro';
  /**
   * Altura em px: a maior, a do desktop. A largura sai da proporção do arquivo.
   * Altura responsiva: esta vai inline, então as outras entram por classe com
   * `!`, a única que vence o inline. Ex.: `className="h-7! lg:h-10!"`.
   */
  altura?: number;
  /** Só o globo, sem o letreiro, em qualquer largura de tela. */
  soGlobo?: boolean;
  /**
   * Para barras (cabeçalho, faixa do painel): em tela com menos de 360px de
   * largura mostra só o globo; de 360px para cima, a logo completa. Ignorada
   * quando `soGlobo` vem ligada.
   */
  compacta?: boolean;
  /** Primeira dobra: a imagem carrega antes das outras. */
  prioridade?: boolean;
  /** Vai para a imagem. Use para a altura responsiva, sempre com `!`. */
  className?: string;
};

// Proporções dos arquivos de `public/brand/` (logo completa 480x154, globo
// 256x253), gerados a partir dos originais em `baclgrounds-logo-imagens/`, com
// fundo transparente.
const PROPORCAO_COMPLETA = 480 / 154;
const PROPORCAO_GLOBO = 256 / 253;

const ARQUIVO = {
  escuro: '/brand/wsa-logo-sobre-escuro.webp',
  claro: '/brand/wsa-logo-sobre-claro.webp',
} as const;
const ARQUIVO_DO_GLOBO = '/brand/wsa-globo.webp';

/** Texto alternativo. O mesmo em todas as versões: é a marca, não a figura. */
const NOME = 'WSA English';

export function LogoWSA({
  fundo,
  altura = 48,
  soGlobo = false,
  compacta = false,
  prioridade = false,
  className,
}: LogoWSAProps) {
  const classe = cn('block flex-none', className);
  const estilo: CSSProperties = { height: altura, width: 'auto' };
  const larguraCompleta = Math.round(altura * PROPORCAO_COMPLETA);
  const larguraDoGlobo = Math.round(altura * PROPORCAO_GLOBO);

  if (compacta && !soGlobo) {
    // Duas imagens, e o CSS mostra uma só pela largura da tela (`min-[360px]:`).
    // Sem `preload`: o guia do `next/image` (direção de arte) avisa que ele
    // baixaria as duas. O carregamento preguiçoso padrão baixa só a visível, e
    // `fetchPriority="high"` apressa essa quando a logo está na primeira dobra.
    const pressa = prioridade ? ('high' as const) : undefined;
    return (
      <span className="inline-flex flex-none">
        <span className="inline-flex min-[360px]:hidden">
          <Image
            src={ARQUIVO_DO_GLOBO}
            alt={NOME}
            width={larguraDoGlobo}
            height={altura}
            fetchPriority={pressa}
            className={classe}
            style={estilo}
          />
        </span>
        <span className="hidden min-[360px]:inline-flex">
          <Image
            src={ARQUIVO[fundo]}
            alt={NOME}
            width={larguraCompleta}
            height={altura}
            fetchPriority={pressa}
            className={classe}
            style={estilo}
          />
        </span>
      </span>
    );
  }

  return (
    <Image
      src={soGlobo ? ARQUIVO_DO_GLOBO : ARQUIVO[fundo]}
      alt={NOME}
      width={soGlobo ? larguraDoGlobo : larguraCompleta}
      height={altura}
      preload={prioridade}
      className={classe}
      style={estilo}
    />
  );
}

export default LogoWSA;
