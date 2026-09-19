/**
 * Confere as tabelas de áudio `content/audio/aula-NN.json` (pacote 12, contrato 01 seção 2.4).
 *
 *   node scripts/conteudo/validar-audios.mjs 2          confere uma aula
 *   node scripts/conteudo/validar-audios.mjs --todas    confere todas as tabelas que existem
 *
 * Imprime "ERRO:" e "AVISO:". Sai com código 1 se houver pelo menos um erro.
 * ERRO bloqueia a entrega. AVISO é para quem fez a aula conferir e anotar no relatório
 * (o revisor, pacote 13, foi cortado no MVP).
 * Neste ciclo, clipe P1 ou P2 é ERRO: a tabela sai só com P0 (PENDENCIAS.md, item 5).
 */
import { existsSync } from 'node:fs';
import {
  acharAula,
  caminhoDoMapa,
  carregarAulas,
  chamadoDireto,
  doisDigitos,
  ehIngles,
  indiceDoMapa,
  itensApresentados,
  lerJson,
  noApp,
  normalizarAncora,
  normalizarItem,
  numeroDaAula,
  textosDoBloco,
  TIPOS_COM_CLIPE_DE_BLOCO,
  tituloDepoisDoPacote10,
  TRAVESSAO,
  tresDigitos,
} from './comum.mjs';
import {
  ehLento,
  PRIORIDADES_DO_CICLO,
  rotuloDoFalante,
  textoParaFala,
  TETO_DE_CLIPES,
} from './ancoras-da-aula.mjs';

const CHAVES_DA_TABELA = ['aula', 'titulo', 'status', 'clips'];
const CHAVES_DO_CLIPE = [
  'id', 'pagina', 'local', 'alvo', 'ancora', 'texto', 'falas', 'categoria', 'voz', 'velocidade',
  'lento', 'prioridade', 'obrigatorio', 'motivo',
];
const CATEGORIAS = [
  'VOCABULARY_PRONUNCIATION', 'GRAMMAR_IN_CONTEXT', 'FIXED_CHUNK', 'DIALOGUE', 'TEXT_LISTENING',
  'PRONUNCIATION_MODEL',
];
const VOZES = ['F1', 'F2', 'M1', 'M2'];
const PRIORIDADES = ['P0', 'P1', 'P2'];

/** Acima disto a aula merece uma conferência atenta (não é erro). */
const AVISO_DE_CLIPES = 25;

/** Escape para repetir um texto já sonorizado: o motivo começa com isto e diz o uso novo. */
const PREFIXO_DE_USO_NOVO = 'USO NOVO:';

function mesmasChaves(objeto, chaves) {
  const tem = Object.keys(objeto).sort().join(',');
  return tem === [...chaves].sort().join(',');
}

/** Lê "Página 3 · rule · b5 · PARA FALAR DE MIM" → `{ pagina: 3, tipo: 'rule', bloco: 5 }`. */
function lerLocal(local) {
  const m = /^Página (\d+) · ([a-z]+) · b(\d+)(?: · .+)?$/.exec(local ?? '');
  return m ? { pagina: Number(m[1]), tipo: m[2], bloco: Number(m[3]) } : null;
}

/**
 * Confere a tabela de uma aula. `tabelasAnteriores` são as tabelas já gravadas das aulas
 * de número menor (para achar texto repetido de uma aula para outra).
 * Devolve `{ erros, avisos }`, cada item uma frase que começa com o id do clipe quando houver.
 */
export function validarTabela(tabela, aula, mapa, tabelasAnteriores = []) {
  const erros = [];
  const avisos = [];
  const entrada = mapa.aulas.find((e) => e.numero === aula.id);
  if (!entrada) return { erros: [`A Aula ${aula.id} não está no mapa curricular.`], avisos };

  if (typeof tabela !== 'object' || tabela === null || !mesmasChaves(tabela, CHAVES_DA_TABELA)) {
    erros.push(`A tabela precisa ter exatamente as chaves ${CHAVES_DA_TABELA.join(', ')}.`);
    return { erros, avisos };
  }
  if (tabela.aula !== aula.id) erros.push(`"aula" é ${tabela.aula}, mas o arquivo é da Aula ${aula.id}.`);
  const titulo = tituloDepoisDoPacote10(aula.title);
  if (tabela.titulo !== titulo) erros.push(`"titulo" precisa ser "${titulo}" (título da aula, sem travessão).`);
  if (tabela.status !== entrada.status) {
    erros.push(`"status" precisa ser "${entrada.status}", igual ao mapa curricular.`);
  }
  if (!Array.isArray(tabela.clips)) {
    erros.push('"clips" precisa ser uma lista.');
    return { erros, avisos };
  }
  if (entrada.status === 'pendente') {
    if (tabela.clips.length > 0) erros.push('Aula pendente não tem clipe: "clips" precisa ser [].');
    return { erros, avisos };
  }

  const anteriores = indiceDoMapa(mapa, aula.id - 1);
  const destaAula = new Set(itensApresentados(entrada).map(normalizarItem));
  const textosDeAulasAnteriores = new Map();
  for (const t of tabelasAnteriores) {
    for (const c of t.clips ?? []) {
      if (c.alvo === 'texto') textosDeAulasAnteriores.set(normalizarItem(c.texto), t.aula);
    }
  }

  const vistos = new Set();
  const textosFalados = new Map();
  tabela.clips.forEach((clipe, i) => {
    const id = clipe?.id ?? `clipe ${i + 1}`;
    const erro = (msg) => erros.push(`${id}: ${msg}`);
    const aviso = (msg) => avisos.push(`${id}: ${msg}`);

    if (typeof clipe !== 'object' || clipe === null || !mesmasChaves(clipe, CHAVES_DO_CLIPE)) {
      erro(`o clipe precisa ter exatamente as chaves ${CHAVES_DO_CLIPE.join(', ')}.`);
      return;
    }
    const idEsperado = `lesson_${tresDigitos(aula.id)}_audio_${tresDigitos(i + 1)}`;
    if (clipe.id !== idEsperado) erro(`o id na posição ${i + 1} precisa ser ${idEsperado}.`);

    // Página, local e bloco
    if (!Number.isInteger(clipe.pagina) || clipe.pagina < 1 || clipe.pagina > aula.pages.length) {
      erro(`"pagina" precisa ser um número de 1 a ${aula.pages.length}.`);
      return;
    }
    const local = lerLocal(clipe.local);
    if (!local) {
      erro('"local" precisa ter o formato "Página N · tipo · bK" (mais " · kicker" em rule e note).');
      return;
    }
    const bloco = aula.pages[clipe.pagina - 1].blocks[local.bloco - 1];
    if (local.pagina !== clipe.pagina) erro(`"local" diz página ${local.pagina}, mas "pagina" é ${clipe.pagina}.`);
    if (!bloco) {
      erro(`a página ${clipe.pagina} não tem o bloco b${local.bloco}.`);
      return;
    }
    if (bloco.t !== local.tipo) erro(`o bloco b${local.bloco} é "${bloco.t}", não "${local.tipo}".`);

    // Âncora: copiada do texto da tela
    if (typeof clipe.ancora !== 'string' || clipe.ancora.includes(TRAVESSAO)) {
      erro('"ancora" precisa ser texto e não pode ter travessão (U+2014). Rode depois do pacote 10.');
      return;
    }
    const textos = textosDoBloco(bloco).map((x) => x.texto);
    if (!textos.some((t) => normalizarAncora(t) === normalizarAncora(clipe.ancora))) {
      erro(`a âncora "${clipe.ancora}" não existe no bloco b${local.bloco}. Copie do conteúdo, não redigite.`);
    } else if (!textos.includes(clipe.ancora)) {
      aviso('a âncora só casa depois da normalização (aspas, apóstrofo ou espaço diferentes). Copie do conteúdo.');
    }
    const chaveDeDuplicata = `${clipe.pagina}|${clipe.alvo}|${normalizarAncora(clipe.ancora)}`;
    if (vistos.has(chaveDeDuplicata)) erro('outro clipe da mesma página já usa esta âncora com o mesmo alvo.');
    vistos.add(chaveDeDuplicata);

    // Alvo, falas e voz
    if (clipe.alvo === 'bloco') {
      if (!TIPOS_COM_CLIPE_DE_BLOCO.has(bloco.t)) erro(`bloco "${bloco.t}" não aceita clipe de bloco.`);
      if (normalizarAncora(clipe.ancora) !== normalizarAncora(textos[0] ?? '')) {
        erro('clipe de bloco ancora no PRIMEIRO texto do bloco.');
      }
    } else if (clipe.alvo !== 'texto') {
      erro('"alvo" precisa ser "texto" ou "bloco".');
    }
    if (Array.isArray(clipe.falas)) {
      if (clipe.falas.length < 2) erro('"falas" com menos de 2 itens: use null e ponha a voz em "voz".');
      if (clipe.alvo !== 'bloco') erro('"falas" só existe em clipe de bloco.');
      if (clipe.voz !== null) erro('com "falas", "voz" precisa ser null.');
      if (clipe.falas.some((f) => !VOZES.includes(f?.voz) || typeof f?.texto !== 'string' || f.texto === '')) {
        erro(`toda fala precisa de "voz" (${VOZES.join(', ')}) e "texto".`);
      } else if (clipe.texto !== clipe.falas.map((f) => f.texto).join('\n')) {
        erro('"texto" precisa ser a junção das falas com "\\n".');
      }
    } else if (clipe.falas === null) {
      if (!VOZES.includes(clipe.voz)) erro(`"voz" precisa ser ${VOZES.join(', ')}.`);
    } else {
      erro('"falas" precisa ser null ou uma lista.');
    }

    // Categoria
    if (!CATEGORIAS.includes(clipe.categoria)) {
      erro(`"categoria" inválida. Use uma de: ${CATEGORIAS.join(', ')}. LISTENING_PRACTICE é de exercício e fica para depois.`);
    }
    if ((clipe.categoria === 'DIALOGUE') !== (bloco.t === 'dialogue')) {
      erro('DIALOGUE é a categoria de todo bloco "dialogue", e só dele.');
    }
    if (bloco.t === 'dialogue') {
      if (clipe.alvo !== 'bloco') erro('diálogo ganha um clipe só, de bloco.');
      const itens = bloco.items ?? [];
      if (!Array.isArray(clipe.falas) || clipe.falas.length !== itens.length) {
        erro(`o diálogo tem ${itens.length} falas na tela; "falas" precisa ter o mesmo número.`);
      } else {
        // Mesma personagem, mesma voz. Personagens diferentes, vozes diferentes.
        const vozDe = new Map();
        itens.forEach((it, k) => {
          const personagem = rotuloDoFalante(it.text) ?? `lado ${it.s}`;
          const voz = clipe.falas[k].voz;
          if (vozDe.has(personagem) && vozDe.get(personagem) !== voz) {
            erro(`a personagem "${personagem}" muda de voz na fala ${k + 1}.`);
          }
          vozDe.set(personagem, voz);
        });
        const vozesUsadas = [...vozDe.values()];
        if (new Set(vozesUsadas).size !== vozesUsadas.length) erro('duas personagens com a mesma voz.');
      }
    }

    // Texto falado
    const falado = typeof clipe.texto === 'string' ? clipe.texto : '';
    if (falado.trim() === '') erro('"texto" vazio.');
    if (falado.includes(TRAVESSAO) || falado.includes(' + ') || falado.includes('→') || falado.includes('___')) {
      erro('"texto" é o que a voz fala: sem travessão, sem " + ", sem "→" e sem "___".');
    }
    if (falado.split('\n').some((linha) => !ehIngles(linha))) erro('"texto" precisa ser só inglês.');
    if (clipe.alvo === 'texto' && falado !== textoParaFala(clipe.ancora, bloco.t)) {
      aviso(`"texto" difere do texto falado calculado ("${textoParaFala(clipe.ancora, bloco.t)}"). Confira.`);
    }

    // Repetição
    const motivo = typeof clipe.motivo === 'string' ? clipe.motivo.trim() : '';
    const usoNovo = motivo.startsWith(PREFIXO_DE_USO_NOVO);
    if (clipe.alvo === 'texto') {
      const chave = normalizarItem(falado);
      if (textosFalados.has(chave) && !usoNovo) {
        erro(`o mesmo texto já tem clipe na página ${textosFalados.get(chave)}.`);
      }
      textosFalados.set(chave, clipe.pagina);
      if (anteriores.has(chave) && !destaAula.has(chave)) {
        const msg = `"${falado}" foi apresentado na Aula ${anteriores.get(chave)}.`;
        if (usoNovo) aviso(`${msg} Uso novo declarado: confira e anote no relatório.`);
        else erro(`${msg} Sem clipe, ou comece o motivo com "${PREFIXO_DE_USO_NOVO}".`);
      } else if (textosDeAulasAnteriores.has(chave) && !usoNovo) {
        aviso(`"${falado}" já tem áudio na Aula ${textosDeAulasAnteriores.get(chave)}.`);
      }
    }

    // Campos simples
    if (clipe.velocidade !== 'natural') erro('"velocidade" é sempre "natural". O botão lento usa "lento".');
    if (typeof clipe.lento !== 'boolean') erro('"lento" precisa ser true ou false.');
    else if (clipe.alvo === 'texto' && clipe.lento !== ehLento(clipe.ancora, clipe.categoria)) {
      aviso(`"lento" deveria ser ${ehLento(clipe.ancora, clipe.categoria)} pela regra do pacote 12.`);
    }
    if (!PRIORIDADES.includes(clipe.prioridade)) erro('"prioridade" precisa ser P0, P1 ou P2.');
    else if (!PRIORIDADES_DO_CICLO.includes(clipe.prioridade)) {
      erro(`${clipe.prioridade} fica pendente neste ciclo (PENDENCIAS.md, item 5): a tabela leva só ${PRIORIDADES_DO_CICLO.join(', ')}. Tire o clipe.`);
    }
    if (clipe.obrigatorio !== (clipe.prioridade !== 'P2')) erro('"obrigatorio" é true em P0 e P1, false em P2.');
    if (motivo === '') erro('"motivo" vazio.');
    if (/REVISAR/.test(motivo)) erro('"motivo" ainda tem "REVISAR". Resolva e reescreva o motivo.');
  });

  const total = tabela.clips.length;
  if (total > TETO_DE_CLIPES) erros.push(`${total} clipes: o teto é ${TETO_DE_CLIPES}.`);
  else if (total > AVISO_DE_CLIPES) avisos.push(`${total} clipes: confira se a tela não ficou poluída.`);
  if (entrada.tipo === 'conteudo' && total < 3) avisos.push(`só ${total} clipes numa aula de conteúdo.`);
  return { erros, avisos };
}

function caminhoDaTabela(numero) {
  return noApp('content', 'audio', `aula-${doisDigitos(numero)}.json`);
}

async function principal() {
  const todas = process.argv.includes('--todas');
  const numero = numeroDaAula(process.argv[2]);
  if (!todas && numero === null) {
    console.error('Uso: node scripts/conteudo/validar-audios.mjs <número da aula> | --todas');
    process.exit(1);
  }
  const aulas = await carregarAulas();
  const mapa = lerJson(caminhoDoMapa());
  if (!mapa) {
    console.error('content/mapa-curricular.json não existe. O pacote 11 precisa terminar antes.');
    process.exit(1);
  }
  const numeros = todas ? aulas.map((a) => a.id).filter((n) => existsSync(caminhoDaTabela(n))) : [numero];
  let totalDeErros = 0;
  let totalDeClipes = 0;
  for (const n of numeros) {
    const tabela = lerJson(caminhoDaTabela(n));
    if (!tabela) {
      console.log(`ERRO: Aula ${doisDigitos(n)}: content/audio/aula-${doisDigitos(n)}.json não existe.`);
      totalDeErros += 1;
      continue;
    }
    const anteriores = aulas
      .filter((a) => a.id < n)
      .map((a) => lerJson(caminhoDaTabela(a.id)))
      .filter(Boolean);
    const { erros, avisos } = validarTabela(tabela, acharAula(aulas, n), mapa, anteriores);
    erros.forEach((e) => console.log(`ERRO: Aula ${doisDigitos(n)}: ${e}`));
    avisos.forEach((a) => console.log(`AVISO: Aula ${doisDigitos(n)}: ${a}`));
    totalDeErros += erros.length;
    totalDeClipes += Array.isArray(tabela.clips) ? tabela.clips.length : 0;
  }
  console.log(`${numeros.length} tabela(s), ${totalDeClipes} clipes, ${totalDeErros} erro(s).`);
  if (totalDeErros > 0) process.exit(1);
}

if (chamadoDireto(import.meta.url)) {
  principal().catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
}
