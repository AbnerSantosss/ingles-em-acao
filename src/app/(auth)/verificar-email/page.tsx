/**
 * `/verificar-email?token=...` — confirmação do e-mail.
 *
 * Tela sem formulário: quem clica no link do e-mail já disse o que queria
 * dizer. A página gasta o token na hora e mostra o resultado.
 *
 * ⚠️ Confirmar o e-mail **não é** requisito para usar o app (contrato §5.6). Se
 * o link falhar, ninguém fica trancado do lado de fora: o botão leva para o app
 * do mesmo jeito, e o aviso da Home oferece o reenvio.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/auth/session';
import { verificarEmailSchema } from '@/lib/auth/schemas';
import { consumeVerificationToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db';
import { V } from '@/lib/ui/palette';

export const metadata: Metadata = {
  title: 'Confirmar e-mail',
  description: 'Confirmação do e-mail da sua conta do Inglês em Ação.',
};

type Busca = Record<string, string | string[] | undefined>;

type Desfecho = 'confirmado' | 'ja-confirmado' | 'sem-token' | 'invalido' | 'erro';

function primeiro(valor: string | string[] | undefined): string | null {
  if (Array.isArray(valor)) return valor[0] ?? null;
  return valor ?? null;
}

async function confirmarEmail(token: string | null): Promise<Desfecho> {
  if (!token) return 'sem-token';

  const validacao = verificarEmailSchema.safeParse({ token });
  if (!validacao.success) return 'invalido';

  try {
    const usuarioId = await consumeVerificationToken(validacao.data.token, 'EMAIL_VERIFY');

    if (!usuarioId) {
      // Token gasto, vencido ou desconhecido. Antes de dizer "não funcionou",
      // vale conferir o caso mais comum: a pessoa abriu o mesmo link duas vezes
      // e já está com o e-mail confirmado.
      const atual = await getCurrentUser();
      if (atual?.emailVerifiedAt) return 'ja-confirmado';
      return 'invalido';
    }

    await prisma.user.updateMany({
      where: { id: usuarioId, emailVerifiedAt: null },
      data: { emailVerifiedAt: new Date() },
    });

    return 'confirmado';
  } catch {
    return 'erro';
  }
}

const TEXTOS: Record<
  Desfecho,
  { titulo: string; corpo: string; rodape: string; cor: 'mint' | 'red' | 'cream' }
> = {
  confirmado: {
    titulo: 'E-mail confirmado!',
    corpo:
      'Tudo certo com o seu endereço. Agora a gente consegue te ajudar a recuperar a conta se você esquecer a senha.',
    rodape: 'Bons estudos — small steps, big results.',
    cor: 'mint',
  },
  'ja-confirmado': {
    titulo: 'Já estava confirmado',
    corpo: 'Seu e-mail já tinha sido confirmado antes. Não precisa fazer mais nada.',
    rodape: 'Pode seguir direto para a sua trilha.',
    cor: 'mint',
  },
  'sem-token': {
    titulo: 'Link incompleto',
    corpo:
      'Este endereço veio sem o código de confirmação. Abra o link direto do e-mail que enviamos, sem copiar só um pedaço.',
    rodape: 'Dentro do app, o aviso da Home reenvia o e-mail quando você quiser.',
    cor: 'cream',
  },
  invalido: {
    titulo: 'Esse link não vale mais',
    corpo:
      'O link de confirmação vale por 24 horas e só pode ser usado uma vez. Este já foi usado ou venceu.',
    rodape: 'Sem problema: seu acesso continua liberado e dá para pedir um link novo no app.',
    cor: 'cream',
  },
  erro: {
    titulo: 'Não conseguimos confirmar agora',
    corpo:
      'Deu algum problema do nosso lado ao conferir o link. Ele continua valendo — tente abrir de novo em alguns minutos.',
    rodape: 'Seu acesso ao app não foi afetado.',
    cor: 'red',
  },
};

function Icone({ sucesso }: { sucesso: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {sucesso ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.4 2.7 2.7L16 9.8" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.4v5.2" />
          <path d="M12 16.4h.01" />
        </>
      )}
    </svg>
  );
}

export default async function PaginaVerificarEmail({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const busca = await searchParams;

  const desfecho = await confirmarEmail(primeiro(busca.token));
  const texto = TEXTOS[desfecho];
  const sucesso = desfecho === 'confirmado' || desfecho === 'ja-confirmado';
  const cor = V[texto.cor];

  // Quem já está logado vai direto para o app; quem abriu o link em outro
  // aparelho (o celular, enquanto se cadastrou no computador) passa pelo login.
  const usuario = await getCurrentUser();
  const destino = usuario ? '/inicio' : '/entrar';
  const rotulo = usuario ? 'IR PARA O APP' : 'ENTRAR NA MINHA CONTA';

  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="grid h-[68px] w-[68px] place-items-center rounded-full"
        style={{ background: cor.bg, color: cor.fg }}
      >
        <Icone sucesso={sucesso} />
      </span>

      <h1 className="mt-5 text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-navy sm:text-[30px]">
        {texto.titulo}
      </h1>

      <p className="mt-3 text-[17px] leading-[1.5] text-muted">{texto.corpo}</p>

      <p className="mt-3 text-[15px] leading-[1.5] text-muted-2">{texto.rodape}</p>

      <Link
        href={destino}
        className="mt-7 inline-flex h-[54px] w-full items-center justify-center rounded-pill bg-navy px-7 text-[17px] font-extrabold tracking-[0.03em] text-white transition-colors duration-150 hover:bg-navy-light"
      >
        {rotulo}
      </Link>
    </div>
  );
}
