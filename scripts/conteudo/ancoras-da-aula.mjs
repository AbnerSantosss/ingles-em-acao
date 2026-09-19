/**
 * Âncoras de áudio de uma aula e rascunho da tabela de produção (pacote 12).
 *
 *   node scripts/conteudo/ancoras-da-aula.mjs 2                      lista os textos ancoráveis
 *   node scripts/conteudo/ancoras-da-aula.mjs 2 --rascunho           imprime o rascunho da tabela
 *   node scripts/conteudo/ancoras-da-aula.mjs 2 --rascunho --gravar  grava content/audio/aula-02.json
 *
 * O rascunho aplica as regras do pacote 12 de forma mecânica. O agente de conteúdo revisa
 * cada clipe marcado com "REVISAR:" no `motivo` e troca o motivo por um texto final.
 * `--gravar` nunca sobrescreve um arquivo que já existe. Neste ciclo o rascunho sai só com
 * clipes P0 (ver `PRIORIDADES_DO_CICLO`).
 *
 * Por que o rascunho existe: a âncora precisa ser COPIADA do conteúdo, nunca redigitada
 * (contrato 01, seção 2.4). Gerar por código elimina o erro de digitação.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  acharAula,
  caminhoDoMapa,
  carregarAulas,
  CATEGORIAS_DO_MAPA,
  chamadoDireto,
  contarPalavras,
  doisDigitos,
  ehIngles,
  indiceDoMapa,
  lerJson,
  NOMES_PROPRIOS,
  noApp,
  normalizarAncora,
  normalizarItem,
  numeroDaAula,
  palavras,
  textosAncoraveisDaPagina,
  textosDoBloco,
  TIPOS_ANCORAVEIS,
  tituloDepoisDoPacote10,
  TRAVESSAO,
  tresDigitos,
} from './comum.mjs';

/** Separadores que viram pausa na fala: seta, ponto do meio, barra, igual e travessão. */
const SEPARADORES_DE_FALA = new RegExp(`\\s*→\\s*|\\s+·\\s+|\\s+/\\s+|\\s+=\\s+|\\s*${TRAVESSAO}\\s*`);

/** Mais que isto numa aula é poluição de interface (prompt-mestre de áudios, seção 19). */
export const TETO_DE_CLIPES = 45;

/**
 * Prioridades que entram na tabela neste ciclo. Corte do MVP (dono do produto, 2026-09-19):
 * só P0 (diálogos e conteúdo novo da aula). P1 e P2 ficam pendentes (PENDENCIAS.md, item 5).
 * Para voltar a gerar P1 e P2, acrescente aqui e refaça as tabelas.
 */
export const PRIORIDADES_DO_CICLO = ['P0'];

/** Lista com pelo menos isto de itens em inglês ganha o clipe "ouvir todos". */
export const MINIMO_PARA_OUVIR_TODOS = 4;

/** Categoria do áudio conforme a categoria do item no mapa curricular. */
export const CATEGORIA_POR_CATEGORIA_DO_MAPA = {
  vocabulario: 'VOCABULARY_PRONUNCIATION',
  estruturas: 'GRAMMAR_IN_CONTEXT',
  expressoesFixas: 'FIXED_CHUNK',
  pronuncia: 'PRONUNCIATION_MODEL',
};

/**
 * Voz de cada personagem com rótulo no texto do diálogo. Mesma personagem, mesma voz,
 * no curso inteiro. Sem rótulo: fala "a" é F1 e fala "b" é M1.
 */
export const VOZ_POR_ROTULO = {
  SERVER: 'M1',
  CUSTOMER: 'F1',
  W: 'M1',
  C: 'F1',
  Mia: 'F1',
  Leo: 'M1',
  T: 'M1',
  H: 'F1',
};

/** Palavras que marcam explicação sobre a língua (metalinguagem). Texto com uma delas não ganha áudio. */
export const PALAVRAS_DE_METALINGUAGEM = new Set([
  'verb', 'verbs', 'noun', 'nouns', 'pronoun', 'pronouns', 'subject', 'object', 'countable',
  'uncountable', 'adjective', 'adjectives', 'adverb', 'adverbs', 'preposition', 'prepositions',
  'consonant', 'consonants', 'vowel', 'vowels', 'spelling', 'sentence', 'sentences', 'singular',
  'plural', 'affirmative', 'negative', 'negatives', 'interrogative', 'infinitive', 'stressed',
  'syllable', 'possessive', 'base', 'tense', 'verbo', 'ing', 'ed', 'voiced', 'voiceless',
  'sound', 'sounds',
]);

/**
 * Palavras que continuam com maiúscula quando um texto em CAIXA ALTA vira minúsculo:
 * nomes, dias, meses, países, nacionalidades e idiomas que aparecem nas 42 aulas.
 */
export const PALAVRAS_COM_MAIUSCULA = [
  ...NOMES_PROPRIOS,
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Saturdays',
  'Sundays', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'Brazil', 'Brazilian', 'China', 'Chinese',
  'Christmas', 'Egyptian', 'Eiffel', 'Tower', 'English', 'France', 'French', 'Irish', 'Italian',
  'Italy', 'Japan', 'Japanese', 'Portuguese', 'Avenue', 'Street', 'Oak',
];

const NOMES_EM_MINUSCULA = new Map(PALAVRAS_COM_MAIUSCULA.map((n) => [n.toLowerCase(), n]));

// ---------------------------------------------------------------- classificação do texto

/** Fórmula de gramática ("I + am", "___ is"): não é fala, não ganha áudio. */
export function ehFormula(texto) {
  const t = normalizarAncora(texto);
  return t.includes(' + ') || t.startsWith('+') || t.endsWith('+') || t.includes('___');
}

/** Explicação sobre a língua ("SUBJECT PRONOUN", "Notice how each verb..."). */
export function ehMetalinguagem(texto) {
  // transcrição fonética entre barras ("/d/", "/ɪd/") também é explicação sobre a língua
  if (/(^|\s)\/[^\s/]{1,4}\/(?=[\s:,.]|$)/u.test(normalizarAncora(texto))) return true;
  return palavras(texto).some((p) => PALAVRAS_DE_METALINGUAGEM.has(p));
}

/** Frase: mais de 4 palavras ou termina em ponto, exclamação ou interrogação. O resto é item. */
export function ehFrase(texto) {
  const t = normalizarAncora(texto);
  return contarPalavras(t) > 4 || /[.!?]$/.test(t);
}

/** Rótulo de quem fala no começo de uma fala de diálogo ("SERVER: ...", "Mia: ..."). */
export function rotuloDoFalante(texto) {
  const m = /^([A-Z][A-Za-z]{0,11}):\s+/.exec(normalizarAncora(texto));
  return m ? m[1] : null;
}

/** Página de gabarito: algum selo, título ou kicker com "GABARITO". */
export function ehPaginaDeGabarito(pagina) {
  return pagina.blocks.some((b) => {
    const textos = [b.label, b.text, b.en, b.pt].filter((x) => typeof x === 'string');
    return ['badge', 'title', 'kicker', 'sec'].includes(b.t) && textos.some((x) => /GABARITO/i.test(x));
  });
}

// ---------------------------------------------------------------- números por extenso

const UNIDADES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const DEZENAS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function ate99(n) {
  if (n < 20) return UNIDADES[n];
  const resto = n % 10;
  return DEZENAS[Math.floor(n / 10)] + (resto ? `-${UNIDADES[resto]}` : '');
}

/** 0 a 9999 por extenso, em inglês americano ("one hundred five"). Fora disso, devolve os dígitos. */
export function numeroPorExtenso(n) {
  if (!Number.isInteger(n) || n < 0 || n > 9999) return String(n);
  if (n < 100) return ate99(n);
  if (n < 1000) {
    const resto = n % 100;
    return `${UNIDADES[Math.floor(n / 100)]} hundred${resto ? ` ${ate99(resto)}` : ''}`;
  }
  const resto = n % 1000;
  return `${numeroPorExtenso(Math.floor(n / 1000))} thousand${resto ? ` ${numeroPorExtenso(resto)}` : ''}`;
}

/** Ano como se fala: 1996 "nineteen ninety-six", 2000 "two thousand", 2015 "twenty fifteen". */
export function anoPorExtenso(n) {
  if (n >= 2000 && n <= 2009) return `two thousand${n % 10 ? ` ${UNIDADES[n % 10]}` : ''}`;
  const alto = Math.floor(n / 100);
  const baixo = n % 100;
  if (baixo === 0) return `${ate99(alto)} hundred`;
  if (baixo < 10) return `${ate99(alto)} oh ${UNIDADES[baixo]}`;
  return `${ate99(alto)} ${ate99(baixo)}`;
}

const ORDINAIS_IRREGULARES = {
  one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth',
  twelve: 'twelfth',
};

/** 3 "third", 15 "fifteenth", 21 "twenty-first". */
export function ordinalPorExtenso(n) {
  const cardinal = numeroPorExtenso(n);
  const m = /^(.*?)([a-z]+)$/.exec(cardinal);
  if (!m) return cardinal;
  const [, comeco, ultima] = m;
  if (ORDINAIS_IRREGULARES[ultima]) return comeco + ORDINAIS_IRREGULARES[ultima];
  if (ultima.endsWith('y')) return `${comeco}${ultima.slice(0, -1)}ieth`;
  return `${comeco}${ultima}th`;
}

/** Hora: 6:00 "six", 8:15 "eight fifteen", 4:05 "four oh five". */
function horaPorExtenso(h, mm) {
  if (mm === 0) return numeroPorExtenso(h);
  if (mm < 10) return `${numeroPorExtenso(h)} oh ${UNIDADES[mm]}`;
  return `${numeroPorExtenso(h)} ${ate99(mm)}`;
}

/** Troca todo número do texto pela forma falada. `a.m.` e `p.m.` ficam como estão. */
export function numerosPorExtenso(texto) {
  return texto
    .replace(/\$(\d+)\.(\d{2})\b/g, (_, d, c) =>
      Number(c) === 0
        ? `${numeroPorExtenso(Number(d))} ${Number(d) === 1 ? 'dollar' : 'dollars'}`
        : `${numeroPorExtenso(Number(d))} ${ate99(Number(c))}`,
    )
    .replace(/\$(\d+)\b/g, (_, d) => `${numeroPorExtenso(Number(d))} ${Number(d) === 1 ? 'dollar' : 'dollars'}`)
    .replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, mm) => horaPorExtenso(Number(h), Number(mm)))
    .replace(/\b(\d+)(st|nd|rd|th)\b/g, (_, n) => ordinalPorExtenso(Number(n)))
    .replace(/\b(1[1-9]\d\d|20\d\d)\b/g, (_, n) => anoPorExtenso(Number(n)))
    .replace(/\b(\d+)%/g, (_, n) => `${numeroPorExtenso(Number(n))} percent`)
    .replace(/\b(\d+)\b/g, (_, n) => numeroPorExtenso(Number(n)));
}

// ---------------------------------------------------------------- texto falado

/** Texto todo em maiúsculas vira minúsculas, com "I", contrações de "I" e nomes próprios restaurados. */
function tirarCaixaAlta(parte) {
  const letras = parte.match(/\p{L}/gu) ?? [];
  if (letras.length < 2 || letras.some((l) => l !== l.toUpperCase())) return parte;
  return parte
    .toLowerCase()
    .replace(/\bi\b(?!')/g, 'I')
    .replace(/\bi'(m|ll|d|ve)\b/g, "I'$1")
    .replace(/\p{L}+/gu, (p) => NOMES_EM_MINUSCULA.get(p) ?? p);
}

/**
 * O que a voz fala para um texto da tela. Regras do pacote 12, passo "texto falado":
 * apóstrofo reto; sem numeração de exercício; sem rótulo de quem fala; sem transcrição
 * fonética entre barras; partes separadas por " · ", " / ", " = " e "→" viram frases;
 * lado sem letras de um "→" sai; caixa alta vira minúscula; números por extenso.
 */
export function textoParaFala(texto, tipoDoBloco) {
  let t = normalizarAncora(texto);
  t = t.replace(/^\d{1,2}\s*[.)·]\s+/, '');
  if (tipoDoBloco === 'dialogue') t = t.replace(/^[A-Z][A-Za-z]{0,11}:\s+/, '');
  if (['lead', 'note', 'key'].includes(tipoDoBloco)) t = t.replace(/^[A-Z]{1,8}:\s+/, '');
  if (tipoDoBloco === 'chips') t = t.replace(/^\d+\s+(?=\p{L}+(?:-\p{L}+)?$)/u, '');
  t = t.replace(/\s*\(\/[^)]*\/\)/g, '');
  // "He / She / It worked": barra entre palavras soltas vira vírgula.
  // "Yes, I am. / No, I'm not.": barra entre frases separa duas frases.
  const lados = t.split(/\s+\/\s+/);
  if (lados.length > 1 && lados.some((l) => !l.includes(' '))) t = lados.join(', ');
  const partes = t
    .split(SEPARADORES_DE_FALA)
    .map((p) => p.trim())
    .filter((p) => /\p{L}/u.test(p));
  const unicas = partes.filter((p, i) => i === 0 || normalizarItem(p) !== normalizarItem(partes[i - 1]));
  const faladas = unicas.map((p) => {
    let q = tirarCaixaAlta(p);
    if (/[.!?]$/.test(q)) q = q.charAt(0).toUpperCase() + q.slice(1);
    return numerosPorExtenso(q);
  });
  return faladas
    .map((p, i) => (i < faladas.length - 1 && !/[.!?,:;]$/.test(p) ? `${p}.` : p))
    .join(' ');
}

// ---------------------------------------------------------------- mapa

/** Palavras dos itens de `apresenta` de uma aula (ou de várias), sem símbolos de fórmula. */
function palavrasDosItens(itens) {
  return itens.map((i) => palavras(i).join(' ')).filter((s) => s !== '');
}

/** `true` se a sequência de palavras `item` aparece inteira dentro do texto. */
function contemSequencia(texto, item) {
  return ` ${palavras(texto).join(' ')} `.includes(` ${item} `);
}

/** Categoria do mapa de um item desta aula, procurando pela chave do texto e de cada parte dele. */
function categoriaNoMapa(chaves, entrada) {
  for (const categoria of CATEGORIAS_DO_MAPA) {
    const itens = (entrada.apresenta?.[categoria] ?? []).map(normalizarItem);
    if (chaves.some((c) => itens.includes(c))) return categoria;
  }
  return null;
}

/** Chaves de comparação de um texto: o texto inteiro e cada parte dele, já na forma falada. */
function chavesDoTexto(texto, tipoDoBloco) {
  const falado = textoParaFala(texto, tipoDoBloco);
  const partes = falado.split(/(?<=[.!?])\s+/);
  return [...new Set([normalizarItem(texto), normalizarItem(falado), ...partes.map(normalizarItem)])];
}

// ---------------------------------------------------------------- rascunho da tabela

function localDoClipe(numeroDaPagina, bloco, indiceDoBloco) {
  const kicker = (bloco.t === 'rule' || bloco.t === 'note') && typeof bloco.kicker === 'string' ? ` · ${bloco.kicker}` : '';
  return `Página ${numeroDaPagina} · ${bloco.t} · b${indiceDoBloco}${kicker}`;
}

export function ehLento(texto, categoria) {
  if (categoria === 'PRONUNCIATION_MODEL') return true;
  if (contarPalavras(texto) > 7) return true;
  return !ehFrase(texto) && /th/i.test(texto);
}

/** Vozes das falas de um diálogo, com os avisos de conferência. */
export function vozesDoDialogo(itens) {
  const avisos = [];
  const vozPorPersonagem = new Map();
  const falas = itens.map((it) => {
    const rotulo = rotuloDoFalante(it.text);
    const personagem = rotulo ?? `lado-${it.s}`;
    if (!vozPorPersonagem.has(personagem)) {
      let voz = (rotulo && VOZ_POR_ROTULO[rotulo]) || (it.s === 'a' ? 'F1' : 'M1');
      if (rotulo && !VOZ_POR_ROTULO[rotulo]) avisos.push(`confira a voz de "${rotulo}"`);
      const usadas = [...vozPorPersonagem.values()];
      if (usadas.includes(voz)) {
        voz = voz.startsWith('F') ? 'F2' : 'M2';
        avisos.push(`terceira personagem "${personagem}" recebeu ${voz}`);
      }
      vozPorPersonagem.set(personagem, voz);
    }
    return { voz: vozPorPersonagem.get(personagem), texto: textoParaFala(it.text, 'dialogue') };
  });
  return { falas, avisos };
}

/**
 * Rascunho da tabela de áudio de uma aula (contrato 01, seção 2.4).
 * `mapa` é o `content/mapa-curricular.json` inteiro. Devolve `{ tabela, avisos }`.
 */
export function planejarAula(aula, mapa) {
  const avisos = [];
  const entrada = mapa.aulas.find((e) => e.numero === aula.id);
  if (!entrada) throw new Error(`A Aula ${aula.id} não está no mapa curricular. Rode o pacote 11 antes.`);
  const tabela = { aula: aula.id, titulo: tituloDepoisDoPacote10(aula.title), status: entrada.status, clips: [] };
  if (entrada.status === 'pendente') return { tabela, avisos };

  const anteriores = indiceDoMapa(mapa, aula.id - 1);
  const itensDesta = palavrasDosItens(CATEGORIAS_DO_MAPA.flatMap((c) => entrada.apresenta?.[c] ?? []));
  const palavrasConhecidas = new Set(
    mapa.aulas
      .filter((e) => e.numero < aula.id)
      .flatMap((e) => CATEGORIAS_DO_MAPA.flatMap((c) => e.apresenta?.[c] ?? []))
      .flatMap((i) => palavras(i)),
  );
  NOMES_PROPRIOS.forEach((n) => palavrasConhecidas.add(n.toLowerCase()));

  // Primeira página (a partir da 2) em que cada texto aparece. A página 1 é a abertura:
  // o clipe individual fica na explicação, não na capa.
  const paginaDoTexto = new Map();
  aula.pages.forEach((pagina, pi) => {
    for (const x of textosAncoraveisDaPagina(pagina)) {
      if (x.tipo === 'dialogue') continue; // diálogo ganha um clipe só, de bloco
      const chave = normalizarItem(x.texto);
      const atual = paginaDoTexto.get(chave);
      if (atual === undefined || (atual === 1 && pi + 1 > 1)) paginaDoTexto.set(chave, pi + 1);
    }
  });

  const candidatos = [];
  const jaTemClipe = new Set();
  aula.pages.forEach((pagina, pi) => {
    const numeroDaPagina = pi + 1;
    const gabarito = ehPaginaDeGabarito(pagina);
    pagina.blocks.forEach((bloco, bi) => {
      if (!TIPOS_ANCORAVEIS.has(bloco.t)) return;
      const local = localDoClipe(numeroDaPagina, bloco, bi + 1);
      const textos = textosDoBloco(bloco).map((x) => x.texto);
      const ingleses = textos.filter((t) => ehIngles(t) && !ehFormula(t) && !ehMetalinguagem(t));

      if (bloco.t === 'dialogue') {
        const { falas, avisos: avisosDoDialogo } = vozesDoDialogo(bloco.items);
        candidatos.push({
          pagina: numeroDaPagina, local, alvo: 'bloco', ancora: bloco.items[0].text,
          texto: falas.map((f) => f.texto).join('\n'), falas, categoria: 'DIALOGUE', voz: null,
          lento: true, prioridade: 'P0',
          motivo: avisosDoDialogo.length
            ? `REVISAR: ${avisosDoDialogo.join('; ')}.`
            : 'Diálogo da aula, uma voz por personagem.',
        });
        return;
      }

      if (bloco.t === 'rows' && ingleses.some((t) => contarPalavras(t) > 12)) {
        const falas = ingleses.map((t) => ({ voz: 'F1', texto: textoParaFala(t, 'rows') }));
        candidatos.push({
          pagina: numeroDaPagina, local, alvo: 'bloco', ancora: textos[0],
          texto: falas.map((f) => f.texto).join('\n'), falas: falas.length > 1 ? falas : null,
          categoria: 'TEXT_LISTENING', voz: falas.length > 1 ? null : 'F1', lento: true,
          prioridade: gabarito ? 'P2' : 'P1',
          motivo: 'Texto de leitura em inglês, lido de uma vez.',
        });
        ingleses.forEach((t) => jaTemClipe.add(normalizarItem(t)));
        return;
      }

      if (['chips', 'grid', 'table', 'rows'].includes(bloco.t) && !gabarito && ingleses.length >= MINIMO_PARA_OUVIR_TODOS) {
        const falas = ingleses.map((t) => ({ voz: 'F1', texto: textoParaFala(t, bloco.t) }));
        const doMapa = ingleses.map((t) => categoriaNoMapa(chavesDoTexto(t, bloco.t), entrada)).find(Boolean);
        let categoriaDaLista = ingleses.every((t) => !ehFrase(t)) ? 'VOCABULARY_PRONUNCIATION' : 'GRAMMAR_IN_CONTEXT';
        if (doMapa) categoriaDaLista = CATEGORIA_POR_CATEGORIA_DO_MAPA[doMapa];
        candidatos.push({
          pagina: numeroDaPagina, local, alvo: 'bloco', ancora: textos[0],
          texto: falas.map((f) => f.texto).join('\n'), falas,
          categoria: categoriaDaLista,
          voz: null, lento: false, prioridade: 'P1',
          motivo: 'Ouvir todos: a lista inteira, na ordem da tela.',
        });
      }

      for (const texto of ingleses) {
        const chave = normalizarItem(texto);
        if (jaTemClipe.has(chave) || paginaDoTexto.get(chave) !== numeroDaPagina) continue;
        const falado = textoParaFala(texto, bloco.t);
        if (jaTemClipe.has(normalizarItem(falado))) continue; // mesma fala com outra grafia na tela
        const chaves = chavesDoTexto(texto, bloco.t);
        const categoriaDoMapa = categoriaNoMapa(chaves, entrada);
        const ehDeAulaAnterior = chaves.some((c) => anteriores.has(c));
        const notas = [];
        let categoria;
        let prioridade;
        let motivo;

        if (contarPalavras(texto) > 20) {
          categoria = 'TEXT_LISTENING';
          prioridade = 'P1';
          motivo = 'Texto de leitura em inglês.';
        } else if (!ehFrase(texto)) {
          if (!categoriaDoMapa) continue; // item antigo, rótulo ou item fora do mapa: sem clipe
          categoria = CATEGORIA_POR_CATEGORIA_DO_MAPA[categoriaDoMapa];
          prioridade = 'P0';
          motivo = `Primeira apresentação no curso (mapa: ${categoriaDoMapa}).`;
        } else if (categoriaDoMapa) {
          categoria = CATEGORIA_POR_CATEGORIA_DO_MAPA[categoriaDoMapa];
          prioridade = 'P0';
          motivo = `Primeira apresentação no curso (mapa: ${categoriaDoMapa}).`;
        } else if (ehDeAulaAnterior) {
          continue; // a mesma frase já foi sonorizada numa aula anterior
        } else if (itensDesta.some((i) => contemSequencia(texto, i))) {
          categoria = 'GRAMMAR_IN_CONTEXT';
          prioridade = 'P0';
          motivo = 'Exemplo com conteúdo novo desta aula.';
        } else if (palavras(texto).some((p) => !palavrasConhecidas.has(p))) {
          categoria = 'GRAMMAR_IN_CONTEXT';
          prioridade = 'P1';
          motivo = 'Frase em inglês da aula.';
        } else {
          categoria = 'GRAMMAR_IN_CONTEXT';
          prioridade = 'P2';
          motivo = 'Frase só com repertório de aulas anteriores.';
        }

        if (gabarito) {
          prioridade = contarPalavras(texto) > 20 ? 'P1' : 'P2';
          motivo = 'Resposta de gabarito, para conferir ouvindo.';
        }
        if (['lead', 'note', 'key'].includes(bloco.t) && contarPalavras(texto) <= 20) {
          notas.push('se for instrução ao aluno, troque para P2 e obrigatorio false');
        }
        if (/\d/.test(texto.replace(/^\d{1,2}\s*[.)·]\s+/, ''))) notas.push('confira os números por extenso');
        if (ehFrase(texto) && !/\p{Ll}/u.test(texto)) notas.push('confira as maiúsculas de nomes, dias e meses');
        if (notas.length) motivo = `REVISAR: ${notas.join('; ')}. ${motivo}`;

        jaTemClipe.add(chave);
        jaTemClipe.add(normalizarItem(falado));
        candidatos.push({
          pagina: numeroDaPagina, local, alvo: 'texto', ancora: texto, texto: falado, falas: null,
          categoria, voz: 'F1', lento: ehLento(texto, categoria), prioridade, motivo,
        });
      }
    });
  });

  // Corte do MVP (PENDENCIAS.md, item 5): a tabela sai só com P0. Os "ouvir todos" (P1)
  // ficam até o passo do teto decidir se algum deles vira P0; P2 e o resto do P1 saem já.
  const ehOuvirTodos = (c) =>
    c.alvo === 'bloco' && c.falas && c.categoria !== 'DIALOGUE' && c.categoria !== 'TEXT_LISTENING';
  let lista = candidatos.filter((c) => PRIORIDADES_DO_CICLO.includes(c.prioridade) || ehOuvirTodos(c));
  const totalDoCiclo = () => lista.filter((c) => PRIORIDADES_DO_CICLO.includes(c.prioridade)).length;
  // Teto: numa lista com "ouvir todos", ficam só o player da lista (promovido a P0) e os itens
  // saem (prompt-mestre de áudios, seção 20, opção B). Começa pela lista com mais itens.
  const listas = lista
    .filter(ehOuvirTodos)
    .map((c) => ({ clipe: c, itens: lista.filter((x) => x.alvo === 'texto' && x.local === c.local).length }))
    .sort((a, b) => b.itens - a.itens);
  for (const { clipe, itens } of listas) {
    if (totalDoCiclo() <= TETO_DE_CLIPES || itens === 0) break;
    lista = lista.filter((x) => !(x.alvo === 'texto' && x.local === clipe.local));
    clipe.prioridade = 'P0';
    clipe.motivo = 'Ouvir todos: a lista inteira, na ordem da tela. Os itens ficam só neste player por causa do teto.';
  }
  lista = lista.filter((c) => PRIORIDADES_DO_CICLO.includes(c.prioridade));
  if (lista.length > TETO_DE_CLIPES) {
    // O revisor (pacote 13) foi cortado no MVP: quem faz a aula corta pela regra do pacote.
    avisos.push(
      `${lista.length} clipes P0, acima do teto de ${TETO_DE_CLIPES}. Apague os clipes de alvo "texto" do fim até ${TETO_DE_CLIPES} e anote no relatório.`,
    );
  }

  tabela.clips = lista.map((c, i) => ({
    id: `lesson_${tresDigitos(aula.id)}_audio_${tresDigitos(i + 1)}`,
    pagina: c.pagina,
    local: c.local,
    alvo: c.alvo,
    ancora: c.ancora,
    texto: c.texto,
    falas: c.falas,
    categoria: c.categoria,
    voz: c.voz,
    velocidade: 'natural',
    lento: c.lento,
    prioridade: c.prioridade,
    obrigatorio: c.prioridade !== 'P2',
    motivo: c.motivo,
  }));
  return { tabela, avisos };
}

// ---------------------------------------------------------------- linha de comando

function listar(aula) {
  aula.pages.forEach((pagina, pi) => {
    for (const x of textosAncoraveisDaPagina(pagina)) {
      const marca = ehIngles(x.texto) ? 'EN' : '--';
      console.log(`p${pi + 1} b${x.bloco} ${x.tipo}.${x.campo} [${marca}] ${JSON.stringify(x.texto)}`);
    }
  });
}

async function principal() {
  const numero = numeroDaAula(process.argv[2]);
  if (numero === null) {
    console.error('Uso: node scripts/conteudo/ancoras-da-aula.mjs <número da aula> [--rascunho [--gravar]]');
    process.exit(1);
  }
  const aula = acharAula(await carregarAulas(), numero);
  if (!process.argv.includes('--rascunho')) {
    listar(aula);
    return;
  }
  const mapa = lerJson(caminhoDoMapa());
  if (!mapa) {
    console.error('content/mapa-curricular.json não existe. O pacote 11 precisa terminar antes.');
    process.exit(1);
  }
  const { tabela, avisos } = planejarAula(aula, mapa);
  const json = `${JSON.stringify(tabela, null, 2)}\n`;
  avisos.forEach((a) => console.error(`AVISO: ${a}`));
  if (!process.argv.includes('--gravar')) {
    process.stdout.write(json);
    return;
  }
  const destino = noApp('content', 'audio', `aula-${doisDigitos(numero)}.json`);
  if (existsSync(destino)) {
    console.error(`${destino} já existe. Não sobrescrevo. Apague à mão só se quiser recomeçar.`);
    process.exit(1);
  }
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, json, 'utf8');
  console.log(`Gravado: ${destino} (${tabela.clips.length} clipes)`);
}

if (chamadoDireto(import.meta.url)) {
  principal().catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
}
