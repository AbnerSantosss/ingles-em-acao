/**
 * Aplica o manifesto gerado pelo pipeline de áudio (`content/audio/gerado/aula-NN.json`,
 * contrato 2.5) às páginas de uma aula.
 *
 * Usada pelo `prisma/seed.ts` e pelo script de migração de conteúdo (pacote 10), para que
 * banco novo e banco migrado fiquem iguais. Função pura: não lê arquivo nem banco.
 */
import { z } from 'zod';

import { AudioClipSchema, descreverErros } from '@/lib/content/blocks';
import type { AudioClip, LessonPage } from '@/lib/content/types';

/** O manifesto de uma aula, como o pipeline grava. `pagina` começa em 1. */
export interface ManifestoDeAudio {
  aula: number;
  clips: { pagina: number; clip: AudioClip }[];
}

const ManifestoSchema = z.strictObject({
  aula: z.number().int().min(1).max(42),
  clips: z.array(
    z.strictObject({
      pagina: z.number().int().min(1),
      clip: AudioClipSchema,
    }),
  ),
});

/** Identidade exata de tipos (a mesma técnica de `ConferenciaDeTipos`, em `blocks.ts`). */
type Identico<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
  ? true
  : false;

type Confere<C extends true> = C;

/** Se o esquema e a interface divergirem, o TypeScript falha aqui. */
export type ConferenciaDoManifesto = Confere<Identico<z.infer<typeof ManifestoSchema>, ManifestoDeAudio>>;

/**
 * Confere um manifesto lido de arquivo. Além da forma, recusa `id` de clipe repetido:
 * dois clipes com o mesmo `id` apontariam para o mesmo registro no painel.
 */
export function validarManifesto(
  valor: unknown,
): { ok: true; manifesto: ManifestoDeAudio } | { ok: false; erros: string[] } {
  const resultado = ManifestoSchema.safeParse(valor);
  if (!resultado.success) {
    return {
      ok: false,
      erros: descreverErros(resultado.error.issues, valor, true).map((linha) =>
        linha.replace(/^conteúdo: /, 'manifesto: '),
      ),
    };
  }

  const vistos = new Set<string>();
  const repetidos: string[] = [];
  for (const { clip } of resultado.data.clips) {
    if (vistos.has(clip.id)) repetidos.push(clip.id);
    vistos.add(clip.id);
  }
  if (repetidos.length > 0) {
    return { ok: false, erros: repetidos.map((id) => `manifesto: o id ${id} aparece mais de uma vez`) };
  }

  return { ok: true, manifesto: resultado.data };
}

/**
 * Devolve as páginas com o campo `audios` trocado pelo do manifesto. Não muda `pages` nem o
 * manifesto: devolve cópias.
 *
 * - `gerado` ausente (aula ainda sem áudio gerado): devolve as páginas como estão, inclusive
 *   com os `audios` que já tinham.
 * - `gerado` presente: cada página recebe exatamente os clipes dela, na ordem do manifesto.
 *   Página sem clipe fica SEM o campo `audios` (nem lista vazia).
 * - Clipe apontando para uma página que não existe: lança erro. O conteúdo mudou de tamanho
 *   depois da geração e o manifesto precisa ser refeito (pacote 09).
 */
export function aplicarAudios(pages: LessonPage[], gerado: ManifestoDeAudio | undefined): LessonPage[] {
  if (!gerado) return pages.map((pagina) => ({ ...pagina }));

  const porPagina = new Map<number, AudioClip[]>();
  for (const { pagina, clip } of gerado.clips) {
    if (!Number.isInteger(pagina) || pagina < 1 || pagina > pages.length) {
      throw new Error(
        `manifesto da aula ${gerado.aula}: o clipe ${clip.id} aponta para a página ${pagina}, mas a aula tem ${pages.length} página(s)`,
      );
    }
    const lista = porPagina.get(pagina) ?? [];
    lista.push({ ...clip });
    porPagina.set(pagina, lista);
  }

  return pages.map((pagina, indice) => {
    const copia: LessonPage = { ...pagina };
    delete copia.audios;
    const novos = porPagina.get(indice + 1);
    if (novos) copia.audios = novos;
    return copia;
  });
}
