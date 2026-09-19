/**
 * Validação do formulário: o MESMO `BlockSchema` que o editor e a publicação usam,
 * com as mensagens traduzidas e presas ao caminho do campo (`items.2.answers.0`),
 * para cada erro aparecer ao lado do campo certo.
 *
 * O resumo completo continua embaixo do bloco (`leitura.erros` do cartão). Aqui é
 * só o "onde": nenhum erro deixa de ser mostrado se o formulário não tiver o campo.
 */
import type { z } from 'zod';

import { ehTipoInterativo, type TipoDeBloco } from '@/lib/admin/editor';
import { BlockSchema } from '@/lib/content/blocks';
import { isSolidName, isVariantName } from '@/lib/ui/palette';

import { ehObjeto, temCampo, type Objeto } from './objeto';

type Segmento = string | number;
type Entrada = { caminho: readonly Segmento[]; mensagem: string };

export type Erros = {
  /** Mensagens exatamente neste caminho (relativo ao nó atual). */
  em: (...caminho: Segmento[]) => string[];
  /** Visão a partir de um sub-nó: `erros.filho('items', 2).em('tag')`. */
  filho: (...prefixo: Segmento[]) => Erros;
  /** Quantas mensagens há neste caminho ou abaixo dele. */
  contarAbaixo: (...prefixo: Segmento[]) => number;
};

function comecaCom(caminho: readonly Segmento[], prefixo: readonly Segmento[]): boolean {
  if (prefixo.length > caminho.length) return false;
  return prefixo.every((parte, i) => String(parte) === String(caminho[i]));
}

function criarErros(entradas: readonly Entrada[], base: readonly Segmento[] = []): Erros {
  return {
    em: (...caminho) => {
      const alvo = [...base, ...caminho];
      return entradas
        .filter((e) => e.caminho.length === alvo.length && comecaCom(e.caminho, alvo))
        .map((e) => e.mensagem);
    },
    filho: (...prefixo) => criarErros(entradas, [...base, ...prefixo]),
    contarAbaixo: (...prefixo) => {
      const alvo = [...base, ...prefixo];
      return entradas.filter((e) => comecaCom(e.caminho, alvo)).length;
    },
  };
}

export const SEM_ERROS: Erros = criarErros([]);

// ───────────────────────────── tradução ─────────────────────────────

const TIPO_ESPERADO: Record<string, string> = {
  string: 'um texto',
  number: 'um número',
  boolean: 'sim/não (true ou false)',
  array: 'uma lista [ … ]',
  object: 'um objeto { … }',
};

function valorEm(raiz: unknown, caminho: readonly PropertyKey[]): unknown {
  let atual: unknown = raiz;
  for (const parte of caminho) {
    if (Array.isArray(atual) && typeof parte === 'number') atual = atual[parte];
    else if (ehObjeto(atual) && typeof parte === 'string' && temCampo(atual, parte)) {
      atual = atual[parte];
    } else return undefined;
  }
  return atual;
}

function ehListaDeCores(valores: readonly unknown[]): boolean {
  return (
    valores.length > 0 &&
    valores.every((v) => typeof v === 'string' && (isVariantName(v) || isSolidName(v)))
  );
}

function listarValores(valores: readonly unknown[]): string {
  return valores.map((v) => (typeof v === 'string' ? `"${v}"` : String(v))).join(' ou ');
}

function caminhoDe(caminho: readonly PropertyKey[]): Segmento[] {
  return caminho.map((parte) => (typeof parte === 'number' ? parte : String(parte)));
}

function traduzir(problema: z.core.$ZodIssue, candidato: Objeto): Entrada[] {
  const caminho = caminhoDe(problema.path);
  switch (problema.code) {
    case 'invalid_type': {
      // O zod 4 não devolve o valor recebido no problema: olhamos o candidato
      // para separar "faltou o campo" de "o campo veio com tipo errado".
      const bruto = valorEm(candidato, problema.path);
      const mensagem =
        bruto === undefined
          ? 'Obrigatório. Preencha este campo.'
          : `Formato errado: aqui vai ${TIPO_ESPERADO[problema.expected] ?? problema.expected}.`;
      return [{ caminho, mensagem }];
    }
    case 'too_small': {
      if (problema.origin === 'string') return [{ caminho, mensagem: 'Não pode ficar vazio.' }];
      if (problema.origin === 'array') {
        const minimo = Number(problema.minimum);
        return [
          {
            caminho,
            mensagem:
              minimo === 1 ? 'Precisa de pelo menos 1 item.' : `Precisa de pelo menos ${minimo} itens.`,
          },
        ];
      }
      return [{ caminho, mensagem: `Abaixo do mínimo (${String(problema.minimum)}).` }];
    }
    case 'too_big':
      return [{ caminho, mensagem: `Passou do máximo (${String(problema.maximum)}).` }];
    case 'invalid_value':
      return [
        {
          caminho,
          mensagem: ehListaDeCores(problema.values)
            ? 'Cor fora da paleta. Escolha uma das opções.'
            : `Valor fora da lista: use ${listarValores(problema.values)}.`,
        },
      ];
    case 'invalid_union': {
      // `cols` é união de literais (1 | 2): junta os valores aceitos das alternativas.
      const internos = problema.errors.flat();
      const aceitos = internos.flatMap((p) => (p.code === 'invalid_value' ? p.values : []));
      const mensagem =
        internos.length > 0 && aceitos.length === internos.length
          ? `Valor fora da lista: use ${listarValores(aceitos)}.`
          : 'Valor em formato inválido.';
      return [{ caminho, mensagem }];
    }
    case 'unrecognized_keys':
      return problema.keys.map((chave) => ({
        caminho: [...caminho, chave],
        mensagem: 'Campo desconhecido: não existe neste tipo de bloco e impede o salvar.',
      }));
    default:
      return [{ caminho, mensagem: problema.message }];
  }
}

/**
 * Regras da segunda camada (§3.5) que o formulário consegue apontar no campo.
 * Espelha `validarSemantica` em `src/lib/admin/editor.ts` — lá é o que trava a
 * publicação; aqui é só para o erro aparecer ao lado da resposta certa.
 */
function regrasDoFormulario(t: TipoDeBloco, objeto: Objeto): Entrada[] {
  const saida: Entrada[] = [];
  if (t === 'fill' && Array.isArray(objeto.items)) {
    objeto.items.forEach((item: unknown, i) => {
      if (!ehObjeto(item) || !Array.isArray(item.answers)) return;
      item.answers.forEach((resposta: unknown, j) => {
        if (typeof resposta === 'string' && resposta.length > 0 && resposta.trim() === '') {
          saida.push({
            caminho: ['items', i, 'answers', j],
            mensagem: 'Resposta só com espaços. Escreva a forma aceita.',
          });
        }
      });
    });
  }
  return saida;
}

/**
 * Valida o objeto do formulário como o editor faria (`lerJsonDoBloco`): `t` e o
 * `id` dos interativos vêm do bloco, nunca do objeto.
 */
export function validarFormulario(t: TipoDeBloco, id: string | undefined, objeto: Objeto): Erros {
  const entradas: Entrada[] = [];
  const interativo = ehTipoInterativo(t);

  if (temCampo(objeto, 't')) {
    entradas.push({
      caminho: ['t'],
      mensagem: 'O tipo do bloco é fixo e não pode estar no conteúdo. Remova este campo.',
    });
  }
  if (interativo && temCampo(objeto, 'id')) {
    entradas.push({
      caminho: ['id'],
      mensagem:
        'O `id` é permanente e fica fora do conteúdo (é a chave das respostas). Remova este campo.',
    });
  }

  const candidato: Objeto = { ...objeto, t };
  if (interativo) candidato.id = id;

  const resultado = BlockSchema.safeParse(candidato);
  if (!resultado.success) {
    for (const problema of resultado.error.issues) entradas.push(...traduzir(problema, candidato));
  }
  entradas.push(...regrasDoFormulario(t, objeto));
  return criarErros(entradas);
}
