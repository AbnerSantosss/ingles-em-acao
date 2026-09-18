'use server';

/**
 * Renovação do link do vídeo enviado — o lado do aluno (§4.3).
 *
 * O link de reprodução vale 15 minutos. Quando ele vence no meio da aula (o
 * aluno pausou para fazer os exercícios, ou o vídeo é longo), o player pede um
 * novo por aqui e continua de onde parou.
 *
 * ⚠️ É um POST que qualquer sessão pode disparar com qualquer número: as
 * conferências da tela da aula são refeitas aqui — sessão, plano, aula
 * publicada e vídeo do tipo enviado. Sem elas, o link assinado vazaria para
 * quem não tem a videoaula no plano.
 */
import { requireUser } from '@/lib/auth/session';

import { planoVeVideoaula } from './acesso';
import { linkRenovadoDaAula } from './aula';
import type { LinkAssinado } from './envio';

export async function renovarVideoDaAulaAction(numero: number): Promise<LinkAssinado | null> {
  const usuario = await requireUser();
  if (!planoVeVideoaula(usuario.plan)) return null;
  return linkRenovadoDaAula(numero);
}
