/**
 * Inventário das vagas de imagem das 42 aulas, para o casamento com os
 * recortes do e-book (`Páginas do App/Aulas/Aula_NN/fotos_cortadas`).
 *
 * Vaga é todo objeto do conteúdo que tem `ph` (a descrição da cena): blocos
 * `image` e `profile` e itens de `cards` e `steps`. Cada vaga sai com o
 * contexto da página (título e um resumo do texto) para quem for escolher o
 * recorte saber onde ela aparece.
 *
 * Uso: node scripts/imagens/vagas.mjs
 * Saída: var/imagens/vagas.json (a pasta var/ não vai para o git).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { carregarAulas, noApp } from '../conteudo/comum.mjs';

const CAMPOS_DE_TEXTO = ['en', 'pt', 'text', 'label', 'title', 'tag', 'q', 'a', 'v'];

function textoDoBloco(bloco) {
  const partes = [];
  const visitar = (valor, chave) => {
    if (typeof valor === 'string') {
      if (CAMPOS_DE_TEXTO.includes(chave) || chave === 'lines') partes.push(valor);
    } else if (Array.isArray(valor)) {
      for (const v of valor) visitar(v, chave);
    } else if (valor && typeof valor === 'object') {
      for (const [k, v] of Object.entries(valor)) if (k !== 'ph' && k !== 'alt') visitar(v, k);
    }
  };
  visitar(bloco, '');
  return partes.join(' · ').replace(/\s+/g, ' ');
}

function vagasDoBloco(bloco, indice) {
  const vagas = [];
  if (typeof bloco.ph === 'string') {
    vagas.push({ id: bloco.id, tipo: bloco.t, bloco: indice, item: null, ph: bloco.ph, src: bloco.src ?? null, alt: bloco.alt ?? null, contexto: textoDoBloco(bloco).slice(0, 160) });
  }
  for (const chave of ['items', 'steps', 'cards']) {
    if (!Array.isArray(bloco[chave])) continue;
    bloco[chave].forEach((item, i) => {
      if (item && typeof item === 'object' && typeof item.ph === 'string') {
        vagas.push({
          id: item.id, tipo: bloco.t, bloco: indice, item: i, colunas: bloco.cols ?? null,
          ph: item.ph, src: item.src ?? null, alt: item.alt ?? null,
          contexto: textoDoBloco(item).slice(0, 160),
        });
      }
    });
  }
  return vagas;
}

const aulas = await carregarAulas();
const saida = aulas.map((aula) => ({
  aula: aula.id,
  titulo: aula.title,
  paginas: aula.pages.map((pagina, p) => {
    const vagas = pagina.blocks.flatMap((b, i) => vagasDoBloco(b, i));
    return {
      pagina: p + 1,
      resumo: pagina.blocks.map(textoDoBloco).filter(Boolean).join(' | ').slice(0, 500),
      vagas,
    };
  }),
}));

const ids = new Map();
for (const a of saida) for (const p of a.paginas) for (const v of p.vagas) {
  if (!v.id) console.warn(`Aula ${a.aula} página ${p.pagina}: vaga sem id (${v.tipo}).`);
  ids.set(v.id, (ids.get(v.id) ?? 0) + 1);
}
const repetidos = [...ids].filter(([, n]) => n > 1).map(([id]) => id);
if (repetidos.length) console.warn(`ids repetidos: ${repetidos.join(', ')}`);

mkdirSync(noApp('var', 'imagens'), { recursive: true });
writeFileSync(noApp('var', 'imagens', 'vagas.json'), JSON.stringify(saida, null, 1));
const total = saida.reduce((n, a) => n + a.paginas.reduce((m, p) => m + p.vagas.length, 0), 0);
console.log(`${total} vagas em ${saida.length} aulas → var/imagens/vagas.json`);
