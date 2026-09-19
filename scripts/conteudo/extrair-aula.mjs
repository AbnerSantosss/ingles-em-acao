/**
 * Mostra uma aula de `content/course-data.mjs` do jeito que o pacote 11 precisa para montar
 * a entrada do mapa curricular. Só lê. Não grava nada.
 *
 *   node scripts/conteudo/extrair-aula.mjs 2
 *
 * Para cada página: cada bloco com o número (b1, b2...), o tipo e o JSON completo do bloco.
 * Blocos que recebem áudio mostram também cada texto ancorável, com a marca:
 *   [EN]      texto em inglês (pela heurística)
 *   [--]      texto que não é inglês
 *   [Aula N]  item que o mapa já registrou na Aula N (vai para "reutiliza", nunca para "apresenta")
 * Depois das páginas: as palavras em inglês dos blocos de ensino, separadas em "novas" e
 * "já apresentadas". No fim: o esqueleto da entrada, para copiar e completar.
 */
import {
  acharAula,
  AULA_PENDENTE,
  AULAS_DE_REVISAO,
  BLOCOS_QUE_NAO_ENSINAM,
  caminhoDoMapa,
  carregarAulas,
  chamadoDireto,
  blocosEmIngles,
  doisDigitos,
  ehIngles,
  indiceDoMapa,
  itensApresentados,
  lerJson,
  normalizarItem,
  numeroDaAula,
  palavras,
  textosDoBloco,
  TIPOS_ANCORAVEIS,
  tituloDepoisDoPacote10,
} from './comum.mjs';

/** Campos que guardam cor, tipo ou número de layout, nunca texto de aula. */
const CAMPOS_DE_LAYOUT = new Set(['v', 'c', 'n', 'cols', 'bar', 'bold']);

/**
 * Todas as strings de um bloco, em QUALQUER campo (não só os que recebem áudio), quebradas
 * em linhas e em partes separadas por " · ". `t` só é pulado no primeiro nível (tipo do bloco):
 * dentro de `chips`, `items[].t` é o texto do chip.
 */
export function textosDeTodosOsCampos(valor, primeiroNivel = true, saida = []) {
  if (typeof valor === 'string') {
    for (const linha of valor.split('\n')) {
      for (const parte of linha.split(' · ')) if (parte.trim() !== '') saida.push(parte.trim());
    }
  } else if (Array.isArray(valor)) {
    valor.forEach((v) => textosDeTodosOsCampos(v, false, saida));
  } else if (valor && typeof valor === 'object') {
    for (const [chave, v] of Object.entries(valor)) {
      if (CAMPOS_DE_LAYOUT.has(chave) || (primeiroNivel && chave === 't')) continue;
      textosDeTodosOsCampos(v, false, saida);
    }
  }
  return saida;
}

/**
 * Palavras em inglês dos blocos de ensino da aula, comparadas com o mapa das aulas anteriores.
 * Devolve três mapas: `novas` (palavra → primeira página), `jaApresentadas` (palavra → aula
 * de origem, quando a palavra é um item sozinha) e `dentroDeItem` (palavra → { item, aula },
 * quando ela só aparece dentro de um item maior, como "tower" em "the Eiffel Tower").
 * É um ponto de partida. Quem decide o item e a categoria é o agente, com a seção 4.3 do pacote 11.
 */
export function palavrasDaAula(aula, mapa) {
  const sozinhas = new Map();
  const dentro = new Map();
  for (const entrada of mapa?.aulas ?? []) {
    if (entrada.numero >= aula.id) continue;
    for (const item of itensApresentados(entrada)) {
      const ps = palavras(normalizarItem(item));
      if (ps.length === 1) {
        if (!sozinhas.has(ps[0])) sozinhas.set(ps[0], entrada.numero);
      } else {
        for (const p of ps) if (!dentro.has(p)) dentro.set(p, { item, aula: entrada.numero });
      }
    }
  }
  const novas = new Map();
  const jaApresentadas = new Map();
  const dentroDeItem = new Map();
  aula.pages.forEach((pagina, pi) => {
    pagina.blocks.forEach((bloco) => {
      if (BLOCOS_QUE_NAO_ENSINAM.has(bloco.t)) return;
      for (const texto of textosDeTodosOsCampos(bloco)) {
        if (!ehIngles(texto)) continue;
        for (const p of palavras(texto)) {
          if (sozinhas.has(p)) {
            if (!jaApresentadas.has(p)) jaApresentadas.set(p, sozinhas.get(p));
          } else if (dentro.has(p)) {
            if (!dentroDeItem.has(p)) dentroDeItem.set(p, dentro.get(p));
          } else if (!novas.has(p)) {
            novas.set(p, pi + 1);
          }
        }
      }
    });
  });
  return { novas, jaApresentadas, dentroDeItem };
}

/** Esqueleto da entrada do mapa para a aula, com `apresenta` e `reutiliza` vazios para preencher. */
export function esqueletoDaEntrada(aula) {
  const pendente = aula.id === AULA_PENDENTE;
  const entrada = {
    numero: aula.id,
    titulo: tituloDepoisDoPacote10(aula.title),
    tipo: AULAS_DE_REVISAO.includes(aula.id) ? 'revisao' : 'conteudo',
    status: pendente ? 'pendente' : 'pronta',
    apresenta: { vocabulario: [], estruturas: [], expressoesFixas: [], pronuncia: [] },
    reutiliza: [],
    textosEmIngles: pendente ? [] : blocosEmIngles(aula),
  };
  if (pendente) entrada.nota = 'Conteúdo da aula pendente com o dono do produto. Não entra na prática nem no áudio.';
  return entrada;
}

async function principal() {
  const numero = numeroDaAula(process.argv[2]);
  if (numero === null) {
    console.error('Uso: node scripts/conteudo/extrair-aula.mjs <número da aula de 1 a 42>');
    process.exit(1);
  }
  const aula = acharAula(await carregarAulas(), numero);
  const mapa = lerJson(caminhoDoMapa());
  const jaNoMapa = mapa ? indiceDoMapa(mapa, numero - 1) : new Map();
  const esqueleto = esqueletoDaEntrada(aula);

  console.log(`AULA ${doisDigitos(numero)} · ${esqueleto.titulo} · ${aula.pages.length} páginas`);
  console.log(`tipo: ${esqueleto.tipo} · status: ${esqueleto.status}`);
  if (!mapa) console.log('(content/mapa-curricular.json ainda não existe: nenhuma marca [Aula N])');

  aula.pages.forEach((pagina, pi) => {
    console.log(`\n==================== Página ${pi + 1} ====================`);
    pagina.blocks.forEach((bloco, bi) => {
      const papel = BLOCOS_QUE_NAO_ENSINAM.has(bloco.t) ? ' (exercício ou navegação: não ensina)' : '';
      console.log(`\nb${bi + 1} ${bloco.t}${papel}`);
      console.log(`   ${JSON.stringify(bloco)}`);
      if (!TIPOS_ANCORAVEIS.has(bloco.t)) return;
      for (const x of textosDoBloco(bloco)) {
        const marca = ehIngles(x.texto) ? 'EN' : '--';
        const origem = jaNoMapa.get(normalizarItem(x.texto));
        const antes = origem ? ` [Aula ${origem}]` : '';
        console.log(`   [${marca}]${antes} ${x.campo}: ${JSON.stringify(x.texto)}`);
      }
    });
  });

  const { novas, jaApresentadas, dentroDeItem } = palavrasDaAula(aula, mapa);
  const listar = (m, f) => (m.size ? [...m].map(f).join(', ') : '(nenhuma)');
  console.log('\n==================== Palavras em inglês dos blocos de ensino ====================');
  console.log('Confira cada uma com a seção 4.3 do pacote 11. Palavra portuguesa em caixa alta pode aparecer aqui: ignore.');
  console.log(`\nNOVAS (nenhuma aula anterior do mapa tem):\n  ${listar(novas, ([p, pg]) => `${p} (p${pg})`)}`);
  console.log(`\nJÁ APRESENTADAS (candidatas a "reutiliza"):\n  ${listar(jaApresentadas, ([p, n]) => `${p} (Aula ${n})`)}`);
  console.log(`\nDENTRO DE UM ITEM ANTERIOR (não repita o item):\n  ${listar(dentroDeItem, ([p, x]) => `${p} ("${x.item}", Aula ${x.aula})`)}`);

  console.log('\n==================== Esqueleto da entrada (copie e complete) ====================');
  console.log(JSON.stringify(esqueleto, null, 2));
}

if (chamadoDireto(import.meta.url)) {
  principal().catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
}
