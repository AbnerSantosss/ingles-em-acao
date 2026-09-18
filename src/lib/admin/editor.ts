/**
 * O miolo puro do editor de páginas e blocos — BACKOFFICE §3 e §6.2/§6.4.
 *
 * ⚠️ **Arquivo puro, sem Prisma e sem import de servidor.** Roda igual no
 * componente cliente (validação ao vivo, geração de id, modelos de bloco) e na
 * Server Action (que refaz tudo por conta própria: o que o navegador calculou
 * é só conveniência, nunca prova).
 *
 * O que mora aqui:
 *
 * 1. **Os 31 modelos de bloco** — o bloco "em branco" que o botão "Adicionar"
 *    insere. Cada modelo passa no `BlockSchema`.
 * 2. **Os ids permanentes** (§6.2). O id de um bloco interativo é a raiz das
 *    chaves de `ExerciseAnswer` (`src/lib/lesson/keys.ts`). Trocar um id é
 *    perder, em silêncio, a resposta de todo aluno que respondeu aquele bloco.
 *    Por isso: o editor gera, o admin nunca digita, e um id nunca é
 *    reaproveitado — o gerador olha para todo id já visto (publicado, rascunho
 *    e histórico de versões de todas as aulas).
 * 3. **A validação semântica da §3.5** — a segunda camada, depois do zod.
 * 4. **O resumo de diferenças** que vira `LessonVersion.resumo`.
 */
import type { z } from 'zod';

import { BlockSchema, descreverErros, type Block, type Page } from '@/lib/content/blocks';
import {
  chaveCheck,
  chaveDnd,
  chaveFill,
  chaveFree,
  chaveMatch,
  chaveMc,
} from '@/lib/lesson/keys';

// ───────────────────────────── tipos de bloco ─────────────────────────────

export type TipoDeBloco = Block['t'];

/** Os 6 tipos que gravam `ExerciseAnswer` por bloco e, por isso, têm `id` obrigatório. */
export const TIPOS_COM_ID_DE_RESPOSTA = ['mc', 'fill', 'match', 'dnd', 'check', 'free'] as const;
export type TipoInterativo = (typeof TIPOS_COM_ID_DE_RESPOSTA)[number];

export type BlocoInterativo = Extract<Block, { t: TipoInterativo }>;

export function ehTipoInterativo(tipo: string): tipo is TipoInterativo {
  return (TIPOS_COM_ID_DE_RESPOSTA as readonly string[]).includes(tipo);
}

export function ehBlocoInterativo(bloco: Block): bloco is BlocoInterativo {
  return ehTipoInterativo(bloco.t);
}

export type GrupoDeBloco = 'Texto' | 'Estrutura' | 'Mídia' | 'Exercício';

/** Rótulo e grupo de cada tipo, na ordem em que aparecem no seletor "Adicionar bloco". */
export const CATALOGO_DE_BLOCOS: ReadonlyArray<{
  t: TipoDeBloco;
  rotulo: string;
  grupo: GrupoDeBloco;
}> = [
  { t: 'badge', rotulo: 'Selo da aula', grupo: 'Texto' },
  { t: 'title', rotulo: 'Título (EN + PT)', grupo: 'Texto' },
  { t: 'sec', rotulo: 'Título de seção', grupo: 'Texto' },
  { t: 'kicker', rotulo: 'Rótulo (kicker)', grupo: 'Texto' },
  { t: 'lead', rotulo: 'Texto de abertura', grupo: 'Texto' },
  { t: 'note', rotulo: 'Nota', grupo: 'Texto' },
  { t: 'key', rotulo: 'Ideia-chave', grupo: 'Texto' },
  { t: 'objective', rotulo: 'Objetivo', grupo: 'Texto' },
  { t: 'meta', rotulo: 'Meta (rótulo + valor)', grupo: 'Texto' },
  { t: 'chips', rotulo: 'Chips', grupo: 'Estrutura' },
  { t: 'answers', rotulo: 'Respostas (chave → valor)', grupo: 'Estrutura' },
  { t: 'pron', rotulo: 'Pronome', grupo: 'Estrutura' },
  { t: 'grid', rotulo: 'Grade de cartões', grupo: 'Estrutura' },
  { t: 'table', rotulo: 'Tabela', grupo: 'Estrutura' },
  { t: 'rule', rotulo: 'Regra (de → para)', grupo: 'Estrutura' },
  { t: 'compare', rotulo: 'Certo × errado', grupo: 'Estrutura' },
  { t: 'cards', rotulo: 'Cartões', grupo: 'Estrutura' },
  { t: 'rows', rotulo: 'Linhas numeradas', grupo: 'Estrutura' },
  { t: 'steps', rotulo: 'Passos', grupo: 'Estrutura' },
  { t: 'dialogue', rotulo: 'Diálogo', grupo: 'Estrutura' },
  { t: 'bar', rotulo: 'Barra de progresso', grupo: 'Estrutura' },
  { t: 'next', rotulo: 'Próxima aula', grupo: 'Estrutura' },
  { t: 'image', rotulo: 'Imagem', grupo: 'Mídia' },
  { t: 'profile', rotulo: 'Perfil com foto', grupo: 'Mídia' },
  { t: 'mc', rotulo: 'Múltipla escolha', grupo: 'Exercício' },
  { t: 'fill', rotulo: 'Lacunas', grupo: 'Exercício' },
  { t: 'match', rotulo: 'Ligar colunas', grupo: 'Exercício' },
  { t: 'dnd', rotulo: 'Montar a frase', grupo: 'Exercício' },
  { t: 'check', rotulo: 'Autoavaliação (checklist)', grupo: 'Exercício' },
  { t: 'free', rotulo: 'Produção livre', grupo: 'Exercício' },
  { t: 'cta', rotulo: 'Chamada (vídeo / IA)', grupo: 'Exercício' },
];

export function rotuloDoTipo(tipo: string): string {
  return CATALOGO_DE_BLOCOS.find((item) => item.t === tipo)?.rotulo ?? tipo;
}

// ─────────────────────────────── ids ───────────────────────────────

/**
 * O sufixo de cada família de id, idêntico ao do `course-data.mjs`
 * (`a7mc2`, `a7match1`, `a7e3`, `a7d1`, `a7f2`, `a7c1`, `a7p4`).
 * `image` e `profile` usam `p`: ali o id é o nome do arquivo de arte legado,
 * não chave de resposta, mas também não pode colidir.
 */
const SUFIXO_DO_ID = {
  mc: 'mc',
  match: 'match',
  fill: 'e',
  dnd: 'd',
  free: 'f',
  check: 'c',
  image: 'p',
  profile: 'p',
} as const;

export type TipoComIdGerado = keyof typeof SUFIXO_DO_ID;

export function ehTipoComIdGerado(tipo: string): tipo is TipoComIdGerado {
  return Object.prototype.hasOwnProperty.call(SUFIXO_DO_ID, tipo);
}

/**
 * Gera um id novo para um bloco da aula `numero`.
 *
 * Nunca reaproveita: pega o maior `n` já visto para aquela família naquela aula
 * — em **todo** o conjunto `usados` (publicado, rascunhos e versões de todas as
 * aulas) — e soma 1. Depois ainda confere que o candidato não está em `usados`.
 * Quem chama deve acrescentar o id devolvido a `usados` antes de gerar o
 * próximo (as funções abaixo já fazem isso).
 */
export function gerarIdDeBloco(
  numero: number,
  tipo: TipoComIdGerado,
  usados: ReadonlySet<string>,
): string {
  const sufixo = SUFIXO_DO_ID[tipo];
  const padrao = new RegExp(`^a${numero}${sufixo}(\\d+)[a-z]*$`);
  let maior = 0;
  for (const id of usados) {
    const achado = padrao.exec(id);
    if (achado) maior = Math.max(maior, Number(achado[1]));
  }
  let n = maior + 1;
  while (usados.has(`a${numero}${sufixo}${n}`)) n += 1;
  return `a${numero}${sufixo}${n}`;
}

/** Todo id que aparece em blocos (e itens de `cards`/`steps`) de uma lista de páginas. */
export function coletarIds(pages: ReadonlyArray<Page>): string[] {
  const ids: string[] = [];
  for (const pagina of pages) {
    for (const bloco of pagina.blocks) {
      if ('id' in bloco && typeof bloco.id === 'string') ids.push(bloco.id);
      if (bloco.t === 'cards' || bloco.t === 'steps') {
        for (const item of bloco.items) if (item.id) ids.push(item.id);
      }
    }
  }
  return ids;
}

/** Um bloco interativo (com id de resposta) e onde ele está. */
export type OcorrenciaInterativa = {
  id: string;
  t: TipoInterativo;
  pagina: number;
  bloco: number;
  conteudo: BlocoInterativo;
};

export function blocosInterativos(pages: ReadonlyArray<Page>): OcorrenciaInterativa[] {
  const saida: OcorrenciaInterativa[] = [];
  pages.forEach((pagina, p) => {
    pagina.blocks.forEach((bloco, b) => {
      if (ehBlocoInterativo(bloco)) {
        saida.push({ id: bloco.id, t: bloco.t, pagina: p, bloco: b, conteudo: bloco });
      }
    });
  });
  return saida;
}

/**
 * Troca o id de um bloco **interativo** por um id novo. É o que "Duplicar
 * bloco/página/aula" usa: a cópia **nunca** herda o id do original, senão as
 * duas passariam a dividir a resposta do aluno (§6.2). `usados` é atualizado
 * com os ids gerados.
 *
 * Imagem e perfil mantêm o id: ali ele é o nome do arquivo de arte legado
 * (`public/lessons/art/{id}.png`), não chave de resposta — trocar faria a
 * cópia perder a imagem.
 *
 * `mapa` (opcional) é o de-para "id original → id novo". Quando vem, um id que
 * já foi trocado reaproveita a troca: é o que faz o mesmo bloco ganhar o
 * **mesmo** id novo em `pages` e em `draftPages` ao duplicar uma aula — senão
 * o rascunho da cópia pareceria ter removido todos os exercícios publicados.
 */
export function regenerarIds(
  bloco: Block,
  numero: number,
  usados: Set<string>,
  mapa?: Map<string, string>,
): Block {
  if (!ehBlocoInterativo(bloco)) return bloco;
  const jaTrocado = mapa?.get(bloco.id);
  if (jaTrocado !== undefined) return { ...bloco, id: jaTrocado };
  const novo = gerarIdDeBloco(numero, bloco.t, usados);
  usados.add(novo);
  mapa?.set(bloco.id, novo);
  return { ...bloco, id: novo };
}

export function regenerarIdsDaPagina(
  pagina: Page,
  numero: number,
  usados: Set<string>,
  mapa?: Map<string, string>,
): Page {
  return { blocks: pagina.blocks.map((bloco) => regenerarIds(bloco, numero, usados, mapa)) };
}

/**
 * Para "Duplicar aula": todas as páginas, todos os ids interativos novos.
 * Passe o mesmo `mapa` para `pages` e `draftPages` da mesma aula.
 */
export function regenerarIdsInterativos(
  pages: ReadonlyArray<Page>,
  numero: number,
  usados: Set<string>,
  mapa?: Map<string, string>,
): Page[] {
  return pages.map((pagina) => regenerarIdsDaPagina(pagina, numero, usados, mapa));
}

// ─────────────────────────── modelos de bloco ───────────────────────────

function doisDigitos(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * O bloco "em branco" de cada tipo. Todo modelo é válido no `BlockSchema` —
 * o admin parte de algo que já renderiza e vai trocando o texto.
 * Tipos com id recebem um id novo, gerado contra `usados` (que é atualizado).
 */
export function modeloDeBloco(tipo: TipoDeBloco, numero: number, usados: Set<string>): Block {
  const id = (t: TipoComIdGerado): string => {
    const novo = gerarIdDeBloco(numero, t, usados);
    usados.add(novo);
    return novo;
  };

  switch (tipo) {
    case 'badge':
      return { t: 'badge', label: `AULA ${doisDigitos(numero)}` };
    case 'title':
      return { t: 'title', en: 'TITLE IN ENGLISH', pt: 'Título em português' };
    case 'sec':
      return { t: 'sec', text: 'NOVA SEÇÃO' };
    case 'kicker':
      return { t: 'kicker', text: 'RÓTULO' };
    case 'lead':
      return { t: 'lead', text: 'Texto de abertura da página.' };
    case 'note':
      return { t: 'note', v: 'cream', text: 'Texto da nota.' };
    case 'key':
      return { t: 'key', text: 'A ideia principal desta página.' };
    case 'objective':
      return { t: 'objective', title: 'OBJETIVO', text: 'O que o aluno vai conseguir fazer.' };
    case 'meta':
      return { t: 'meta', label: 'TEMPO', value: '8 a 12 minutos' };
    case 'chips':
      return { t: 'chips', items: [{ t: 'palavra' }, { t: 'outra palavra' }] };
    case 'answers':
      return { t: 'answers', title: 'RESPOSTAS', items: [{ k: '1', a: 'resposta' }] };
    case 'pron':
      return { t: 'pron', code: 'I', pt: 'eu', title: 'PRIMEIRA PESSOA' };
    case 'grid':
      return {
        t: 'grid',
        cols: 2,
        items: [
          { title: 'Cartão 1', body: 'Texto do cartão.' },
          { title: 'Cartão 2', body: 'Texto do cartão.' },
        ],
      };
    case 'table':
      return {
        t: 'table',
        head: ['INGLÊS', 'PORTUGUÊS'],
        rows: [{ a: 'I am', b: 'eu sou / estou' }],
      };
    case 'rule':
      return {
        t: 'rule',
        kicker: 'REGRA',
        from: 'I am',
        to: "I'm",
        ex: "I'm happy.",
        tr: 'Eu estou feliz.',
      };
    case 'compare':
      return { t: 'compare', items: [{ wrong: 'I is happy.', right: 'I am happy.' }] };
    case 'cards':
      return { t: 'cards', items: [{ tag: 'EXEMPLO', lines: ['Primeira linha.'] }] };
    case 'rows':
      return { t: 'rows', items: [{ n: '1', text: 'Primeira linha.' }] };
    case 'steps':
      return { t: 'steps', items: [{ n: '1', tag: 'PASSO 1', lines: ['O que fazer.'] }] };
    case 'dialogue':
      return {
        t: 'dialogue',
        items: [
          { s: 'a', text: 'Hi! How are you?' },
          { s: 'b', text: "I'm fine, thanks." },
        ],
      };
    case 'bar':
      return { t: 'bar', label: 'PROGRESSO', value: `${numero} DE 42 AULAS`, pct: '50%' };
    case 'next':
      return {
        t: 'next',
        kicker: 'PRÓXIMA AULA',
        title: `Aula ${doisDigitos(numero + 1)} — título da próxima aula`,
      };
    case 'image':
      return { t: 'image', id: id('image'), ph: 'Ilustração: descreva a imagem' };
    case 'profile':
      return {
        t: 'profile',
        id: id('profile'),
        name: 'Nome',
        ph: 'Foto: descreva a pessoa',
        facts: ['Primeiro fato.'],
      };
    case 'mc':
      return {
        t: 'mc',
        id: id('mc'),
        title: 'TESTE RELÂMPAGO',
        questions: [{ q: 'Pergunta?', options: ['Opção A', 'Opção B'], answer: 0 }],
      };
    case 'fill':
      return {
        t: 'fill',
        id: id('fill'),
        title: 'EXERCÍCIO · COMPLETE',
        items: [{ pre: '1. Frase com lacuna', answers: ['resposta'] }],
      };
    case 'match':
      return {
        t: 'match',
        id: id('match'),
        title: 'LIGUE AS COLUNAS',
        left: ['I', 'YOU'],
        right: ['você', 'eu'],
        answer: [1, 0],
      };
    case 'dnd':
      return {
        t: 'dnd',
        id: id('dnd'),
        title: 'MONTE A FRASE',
        sub: 'Arraste ou toque nas peças para montar a frase.',
        slots: ['sujeito', 'verbo', 'complemento'],
        tokens: ['happy.', 'I', 'am'],
        answer: ['I', 'am', 'happy.'],
      };
    case 'check':
      return { t: 'check', id: id('check'), title: 'EU CONSIGO...', items: ['Primeiro objetivo.'] };
    case 'free':
      return {
        t: 'free',
        id: id('free'),
        items: [{ n: '1', kicker: 'FALE SOBRE VOCÊ', prefix: 'I am', ideas: '' }],
      };
    case 'cta':
      return {
        t: 'cta',
        items: [
          {
            icon: 'play',
            v: 'mint',
            title: 'ASSISTA À VIDEOAULA',
            body: 'Veja a explicação completa e acompanhe os exemplos.',
            plan: 'EXCLUSIVO PARA O PLANO COMPLETO — INGLÊS EM AÇÃO',
            btn: 'ASSISTIR À VIDEOAULA',
            c: 'navy',
          },
        ],
      };
  }
}

// ──────────────────────── JSON do editor de bloco ────────────────────────

/**
 * O que a caixa de texto de um bloco mostra: o bloco inteiro **menos** `t`
 * (fixo — para trocar de tipo, adiciona-se outro bloco) e menos o `id` dos
 * tipos interativos (somente leitura, §6.2).
 */
export function jsonEditavel(bloco: Block): string {
  const copia: Record<string, unknown> = { ...bloco };
  delete copia.t;
  if (ehBlocoInterativo(bloco)) delete copia.id;
  return JSON.stringify(copia, null, 2);
}

export type LeituraDoBloco = { ok: true; bloco: Block } | { ok: false; erros: string[] };

/**
 * Lê o texto da caixa de um bloco e devolve o bloco validado — ou os erros em
 * português, com o caminho ("página 2, bloco 3 (`mc`): campo
 * `questions[0].answer` ausente").
 *
 * `t` e `id` (interativo) vêm do bloco original, nunca do texto: se o texto os
 * trouxer, é erro — é assim que o id fica somente leitura de verdade.
 */
export function lerJsonDoBloco(
  texto: string,
  original: { t: TipoDeBloco; id?: string },
  pagina: number,
  indice: number,
): LeituraDoBloco {
  const onde = local(pagina, indice, original.t);
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch (erro: unknown) {
    const detalhe = erro instanceof Error ? erro.message : 'formato inválido';
    return { ok: false, erros: [`${onde}: o texto não é um JSON válido (${detalhe})`] };
  }
  if (bruto === null || typeof bruto !== 'object' || Array.isArray(bruto)) {
    return { ok: false, erros: [`${onde}: o JSON precisa ser um objeto { … }`] };
  }
  const objeto = bruto as Record<string, unknown>;
  const erros: string[] = [];
  if ('t' in objeto) {
    erros.push(
      `${onde}: o campo \`t\` (tipo) é fixo — para trocar o tipo, adicione um bloco novo e remova este`,
    );
  }
  const interativo = ehTipoInterativo(original.t);
  if (interativo && 'id' in objeto) {
    erros.push(
      `${onde}: o campo \`id\` é permanente e não pode ser editado (é a chave das respostas dos alunos)`,
    );
  }
  if (erros.length > 0) return { ok: false, erros };

  const candidato: Record<string, unknown> = { t: original.t, ...objeto };
  if (interativo) candidato.id = original.id;

  const resultado = BlockSchema.safeParse(candidato);
  if (resultado.success) return { ok: true, bloco: resultado.data };

  // Monta uma "lista de páginas" de mentira só para o `descreverErros` achar o
  // bloco pelo caminho e escrever "página X, bloco Y (`t`)".
  const blocos: unknown[] = [];
  blocos[indice] = candidato;
  const raiz: unknown[] = [];
  raiz[pagina] = { blocks: blocos };
  const problemas: z.core.$ZodIssue[] = resultado.error.issues.map((problema) => ({
    ...problema,
    path: [pagina, 'blocks', indice, ...problema.path],
  }));
  return { ok: false, erros: descreverErros(problemas, raiz, true) };
}

// ───────────────────────────── validação §3.5 ─────────────────────────────

export type ContextoDeValidacao = {
  /** Número da aula que está sendo validada. */
  numero: number;
  /** id → número da aula, para todo id em uso em **outras** aulas. */
  idsDeOutrasAulas?: ReadonlyMap<string, number>;
  /** Aulas que existem (para conferir o bloco `next`). */
  aulasExistentes?: ReadonlyArray<{ numero: number; titulo: string }>;
  /** Média de páginas por aula no curso (para o aviso de aula longa). */
  mediaDePaginas?: number;
};

export type ResultadoDaValidacao = { erros: string[]; avisos: string[] };

export function local(p: number, b: number, t: string): string {
  return `página ${p + 1}, bloco ${b + 1} (\`${t}\`)`;
}

function mesmoConjunto(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
  if (a.length !== b.length) return false;
  const conta = new Map<string, number>();
  for (const x of a) conta.set(x, (conta.get(x) ?? 0) + 1);
  for (const x of b) {
    const n = conta.get(x);
    if (!n) return false;
    conta.set(x, n - 1);
  }
  return true;
}

function normalizarTitulo(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/^aula\s+\d+\s*[—–-]\s*/i, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

/** Junta ocorrências de um mesmo aviso numa linha só ("Imagem sem alt (3): página 1, bloco 4; …"). */
function agrupar(rotulo: string, locais: string[]): string {
  const LIMITE = 6;
  const lista = locais.slice(0, LIMITE).join('; ');
  const resto = locais.length > LIMITE ? `; e mais ${locais.length - LIMITE}` : '';
  return `${rotulo} (${locais.length}): ${lista}${resto}`;
}

/**
 * A segunda camada da §3.5: o que o zod não enxerga. Recebe páginas **já
 * validadas** pelo `validarPaginas`.
 *
 * ERRO bloqueia a publicação; AVISO exige confirmação explícita.
 *
 * ⚠️ Imagem sem `src` é AVISO, não erro, enquanto a migração da §4.1 não
 * rodar: as imagens legadas vivem em `public/lessons/art/{id}.png` e ainda não
 * têm `src`. Virar erro antes da migração bloquearia a publicação de toda aula.
 */
export function validarSemantica(
  pages: ReadonlyArray<Page>,
  contexto: ContextoDeValidacao,
): ResultadoDaValidacao {
  const erros: string[] = [];
  const semAlt: string[] = [];
  const semSrc: string[] = [];
  const paginasSoTitulo: string[] = [];
  const nextSemAula: string[] = [];
  const titulosVistos = new Map<string, string>();
  const titulosRepetidos: string[] = [];
  const idsNaAula = new Map<string, string>();
  let temCta = false;

  if (pages.length === 0) erros.push('a aula não tem nenhuma página');

  pages.forEach((pagina, p) => {
    if (pagina.blocks.length === 0) erros.push(`página ${p + 1}: página vazia, sem nenhum bloco`);

    const tipos = pagina.blocks.map((bloco) => bloco.t);
    if (tipos.length > 0 && tipos.every((t) => t === 'badge' || t === 'title')) {
      paginasSoTitulo.push(`página ${p + 1}`);
    }

    pagina.blocks.forEach((bloco, b) => {
      const onde = local(p, b, bloco.t);

      if (ehBlocoInterativo(bloco)) {
        const id = bloco.id.trim();
        if (id === '') {
          erros.push(`${onde}: bloco de exercício sem \`id\``);
        } else {
          const anterior = idsNaAula.get(id);
          if (anterior) erros.push(`${onde}: \`id\` "${id}" repetido — já usado em ${anterior}`);
          else idsNaAula.set(id, onde);
          const outra = contexto.idsDeOutrasAulas?.get(id);
          if (outra !== undefined && outra !== contexto.numero) {
            erros.push(`${onde}: \`id\` "${id}" já pertence à aula ${outra}`);
          }
        }
      }

      switch (bloco.t) {
        case 'mc': {
          bloco.questions.forEach((questao, q) => {
            if (questao.options.length < 2) {
              erros.push(`${onde}: pergunta ${q + 1} tem menos de 2 opções`);
            }
            if (questao.answer < 0 || questao.answer >= questao.options.length) {
              erros.push(
                `${onde}: pergunta ${q + 1} tem gabarito ${questao.answer}, mas as opções vão de 0 a ${questao.options.length - 1}`,
              );
            }
          });
          const chave = `mc:${bloco.title.trim().toLowerCase()}`;
          const primeiro = titulosVistos.get(chave);
          if (primeiro) titulosRepetidos.push(`${onde} repete o título de ${primeiro}`);
          else titulosVistos.set(chave, onde);
          break;
        }
        case 'match': {
          if (bloco.left.length !== bloco.answer.length) {
            erros.push(
              `${onde}: \`left\` tem ${bloco.left.length} itens, mas \`answer\` tem ${bloco.answer.length}`,
            );
          }
          bloco.answer.forEach((indice, i) => {
            if (indice < 0 || indice >= bloco.right.length) {
              erros.push(
                `${onde}: \`answer[${i}]\` aponta para ${indice}, mas \`right\` vai de 0 a ${bloco.right.length - 1}`,
              );
            }
          });
          const chave = `match:${bloco.title.trim().toLowerCase()}`;
          const primeiro = titulosVistos.get(chave);
          if (primeiro) titulosRepetidos.push(`${onde} repete o título de ${primeiro}`);
          else titulosVistos.set(chave, onde);
          break;
        }
        case 'fill':
          bloco.items.forEach((item, i) => {
            if (item.answers.length === 0 || item.answers.some((r) => r.trim() === '')) {
              erros.push(`${onde}: item ${i + 1} tem resposta vazia em \`answers\``);
            }
          });
          break;
        case 'dnd':
          if (bloco.answer.length !== bloco.slots.length) {
            erros.push(
              `${onde}: \`answer\` tem ${bloco.answer.length} peças, mas há ${bloco.slots.length} espaços em \`slots\``,
            );
          }
          if (!mesmoConjunto(bloco.answer, bloco.tokens)) {
            erros.push(`${onde}: \`answer\` não usa exatamente as mesmas peças de \`tokens\``);
          }
          break;
        case 'image':
        case 'profile':
          if (!bloco.alt) semAlt.push(onde);
          if (!bloco.src) semSrc.push(onde);
          break;
        case 'cta':
          temCta = true;
          break;
        case 'next': {
          if (!contexto.aulasExistentes) break;
          const numero = /aula\s+(\d{1,3})/i.exec(bloco.title);
          if (numero) {
            const alvo = Number(numero[1]);
            if (!contexto.aulasExistentes.some((aula) => aula.numero === alvo)) {
              erros.push(`${onde}: aponta para a aula ${alvo}, que não existe`);
            }
          } else if (!/^m[oó]dulo\s+\d+/i.test(bloco.title.trim())) {
            // "Módulo 2 — Vocabulário essencial" é a virada de módulo: aponta para
            // o módulo, não para uma aula, e é legítimo no conteúdo original.
            const titulo = normalizarTitulo(bloco.title);
            const existe = contexto.aulasExistentes.some(
              (aula) => normalizarTitulo(aula.titulo) === titulo,
            );
            if (!existe) nextSemAula.push(onde);
          }
          break;
        }
        default:
          break;
      }
    });
  });

  const avisos: string[] = [];
  if (semAlt.length > 0) avisos.push(agrupar('Imagem sem texto alternativo (`alt`)', semAlt));
  if (semSrc.length > 0) {
    avisos.push(
      agrupar(
        'Imagem ainda sem `src` da biblioteca (usa a arte legada; vira erro depois da migração §4.1)',
        semSrc,
      ),
    );
  }
  if (paginasSoTitulo.length > 0) {
    avisos.push(agrupar('Página só com selo e título', paginasSoTitulo));
  }
  if (titulosRepetidos.length > 0) {
    avisos.push(agrupar('Título de exercício repetido na mesma aula', titulosRepetidos));
  }
  if (nextSemAula.length > 0) {
    avisos.push(
      agrupar('Bloco "próxima aula" cujo título não corresponde a nenhuma aula', nextSemAula),
    );
  }
  if (!temCta && pages.length > 0) avisos.push('A aula não tem bloco de chamada (`cta`)');
  if (contexto.mediaDePaginas && contexto.mediaDePaginas > 0) {
    const limite = Math.ceil(contexto.mediaDePaginas * 2);
    if (pages.length > limite) {
      avisos.push(
        `A aula tem ${pages.length} páginas — mais que o dobro da média do curso (${contexto.mediaDePaginas.toFixed(1)})`,
      );
    }
  }

  return { erros, avisos };
}

// ─────────────────────────── chaves de resposta ───────────────────────────

export type ChavesDoBloco = { exatas: string[]; prefixos: string[] };

/**
 * As chaves de `ExerciseAnswer` que pertencem a um bloco, montadas **só**
 * pelos construtores de `keys.ts` (CONTRACT §4). Blocos de itens devolvem o
 * prefixo (`fill:a1e1:`); `match`/`dnd`, a chave exata — um prefixo ali
 * casaria `match:a1match1` com `match:a1match10`.
 */
export function chavesDoBloco(bloco: BlocoInterativo, numeroDaAula: number): ChavesDoBloco {
  const semIndice = (chave: string): string => chave.slice(0, chave.length - 1);
  switch (bloco.t) {
    case 'mc':
      return { exatas: [], prefixos: [semIndice(chaveMc(numeroDaAula, bloco.id, 0))] };
    case 'fill':
      return { exatas: [], prefixos: [semIndice(chaveFill(bloco.id, 0))] };
    case 'free':
      return { exatas: [], prefixos: [semIndice(chaveFree(bloco.id, 0))] };
    case 'check':
      return { exatas: [], prefixos: [semIndice(chaveCheck(bloco.id, 0))] };
    case 'match':
      return { exatas: [chaveMatch(bloco.id)], prefixos: [] };
    case 'dnd':
      return { exatas: [chaveDnd(bloco.id)], prefixos: [] };
  }
}

export function chavePertenceAoBloco(chave: string, chaves: ChavesDoBloco): boolean {
  return chaves.exatas.includes(chave) || chaves.prefixos.some((p) => chave.startsWith(p));
}

// ─────────────────────────── diferenças e resumo ───────────────────────────

/** JSON com chaves ordenadas: o `jsonb` do Postgres reordena chaves e isso não pode virar "mudança". */
export function jsonCanonico(valor: unknown): string {
  if (Array.isArray(valor)) return `[${valor.map(jsonCanonico).join(',')}]`;
  if (valor !== null && typeof valor === 'object') {
    const objeto = valor as Record<string, unknown>;
    const chaves = Object.keys(objeto)
      .filter((chave) => objeto[chave] !== undefined)
      .sort();
    return `{${chaves.map((chave) => `${JSON.stringify(chave)}:${jsonCanonico(objeto[chave])}`).join(',')}}`;
  }
  return JSON.stringify(valor) ?? 'null';
}

export type DiferencasDoConteudo = {
  paginasAntes: number;
  paginasDepois: number;
  paginasAlteradas: number;
  paginasNovas: number;
  paginasRemovidas: number;
  exerciciosNovos: string[];
  exerciciosRemovidos: string[];
  exerciciosAlterados: string[];
  blocosAntes: number;
  blocosDepois: number;
  semMudanca: boolean;
};

export function compararConteudo(
  antes: ReadonlyArray<Page>,
  depois: ReadonlyArray<Page>,
): DiferencasDoConteudo {
  const comuns = Math.min(antes.length, depois.length);
  let paginasAlteradas = 0;
  for (let i = 0; i < comuns; i += 1) {
    if (jsonCanonico(antes[i]) !== jsonCanonico(depois[i])) paginasAlteradas += 1;
  }
  const velhos = new Map(blocosInterativos(antes).map((o) => [o.id, o]));
  const novos = new Map(blocosInterativos(depois).map((o) => [o.id, o]));
  const exerciciosNovos = [...novos.keys()].filter((id) => !velhos.has(id));
  const exerciciosRemovidos = [...velhos.keys()].filter((id) => !novos.has(id));
  const exerciciosAlterados: string[] = [];
  for (const [id, novo] of novos) {
    const velho = velhos.get(id);
    if (velho && jsonCanonico(velho.conteudo) !== jsonCanonico(novo.conteudo)) {
      exerciciosAlterados.push(id);
    }
  }
  const contarBlocos = (pages: ReadonlyArray<Page>): number =>
    pages.reduce((total, pagina) => total + pagina.blocks.length, 0);

  return {
    paginasAntes: antes.length,
    paginasDepois: depois.length,
    paginasAlteradas,
    paginasNovas: Math.max(0, depois.length - antes.length),
    paginasRemovidas: Math.max(0, antes.length - depois.length),
    exerciciosNovos,
    exerciciosRemovidos,
    exerciciosAlterados,
    blocosAntes: contarBlocos(antes),
    blocosDepois: contarBlocos(depois),
    semMudanca: jsonCanonico(antes) === jsonCanonico(depois),
  };
}

export function plural(n: number, singular: string, pluralTexto: string): string {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}

/** "3 páginas alteradas, 1 exercício novo, 2 exercícios removidos" — vira `LessonVersion.resumo`. */
export function resumirDiferencas(d: DiferencasDoConteudo): string {
  if (d.semMudanca) return 'sem mudança de conteúdo';
  const partes: string[] = [];
  if (d.paginasAlteradas > 0) {
    partes.push(plural(d.paginasAlteradas, 'página alterada', 'páginas alteradas'));
  }
  if (d.paginasNovas > 0) partes.push(plural(d.paginasNovas, 'página nova', 'páginas novas'));
  if (d.paginasRemovidas > 0) {
    partes.push(plural(d.paginasRemovidas, 'página removida', 'páginas removidas'));
  }
  if (d.exerciciosNovos.length > 0) {
    partes.push(plural(d.exerciciosNovos.length, 'exercício novo', 'exercícios novos'));
  }
  if (d.exerciciosRemovidos.length > 0) {
    partes.push(
      plural(d.exerciciosRemovidos.length, 'exercício removido', 'exercícios removidos'),
    );
  }
  if (d.exerciciosAlterados.length > 0) {
    partes.push(
      plural(d.exerciciosAlterados.length, 'exercício alterado', 'exercícios alterados'),
    );
  }
  return partes.length > 0 ? partes.join(', ') : 'ajustes de ordem ou formatação';
}

// ─────────────────────── estado das actions do editor ───────────────────────

/**
 * O que as Server Actions do editor (salvar, descartar, publicar, restaurar)
 * devolvem para o `useActionState`. Mora aqui, num arquivo sem `'use server'`
 * e sem Prisma, porque é importado dos dois lados.
 *
 * `erros` carrega a lista completa (cada linha com o caminho "página X, bloco
 * Y (`t`)"); `mensagem` é sempre preenchida — erro é sempre texto.
 */
export type EstadoDoEditor =
  | { estado: 'inicial' }
  | { estado: 'ok'; mensagem: string }
  | { estado: 'erro'; mensagem: string; erros?: string[] };

export const ESTADO_INICIAL_DO_EDITOR: EstadoDoEditor = { estado: 'inicial' };
