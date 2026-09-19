/**
 * Monta o prompt de prática de uma aula (contrato 01, seção 3.2).
 *
 * Função pura: não lê banco, não lê relógio, não sorteia nada. A mesma entrada
 * dá sempre o mesmo texto. Quem busca os dados é `servidor.ts` (aluno) e a
 * pré-visualização do painel (pacote 07).
 *
 * Três travas moram aqui, e os testes conferem as três:
 *
 *   1. Firewall de conteúdo futuro: só entra aula anterior de número MENOR que o
 *      da aula atual. Da próxima aula só se usa o fato de ela existir ou não:
 *      nem número, nem título.
 *   2. Nenhum travessão (U+2014) no texto final, mesmo que venha do título da
 *      aula ou da ficha.
 *   3. Tamanho: acima de TAMANHO_MAXIMO_DO_PROMPT, os resumos das aulas mais
 *      antigas são encurtados por faixa, das mais antigas para as mais novas,
 *      até caber. Se nem assim couber, vai o texto completo (será colado).
 */
import { LIMITE_DO_Q } from './chatgpt';
import type { FichaDePratica } from './tipos';
import {
  APOIO_AOS_ANTERIORES,
  AUDIO,
  AVISO_DE_REVISAO,
  CICLOS,
  CONDUCAO,
  CONTINUIDADE,
  CORRECAO,
  INICIO_DA_PRIMEIRA_QUESTAO,
  INTEGRAR_NA_REVISAO,
  INTEGRAR_SEM_ANTERIORES,
  LIMITES_FIXOS,
  MARCA_DA_RESPOSTA,
  NOME_DO_FORMATO,
  PROGRESSAO,
  REGRAS_FIXAS,
  ROTULO_AULAS_DISTANTES,
  ROTULO_AULAS_RECENTES,
  ROTULO_CONTEUDO_ALVO,
  ROTULO_DO_TIPO,
  ROTULO_EXEMPLOS,
  ROTULO_EXPRESSOES_FIXAS,
  ROTULO_PONTOS_DA_REVISAO,
  ROTULO_TIPOS,
  SEM_CONTEUDO_ANTERIOR,
  SEM_RESUMO_DAS_ANTERIORES,
  SUFIXO_SO_OS_TEMAS,
  TITULOS_DAS_SECOES,
  TRES_FUNCOES,
  VARIEDADE,
  apresentacao,
  cabecalho,
  voltaAoApp,
} from './modelo';

// ---------------------------- contrato 3.2 ----------------------------

export interface EntradaDoPrompt {
  aula: { numero: number; titulo: string };
  ficha: FichaDePratica;
  /** Aulas anteriores publicadas e com ficha 'pronta', em ordem crescente de número. */
  anteriores: { numero: number; titulo: string; resumoAutorizado: string[]; resumoCurto: string }[];
  /** `null` na última aula. */
  proxima: { numero: number; titulo: string } | null;
}

/** Quantas aulas imediatamente anteriores entram com o resumo completo. As demais entram com `resumoCurto`. */
export const AULAS_COM_RESUMO_COMPLETO = 5;

// ---------------------------- tamanho ----------------------------

/**
 * Alvo de tamanho do prompt, em caracteres: o mesmo número de `LIMITE_DO_Q`
 * (`chatgpt.ts`), porque o corte só serve para o prompt caber no link do
 * ChatGPT. Quando o spike da Onda 0 mudar `LIMITE_DO_Q`, este alvo muda junto.
 * Passar do alvo não quebra nada: o link sai sem o prompt e o aluno cola.
 */
export const TAMANHO_MAXIMO_DO_PROMPT = LIMITE_DO_Q;

/** Quantas aulas antigas formam uma faixa no corte por tamanho. */
export const AULAS_POR_FAIXA = 5;

type Anterior = EntradaDoPrompt['anteriores'][number];

/**
 * Como uma faixa de aulas antigas aparece na seção 4:
 * - 'linhas': uma linha por aula, com título e `resumoCurto` (o normal);
 * - 'agrupada': uma linha para a faixa inteira, só com os `resumoCurto`;
 * - 'temas': uma linha para a faixa inteira, só com os títulos.
 */
type FormaDaFaixa = 'linhas' | 'agrupada' | 'temas';

// ---------------------------- utilitários ----------------------------

/** 7 vira "07". */
function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

/** Tira espaços das pontas e junta espaços repetidos. */
function limpar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}

/** Lista com "- " na frente de cada item não vazio. */
function lista(itens: readonly string[]): string[] {
  return itens.map(limpar).filter((item) => item !== '').map((item) => `- ${item}`);
}

/** Garante ponto final, para juntar resumos na mesma linha sem embolar. */
function comPontoFinal(texto: string): string {
  const limpo = limpar(texto);
  return /[.!?]$/.test(limpo) ? limpo : `${limpo}.`;
}

function fatiar<T>(itens: readonly T[], tamanho: number): T[][] {
  const faixas: T[][] = [];
  for (let i = 0; i < itens.length; i += tamanho) faixas.push(itens.slice(i, i + tamanho));
  return faixas;
}

/** "Aula 07" ou "Aulas 01 a 05". */
function rotuloDaFaixa(faixa: readonly Anterior[]): string {
  const primeira = faixa[0];
  const ultima = faixa[faixa.length - 1];
  if (faixa.length === 1) return `Aula ${doisDigitos(primeira.numero)}`;
  return `Aulas ${doisDigitos(primeira.numero)} a ${doisDigitos(ultima.numero)}`;
}

/**
 * Troca todo travessão (U+2014) por dois-pontos. A expressão usa o escape
 * `\u2014` de propósito: o caractere literal não pode aparecer no código.
 */
function semTravessao(texto: string): string {
  return texto.replace(/\s*\u2014\s*/g, ': ');
}

function secao(titulo: string, linhas: readonly string[]): string {
  return [titulo, ...linhas].join('\n');
}

// ---------------------------- seções variáveis ----------------------------

function secaoDoFoco(ficha: FichaDePratica): string[] {
  const revisao = ficha.tipo === 'revisao';
  const linhas: string[] = [];
  linhas.push(revisao ? `${AVISO_DE_REVISAO} ${limpar(ficha.foco)}` : limpar(ficha.foco));
  linhas.push(revisao ? ROTULO_PONTOS_DA_REVISAO : ROTULO_CONTEUDO_ALVO);
  linhas.push(...lista(ficha.conteudoAlvo));
  const expressoes = lista(ficha.expressoesFixas);
  if (expressoes.length > 0) {
    linhas.push(ROTULO_EXPRESSOES_FIXAS);
    linhas.push(...expressoes);
  }
  return linhas;
}

function linhasDasDistantes(faixas: readonly Anterior[][], formas: readonly FormaDaFaixa[]): string[] {
  const linhas: string[] = [];
  faixas.forEach((faixa, i) => {
    const forma = formas[i];
    if (forma === 'linhas') {
      for (const aula of faixa) {
        linhas.push(`- Aula ${doisDigitos(aula.numero)} · ${limpar(aula.titulo)}: ${comPontoFinal(aula.resumoCurto)}`);
      }
    } else if (forma === 'agrupada') {
      linhas.push(`- ${rotuloDaFaixa(faixa)}: ${faixa.map((aula) => comPontoFinal(aula.resumoCurto)).join(' ')}`);
    } else {
      linhas.push(
        `- ${rotuloDaFaixa(faixa)} ${SUFIXO_SO_OS_TEMAS}: ${faixa.map((aula) => limpar(aula.titulo)).join('; ')}.`,
      );
    }
  });
  return linhas;
}

function secaoDoQueJaEstudei(
  numeroAtual: number,
  recentes: readonly Anterior[],
  faixas: readonly Anterior[][],
  formas: readonly FormaDaFaixa[],
): string[] {
  if (recentes.length === 0) return [numeroAtual === 1 ? SEM_CONTEUDO_ANTERIOR : SEM_RESUMO_DAS_ANTERIORES];

  const linhas: string[] = [];
  if (faixas.length > 0) {
    linhas.push(ROTULO_AULAS_DISTANTES);
    linhas.push(...linhasDasDistantes(faixas, formas));
  }
  linhas.push(ROTULO_AULAS_RECENTES);
  for (const aula of recentes) {
    linhas.push(`Aula ${doisDigitos(aula.numero)} · ${limpar(aula.titulo)}`);
    linhas.push(...lista(aula.resumoAutorizado));
  }
  linhas.push(APOIO_AOS_ANTERIORES);
  return linhas;
}

function secaoDeIntegracao(ficha: FichaDePratica, semAnteriores: boolean): string[] {
  let fixa = TRES_FUNCOES;
  if (semAnteriores) fixa = INTEGRAR_SEM_ANTERIORES;
  else if (ficha.tipo === 'revisao') fixa = INTEGRAR_NA_REVISAO;
  return [...lista(ficha.comoIntegrar), fixa];
}

function secaoDeTipos(ficha: FichaDePratica): string[] {
  // Sem repetir formato, na ordem em que a ficha escreveu (do mais simples ao mais difícil).
  const tipos = ficha.tiposDeExercicio.filter((tipo, i, todos) => todos.indexOf(tipo) === i);
  const linhas: string[] = [`${ROTULO_TIPOS} ${tipos.map((tipo) => NOME_DO_FORMATO[tipo]).join(', ')}.`];
  linhas.push(ROTULO_EXEMPLOS);
  ficha.exemplos.forEach((exemplo, i) => {
    linhas.push(`${i + 1}. ${ROTULO_DO_TIPO[exemplo.tipo]}: ${limpar(exemplo.enunciado)}`);
    linhas.push(`   ${MARCA_DA_RESPOSTA} ${limpar(exemplo.respostaDeReferencia)}`);
  });
  return linhas;
}

// ---------------------------- composição ----------------------------

function compor(
  entrada: EntradaDoPrompt,
  recentes: readonly Anterior[],
  faixas: readonly Anterior[][],
  formas: readonly FormaDaFaixa[],
): string {
  const { ficha } = entrada;
  const numero = doisDigitos(entrada.aula.numero);
  const titulo = limpar(entrada.aula.titulo);
  const revisao = ficha.tipo === 'revisao';
  const semAnteriores = recentes.length === 0;
  const ultimaAula = entrada.proxima === null;

  // Um item por seção, na ordem de TITULOS_DAS_SECOES (seções 2 a 17).
  const corpos: string[][] = [
    [apresentacao(numero, titulo, revisao)],
    secaoDoFoco(ficha),
    secaoDoQueJaEstudei(entrada.aula.numero, recentes, faixas, formas),
    secaoDeIntegracao(ficha, semAnteriores),
    [...lista(REGRAS_FIXAS), ...lista(ficha.regrasDaAula)],
    lista(CONDUCAO),
    secaoDeTipos(ficha),
    [PROGRESSAO],
    lista(CORRECAO),
    lista(AUDIO),
    [...lista(ficha.limites), ...lista(LIMITES_FIXOS)],
    [CICLOS],
    [VARIEDADE],
    [CONTINUIDADE],
    [voltaAoApp(ultimaAula)],
    [INICIO_DA_PRIMEIRA_QUESTAO, limpar(ficha.primeiraQuestao)],
  ];

  const partes = [
    cabecalho(numero, titulo),
    ...TITULOS_DAS_SECOES.map((tituloDaSecao, i) => secao(tituloDaSecao, corpos[i])),
  ];

  return semTravessao(partes.join('\n\n')).trim();
}

/**
 * O prompt pronto para colar numa conversa nova com a IA.
 *
 * `entrada.anteriores` é filtrada e ordenada aqui de novo, de propósito: mesmo
 * que quem chamou erre, nenhuma aula de número igual ou maior que o da atual
 * entra no texto. `entrada.proxima` só decide a frase da volta ao app (última
 * aula ou não): o número e o título dela nunca entram no texto.
 *
 * `limite` só existe para os testes; o app sempre usa o padrão.
 */
export function montarPrompt(entrada: EntradaDoPrompt, limite: number = TAMANHO_MAXIMO_DO_PROMPT): string {
  const atual = entrada.aula.numero;
  const anteriores = entrada.anteriores
    .filter((aula) => aula.numero < atual)
    .sort((a, b) => a.numero - b.numero);

  const quantasDistantes = Math.max(0, anteriores.length - AULAS_COM_RESUMO_COMPLETO);
  const distantes = anteriores.slice(0, quantasDistantes);
  const recentes = anteriores.slice(quantasDistantes);

  const faixas = fatiar(distantes, AULAS_POR_FAIXA);
  const formas: FormaDaFaixa[] = faixas.map(() => 'linhas');

  const completo = compor(entrada, recentes, faixas, formas);
  if (completo.length <= limite) return completo;

  // Corte por tamanho: primeiro agrupa as faixas (da mais antiga para a mais
  // nova); se ainda não couber, troca o resumo das faixas pelos temas, na mesma
  // ordem. Para no primeiro formato que couber. As 5 aulas mais recentes e a
  // ficha da aula atual nunca são cortadas.
  for (const forma of ['agrupada', 'temas'] as const) {
    for (let i = 0; i < faixas.length; i++) {
      formas[i] = forma;
      const cortado = compor(entrada, recentes, faixas, formas);
      if (cortado.length <= limite) return cortado;
    }
  }

  // Nem cortando coube no link: o aluno vai colar o prompt, e colar não tem esse
  // limite. Então vai o texto completo, sem perder o resumo das aulas antigas
  // (prompt-mestre: não reduzir conteúdo pedagógico só para caber).
  return completo;
}
