/**
 * Especificações de mídia — a fonte única do que o painel pede antes de cada
 * envio (imagem de bloco, capa da aula, vídeo da aula).
 *
 * ⚠️ **Uma fonte só.** Os limites que **bloqueiam** (tamanho máximo, formatos)
 * não são redigitados aqui: vêm de `./tipos` (imagem) e de `@/lib/video/envio`
 * (vídeo), as mesmas constantes que `conferirImagem` e `conferirArquivoDeVideo`
 * usam para recusar o arquivo. Este módulo só acrescenta o que é
 * **recomendação** (proporção, dimensões, peso alvo) e monta o texto que o
 * quadro de especificações e as mensagens de erro mostram. Mudou o limite lá,
 * mudou o quadro aqui — sem ninguém lembrar de atualizar um texto solto.
 *
 * As proporções espelham as caixas do renderer da aula
 * (`src/components/lesson/blocks/cartoes.tsx`): o bloco `image` é 16/9, os
 * itens de `cards` e `steps` são 16/10 e a foto do `profile` tem 190 px de
 * altura. A ilustração é recortada com `object-fit: cover`, então uma imagem
 * fora da proporção **perde as bordas** sem erro nenhum — por isso o painel
 * avisa depois do envio quando a proporção lida foge da recomendada.
 *
 * Módulo puro (importável do cliente): nada de `node:*`, Prisma ou `process.env`.
 */
import {
  ACEITE_DE_VIDEO,
  ALVO_DO_VIDEO,
  FORMATOS_DE_VIDEO,
  TAMANHO_MAXIMO_VIDEO,
} from '@/lib/video/envio';

import {
  FORMATOS_DE_IMAGEM,
  FORMATOS_EM_TEXTO,
  TAMANHO_MAXIMO_IMAGEM,
  formatarBytes,
} from './tipos';

// ───────────────────────────────── imagem ────────────────────────────────────

/** Onde a imagem vai morar. Cada lugar tem a sua caixa na tela do aluno. */
export type AlvoDeImagem = 'ilustracao' | 'cartao' | 'perfil' | 'capa';

export type EspecificacaoDeImagem = {
  alvo: AlvoDeImagem;
  /** "Ilustração do bloco", "Capa da aula"... */
  rotulo: string;
  /** Proporção em texto ("16:9"). */
  proporcao: string;
  /** Largura ÷ altura da proporção recomendada. */
  razao: number;
  /** Dimensões recomendadas, em px. */
  recomendado: { largura: number; altura: number };
  /** Abaixo disto a imagem fica borrada nas telas grandes. */
  minimo: { largura: number; altura: number };
  /** Onde a imagem aparece, em uma frase. */
  onde: string;
  /** Observação de enquadramento (o que o recorte faz). */
  enquadramento: string;
};

/** Peso alvo de uma imagem de aula. Não bloqueia — o teto é {@link TAMANHO_MAXIMO_IMAGEM}. */
export const PESO_ALVO_IMAGEM = 500 * 1024;

/** Formato sugerido para chegar no peso alvo. */
export const FORMATO_SUGERIDO_IMAGEM = 'WebP (qualidade ~80)';

/**
 * Tolerância da proporção antes do aviso "foge da proporção": 8% para mais ou
 * para menos. Um 1600×880 passa; um quadrado numa caixa 16:9 não.
 */
export const TOLERANCIA_DE_PROPORCAO = 0.08;

export const ESPECIFICACOES_DE_IMAGEM: Readonly<Record<AlvoDeImagem, EspecificacaoDeImagem>> = {
  ilustracao: {
    alvo: 'ilustracao',
    rotulo: 'Ilustração do bloco',
    proporcao: '16:9',
    razao: 16 / 9,
    recomendado: { largura: 1600, altura: 900 },
    minimo: { largura: 1280, altura: 720 },
    onde: 'Bloco de ilustração da página, na largura inteira da coluna da aula.',
    enquadramento: 'A caixa é 16:9 e recorta o que sobrar: mantenha o assunto longe das bordas.',
  },
  cartao: {
    alvo: 'cartao',
    rotulo: 'Foto de cartão ou passo',
    proporcao: '16:10',
    razao: 16 / 10,
    recomendado: { largura: 1280, altura: 800 },
    minimo: { largura: 960, altura: 600 },
    onde: 'Foto no topo de um cartão (bloco de cartões) ou de um passo (bloco de passos).',
    enquadramento: 'A caixa é 16:10 e recorta o que sobrar; em duas colunas ela fica estreita.',
  },
  perfil: {
    alvo: 'perfil',
    rotulo: 'Foto do cartão de personagem',
    proporcao: '4:3',
    razao: 4 / 3,
    recomendado: { largura: 1200, altura: 900 },
    minimo: { largura: 800, altura: 600 },
    onde: 'Foto ao lado dos fatos do personagem, com 190 px de altura fixa.',
    enquadramento:
      'A largura da caixa muda com a tela (mais estreita no celular): deixe o rosto no centro.',
  },
  capa: {
    alvo: 'capa',
    rotulo: 'Capa da aula',
    proporcao: '3:1',
    razao: 3,
    recomendado: { largura: 2172, altura: 724 },
    minimo: { largura: 1500, altura: 500 },
    onde: 'Faixa larga de capa da aula — o mesmo formato das capas 01 a 10 (2172 × 724 px).',
    enquadramento: 'Faixa panorâmica: título e assunto no terço central.',
  },
};

/** Os formatos de imagem para o `accept` do `<input type="file">`. */
export const ACEITE_DE_IMAGEM = [
  ...FORMATOS_DE_IMAGEM.map((formato): string => formato.mime),
  ...FORMATOS_DE_IMAGEM.map((formato) => `.${formato.ext}`),
  '.jpeg',
].join(',');

/** Uma linha do quadro de especificações: rótulo + valor. */
export type LinhaDeEspecificacao = { rotulo: string; valor: string };

/** O quadro inteiro de uma imagem, pronto para a tela. */
export function linhasDaEspecificacaoDeImagem(alvo: AlvoDeImagem): LinhaDeEspecificacao[] {
  const espec = ESPECIFICACOES_DE_IMAGEM[alvo];
  return [
    { rotulo: 'Formatos', valor: `${FORMATOS_EM_TEXTO}. SVG, GIF e HEIC não são aceitos.` },
    { rotulo: 'Tamanho máximo', valor: `${formatarBytes(TAMANHO_MAXIMO_IMAGEM)} por arquivo` },
    {
      rotulo: 'Proporção',
      valor: `${espec.proporcao} — ${espec.enquadramento}`,
    },
    {
      rotulo: 'Dimensões',
      valor:
        `recomendado ${espec.recomendado.largura} × ${espec.recomendado.altura} px; ` +
        `mínimo ${espec.minimo.largura} × ${espec.minimo.altura} px`,
    },
    {
      rotulo: 'Peso alvo',
      valor: `até ${formatarBytes(PESO_ALVO_IMAGEM)} — exporte em ${FORMATO_SUGERIDO_IMAGEM}`,
    },
    { rotulo: 'Onde aparece', valor: espec.onde },
  ];
}

/** Resumo de uma linha ("PNG, JPEG ou WebP · até 5,0 MB · 16:9, 1600 × 900 px"). */
export function resumoDaEspecificacaoDeImagem(alvo: AlvoDeImagem): string {
  const espec = ESPECIFICACOES_DE_IMAGEM[alvo];
  return (
    `${FORMATOS_EM_TEXTO} · até ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)} · ` +
    `${espec.proporcao}, ${espec.recomendado.largura} × ${espec.recomendado.altura} px · ` +
    `alvo ≤ ${formatarBytes(PESO_ALVO_IMAGEM)}`
  );
}

/** Lê o alvo de um campo de formulário; qualquer outra coisa vira `null`. */
export function lerAlvoDeImagem(valor: unknown): AlvoDeImagem | null {
  return typeof valor === 'string' && Object.hasOwn(ESPECIFICACOES_DE_IMAGEM, valor)
    ? (valor as AlvoDeImagem)
    : null;
}

/**
 * Os avisos que **não** bloqueiam, depois de ler largura e altura: proporção
 * fora da caixa, imagem pequena demais, arquivo acima do peso alvo. Cada aviso
 * repete a especificação que ele confere.
 */
export function avisosDaImagem(
  alvo: AlvoDeImagem,
  medidas: { width: number | null; height: number | null; bytes: number },
): string[] {
  const espec = ESPECIFICACOES_DE_IMAGEM[alvo];
  const avisos: string[] = [];
  const { width, height, bytes } = medidas;

  if (width !== null && height !== null && width > 0 && height > 0) {
    const razao = width / height;
    if (Math.abs(razao / espec.razao - 1) > TOLERANCIA_DE_PROPORCAO) {
      avisos.push(
        `A imagem tem ${width} × ${height} px, fora da proporção ${espec.proporcao} ` +
          `pedida para "${espec.rotulo}" (ex.: ${espec.recomendado.largura} × ${espec.recomendado.altura} px). ` +
          'A aula vai recortar as bordas.',
      );
    }
    if (width < espec.minimo.largura || height < espec.minimo.altura) {
      avisos.push(
        `A imagem tem ${width} × ${height} px, abaixo do mínimo de ` +
          `${espec.minimo.largura} × ${espec.minimo.altura} px para "${espec.rotulo}". ` +
          'Ela pode ficar borrada em telas grandes.',
      );
    }
  }

  if (bytes > PESO_ALVO_IMAGEM) {
    avisos.push(
      `O arquivo tem ${formatarBytes(bytes)}, acima do peso alvo de ${formatarBytes(PESO_ALVO_IMAGEM)} ` +
        `(o limite é ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}). Exportar em ${FORMATO_SUGERIDO_IMAGEM} ` +
        'deixa a aula mais leve no celular.',
    );
  }

  return avisos;
}

// ───────────────────────────────── vídeo ─────────────────────────────────────

/** Proporção do player da aula. */
export const PROPORCAO_DO_VIDEO = '16:9';

/** Largura correspondente à altura alvo, em 16:9 (720p → 1280). */
export const LARGURA_ALVO_DO_VIDEO = Math.round((ALVO_DO_VIDEO.altura * 16) / 9);

/**
 * Duração de referência de uma videoaula, em minutos — é o que casa com o peso
 * alvo: a ~2 Mbps, 80 MB ≈ 5 min e 150 MB ≈ 10 min.
 */
export const DURACAO_ALVO_DO_VIDEO = {
  minimo: Math.round((ALVO_DO_VIDEO.mbMinimo * 8) / ALVO_DO_VIDEO.mbps / 60),
  maximo: Math.round((ALVO_DO_VIDEO.mbMaximo * 8) / ALVO_DO_VIDEO.mbps / 60),
} as const;

export const FORMATOS_DE_VIDEO_EM_TEXTO = FORMATOS_DE_VIDEO.map((formato) => formato.rotulo).join(
  ' ou ',
);

export { ACEITE_DE_VIDEO };

/** O quadro do arquivo de vídeo, pronto para a tela. */
export function linhasDaEspecificacaoDeVideo(): LinhaDeEspecificacao[] {
  return [
    {
      rotulo: 'Formatos',
      valor: `${FORMATOS_DE_VIDEO_EM_TEXTO} (MP4 com vídeo H.264 e áudio AAC é o mais seguro)`,
    },
    { rotulo: 'Tamanho máximo', valor: `${formatarBytes(TAMANHO_MAXIMO_VIDEO)} por arquivo` },
    {
      rotulo: 'Proporção',
      valor: `${PROPORCAO_DO_VIDEO} (horizontal) — é a caixa do player da aula`,
    },
    {
      rotulo: 'Resolução',
      valor: `${LARGURA_ALVO_DO_VIDEO} × ${ALVO_DO_VIDEO.altura} (${ALVO_DO_VIDEO.altura}p); acima disso só pesa mais`,
    },
    {
      rotulo: 'Taxa e peso alvo',
      valor:
        `~${ALVO_DO_VIDEO.mbps} Mbps — ${ALVO_DO_VIDEO.mbMinimo} a ${ALVO_DO_VIDEO.mbMaximo} MB ` +
        `para ${DURACAO_ALVO_DO_VIDEO.minimo}–${DURACAO_ALVO_DO_VIDEO.maximo} min de aula`,
    },
    {
      rotulo: 'Conversão',
      valor: 'Nenhuma: o arquivo que você envia é o que o aluno baixa.',
    },
  ];
}

/** O quadro do link de vídeo (YouTube/Vimeo não têm limite de arquivo aqui). */
export function linhasDaEspecificacaoDeLink(hosts: readonly string[]): LinhaDeEspecificacao[] {
  return [
    { rotulo: 'Origens aceitas', valor: `${hosts.join(', ')}, ou arquivo .mp4/.webm por https` },
    { rotulo: 'Proporção', valor: `${PROPORCAO_DO_VIDEO} (horizontal) — é a caixa do player` },
    { rotulo: 'Privacidade', valor: 'Use “não listado” no YouTube/Vimeo para o conteúdo do curso.' },
  ];
}
