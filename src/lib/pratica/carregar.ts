/**
 * Carrega as fichas de prática (`content/pratica/aula-NN.json`) no banco, em
 * `Lesson.practice` (contrato 3.1).
 *
 * - Tolerante: arquivo inválido é contado e relatado, e os outros seguem. Pasta que não
 *   existe devolve tudo zerado (o conteúdo das fichas chega no pacote 12).
 * - Idempotente: ficha igual à gravada não é regravada nem auditada. A comparação ignora a
 *   ordem das chaves, porque o Postgres (JSONB) devolve as chaves em outra ordem.
 * - Grava direto, sem rascunho e sem `LessonVersion`, com um registro de auditoria por
 *   aula alterada.
 *
 * Usada por `scripts/carregar-pratica.ts` (também em produção) e por `prisma/seed.ts`.
 */
import fs from 'node:fs';
import path from 'node:path';

import type { Prisma, PrismaClient } from '@prisma/client';

import { validarFicha } from './esquema';

export interface ResultadoDaCarga {
  /** Arquivos `aula-NN.json` encontrados na pasta. */
  lidas: number;
  /** Aulas cuja ficha mudou e foi gravada. */
  gravadas: number;
  /** Aulas cuja ficha já estava igual no banco. */
  iguais: number;
  /** Arquivos com JSON quebrado ou fora do esquema. Nada deles foi gravado. */
  invalidas: number;
  /** Fichas válidas de aula que não existe no banco. */
  semAula: number;
  /** Uma linha por problema, já com o nome do arquivo. */
  erros: string[];
}

export interface OpcoesDaCarga {
  /** Pasta das fichas. Padrão: `content/pratica`, a partir da pasta de trabalho. */
  pasta?: string;
  /** Quem aparece como autor na auditoria. Padrão: 'carregar-pratica'. */
  sistema?: string;
}

const NOME_DO_ARQUIVO = /^aula-(\d{2})\.json$/;

/** JSON com as chaves em ordem alfabética, em todos os níveis. Serve só para comparar. */
function jsonEstavel(valor: unknown): string {
  return JSON.stringify(valor, (_chave, v: unknown) => {
    if (v === null || typeof v !== 'object' || Array.isArray(v)) return v;
    const ordenado: Record<string, unknown> = {};
    for (const chave of Object.keys(v).sort()) ordenado[chave] = (v as Record<string, unknown>)[chave];
    return ordenado;
  });
}

export async function carregarPratica(
  prisma: PrismaClient,
  opcoes: OpcoesDaCarga = {},
): Promise<ResultadoDaCarga> {
  const pasta = opcoes.pasta ?? path.join(process.cwd(), 'content', 'pratica');
  const resultado: ResultadoDaCarga = { lidas: 0, gravadas: 0, iguais: 0, invalidas: 0, semAula: 0, erros: [] };

  if (!fs.existsSync(pasta)) return resultado;

  const arquivos = fs
    .readdirSync(pasta)
    .filter((nome) => NOME_DO_ARQUIVO.test(nome))
    .sort();

  for (const nome of arquivos) {
    resultado.lidas += 1;
    const numero = Number(NOME_DO_ARQUIVO.exec(nome)?.[1]);

    let bruto: unknown;
    try {
      bruto = JSON.parse(fs.readFileSync(path.join(pasta, nome), 'utf8'));
    } catch (erro) {
      resultado.invalidas += 1;
      resultado.erros.push(`${nome}: JSON inválido (${erro instanceof Error ? erro.message : String(erro)})`);
      continue;
    }

    const validacao = validarFicha(bruto);
    if (!validacao.ok) {
      resultado.invalidas += 1;
      for (const linha of validacao.erros) resultado.erros.push(`${nome}: ${linha}`);
      continue;
    }

    const aula = await prisma.lesson.findUnique({
      where: { number: numero },
      select: { id: true, practice: true },
    });
    if (!aula) {
      resultado.semAula += 1;
      resultado.erros.push(`${nome}: a Aula ${numero} não existe no banco`);
      continue;
    }

    if (aula.practice !== null && jsonEstavel(aula.practice) === jsonEstavel(validacao.ficha)) {
      resultado.iguais += 1;
      continue;
    }

    await prisma.lesson.update({
      where: { id: aula.id },
      data: { practice: validacao.ficha as unknown as Prisma.InputJsonValue },
    });
    // A ficha não tem LessonVersion: a auditoria guarda o antes e o depois inteiros.
    // Grava pelo `prisma` recebido, não por `@/lib/admin/audit`: aquele módulo importa
    // `next/headers`, que não existe fora do servidor do Next (seed e script no container).
    await prisma.auditLog.create({
      data: {
        actorEmail: `(${opcoes.sistema ?? 'carregar-pratica'})`,
        action: 'lesson.practice.load',
        resource: `Lesson:${numero}`,
        before: (aula.practice ?? undefined) as Prisma.InputJsonValue | undefined,
        after: validacao.ficha as unknown as Prisma.InputJsonValue,
      },
    });
    resultado.gravadas += 1;
  }

  return resultado;
}
