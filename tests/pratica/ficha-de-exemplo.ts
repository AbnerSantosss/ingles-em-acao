/**
 * Ficha de prática válida, para os testes. Não é conteúdo de aula: o conteúdo real das 42
 * fichas é do pacote 12 e mora em `content/pratica/`.
 */
import type { FichaDePratica } from '@/lib/pratica/tipos';

export function fichaDeExemplo(): FichaDePratica {
  return {
    versao: 1,
    status: 'pronta',
    tipo: 'conteudo',
    foco: 'Usar os pronomes pessoais do caso reto para falar de pessoas.',
    conteudoAlvo: ['I, you', 'he, she, it', 'we, they'],
    expressoesFixas: ['Nice to meet you.'],
    comoIntegrar: [
      'Troque o nome de uma pessoa pelo pronome certo.',
      'Misture pronomes no singular e no plural na mesma rodada.',
    ],
    regrasDaAula: ['Deixe explícito de quem se está falando em cada frase.'],
    tiposDeExercicio: ['identificar', 'escolher', 'traduzir'],
    exemplos: [
      { tipo: 'identificar', enunciado: 'Qual pronome usamos para falar de Ana?', respostaDeReferencia: 'she' },
      { tipo: 'escolher', enunciado: 'Pedro e eu: we ou they?', respostaDeReferencia: 'we' },
      { tipo: 'traduzir', enunciado: 'Como se diz "eles" em inglês?', respostaDeReferencia: 'they' },
    ],
    limites: ['Não cobre o verbo to be nesta prática.'],
    primeiraQuestao: 'Qual pronome usamos para falar de um homem?',
    resumoAutorizado: [
      'Pronomes: I, you, he, she, it, we, they.',
      'he para homem, she para mulher, it para coisa ou animal.',
      'we inclui quem fala; they não inclui.',
    ],
    resumoCurto: 'Pronomes pessoais do caso reto: I, you, he, she, it, we, they.',
  };
}
