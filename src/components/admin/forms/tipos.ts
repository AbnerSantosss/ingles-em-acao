import type { Objeto } from './objeto';
import type { Erros } from './validacao';

/** O que todo formulário de tipo recebe do despachante. */
export type PropsDoFormulario = {
  /** O objeto do bloco, lido do texto JSON (sem `t`; sem `id` nos interativos). */
  valor: Objeto;
  /** Devolve o objeto inteiro alterado — o despachante serializa e grava no texto. */
  aoMudar: (novo: Objeto) => void;
  erros: Erros;
  /** `id` somente leitura dos blocos interativos (vem do bloco, não do JSON). */
  id?: string;
  /** Alunos com resposta gravada neste bloco na versão publicada. */
  alunos: number;
};
