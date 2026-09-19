/**
 * Tipos da prática com IA (contrato 3.1 e 3.2). Sem import de servidor: o cartão do fim
 * da aula (cliente) e o montador do prompt (servidor) usam os mesmos tipos.
 *
 * Quantidades e tamanhos de cada campo: o orçamento da seção 10.3 do contrato, conferido
 * por `validarFicha` em `./esquema.ts`.
 */

export type TipoDeExercicio =
  | 'identificar'        // reconhecer o item certo numa situação descrita
  | 'escolher'           // escolher entre duas ou três alternativas
  | 'completar'          // completar a lacuna de uma frase
  | 'transformar'        // afirmativa → negativa, singular → plural etc.
  | 'traduzir'           // do português para o inglês, só com repertório autorizado
  | 'responder'          // responder a uma pergunta curta
  | 'corrigir'           // achar e corrigir o erro de uma frase
  | 'mini-dialogo'       // troca guiada de duas a quatro falas
  | 'situacao'           // situação comunicativa descrita em português

export interface ExemploDeExercicio {
  tipo: TipoDeExercicio
  /** O que o tutor pergunta. */
  enunciado: string
  /** Referência para o tutor. O modelo do prompt avisa que não deve ser revelada antes da tentativa. */
  respostaDeReferencia: string
}

export interface FichaDePratica {
  versao: 1
  /** 'pendente' → o cartão de prática desta aula mostra "em preparação" e não entrega prompt. */
  status: 'pronta' | 'pendente'
  /** 'revisao' nas Aulas 05 e 42 (contrato 10.8): sem foco novo, a sessão mistura as aulas anteriores. */
  tipo: 'conteudo' | 'revisao'
  /** Uma frase em português dizendo o foco. */
  foco: string
  /** Linguagem-alvo em inglês, item a item. */
  conteudoAlvo: string[]
  /** Expressões fixas autorizadas nesta aula, usadas como bloco, sem explicar a gramática interna. */
  expressoesFixas: string[]
  /** Como combinar esta aula com as anteriores. Exatamente 2 itens numa ficha pronta. */
  comoIntegrar: string[]
  /** Regra específica desta aula (ex.: "deixe explícito quem fala e com quem"). Pode ser vazio. */
  regrasDaAula: string[]
  /** 3 ou 4 tipos, em ordem de dificuldade crescente. */
  tiposDeExercicio: TipoDeExercicio[]
  /** Exatamente 3 exemplos numa ficha pronta, só com conteúdo autorizado. */
  exemplos: ExemploDeExercicio[]
  /** O que NÃO cobrar nesta prática. Específico da aula, não copiado da Aula 01. */
  limites: string[]
  /** Pergunta literal com que a IA começa. */
  primeiraQuestao: string
  /** Exatamente 3 itens numa ficha pronta. Entra inteiro no prompt das 5 aulas seguintes. */
  resumoAutorizado: string[]
  /** Uma linha. Entra no prompt das aulas mais distantes. */
  resumoCurto: string
}

/**
 * O que a página da aula entrega ao cartão de prática (contrato 3.2). Mora aqui, e não em
 * `servidor.ts`, porque o cartão é componente de cliente e `servidor.ts` importa 'server-only'.
 * `'sem-ficha'` cobre aula sem `practice`, com ficha inválida ou com `status: 'pendente'`.
 */
export type ResultadoDoPrompt =
  | { ok: true; prompt: string; urlDoChatGPT: string | null }
  | { ok: false; motivo: 'sem-plano' | 'sem-ficha' }
