/**
 * Rascunho, publicação e histórico de versões — BACKOFFICE §3.5, §6.2 e §6.4.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma). Nunca importe de um `'use client'` — o que o
 * cliente precisa (modelos, validação, ids) está em `./editor.ts`, que é puro.
 *
 * Salvar ≠ publicar (D7):
 *
 * - **Salvar** grava só `Lesson.draftPages`. O aluno não vê nada.
 * - **Publicar** copia `draftPages` → `pages`, sobe `contentVersion`, cria uma
 *   `LessonVersion` (snapshot + resumo), zera o rascunho, reposiciona quem
 *   ficou além da última página e reescreve `MediaUsage`. Tudo o que toca o
 *   banco numa transação só — ou publica inteiro, ou nada muda.
 *
 * O que a publicação **nunca** faz (§6.4, D10):
 *
 * - apagar `ExerciseAnswer` — resposta de bloco removido vira órfã, preservada;
 * - mexer em `LessonProgress.status` — aula concluída continua concluída;
 * - recalcular `score`/`total` — são cache, recalculáveis a qualquer momento.
 */
import { createHash } from 'node:crypto';

import { Prisma } from '@prisma/client';

import {
  blocosInterativos,
  chavePertenceAoBloco,
  chavesDoBloco,
  coletarIds,
  compararConteudo,
  jsonCanonico,
  plural,
  resumirDiferencas,
  validarSemantica,
  type DiferencasDoConteudo,
  type TipoInterativo,
} from '@/lib/admin/editor';
import { validarPaginas, type Page } from '@/lib/content/blocks';
import { prisma } from '@/lib/db';
import { sincronizarUsosDaAula } from '@/lib/media/consultas';

// ───────────────────────────── utilidades ─────────────────────────────

/** Impressão digital do conteúdo. Chaves ordenadas: o `jsonb` reordena e isso não é mudança. */
export function hashDasPaginas(pages: unknown): string {
  return createHash('sha256').update(jsonCanonico(pages)).digest('hex').slice(0, 32);
}

/** Lê um `Json` do banco como páginas válidas; `null` se não passar no esquema. */
export function paginasValidas(valor: unknown): Page[] | null {
  if (valor === null || valor === undefined) return null;
  const resultado = validarPaginas(valor);
  return resultado.ok ? resultado.pages : null;
}

// ─────────────────────────── contexto do curso ───────────────────────────

export type ContextoDoCurso = {
  /** Todo id já visto em qualquer aula (publicado, rascunho, versões) — para gerar ids novos. */
  idsUsados: string[];
  /** id interativo → número da aula dona, para ids de **outras** aulas. */
  idsDeOutrasAulas: Map<string, number>;
  /** Todo id interativo que esta aula já teve (publicado, rascunho, versões). */
  idsHistoricosDaAula: Set<string>;
  aulasExistentes: { numero: number; titulo: string }[];
  mediaDePaginas: number;
};

function paginasSoltas(valor: unknown): Page[] {
  // Para colecionar ids, um conteúdo torto não pode derrubar a tela: lê o que der.
  const validas = paginasValidas(valor);
  if (validas) return validas;
  if (!Array.isArray(valor)) return [];
  return valor.filter(
    (pagina): pagina is Page =>
      pagina !== null &&
      typeof pagina === 'object' &&
      Array.isArray((pagina as { blocks?: unknown }).blocks),
  );
}

function idsInterativosSoltos(valor: unknown): string[] {
  const ids: string[] = [];
  for (const pagina of paginasSoltas(valor)) {
    for (const bloco of pagina.blocks as unknown[]) {
      if (bloco === null || typeof bloco !== 'object') continue;
      const { t, id } = bloco as { t?: unknown; id?: unknown };
      if (
        typeof t === 'string' &&
        typeof id === 'string' &&
        ['mc', 'fill', 'match', 'dnd', 'check', 'free'].includes(t)
      ) {
        ids.push(id);
      }
    }
  }
  return ids;
}

function todosOsIdsSoltos(valor: unknown): string[] {
  const validas = paginasValidas(valor);
  if (validas) return coletarIds(validas);
  return idsInterativosSoltos(valor);
}

/**
 * Tudo o que a validação e o gerador de ids precisam saber sobre o resto do
 * curso. Varre `pages`, `draftPages` e **todas** as `LessonVersion` — um id
 * que só existe numa versão antiga continua reservado (§6.2: nunca reutilizar).
 */
export async function carregarContextoDoCurso(lessonId: string): Promise<ContextoDoCurso> {
  const [aulas, versoes] = await Promise.all([
    prisma.lesson.findMany({
      select: { id: true, number: true, title: true, pages: true, draftPages: true, archivedAt: true },
    }),
    prisma.lessonVersion.findMany({ select: { lessonId: true, pages: true } }),
  ]);

  const numeroPorAula = new Map(aulas.map((aula) => [aula.id, aula.number]));
  const idsUsados = new Set<string>();
  const idsDeOutrasAulas = new Map<string, number>();
  const idsHistoricosDaAula = new Set<string>();

  const registrar = (dono: string, conteudo: unknown): void => {
    for (const id of todosOsIdsSoltos(conteudo)) idsUsados.add(id);
    for (const id of idsInterativosSoltos(conteudo)) {
      if (dono === lessonId) idsHistoricosDaAula.add(id);
      else idsDeOutrasAulas.set(id, numeroPorAula.get(dono) ?? 0);
    }
  };

  for (const aula of aulas) {
    registrar(aula.id, aula.pages);
    if (aula.draftPages !== null) registrar(aula.id, aula.draftPages);
  }
  for (const versao of versoes) registrar(versao.lessonId, versao.pages);

  const ativas = aulas.filter((aula) => aula.archivedAt === null);
  const somaDePaginas = ativas.reduce(
    (total, aula) => total + (Array.isArray(aula.pages) ? aula.pages.length : 0),
    0,
  );

  return {
    idsUsados: [...idsUsados],
    idsDeOutrasAulas,
    idsHistoricosDaAula,
    aulasExistentes: ativas.map((aula) => ({ numero: aula.number, titulo: aula.title })),
    mediaDePaginas: ativas.length > 0 ? somaDePaginas / ativas.length : 0,
  };
}

// ─────────────────────────── respostas por bloco ───────────────────────────

/**
 * Quantos alunos **distintos** têm resposta gravada em cada bloco interativo.
 * As chaves vêm de `keys.ts` (via `chavesDoBloco`) — nunca concatenadas aqui.
 */
export async function alunosPorBloco(
  aula: { id: string; number: number },
  pages: ReadonlyArray<Page>,
): Promise<Map<string, Set<string>>> {
  const blocos = blocosInterativos(pages);
  const saida = new Map<string, Set<string>>(blocos.map((b) => [b.id, new Set<string>()]));
  if (blocos.length === 0) return saida;

  const respostas = await prisma.exerciseAnswer.findMany({
    where: { lessonId: aula.id },
    select: { userId: true, answerKey: true },
  });
  const chaves = blocos.map((b) => ({ id: b.id, chaves: chavesDoBloco(b.conteudo, aula.number) }));

  for (const resposta of respostas) {
    for (const bloco of chaves) {
      if (chavePertenceAoBloco(resposta.answerKey, bloco.chaves)) {
        saida.get(bloco.id)?.add(resposta.userId);
        break;
      }
    }
  }
  return saida;
}

export function contagemPorBloco(mapa: Map<string, Set<string>>): Record<string, number> {
  const saida: Record<string, number> = {};
  for (const [id, alunos] of mapa) saida[id] = alunos.size;
  return saida;
}

// ─────────────────────────── salvar rascunho ───────────────────────────

export type ConferenciaDoRascunho = { ok: true; pages: Page[] } | { ok: false; erros: string[] };

/**
 * A porta do "Salvar rascunho": nada vira `draftPages` sem passar aqui.
 *
 * 1. Forma (zod, `validarPaginas`) — rascunho inválido é impossível de gravar.
 * 2. Integridade dos ids interativos (§6.2):
 *    - nenhum id repetido dentro da aula;
 *    - nenhum id que pertence a outra aula;
 *    - id **novo** para esta aula não pode já ter resposta gravada — seria
 *      herdar, em silêncio, a resposta de outro bloco.
 *
 * As regras semânticas da §3.5 (gabarito fora do intervalo etc.) **não**
 * bloqueiam o salvar — bloqueiam o publicar. Rascunho é lugar de trabalho.
 */
export async function conferirRascunho(
  aula: { id: string; number: number },
  bruto: unknown,
): Promise<ConferenciaDoRascunho> {
  const forma = validarPaginas(bruto);
  if (!forma.ok) return { ok: false, erros: forma.erros };

  const contexto = await carregarContextoDoCurso(aula.id);
  const erros: string[] = [];
  const vistos = new Map<string, string>();
  const novos: { id: string; t: TipoInterativo; chaves: ReturnType<typeof chavesDoBloco> }[] = [];

  for (const bloco of blocosInterativos(forma.pages)) {
    const onde = `página ${bloco.pagina + 1}, bloco ${bloco.bloco + 1} (\`${bloco.t}\`)`;
    const anterior = vistos.get(bloco.id);
    if (anterior) {
      erros.push(`${onde}: \`id\` "${bloco.id}" repetido — já usado em ${anterior}`);
      continue;
    }
    vistos.set(bloco.id, onde);

    const dona = contexto.idsDeOutrasAulas.get(bloco.id);
    if (dona !== undefined) {
      erros.push(`${onde}: \`id\` "${bloco.id}" pertence à aula ${dona} e não pode ser usado aqui`);
      continue;
    }
    if (!contexto.idsHistoricosDaAula.has(bloco.id)) {
      novos.push({ id: bloco.id, t: bloco.t, chaves: chavesDoBloco(bloco.conteudo, aula.number) });
    }
  }

  if (novos.length > 0) {
    const condicoes: Prisma.ExerciseAnswerWhereInput[] = novos.flatMap((novo) => [
      ...novo.chaves.exatas.map((chave) => ({ answerKey: chave })),
      ...novo.chaves.prefixos.map((prefixo) => ({ answerKey: { startsWith: prefixo } })),
    ]);
    const existentes = await prisma.exerciseAnswer.findMany({
      where: { OR: condicoes },
      select: { answerKey: true },
      distinct: ['answerKey'],
      take: 50,
    });
    for (const novo of novos) {
      if (existentes.some((linha) => chavePertenceAoBloco(linha.answerKey, novo.chaves))) {
        erros.push(
          `bloco \`${novo.t}\` "${novo.id}": este id é novo nesta aula, mas já existem respostas de alunos gravadas com ele — use "Adicionar bloco" para gerar um id novo`,
        );
      }
    }
  }

  return erros.length > 0 ? { ok: false, erros } : { ok: true, pages: forma.pages };
}

// ─────────────────────────── relatório de impacto ───────────────────────────

export type BlocoAfetado = { id: string; t: TipoInterativo; pagina: number; alunos: number };

export type RelatorioDePublicacao = {
  /** Hash do rascunho analisado — a publicação só acontece se o rascunho ainda for este. */
  hash: string;
  /** Erros de forma (zod) ou da §3.5: bloqueiam a publicação. */
  erros: string[];
  /** Avisos da §3.5: exigem confirmação explícita. */
  avisos: string[];
  diferencas: DiferencasDoConteudo;
  resumo: string;
  removidos: BlocoAfetado[];
  alterados: BlocoAfetado[];
  /** Alunos distintos com resposta em algum bloco removido. */
  alunosComRespostasRemovidas: number;
  /** Alunos distintos com resposta em algum bloco alterado. */
  alunosComRespostasAlteradas: number;
  /** Alunos cujo `currentPage` passa da nova última página. */
  alunosAlemDaUltimaPagina: number;
  alunosQueConcluiram: number;
  alunosComProgresso: number;
  /** O texto obrigatório da §6.4, regra 6 — frases prontas para a tela. */
  impacto: string[];
  /** Há gente afetada: a publicação exige a caixa "entendi o impacto". */
  exigeConfirmacaoDeImpacto: boolean;
  versaoAtual: number;
  proximaVersao: number;
};

/**
 * Monta o relatório que a tela de publicação mostra — e que a action refaz,
 * do zero, no servidor, na hora de publicar. Devolve `null` quando a aula não
 * tem rascunho.
 */
export async function montarRelatorioDePublicacao(
  lessonId: string,
): Promise<RelatorioDePublicacao | null> {
  const aula = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, number: true, pages: true, draftPages: true, contentVersion: true },
  });
  if (!aula || aula.draftPages === null) return null;

  const hash = hashDasPaginas(aula.draftPages);
  const publicadas = paginasSoltas(aula.pages);
  const forma = validarPaginas(aula.draftPages);

  const [ultimaVersao, contexto] = await Promise.all([
    prisma.lessonVersion.aggregate({ where: { lessonId }, _max: { version: true } }),
    carregarContextoDoCurso(lessonId),
  ]);
  const versaoAtual = aula.contentVersion;
  const proximaVersao = Math.max(aula.contentVersion, ultimaVersao._max.version ?? 0) + 1;

  if (!forma.ok) {
    const diferencas = compararConteudo(publicadas, []);
    return {
      hash,
      erros: forma.erros,
      avisos: [],
      diferencas,
      resumo: '',
      removidos: [],
      alterados: [],
      alunosComRespostasRemovidas: 0,
      alunosComRespostasAlteradas: 0,
      alunosAlemDaUltimaPagina: 0,
      alunosQueConcluiram: 0,
      alunosComProgresso: 0,
      impacto: [],
      exigeConfirmacaoDeImpacto: false,
      versaoAtual,
      proximaVersao,
    };
  }

  const rascunho = forma.pages;
  const semantica = validarSemantica(rascunho, {
    numero: aula.number,
    idsDeOutrasAulas: contexto.idsDeOutrasAulas,
    aulasExistentes: contexto.aulasExistentes,
    mediaDePaginas: contexto.mediaDePaginas,
  });
  const diferencas = compararConteudo(publicadas, rascunho);
  const ultimaPagina = rascunho.length - 1;

  const [porBloco, alemDaUltima, concluiram, comProgresso] = await Promise.all([
    alunosPorBloco(aula, publicadas),
    prisma.lessonProgress.count({ where: { lessonId, currentPage: { gt: ultimaPagina } } }),
    prisma.lessonProgress.count({ where: { lessonId, status: 'COMPLETED' } }),
    prisma.lessonProgress.count({ where: { lessonId } }),
  ]);

  const velhos = new Map(blocosInterativos(publicadas).map((b) => [b.id, b]));
  const afetado = (id: string): BlocoAfetado | null => {
    const bloco = velhos.get(id);
    if (!bloco) return null;
    return { id, t: bloco.t, pagina: bloco.pagina, alunos: porBloco.get(id)?.size ?? 0 };
  };
  const removidos = diferencas.exerciciosRemovidos
    .map(afetado)
    .filter((b): b is BlocoAfetado => b !== null);
  const alterados = diferencas.exerciciosAlterados
    .map(afetado)
    .filter((b): b is BlocoAfetado => b !== null);

  const uniao = (ids: string[]): number => {
    const alunos = new Set<string>();
    for (const id of ids) for (const aluno of porBloco.get(id) ?? []) alunos.add(aluno);
    return alunos.size;
  };
  const alunosComRespostasRemovidas = uniao(removidos.map((b) => b.id));
  const alunosComRespostasAlteradas = uniao(alterados.filter((b) => b.alunos > 0).map((b) => b.id));

  const impacto: string[] = [];
  const removidosRespondidos = removidos.filter((b) => b.alunos > 0);
  if (removidosRespondidos.length > 0) {
    impacto.push(
      `Esta publicação remove ${plural(removidosRespondidos.length, 'bloco de exercício', 'blocos de exercício')} que ${removidosRespondidos.length === 1 ? 'tem' : 'têm'} resposta de ${plural(alunosComRespostasRemovidas, 'aluno', 'alunos')}. As respostas serão preservadas, mas deixarão de aparecer.`,
    );
  }
  const removidosSemResposta = removidos.length - removidosRespondidos.length;
  if (removidosSemResposta > 0) {
    impacto.push(
      `${plural(removidosSemResposta, 'bloco de exercício removido não tem', 'blocos de exercício removidos não têm')} resposta de nenhum aluno.`,
    );
  }
  const alteradosRespondidos = alterados.filter((b) => b.alunos > 0);
  if (alteradosRespondidos.length > 0) {
    impacto.push(
      `${plural(alteradosRespondidos.length, 'exercício alterado já tem', 'exercícios alterados já têm')} resposta de ${plural(alunosComRespostasAlteradas, 'aluno', 'alunos')}. As respostas continuam gravadas com o mesmo id; se o gabarito ou o número de itens mudou, a correção antiga pode não bater com o conteúdo novo. A nota (score/total) é cache e será recalculada.`,
    );
  }
  if (alemDaUltima > 0) {
    impacto.push(
      `${plural(alemDaUltima, 'aluno está numa página que não existe mais e será movido', 'alunos estão em páginas que não existem mais e serão movidos')} para a última página.`,
    );
  }
  if (concluiram > 0) {
    impacto.push(
      `${plural(concluiram, 'aluno já concluiu', 'alunos já concluíram')} esta aula e ${concluiram === 1 ? 'continua' : 'continuam'} com ela concluída — uma edição nunca desfaz a conclusão.`,
    );
  }
  if (impacto.length === 0) {
    impacto.push(
      comProgresso > 0
        ? `Nenhuma resposta nem posição de aluno é afetada (${plural(comProgresso, 'aluno tem', 'alunos têm')} progresso nesta aula).`
        : 'Nenhum aluno tem progresso nesta aula ainda.',
    );
  }

  return {
    hash,
    erros: semantica.erros,
    avisos: semantica.avisos,
    diferencas,
    resumo: resumirDiferencas(diferencas),
    removidos,
    alterados,
    alunosComRespostasRemovidas,
    alunosComRespostasAlteradas,
    alunosAlemDaUltimaPagina: alemDaUltima,
    alunosQueConcluiram: concluiram,
    alunosComProgresso: comProgresso,
    impacto,
    exigeConfirmacaoDeImpacto:
      removidosRespondidos.length > 0 || alteradosRespondidos.length > 0 || alemDaUltima > 0,
    versaoAtual,
    proximaVersao,
  };
}

// ─────────────────────────────── publicar ───────────────────────────────

export class RascunhoMudouError extends Error {
  constructor() {
    super('RASCUNHO_MUDOU');
    this.name = 'RascunhoMudouError';
  }
}

export type ResultadoDaPublicacao = {
  versao: number;
  versaoAnterior: number;
  paginas: number;
  progressosReposicionados: number;
  /** `null` quando a sincronização de `MediaUsage` falhou (a publicação vale mesmo assim). */
  midias: { registrados: number; ignorados: number } | null;
};

/**
 * Publica o rascunho. Tudo que é banco numa transação:
 *
 * 1. relê a aula e confere que o rascunho ainda é o que o admin analisou
 *    (`hashEsperado`) — senão lança {@link RascunhoMudouError};
 * 2. se a aula nunca teve versão, guarda o conteúdo que está saindo como a
 *    versão atual ("publicado antes do histórico") — sem isso, a primeira
 *    publicação apagaria o único registro do original;
 * 3. `pages = draftPages`, `draftPages = NULL`, `contentVersion` sobe;
 * 4. cria a `LessonVersion` com snapshot e resumo;
 * 5. clamp de `currentPage` (§6.4, regra 2) — `status` não é tocado (D10).
 *
 * Fora da transação: `MediaUsage` é reescrito com a função da biblioteca de
 * mídia. Se falhar, a publicação continua valendo e o chamador avisa.
 *
 * ⚠️ Não mexe em `published`: publicar conteúdo ≠ colocar a aula no ar. Isso
 * continua na aba Dados.
 */
export async function publicarRascunho(entrada: {
  lessonId: string;
  hashEsperado: string;
  adminId: string;
  resumo: string;
}): Promise<ResultadoDaPublicacao> {
  const resultado = await prisma.$transaction(async (tx) => {
    const aula = await tx.lesson.findUnique({
      where: { id: entrada.lessonId },
      select: {
        id: true,
        title: true,
        subtitle: true,
        pages: true,
        draftPages: true,
        contentVersion: true,
      },
    });
    if (!aula || aula.draftPages === null) throw new RascunhoMudouError();
    if (hashDasPaginas(aula.draftPages) !== entrada.hashEsperado) throw new RascunhoMudouError();

    const rascunho = validarPaginas(aula.draftPages);
    if (!rascunho.ok) throw new RascunhoMudouError();

    const ultima = await tx.lessonVersion.aggregate({
      where: { lessonId: aula.id },
      _max: { version: true },
    });
    const maiorVersao = ultima._max.version;

    if (maiorVersao === null) {
      await tx.lessonVersion.create({
        data: {
          lessonId: aula.id,
          version: aula.contentVersion,
          pages: aula.pages as Prisma.InputJsonValue,
          title: aula.title,
          subtitle: aula.subtitle,
          publishedById: null,
          resumo: 'conteúdo publicado antes do histórico de versões',
        },
      });
    }

    const novaVersao = Math.max(aula.contentVersion, maiorVersao ?? 0) + 1;
    const paginas = rascunho.pages as unknown as Prisma.InputJsonValue;

    await tx.lesson.update({
      where: { id: aula.id },
      data: {
        pages: paginas,
        draftPages: Prisma.DbNull,
        contentVersion: novaVersao,
        updatedById: entrada.adminId,
      },
    });

    await tx.lessonVersion.create({
      data: {
        lessonId: aula.id,
        version: novaVersao,
        pages: paginas,
        title: aula.title,
        subtitle: aula.subtitle,
        publishedById: entrada.adminId,
        resumo: entrada.resumo,
      },
    });

    const ultimaPagina = rascunho.pages.length - 1;
    const ajustados = await tx.lessonProgress.updateMany({
      where: { lessonId: aula.id, currentPage: { gt: ultimaPagina } },
      data: { currentPage: ultimaPagina },
    });

    return {
      versao: novaVersao,
      versaoAnterior: aula.contentVersion,
      paginas: rascunho.pages,
      progressosReposicionados: ajustados.count,
    };
  });

  let midias: ResultadoDaPublicacao['midias'] = null;
  try {
    const capa = await prisma.lesson.findUnique({
      where: { id: entrada.lessonId },
      select: { coverUrl: true },
    });
    midias = await sincronizarUsosDaAula({
      lessonId: entrada.lessonId,
      capa: capa?.coverUrl ?? null,
      pages: resultado.paginas,
    });
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[publicação] MediaUsage não sincronizado: ${motivo}`);
  }

  return {
    versao: resultado.versao,
    versaoAnterior: resultado.versaoAnterior,
    paginas: resultado.paginas.length,
    progressosReposicionados: resultado.progressosReposicionados,
    midias,
  };
}

// ─────────────────────────────── versões ───────────────────────────────

export type VersaoDaLista = {
  id: string;
  version: number;
  publishedAt: Date;
  autor: string | null;
  resumo: string | null;
  paginas: number;
  title: string;
};

export async function listarVersoes(lessonId: string): Promise<VersaoDaLista[]> {
  const versoes = await prisma.lessonVersion.findMany({
    where: { lessonId },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      publishedAt: true,
      publishedById: true,
      resumo: true,
      pages: true,
      title: true,
    },
  });
  const autores = [
    ...new Set(versoes.map((v) => v.publishedById).filter((id): id is string => id !== null)),
  ];
  const usuarios =
    autores.length > 0
      ? await prisma.user.findMany({ where: { id: { in: autores } }, select: { id: true, email: true } })
      : [];
  const emailPorId = new Map(usuarios.map((u) => [u.id, u.email]));

  return versoes.map((v) => ({
    id: v.id,
    version: v.version,
    publishedAt: v.publishedAt,
    autor: v.publishedById ? (emailPorId.get(v.publishedById) ?? '(usuário removido)') : null,
    resumo: v.resumo,
    paginas: Array.isArray(v.pages) ? v.pages.length : 0,
    title: v.title,
  }));
}
