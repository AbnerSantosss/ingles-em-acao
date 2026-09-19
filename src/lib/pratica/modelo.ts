/**
 * Texto fixo do prompt de prática com IA (contrato 01, seção 3.2).
 *
 * Aqui mora tudo o que é igual em todas as aulas: os títulos das 17 seções e as
 * regras de condução, correção, voz, ciclos, continuidade e volta ao app. O que
 * muda de aula para aula vem da ficha (`Lesson.practice`) e é encaixado por
 * `montar.ts`.
 *
 * O texto resume as regras do prompt-mestre de prática cumulativa e fala em
 * primeira pessoa, porque é o aluno quem cola o prompt na conversa com a IA.
 * Ele é curto de propósito: quanto menor o texto fixo, mais aulas cabem no link
 * do ChatGPT (`LIMITE_DO_Q`, em `chatgpt.ts`). Não alongue frases sem motivo.
 *
 * ⚠️ Travessão (U+2014) é proibido em todo este arquivo. Use ponto, vírgula ou
 * dois-pontos. Os testes de `tests/pratica/montar.test.ts` conferem.
 */
import type { TipoDeExercicio } from './tipos';

/**
 * Decisão 3 do dono do produto (tabela da seção 7 do `00-LEIA-PRIMEIRO.md`):
 * depois de quantos ciclos com bom desempenho a IA sugere a volta ao app.
 * Para mudar, troque só este número.
 */
export const CICLOS_PARA_SUGERIR_VOLTA = 3;

/** Questões por ciclo, como no modelo oficial da Aula 01. */
export const QUESTOES_POR_CICLO = 5;

/** Títulos das seções 2 a 17, na ordem do contrato. A seção 1 é o cabeçalho. */
export const TITULOS_DAS_SECOES = [
  'APRESENTAÇÃO DO ALUNO E OBJETIVO DA PRÁTICA',
  'FOCO PRINCIPAL DESTA AULA',
  'O QUE JÁ ESTUDEI E PODE SER UTILIZADO NESTA PRÁTICA',
  'COMO INTEGRAR O CONTEÚDO ATUAL AOS ANTERIORES',
  'REGRAS IMPORTANTES PARA ESTA PRÁTICA',
  'COMO CONDUZIR AS QUESTÕES',
  'TIPOS DE EXERCÍCIO ADEQUADOS A ESTA AULA',
  'PROGRESSÃO DA DIFICULDADE',
  'COMO CORRIGIR MEUS ERROS',
  'ÁUDIO E RECONHECIMENTO DE VOZ',
  'LIMITES DESTA PRÁTICA',
  'CICLOS DE PRÁTICA',
  'VARIEDADE',
  'REGRA DE CONTINUIDADE',
  'QUANDO SUGERIR A VOLTA AO APP',
  'PRIMEIRA QUESTÃO',
] as const;

// ---------------------------- seção 1 ----------------------------

/** Seção 1: duas linhas. `numero` já vem com dois dígitos ("07"). */
export function cabecalho(numero: string, titulo: string): string {
  return `PROMPT DE PRÁTICA · AULA ${numero}\n${titulo.toLocaleUpperCase('pt-BR')} · WSA ENGLISH`;
}

// ---------------------------- seção 2 ----------------------------

export function apresentacao(numero: string, titulo: string, revisao: boolean): string {
  const inicio = `Sou iniciante em inglês e estou estudando a Aula ${numero} do curso WSA English: ${titulo}.`;
  const objetivo = revisao
    ? 'É uma aula de revisão: quero praticar com você, numa sessão contínua, o que já estudei, misturando as aulas.'
    : 'Quero praticar com você, numa sessão contínua, esta aula junto com o que já estudei.';
  return `${inicio} ${objetivo} Fale comigo em português simples e use o inglês só dentro do conteúdo autorizado aqui.`;
}

// ---------------------------- seção 3 ----------------------------

export const ROTULO_CONTEUDO_ALVO = 'Linguagem-alvo:';
export const ROTULO_PONTOS_DA_REVISAO = 'Pontos para revisar:';
export const AVISO_DE_REVISAO = 'Aula de revisão, sem conteúdo novo.';
export const ROTULO_EXPRESSOES_FIXAS = 'Expressões fixas (use como bloco pronto, sem explicar a gramática):';

// ---------------------------- seção 4 ----------------------------

/** Aula 01: não há nada antes dela. */
export const SEM_CONTEUDO_ANTERIOR = 'Esta é a primeira aula do curso. Não há conteúdo anterior: use só esta aula.';

/** Outra aula sem nenhuma anterior pronta (ficha pendente em todas). Não acontece com as 42 fichas prontas. */
export const SEM_RESUMO_DAS_ANTERIORES = 'Os resumos das aulas anteriores ainda não estão prontos: use só esta aula.';

export const ROTULO_AULAS_DISTANTES = 'Aulas mais antigas:';
export const ROTULO_AULAS_RECENTES = 'Aulas mais recentes:';
/** Usado quando o corte por tamanho troca o resumo de uma faixa pelos temas. */
export const SUFIXO_SO_OS_TEMAS = '(temas)';

/** Frase literal do prompt-mestre, seção 5. */
export const APOIO_AOS_ANTERIORES =
  'Esses conteúdos já foram apresentados no curso, mas isso não significa que eu os domine completamente. Utilize-os como base e ofereça apoio quando eu demonstrar dificuldade.';

// ---------------------------- seção 5 ----------------------------

export const TRES_FUNCOES =
  'Alterne: só esta aula; esta aula com as anteriores; retomada rápida de algo anterior quando eu travar, voltando depois ao foco. Revisar é para ajudar, não para punir.';

/** Aula sem nenhuma anterior no prompt (a Aula 01). */
export const INTEGRAR_SEM_ANTERIORES = 'Ainda não há conteúdo anterior: varie as situações só com esta aula.';

export const INTEGRAR_NA_REVISAO = 'Misture aulas diferentes e retome com calma o ponto em que eu travar.';

// ---------------------------- seção 6 ----------------------------

export const REGRAS_FIXAS: readonly string[] = [
  'Crie situações de comunicação utilizando o conteúdo desta aula e os conhecimentos anteriores autorizados. Não aumente a complexidade introduzindo estruturas que ainda não estudei.',
  'Sem conversa livre antes de eu ter repertório. Se eu souber responder mas não perguntar, dê a situação em português.',
  'Deixe claro quem fala, com quem e de quem. Não presuma o gênero pelo nome.',
];

// ---------------------------- seção 7 ----------------------------

export const CONDUCAO: readonly string[] = [
  'Uma questão por vez: pergunte e espere a minha resposta.',
  'Deixe-me tentar antes de mostrar qualquer resposta.',
  'Acerto: feedback curto, explicação curta e próxima questão.',
  'Primeiro erro: dica curta e nova tentativa da mesma questão.',
  'Resposta ambígua: peça esclarecimento antes de avaliar.',
];

// ---------------------------- seção 8 ----------------------------

export const ROTULO_TIPOS = 'Formatos, do mais simples ao mais difícil:';

/** Nome curto de cada formato, na lista de formatos (minúsculo, dentro da frase). */
export const NOME_DO_FORMATO: Record<TipoDeExercicio, string> = {
  identificar: 'identificar numa situação',
  escolher: 'escolher entre alternativas',
  completar: 'completar a lacuna',
  transformar: 'transformar a frase',
  traduzir: 'traduzir do português',
  responder: 'responder a uma pergunta curta',
  corrigir: 'corrigir o erro',
  'mini-dialogo': 'mini-diálogo guiado',
  situacao: 'situação descrita em português',
};

/** Rótulo de cada formato, na frente de cada exemplo. */
export const ROTULO_DO_TIPO: Record<TipoDeExercicio, string> = {
  identificar: 'Identificar',
  escolher: 'Escolher',
  completar: 'Completar',
  transformar: 'Transformar',
  traduzir: 'Traduzir',
  responder: 'Responder',
  corrigir: 'Corrigir',
  'mini-dialogo': 'Mini-diálogo',
  situacao: 'Situação',
};

export const ROTULO_EXEMPLOS = 'Exemplos (não copie: crie questões novas no mesmo estilo):';

export const MARCA_DA_RESPOSTA = 'Resposta (não revele antes da minha tentativa):';

// ---------------------------- seção 9 ----------------------------

export const PROGRESSAO =
  'Comece por reconhecimento ou escolha guiada; depois tire dicas e alternativas, peça que eu lembre sem copiar e mude o contexto. Mais difícil nunca é conteúdo novo. Se eu errar seguido, simplifique e volte ao ponto mais tarde, sem repetir a pergunta.';

// ---------------------------- seção 10 ----------------------------

export const CORRECAO: readonly string[] = [
  'No máximo dois pontos por vez, sem aula longa de gramática.',
  'Erro repetido: mostre a resposta, explique em uma frase e siga.',
  'Erro de aula anterior: dica ou questão mais simples, sem me constranger, e volte ao foco.',
  'Se eu usar algo além do que estudei, reconheça o esforço, avalie só o foco e não amplie a prática.',
];

// ---------------------------- seção 11 ----------------------------

export const AUDIO: readonly string[] = [
  'Posso responder por voz.',
  'Uma possível falha de reconhecimento de áudio não deve ser tratada automaticamente como falta de conhecimento. Se a resposta parecer estranha, peça que eu repita ou confirme, sem afirmar que houve falha técnica.',
  'Se receber só texto, não diga que avaliou a minha pronúncia.',
];

// ---------------------------- seção 12 ----------------------------

export const LIMITES_FIXOS: readonly string[] = [
  'Permitido: esta aula e as anteriores deste prompt. Se eu pedir conteúdo futuro, diga em uma frase que a sessão pratica o que já estudei e volte à atividade.',
];

// ---------------------------- seção 13 ----------------------------

export const CICLOS = `Ciclos de ${QUESTOES_POR_CICLO} questões (nova tentativa não conta). No fim de cada ciclo, um resumo bem curto: o que pratiquei desta aula e das anteriores e um ponto a reforçar. Depois, a próxima questão, sem perguntar se quero continuar. Sem nota e sem reprovação.`;

// ---------------------------- seção 14 ----------------------------

export const VARIEDADE = 'Varie situações, formatos e pessoas. Não repita a mesma pergunta nem o mesmo modelo de frase.';

// ---------------------------- seção 15 ----------------------------

export const CONTINUIDADE =
  'Só termine quando eu pedir claramente ("quero parar", "encerrar", "já pratiquei o suficiente"). Aí resuma o que pratiquei e o que posso retomar, sem nova questão e sem me pressionar.';

// ---------------------------- seção 16 ----------------------------

/** Frase literal da volta ao app (pedido do dono do produto). Os testes conferem. */
export const FRASE_DA_VOLTA =
  'Você pode voltar ao app WSA English e seguir para a próxima aula. Se quiser, continuamos praticando.';

/** Na última aula não há próxima: a frase manda rever as aulas do módulo. */
export const FRASE_DA_VOLTA_NA_ULTIMA_AULA =
  'Você pode voltar ao app WSA English e rever as aulas deste módulo. Se quiser, continuamos praticando.';

export function voltaAoApp(ultimaAula: boolean): string {
  const frase = ultimaAula ? FRASE_DA_VOLTA_NA_ULTIMA_AULA : FRASE_DA_VOLTA;
  return `Depois de ${CICLOS_PARA_SUGERIR_VOLTA} ciclos com bom desempenho, ou quando eu pedir para parar, diga exatamente: "${frase}" Se eu não pedi para parar, siga com a próxima questão e só repita a sugestão depois de mais ${CICLOS_PARA_SUGERIR_VOLTA} ciclos. Nunca diga que concluí a aula, que dominei o conteúdo ou que algo foi liberado no app.`;
}

// ---------------------------- seção 17 ----------------------------

export const INICIO_DA_PRIMEIRA_QUESTAO = 'Comece já, sem repetir estas instruções, com esta questão:';
