'use server';

/**
 * Entrada rápida de desenvolvimento: "Entrar como aluno" / "Entrar como admin".
 *
 * ⚠️ TEMPORÁRIO e SÓ EM DESENVOLVIMENTO. Server Action exportada é alcançável por
 * POST mesmo sem o botão na tela, então a trava de ambiente está **aqui dentro**,
 * não só no componente. Em produção a ação lança antes de tocar no banco.
 *
 * Cria (ou reaproveita) duas contas fixas com senha aleatória que ninguém
 * conhece — não há como entrar nelas pelo formulário, só por aqui.
 */
import { redirect } from 'next/navigation';

import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { generateToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';

export type PapelDemo = 'aluno' | 'admin';

const CONTAS_DEMO = {
  aluno: {
    email: 'aluno@dev.local',
    name: 'Aluno Demo',
    role: 'STUDENT',
    plan: 'PREMIUM',
    destino: '/inicio',
  },
  admin: {
    email: 'admin@dev.local',
    name: 'Admin Demo',
    role: 'ADMIN',
    plan: 'PREMIUM',
    destino: '/admin',
  },
} as const;

export async function entradaDemoAction(papel: PapelDemo): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Entrada de demonstração desativada em produção.');
  }

  const conta = CONTAS_DEMO[papel];
  if (!conta) throw new Error('Papel inválido.');

  const usuario = await prisma.user.upsert({
    where: { email: conta.email },
    update: { role: conta.role, plan: conta.plan },
    create: {
      email: conta.email,
      name: conta.name,
      role: conta.role,
      plan: conta.plan,
      emailVerifiedAt: new Date(),
      passwordHash: await hashPassword(generateToken()),
    },
    select: { id: true },
  });

  await createSession(usuario.id, false);

  redirect(conta.destino);
}
