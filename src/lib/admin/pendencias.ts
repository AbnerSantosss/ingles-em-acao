/**
 * Pendências de mídia — o que falta de imagem e de vídeo em cada aula.
 *
 * ⚠️ MÓDULO DE SERVIDOR (importa o Prisma). Nunca importe de um `'use client'`.
 *
 * **Não existe tabela de pendências.** A lista é calculada a cada leitura a
 * partir do próprio conteúdo da aula — `pages` (publicado) e `draftPages`
 * (rascunho) — e das colunas `coverUrl`, `videoRef` e `videoUrl`. Assim ela
 * nunca fica desatualizada: basta pôr a imagem no bloco (e salvar o rascunho)
 * para o item sumir daqui.
 *
 * O que conta como "espaço de ilustração sem imagem" segue o que o renderizador
 * do aluno (`Ilustracao`, em `components/lesson`) faz: ele usa `src`; sem `src`,
 * tenta a arte legada do id; sem arte, mostra o placeholder desenhado. Então:
 *
 * - bloco `image` sem `src`;
 * - bloco `profile` sem `src`;
 * - item de `cards` / `steps` que **tem** espaço de ilustração (`id` ou `ph`) e
 *   está sem `src` — item sem `id` nem `ph` é só texto, não tem ilustração.
 *
 * ⚠️ Placeholder não é defeito: o aluno vê um quadro desenhado e a aula funciona.
 * A lista existe para o PO saber o que ainda vai receber imagem, não para
 * bloquear publicação.
 */
import { prisma } from '@/lib/db';

/**
 * Ids que já têm arte embutida no app (o `ARTE_LEGADA` de
 * `components/lesson/Ilustracao`). Mantenha em sincronia se aquele mapa crescer.
 */
const IDS_COM_ARTE_LEGADA: ReadonlySet<string> = new Set(['a1p1']);

export type TipoDeEspaco = 'image' | 'profile' | 'cards' | 'steps';

export const ROTULO_DO_ESPACO: Record<TipoDeEspaco, string> = {
  image: 'Ilustração',
  profile: 'Perfil',
  cards: 'Cartão',
  steps: 'Passo',
};

/** Um espaço de ilustração ainda sem imagem. */
export type EspacoSemImagem = {
  /** Página da aula, contando de 1 (como o editor mostra). */
  pagina: number;
  tipo: TipoDeEspaco;
  /** Posição do item dentro do bloco (cartão/passo), contando de 1. */
  item: number | null;
  /** Id do espaço (`a3p2`…), quando houver. */
  id: string | null;
  /** O que o placeholder descreve — o briefing da imagem. */
  ph: string | null;
};

export type PendenciasDaAula = {
  id: string;
  numero: number;
  codigo: string;
  titulo: string;
  publicada: boolean;
  temRascunho: boolean;
  semCapa: boolean;
  semVideo: boolean;
  /** Espaços sem imagem no conteúdo **publicado**. */
  publicado: EspacoSemImagem[];
  /** Espaços sem imagem no **rascunho**; `null` quando não há rascunho. */
  rascunho: EspacoSemImagem[] | null;
};

export type PanoramaDePendencias = {
  aulas: PendenciasDaAula[];
  totais: {
    aulas: number;
    /** Espaços sem imagem no conteúdo em edição (rascunho, ou publicado se não houver). */
    ilustracoes: number;
    semCapa: number;
    semVideo: number;
    /** Aulas sem nenhuma pendência. */
    completas: number;
  };
};

type Registro = Record<string, unknown>;

function ehRegistro(valor: unknown): valor is Registro {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function textoOuNulo(valor: unknown): string | null {
  return typeof valor === 'string' && valor.trim() !== '' ? valor : null;
}

/** O espaço está coberto: tem `src` ou tem arte legada pelo id. */
function coberto(espaco: Registro): boolean {
  if (textoOuNulo(espaco.src)) return true;
  const id = textoOuNulo(espaco.id);
  return id !== null && IDS_COM_ARTE_LEGADA.has(id);
}

/**
 * Percorre `pages[i].blocks[j]` sem exigir que o JSON passe no esquema: uma aula
 * com um bloco quebrado ainda precisa aparecer na lista, e o que não tem a forma
 * esperada é simplesmente ignorado.
 */
export function espacosSemImagem(paginas: unknown): EspacoSemImagem[] {
  if (!Array.isArray(paginas)) return [];
  const faltando: EspacoSemImagem[] = [];

  paginas.forEach((pagina, indiceDaPagina) => {
    if (!ehRegistro(pagina) || !Array.isArray(pagina.blocks)) return;

    for (const bloco of pagina.blocks) {
      if (!ehRegistro(bloco)) continue;
      const tipo = bloco.t;

      if (tipo === 'image' || tipo === 'profile') {
        if (!coberto(bloco)) {
          faltando.push({
            pagina: indiceDaPagina + 1,
            tipo,
            item: null,
            id: textoOuNulo(bloco.id),
            ph: textoOuNulo(bloco.ph),
          });
        }
        continue;
      }

      if ((tipo === 'cards' || tipo === 'steps') && Array.isArray(bloco.items)) {
        bloco.items.forEach((item, indiceDoItem) => {
          if (!ehRegistro(item)) return;
          const id = textoOuNulo(item.id);
          const ph = textoOuNulo(item.ph);
          if (id === null && ph === null) return; // item só de texto
          if (coberto(item)) return;
          faltando.push({ pagina: indiceDaPagina + 1, tipo, item: indiceDoItem + 1, id, ph });
        });
      }
    }
  });

  return faltando;
}

/** O que o PO está editando agora: o rascunho, se houver; senão, o publicado. */
export function emEdicao(aula: PendenciasDaAula): EspacoSemImagem[] {
  return aula.rascunho ?? aula.publicado;
}

export function aulaCompleta(aula: PendenciasDaAula): boolean {
  return !aula.semCapa && !aula.semVideo && emEdicao(aula).length === 0;
}

/**
 * Todas as aulas não arquivadas, em ordem de número, com as pendências de cada
 * uma. Lança se o banco não responder — quem chama decide o estado degradado.
 */
export async function carregarPendenciasDeMidia(): Promise<PanoramaDePendencias> {
  const linhas = await prisma.lesson.findMany({
    where: { archivedAt: null },
    orderBy: { number: 'asc' },
    select: {
      id: true,
      number: true,
      code: true,
      title: true,
      published: true,
      coverUrl: true,
      videoRef: true,
      videoUrl: true,
      pages: true,
      draftPages: true,
    },
  });

  const aulas: PendenciasDaAula[] = linhas.map((linha) => ({
    id: linha.id,
    numero: linha.number,
    codigo: linha.code,
    titulo: linha.title,
    publicada: linha.published,
    temRascunho: linha.draftPages !== null,
    semCapa: textoOuNulo(linha.coverUrl) === null,
    semVideo: textoOuNulo(linha.videoRef) === null && textoOuNulo(linha.videoUrl) === null,
    publicado: espacosSemImagem(linha.pages),
    rascunho: linha.draftPages !== null ? espacosSemImagem(linha.draftPages) : null,
  }));

  return {
    aulas,
    totais: {
      aulas: aulas.length,
      ilustracoes: aulas.reduce((soma, aula) => soma + emEdicao(aula).length, 0),
      semCapa: aulas.filter((aula) => aula.semCapa).length,
      semVideo: aulas.filter((aula) => aula.semVideo).length,
      completas: aulas.filter(aulaCompleta).length,
    },
  };
}
