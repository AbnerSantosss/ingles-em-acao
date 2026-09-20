/**
 * Paleta dos blocos de conteúdo — cópia fiel das constantes `V` e `SOLID`
 * do protótipo (prototype/mobile.dc.html, linhas 997–1012) e da tabela da
 * seção 3 do CONTRACT.md.
 *
 * O motor de aulas da próxima rodada lê daqui: cada bloco do
 * `content/course-data.mjs` traz uma cor por nome (`"mint"`, `"navy"`, ...)
 * e o renderer converte em bg/fg/bd/kick.
 *
 * Estes valores são hex literais de propósito: eles entram em `style` inline
 * (cor escolhida por dado, não por classe) e precisam existir em JS, não só
 * como variável CSS.
 *
 * Auditoria de contraste (WCAG 2.1 AA): o teal do protótipo escureceu, aqui e
 * na seção 3 do CONTRACT.md, porque o par branco/teal era desenhado em texto
 * pequeno. Os dois arquivos andam juntos: mexeu num, atualize o outro.
 */

export type Variant = {
  /** fundo do bloco */
  bg: string;
  /** cor do texto principal sobre o fundo */
  fg: string;
  /** borda do bloco */
  bd: string;
  /** cor do rótulo/kicker e dos detalhes de destaque */
  kick: string;
};

export const V = {
  gray: { bg: "#F1F5FA", fg: "#1F2937", bd: "#E3EAF3", kick: "#5B6B7F" },
  white: { bg: "#FFFFFF", fg: "#1F2937", bd: "#E3EAF3", kick: "#5B6B7F" },
  mint: { bg: "#E6F6F0", fg: "#0F5D50", bd: "#CFEDE2", kick: "#0F8F7A" },
  lilac: { bg: "#F1EDFD", fg: "#3A1A80", bd: "#E2DAFA", kick: "#5B21B6" },
  cream: { bg: "#FEF7E0", fg: "#6B520A", bd: "#F8E7B4", kick: "#B67F0C" },
  navy: { bg: "#0A1F4E", fg: "#FFFFFF", bd: "#0A1F4E", kick: "#F6C945" },
  /* O fundo era o teal da marca #12A594, que com o branco do `fg` e do `kick`
     dava 3,07: reprova o AA de texto pequeno, e este fundo leva título de
     17px e rótulo de 12px. Escurecido para o mesmo tom do `--teal-texto` do
     globals.css, que dá 5,43 com branco. O `--teal` da marca continua no
     globals.css para preenchimento, traço e anel, onde o limite é 3,0. */
  teal: { bg: "#0D776B", fg: "#FFFFFF", bd: "#0D776B", kick: "#FFFFFF" },
  purple: { bg: "#5B21B6", fg: "#FFFFFF", bd: "#5B21B6", kick: "#F6C945" },
  yellow: { bg: "#F6C945", fg: "#0A1F4E", bd: "#F6C945", kick: "#0A1F4E" },
  blue: { bg: "#EAF2FE", fg: "#123A86", bd: "#D6E5FB", kick: "#1B6BE3" },
  red: { bg: "#FEF0F2", fg: "#B21F31", bd: "#F9D3D9", kick: "#E03B4C" },
  green: { bg: "#E4F5EA", fg: "#136B45", bd: "#C6E9D2", kick: "#136B45" },
  plain: { bg: "transparent", fg: "#1F2937", bd: "transparent", kick: "#5B6B7F" },
} as const satisfies Record<string, Variant>;

export type VariantName = keyof typeof V;

export const VARIANT_NAMES = Object.keys(V) as VariantName[];

/**
 * Cores sólidas dos chips e etiquetas (constante `SOLID` do protótipo).
 *
 * Estas cores fazem dois papéis: fundo chapado com texto branco por cima
 * (chip, etiqueta, bolinha numerada, selo) e cor do próprio texto em rótulo
 * pequeno sobre fundo claro (`kicker` do `rule` e do `free`). Os dois papéis
 * pedem 4,5 de contraste, então a cor tem de ser escura o bastante para os
 * dois lados.
 */
export const SOLID = {
  navy: "#0A1F4E",
  /* Era #12A594: 3,07 com branco por cima e 2,75 como texto sobre o mint dos
     cartões. Este é o tom do `--teal-texto` do globals.css: 5,43 com branco,
     4,86 sobre o mint e 4,72 sobre o lilás, o mais escuro dos fundos de
     cartão. Passa nos dois papéis em todas as variantes. */
  teal: "#0D776B",
  purple: "#5B21B6",
  yellow: "#F6C945",
  blue: "#1B6BE3",
  white: "#FFFFFF",
  orange: "#E8820C",
  red: "#E03B4C",
} as const satisfies Record<string, string>;

export type SolidName = keyof typeof SOLID;

export const SOLID_NAMES = Object.keys(SOLID) as SolidName[];

/**
 * Texto legível sobre cada cor sólida.
 *
 * Regra da marca: sobre amarelo o texto é SEMPRE navy. Sobre branco também —
 * o protótipo devolvia branco no branco (chip invisível); aqui o branco ganha
 * texto navy, e quem desenha o chip põe borda para o recorte aparecer.
 */
export const SOLID_FG = {
  navy: "#FFFFFF",
  teal: "#FFFFFF",
  purple: "#FFFFFF",
  yellow: "#0A1F4E",
  blue: "#FFFFFF",
  white: "#0A1F4E",
  orange: "#FFFFFF",
  red: "#FFFFFF",
} as const satisfies Record<SolidName, string>;

/** `true` quando a string é um nome válido da paleta de variantes. */
export function isVariantName(nome: string): nome is VariantName {
  return Object.prototype.hasOwnProperty.call(V, nome);
}

/** `true` quando a string é um nome válido da paleta sólida. */
export function isSolidName(nome: string): nome is SolidName {
  return Object.prototype.hasOwnProperty.call(SOLID, nome);
}

/** Variante pelo nome, caindo em `gray` quando o dado vier torto (mesma
 *  tolerância do protótipo: `V[c.c] || V.gray`). */
export function variant(nome: string | null | undefined): Variant {
  return nome && isVariantName(nome) ? V[nome] : V.gray;
}

/**
 * Cor sólida pelo nome, caindo no teal de link: o mesmo lugar do fallback
 * `SOLID[x] || "#0E9BAE"` do protótipo, com o valor novo do `--link`.
 *
 * O tom do protótipo dava 3,32 com o branco que a etiqueta de 13px e a bolinha
 * numerada escrevem por cima, e 2,98 quando ele mesmo vira texto de 12px sobre
 * o mint. O `#0E7A8B` é o mesmo matiz com 5,03 e 4,50. No conteúdo de hoje este
 * recuo só acontece em bloco `free` sem `v`, ou seja, sobre o cinza: 4,59.
 */
export function solid(nome: string | null | undefined): string {
  return nome && isSolidName(nome) ? SOLID[nome] : "#0E7A8B";
}
