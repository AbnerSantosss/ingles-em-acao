/**
 * Leitura e escrita do objeto do bloco pelo formulário — funções puras.
 *
 * A fonte da verdade continua sendo o **texto JSON** do bloco (`BlocoLocal.texto`
 * no editor). O formulário faz `JSON.parse` desse texto, altera um campo por vez
 * com cópia rasa e devolve `JSON.stringify(objeto, null, 2)` — o mesmo formato de
 * `jsonEditavel`. Por isso alternar formulário ↔ JSON nunca perde dado:
 *
 * - campo que o formulário não conhece **fica** no objeto (só é removido por clique
 *   explícito do admin);
 * - trocar o valor de um campo existente mantém a posição dele;
 * - campo novo entra na posição da ordem de referência do tipo, não no fim.
 */

export type Objeto = Record<string, unknown>;

export function ehObjeto(valor: unknown): valor is Objeto {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
}

/** `null` quando o texto não é JSON ou não é um objeto `{ … }`. */
export function lerObjeto(texto: string): Objeto | null {
  try {
    const bruto: unknown = JSON.parse(texto);
    return ehObjeto(bruto) ? bruto : null;
  } catch {
    return null;
  }
}

/** Mesmo formato de `jsonEditavel` (`src/lib/admin/editor.ts`): 2 espaços. */
export function serializar(objeto: Objeto): string {
  return JSON.stringify(objeto, null, 2);
}

export function temCampo(objeto: Objeto, chave: string): boolean {
  return Object.prototype.hasOwnProperty.call(objeto, chave);
}

/**
 * Cópia do objeto com `chave = valor`. `valor === undefined` remove a chave.
 *
 * Chave já existente: troca no lugar. Chave nova: entra antes da primeira chave
 * presente que venha depois dela em `ordem` (a ordem de referência do tipo), ou
 * no fim se nenhuma vier. Assim apagar e reescrever um campo opcional não o
 * joga para o fim do JSON.
 */
export function comCampo(
  objeto: Objeto,
  chave: string,
  valor: unknown,
  ordem: readonly string[] = [],
): Objeto {
  if (valor === undefined) return semCampo(objeto, chave);
  if (temCampo(objeto, chave)) return { ...objeto, [chave]: valor };

  const posicao = ordem.indexOf(chave);
  const posteriores = posicao === -1 ? [] : ordem.slice(posicao + 1);
  const saida: Objeto = {};
  let inserido = false;
  for (const [k, v] of Object.entries(objeto)) {
    if (!inserido && posteriores.includes(k)) {
      saida[chave] = valor;
      inserido = true;
    }
    saida[k] = v;
  }
  if (!inserido) saida[chave] = valor;
  return saida;
}

export function semCampo(objeto: Objeto, chave: string): Objeto {
  if (!temCampo(objeto, chave)) return objeto;
  const saida: Objeto = {};
  for (const [k, v] of Object.entries(objeto)) if (k !== chave) saida[k] = v;
  return saida;
}

/** Chaves do objeto que o formulário não desenha (ficam intactas, listadas à parte). */
export function camposForaDoFormulario(objeto: Objeto, conhecidos: readonly string[]): string[] {
  return Object.keys(objeto).filter((k) => !conhecidos.includes(k));
}

// ───────────────────────────── listas ─────────────────────────────

export function mover<T>(lista: readonly T[], de: number, para: number): T[] {
  if (para < 0 || para >= lista.length || de === para) return [...lista];
  const copia = [...lista];
  const [item] = copia.splice(de, 1);
  copia.splice(para, 0, item);
  return copia;
}

export function removerEm<T>(lista: readonly T[], indice: number): T[] {
  return lista.filter((_, i) => i !== indice);
}

export function inserirEm<T>(lista: readonly T[], indice: number, item: T): T[] {
  const copia = [...lista];
  copia.splice(indice, 0, item);
  return copia;
}

export function trocarEm<T>(lista: readonly T[], indice: number, item: T): T[] {
  return lista.map((atual, i) => (i === indice ? item : atual));
}

/** Cópia profunda de um valor JSON (itens duplicados não podem dividir referência). */
export function copiaProfunda<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T;
}

// ─────────────────────────── valores de campo ───────────────────────────

/**
 * Como um campo de texto enxerga o valor bruto:
 * - `texto`: string (número vira string só para exibir; só é regravado se o admin editar);
 * - `estranho`: objeto, lista, booleano ou `null` — o formulário não edita, para não
 *   sobrescrever sem querer; o admin corrige no modo JSON.
 */
export type LeituraDeTexto = { tipo: 'texto'; valor: string } | { tipo: 'estranho'; bruto: unknown };

export function lerTexto(valor: unknown): LeituraDeTexto {
  if (valor === undefined) return { tipo: 'texto', valor: '' };
  if (typeof valor === 'string') return { tipo: 'texto', valor };
  if (typeof valor === 'number') return { tipo: 'texto', valor: String(valor) };
  return { tipo: 'estranho', bruto: valor };
}

/** Resumo curto de um valor para mostrar sem editar ("lista com 3 itens", `"abc"`…). */
export function resumirValor(valor: unknown): string {
  if (valor === null) return 'null';
  if (Array.isArray(valor)) return `lista com ${valor.length} item(ns)`;
  if (typeof valor === 'object') return `objeto com ${Object.keys(valor).length} campo(s)`;
  const texto = JSON.stringify(valor);
  return texto.length > 80 ? `${texto.slice(0, 77)}…` : texto;
}

/**
 * Atalho dos formulários: `const definir = ligador(valor, aoMudar, ORDEM)` e depois
 * `aoMudar={definir('title')}` em cada campo.
 */
export function ligador(
  objeto: Objeto,
  aoMudar: (novo: Objeto) => void,
  ordem: readonly string[],
): (chave: string) => (novo: unknown) => void {
  return (chave) => (novo) => aoMudar(comCampo(objeto, chave, novo, ordem));
}
