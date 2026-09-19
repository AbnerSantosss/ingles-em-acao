/**
 * Fichas de prática e tabelas de áudio (pacote 12) contra o conteúdo real. Não usa o banco.
 * Confere todo arquivo que existe em content/pratica/ e content/audio/ (fora de gerado/).
 *
 * A conferência das âncoras usa `textosAncoraveisDaPagina` dos scripts (tabela 2.2 do
 * contrato 01). A conferência pelo lado do app (`textos-da-pagina.ts`, pacote 08) fica para
 * quando o 08 estiver pronto.
 */
import { existsSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

import { normalizarAncora } from '@/lib/audio/ancora';
import { validarFicha } from '@/lib/pratica/esquema';
import {
  carregarAulas,
  caminhoDoMapa,
  doisDigitos,
  lerJson,
  noApp,
  textosAncoraveisDaPagina,
} from '../../scripts/conteudo/comum.mjs';
import { validarTabela } from '../../scripts/conteudo/validar-audios.mjs';
import { conferirFicha } from '../../scripts/conteudo/validar-fichas.mjs';

type Aula = { id: number; title: string; pages: { blocks: unknown[] }[] };
type Clip = { id: string; pagina: number; ancora: string; prioridade: string };
type Tabela = { aula: number; clips: Clip[] };

let aulas: Aula[];
let mapa: unknown;
const numeros = Array.from({ length: 42 }, (_, i) => i + 1);
const caminhoDaFicha = (n: number) => noApp('content', 'pratica', `aula-${doisDigitos(n)}.json`);
const caminhoDaTabela = (n: number) => noApp('content', 'audio', `aula-${doisDigitos(n)}.json`);

beforeAll(async () => {
  aulas = (await carregarAulas()) as Aula[];
  mapa = lerJson(caminhoDoMapa());
});

describe('fichas de prática', () => {
  for (const n of numeros) {
    it.runIf(existsSync(caminhoDaFicha(n)))(`Aula ${doisDigitos(n)}: esquema e conteúdo`, () => {
      const ficha = lerJson(caminhoDaFicha(n));
      const r = validarFicha(ficha);
      expect(r.ok ? [] : r.erros).toEqual([]);
      const { erros } = conferirFicha(ficha, n, mapa, aulas);
      expect(erros).toEqual([]);
    });
  }

  // Contrato 01, seção 10.8: a Aula 05 continua pendente, sem ficha.
  it('a Aula 05 não tem ficha', () => {
    expect(existsSync(caminhoDaFicha(5))).toBe(false);
  });
});

describe('tabelas de áudio', () => {
  for (const n of numeros) {
    it.runIf(existsSync(caminhoDaTabela(n)))(`Aula ${doisDigitos(n)}: validador e âncoras na tela`, () => {
      const tabela = lerJson(caminhoDaTabela(n)) as Tabela;
      const anteriores = numeros
        .filter((m) => m < n && existsSync(caminhoDaTabela(m)))
        .map((m) => lerJson(caminhoDaTabela(m)));
      const aula = aulas.find((a) => a.id === n)!;
      const { erros } = validarTabela(tabela, aula, mapa, anteriores);
      expect(erros).toEqual([]);

      // Corte do MVP (PENDENCIAS.md, item 5): só P0.
      expect(tabela.clips.filter((c) => c.prioridade !== 'P0').map((c) => c.id)).toEqual([]);

      // A âncora precisa estar entre os textos ancoráveis que a página mostra.
      for (const clip of tabela.clips) {
        const pagina = aula.pages[clip.pagina - 1];
        const textos = textosAncoraveisDaPagina(pagina).map((x: { texto: string }) => normalizarAncora(x.texto));
        expect(textos, `${clip.id}: âncora "${clip.ancora}"`).toContain(normalizarAncora(clip.ancora));
      }
    });
  }

  it('a Aula 05 não tem clipes', () => {
    const tabela = lerJson(caminhoDaTabela(5)) as Tabela;
    expect(tabela.clips).toEqual([]);
  });
});
