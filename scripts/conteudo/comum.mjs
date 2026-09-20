/**
 * Funções comuns aos scripts de conteúdo do plano v2 (pacotes 11, 12 e 13).
 *
 * Tudo aqui é função pura ou leitura de arquivo. Nenhum script de
 * `scripts/conteudo/` escreve no banco, e nenhum deles muda `course-data.mjs`.
 *
 * Por que `.mjs` e não `.ts`: os scripts rodam com `node` puro, sem compilar,
 * e os testes do Vitest importam as mesmas funções.
 *
 * ⚠️ Travessão (U+2014) é proibido neste arquivo. Quando o código precisa dele,
 * usa a constante TRAVESSAO, montada com String.fromCodePoint.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** Travessão (U+2014) e meia-risca (U+2013), montados por código para não aparecerem no arquivo. */
export const TRAVESSAO = String.fromCodePoint(0x2014);
export const MEIA_RISCA = String.fromCodePoint(0x2013);

/** Pasta `app-web/`. */
export const RAIZ_DO_APP = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Caminho absoluto dentro de `app-web/`. */
export function noApp(...partes) {
  return join(RAIZ_DO_APP, ...partes);
}

/** As 42 aulas de `content/course-data.mjs`, na ordem do arquivo. */
export async function carregarAulas() {
  const modulo = await import(pathToFileURL(noApp('content', 'course-data.mjs')).href);
  return modulo.LESSONS;
}

/** Uma aula pelo número (1 a 42). Lança erro se não existir. */
export function acharAula(aulas, numero) {
  const aula = aulas.find((a) => a.id === numero);
  if (!aula) throw new Error(`Aula ${numero} não existe em content/course-data.mjs.`);
  return aula;
}

export function doisDigitos(n) {
  return String(n).padStart(2, '0');
}

export function tresDigitos(n) {
  return String(n).padStart(3, '0');
}

/** Lê um JSON. `null` se o arquivo não existe. Lança erro com o caminho se o JSON estiver quebrado. */
export function lerJson(caminho) {
  if (!existsSync(caminho)) return null;
  const texto = readFileSync(caminho, 'utf8');
  try {
    return JSON.parse(texto);
  } catch (erro) {
    throw new Error(`JSON inválido em ${caminho}: ${erro.message}`);
  }
}

/**
 * Título da aula como fica depois do pacote 10 (parte A): "Verb to be <U+2014> Affirmative"
 * vira "Verb to be: Affirmative", "How Often? <U+2014> Frequency" vira "How Often? Frequency"
 * e "Numbers 1<U+2013>100" vira "Numbers 1-100". Funciona antes e depois do pacote 10 rodar.
 */
export function tituloDepoisDoPacote10(titulo) {
  return titulo
    .split(`? ${TRAVESSAO} `).join('? ')
    .split(` ${TRAVESSAO} `).join(': ')
    .split(MEIA_RISCA).join('-');
}

/** Número da aula a partir do argumento da linha de comando ("3", "03"). `null` se inválido. */
export function numeroDaAula(argumento) {
  const n = Number(argumento);
  return Number.isInteger(n) && n >= 1 && n <= 42 ? n : null;
}

/** `true` quando o arquivo foi chamado direto pelo `node` (e não importado por um teste). */
export function chamadoDireto(urlDoModulo) {
  return Boolean(process.argv[1]) && urlDoModulo === pathToFileURL(process.argv[1]).href;
}

// ---------------------------------------------------------------- normalização

/**
 * CÓPIA LITERAL de `normalizarAncora` de `src/lib/audio/ancora.ts` (contrato 01, seção 2.2).
 * O teste `tests/conteudo/ancoras.test.ts` confere que as duas dão o mesmo resultado.
 * NÃO muda maiúsculas: "HE" e "He" são textos diferentes na tela.
 */
export function normalizarAncora(s) {
  return s
    .normalize('NFC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chave para comparar itens do mapa curricular entre si e com textos da tela:
 * minúsculas, apóstrofo reto, sem pontuação no fim e sem artigo (a, an, the) no começo.
 * "The Eiffel Tower" e "the Eiffel Tower." viram a mesma chave. "HE" e "he" também.
 */
export function normalizarItem(s) {
  return normalizarAncora(s)
    .toLowerCase()
    .replace(/[.!?,;:…]+$/u, '')
    .replace(/^(a|an|the) /, '')
    .trim();
}

/**
 * Palavras de um texto, em minúsculas, com apóstrofo reto. Contração é UMA palavra
 * ("i'm", "isn't"). Números e "___" não entram.
 */
export function palavras(s) {
  const t = normalizarAncora(s).toLowerCase();
  return t.match(/\p{L}+(?:'\p{L}+)*/gu) ?? [];
}

// ---------------------------------------------------------------- idioma

/**
 * Palavras que só existem em português (ou quase só). Se uma delas aparece, o texto é
 * português ou misto. Palavras que também existem em inglês ("a", "do", "no", "me", "as")
 * ficam de fora de propósito.
 */
export const PALAVRAS_SO_PORTUGUESAS = new Set([
  'de', 'da', 'das', 'dos', 'que', 'para', 'com', 'uma', 'um', 'uns', 'umas', 'voce', 'ele',
  'ela', 'eles', 'elas', 'eu', 'o', 'os', 'e', 'em', 'na', 'nas', 'nos', 'ou', 'se', 'quando',
  'sobre', 'como', 'mas', 'pelo', 'pela', 'ao', 'aos', 'seu', 'sua', 'meu', 'minha', 'isso',
  'esse', 'essa', 'este', 'esta', 'pense', 'exemplo', 'sim', 'lembrete', 'macete', 'dica',
  'roteiro', 'regra', 'cuidado', 'atencao', 'fora', 'padrao', 'depois', 'antes', 'use', 'diga',
  'escreva', 'veja', 'leia', 'responda', 'complete', 'marque', 'frase', 'frases', 'palavra',
  'palavras', 'pessoa', 'pessoas', 'coisa', 'coisas', 'aula', 'aulas', 'lugar', 'hora', 'horas',
  'sempre', 'nunca', 'tambem', 'mesmo', 'mesma', 'outro', 'outra', 'todo', 'toda', 'todos',
  'todas', 'aqui', 'ali', 'onde', 'porque', 'entao', 'ja', 'ainda', 'so', 'pra', 'pro',
  // achadas nas colunas de tradução do course-data.mjs (varredura de 2026-09-19)
  'abaixo', 'acima', 'acordar', 'advogado', 'banho', 'consoante', 'conta', 'cozinheiro', 'dela',
  'delas', 'dele', 'deles', 'dobra', 'dois', 'dormir', 'engenheiro', 'entre', 'esposa', 'estrela',
  'estudante', 'exemplos', 'filha', 'filho', 'geral', 'inverno', 'ir', 'marido', 'modelo',
  'motorista', 'nossa', 'nosso', 'outono', 'pai', 'pedir', 'pergunta', 'primavera', 'quadrado',
  'regulares', 'respostas', 'sujeito', 'tomar', 'vendedor', 'verbo', 'verbos', 'vogal',
  // rótulos em caixa alta sem acento (varredura de 2026-09-19 com o extrair-aula.mjs)
  'adjetivo', 'afirmativa', 'afirmativo', 'agora', 'aquela', 'aquelas', 'aquele', 'aqueles',
  'artigo', 'chave', 'comum', 'completa', 'curta', 'dentro', 'desafio', 'dona', 'dono', 'duas',
  'educado', 'erro', 'estado', 'estas', 'estes', 'forma', 'guarde', 'habilidade', 'homem', 'idade',
  'ideia', 'interrogativa', 'isto', 'leitura', 'mais', 'mulher', 'nacionalidade', 'negativa',
  'negativo', 'noite', 'passos', 'pedido', 'perfil', 'perguntar', 'perguntas', 'possessivo',
  'pronome', 'responder', 'resposta', 'rotina', 'sem', 'siga', 'tarde', 'telefone',
]);

/** Tira acento: "você" vira "voce". Serve para comparar com `PALAVRAS_SO_PORTUGUESAS`. */
function semAcento(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * `true` quando o texto parece inglês puro: tem letra, não tem letra acentuada do português
 * e não tem nenhuma palavra de `PALAVRAS_SO_PORTUGUESAS`.
 * É uma heurística. Quem decide no fim é o agente, com a regra escrita no pacote.
 */
export function ehIngles(texto) {
  const t = normalizarAncora(texto);
  if (!/\p{L}/u.test(t)) return false;
  if (/[ãõçáéíóúâêôàÃÕÇÁÉÍÓÚÂÊÔÀ]/u.test(t)) return false;
  // "engenheiro(a)": marca de gênero do português
  if (/\p{L}\(a\)/u.test(t)) return false;
  return !palavras(t).some(
    (p) => PALAVRAS_SO_PORTUGUESAS.has(semAcento(p)) || (p.length >= 7 && p.endsWith('mente')),
  );
}

/**
 * Nomes de pessoas, bichos e cidades que aparecem nas 42 aulas. Podem ser usados em
 * exemplos de prática e voltam com maiúscula no texto falado. Nome fora desta lista
 * é nome inventado: o `validar-fichas.mjs` recusa.
 * Países e nacionalidades NÃO estão aqui: são vocabulário (Aulas 02 e 06).
 */
export const NOMES_PROPRIOS = [
  'Rafael', 'Marina', 'Lucas', 'Ana', 'Paulo', 'Floki', 'Rex', 'Camila', 'Anna', 'Mike',
  'Anthony', 'William', 'Sarah', 'James', 'Dan', 'Jordan', 'Tom', 'Maria', 'Carla', 'Leo',
  'Nathaly', 'Juan', 'Karen', 'Mark', 'Linda', 'Superman', 'Mia', 'Molly', 'Brian', 'Rafaela',
  'Hannah', 'Tyler', 'Patricia', 'Mary', 'Jenny', 'Nancy', 'Suzy', 'Lisa', 'Billy', 'Julian',
  'Daniel', 'Kate', 'Recife', 'Paris', 'Salvador', 'London',
];

// ---------------------------------------------------------------- blocos

/**
 * Tabela 2.2 do contrato 01: campos de cada tipo de bloco que podem ancorar áudio.
 * Nomes de campo conferidos em `src/lib/content/types.ts`.
 */
export const CAMPOS_ANCORAVEIS = {
  chips: 'items[].t',
  pron: 'code',
  grid: 'items[].title',
  table: 'rows[].a, rows[].b',
  rule: 'ex',
  compare: 'items[].right',
  profile: 'facts[]',
  cards: 'items[].tag, items[].lines[]',
  rows: 'items[].text',
  steps: 'items[].tag, items[].lines[]',
  dialogue: 'items[].text',
  lead: 'text',
  note: 'text',
  key: 'text',
};

/** Tipos de bloco com campo ancorável. */
export const TIPOS_ANCORAVEIS = new Set(Object.keys(CAMPOS_ANCORAVEIS));

/** Tipos de bloco que aceitam um clipe `alvo: 'bloco'` ("ouvir todos" ou diálogo). */
export const TIPOS_COM_CLIPE_DE_BLOCO = new Set(['dialogue', 'chips', 'grid', 'table', 'rows']);

/** Exercícios e peças de navegação: nunca contam como ensino e nunca recebem áudio. */
export const BLOCOS_QUE_NAO_ENSINAM = new Set([
  'mc', 'fill', 'match', 'dnd', 'check', 'free', 'answers', 'cta', 'next', 'badge', 'title',
  'sec', 'kicker', 'meta', 'image', 'bar',
]);

/**
 * Textos ancoráveis de um bloco, na ordem em que aparecem na tela.
 * Cada item: `{ campo, texto }`, com `campo` no formato "rows[2].b".
 */
export function textosDoBloco(bloco) {
  const saida = [];
  const pegar = (campo, valor) => {
    if (typeof valor === 'string' && valor.trim() !== '') saida.push({ campo, texto: valor });
  };
  const itens = Array.isArray(bloco.items) ? bloco.items : [];
  switch (bloco.t) {
    case 'chips':
      itens.forEach((it, i) => pegar(`items[${i}].t`, it.t));
      break;
    case 'pron':
      pegar('code', bloco.code);
      break;
    case 'grid':
      itens.forEach((it, i) => pegar(`items[${i}].title`, it.title));
      break;
    case 'table':
      (bloco.rows ?? []).forEach((r, i) => {
        pegar(`rows[${i}].a`, r.a);
        pegar(`rows[${i}].b`, r.b);
      });
      break;
    case 'rule':
      pegar('ex', bloco.ex);
      break;
    case 'compare':
      itens.forEach((it, i) => pegar(`items[${i}].right`, it.right));
      break;
    case 'profile':
      (bloco.facts ?? []).forEach((f, i) => pegar(`facts[${i}]`, f));
      break;
    case 'cards':
    case 'steps':
      itens.forEach((it, i) => {
        pegar(`items[${i}].tag`, it.tag);
        (it.lines ?? []).forEach((l, j) => pegar(`items[${i}].lines[${j}]`, l));
      });
      break;
    case 'rows':
    case 'dialogue':
      itens.forEach((it, i) => pegar(`items[${i}].text`, it.text));
      break;
    case 'lead':
    case 'note':
    case 'key':
      pegar('text', bloco.text);
      break;
    default:
      break;
  }
  return saida;
}

/**
 * Todos os textos ancoráveis de uma página.
 * Cada item: `{ bloco, tipo, campo, texto }`, com `bloco` começando em 1.
 */
export function textosAncoraveisDaPagina(pagina) {
  return pagina.blocks.flatMap((b, i) =>
    textosDoBloco(b).map((x) => ({ bloco: i + 1, tipo: b.t, campo: x.campo, texto: x.texto })),
  );
}

/** Conta palavras de um texto (números contam como palavra). */
export function contarPalavras(s) {
  return normalizarAncora(s).split(' ').filter((p) => /[\p{L}\p{N}]/u.test(p)).length;
}

/**
 * Tipo de texto esperado no `textosEmIngles` do mapa, calculado pelo tipo do bloco.
 * Regra única, usada pelo `extrair-aula.mjs` (que sugere) e pelo `validar-mapa.mjs` (que confere).
 */
export function tipoDeTextoDoBloco(bloco) {
  if (bloco.t === 'dialogue') return 'dialogo';
  if (bloco.t === 'lead' || bloco.t === 'note' || bloco.t === 'key') return 'texto';
  if (bloco.t === 'chips' || bloco.t === 'table') return 'lista';
  if (bloco.t === 'pron' || bloco.t === 'rule' || bloco.t === 'compare' || bloco.t === 'profile') {
    return 'exemplo';
  }
  const ingleses = textosDoBloco(bloco).map((x) => x.texto).filter(ehIngles);
  if (ingleses.some((t) => contarPalavras(t) > 12)) return 'texto';
  if (ingleses.some((t) => /[.!?]$/.test(normalizarAncora(t)))) return 'exemplo';
  return 'lista';
}

/** Blocos da aula com pelo menos um texto ancorável em inglês: `[{ pagina, bloco, tipoDeTexto }]`. */
export function blocosEmIngles(aula) {
  const saida = [];
  aula.pages.forEach((p, pi) => {
    p.blocks.forEach((b, bi) => {
      if (!TIPOS_ANCORAVEIS.has(b.t)) return;
      if (!textosDoBloco(b).some((x) => ehIngles(x.texto))) return;
      saida.push({ pagina: pi + 1, bloco: bi + 1, tipoDeTexto: tipoDeTextoDoBloco(b) });
    });
  });
  return saida;
}

// ---------------------------------------------------------------- mapa curricular

/**
 * Aulas de revisão no conteúdo REAL de `course-data.mjs`: 05 "Verb to be: Review" e
 * 42 "Unit Review 2". O contrato 01 (seção 3.1) fala em 30 e 42, mas a Aula 30 real é
 * "Jobs", com vocabulário novo. Se o dono do produto decidir outra coisa, troque só aqui.
 */
export const AULAS_DE_REVISAO = [5, 42];

/**
 * Aula cujo conteúdo é pendência do dono do produto. Era a 05, resolvida em 2026-09-19:
 * a aula foi reescrita com as 9 páginas do e-book e entrou no mapa, na prática e no áudio.
 * `null` significa "nenhuma aula pendente". Se surgir outra pendência, ponha o número aqui.
 */
export const AULA_PENDENTE = null;

export const CATEGORIAS_DO_MAPA = ['vocabulario', 'estruturas', 'expressoesFixas', 'pronuncia'];

export function caminhoDoMapa() {
  return noApp('content', 'mapa-curricular.json');
}

/** Todos os itens de `apresenta` de uma entrada do mapa, numa lista só. */
export function itensApresentados(entrada) {
  return CATEGORIAS_DO_MAPA.flatMap((c) => entrada?.apresenta?.[c] ?? []);
}

/**
 * Índice "chave normalizada → número da aula que apresentou o item".
 * Só considera aulas com número menor ou igual a `ate`.
 */
export function indiceDoMapa(mapa, ate = 42) {
  const indice = new Map();
  for (const entrada of mapa.aulas) {
    if (entrada.numero > ate) continue;
    for (const item of itensApresentados(entrada)) {
      const chave = normalizarItem(item);
      if (!indice.has(chave)) indice.set(chave, entrada.numero);
    }
  }
  return indice;
}
