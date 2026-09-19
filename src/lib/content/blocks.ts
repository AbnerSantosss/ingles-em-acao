/**
 * Esquema zod dos 31 tipos de bloco do conteúdo — a forma congelada.
 *
 * É o espelho executável de `./types.ts`: o que aquele arquivo declara em tempo de
 * compilação, este valida em tempo de execução. As duas visões não podem divergir, e
 * isso é garantido pelo `ConferenciaDeTipos` no fim do arquivo — uma trava de
 * compilação, não um comentário pedindo boa vontade.
 *
 * Todo objeto é `strict`: campo desconhecido é ERRO, nunca silêncio. É o que impede o
 * editor do admin de gravar lixo que nenhum renderer lê (BACKOFFICE §3.5, "zod (forma)").
 *
 * O que este arquivo NÃO faz: validação semântica. Gabarito fora do intervalo, `answer`
 * que não é permutação de `tokens`, `id` duplicado entre aulas, `next` apontando para
 * aula inexistente — tudo isso é a segunda camada da §3.5 e mora fora daqui.
 */
import { z } from 'zod';

import type * as T from './types';

// ───────────────────────────── primitivos ──────────────────────────────

/** Texto que o renderer lê sem rede de proteção: string vazia aqui é conteúdo quebrado. */
const texto = z.string().min(1);

/** Texto que pode legitimamente vir vazio (o conteúdo atual já traz `""` nesses campos). */
const textoOpcionalmenteVazio = z.string();

/** Paleta `V` do protótipo — campo `v` dos blocos. */
const variante = z.enum([
  'gray',
  'white',
  'mint',
  'lilac',
  'cream',
  'navy',
  'teal',
  'purple',
  'yellow',
  'blue',
  'red',
  'green',
  'plain',
]);

/** Paleta `SOLID` do protótipo — cor chapada de chip, bolinha, traço e botão. */
const solido = z.enum(['navy', 'teal', 'purple', 'yellow', 'blue', 'white', 'orange', 'red']);

/**
 * Campo `c`: o renderer procura primeiro em `SOLID` e cai para a variante de mesmo nome
 * em `V`. Por isso o conjunto aceito é a união das duas paletas.
 */
const acento = z.enum([...solido.options, ...variante.options]);

/** Numerador de item: o conteúdo usa string, o renderer também aceita número. */
const numerador = z.union([texto, z.number()]);

const umaOuDuasColunas = z.union([z.literal(1), z.literal(2)]);
const ateTresColunas = z.union([z.literal(1), z.literal(2), z.literal(3)]);

/**
 * Mídia vinda da biblioteca do admin (BACKOFFICE Fase 0 / §4).
 * `src` é a URL do arquivo; `id`/`ph` continuam sendo o caminho legado
 * (`public/lessons/art/{id}.png`) e o texto do placeholder.
 */
const midiaDaBiblioteca = {
  src: texto.optional(),
  alt: texto.optional(),
};

// ─────────────────────────── blocos estáticos ──────────────────────────

const BadgeSchema = z.strictObject({
  t: z.literal('badge'),
  label: texto,
  page: texto.optional(),
});

const TitleSchema = z.strictObject({
  t: z.literal('title'),
  en: texto,
  pt: texto,
});

const SecSchema = z.strictObject({
  t: z.literal('sec'),
  text: texto,
  c: acento.optional(),
});

const KickerSchema = z.strictObject({
  t: z.literal('kicker'),
  text: texto,
});

const LeadSchema = z.strictObject({
  t: z.literal('lead'),
  text: texto,
});

const NoteSchema = z.strictObject({
  t: z.literal('note'),
  text: texto,
  v: variante.optional(),
  kicker: texto.optional(),
  bar: z.boolean().optional(),
  bold: z.boolean().optional(),
  center: z.boolean().optional(),
});

const ImageSchema = z.strictObject({
  t: z.literal('image'),
  id: texto,
  ph: texto,
  ...midiaDaBiblioteca,
});

const ChipItemSchema = z.strictObject({
  t: texto,
  c: acento.optional(),
});

const ChipsSchema = z.strictObject({
  t: z.literal('chips'),
  items: z.array(ChipItemSchema).min(1),
  title: texto.optional(),
});

const AnswerItemSchema = z.strictObject({
  k: texto,
  a: texto,
  c: acento.optional(),
});

const AnswersSchema = z.strictObject({
  t: z.literal('answers'),
  title: texto,
  items: z.array(AnswerItemSchema).min(1),
  v: variante.optional(),
});

const PronSchema = z.strictObject({
  t: z.literal('pron'),
  code: texto,
  pt: texto,
  title: texto,
  c: acento.optional(),
  v: variante.optional(),
  body: texto.optional(),
  tag: texto.optional(),
  foot: texto.optional(),
  small: z.boolean().optional(),
});

const ObjectiveSchema = z.strictObject({
  t: z.literal('objective'),
  title: texto,
  text: texto,
  v: variante.optional(),
  tag: texto.optional(),
});

const MetaSchema = z.strictObject({
  t: z.literal('meta'),
  label: texto,
  value: texto,
});

const GridItemSchema = z.strictObject({
  title: texto,
  n: texto.optional(),
  kicker: texto.optional(),
  // O conteúdo traz `body: ""` em 5 cards que existem só pelo título.
  body: textoOpcionalmenteVazio.optional(),
  foot: texto.optional(),
  c: acento.optional(),
  v: variante.optional(),
});

const GridSchema = z.strictObject({
  t: z.literal('grid'),
  cols: ateTresColunas,
  items: z.array(GridItemSchema).min(1),
});

const TableRowSchema = z.strictObject({
  a: texto,
  b: texto,
  note: texto.optional(),
  v: variante.optional(),
});

const TableSchema = z.strictObject({
  t: z.literal('table'),
  head: z.tuple([texto, texto]),
  rows: z.array(TableRowSchema).min(1),
});

const RuleSchema = z.strictObject({
  t: z.literal('rule'),
  kicker: texto,
  from: texto,
  to: texto,
  ex: texto,
  tr: texto,
  v: variante.optional(),
  c: acento.optional(),
});

const CompareItemSchema = z.strictObject({
  wrong: texto,
  right: texto,
  note: texto.optional(),
  rnote: texto.optional(),
});

const CompareSchema = z.strictObject({
  t: z.literal('compare'),
  items: z.array(CompareItemSchema).min(1),
});

const ProfileSchema = z.strictObject({
  t: z.literal('profile'),
  name: texto,
  id: texto,
  ph: texto,
  facts: z.array(texto).min(1),
  ...midiaDaBiblioteca,
});

const NextSchema = z.strictObject({
  t: z.literal('next'),
  kicker: texto,
  title: texto,
  body: texto.optional(),
});

const KeySchema = z.strictObject({
  t: z.literal('key'),
  text: texto,
  v: variante.optional(),
});

const CardItemSchema = z.strictObject({
  tag: texto,
  lines: z.array(texto).min(1).optional(),
  note: texto.optional(),
  id: texto.optional(),
  ph: texto.optional(),
  ...midiaDaBiblioteca,
  c: acento.optional(),
  v: variante.optional(),
});

const CardsSchema = z.strictObject({
  t: z.literal('cards'),
  items: z.array(CardItemSchema).min(1),
  cols: umaOuDuasColunas.optional(),
});

const RowItemSchema = z.strictObject({
  text: texto,
  n: numerador.optional(),
  c: acento.optional(),
});

const RowsSchema = z.strictObject({
  t: z.literal('rows'),
  items: z.array(RowItemSchema).min(1),
});

const StepItemSchema = z.strictObject({
  tag: texto,
  lines: z.array(texto).min(1).optional(),
  n: numerador.optional(),
  note: texto.optional(),
  id: texto.optional(),
  ph: texto.optional(),
  ...midiaDaBiblioteca,
  c: acento.optional(),
  v: variante.optional(),
});

const StepsSchema = z.strictObject({
  t: z.literal('steps'),
  items: z.array(StepItemSchema).min(1),
});

const DialogueLineSchema = z.strictObject({
  s: z.enum(['a', 'b']),
  text: texto,
});

const DialogueSchema = z.strictObject({
  t: z.literal('dialogue'),
  items: z.array(DialogueLineSchema).min(1),
});

const BarSchema = z.strictObject({
  t: z.literal('bar'),
  label: texto,
  value: texto,
  pct: texto,
});

// ────────────────────────── blocos interativos ─────────────────────────
//
// `id` é obrigatório e não vazio nos 6 tipos que produzem `ExerciseAnswer` por bloco
// (BACKOFFICE §6.2, opção A). `cta` é a exceção: sua chave é `cta:{lessonId}:{i}`,
// só a lembrança de que o aviso foi aberto.

const McQuestionSchema = z.strictObject({
  q: texto,
  options: z.array(texto).min(2),
  answer: z.number().int().min(0),
  explain: texto.optional(),
});

const McSchema = z.strictObject({
  t: z.literal('mc'),
  id: texto,
  title: texto,
  questions: z.array(McQuestionSchema).min(1),
  v: variante.optional(),
});

const FillItemSchema = z.strictObject({
  pre: texto,
  answers: z.array(texto).min(1),
  post: texto.optional(),
  note: texto.optional(),
  v: variante.optional(),
});

const FillSchema = z.strictObject({
  t: z.literal('fill'),
  id: texto,
  items: z.array(FillItemSchema).min(1),
  title: texto.optional(),
  sub: texto.optional(),
  v: variante.optional(),
  wide: z.boolean().optional(),
});

const MatchSchema = z.strictObject({
  t: z.literal('match'),
  id: texto,
  title: texto,
  left: z.array(texto).min(1),
  right: z.array(texto).min(1),
  answer: z.array(z.number().int().min(0)).min(1),
});

const DndSchema = z.strictObject({
  t: z.literal('dnd'),
  id: texto,
  title: texto,
  sub: texto,
  slots: z.array(texto).min(1),
  tokens: z.array(texto).min(1),
  answer: z.array(texto).min(1),
});

const CheckSchema = z.strictObject({
  t: z.literal('check'),
  id: texto,
  title: texto,
  items: z.array(texto).min(1),
});

const FreeItemSchema = z.strictObject({
  n: texto,
  kicker: texto,
  prefix: texto,
  // `ideas` vem vazio em 46 itens: o exercício não sugere vocabulário nenhum.
  ideas: textoOpcionalmenteVazio,
  c: acento.optional(),
  v: variante.optional(),
});

const FreeSchema = z.strictObject({
  t: z.literal('free'),
  id: texto,
  items: z.array(FreeItemSchema).min(1),
  cols: umaOuDuasColunas.optional(),
});

const CtaItemSchema = z.strictObject({
  icon: z.enum(['play', 'mic']),
  title: texto,
  body: texto,
  plan: texto,
  btn: texto,
  c: acento.optional(),
  v: variante.optional(),
});

const CtaSchema = z.strictObject({
  t: z.literal('cta'),
  items: z.array(CtaItemSchema).min(1),
});

// ────────────────────────── união e agregados ──────────────────────────

/** Os 31 tipos de bloco, discriminados por `t`. */
export const BlockSchema = z.discriminatedUnion('t', [
  BadgeSchema,
  TitleSchema,
  SecSchema,
  KickerSchema,
  LeadSchema,
  NoteSchema,
  ImageSchema,
  ChipsSchema,
  AnswersSchema,
  PronSchema,
  ObjectiveSchema,
  MetaSchema,
  GridSchema,
  TableSchema,
  RuleSchema,
  CompareSchema,
  ProfileSchema,
  NextSchema,
  KeySchema,
  CardsSchema,
  RowsSchema,
  StepsSchema,
  DialogueSchema,
  BarSchema,
  McSchema,
  FillSchema,
  MatchSchema,
  DndSchema,
  CheckSchema,
  FreeSchema,
  CtaSchema,
]);

// ─────────────────────────────── áudio ────────────────────────────────

/** Função pedagógica do áudio. Espelha `CategoriaDeAudio` de `./types.ts`. */
const categoriaDeAudio = z.enum([
  'VOCABULARY_PRONUNCIATION',
  'GRAMMAR_IN_CONTEXT',
  'FIXED_CHUNK',
  'DIALOGUE',
  'TEXT_LISTENING',
  'LISTENING_PRACTICE',
  'PRONUNCIATION_MODEL',
]);

/**
 * Um áudio de uma página da aula (docs/plano-v2/01-CONTRATOS.md, seção 2.1).
 * `id` segue "lesson_NNN_audio_MMM"; `src` segue "/audio/aula-NN/<id>.<hash8>.mp3".
 */
export const AudioClipSchema = z.strictObject({
  id: z.string().regex(/^lesson_\d{3}_audio_\d{3}$/),
  alvo: z.enum(['texto', 'bloco']),
  ancora: texto,
  texto: texto,
  src: z.string().regex(/^\/audio\/aula-\d{2}\/lesson_\d{3}_audio_\d{3}\.[0-9a-f]{8}\.mp3$/),
  categoria: categoriaDeAudio,
  lento: z.boolean().optional(),
});

/**
 * Uma página da aula: unidade de navegação e de progresso. Página sem bloco é erro.
 * `audios` é opcional: página sem áudio não tem o campo.
 */
export const PageSchema = z.strictObject({
  blocks: z.array(BlockSchema).min(1),
  audios: z.array(AudioClipSchema).optional(),
});

/** Uma aula como vem do `course-data.mjs`. Aula sem página é erro. */
export const LessonSchema = z.strictObject({
  id: z.number().int().min(1),
  code: texto,
  title: texto,
  sub: texto,
  time: texto,
  pages: z.array(PageSchema).min(1),
});

/** Entrada da trilha: número da aula e título em inglês. */
export const TrackItemSchema = z.strictObject({
  n: z.number().int().min(1),
  t: texto,
});

/**
 * O conteúdo inteiro, como o módulo `content/course-data.mjs` o exporta.
 *
 * Este é o único objeto não-strict do arquivo, de propósito: o alvo do `parse` é o
 * *namespace* de um módulo ES, que carrega chaves próprias do runtime. Strict aqui
 * reprovaria o import; strict dentro de cada aula é o que realmente importa.
 */
export const CourseSchema = z.object({
  LESSONS: z.array(LessonSchema).min(1),
  TRACK: z.array(TrackItemSchema).min(1),
});

/**
 * Tipos inferidos do esquema. São, por construção, os mesmos de `./types.ts` — veja
 * `ConferenciaDeTipos` no fim do arquivo. Importe de onde for mais conveniente.
 */
export type Block = z.infer<typeof BlockSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type TrackItem = z.infer<typeof TrackItemSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type AudioClip = z.infer<typeof AudioClipSchema>;

// ──────────────────────────── erros legíveis ───────────────────────────

type Problema = z.core.$ZodIssue;
type Caminho = ReadonlyArray<PropertyKey>;

function ler(valor: unknown, chave: PropertyKey): unknown {
  if (valor === null || typeof valor !== 'object') return undefined;
  return (valor as Record<PropertyKey, unknown>)[chave as string];
}

function nomeDoTipo(valor: unknown): string {
  if (valor === null) return 'null';
  if (Array.isArray(valor)) return 'lista';
  return typeof valor;
}

/** "questions[0].answer" — os índices aqui são os do arquivo, contados a partir de zero. */
function formatarCampo(caminho: Caminho): string {
  let saida = '';
  for (const parte of caminho) {
    if (typeof parte === 'number') saida += `[${parte}]`;
    else saida += saida === '' ? String(parte) : `.${String(parte)}`;
  }
  return saida;
}

/** Traduz o problema do zod para uma frase que continua "campo `x` …". */
function frase(problema: Problema): string {
  switch (problema.code) {
    case 'invalid_type':
      return problema.input === undefined
        ? 'ausente'
        : `deveria ser ${problema.expected}, mas veio ${nomeDoTipo(problema.input)}`;
    case 'invalid_value':
      return `tem valor inválido. Aceitos: ${problema.values.map((v) => JSON.stringify(v)).join(' | ')}`;
    case 'too_small':
      return problema.origin === 'string' && Number(problema.minimum) <= 1
        ? 'não pode ficar vazio'
        : `é curto demais (mínimo ${String(problema.minimum)})`;
    case 'too_big':
      return `é longo demais (máximo ${String(problema.maximum)})`;
    case 'invalid_union':
      // O discriminante errado é o caso comum: um `t` que não é nenhum dos 31 tipos.
      return problema.path[problema.path.length - 1] === 't'
        ? 'não é um dos 31 tipos de bloco'
        : 'não casa com nenhum formato aceito';
    case 'not_multiple_of':
      return `deveria ser múltiplo de ${String(problema.divisor)}`;
    case 'invalid_format':
      return `não está no formato ${problema.format}`;
    default:
      return problema.message;
  }
}

/**
 * Monta a parte humana do caminho ("página 3, bloco 2 (`mc`)") e devolve o que sobrou
 * como caminho de campo. Vai consumindo os segmentos conhecidos enquanto navega o dado
 * cru, que é de onde sai o `t` do bloco.
 */
function localizar(raiz: unknown, caminho: Caminho, dentroDeUmaAula: boolean): {
  prefixo: string;
  campo: string;
} {
  const partes: string[] = [];
  let atual: unknown = raiz;
  let i = 0;

  const proximoIndice = (): number | null => {
    const parte = caminho[i];
    return typeof parte === 'number' ? parte : null;
  };

  if (!dentroDeUmaAula) {
    if (caminho[i] === 'LESSONS') {
      atual = ler(atual, 'LESSONS');
      i += 1;
      const indice = proximoIndice();
      if (indice === null) return { prefixo: 'conteúdo', campo: formatarCampo(caminho.slice(i)) };
      atual = ler(atual, indice);
      i += 1;
      const numero = ler(atual, 'id');
      partes.push(`aula ${typeof numero === 'number' ? numero : indice + 1}`);
    } else if (caminho[i] === 'TRACK') {
      atual = ler(atual, 'TRACK');
      i += 1;
      const indice = proximoIndice();
      if (indice !== null) {
        i += 1;
        partes.push(`trilha, item ${indice + 1}`);
      } else {
        partes.push('trilha');
      }
      return { prefixo: partes.join(', '), campo: formatarCampo(caminho.slice(i)) };
    }
  }

  // A lista de páginas: ou é a raiz (validarPaginas) ou está sob a chave `pages`.
  if (caminho[i] === 'pages') {
    atual = ler(atual, 'pages');
    i += 1;
  }

  const paginaIndice = proximoIndice();
  if (paginaIndice !== null) {
    atual = ler(atual, paginaIndice);
    i += 1;
    partes.push(`página ${paginaIndice + 1}`);

    if (caminho[i] === 'blocks') {
      atual = ler(atual, 'blocks');
      i += 1;
      const blocoIndice = proximoIndice();
      if (blocoIndice !== null) {
        atual = ler(atual, blocoIndice);
        i += 1;
        const tipo = ler(atual, 't');
        partes.push(`bloco ${blocoIndice + 1} (\`${typeof tipo === 'string' ? tipo : '?'}\`)`);
      }
    }
  }

  return {
    prefixo: partes.length > 0 ? partes.join(', ') : 'conteúdo',
    campo: formatarCampo(caminho.slice(i)),
  };
}

/**
 * Transforma os problemas do zod em linhas em português, com caminho legível.
 * Ex.: "aula 12, página 3, bloco 2 (`mc`): campo `answer` ausente".
 *
 * @param dentroDeUmaAula `true` quando a raiz validada já é a lista de páginas.
 */
export function descreverErros(
  problemas: ReadonlyArray<Problema>,
  raiz: unknown,
  dentroDeUmaAula = false,
): string[] {
  return problemas.map((problema) => {
    const { prefixo, campo } = localizar(raiz, problema.path, dentroDeUmaAula);

    if (problema.code === 'unrecognized_keys') {
      const alvo = campo === '' ? prefixo : `${prefixo}, campo \`${campo}\``;
      return `${alvo}: campo(s) desconhecido(s): ${problema.keys.map((k) => `\`${k}\``).join(', ')}`;
    }

    return campo === ''
      ? `${prefixo}: ${frase(problema)}`
      : `${prefixo}: campo \`${campo}\` ${frase(problema)}`;
  });
}

/**
 * Valida a lista de páginas de uma aula — o `pages` que o editor do admin salva e que o
 * banco guarda como Json. É a porta de entrada: nada vira rascunho sem passar por aqui.
 */
export function validarPaginas(
  pages: unknown,
): { ok: true; pages: Page[] } | { ok: false; erros: string[] } {
  const resultado = z.array(PageSchema).min(1).safeParse(pages);
  if (resultado.success) return { ok: true, pages: resultado.data };
  return { ok: false, erros: descreverErros(resultado.error.issues, pages, true) };
}

// ───────────────────── trava de compilação: zod ≡ types ─────────────────

/** Identidade exata de tipos (pega campo a mais, a menos e opcional virado obrigatório). */
type Identico<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
  ? true
  : false;

type Confere<C extends true> = C;

/**
 * Se `./types.ts` e este esquema divergirem em um único campo, o TypeScript falha aqui —
 * não num comentário pedindo para alguém lembrar de atualizar os dois.
 */
export type ConferenciaDeTipos = [
  Confere<Identico<Block, T.Block>>,
  Confere<Identico<Page, T.LessonPage>>,
  Confere<Identico<Lesson, T.Lesson>>,
  Confere<Identico<TrackItem, T.TrackItem>>,
  Confere<Identico<AudioClip, T.AudioClip>>,
];
