/**
 * O mapa produto→plano: qual plano cada produto da plataforma de venda libera.
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma).
 *
 * ⚠️ **É daqui, e só daqui, que sai o plano de um pagamento.** O webhook traz o
 * código do produto; o plano é o que o admin configurou para esse código em
 * `/admin/configuracoes`. Produto fora do mapa grava o `Payment` com `planCode`
 * nulo e não libera nada — nunca "o plano que o payload disse".
 *
 * Guardado em `AppSetting` na chave {@link CHAVE_PRODUTOS}, no formato
 * `{ "produtos": [{ "codigo": "wsa-premium", "plano": "PREMIUM" }] }`.
 * Lista, e não objeto `{ codigo: plano }`, para que um código vindo do painel
 * nunca vire nome de propriedade (`__proto__`, `constructor`…).
 *
 * Quem grava é a Server Action do painel, por `gravarConfiguracao` de
 * `@/lib/admin/settings`, com motivo e auditoria. Este módulo só lê e valida.
 */
import type { Plan, Prisma } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { PLANOS } from '@/lib/planos';

export const CHAVE_PRODUTOS = 'pagamento.produtos';

/** Teto de produtos no mapa — é uma tabela de configuração, não um catálogo. */
export const MAXIMO_DE_PRODUTOS = 50;

/** Teto do código de um produto (o mesmo que o Fake aceita no evento). */
export const TAMANHO_MAXIMO_DO_CODIGO = 100;

/**
 * Letras, números e `. _ : -`, começando por letra ou número. Os códigos das
 * plataformas são ids numéricos, slugs ou UUIDs; espaço e acento no meio de um
 * código são quase sempre erro de digitação.
 *
 * ⚠️ A comparação com o código do evento é **exata** (diferencia maiúsculas).
 */
const FORMATO_DO_CODIGO = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

export type ProdutoMapeado = { codigo: string; plano: Plan };

/** Os planos, do menor para o maior. A régua do "nunca rebaixa". */
export const ORDEM_DOS_PLANOS: readonly Plan[] = PLANOS;

/** O maior entre dois planos. */
export function maiorPlano(a: Plan, b: Plan): Plan {
  return ORDEM_DOS_PLANOS.indexOf(a) >= ORDEM_DOS_PLANOS.indexOf(b) ? a : b;
}

// ──────────────────────────────── validação ──────────────────────────────

export const esquemaDoCodigo = z
  .string()
  .trim()
  .min(1, 'informe o código do produto')
  .max(TAMANHO_MAXIMO_DO_CODIGO, `o código passou de ${TAMANHO_MAXIMO_DO_CODIGO} caracteres`)
  .regex(FORMATO_DO_CODIGO, 'use só letras, números e . _ : - (sem espaço)');

export const esquemaDoPlano = z.enum(['ESSENCIAL', 'PREMIUM'], {
  error: 'escolha o plano que o produto libera',
});

/** O mapa inteiro: códigos únicos, no máximo {@link MAXIMO_DE_PRODUTOS}. */
export const esquemaDoMapa = z
  .array(z.object({ codigo: esquemaDoCodigo, plano: esquemaDoPlano }))
  .max(MAXIMO_DE_PRODUTOS, `no máximo ${MAXIMO_DE_PRODUTOS} produtos`)
  .refine(
    (produtos) => new Set(produtos.map((produto) => produto.codigo)).size === produtos.length,
    'há código de produto repetido',
  );

const EsquemaGuardado = z.object({ produtos: esquemaDoMapa });

/** O formato gravado em `AppSetting.value`. */
export function paraGravar(produtos: readonly ProdutoMapeado[]): { produtos: ProdutoMapeado[] } {
  return { produtos: [...produtos] };
}

/**
 * Lê o Json guardado. Valor torto vira mapa vazio + `valido: false` — quem chama
 * decide se avisa (o painel) ou se loga (o webhook).
 *
 * Mapa torto no webhook = nenhum produto mapeado: o pagamento fica gravado com
 * `planCode` nulo, aparece destacado na lista do painel e o suporte libera à
 * mão. Liberar "no escuro" com um mapa que ninguém consegue ler seria pior.
 */
export function interpretarMapa(bruto: Prisma.JsonValue | undefined): {
  produtos: ProdutoMapeado[];
  valido: boolean;
} {
  if (bruto === undefined || bruto === null) return { produtos: [], valido: true };
  const lido = EsquemaGuardado.safeParse(bruto);
  if (!lido.success) return { produtos: [], valido: false };
  return { produtos: lido.data.produtos, valido: true };
}

/** Ordem estável para a tela e para comparar "mudou ou não". */
export function ordenarMapa(produtos: readonly ProdutoMapeado[]): ProdutoMapeado[] {
  return [...produtos].sort((a, b) => a.codigo.localeCompare(b.codigo, 'pt-BR'));
}

/** Os dois mapas dizem a mesma coisa? (a ordem não importa) */
export function mapasIguais(a: readonly ProdutoMapeado[], b: readonly ProdutoMapeado[]): boolean {
  if (a.length !== b.length) return false;
  const deB = new Map(b.map((produto) => [produto.codigo, produto.plano]));
  return a.every((produto) => deB.get(produto.codigo) === produto.plano);
}

// ──────────────────────────────── leitura ────────────────────────────────

/**
 * O mapa atual, para o webhook e para a action do painel.
 *
 * ⚠️ **Falha de banco propaga.** O webhook responde 500 e a plataforma reenvia;
 * engolir o erro aqui gravaria o pagamento como "sem mapeamento" e a
 * idempotência impediria a concessão quando o banco voltasse.
 */
export async function lerMapaDeProdutos(): Promise<{
  produtos: ProdutoMapeado[];
  valido: boolean;
}> {
  const linha = await prisma.appSetting.findUnique({
    where: { key: CHAVE_PRODUTOS },
    select: { value: true },
  });
  return interpretarMapa(linha?.value);
}

/** O plano que um código de produto libera, ou `null` se ele não está no mapa. */
export function planoDoProduto(produtos: readonly ProdutoMapeado[], codigo: string): Plan | null {
  return produtos.find((produto) => produto.codigo === codigo)?.plano ?? null;
}
