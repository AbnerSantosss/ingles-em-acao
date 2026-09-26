/**
 * Ilustração compartilhada pelos blocos `image`, `cards`, `steps` e `profile`.
 *
 * Ordem de resolução da mídia (BACKOFFICE §4.1, achado do bloco `image`):
 *   1. `src` — arquivo enviado pelo admin (`MediaAsset`), quando existir;
 *   2. `/lessons/art/{arquivo}` — artes avulsas registradas em `ARTE_LEGADA`;
 *   3. placeholder acessível — o caminho normal hoje. As ilustrações serão
 *      enviadas depois pelo backoffice (decisão do produto); até lá o
 *      placeholder mostra a cena descrita com o selo "EM BREVE" — não é defeito.
 *
 * Por que o caminho normal é o placeholder: existem 310 ids de ilustração no
 * `course-data.mjs` (contagem de 2026-09-19) e 15 arquivos em
 * `public/lessons/art/`, quase todos nomeados pelo título da aula
 * ("Subject Pronouns.png"), não pelo id do bloco ("a1p1"). Só um id casa com
 * um arquivo, e é o único registrado em `ARTE_LEGADA`. Por isso o caminho
 * legado só é tentado para os ids desse mapa: apontar `<img>` para um arquivo
 * inexistente renderia ícone de imagem quebrada e 404 no console em 309
 * blocos. Quando uma arte for exportada com o nome do id, basta acrescentá-la
 * ao conjunto — ou, melhor, deixar o admin preencher `src`.
 *
 * `<img>` em vez de `next/image`: a origem da imagem é um caminho arbitrário
 * vindo do banco (biblioteca de mídia), sem dimensões conhecidas em tempo de
 * build; `next/image` exigiria `width`/`height` ou `fill` + configuração de
 * remotePatterns, e qualquer URL fora do previsto vira erro de runtime. Aqui
 * a imagem já vive dentro de uma caixa de proporção fixa com `object-fit`,
 * que é exatamente o que o `next/image` faria — sem o risco.
 *
 * ## Com tamanho natural (`w`/`h`)
 *
 * Os recortes do e-book vão de 60×60 a 900×450 px, muitos com fundo
 * transparente. Na caixa fixa com `object-cover` eles seriam cortados e
 * ampliados. Com `src` **e** `w`/`h` válidos, a figura aparece inteira, na
 * proporção dela, centralizada, sem fundo cinza e sem canto arredondado (o
 * recorte já traz o desenho do e-book):
 *
 * - `encaixe="coluna"` (bloco `image`): a largura é a fatia da coluna que a
 *   figura ocupava na página do e-book — `w / 900` da coluna, no máximo 100% —
 *   e a altura segue a proporção, com teto de 420 px (passou, a largura encolhe
 *   junto). Um ícone de 60 px não vira um borrão de tela inteira.
 * - `encaixe="caixa"` (cards, steps, profile): a área encolhe para o tamanho da
 *   figura, sem passar de `w`×`h` px CSS nem da altura da caixa (`altura`, no
 *   profile, ou 280 px). A área fixa de antes deixava uma miniatura de 146 px
 *   no meio de um vão de 440 px nos cartões de uma coluna.
 *
 * Sem `w`/`h` (ou só com um dos dois), nada muda: caixa fixa, `object-cover`,
 * fundo cinza — e o placeholder "EM BREVE" quando não há arquivo.
 */

/* eslint-disable @next/next/no-img-element -- ver justificativa no cabeçalho */

export type IlustracaoProps = {
  /** Id do bloco: chave de `ARTE_LEGADA` no caminho legado. */
  id?: string;
  /** Descrição da cena. Vira legenda visível do placeholder e texto alternativo. */
  ph?: string;
  /** Caminho servido da mídia do admin. Tem prioridade sobre tudo. */
  src?: string;
  /** Texto alternativo da biblioteca do admin. Ausente → usa `ph`. */
  alt?: string;
  /** Proporção CSS da caixa ("16 / 9", "16 / 10"). Ignorada quando há `altura`. */
  proporcao?: string;
  /** Altura fixa em px — o card `profile` usa 190. */
  altura?: number;
  /** Raio da caixa em px. */
  raio: number;
  /** Largura natural do arquivo em px. Só vale junto com `h` e com `src`. */
  w?: number;
  /** Altura natural do arquivo em px. Só vale junto com `w` e com `src`. */
  h?: number;
  /**
   * Como a figura com `w`/`h` ocupa o espaço: `coluna` (bloco `image`, largura
   * pela fatia da coluna do e-book) ou `caixa` (cartões, passos e perfil, no
   * tamanho natural com teto de altura). Sem `w`/`h`, não tem efeito.
   */
  encaixe?: "coluna" | "caixa";
};

/**
 * Largura útil da página do e-book, em px: a figura recortada com essa largura
 * ocupa a coluna inteira; uma de 450 px, metade dela.
 */
export const LARGURA_UTIL_DO_EBOOK = 900;

/** Teto de altura da figura no bloco `image`, em px. Passou, a largura encolhe junto. */
export const ALTURA_MAXIMA_DA_FIGURA = 420;

/** Teto de altura da figura em cartões e passos, em px. O profile usa a `altura` dele. */
export const ALTURA_MAXIMA_NA_CAIXA = 280;

/** Casas decimais do percentual no CSS — o suficiente para não sobrar resto visível. */
const CASAS_DO_PERCENTUAL = 3;

/** Tamanho em px vindo do conteúdo: só inteiro positivo conta (a leitura estática não passa pelo esquema). */
function ehPixel(n: number | undefined): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0;
}

/** Número curto para o CSS (`33.333` em vez de `33.333333333333336`). */
function paraCss(n: number): number {
  return Number(n.toFixed(CASAS_DO_PERCENTUAL));
}

/**
 * Largura CSS da figura no bloco `image`: a menor entre a coluna inteira, a
 * fatia que ela ocupava no e-book e a largura que leva a altura ao teto.
 */
export function larguraNaColuna(w: number, h: number): string {
  const fatia = paraCss((w / LARGURA_UTIL_DO_EBOOK) * 100);
  const pelaAltura = paraCss((ALTURA_MAXIMA_DA_FIGURA * w) / h);
  return `min(100%, ${fatia}%, ${pelaAltura}px)`;
}

/**
 * Largura CSS da figura em cartões, passos e perfil: a menor entre a largura
 * disponível, a natural e a que leva a altura ao teto.
 */
export function larguraNaCaixa(w: number, h: number, teto: number): string {
  return `min(100%, ${w}px, ${paraCss((teto * w) / h)}px)`;
}

/**
 * Id do bloco → arquivo em `public/lessons/art/`. Os 14 arquivos antigos da
 * pasta têm nome de título de aula, não de id de bloco, e não entram aqui.
 *
 * `a1p1` é a arte que o design do Claude Designer preencheu no slot da página 1
 * da Aula 01 (extraída do `.image-slots.state.json` do design, em WebP).
 */
const ARTE_LEGADA = new Map<string, string>([["a1p1", "a1p1.webp"]]);

const TEXTO_PADRAO = "Ilustração da aula";

/** Separa o rótulo ("ILUSTRAÇÃO", "FOTO") da descrição da cena. */
function partirDescricao(texto: string): { rotulo: string; legenda: string } {
  const prefixo = /^\s*(ilustração|ilustracao|foto|imagem)\s*:\s*/i.exec(texto);
  if (!prefixo) return { rotulo: "ILUSTRAÇÃO", legenda: texto };
  return {
    rotulo: prefixo[1].toUpperCase(),
    legenda: texto.slice(prefixo[0].length).trim(),
  };
}

export function Ilustracao({
  id,
  ph,
  src,
  alt,
  proporcao = "16 / 9",
  altura,
  raio,
  w,
  h,
  encaixe = "caixa",
}: IlustracaoProps) {
  const legado = id ? ARTE_LEGADA.get(id) : undefined;
  const arquivo = src ?? (legado ? `/lessons/art/${legado}` : null);
  const descricao = (alt ?? ph ?? "").trim() || TEXTO_PADRAO;

  const caixa = {
    borderRadius: `${raio}px`,
    ...(altura ? { height: `${altura}px` } : { aspectRatio: proporcao }),
  };

  // Figura com tamanho natural: só com arquivo do admin (`src`) e os dois lados válidos.
  if (src && ehPixel(w) && ehPixel(h)) {
    const largura =
      encaixe === "coluna"
        ? larguraNaColuna(w, h)
        : larguraNaCaixa(w, h, altura ?? ALTURA_MAXIMA_NA_CAIXA);
    return (
      <div className="w-full">
        <img
          src={src}
          alt={descricao}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto"
          style={{ width: largura, aspectRatio: `${w} / ${h}` }}
        />
      </div>
    );
  }

  if (arquivo) {
    return (
      <div className="w-full overflow-hidden bg-[#F0F1F5]" style={caixa}>
        <img
          src={arquivo}
          alt={descricao}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const { rotulo, legenda } = partirDescricao(descricao);

  return (
    <div
      role="img"
      aria-label={`${descricao} (ilustração em breve)`}
      data-placeholder="ilustracao"
      className="flex w-full flex-col items-center justify-center gap-1.5 overflow-hidden border border-[#DCE6F2] bg-[linear-gradient(160deg,#F4F8FD_0%,#E7EEF8_100%)] px-4 py-3 text-center"
      style={caixa}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8A96A8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="flex-none"
      >
        <rect x="3" y="4" width="18" height="16" rx="3.5" />
        <circle cx="8.6" cy="9.4" r="1.6" />
        <path d="m3.6 17.2 4.6-4.3a2 2 0 0 1 2.7 0l3 2.8" />
        <path d="m14.6 14.4 1.7-1.6a2 2 0 0 1 2.7 0l1.4 1.3" />
      </svg>
      <span className="text-[10px] font-extrabold tracking-[0.1em] text-muted-2">
        {rotulo} · EM BREVE
      </span>
      <span className="line-clamp-3 text-[13px] font-bold leading-[1.35] text-[#3C4A5C]">
        {legenda}
      </span>
    </div>
  );
}

export default Ilustracao;
