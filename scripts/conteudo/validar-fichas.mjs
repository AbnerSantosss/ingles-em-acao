/**
 * Confere as fichas de prática `content/pratica/aula-NN.json` (pacote 12, contrato 01 seção 3.1).
 *
 *   npx tsx scripts/conteudo/validar-fichas.mjs 2               confere uma aula
 *   npx tsx scripts/conteudo/validar-fichas.mjs --todas         confere todas as fichas que existem
 *   node scripts/conteudo/validar-fichas.mjs --esqueleto 2      imprime o esqueleto da ficha (não grava)
 *
 * Por que `npx tsx` para conferir: o esquema oficial (`src/lib/pratica/esquema.ts`, pacote 02)
 * é TypeScript. O esqueleto não usa o esquema e roda com `node`.
 *
 * Além do esquema, este script confere:
 *   - o ORÇAMENTO de tamanho (contrato 01, seção 10.3), mais apertado que o esquema. É erro;
 *   - o "firewall" de conteúdo: nenhuma palavra em inglês que o aluno ainda não viu pode
 *     aparecer na ficha, porque a ficha vira o prompt do ChatGPT.
 *
 * Imprime "ERRO:" e "AVISO:". Sai com código 1 se houver pelo menos um erro.
 */
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  acharAula,
  caminhoDoMapa,
  carregarAulas,
  chamadoDireto,
  doisDigitos,
  ehIngles,
  lerJson,
  MEIA_RISCA,
  NOMES_PROPRIOS,
  noApp,
  normalizarItem,
  numeroDaAula,
  palavras,
  textosAncoraveisDaPagina,
  TRAVESSAO,
} from './comum.mjs';

/** Chaves da ficha, na ordem do contrato. */
export const CHAVES_DA_FICHA = [
  'versao', 'status', 'tipo', 'foco', 'conteudoAlvo', 'expressoesFixas', 'comoIntegrar',
  'regrasDaAula', 'tiposDeExercicio', 'exemplos', 'limites', 'primeiraQuestao', 'resumoAutorizado',
  'resumoCurto',
];

/** Os tipos de exercício, do mais fácil para o mais difícil (ordem do contrato 01, seção 3.1). */
export const ORDEM_DOS_TIPOS = [
  'identificar', 'escolher', 'completar', 'transformar', 'traduzir', 'responder', 'corrigir',
  'mini-dialogo', 'situacao',
];

/** Palavra usada no esqueleto e na ficha pendente. */
export const MARCA_DE_PREENCHER = 'PREENCHER';
export const MARCA_DE_PENDENTE = 'PENDENTE';

/**
 * Orçamento de tamanho da ficha (contrato 01, seção 10.3; origem no pacote 06, seção 8.2). É mais apertado que o esquema do
 * contrato 3.1 e é OBRIGATÓRIO: o `resumoAutorizado` entra no prompt das 5 aulas seguintes e o
 * `resumoCurto` em até 36 prompts. Fora do orçamento, o prompt das últimas aulas não cabe no
 * link do ChatGPT. `min` e `max` contam itens; `caracteres` é o tamanho máximo de cada texto.
 */
export const ORCAMENTO = {
  foco: { caracteres: 120 },
  conteudoAlvo: { min: 1, max: 4, caracteres: 50 },
  expressoesFixas: { min: 0, max: 2, caracteres: 40 },
  comoIntegrar: { min: 2, max: 2, caracteres: 90 },
  regrasDaAula: { min: 0, max: 1, caracteres: 90 },
  tiposDeExercicio: { min: 3, max: 4 },
  exemplos: { min: 3, max: 3, enunciado: 90, respostaDeReferencia: 50 },
  limites: { min: 1, max: 2, caracteres: 90 },
  primeiraQuestao: { caracteres: 120 },
  resumoAutorizado: { min: 3, max: 3, caracteres: 80 },
  resumoCurto: { caracteres: 120 },
};

/** Erros de orçamento: quantidade de itens e tamanho de cada texto. */
export function errosDeOrcamento(ficha) {
  const erros = [];
  const texto = (campo, valor, max) => {
    if (typeof valor !== 'string' || valor.trim() === '') erros.push(`${campo}: texto vazio.`);
    else if (valor.length > max) erros.push(`${campo}: ${valor.length} caracteres (máximo ${max}). Encurte.`);
  };
  const lista = (campo) => {
    const regra = ORCAMENTO[campo];
    const valor = ficha[campo];
    if (!Array.isArray(valor)) {
      erros.push(`"${campo}" precisa ser uma lista.`);
      return [];
    }
    if (valor.length < regra.min || valor.length > regra.max) {
      const faixa = regra.min === regra.max ? `exatamente ${regra.min}` : `de ${regra.min} a ${regra.max}`;
      erros.push(`"${campo}" tem ${valor.length} item(ns). O orçamento pede ${faixa}.`);
    }
    return valor;
  };
  texto('foco', ficha.foco, ORCAMENTO.foco.caracteres);
  for (const campo of ['conteudoAlvo', 'expressoesFixas', 'comoIntegrar', 'regrasDaAula', 'limites', 'resumoAutorizado']) {
    lista(campo).forEach((v, i) => texto(`${campo}[${i}]`, v, ORCAMENTO[campo].caracteres));
  }
  lista('tiposDeExercicio');
  lista('exemplos').forEach((ex, i) => {
    texto(`exemplos[${i}].enunciado`, ex?.enunciado, ORCAMENTO.exemplos.enunciado);
    texto(`exemplos[${i}].respostaDeReferencia`, ex?.respostaDeReferencia, ORCAMENTO.exemplos.respostaDeReferencia);
  });
  texto('primeiraQuestao', ficha.primeiraQuestao, ORCAMENTO.primeiraQuestao.caracteres);
  texto('resumoCurto', ficha.resumoCurto, ORCAMENTO.resumoCurto.caracteres);
  return erros;
}

/**
 * Palavras que só existem em inglês e que denunciam inglês solto num campo em português.
 * Inglês num campo em português vai SEMPRE entre aspas: "she", "I am Brazilian.".
 * "a", "do", "no", "me", "as" ficam de fora porque também são português.
 */
const FUNCIONAIS_INGLESAS = new Set([
  'i', 'am', 'is', 'are', 'was', 'were', 'you', 'he', 'she', 'it', 'we', 'they', 'the', 'an', 'my',
  'your', 'his', 'her', 'our', 'their', 'this', 'that', 'these', 'those', 'what', 'where', 'when',
  'who', 'how', 'not', 'and', 'or', 'but', 'with', 'from', 'there', 'can', 'does', 'did',
]);

/** Promessas proibidas (travas de conteúdo do 00, regra 4). */
const PROMESSAS_PROIBIDAS = [
  { regra: /\bflu[eê]n/i, msg: 'não prometa fluência' },
  // "domingo" (Aula 09) não pode cair aqui: por isso o (?!g).
  { regra: /\bdom[ií]n(?!g)/i, msg: 'não declare domínio ("domina", "dominou", "domínio")' },
  { regra: /\bem \d+ (dias|semanas|meses)\b/i, msg: 'não prometa prazo' },
];

// ---------------------------------------------------------------- repertório autorizado

/**
 * Palavras inglesas que o aluno já viu até a aula `n` (inclusive): itens do mapa curricular
 * das aulas 1 a n, textos em inglês das páginas das aulas 1 a n e os nomes próprios do curso.
 */
export function repertorioAte(n, mapa, aulas) {
  const conjunto = new Set(NOMES_PROPRIOS.map((x) => x.toLowerCase()));
  for (const entrada of mapa.aulas) {
    if (entrada.numero > n) continue;
    const itens = [
      ...Object.values(entrada.apresenta ?? {}).flat(),
      ...(entrada.reutiliza ?? []),
    ];
    itens.forEach((item) => palavras(item).forEach((p) => conjunto.add(p)));
  }
  for (const aula of aulas) {
    if (aula.id > n) continue;
    for (const pagina of aula.pages) {
      for (const x of textosAncoraveisDaPagina(pagina)) {
        if (ehIngles(x.texto)) palavras(x.texto).forEach((p) => conjunto.add(p));
      }
    }
  }
  return conjunto;
}

/** `true` se a palavra (ou a forma sem plural, ou a base da contração) está no repertório. */
export function palavraAutorizada(palavra, repertorio) {
  if (repertorio.has(palavra)) return true;
  if (palavra.endsWith('es') && repertorio.has(palavra.slice(0, -2))) return true;
  if (palavra.endsWith('s') && repertorio.has(palavra.slice(0, -1))) return true;
  if (repertorio.has(`${palavra}s`)) return true;
  const contracao = /^(.+)n't$/.exec(palavra) ?? /^(.+)'(s|m|re|ve|ll|d)$/.exec(palavra);
  return Boolean(contracao) && repertorio.has(contracao[1]);
}

/** Trechos entre aspas ("..." ou “...”) de um texto em português. */
export function trechosEntreAspas(texto) {
  return [...texto.matchAll(/"([^"]+)"|“([^”]+)”/g)].map((m) => m[1] ?? m[2]);
}

/** O texto sem os trechos entre aspas. */
function foraDasAspas(texto) {
  return texto.replace(/"[^"]*"|“[^”]*”/g, ' ');
}

// ---------------------------------------------------------------- esqueleto

/** Itens do mapa que o `conteudoAlvo` precisa cobrir (na revisão: os de `reutiliza`). */
export function itensDoAlvo(entrada) {
  if (entrada.tipo === 'revisao') return [...entrada.reutiliza];
  const a = entrada.apresenta;
  return [...a.vocabulario, ...a.estruturas, ...a.pronuncia];
}

/**
 * Primeira sugestão de `conteudoAlvo`: os itens do mapa, na ordem, juntados com ", " em linhas
 * de até 50 caracteres. Se passar de 4 linhas, o agente condensa à mão (seção 4 do pacote 12).
 */
export function sugerirConteudoAlvo(entrada) {
  const linhas = [];
  for (const item of itensDoAlvo(entrada)) {
    const ultima = linhas.length - 1;
    if (ultima >= 0 && `${linhas[ultima]}, ${item}`.length <= ORCAMENTO.conteudoAlvo.caracteres) {
      linhas[ultima] = `${linhas[ultima]}, ${item}`;
    } else {
      linhas.push(item);
    }
  }
  return linhas.length ? linhas : [MARCA_DE_PREENCHER];
}

/** Esqueleto da ficha de uma aula, a partir do mapa. Campos em português vêm com PREENCHER. */
export function esqueletoDaFicha(entrada) {
  if (entrada.status === 'pendente') {
    return {
      versao: 1,
      status: 'pendente',
      tipo: entrada.tipo,
      foco: MARCA_DE_PENDENTE,
      conteudoAlvo: [MARCA_DE_PENDENTE],
      expressoesFixas: [],
      comoIntegrar: [MARCA_DE_PENDENTE, MARCA_DE_PENDENTE],
      regrasDaAula: [],
      tiposDeExercicio: ['identificar', 'escolher', 'completar'],
      exemplos: ['identificar', 'escolher', 'completar'].map((tipo) => ({
        tipo,
        enunciado: MARCA_DE_PENDENTE,
        respostaDeReferencia: MARCA_DE_PENDENTE,
      })),
      limites: [MARCA_DE_PENDENTE],
      primeiraQuestao: MARCA_DE_PENDENTE,
      resumoAutorizado: [MARCA_DE_PENDENTE, MARCA_DE_PENDENTE, MARCA_DE_PENDENTE],
      resumoCurto: MARCA_DE_PENDENTE,
    };
  }
  return {
    versao: 1,
    status: entrada.status,
    tipo: entrada.tipo,
    foco: MARCA_DE_PREENCHER,
    conteudoAlvo: sugerirConteudoAlvo(entrada),
    expressoesFixas: entrada.tipo === 'revisao' ? [] : entrada.apresenta.expressoesFixas.slice(0, ORCAMENTO.expressoesFixas.max),
    comoIntegrar: [MARCA_DE_PREENCHER, MARCA_DE_PREENCHER],
    regrasDaAula: [],
    tiposDeExercicio: ['identificar', 'escolher', 'completar'],
    exemplos: ['identificar', 'escolher', 'completar'].map((tipo) => ({
      tipo,
      enunciado: MARCA_DE_PREENCHER,
      respostaDeReferencia: MARCA_DE_PREENCHER,
    })),
    limites: [MARCA_DE_PREENCHER, MARCA_DE_PREENCHER],
    primeiraQuestao: MARCA_DE_PREENCHER,
    resumoAutorizado: [MARCA_DE_PREENCHER, MARCA_DE_PREENCHER, MARCA_DE_PREENCHER],
    resumoCurto: MARCA_DE_PREENCHER,
  };
}

// ---------------------------------------------------------------- conferência

/** Palavras de uma lista de itens do mapa, num conjunto. */
function palavrasDosItens(itens) {
  const conjunto = new Set();
  itens.forEach((item) => palavras(item).forEach((p) => conjunto.add(p)));
  return conjunto;
}

/** Todos os textos da ficha, com o nome do campo: `[{ campo, texto, idioma: 'pt' | 'en' | 'limite' }]`. */
function textosDaFicha(ficha) {
  const saida = [];
  const pt = (campo, v) => typeof v === 'string' && saida.push({ campo, texto: v, idioma: 'pt' });
  const en = (campo, v) => typeof v === 'string' && saida.push({ campo, texto: v, idioma: 'en' });
  pt('foco', ficha.foco);
  (ficha.conteudoAlvo ?? []).forEach((v, i) => en(`conteudoAlvo[${i}]`, v));
  (ficha.expressoesFixas ?? []).forEach((v, i) => en(`expressoesFixas[${i}]`, v));
  (ficha.comoIntegrar ?? []).forEach((v, i) => pt(`comoIntegrar[${i}]`, v));
  (ficha.regrasDaAula ?? []).forEach((v, i) => pt(`regrasDaAula[${i}]`, v));
  (ficha.exemplos ?? []).forEach((ex, i) => {
    pt(`exemplos[${i}].enunciado`, ex?.enunciado);
    en(`exemplos[${i}].respostaDeReferencia`, ex?.respostaDeReferencia);
  });
  (ficha.limites ?? []).forEach((v, i) => typeof v === 'string' && saida.push({ campo: `limites[${i}]`, texto: v, idioma: 'limite' }));
  pt('primeiraQuestao', ficha.primeiraQuestao);
  (ficha.resumoAutorizado ?? []).forEach((v, i) => pt(`resumoAutorizado[${i}]`, v));
  pt('resumoCurto', ficha.resumoCurto);
  return saida;
}

/**
 * Confere uma ficha contra o mapa e o conteúdo. Não usa o esquema zod (ver `errosDoEsquema`).
 * Devolve `{ erros, avisos }`.
 */
export function conferirFicha(ficha, n, mapa, aulas) {
  const erros = [];
  const avisos = [];
  const entrada = mapa.aulas.find((e) => e.numero === n);
  if (!entrada) return { erros: [`A Aula ${n} não está no mapa curricular.`], avisos };
  if (typeof ficha !== 'object' || ficha === null) return { erros: ['A ficha não é um objeto JSON.'], avisos };

  const chaves = Object.keys(ficha);
  const faltam = CHAVES_DA_FICHA.filter((c) => !chaves.includes(c));
  const sobram = chaves.filter((c) => !CHAVES_DA_FICHA.includes(c));
  if (faltam.length) erros.push(`faltam as chaves: ${faltam.join(', ')}.`);
  if (sobram.length) erros.push(`chaves que não existem no contrato: ${sobram.join(', ')}.`);
  if (ficha.versao !== 1) erros.push('"versao" precisa ser 1.');
  if (ficha.status !== entrada.status) erros.push(`"status" precisa ser "${entrada.status}", igual ao mapa.`);
  if (ficha.tipo !== entrada.tipo) erros.push(`"tipo" precisa ser "${entrada.tipo}", igual ao mapa.`);

  const todos = textosDaFicha(ficha);
  for (const { campo, texto } of todos) {
    if (texto.includes(TRAVESSAO)) erros.push(`${campo}: tem travessão (U+2014). Use ponto, vírgula ou dois-pontos.`);
    if (texto.includes(MEIA_RISCA)) avisos.push(`${campo}: tem meia-risca (U+2013). Prefira hífen.`);
    for (const { regra, msg } of PROMESSAS_PROIBIDAS) if (regra.test(texto)) erros.push(`${campo}: ${msg}.`);
    if (texto.includes(MARCA_DE_PREENCHER)) erros.push(`${campo}: ainda tem "${MARCA_DE_PREENCHER}".`);
    if (/\bo aluno\b|\ba aluna\b|\bdo aluno\b|\bao aluno\b/i.test(texto)) {
      avisos.push(`${campo}: o prompt é escrito pelo aluno, em primeira pessoa. Troque "o aluno" por "eu" ou "me".`);
    }
    for (const m of texto.matchAll(/\baulas? (\d{1,2})\b/gi)) {
      if (Number(m[1]) > n) erros.push(`${campo}: cita a Aula ${m[1]}, que vem depois. Escreva "mais adiante" ou "nas próximas aulas".`);
    }
  }
  // Orçamento de tamanho (vale também para a ficha pendente, que cabe nele).
  erros.push(...errosDeOrcamento(ficha));
  if (entrada.status === 'pendente') return { erros, avisos };

  // Conteúdo-alvo: condensado em até 4 linhas, só com palavras dos itens do mapa desta aula
  // (apresenta e reutiliza). Na revisão, com palavras de qualquer aula até esta.
  const alvo = Array.isArray(ficha.conteudoAlvo) ? ficha.conteudoAlvo.filter((x) => typeof x === 'string') : [];
  const permitidas = entrada.tipo === 'revisao'
    ? repertorioAte(n, mapa, aulas)
    : palavrasDosItens([...Object.values(entrada.apresenta).flat(), ...entrada.reutiliza]);
  alvo.forEach((linha, i) => {
    const fora = palavras(linha).filter((p) => !permitidas.has(p));
    if (fora.length) {
      erros.push(`conteudoAlvo[${i}]: "${fora.join('", "')}" não está nos itens do mapa desta aula. Use só as palavras dos itens.`);
    }
  });
  if (entrada.tipo !== 'revisao') {
    const cobertas = palavrasDosItens(alvo);
    for (const item of itensDoAlvo(entrada)) {
      const faltam = palavras(item).filter((p) => !cobertas.has(p));
      if (faltam.length) avisos.push(`conteudoAlvo não cobre o item do mapa "${item}" (falta "${faltam.join('", "')}"). Confira se ficou de fora de propósito.`);
    }
  }

  // Expressões fixas: só itens de "expressoesFixas" do mapa (desta aula ou, na revisão, de antes).
  const fixasDoMapa = new Set(
    mapa.aulas
      .filter((e) => (entrada.tipo === 'revisao' ? e.numero <= n : e.numero === n))
      .flatMap((e) => e.apresenta?.expressoesFixas ?? [])
      .map(normalizarItem),
  );
  (Array.isArray(ficha.expressoesFixas) ? ficha.expressoesFixas : []).forEach((x, i) => {
    if (!fixasDoMapa.has(normalizarItem(String(x)))) {
      erros.push(`expressoesFixas[${i}]: "${x}" não está em "expressoesFixas" do mapa. Copie o item do mapa.`);
    }
  });

  // Tipos de exercício: do orçamento (3 ou 4), sem repetir, do mais fácil para o mais difícil.
  const tipos = Array.isArray(ficha.tiposDeExercicio) ? ficha.tiposDeExercicio : [];
  tipos.forEach((t, i) => {
    if (!ORDEM_DOS_TIPOS.includes(t)) erros.push(`tiposDeExercicio: "${t}" não existe.`);
    else if (i > 0 && ORDEM_DOS_TIPOS.indexOf(t) <= ORDEM_DOS_TIPOS.indexOf(tipos[i - 1])) {
      erros.push(`tiposDeExercicio: "${t}" fora da ordem. A ordem é ${ORDEM_DOS_TIPOS.join(', ')}.`);
    }
  });
  const exemplos = Array.isArray(ficha.exemplos) ? ficha.exemplos : [];
  exemplos.forEach((ex, i) => {
    const chavesDoExemplo = Object.keys(ex ?? {}).sort().join(',');
    if (chavesDoExemplo !== 'enunciado,respostaDeReferencia,tipo') {
      erros.push(`exemplos[${i}]: as chaves são tipo, enunciado e respostaDeReferencia.`);
    }
    if (!tipos.includes(ex?.tipo)) erros.push(`exemplos[${i}]: o tipo "${ex?.tipo}" não está em "tiposDeExercicio".`);
  });

  // Primeira questão: em português, com pergunta (o tamanho já passou pelo orçamento).
  const pq = typeof ficha.primeiraQuestao === 'string' ? ficha.primeiraQuestao : '';
  if (!pq.includes('?')) avisos.push('"primeiraQuestao" sem ponto de interrogação. Confira se é mesmo uma pergunta.');

  // Firewall: inglês que o aluno ainda não viu.
  const repertorio = repertorioAte(n, mapa, aulas);
  for (const { campo, texto, idioma } of todos) {
    if (idioma === 'limite') continue; // limites citam de propósito o que NÃO cobrar, inclusive conteúdo futuro
    // Entre aspas num campo em português: só o que é inglês. Palavra portuguesa citada passa.
    const ingles = idioma === 'en' ? [texto] : trechosEntreAspas(texto).filter(ehIngles);
    for (const trecho of ingles) {
      const fora = palavras(trecho).filter((p) => !palavraAutorizada(p, repertorio));
      if (fora.length) {
        erros.push(`${campo}: "${fora.join('", "')}" ainda não apareceu até a Aula ${n}. Troque por repertório autorizado.`);
      }
    }
    if (idioma === 'pt') {
      const soltas = palavras(foraDasAspas(texto)).filter((p) => FUNCIONAIS_INGLESAS.has(p) || p.includes("'"));
      if (soltas.length) erros.push(`${campo}: inglês fora das aspas ("${soltas.join('", "')}"). Ponha o inglês entre aspas.`);
    }
  }
  return { erros, avisos };
}

/** Roda `validarFicha` do pacote 02 e devolve a lista de erros, aceite ele o formato que aceitar. */
export async function errosDoEsquema(ficha) {
  let modulo;
  try {
    modulo = await import(pathToFileURL(noApp('src', 'lib', 'pratica', 'esquema.ts')).href);
  } catch (erro) {
    return [`não consegui carregar src/lib/pratica/esquema.ts (${erro.message}). Rode com "npx tsx".`];
  }
  if (typeof modulo.validarFicha !== 'function') return ['src/lib/pratica/esquema.ts não exporta validarFicha.'];
  try {
    const r = await modulo.validarFicha(ficha);
    if (r && typeof r === 'object' && 'success' in r) {
      return r.success ? [] : r.error.issues.map((x) => `esquema: ${x.path.join('.')}: ${x.message}`);
    }
    if (r && typeof r === 'object' && 'ok' in r) {
      if (r.ok) return [];
      const lista = r.erros ?? r.errors ?? r.erro ?? r.motivo ?? 'ficha inválida';
      return (Array.isArray(lista) ? lista : [lista]).map((x) => `esquema: ${typeof x === 'string' ? x : JSON.stringify(x)}`);
    }
    return r === false || r === null ? ['esquema: ficha inválida'] : [];
  } catch (erro) {
    return [`esquema: ${erro.message}`];
  }
}

function caminhoDaFicha(n) {
  return noApp('content', 'pratica', `aula-${doisDigitos(n)}.json`);
}

async function principal() {
  const mapa = lerJson(caminhoDoMapa());
  if (!mapa) {
    console.error('content/mapa-curricular.json não existe. O pacote 11 precisa terminar antes.');
    process.exit(1);
  }
  const aulas = await carregarAulas();

  const posEsqueleto = process.argv.indexOf('--esqueleto');
  if (posEsqueleto !== -1) {
    const n = numeroDaAula(process.argv[posEsqueleto + 1]);
    const entrada = mapa.aulas.find((e) => e.numero === n);
    if (!entrada) {
      console.error('Uso: node scripts/conteudo/validar-fichas.mjs --esqueleto <número de uma aula que está no mapa>');
      process.exit(1);
    }
    console.log(JSON.stringify(esqueletoDaFicha(entrada), null, 2));
    return;
  }

  const todas = process.argv.includes('--todas');
  const numero = numeroDaAula(process.argv[2]);
  if (!todas && numero === null) {
    console.error('Uso: npx tsx scripts/conteudo/validar-fichas.mjs <número da aula> | --todas');
    process.exit(1);
  }
  const numeros = todas ? aulas.map((a) => a.id).filter((n) => existsSync(caminhoDaFicha(n))) : [numero];
  let totalDeErros = 0;
  for (const n of numeros) {
    acharAula(aulas, n);
    const ficha = lerJson(caminhoDaFicha(n));
    if (!ficha) {
      console.log(`ERRO: Aula ${doisDigitos(n)}: content/pratica/aula-${doisDigitos(n)}.json não existe.`);
      totalDeErros += 1;
      continue;
    }
    const { erros, avisos } = conferirFicha(ficha, n, mapa, aulas);
    erros.push(...(await errosDoEsquema(ficha)));
    erros.forEach((e) => console.log(`ERRO: Aula ${doisDigitos(n)}: ${e}`));
    avisos.forEach((a) => console.log(`AVISO: Aula ${doisDigitos(n)}: ${a}`));
    totalDeErros += erros.length;
  }
  console.log(`${numeros.length} ficha(s), ${totalDeErros} erro(s).`);
  if (totalDeErros > 0) process.exit(1);
}

if (chamadoDireto(import.meta.url)) {
  principal().catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
}
