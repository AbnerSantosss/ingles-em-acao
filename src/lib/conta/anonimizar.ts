/**
 * Exclusão de conta de aluno — **anonimização**, não `DELETE` (LGPD, art. 18, VI).
 *
 * ⚠️ MÓDULO DE SERVIDOR (Prisma + Argon2 nativo).
 *
 * É o único núcleo de exclusão do produto. Os dois caminhos chegam aqui:
 * "Excluir minha conta" no `/perfil` (o próprio aluno, com a senha) e
 * "Anonimizar conta" em `/admin/alunos/[id]` (o admin, com motivo). Quem chama
 * cuida de autenticar e de auditar; este arquivo só faz a transformação — numa
 * transação só, ou tudo ou nada.
 *
 * ## O que acontece com cada dado
 *
 * **A linha de `User` fica.** `Payment.userId` é FK `RESTRICT` de propósito: o
 * pagamento é registro fiscal e de suporte (estorno, chargeback, nota) e precisa
 * continuar apontando para "a conta que comprou", mesmo que ninguém mais saiba
 * quem era. Apagar a linha seria impossível (a FK recusa) ou exigiria soltar o
 * pagamento — e aí some a prova de que aquela compra teve um dono.
 *
 * Na linha que fica, tudo o que identifica a pessoa é trocado:
 *
 * - `email` → `excluida-<id>-<8 hex aleatórios>@conta-excluida.invalid`. O
 *   endereço original fica **livre para um cadastro novo** (a coluna é `@unique`).
 *   O TLD `.invalid` é reservado (RFC 2606 / RFC 6761): nenhum e-mail enviado
 *   por engano para esse endereço sai do servidor de correio. O endereço passa
 *   no `z.email()` do cadastro, então nada que valide a linha depois quebra. O
 *   sufixo aleatório existe porque o cadastro aceita qualquer e-mail
 *   sintaticamente válido: sem ele, alguém que soubesse o id de uma conta
 *   poderia registrar antes o endereço-marcador e travar a exclusão dela.
 * - `name` → {@link NOME_DE_CONTA_EXCLUIDA}.
 * - `photoUrl` → `null`. Hoje a foto é só uma URL; ⚠️ quando existir upload de
 *   foto, o arquivo também precisa ser apagado aqui.
 * - `emailVerifiedAt` → `null`.
 * - `passwordHash` → Argon2id de um token aleatório de 256 bits que ninguém
 *   conhece e que não é guardado. A senha antiga deixa de bater; a coluna
 *   continua obrigatória e em formato válido.
 * - `paymentRef` → `null`. Um evento de pagamento que chegar depois com a
 *   referência antiga não acha dono e vira pagamento **órfão** (fica para o
 *   suporte) — em vez de reativar plano numa conta que não existe mais.
 * - `deletedAt` → agora.
 *
 * O que **fica** na linha: `id`, `role` (sempre `STUDENT`), `plan` (é dado da
 * compra, não da pessoa, e casa com os `Payment`), `createdAt`.
 *
 * **Apagados de vez:** `Session` (todas — inclusive a do próprio pedido; quem
 * chama limpa o cookie), `VerificationToken`, `LessonProgress`,
 * `ExerciseAnswer`, `StudyDay` e as linhas de `LoginAttempt` do e-mail antigo
 * (essa tabela guarda e-mail em texto e não tem FK, então a cascata não
 * alcançaria).
 *
 * **Ficam:** `Payment` (obrigação legal/fiscal — LGPD art. 16, I) e `AuditLog`
 * (append-only; a trilha de "quem fez o quê" inclui o próprio pedido de
 * exclusão, que é a prova de que ele foi atendido). A auditoria guarda o
 * `actorEmail` congelado das ações em que o aluno foi o ator — decisão aceita:
 * é o vínculo mínimo para responder a uma reclamação ou a uma autoridade.
 *
 * ## Regras
 *
 * - **ADMIN é recusado.** Um administrador precisa ser rebaixado antes (por
 *   outro admin, no painel): anonimizar a própria conta de admin pelo painel
 *   poderia deixar o produto sem ninguém que o administre, e apagaria o nome de
 *   quem assina a trilha de auditoria das aulas.
 * - **Idempotente.** Conta já excluída não é reescrita (o marcador e a data da
 *   primeira exclusão ficam), mas a varredura de sessões, tokens e dados de
 *   estudo roda de novo: se algo tiver sobrado por uma corrida (um login
 *   concorrente criando sessão, por exemplo), a segunda chamada limpa. O estado
 *   final é sempre o mesmo.
 * - **Corrida.** O `UPDATE` é condicional (`deletedAt IS NULL AND role =
 *   STUDENT`): se duas exclusões chegarem juntas, só uma reescreve a linha; a
 *   outra vê `count = 0`, relê e segue pelo caminho idempotente.
 */
import { randomBytes } from 'node:crypto';

import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';

/** O nome que substitui o do aluno. */
export const NOME_DE_CONTA_EXCLUIDA = 'Conta excluída';

/** Domínio dos endereços-marcadores. `.invalid` nunca entrega e-mail. */
export const DOMINIO_DE_CONTA_EXCLUIDA = 'conta-excluida.invalid';

/** O e-mail que ocupa o lugar do original — único por conta e imprevisível. */
export function emailDeContaExcluida(userId: string): string {
  const sufixo = randomBytes(4).toString('hex');
  return `excluida-${userId.toLowerCase()}-${sufixo}@${DOMINIO_DE_CONTA_EXCLUIDA}`;
}

/** Diz se um e-mail é um marcador de conta excluída. */
export function ehEmailDeContaExcluida(email: string): boolean {
  return typeof email === 'string' && email.toLowerCase().endsWith(`@${DOMINIO_DE_CONTA_EXCLUIDA}`);
}

/** Quantas linhas saíram de cada tabela. Só números — nada de dado pessoal. */
export type DadosApagados = {
  sessoes: number;
  tokens: number;
  progresso: number;
  respostas: number;
  diasDeEstudo: number;
  tentativasDeLogin: number;
};

export type ResultadoDaAnonimizacao =
  | {
      ok: true;
      /** A conta já estava excluída antes desta chamada (nada foi reescrito na linha). */
      jaEstavaExcluida: boolean;
      /** Quando a conta foi excluída — a data da primeira exclusão, se repetida. */
      excluidaEm: Date;
      apagados: DadosApagados;
    }
  | { ok: false; motivo: 'nao-encontrada' | 'administrador' };

/**
 * Anonimiza a conta de um aluno. Ver as decisões no cabeçalho do módulo.
 *
 * Não autentica nem audita: quem chama já sabe quem pediu e por quê. Lança só
 * em erro de banco (a transação volta inteira; nada fica pela metade).
 */
export async function anonimizarConta(userId: string): Promise<ResultadoDaAnonimizacao> {
  // O Argon2 custa dezenas de milissegundos: fica fora da transação para não
  // segurar a trava da linha à toa. O token cru morre aqui, sem ser guardado.
  const hashInutil = await hashPassword(generateToken());
  const agora = new Date();

  return prisma.$transaction(async (tx): Promise<ResultadoDaAnonimizacao> => {
    const conta = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, deletedAt: true },
    });

    if (!conta) return { ok: false, motivo: 'nao-encontrada' };
    if (conta.role === 'ADMIN') return { ok: false, motivo: 'administrador' };

    let jaEstavaExcluida = conta.deletedAt !== null;
    let excluidaEm = conta.deletedAt ?? agora;

    if (!jaEstavaExcluida) {
      const { count } = await tx.user.updateMany({
        where: { id: conta.id, role: 'STUDENT', deletedAt: null },
        data: {
          name: NOME_DE_CONTA_EXCLUIDA,
          email: emailDeContaExcluida(conta.id),
          photoUrl: null,
          emailVerifiedAt: null,
          passwordHash: hashInutil,
          paymentRef: null,
          deletedAt: agora,
        },
      });

      if (count !== 1) {
        // Outra requisição mexeu na linha entre a leitura e o UPDATE.
        const agoraMesmo = await tx.user.findUnique({
          where: { id: conta.id },
          select: { role: true, deletedAt: true },
        });
        if (!agoraMesmo) return { ok: false, motivo: 'nao-encontrada' };
        if (agoraMesmo.role === 'ADMIN') return { ok: false, motivo: 'administrador' };
        jaEstavaExcluida = true;
        excluidaEm = agoraMesmo.deletedAt ?? agora;
      }
    }

    // A varredura roda nos dois caminhos (ver "Idempotente" no cabeçalho).
    // Em sequência, não em `Promise.all`: a transação interativa usa uma conexão
    // só, e consultas paralelas nela não são suportadas pelo Prisma.
    const sessoes = await tx.session.deleteMany({ where: { userId: conta.id } });
    const tokens = await tx.verificationToken.deleteMany({ where: { userId: conta.id } });
    const progresso = await tx.lessonProgress.deleteMany({ where: { userId: conta.id } });
    const respostas = await tx.exerciseAnswer.deleteMany({ where: { userId: conta.id } });
    const diasDeEstudo = await tx.studyDay.deleteMany({ where: { userId: conta.id } });
    // `conta.email` é o e-mail lido ANTES do UPDATE: o original, na primeira
    // exclusão; o marcador, numa repetição (e aí não há o que apagar). O
    // `recordLoginAttempt` grava o e-mail normalizado (aparado, minúsculo, até
    // 254 caracteres), então a comparação é exata contra essa mesma forma — o
    // que também cobre uma conta antiga criada fora do cadastro com outra grafia.
    // ⚠️ Nunca `mode: 'insensitive'` aqui: o Prisma compila para `ILIKE`, e `_`
    // (válido em e-mail) e `%` viram curinga — excluir `a_b@x.com` apagaria as
    // tentativas de `axb@x.com` e zeraria o bloqueio por senha errada de outra
    // pessoa.
    const tentativasDeLogin = await tx.loginAttempt.deleteMany({
      where: { email: conta.email.trim().toLowerCase().slice(0, 254) },
    });

    return {
      ok: true,
      jaEstavaExcluida,
      excluidaEm,
      apagados: {
        sessoes: sessoes.count,
        tokens: tokens.count,
        progresso: progresso.count,
        respostas: respostas.count,
        diasDeEstudo: diasDeEstudo.count,
        tentativasDeLogin: tentativasDeLogin.count,
      },
    };
  });
}
