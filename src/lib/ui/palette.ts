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
  teal: { bg: "#12A594", fg: "#FFFFFF", bd: "#12A594", kick: "#FFFFFF" },
  purple: { bg: "#5B21B6", fg: "#FFFFFF", bd: "#5B21B6", kick: "#F6C945" },
  yellow: { bg: "#F6C945", fg: "#0A1F4E", bd: "#F6C945", kick: "#0A1F4E" },
  blue: { bg: "#EAF2FE", fg: "#123A86", bd: "#D6E5FB", kick: "#1B6BE3" },
  red: { bg: "#FEF0F2", fg: "#B21F31", bd: "#F9D3D9", kick: "#E03B4C" },
  green: { bg: "#E4F5EA", fg: "#136B45", bd: "#C6E9D2", kick: "#136B45" },
  plain: { bg: "transparent", fg: "#1F2937", bd: "transparent", kick: "#5B6B7F" },
} as const satisfies Record<string, Variant>;

export type VariantName = keyof typeof V;

export const VARIANT_NAMES = Object.keys(V) as VariantName[];

/** Cores sólidas dos chips e etiquetas (constante `SOLID` do protótipo). */
export const SOLID = {
  navy: "#0A1F4E",
  teal: "#12A594",
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

/** Cor sólida pelo nome, caindo no link teal — o mesmo fallback
 *  `SOLID[x] || "#0E9BAE"` usado pelo protótipo. */
export function solid(nome: string | null | undefined): string {
  return nome && isSolidName(nome) ? SOLID[nome] : "#0E9BAE";
}
