/**
 * Validação da ficha de prática de uma aula (contratos 3.1, 10.3 e 10.8).
 *
 * Estrita: campo a mais é erro, porque a ficha vem de arquivo escrito à mão
 * (`content/pratica/aula-NN.json`) e um nome de campo errado sumiria em silêncio do prompt.
 *
 * Os máximos são o orçamento da seção 10.3 do contrato e valem para toda ficha. Os mínimos
 * só são cobrados de ficha `'pronta'`. Ficha `'pendente'` não entrega prompt, então precisa
 * só de `versao`, `status`, `tipo` e `foco`: é o caso da Aula 05, cujo conteúdo ainda
 * depende do dono do produto.
 *
 * Os erros saem em português, um por problema, no formato `<caminho>: <problema>`
 * (ex.: `exemplos[1].enunciado: é longo demais (máximo 90)`).
 */
import { z } from 'zod';

import { descreverErros } from '@/lib/content/blocks';
import type * as T from './tipos';

/** Texto que vai para o prompt: vazio aqui é ficha quebrada. */
const texto = z.string().trim().min(1);

const tipoDeExercicio = z.enum([
  'identificar',
  'escolher',
  'completar',
  'transformar',
  'traduzir',
  'responder',
  'corrigir',
  'mini-dialogo',
  'situacao',
]);

const ExemploDeExercicioSchema = z.strictObject({
  tipo: tipoDeExercicio,
  enunciado: texto.max(90),
  respostaDeReferencia: texto.max(50),
});

/** Orçamento da ficha (contrato 10.3): os máximos valem para toda ficha, pronta ou pendente. */
const FichaBase = z.strictObject({
  versao: z.literal(1),
  status: z.enum(['pronta', 'pendente']),
  tipo: z.enum(['conteudo', 'revisao']),
  foco: texto.max(120),
  conteudoAlvo: z.array(texto.max(50)).max(4),
  expressoesFixas: z.array(texto.max(40)).max(2),
  comoIntegrar: z.array(texto.max(90)).max(2),
  regrasDaAula: z.array(texto.max(90)).max(1),
  tiposDeExercicio: z.array(tipoDeExercicio).max(4),
  exemplos: z.array(ExemploDeExercicioSchema).max(3),
  limites: z.array(texto.max(90)).max(2),
  primeiraQuestao: z.string().trim().max(120),
  resumoAutorizado: z.array(texto.max(80)).max(3),
  resumoCurto: z.string().trim().max(120),
});

/** Mínimos de uma ficha pronta: [campo, mínimo]. */
const MINIMOS_DA_FICHA_PRONTA = [
  ['conteudoAlvo', 1],
  ['comoIntegrar', 2],
  ['tiposDeExercicio', 3],
  ['exemplos', 3],
  ['limites', 1],
  ['resumoAutorizado', 3],
] as const;

export const FichaDePraticaSchema = FichaBase.superRefine((ficha, ctx) => {
  if (ficha.status !== 'pronta') return;
  for (const [campo, minimo] of MINIMOS_DA_FICHA_PRONTA) {
    if (ficha[campo].length < minimo) {
      ctx.addIssue({
        code: 'custom',
        path: [campo],
        message: `precisa de pelo menos ${minimo} item(ns) numa ficha pronta`,
      });
    }
  }
  if (ficha.primeiraQuestao === '') {
    ctx.addIssue({ code: 'custom', path: ['primeiraQuestao'], message: 'não pode ficar vazio numa ficha pronta' });
  }
  if (ficha.resumoCurto === '') {
    ctx.addIssue({ code: 'custom', path: ['resumoCurto'], message: 'não pode ficar vazio numa ficha pronta' });
  }
});

/** Identidade exata de tipos (a mesma técnica de `ConferenciaDeTipos`, em `blocks.ts`). */
type Identico<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
  ? true
  : false;

type Confere<C extends true> = C;

/** Se `./tipos.ts` e este esquema divergirem em um único campo, o TypeScript falha aqui. */
export type ConferenciaDaFicha = [
  Confere<Identico<z.infer<typeof FichaDePraticaSchema>, T.FichaDePratica>>,
  Confere<Identico<z.infer<typeof ExemploDeExercicioSchema>, T.ExemploDeExercicio>>,
];

/**
 * Passa a linha de `descreverErros` para o formato `<caminho>: <problema>`.
 * "conteúdo: campo `foco` não pode ficar vazio" vira "foco: não pode ficar vazio".
 * Problema na raiz (campo desconhecido, ficha que não é objeto) usa o caminho `ficha`.
 */
function paraCaminhoEProblema(linha: string): string {
  const comCampo = /^conteúdo(?::|,) campo `([^`]+)`:? (.*)$/.exec(linha);
  if (comCampo) return `${comCampo[1]}: ${comCampo[2]}`;
  return linha.replace(/^conteúdo: /, 'ficha: ');
}

/** Confere uma ficha lida de arquivo ou do banco (contrato 10.8). */
export function validarFicha(
  valor: unknown,
): { ok: true; ficha: T.FichaDePratica } | { ok: false; erros: string[] } {
  const resultado = FichaDePraticaSchema.safeParse(valor);
  if (resultado.success) return { ok: true, ficha: resultado.data };
  return {
    ok: false,
    erros: descreverErros(resultado.error.issues, valor, true).map(paraCaminhoEProblema),
  };
}
