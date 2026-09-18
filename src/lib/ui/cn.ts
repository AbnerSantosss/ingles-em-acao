/**
 * Junção de classes CSS sem dependência externa.
 *
 * Aceita strings, números, listas aninhadas e objetos `{ classe: condição }`
 * — o mesmo formato de `clsx` — e devolve uma string com duplicatas exatas
 * removidas (a última ocorrência manda, que é a ordem em que quem chama
 * espera que o override aconteça).
 *
 * Não faz merge semântico de utilitários Tailwind conflitantes
 * (`p-2` + `p-4` continuam os dois na string; o Tailwind resolve pela ordem
 * na folha de estilo). Quando um componente precisa permitir override real,
 * ele expõe a prop correspondente em vez de confiar em `className`.
 */

export type ClassValue =
  | string
  | number
  | bigint
  | null
  | undefined
  | false
  | ClassValue[]
  | { [key: string]: boolean | null | undefined };

function coletar(valor: ClassValue, saida: string[]): void {
  if (!valor && valor !== 0) return;

  if (typeof valor === "string") {
    for (const parte of valor.split(/\s+/)) {
      if (parte) saida.push(parte);
    }
    return;
  }

  if (typeof valor === "number" || typeof valor === "bigint") {
    saida.push(String(valor));
    return;
  }

  if (Array.isArray(valor)) {
    for (const item of valor) coletar(item, saida);
    return;
  }

  for (const chave of Object.keys(valor)) {
    if (valor[chave]) saida.push(chave);
  }
}

export function cn(...entradas: ClassValue[]): string {
  const bruto: string[] = [];
  for (const entrada of entradas) coletar(entrada, bruto);

  if (bruto.length < 2) return bruto.join(" ");

  // Remove duplicatas exatas mantendo a última posição de cada classe.
  const vistos = new Set<string>();
  const final: string[] = [];
  for (let i = bruto.length - 1; i >= 0; i--) {
    const classe = bruto[i];
    if (vistos.has(classe)) continue;
    vistos.add(classe);
    final.push(classe);
  }

  return final.reverse().join(" ");
}

export default cn;
