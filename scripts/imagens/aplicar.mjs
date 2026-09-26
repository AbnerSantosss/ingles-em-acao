/**
 * Liga as imagens geradas às vagas do conteúdo.
 *
 * Para cada vaga decidida em `content/imagens/decisoes/aula-NN.json`:
 *   - com `recortes` ou `caixa`: grava `src` (`/lessons/aulas/aula-NN/<id>.webp`),
 *     `alt` e o tamanho em pixels (`w`, `h`) no objeto da vaga em
 *     `content/course-data.mjs`;
 *   - com `manter`: só acrescenta `w` e `h` da imagem que a vaga já tem;
 *   - com `sem`: não mexe (a vaga segue com o marcador "EM BREVE").
 *
 * A troca é feita no texto do arquivo, dentro do objeto de cada vaga, para
 * não mexer na formatação do resto. Antes de gravar, o script importa a versão
 * nova e confere que só mudaram `src`, `alt`, `w` e `h` das vagas decididas.
 *
 * Uso: node scripts/imagens/aplicar.mjs [--conferir]
 *   --conferir  não grava, só diz o que mudaria.
 * Depois: npx tsx prisma/seed.ts --ressincronizar (banco local).
 */
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { MEIA_RISCA, TRAVESSAO, carregarAulas, noApp } from '../conteudo/comum.mjs';

const ARQUIVO = noApp('content', 'course-data.mjs');
const PASTA_DE_DECISOES = noApp('content', 'imagens', 'decisoes');
const URL_PUBLICA = '/lessons/aulas';
const CAMPOS = ['src', 'alt', 'w', 'h'];
const soConferir = process.argv.includes('--conferir');

/** Posição do fim da string que começa em `i` (aspas simples, duplas ou crase). */
function fimDaString(texto, i) {
  const aspa = texto[i];
  for (let j = i + 1; j < texto.length; j++) {
    if (texto[j] === '\\') j++;
    else if (texto[j] === aspa) return j;
  }
  throw new Error(`string sem fim a partir da posição ${i}`);
}

/** Posição do último caractere do comentário que começa em `i`, ou -1 se não há comentário ali. */
function fimDoComentario(texto, i) {
  if (texto[i] !== '/') return -1;
  if (texto[i + 1] === '/') {
    const fim = texto.indexOf('\n', i);
    return fim === -1 ? texto.length - 1 : fim - 1;
  }
  if (texto[i + 1] === '*') return texto.indexOf('*/', i + 2) + 1;
  return -1;
}

/** Início e fim de todos os objetos `{ ... }` do arquivo, pulando strings e comentários. */
function objetosDoArquivo(texto) {
  const objetos = [];
  const pilha = [];
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    const comentario = fimDoComentario(texto, i);
    if (comentario !== -1) { i = comentario; continue; }
    if (c === '"' || c === "'" || c === '`') { i = fimDaString(texto, i); continue; }
    if (c === '{' || c === '[') pilha.push({ c, i });
    else if (c === '}' || c === ']') {
      const aberto = pilha.pop();
      if (aberto?.c === '{') objetos.push({ inicio: aberto.i, fim: i });
    }
  }
  return objetos;
}

/** O objeto mais interno que contém a posição `pos`. */
function objetoEmVolta(objetos, pos) {
  let achado = null;
  for (const o of objetos) if (o.inicio < pos && o.fim > pos && (!achado || o.inicio > achado.inicio)) achado = o;
  if (!achado) throw new Error(`objeto em volta da posição ${pos} não achado`);
  return achado;
}

/** Posição do `id: "<id>"` da vaga; precisa aparecer uma vez só. */
function posicaoDoId(texto, id) {
  const alvo = `id: "${id}"`;
  const pos = texto.indexOf(alvo);
  if (pos === -1 || texto.indexOf(alvo, pos + 1) !== -1) throw new Error(`${alvo} precisa aparecer uma vez só no arquivo`);
  return pos;
}

/** Aplica as trocas do fim para o começo, juntando as remoções que se sobrepõem. */
function aplicarTrocas(texto, trocas) {
  trocas.sort((a, b) => a.pos - b.pos || a.apagar - b.apagar);
  const juntas = [];
  for (const t of trocas) {
    const ultima = juntas.at(-1);
    if (ultima && t.apagar && ultima.apagar && t.pos < ultima.pos + ultima.apagar) {
      ultima.apagar = Math.max(ultima.apagar, t.pos + t.apagar - ultima.pos);
    } else juntas.push({ ...t });
  }
  // Do fim para o começo, e na mesma posição a remoção antes da inserção.
  juntas.sort((a, b) => b.pos - a.pos || b.apagar - a.apagar);
  for (const t of juntas) texto = texto.slice(0, t.pos) + t.texto + texto.slice(t.pos + t.apagar);
  return texto;
}

/** Chaves de primeiro nível do objeto, com o trecho `chave: valor, ` de cada uma. */
function chavesDoObjeto(texto, { inicio, fim }) {
  const chaves = [];
  let profundidade = 0;
  for (let i = inicio + 1; i < fim; i++) {
    const c = texto[i];
    const comentario = fimDoComentario(texto, i);
    if (comentario !== -1) { i = comentario; continue; }
    if (c === '"' || c === "'" || c === '`') { i = fimDaString(texto, i); continue; }
    if (c === '{' || c === '[') profundidade++;
    else if (c === '}' || c === ']') profundidade--;
    else if (profundidade === 0) {
      const m = /^([A-Za-z_]\w*)\s*:\s*/.exec(texto.slice(i, i + 40));
      if (m && /[\s{,]/.test(texto[i - 1])) {
        const valorInicio = i + m[0].length;
        let valorFim;
        const v = texto[valorInicio];
        if (v === '{' || v === '[') { i = valorInicio - 1; continue; }
        if (v === '"' || v === "'" || v === '`') valorFim = fimDaString(texto, valorInicio) + 1;
        else valorFim = valorInicio + /^[^,}\]]*/.exec(texto.slice(valorInicio))[0].trimEnd().length;
        let trechoFim = valorFim;
        const resto = /^\s*,\s*/.exec(texto.slice(valorFim));
        if (resto) trechoFim += resto[0].length;
        chaves.push({ chave: m[1], inicio: i, valorInicio, valorFim, trechoFim });
        i = valorFim - 1;
      }
    }
  }
  return chaves;
}

async function tamanho(caminhoPublico) {
  const arquivo = noApp('public', ...caminhoPublico.replace(/^\//, '').split('/'));
  if (!existsSync(arquivo)) throw new Error(`arquivo não existe: public${caminhoPublico}`);
  const { width, height } = await sharp(arquivo).metadata();
  return { w: width, h: height };
}

function semTravessao(texto) {
  return !texto.includes(TRAVESSAO) && !texto.includes(MEIA_RISCA);
}

const aulas = await carregarAulas();
const vagasPorId = new Map();
for (const aula of aulas) {
  aula.pages.forEach((pagina) => pagina.blocks.forEach((bloco) => {
    const guardar = (obj) => { if (obj && typeof obj.ph === 'string') vagasPorId.set(obj.id, { aula: aula.id, obj }); };
    guardar(bloco);
    for (const chave of ['items', 'steps', 'cards']) if (Array.isArray(bloco[chave])) bloco[chave].forEach(guardar);
  }));
}

const mudancas = new Map();
const erros = [];
const arquivosDeDecisao = existsSync(PASTA_DE_DECISOES)
  ? readdirSync(PASTA_DE_DECISOES).filter((n) => /^aula-\d{2}\.json$/.test(n)).sort()
  : [];
for (const nome of arquivosDeDecisao) {
  const numero = Number(nome.slice(5, 7));
  const { vagas } = JSON.parse(readFileSync(`${PASTA_DE_DECISOES}/${nome}`, 'utf8'));
  for (const [id, d] of Object.entries(vagas)) {
    const vaga = vagasPorId.get(id);
    if (!vaga || vaga.aula !== numero) { erros.push(`${nome}: ${id} não é vaga da Aula ${numero}`); continue; }
    if (d.sem) continue;
    try {
      if (d.manter) {
        if (!vaga.obj.src) throw new Error('"manter" numa vaga sem imagem');
        mudancas.set(id, { src: vaga.obj.src, alt: vaga.obj.alt, ...(await tamanho(vaga.obj.src)) });
      } else {
        if (!semTravessao(d.alt)) throw new Error('o alt tem travessão ou meia-risca');
        const src = `${URL_PUBLICA}/aula-${String(numero).padStart(2, '0')}/${id}.webp`;
        mudancas.set(id, { src, alt: d.alt.trim(), ...(await tamanho(src)) });
      }
    } catch (e) {
      erros.push(`${nome}: ${id}: ${e.message}`);
    }
  }
}
if (erros.length) {
  console.error(`Nada gravado. ${erros.length} erro(s):\n${erros.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}

let texto = readFileSync(ARQUIVO, 'utf8');

// 1ª passada: tira `src`, `alt`, `w` e `h` que as vagas já tenham.
let objetos = objetosDoArquivo(texto);
const remocoes = [];
for (const id of mudancas.keys()) {
  const objeto = objetoEmVolta(objetos, posicaoDoId(texto, id));
  for (const c of chavesDoObjeto(texto, objeto).filter((k) => CAMPOS.includes(k.chave))) {
    // Sem vírgula depois, o campo é o último: leva junto a vírgula de antes.
    const inicio = c.trechoFim > c.valorFim ? c.inicio : texto.lastIndexOf(',', c.inicio);
    remocoes.push({ pos: inicio, apagar: c.trechoFim - inicio, texto: '' });
  }
}
texto = aplicarTrocas(texto, remocoes);

// 2ª passada: grava os campos novos logo depois do `id`.
objetos = objetosDoArquivo(texto);
const insercoes = [];
for (const [id, novo] of mudancas) {
  const objeto = objetoEmVolta(objetos, posicaoDoId(texto, id));
  const idChave = chavesDoObjeto(texto, objeto).find((c) => c.chave === 'id');
  const campos = [
    `src: ${JSON.stringify(novo.src)}`,
    ...(novo.alt ? [`alt: ${JSON.stringify(novo.alt)}`] : []),
    `w: ${novo.w}, h: ${novo.h}`,
  ];
  if (idChave.trechoFim > idChave.valorFim) {
    // O `id` tem vírgula depois: os campos entram antes da próxima chave, no
    // mesmo estilo do objeto (uma chave por linha ou tudo numa linha só).
    const separador = texto.slice(idChave.valorFim, idChave.trechoFim);
    const quebra = separador.includes('\n') ? `,${separador.slice(separador.indexOf('\n'))}` : ', ';
    insercoes.push({ pos: idChave.trechoFim, apagar: 0, texto: campos.join(quebra) + quebra });
  } else insercoes.push({ pos: idChave.valorFim, apagar: 0, texto: `, ${campos.join(', ')}` });
}
texto = aplicarTrocas(texto, insercoes);

const provisorio = noApp('content', '.course-data.conferencia.mjs');
writeFileSync(provisorio, texto);
let novas;
try {
  novas = (await import(`${pathToFileURL(provisorio).href}?t=${process.hrtime.bigint()}`)).LESSONS;
} finally {
  rmSync(provisorio, { force: true });
}

const limpar = (lista) => JSON.parse(JSON.stringify(lista), (chave, valor) => {
  if (valor && typeof valor === 'object' && !Array.isArray(valor) && mudancas.has(valor.id)) {
    const copia = { ...valor };
    for (const c of CAMPOS) delete copia[c];
    return copia;
  }
  return valor;
});
if (!isDeepStrictEqual(limpar(aulas), limpar(novas))) throw new Error('a troca mexeu em algo além de src/alt/w/h; nada gravado');
const conferir = new Map();
for (const aula of novas) aula.pages.forEach((p) => p.blocks.forEach((b) => {
  const ver = (o) => { if (o && mudancas.has(o.id)) conferir.set(o.id, o); };
  ver(b);
  for (const chave of ['items', 'steps', 'cards']) if (Array.isArray(b[chave])) b[chave].forEach(ver);
}));
for (const [id, novo] of mudancas) {
  const o = conferir.get(id);
  if (!o || o.src !== novo.src || o.w !== novo.w || o.h !== novo.h || (novo.alt && o.alt !== novo.alt)) {
    throw new Error(`${id}: a versão nova não ficou com src/alt/w/h certos; nada gravado`);
  }
}

const novasImagens = [...mudancas.values()].filter((m) => m.src.startsWith(`${URL_PUBLICA}/`)).length;
console.log(`${mudancas.size} vagas com imagem (${novasImagens} novas, ${mudancas.size - novasImagens} mantidas) em ${arquivosDeDecisao.length} aula(s).`);
if (soConferir) console.log('--conferir: nada gravado.');
else {
  writeFileSync(ARQUIVO, texto);
  console.log('content/course-data.mjs gravado. Próximo passo: npx tsx prisma/seed.ts --ressincronizar (banco local).');
}
