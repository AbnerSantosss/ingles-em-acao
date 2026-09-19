/**
 * `/redefinir-senha?token=...` — criar a senha nova.
 *
 * A página faz uma conferência **somente leitura** do token antes de mostrar o
 * formulário: quem chega com um link vencido merece saber disso na hora, e não
 * depois de escolher e digitar duas vezes uma senha nova.
 *
 * ⚠️ Conferir não é gastar. Quem gasta o token é a Server Action, no envio
 * (`consumeVerificationToken`). Se esta página o consumisse, um pré-carregador
 * de link — os que rodam dentro de clientes de e-mail e antivírus — queimaria o
 * token antes de a pessoa abrir a tela.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import { safeNext } from '@/lib/auth/next-url';
import { hashToken, pareceToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';
import { V } from '@/lib/ui/palette';

import { FormularioDeNovaSenha } from './form';

export const metadata: Metadata = {
  title: 'Criar uma nova senha',
  description: 'Escolha a nova senha da sua conta do WSA English.',
};

type Busca = Record<string, string | string[] | undefined>;

function primeiro(valor: string | string[] | undefined): string | null {
  if (Array.isArray(valor)) return valor[0] ?? null;
  return valor ?? null;
}

/** `aceitavel` quer dizer "vale a pena mostrar o formulário", não "é válido". */
async function conferirToken(token: string | null): Promise<{
  aceitavel: boolean;
  motivo: 'sem-token' | 'invalido' | 'expirado' | 'usado' | null;
}> {
  if (!token) return { aceitavel: false, motivo: 'sem-token' };
  if (!pareceToken(token)) return { aceitavel: false, motivo: 'invalido' };

  try {
    const registro = await prisma.verificationToken.findUnique({
      where: { tokenHash: hashToken(token) },
      select: { type: true, expiresAt: true, usedAt: true },
    });

    if (!registro || registro.type !== 'PASSWORD_RESET') {
      return { aceitavel: false, motivo: 'invalido' };
    }
    if (registro.usedAt !== null) return { aceitavel: false, motivo: 'usado' };
    if (registro.expiresAt.getTime() <= Date.now()) {
      return { aceitavel: false, motivo: 'expirado' };
    }

    return { aceitavel: true, motivo: null };
  } catch {
    // Banco fora do ar: mostrar o formulário é a aposta mais gentil. Quem
    // decide de verdade é a ação, que confere de novo no envio.
    return { aceitavel: true, motivo: null };
  }
}

const EXPLICACOES: Record<'sem-token' | 'invalido' | 'expirado' | 'usado', string> = {
  'sem-token':
    'Este endereço veio sem o código de redefinição. Abra o link direto do e-mail que enviamos, sem copiar só um pedaço.',
  invalido:
    'Não reconhecemos este link de redefinição. Ele pode ter sido cortado pelo programa de e-mail no caminho.',
  expirado:
    'Este link venceu. Por segurança, ele vale só por 1 hora depois do pedido.',
  usado:
    'Este link já foi usado. Cada pedido de redefinição vale por uma troca de senha só.',
};

export default async function PaginaRedefinirSenha({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const busca = await searchParams;

  const token = primeiro(busca.token);
  const destino = safeNext(primeiro(busca.next));
  const { aceitavel, motivo } = await conferirToken(token);

  if (!aceitavel && motivo) {
    return (
      <div className="flex flex-col items-center text-center">
        <span
          className="grid h-[68px] w-[68px] place-items-center rounded-full"
          style={{ background: V.red.bg, color: V.red.fg }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.4v5.2" />
            <path d="M12 16.4h.01" />
          </svg>
        </span>

        <h1 className="mt-5 text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-navy sm:text-[30px]">
          Esse link não vale mais
        </h1>

        <p className="mt-3 text-[17px] leading-[1.5] text-muted">{EXPLICACOES[motivo]}</p>

        <p className="mt-3 text-[15px] leading-[1.5] text-muted-2">
          Sua senha atual continua valendo. Peça um link novo para trocá-la.
        </p>

        <Link
          href="/esqueci-senha"
          className="mt-7 inline-flex h-[54px] w-full items-center justify-center rounded-pill bg-navy px-7 text-[17px] font-extrabold tracking-[0.03em] text-white transition-colors duration-150 hover:bg-navy-light"
        >
          PEDIR UM LINK NOVO
        </Link>

        <Link
          href="/entrar"
          className="mt-4 inline-flex min-h-[44px] items-center text-[16px] font-bold text-link underline-offset-4 hover:text-link-hover hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return <FormularioDeNovaSenha token={token ?? ''} next={destino} />;
}
