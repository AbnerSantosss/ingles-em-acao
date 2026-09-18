import type { CourseData } from '../../../content/course-data'
import * as courseData from '../../../content/course-data.mjs'
import { getModuleForLesson } from './modules'
import type { Lesson, LessonSummary, TrackItem } from './types'

/*
 * O valor é importado pelo caminho com extensão, que Node, Turbopack, webpack e tsx
 * resolvem sem depender de lista de extensões. O tipo vem do `content/course-data.d.ts`
 * pelo `import type` acima, que desaparece na compilação. A conversão abaixo é o único
 * ponto em que os dois se encontram.
 */
const data = courseData as unknown as CourseData

/** As 42 aulas cruas, como estão no `course-data.mjs`. */
export const LESSONS: Lesson[] = data.LESSONS

/** A trilha: número e título em inglês de cada aula. */
export const TRACK: TrackItem[] = data.TRACK

/** Quantas aulas o curso tem (42). */
export const TOTAL_LESSONS = LESSONS.length

/** Quantas páginas somadas todas as aulas têm (309). */
export const TOTAL_PAGES = LESSONS.reduce((soma, aula) => soma + aula.pages.length, 0)

/** Até que número de aula existe capa em `public/lessons/capas/`. */
const ULTIMA_AULA_COM_CAPA = 10

/**
 * Converte um título de aula em slug de URL.
 * Tira acentos e apóstrofos (Can't → cant), troca o resto por hífen e limpa as pontas.
 * Os 42 títulos do curso geram 42 slugs distintos.
 */
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // acentos
    .replace(/[‘’'`´]/g, '') // apóstrofos retos e curvos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * A capa da aula, ou `null` quando ela ainda não tem uma.
 * Hoje só as aulas 1 a 10 têm arte de capa; as outras 32 caem no `null`.
 */
export function getCoverForLesson(n: number): string | null {
  if (n < 1 || n > ULTIMA_AULA_COM_CAPA) return null
  return `/lessons/capas/${String(n).padStart(2, '0')}.png`
}

/** Índices montados uma única vez, na primeira consulta. */
interface Indice {
  summaries: LessonSummary[]
  porSlug: Map<string, Lesson>
  porNumero: Map<number, Lesson>
  resumoPorSlug: Map<string, LessonSummary>
}

let indice: Indice | null = null

function getIndice(): Indice {
  if (indice) return indice

  const summaries: LessonSummary[] = []
  const porSlug = new Map<string, Lesson>()
  const porNumero = new Map<number, Lesson>()
  const resumoPorSlug = new Map<string, LessonSummary>()

  for (const aula of LESSONS) {
    const slug = slugify(aula.title)
    const resumo: LessonSummary = {
      id: aula.id,
      code: aula.code,
      slug,
      title: aula.title,
      // subtítulo e tempo vêm do próprio LESSONS: as constantes SUBS/TIMES do
      // protótipo estão desatualizadas (ver o aviso na seção 2 do contrato).
      subtitle: aula.sub,
      time: aula.time,
      cover: getCoverForLesson(aula.id),
      pageCount: aula.pages.length,
      moduleId: getModuleForLesson(aula.id)?.id ?? 0,
    }
    summaries.push(resumo)
    porSlug.set(slug, aula)
    porNumero.set(aula.id, aula)
    resumoPorSlug.set(slug, resumo)
  }

  indice = { summaries, porSlug, porNumero, resumoPorSlug }
  return indice
}

/** As 42 aulas resumidas, na ordem da trilha. */
export function getAllLessons(): LessonSummary[] {
  return getIndice().summaries
}

/** A aula completa (com todas as páginas) pelo slug de URL, ou `null`. */
export function getLessonBySlug(slug: string): Lesson | null {
  return getIndice().porSlug.get(slug) ?? null
}

/** A aula completa (com todas as páginas) pelo número, de 1 a 42, ou `null`. */
export function getLessonByNumber(n: number): Lesson | null {
  return getIndice().porNumero.get(n) ?? null
}

/** O resumo da aula pelo slug — útil quando a página não precisa carregar os blocos. */
export function getLessonSummaryBySlug(slug: string): LessonSummary | null {
  return getIndice().resumoPorSlug.get(slug) ?? null
}

/** O resumo da aula pelo número, de 1 a 42, ou `null`. */
export function getLessonSummaryByNumber(n: number): LessonSummary | null {
  return getIndice().summaries.find((l) => l.id === n) ?? null
}

/** O slug de uma aula pelo número, ou `null` — atalho para montar links. */
export function getSlugForLesson(n: number): string | null {
  return getLessonSummaryByNumber(n)?.slug ?? null
}

// Reexportado aqui porque a seção 9 do contrato lista MODULES entre as interfaces
// públicas de `src/lib/content/lessons.ts`. A definição vive em `./modules`.
export { MODULES, getModuleForLesson, getLessonsByModule } from './modules'
export type { Block, Lesson, LessonPage, LessonSummary, TrackItem } from './types'
