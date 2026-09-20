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
};

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
}: IlustracaoProps) {
  const legado = id ? ARTE_LEGADA.get(id) : undefined;
  const arquivo = src ?? (legado ? `/lessons/art/${legado}` : null);
  const descricao = (alt ?? ph ?? "").trim() || TEXTO_PADRAO;

  const caixa = {
    borderRadius: `${raio}px`,
    ...(altura ? { height: `${altura}px` } : { aspectRatio: proporcao }),
  };

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
