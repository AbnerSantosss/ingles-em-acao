import { getAllLessons } from './lessons'
import type { CourseModule, LessonSummary } from './types'

/*
 * Este módulo e `./lessons` se importam mutuamente. É seguro porque nenhum dos dois
 * lê um binding do outro durante a avaliação do arquivo: `MODULES` é um literal e
 * todo o resto só é tocado dentro de funções, chamadas depois que os dois já carregaram.
 */

/**
 * Os 7 módulos do curso (seção 4 do contrato / constante `MODULES` do protótipo).
 * Os intervalos são inclusivos e cobrem as 42 aulas sem buraco nem sobreposição.
 */
export const MODULES: CourseModule[] = [
  { id: 1, title: 'Fundamentos', from: 1, to: 6 },
  { id: 2, title: 'Vocabulário essencial', from: 7, to: 12 },
  { id: 3, title: 'Referência e lugar', from: 13, to: 18 },
  { id: 4, title: 'Presente simples', from: 19, to: 24 },
  { id: 5, title: 'Ações e rotina', from: 25, to: 30 },
  { id: 6, title: 'Dia a dia e preferências', from: 31, to: 36 },
  { id: 7, title: 'Quantidade e passado', from: 37, to: 42 },
]

/** Quantos módulos o curso tem. */
export const TOTAL_MODULES = MODULES.length

/**
 * O módulo ao qual uma aula pertence.
 * @param n número da aula (1 a 42)
 * @returns o módulo, ou `null` se o número estiver fora da trilha
 */
export function getModuleForLesson(n: number): CourseModule | null {
  return MODULES.find((m) => n >= m.from && n <= m.to) ?? null
}

/** O módulo pelo seu id (1 a 7), ou `null`. */
export function getModuleById(id: number): CourseModule | null {
  return MODULES.find((m) => m.id === id) ?? null
}

/** Um módulo junto com as aulas que ele cobre — o formato da trilha agrupada. */
export interface ModuleWithLessons {
  module: CourseModule
  lessons: LessonSummary[]
}

/**
 * As 42 aulas agrupadas nos 7 módulos, na ordem dos módulos e das aulas.
 * Uma aula fora de qualquer intervalo simplesmente não aparece — o que hoje não acontece,
 * já que os 7 intervalos cobrem 1 a 42.
 */
export function getLessonsByModule(): ModuleWithLessons[] {
  const lessons = getAllLessons()
  return MODULES.map((module) => ({
    module,
    lessons: lessons.filter((l) => l.moduleId === module.id),
  }))
}
