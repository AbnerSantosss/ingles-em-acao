/**
 * As Server Actions de `/admin/alunos` diante de uma conta anonimizada.
 *
 * A tela do aluno excluído só mostra o bloco "Conta anonimizada" — mas uma
 * action é um POST público: a página aberta antes da exclusão (ou um POST
 * montado à mão) ainda chega nela. O que se prova aqui é a tranca no servidor:
 * nem troca de plano nem reenvio de verificação mexem numa conta excluída.
 *
 * Também cobre "Acesso de administrador": a regra pura (`bloqueioDeAcesso`) e a
 * action contra o banco de teste.
 *
 * Dublês: a sessão de admin (`requireAdmin`), o `revalidatePath`, a auditoria
 * (append-only — um teste não deixa linha nela) e os envios de e-mail.
 *
 * Fixtures: usuários `acoes-<aleatório>-<n>@teste.local`, apagados no
 * `afterAll` pelos próprios ids.
 */
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const dubles = vi.hoisted(() => ({
  auditar: vi.fn(async () => {}),
  enviarVerificacao: vi.fn(async () => ({ ok: true })),
  alertar: vi.fn(async () => ({ enviado: true, destinatarios: 1, falhas: 0 })),
  alertarAcesso: vi.fn(async () => ({ enviado: true, destinatarios: 1, falhas: 0 })),
  /** Quem a sessão de admin diz ser. Um teste troca para "ser" uma fixture. */
  adminId: 'admin-duble',
}));

vi.mock('@/lib/admin/guard', () => ({
  requireAdmin: async () => ({
    id: dubles.adminId,
    name: 'Admin Dublê',
    email: 'admin-duble@teste.local',
    photoUrl: null,
    role: 'ADMIN',
    plan: 'PREMIUM',
    emailVerifiedAt: new Date(),
  }),
}));
vi.mock('next/cache', () => ({ revalidatePath: () => {} }));
vi.mock('@/lib/admin/audit', () => ({ auditar: dubles.auditar }));
vi.mock('@/lib/mail/send', () => ({ sendVerificationEmail: dubles.enviarVerificacao }));
vi.mock('@/lib/mail/admin-alertas', () => ({
  alertarMudancaDePlano: dubles.alertar,
  alertarMudancaDeAcesso: dubles.alertarAcesso,
}));

import {
  anonimizarContaAction,
  mudarAcessoDeAdminAction,
  mudarPlanoAction,
  reenviarVerificacaoAction,
} from '@/app/(admin)/admin/alunos/actions';
import { FORMULARIO_INICIAL } from '@/app/(admin)/admin/alunos/tipos';
import { bloqueioDeAcesso } from '@/lib/admin/alunos';
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/db';

const PREFIXO = `acoes-${randomBytes(4).toString('hex')}`;
const usuariosCriados: string[] = [];
let sequencia = 0;
let hashDaSenha = '';

async function criarAluno(
  dados: { excluida?: boolean; verificada?: boolean; admin?: boolean } = {},
) {
  sequencia += 1;
  const usuario = await prisma.user.create({
    data: {
      name: 'Fixture das Ações',
      email: `${PREFIXO}-${sequencia}@teste.local`,
      passwordHash: hashDaSenha,
      plan: 'ESSENCIAL',
      role: dados.admin ? 'ADMIN' : 'STUDENT',
      emailVerifiedAt: dados.verificada || dados.admin ? new Date() : null,
      deletedAt: dados.excluida ? new Date() : null,
    },
  });
  usuariosCriados.push(usuario.id);
  return usuario;
}

function formulario(campos: Record<string, string>): FormData {
  const dados = new FormData();
  for (const [chave, valor] of Object.entries(campos)) dados.set(chave, valor);
  return dados;
}

beforeAll(async () => {
  hashDaSenha = await hashPassword('senha da fixture 123');
});

beforeEach(() => {
  dubles.auditar.mockClear();
  dubles.enviarVerificacao.mockClear();
  dubles.alertar.mockClear();
  dubles.alertarAcesso.mockClear();
  dubles.adminId = 'admin-duble';
});

afterAll(async () => {
  // Tokens e sessões saem em cascata com o usuário.
  await prisma.user.deleteMany({ where: { id: { in: usuariosCriados } } });
});

describe('conta anonimizada no painel', () => {
  it('não troca o plano nem manda alerta', async () => {
    const aluno = await criarAluno({ excluida: true });

    const estado = await mudarPlanoAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, plano: 'PREMIUM', motivo: 'teste da tranca' }),
    );

    expect(estado.estado).toBe('erro');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).plan).toBe(
      'ESSENCIAL',
    );
    expect(dubles.alertar).not.toHaveBeenCalled();
    expect(dubles.auditar).not.toHaveBeenCalled();
  });

  it('não cria token nem manda e-mail de verificação', async () => {
    const aluno = await criarAluno({ excluida: true });

    const estado = await reenviarVerificacaoAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id }),
    );

    expect(estado.estado).toBe('erro');
    expect(await prisma.verificationToken.count({ where: { userId: aluno.id } })).toBe(0);
    expect(dubles.enviarVerificacao).not.toHaveBeenCalled();
  });

  it('conta ativa continua funcionando (a tranca não pega quem não foi excluído)', async () => {
    const aluno = await criarAluno();

    const plano = await mudarPlanoAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, plano: 'PREMIUM', motivo: 'teste da tranca' }),
    );
    const reenvio = await reenviarVerificacaoAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id }),
    );

    expect(plano.estado).toBe('ok');
    expect(reenvio.estado).toBe('ok');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).plan).toBe('PREMIUM');
    expect(await prisma.verificationToken.count({ where: { userId: aluno.id } })).toBe(1);
  });
});

describe('anonimizarContaAction', () => {
  it('confere a caixa de confirmação no servidor, não só na tela', async () => {
    const aluno = await criarAluno();

    const estado = await anonimizarContaAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, motivo: 'pedido por e-mail ao suporte' }),
    );

    expect(estado).toMatchObject({ estado: 'erro', campos: { confirmacao: expect.any(String) } });
    const depois = await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } });
    expect(depois.deletedAt).toBeNull();
    expect(depois.email).toBe(aluno.email);
  });

  it('anonimiza e audita só números, sem nome nem e-mail do aluno', async () => {
    const aluno = await criarAluno();

    const estado = await anonimizarContaAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, motivo: 'pedido por e-mail ao suporte', confirmacao: 'sim' }),
    );

    expect(estado.estado).toBe('ok');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).deletedAt).not.toBeNull();
    expect(dubles.auditar).toHaveBeenCalledTimes(1);
    const registro = JSON.stringify(dubles.auditar.mock.calls[0]);
    expect(registro).toContain('user.anonymize');
    expect(registro).not.toContain(aluno.email);
    expect(registro).not.toContain(aluno.name);
  });
});

describe('bloqueioDeAcesso', () => {
  const aluno = { id: 'conta-1', role: 'STUDENT' as const, emailVerificado: true };
  const admin = { id: 'conta-1', role: 'ADMIN' as const, emailVerificado: true };

  it('dá o acesso a quem confirmou o e-mail', () => {
    expect(
      bloqueioDeAcesso({ conta: aluno, destino: 'ADMIN', adminId: 'outro', adminsAtivos: 1 }),
    ).toBeNull();
  });

  it('não dá o acesso a quem não confirmou o e-mail', () => {
    expect(
      bloqueioDeAcesso({
        conta: { ...aluno, emailVerificado: false },
        destino: 'ADMIN',
        adminId: 'outro',
        adminsAtivos: 1,
      }),
    ).toMatch(/confirmou o e-mail/);
  });

  it('recusa pedir o papel que a conta já tem', () => {
    expect(
      bloqueioDeAcesso({ conta: admin, destino: 'ADMIN', adminId: 'outro', adminsAtivos: 2 }),
    ).toMatch(/já é de administrador/);
    expect(
      bloqueioDeAcesso({ conta: aluno, destino: 'STUDENT', adminId: 'outro', adminsAtivos: 2 }),
    ).toMatch(/já não é/);
  });

  it('ninguém tira o próprio acesso', () => {
    expect(
      bloqueioDeAcesso({ conta: admin, destino: 'STUDENT', adminId: admin.id, adminsAtivos: 3 }),
    ).toMatch(/próprio acesso/);
  });

  it('a última conta de admin não perde o acesso', () => {
    expect(
      bloqueioDeAcesso({ conta: admin, destino: 'STUDENT', adminId: 'outro', adminsAtivos: 1 }),
    ).toMatch(/única conta de administrador/);
  });

  it('tira o acesso de outro admin quando sobra alguém', () => {
    expect(
      bloqueioDeAcesso({ conta: admin, destino: 'STUDENT', adminId: 'outro', adminsAtivos: 2 }),
    ).toBeNull();
  });
});

describe('mudarAcessoDeAdminAction', () => {
  it('dá o acesso, audita com o motivo e manda o alerta', async () => {
    const aluno = await criarAluno({ verificada: true });

    const estado = await mudarAcessoDeAdminAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, papel: 'ADMIN', motivo: 'entrou na equipe' }),
    );

    expect(estado.estado).toBe('ok');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).role).toBe('ADMIN');
    expect(dubles.auditar).toHaveBeenCalledTimes(1);
    expect(dubles.auditar.mock.calls[0]).toMatchObject([
      {
        action: 'user.role.change',
        before: { role: 'STUDENT' },
        after: { role: 'ADMIN' },
        reason: 'entrou na equipe',
      },
    ]);
    expect(dubles.alertarAcesso).toHaveBeenCalledWith(
      expect.objectContaining({ contaId: aluno.id, deuAcesso: true, motivo: 'entrou na equipe' }),
    );
  });

  it('não dá o acesso a conta com e-mail não confirmado', async () => {
    const aluno = await criarAluno();

    const estado = await mudarAcessoDeAdminAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, papel: 'ADMIN', motivo: 'entrou na equipe' }),
    );

    expect(estado.estado).toBe('erro');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).role).toBe('STUDENT');
    expect(dubles.alertarAcesso).not.toHaveBeenCalled();
    expect(dubles.auditar.mock.calls[0]).toMatchObject([{ outcome: 'DENY' }]);
  });

  it('exige o motivo', async () => {
    const aluno = await criarAluno({ verificada: true });

    const estado = await mudarAcessoDeAdminAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, papel: 'ADMIN', motivo: '' }),
    );

    expect(estado).toMatchObject({ estado: 'erro', campos: { motivo: expect.any(String) } });
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).role).toBe('STUDENT');
  });

  it('tira o acesso de outro admin, e a conta segue como aluno', async () => {
    const eu = await criarAluno({ admin: true });
    const outro = await criarAluno({ admin: true });
    dubles.adminId = eu.id;

    const estado = await mudarAcessoDeAdminAction(
      FORMULARIO_INICIAL,
      formulario({ id: outro.id, papel: 'STUDENT', motivo: 'saiu da equipe' }),
    );

    expect(estado.estado).toBe('ok');
    const depois = await prisma.user.findUniqueOrThrow({ where: { id: outro.id } });
    expect(depois.role).toBe('STUDENT');
    expect(depois.plan).toBe('ESSENCIAL');
    expect(dubles.alertarAcesso).toHaveBeenCalledWith(
      expect.objectContaining({ contaId: outro.id, deuAcesso: false }),
    );
  });

  it('não deixa o admin tirar o próprio acesso', async () => {
    const eu = await criarAluno({ admin: true });
    await criarAluno({ admin: true });
    dubles.adminId = eu.id;

    const estado = await mudarAcessoDeAdminAction(
      FORMULARIO_INICIAL,
      formulario({ id: eu.id, papel: 'STUDENT', motivo: 'engano meu' }),
    );

    expect(estado.estado).toBe('erro');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: eu.id } })).role).toBe('ADMIN');
    expect(dubles.alertarAcesso).not.toHaveBeenCalled();
  });

  it('não mexe em conta anonimizada', async () => {
    const aluno = await criarAluno({ excluida: true, verificada: true });

    const estado = await mudarAcessoDeAdminAction(
      FORMULARIO_INICIAL,
      formulario({ id: aluno.id, papel: 'ADMIN', motivo: 'teste da tranca' }),
    );

    expect(estado.estado).toBe('erro');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: aluno.id } })).role).toBe('STUDENT');
  });
});
