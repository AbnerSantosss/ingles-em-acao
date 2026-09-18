/**
 * Declaração de tipos para `content/course-data.mjs` — o conteúdo do curso
 * (42 aulas, 309 páginas) exportado pelo protótipo do Claude Designer.
 *
 * O arquivo real é JavaScript puro e continua sendo a fonte de verdade do conteúdo:
 * este `.d.ts` só descreve o formato do que ele exporta.
 *
 * COMO CONSUMIR — o TypeScript não usa um `.d.ts` para um import escrito com a
 * extensão `.mjs` (para `.mjs` ele procura `.d.mts`) e, com `allowJs` ligado, acaba
 * inferindo tipos do próprio JavaScript. Por isso `src/lib/content/lessons.ts` importa
 * o valor pelo caminho com extensão (que os bundlers sempre resolvem) e traz o tipo
 * daqui pelo caminho sem extensão, num `import type` que some na compilação:
 *
 * ```ts
 * import type { CourseData } from '../../../content/course-data'
 * import * as raw from '../../../content/course-data.mjs'
 * const data = raw as unknown as CourseData
 * ```
 */

import type { Lesson, TrackItem } from '../src/lib/content/types'

/** As 42 aulas, em ordem, cada uma com suas páginas de blocos. */
export declare const LESSONS: Lesson[]

/** A trilha: número e título em inglês das 42 aulas, para as listas de navegação. */
export declare const TRACK: TrackItem[]

/** O módulo inteiro, para quem precisa aplicar o tipo a um `import * as`. */
export interface CourseData {
  LESSONS: Lesson[]
  TRACK: TrackItem[]
}
