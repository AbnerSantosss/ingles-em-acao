/**
 * Montador do prompt de prática (pacote 06). Função pura: sem banco.
 *
 * As fichas são falsas e cheias de marcadores com o número da aula
 * (FOCO-07, RESUMO-07-A, CURTO-07...). Assim dá para provar, aula por aula, que
 * nada de uma aula igual ou posterior vaza para o prompt.
 */
import { describe, expect, it } from 'vitest';

import {
  AVISO_DE_REVISAO,
  CICLOS_PARA_SUGERIR_VOLTA,
  FRASE_DA_VOLTA,
  FRASE_DA_VOLTA_NA_ULTIMA_AULA,
  INTEGRAR_NA_REVISAO,
  MARCA_DA_RESPOSTA,
  ROTULO_CONTEUDO_ALVO,
  ROTULO_PONTOS_DA_REVISAO,
  SEM_CONTEUDO_ANTERIOR,
  SUFIXO_SO_OS_TEMAS,
  TITULOS_DAS_SECOES,
} from '@/lib/pratica/modelo';
import {
  AULAS_COM_RESUMO_COMPLETO,
  TAMANHO_MAXIMO_DO_PROMPT,
  montarPrompt,
  type EntradaDoPrompt,
} from '@/lib/pratica/montar';
import { LIMITE_DO_Q } from '@/lib/pratica/chatgpt';
import type { FichaDePratica } from '@/lib/pratica/tipos';

const SEM_CORTE = 1e9;
const TRAVESSAO = String.fromCharCode(0x2014);

const dd = (numero: number) => String(numero).padStart(2, '0');

function fichaFalsa(numero: number, extras: Partial<FichaDePratica> = {}): FichaDePratica {
  const n = dd(numero);
  return {
    versao: 1,
    status: 'pronta',
    tipo: 'conteudo',
    foco: `FOCO-${n}`,
    conteudoAlvo: [`ALVO-${n}`],
    expressoesFixas: [],
    comoIntegrar: [`INTEGRAR-${n}-A`, `INTEGRAR-${n}-B`],
    regrasDaAula: [],
    tiposDeExercicio: ['identificar', 'escolher', 'completar'],
    exemplos: [
      { tipo: 'identificar', enunciado: `ENUNCIADO-${n}-1`, respostaDeReferencia: `RESPOSTA-${n}-1` },
      { tipo: 'escolher', enunciado: `ENUNCIADO-${n}-2`, respostaDeReferencia: `RESPOSTA-${n}-2` },
      { tipo: 'completar', enunciado: `ENUNCIADO-${n}-3`, respostaDeReferencia: `RESPOSTA-${n}-3` },
    ],
    limites: [`LIMITE-${n}`],
    primeiraQuestao: `PRIMEIRA-${n}`,
    resumoAutorizado: [`RESUMO-${n}-A`, `RESUMO-${n}-B`, `RESUMO-${n}-C`],
    // Mais longo que o título de propósito: o corte por "temas" precisa encurtar.
    resumoCurto: `CURTO-${n}: resumo curto de teste com texto bastante para ocupar espaço`,
    ...extras,
  };
}

const TODAS = Array.from({ length: 42 }, (_, i) => fichaFalsa(i + 1));

/**
 * Entrada da aula `numero`. De propósito, `anteriores` recebe as 42 aulas
 * (inclusive a atual e as posteriores) e `proxima` recebe um título proibido:
 * o montador tem de filtrar sozinho.
 */
function entradaDa(numero: number, ficha: FichaDePratica = TODAS[numero - 1]): EntradaDoPrompt {
  return {
    aula: { numero, titulo: `Titulo da aula ${dd(numero)}` },
    ficha,
    anteriores: TODAS.map((f, i) => ({
      numero: i + 1,
      titulo: `Titulo da aula ${dd(i + 1)}`,
      resumoAutorizado: f.resumoAutorizado,
      resumoCurto: f.resumoCurto,
    })),
    proxima: numero < 42 ? { numero: numero + 1, titulo: `TITULO-PROXIMA-${dd(numero + 1)}` } : null,
  };
}

/** Todos os números de aula citados no texto: marcadores, títulos e "Aula(s) NN". */
function numerosCitados(prompt: string): number[] {
  const achados: number[] = [];
  for (const m of prompt.matchAll(/\b[A-Z]+-(\d{2})\b/g)) achados.push(Number(m[1]));
  for (const m of prompt.matchAll(/Titulo da aula (\d{2})/g)) achados.push(Number(m[1]));
  for (const m of prompt.matchAll(/\b(?:AULA|Aula|Aulas)\s+(\d{2})(?:\s+a\s+(\d{2}))?/g)) {
    achados.push(Number(m[1]));
    if (m[2]) achados.push(Number(m[2]));
  }
  return achados;
}

describe('montarPrompt: estrutura', () => {
  it('cabeçalho de duas linhas e as 16 seções na ordem do contrato', () => {
    const prompt = montarPrompt(entradaDa(7), SEM_CORTE);
    const [linha1, linha2] = prompt.split('\n');
    expect(linha1).toBe('PROMPT DE PRÁTICA · AULA 07');
    expect(linha2).toBe('TITULO DA AULA 07 · WSA ENGLISH');

    expect(TITULOS_DAS_SECOES).toHaveLength(16);
    let anterior = -1;
    for (const titulo of TITULOS_DAS_SECOES) {
      const posicao = prompt.indexOf(`\n\n${titulo}\n`);
      expect(posicao, titulo).toBeGreaterThan(anterior);
      anterior = posicao;
    }
  });

  it('termina com a primeira questão da ficha', () => {
    expect(montarPrompt(entradaDa(7), SEM_CORTE).endsWith('PRIMEIRA-07')).toBe(true);
  });

  it('é determinístico e não mexe na entrada', () => {
    const entrada = entradaDa(12);
    entrada.anteriores.reverse();
    const copia = JSON.stringify(entrada);
    expect(montarPrompt(entrada)).toBe(montarPrompt(entrada));
    expect(JSON.stringify(entrada)).toBe(copia);
  });

  it('ordena as anteriores mesmo se vierem fora de ordem', () => {
    const entrada = entradaDa(12);
    entrada.anteriores.reverse();
    const prompt = montarPrompt(entrada, SEM_CORTE);
    expect(prompt.indexOf('Aula 07 · Titulo da aula 07')).toBeLessThan(prompt.indexOf('Aula 08 · Titulo da aula 08'));
  });

  it('rótulos legíveis nos formatos e resposta marcada para não revelar', () => {
    const ficha = fichaFalsa(7, {
      tiposDeExercicio: ['identificar', 'mini-dialogo', 'situacao'],
      exemplos: [
        { tipo: 'identificar', enunciado: 'ENUNCIADO-07-1', respostaDeReferencia: 'RESPOSTA-07-1' },
        { tipo: 'mini-dialogo', enunciado: 'ENUNCIADO-07-2', respostaDeReferencia: 'RESPOSTA-07-2' },
        { tipo: 'situacao', enunciado: 'ENUNCIADO-07-3', respostaDeReferencia: 'RESPOSTA-07-3' },
      ],
    });
    const prompt = montarPrompt(entradaDa(7, ficha), SEM_CORTE);
    expect(prompt).toContain('mini-diálogo guiado');
    expect(prompt).toContain('Mini-diálogo: ENUNCIADO-07-2');
    expect(prompt).toContain('Situação: ENUNCIADO-07-3');
    expect(prompt).not.toContain('mini-dialogo');
    expect(prompt).toContain(`${MARCA_DA_RESPOSTA} RESPOSTA-07-1`);
    expect(MARCA_DA_RESPOSTA).toContain('não revele antes da minha tentativa');
  });
});

describe('montarPrompt: o que já estudei', () => {
  it('Aula 01: avisa que não há conteúdo anterior', () => {
    const prompt = montarPrompt(entradaDa(1), SEM_CORTE);
    expect(prompt).toContain(SEM_CONTEUDO_ANTERIOR);
    expect(prompt).not.toContain('Aulas mais recentes:');
  });

  it(`as ${AULAS_COM_RESUMO_COMPLETO} anteriores mais próximas vão completas, as outras só com o resumo curto`, () => {
    expect(AULAS_COM_RESUMO_COMPLETO).toBe(5);
    const prompt = montarPrompt(entradaDa(20), SEM_CORTE);
    for (let n = 15; n <= 19; n++) {
      expect(prompt).toContain(`RESUMO-${dd(n)}-A`);
      expect(prompt).not.toContain(`CURTO-${dd(n)}`);
    }
    for (let n = 1; n <= 14; n++) {
      expect(prompt).toContain(`CURTO-${dd(n)}`);
      expect(prompt).not.toContain(`RESUMO-${dd(n)}-`);
    }
  });

  it('aula de revisão muda o foco e a integração', () => {
    const prompt = montarPrompt(entradaDa(30, fichaFalsa(30, { tipo: 'revisao' })), SEM_CORTE);
    expect(prompt).toContain(AVISO_DE_REVISAO);
    expect(prompt).toContain(ROTULO_PONTOS_DA_REVISAO);
    expect(prompt).toContain(INTEGRAR_NA_REVISAO);
    expect(prompt).toContain('É uma aula de revisão');
    expect(prompt).not.toContain(ROTULO_CONTEUDO_ALVO);
  });
});

describe('montarPrompt: volta ao app', () => {
  it('frase literal pedida pelo dono do produto', () => {
    expect(FRASE_DA_VOLTA).toBe(
      'Você pode voltar ao app WSA English e seguir para a próxima aula. Se quiser, continuamos praticando.',
    );
    const prompt = montarPrompt(entradaDa(7), SEM_CORTE);
    expect(prompt).toContain(`"${FRASE_DA_VOLTA}"`);
    expect(prompt).toContain(`Depois de ${CICLOS_PARA_SUGERIR_VOLTA} ciclos com bom desempenho`);
    expect(prompt).toContain('Nunca diga que concluí a aula, que dominei o conteúdo');
    expect(prompt).not.toContain(FRASE_DA_VOLTA_NA_ULTIMA_AULA);
  });

  it('na última aula a frase manda rever o módulo', () => {
    const prompt = montarPrompt(entradaDa(42), SEM_CORTE);
    expect(prompt).toContain(`"${FRASE_DA_VOLTA_NA_ULTIMA_AULA}"`);
    expect(prompt).not.toContain(FRASE_DA_VOLTA);
  });
});

describe('montarPrompt: firewall de conteúdo futuro', () => {
  for (let numero = 1; numero <= 42; numero++) {
    it(`Aula ${dd(numero)}: nada de aula igual ou posterior`, () => {
      for (const limite of [SEM_CORTE, TAMANHO_MAXIMO_DO_PROMPT]) {
        const prompt = montarPrompt(entradaDa(numero), limite);
        expect(prompt).not.toContain('TITULO-PROXIMA');
        expect(prompt).not.toContain(`RESUMO-${dd(numero)}-`);
        expect(prompt).not.toContain(`CURTO-${dd(numero)}`);
        expect(prompt).toContain(`FOCO-${dd(numero)}`);
        const acima = numerosCitados(prompt).filter((n) => n > numero);
        expect(acima, `aula ${numero}`).toEqual([]);
      }
    });
  }
});

describe('montarPrompt: travessão', () => {
  it(`nenhum U+2014 no texto final, nem vindo do título ou da ficha`, () => {
    const ficha = fichaFalsa(7, { foco: `FOCO-07 ${TRAVESSAO} com travessão` });
    const entrada = entradaDa(7, ficha);
    entrada.aula.titulo = `Verb to be ${TRAVESSAO} Affirmative`;
    const prompt = montarPrompt(entrada, SEM_CORTE);
    expect(prompt).not.toContain(TRAVESSAO);
    expect(prompt).toContain('Verb to be: Affirmative');
    for (let numero = 1; numero <= 42; numero++) {
      expect(montarPrompt(entradaDa(numero)), `aula ${numero}`).not.toContain(TRAVESSAO);
    }
  });
});

describe('montarPrompt: tamanho', () => {
  it('o alvo de tamanho é o limite do link do ChatGPT', () => {
    expect(TAMANHO_MAXIMO_DO_PROMPT).toBe(LIMITE_DO_Q);
  });

  it('dentro do limite: texto completo, sem corte', () => {
    const completo = montarPrompt(entradaDa(42), SEM_CORTE);
    expect(montarPrompt(entradaDa(42), completo.length)).toBe(completo);
  });

  it('um caractere acima: agrupa a faixa mais antiga', () => {
    const completo = montarPrompt(entradaDa(42), SEM_CORTE);
    const cortado = montarPrompt(entradaDa(42), completo.length - 1);
    expect(cortado.length).toBeLessThanOrEqual(completo.length - 1);
    expect(cortado).toContain('- Aulas 01 a 05: CURTO-01');
    expect(cortado).not.toContain('Aula 01 · Titulo da aula 01');
  });

  it('apertando o limite: chega aos temas e nunca corta as 5 recentes nem a aula atual', () => {
    const completo = montarPrompt(entradaDa(42), SEM_CORTE);
    let chegouAosTemas = false;
    for (let limite = completo.length; limite > 0; limite -= 100) {
      const prompt = montarPrompt(entradaDa(42), limite);
      for (let n = 37; n <= 41; n++) expect(prompt).toContain(`RESUMO-${n}-C`);
      expect(prompt).toContain('FOCO-42');
      expect(prompt).toContain('PRIMEIRA-42');
      if (prompt.includes(SUFIXO_SO_OS_TEMAS)) {
        chegouAosTemas = true;
        expect(prompt.length).toBeLessThanOrEqual(limite);
        expect(prompt).toContain(`- Aulas 01 a 05 ${SUFIXO_SO_OS_TEMAS}: Titulo da aula 01;`);
      }
    }
    expect(chegouAosTemas).toBe(true);
  });

  it('se nem cortando couber, vai o texto completo (o aluno cola)', () => {
    const completo = montarPrompt(entradaDa(42), SEM_CORTE);
    expect(montarPrompt(entradaDa(42), 1)).toBe(completo);
  });

  it('guarda do texto fixo: a Aula 01 com ficha mínima continua curta', () => {
    // Se este teste falhar, alguém alongou o texto de `modelo.ts`. Encurte o
    // texto novo em vez de subir o número: cada caractere a mais tira aulas do link.
    expect(montarPrompt(entradaDa(1), SEM_CORTE).length).toBeLessThanOrEqual(4300);
  });
});
