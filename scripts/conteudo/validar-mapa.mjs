/**
 * Confere `content/mapa-curricular.json` (pacote 11).
 *
 *   node scripts/conteudo/validar-mapa.mjs             exige as 42 aulas
 *   node scripts/conteudo/validar-mapa.mjs --parcial   aceita só as primeiras aulas (durante o trabalho)
 *
 * Imprime "ERRO:" e "AVISO:". Sai com código 1 se houver pelo menos um erro.
 */
import {
  acharAula,
  AULA_PENDENTE,
  AULAS_DE_REVISAO,
  caminhoDoMapa,
  carregarAulas,
  CATEGORIAS_DO_MAPA,
  chamadoDireto,
  blocosEmIngles,
  ehIngles,
  lerJson,
  MEIA_RISCA,
  normalizarItem,
  tipoDeTextoDoBloco,
  TIPOS_ANCORAVEIS,
  tituloDepoisDoPacote10,
  TRAVESSAO,
} from './comum.mjs';

const CHAVES_DA_AULA = ['numero', 'titulo', 'tipo', 'status', 'apresenta', 'reutiliza', 'textosEmIngles'];
const TIPOS_DE_TEXTO = ['dialogo', 'texto', 'exemplo', 'lista'];
const TAMANHO_MAXIMO_DO_ITEM = 60;

function chavesCertas(objeto, obrigatorias, opcionais = []) {
  const chaves = Object.keys(objeto);
  return obrigatorias.every((c) => chaves.includes(c)) && chaves.every((c) => obrigatorias.includes(c) || opcionais.includes(c));
}

/** Problema de um item de `apresenta` ou `reutiliza`. `null` se o item está bom. */
function problemaDoItem(item) {
  if (typeof item !== 'string' || item.trim() === '') return 'item vazio ou que não é texto';
  if (item !== item.trim()) return 'espaço sobrando no começo ou no fim';
  if (item.includes(TRAVESSAO)) return 'tem travessão (U+2014)';
  if (item.includes(MEIA_RISCA)) return 'tem meia-risca (U+2013)';
  if (item.length > TAMANHO_MAXIMO_DO_ITEM) return `passa de ${TAMANHO_MAXIMO_DO_ITEM} caracteres: quebre em itens menores`;
  if (/[‘’“”]/.test(item)) return 'use apóstrofo reto (\') e aspas retas';
  if (!ehIngles(item)) {
    return 'parece português: o mapa só tem inglês';
  }
  return null;
}

/**
 * Confere o mapa inteiro contra as aulas de `course-data.mjs`.
 * Devolve `{ erros, avisos }`.
 */
export function validarMapa(mapa, aulas, { parcial = false } = {}) {
  const erros = [];
  const avisos = [];
  if (typeof mapa !== 'object' || mapa === null || !chavesCertas(mapa, ['versao', 'aulas'])) {
    return { erros: ['O arquivo precisa ser { "versao": 1, "aulas": [...] }, sem outras chaves.'], avisos };
  }
  if (mapa.versao !== 1) erros.push('"versao" precisa ser 1.');
  if (!Array.isArray(mapa.aulas)) return { erros: [...erros, '"aulas" precisa ser uma lista.'], avisos };
  if (!parcial && mapa.aulas.length !== 42) erros.push(`O mapa tem ${mapa.aulas.length} aulas. Precisa ter 42.`);

  const primeiraVez = new Map(); // chave normalizada → número da aula
  mapa.aulas.forEach((entrada, i) => {
    const n = i + 1;
    const erro = (msg) => erros.push(`Aula ${n}: ${msg}`);
    const aviso = (msg) => avisos.push(`Aula ${n}: ${msg}`);
    if (typeof entrada !== 'object' || entrada === null || !chavesCertas(entrada, CHAVES_DA_AULA, ['nota'])) {
      erro(`a entrada precisa ter as chaves ${CHAVES_DA_AULA.join(', ')} (e "nota", opcional).`);
      return;
    }
    if (entrada.numero !== n) erro(`"numero" é ${entrada.numero}. As aulas vão em ordem: aqui precisa ser ${n}.`);
    const aula = aulas.find((a) => a.id === n);
    if (!aula) {
      erro('não existe em content/course-data.mjs.');
      return;
    }
    const titulo = tituloDepoisDoPacote10(aula.title);
    if (entrada.titulo !== titulo) erro(`"titulo" precisa ser "${titulo}".`);

    const revisao = AULAS_DE_REVISAO.includes(n);
    if (entrada.tipo !== (revisao ? 'revisao' : 'conteudo')) {
      erro(`"tipo" precisa ser "${revisao ? 'revisao' : 'conteudo'}".`);
    }
    const pendente = n === AULA_PENDENTE;
    if (entrada.status !== (pendente ? 'pendente' : 'pronta')) {
      erro(`"status" precisa ser "${pendente ? 'pendente' : 'pronta'}".`);
    }
    if ('nota' in entrada && (typeof entrada.nota !== 'string' || entrada.nota.trim() === '')) {
      erro('"nota", quando existe, é um texto não vazio.');
    }

    const apresenta = entrada.apresenta;
    if (typeof apresenta !== 'object' || apresenta === null || !chavesCertas(apresenta, CATEGORIAS_DO_MAPA)) {
      erro(`"apresenta" precisa ter exatamente ${CATEGORIAS_DO_MAPA.join(', ')}.`);
      return;
    }
    if (!CATEGORIAS_DO_MAPA.every((c) => Array.isArray(apresenta[c]))) {
      erro('cada categoria de "apresenta" é uma lista (pode ser vazia).');
      return;
    }
    if (!Array.isArray(entrada.reutiliza) || !Array.isArray(entrada.textosEmIngles)) {
      erro('"reutiliza" e "textosEmIngles" são listas.');
      return;
    }

    if (pendente) {
      const vazio = CATEGORIAS_DO_MAPA.every((c) => apresenta[c].length === 0)
        && entrada.reutiliza.length === 0 && entrada.textosEmIngles.length === 0;
      if (!vazio) erro('aula pendente fica com "apresenta", "reutiliza" e "textosEmIngles" vazios.');
      if (!entrada.nota) erro('aula pendente precisa de "nota" explicando a pendência.');
      return;
    }

    // apresenta: primeira vez no curso
    let total = 0;
    for (const categoria of CATEGORIAS_DO_MAPA) {
      for (const item of apresenta[categoria]) {
        total += 1;
        const problema = problemaDoItem(item);
        if (problema) erro(`${categoria} "${item}": ${problema}.`);
        const chave = normalizarItem(String(item));
        if (primeiraVez.has(chave)) {
          erro(`${categoria} "${item}" já foi apresentado na Aula ${primeiraVez.get(chave)}. Ponha em "reutiliza".`);
        } else {
          primeiraVez.set(chave, n);
        }
      }
    }
    if (revisao && total > 0) erro('aula de revisão não apresenta nada novo: "apresenta" fica vazio.');
    if (!revisao && total === 0) aviso('aula de conteúdo sem nada em "apresenta". Confira.');

    // reutiliza: só o que já apareceu antes
    entrada.reutiliza.forEach((item) => {
      const problema = problemaDoItem(item);
      if (problema) erro(`reutiliza "${item}": ${problema}.`);
      const deOnde = primeiraVez.get(normalizarItem(String(item)));
      if (deOnde === undefined || deOnde >= n) {
        erro(`reutiliza "${item}" não foi apresentado em nenhuma aula anterior. Use o texto igual ao da aula de origem.`);
      }
    });
    if (revisao && entrada.reutiliza.length === 0) erro('aula de revisão lista em "reutiliza" o que ela revisa.');

    // textosEmIngles: blocos reais, na ordem, com o tipo calculado
    const esperados = blocosEmIngles(aula);
    const vistos = new Set();
    let anterior = 0;
    entrada.textosEmIngles.forEach((t) => {
      if (typeof t !== 'object' || t === null || !chavesCertas(t, ['pagina', 'bloco', 'tipoDeTexto'])) {
        erro('cada item de "textosEmIngles" é { "pagina", "bloco", "tipoDeTexto" }.');
        return;
      }
      const onde = `página ${t.pagina}, bloco ${t.bloco}`;
      const bloco = aula.pages[t.pagina - 1]?.blocks[t.bloco - 1];
      if (!bloco) {
        erro(`textosEmIngles: ${onde} não existe.`);
        return;
      }
      if (!TIPOS_ANCORAVEIS.has(bloco.t)) erro(`textosEmIngles: ${onde} é "${bloco.t}", que não recebe áudio.`);
      if (!TIPOS_DE_TEXTO.includes(t.tipoDeTexto)) erro(`textosEmIngles: ${onde}: tipoDeTexto inválido.`);
      else if (t.tipoDeTexto !== tipoDeTextoDoBloco(bloco)) {
        erro(`textosEmIngles: ${onde}: tipoDeTexto precisa ser "${tipoDeTextoDoBloco(bloco)}".`);
      }
      const posicao = t.pagina * 1000 + t.bloco;
      if (posicao <= anterior) erro(`textosEmIngles: ${onde} fora de ordem ou repetido.`);
      anterior = posicao;
      vistos.add(`${t.pagina}.${t.bloco}`);
      if (!esperados.some((e) => e.pagina === t.pagina && e.bloco === t.bloco)) {
        aviso(`textosEmIngles: ${onde} não tem texto em inglês pela heurística. Confira se é mesmo inglês.`);
      }
    });
    esperados
      .filter((e) => !vistos.has(`${e.pagina}.${e.bloco}`))
      .forEach((e) => aviso(`textosEmIngles: página ${e.pagina}, bloco ${e.bloco} tem inglês e não está na lista. Confira.`));
  });
  return { erros, avisos };
}

async function principal() {
  const parcial = process.argv.includes('--parcial');
  const mapa = lerJson(caminhoDoMapa());
  if (!mapa) {
    console.error('content/mapa-curricular.json não existe.');
    process.exit(1);
  }
  const aulas = await carregarAulas();
  acharAula(aulas, 42); // garante que o course-data tem as 42 aulas
  const { erros, avisos } = validarMapa(mapa, aulas, { parcial });
  erros.forEach((e) => console.log(`ERRO: ${e}`));
  avisos.forEach((a) => console.log(`AVISO: ${a}`));
  const itens = (mapa.aulas ?? []).reduce(
    (soma, e) => soma + CATEGORIAS_DO_MAPA.reduce((s, c) => s + (e.apresenta?.[c]?.length ?? 0), 0),
    0,
  );
  console.log(`${mapa.aulas?.length ?? 0} aulas, ${itens} itens apresentados, ${erros.length} erro(s), ${avisos.length} aviso(s).`);
  if (erros.length > 0) process.exit(1);
}

if (chamadoDireto(import.meta.url)) {
  principal().catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
}
