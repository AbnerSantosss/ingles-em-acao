/**
 * A referência opaca do aluno no checkout (`User.paymentRef`).
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma).
 *
 * O link de compra leva uma referência que só o app sabe resolver; o webhook a
 * devolve e é **só** por ela que o pagamento encontra o aluno. Nunca pelo e-mail:
 * o e-mail digitado no checkout pode ser outro, e um e-mail na URL seria dado
 * pessoal circulando por plataforma de terceiro, histórico de navegador e log.
 *
 * - Opaca: 16 bytes do CSPRNG em base64url (22 caracteres). Não é o id do aluno,
 *   não deriva de nada dele e não serve para mais nada além de casar pagamento.
 * - Nasce sob demanda, na primeira vez que o aluno logado recebe um link de
 *   compra, e fica: a mesma pessoa leva sempre a mesma referência.
 */
import { randomBytes } from 'node:crypto';

import { prisma } from '@/lib/db';

const BYTES_DA_REFERENCIA = 16;

/** Colisão em 128 bits não acontece; o laço existe porque o índice único existe. */
const TENTATIVAS = 3;

export function gerarReferencia(): string {
  return randomBytes(BYTES_DA_REFERENCIA).toString('base64url');
}

function ehChaveDuplicada(erro: unknown): boolean {
  return (
    typeof erro === 'object' &&
    erro !== null &&
    'code' in erro &&
    (erro as { code?: unknown }).code === 'P2002'
  );
}

/**
 * A `paymentRef` do aluno, criando-a se ainda não existir. `null` para conta
 * inexistente ou excluída — conta excluída não compra.
 *
 * Duas telas renderizando ao mesmo tempo para o mesmo aluno não geram duas
 * referências: a gravação só acontece onde `paymentRef` ainda é nula, e quem
 * perde a corrida relê a do vencedor.
 *
 * **Lança** em falha de banco; {@link lerLinksDeCompra} de `@/lib/admin/settings`
 * captura e segue com o link sem referência.
 */
export async function garantirReferenciaDePagamento(userId: string): Promise<string | null> {
  const atual = await prisma.user.findUnique({
    where: { id: userId },
    select: { paymentRef: true, deletedAt: true },
  });
  if (!atual || atual.deletedAt !== null) return null;
  if (atual.paymentRef) return atual.paymentRef;

  for (let tentativa = 0; tentativa < TENTATIVAS; tentativa += 1) {
    const nova = gerarReferencia();
    try {
      const gravada = await prisma.user.updateMany({
        where: { id: userId, paymentRef: null, deletedAt: null },
        data: { paymentRef: nova },
      });
      if (gravada.count === 1) return nova;

      // Outra requisição gravou primeiro (ou a conta foi excluída no meio).
      const relida = await prisma.user.findUnique({
        where: { id: userId },
        select: { paymentRef: true, deletedAt: true },
      });
      return relida && relida.deletedAt === null ? relida.paymentRef : null;
    } catch (erro: unknown) {
      if (!ehChaveDuplicada(erro)) throw erro;
      // A referência sorteada já é de outra pessoa: sorteia de novo.
    }
  }

  throw new Error('não foi possível gerar uma referência de pagamento única');
}

/**
 * O link de checkout com a referência no parâmetro do provedor.
 *
 * Usa `URL`/`searchParams`: a query que o link já tinha (cupom, origem, utm)
 * continua lá, e um parâmetro de mesmo nome gravado no painel é **substituído**
 * — senão todo aluno compraria com a referência fixa de quem colou o link.
 * Link que não é URL válida volta como está (o painel só grava https válido).
 */
export function linkComReferencia(link: string, parametro: string, referencia: string): string {
  try {
    const url = new URL(link);
    url.searchParams.set(parametro, referencia);
    return url.toString();
  } catch {
    return link;
  }
}
