/**
 * Seed do WSA English: módulos e aulas.
 *
 * Lê o conteúdo de `content/course-data.mjs` (a carga inicial das 42 aulas) e
 * **semeia** as tabelas Module e Lesson. É idempotente: rodar várias vezes não
 * duplica nada, porque tudo é procurado antes pela chave única (Module.id e
 * Lesson.number).
 *
 * ⚠️ O seed semeia, ele não manda mais no conteúdo.
 *
 * Desde que o painel existe, quem manda na linha do banco é o PO. O seed só
 * preenche o que **ainda não existe**; em linha que já existe ele não encosta.
 * Três motivos concretos:
 *
 * 1. `published`. As 42 aulas nascem publicadas (são conteúdo vivo, o app já as
 *    mostra hoje), então `published: true` está no bloco de **criação** — e só
 *    lá. Se o PO despublicou a aula 37 de propósito, o seed não pode
 *    republicá-la pelas costas dele. Como `published` nunca aparece num update,
 *    isso é impossível por construção, e não por disciplina de quem edita.
 * 2. Edição editorial. Título, subtítulo, capa, módulo e páginas passaram a ser
 *    editáveis na tela. Sobrescrever isso com o arquivo estático apagaria o
 *    trabalho do PO sem aviso.
 * 3. `RUN_SEED=true` esquecido. O DEPLOY avisa que essa variável faz o seed
 *    rodar a **cada** start do contêiner. Com o seed conservador, um start extra
 *    vira um no-op; com o seed antigo, viraria um rollback silencioso de tudo
 *    que foi editado desde o último deploy.
 *
 * Quando o conteúdo estático mudar de verdade e precisar entrar no banco, o
 * caminho é explícito e consciente: `--ressincronizar`. Mesmo aí, `published`,
 * `videoUrl` e `archivedAt` continuam intocados — estado, não conteúdo.
 *
 * Uso:
 *   npm run db:seed                       cria o que falta, não altera o que existe
 *   npm run db:seed -- --dry-run          confere o conteúdo sem tocar no banco
 *   npm run db:seed -- --ressincronizar   sobrescreve o conteúdo das aulas existentes
 */
import fs from 'node:fs';
import path from 'node:path';

import type { Prisma, PrismaClient } from '@prisma/client';

import { aplicarAudios, validarManifesto, type ManifestoDeAudio } from '../src/lib/audio/aplicar';
import { CourseSchema, descreverErros } from '../src/lib/content/blocks';
import type { Lesson } from '../src/lib/content/blocks';

// ---------------------------------------------------------------------------
// Módulos (constante MODULES do protótipo — seção 4 do CONTRACT.md)
// ---------------------------------------------------------------------------

const MODULOS = [
  { id: 1, order: 1, title: 'Fundamentos', fromLesson: 1, toLesson: 6 },
  { id: 2, order: 2, title: 'Vocabulário essencial', fromLesson: 7, toLesson: 12 },
  { id: 3, order: 3, title: 'Referência e lugar', fromLesson: 13, toLesson: 18 },
  { id: 4, order: 4, title: 'Presente simples', fromLesson: 19, toLesson: 24 },
  { id: 5, order: 5, title: 'Ações e rotina', fromLesson: 25, toLesson: 30 },
  { id: 6, order: 6, title: 'Dia a dia e preferências', fromLesson: 31, toLesson: 36 },
  { id: 7, order: 7, title: 'Quantidade e passado', fromLesson: 37, toLesson: 42 },
] as const;

/** Só as aulas 1 a 10 têm capa desenhada (public/lessons/capas/NN.png). */
const ULTIMA_AULA_COM_CAPA = 10;

// ---------------------------------------------------------------------------
// Validação do conteúdo cru
// ---------------------------------------------------------------------------

// O conteúdo é a fonte de verdade, e `CourseSchema` é a forma congelada dele
// (src/lib/content/blocks.ts). Aqui os 1.538 blocos são validados de verdade: se o seed
// falha, ou o esquema está errado, ou o conteúdo está torto — e os dois precisam aparecer.
type AulaCrua = Lesson;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * "Verb to be — Affirmative" vira "verb-to-be-affirmative".
 * "Can / Can t" vira "can-cant" e "Numbers 1-100" vira "numbers-1-100".
 */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tira acentos
    .replace(/['‘’´`]/g, '') // apóstrofos somem em vez de virar hífen
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Descobre a que módulo a aula pertence pela faixa fromLesson..toLesson. */
export function moduloDaAula(numero: number): number {
  const modulo = MODULOS.find((m) => numero >= m.fromLesson && numero <= m.toLesson);
  if (!modulo) {
    const ultima = MODULOS[MODULOS.length - 1].toLesson;
    throw new Error(`Aula ${numero} não cai em nenhuma faixa de módulo (1 a ${ultima}).`);
  }
  return modulo.id;
}

/** "/lessons/capas/07.png" para as aulas 1..10, null para as demais. */
export function capaDaAula(numero: number): string | null {
  if (numero > ULTIMA_AULA_COM_CAPA) return null;
  return `/lessons/capas/${String(numero).padStart(2, '0')}.png`;
}

type LinhaDeAula = {
  number: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  coverUrl: string | null;
  moduleId: number;
  pages: Prisma.InputJsonValue;
};

/**
 * Lê os manifestos de áudio gerados (`content/audio/gerado/aula-NN.json`, contrato 2.3).
 * Pasta ausente = nenhuma aula tem áudio ainda. Arquivo inválido para o seed com a lista
 * de erros: áudio torto não pode entrar no banco em silêncio.
 */
function lerAudiosGerados(): Map<number, ManifestoDeAudio> {
  const pasta = path.join(process.cwd(), 'content', 'audio', 'gerado');
  const manifestos = new Map<number, ManifestoDeAudio>();
  if (!fs.existsSync(pasta)) return manifestos;

  for (const nome of fs.readdirSync(pasta).sort()) {
    if (!/^aula-\d{2}\.json$/.test(nome)) continue;
    const bruto: unknown = JSON.parse(fs.readFileSync(path.join(pasta, nome), 'utf8'));
    const lido = validarManifesto(bruto);
    if (!lido.ok) {
      throw new Error(`content/audio/gerado/${nome} é inválido:\n  ${lido.erros.join('\n  ')}`);
    }
    manifestos.set(lido.manifesto.aula, lido.manifesto);
  }
  return manifestos;
}

/** Monta (e confere) as linhas da tabela Lesson a partir do conteúdo cru. */
function montarLinhas(
  aulas: AulaCrua[],
  audios: Map<number, ManifestoDeAudio>,
): { linhas: LinhaDeAula[]; paginas: number } {
  const slugsUsados = new Map<string, number>();
  const numerosUsados = new Set<number>();
  let paginas = 0;

  const linhas = aulas.map((aula) => {
    if (numerosUsados.has(aula.id)) {
      throw new Error(`Aula ${aula.id} aparece duas vezes em course-data.mjs.`);
    }
    numerosUsados.add(aula.id);

    const slug = slugify(aula.title);
    if (!slug) {
      throw new Error(`Aula ${aula.id} gerou slug vazio a partir do título "${aula.title}".`);
    }
    const jaUsadoPor = slugsUsados.get(slug);
    if (jaUsadoPor !== undefined) {
      throw new Error(`Slug "${slug}" repetido entre as aulas ${jaUsadoPor} e ${aula.id}.`);
    }
    slugsUsados.set(slug, aula.id);

    paginas += aula.pages.length;

    return {
      number: aula.id,
      code: aula.code,
      slug,
      title: aula.title,
      subtitle: aula.sub,
      estimatedTime: aula.time,
      coverUrl: capaDaAula(aula.id),
      moduleId: moduloDaAula(aula.id),
      // O array de páginas vai para o banco com os áudios gerados já aplicados (contrato 10.4):
      // o motor de aulas lê os blocos e os áudios daqui.
      pages: aplicarAudios(aula.pages, audios.get(aula.id)) as unknown as Prisma.InputJsonValue,
    };
  });

  return { linhas, paginas };
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

async function carregarConteudo(): Promise<AulaCrua[]> {
  const modulo: unknown = await import('../content/course-data.mjs');
  const resultado = CourseSchema.safeParse(modulo);

  if (!resultado.success) {
    const erros = descreverErros(resultado.error.issues, modulo);
    const mostrados = erros.slice(0, 20).map((erro) => `  • ${erro}`).join('\n');
    const resto = erros.length > 20 ? `\n  … e mais ${erros.length - 20} erro(s).` : '';
    throw new Error(
      `content/course-data.mjs não passou na validação (${erros.length} erro(s)):\n${mostrados}${resto}`,
    );
  }

  // Os objetos são `strict`: nada é descartado na validação, então a cópia do zod é fiel
  // ao arquivo — e vem tipada, o que o objeto cru não estava.
  return resultado.data.LESSONS;
}

/** O que uma passada do seed fez, para o relatório no fim. */
type Contagem = { criados: number; atualizados: number; intactos: number };

function somar(contagem: Contagem, o_que: keyof Contagem): void {
  contagem[o_que] += 1;
}

async function gravar(
  prisma: PrismaClient,
  linhas: LinhaDeAula[],
  ressincronizar: boolean,
): Promise<{ modulos: Contagem; aulas: Contagem }> {
  const modulos: Contagem = { criados: 0, atualizados: 0, intactos: 0 };
  const aulas: Contagem = { criados: 0, atualizados: 0, intactos: 0 };

  for (const modulo of MODULOS) {
    const existente = await prisma.module.findUnique({
      where: { id: modulo.id },
      select: { id: true, archivedAt: true },
    });

    if (!existente) {
      await prisma.module.create({
        data: {
          id: modulo.id,
          order: modulo.order,
          title: modulo.title,
          fromLesson: modulo.fromLesson,
          toLesson: modulo.toLesson,
        },
      });
      somar(modulos, 'criados');
      continue;
    }

    // Módulo arquivado fica arquivado: desarquivar é decisão do painel, não do
    // seed. O `--ressincronizar` também não o traz de volta.
    if (!ressincronizar || existente.archivedAt !== null) {
      somar(modulos, 'intactos');
      continue;
    }

    await prisma.module.update({
      where: { id: modulo.id },
      data: {
        order: modulo.order,
        title: modulo.title,
        fromLesson: modulo.fromLesson,
        toLesson: modulo.toLesson,
      },
    });
    somar(modulos, 'atualizados');
  }

  console.log(
    `[seed] módulos — criados: ${modulos.criados} · atualizados: ${modulos.atualizados} · intactos: ${modulos.intactos}`,
  );

  const agora = new Date();

  for (const linha of linhas) {
    const existente = await prisma.lesson.findUnique({
      where: { number: linha.number },
      select: { id: true, archivedAt: true },
    });

    if (!existente) {
      await prisma.lesson.create({
        data: {
          ...linha,
          // ⚠️ `published` aparece **só aqui**, na criação. As 42 aulas do
          // e-book são conteúdo vivo e nascem no ar; o que o PO despublicar
          // depois continua despublicado, porque nenhum update abaixo toca
          // neste campo.
          published: true,
          publishedAt: agora,
        },
      });
      somar(aulas, 'criados');
      continue;
    }

    // Aula arquivada (D8: nada é apagado de verdade) não volta pelo seed.
    if (!ressincronizar || existente.archivedAt !== null) {
      somar(aulas, 'intactos');
      continue;
    }

    await prisma.lesson.update({
      where: { number: linha.number },
      // Ficam de fora de propósito: `published`/`publishedAt` (estado editorial
      // do PO), `videoUrl` e os campos de vídeo (preenchidos fora do
      // course-data.mjs), `draftPages` (rascunho em andamento no editor),
      // `archivedAt` e `contentVersion` (quem versiona é o editor, que grava a
      // LessonVersion junto — o seed não tem par para a versão que criaria).
      data: {
        code: linha.code,
        slug: linha.slug,
        title: linha.title,
        subtitle: linha.subtitle,
        estimatedTime: linha.estimatedTime,
        coverUrl: linha.coverUrl,
        moduleId: linha.moduleId,
        pages: linha.pages,
      },
    });
    somar(aulas, 'atualizados');
  }

  return { modulos, aulas };
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const ressincronizar = process.argv.includes('--ressincronizar');

  // O Prisma 7 não carrega mais o .env sozinho, e este script roda fora do Next.
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
    } catch {
      // Sem .env local: as variáveis precisam vir do ambiente.
    }
  }

  const aulas = await carregarConteudo();
  const { linhas, paginas } = montarLinhas(aulas, lerAudiosGerados());
  const comCapa = linhas.filter((linha) => linha.coverUrl !== null).length;
  const primeira = linhas[0];
  const ultima = linhas[linhas.length - 1];

  if (dryRun) {
    console.log('[seed] --dry-run: nada foi gravado no banco.');
    console.log(`[seed] aulas conferidas: ${linhas.length} (${paginas} páginas)`);
    console.log(`[seed] aulas com capa: ${comCapa} · módulos: ${MODULOS.length}`);
    console.log(`[seed] primeira: ${primeira.code} -> /aula/${primeira.slug}`);
    console.log(`[seed] última:   ${ultima.code} -> /aula/${ultima.slug}`);
    return;
  }

  if (ressincronizar) {
    console.warn(
      '[seed] --ressincronizar: o conteúdo das aulas existentes será sobrescrito pelo course-data.mjs.',
    );
    console.warn(
      '[seed] publicação, vídeo, rascunho e arquivamento continuam como estão no banco.',
    );
  }

  // Importado sob demanda para que o .env já esteja carregado quando o client nascer.
  const { prisma } = (await import('../src/lib/db')) as { prisma: PrismaClient };

  try {
    const { aulas: contagem } = await gravar(prisma, linhas, ressincronizar);
    console.log(
      `[seed] aulas — criadas: ${contagem.criados} · atualizadas: ${contagem.atualizados} · intactas: ${contagem.intactos}`,
    );
    console.log(`[seed] conteúdo conferido: ${linhas.length} aulas (${paginas} páginas)`);
    console.log(`[seed] aulas com capa: ${comCapa}`);
    if (contagem.intactos > 0 && !ressincronizar) {
      console.log(
        '[seed] aulas existentes não foram tocadas. Use --ressincronizar para reimportar o conteúdo.',
      );
    }
    // Fichas de prática com IA (content/pratica/aula-NN.json) em Lesson.practice.
    // Ficha inválida não para o seed: aparece no aviso e a aula fica sem ficha.
    const { carregarPratica } = await import('../src/lib/pratica/carregar');
    const pratica = await carregarPratica(prisma, { sistema: 'seed' });
    console.log(
      `[seed] fichas de prática: lidas ${pratica.lidas} · gravadas ${pratica.gravadas} · iguais ${pratica.iguais} · inválidas ${pratica.invalidas} · sem aula ${pratica.semAula}`,
    );
    for (const erro of pratica.erros) console.warn(`[seed] prática: ${erro}`);
    console.log('[seed] concluído.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro: unknown) => {
  console.error('[seed] falhou:', erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});
