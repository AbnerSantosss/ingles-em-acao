'use client';

/**
 * Aviso de e-mail não confirmado, no topo da Home.
 *
 * ⚠️ Não bloqueia nada (CONTRACT §5.6): é uma faixa creme, discreta, com um
 * botão de reenvio. Quem ainda não confirmou continua estudando normalmente.
 *
 * Client Component por causa do `useActionState`: o botão precisa mostrar
 * "Enviando..." e depois a resposta do servidor sem recarregar a página.
 */
import { useActionState } from 'react';

import { reenviarVerificacaoAction } from '@/app/(app)/perfil/actions';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/ui/cn';

/**
 * Resultado de um reenvio.
 *
 * O tipo mora aqui, e não em `actions.ts`, porque um arquivo `'use server'` só
 * pode exportar funções assíncronas. A Server Action importa este tipo de volta
 * com `import type`, que some na compilação.
 */
export type EstadoDeReenvio = {
  estado: 'ocioso' | 'ok' | 'aviso' | 'erro';
  mensagem: string;
};

export const ESTADO_INICIAL_DE_REENVIO: EstadoDeReenvio = {
  estado: 'ocioso',
  mensagem: '',
};

export type VerifyEmailBannerProps = {
  /** E-mail para onde o link vai — mostrado para a pessoa conferir. */
  email: string;
  className?: string;
};

const COR_DA_MENSAGEM: Record<EstadoDeReenvio['estado'], string> = {
  ocioso: 'text-[#6B520A]',
  ok: 'text-[#136B45]',
  aviso: 'text-[#6B520A]',
  erro: 'text-danger',
};

export function VerifyEmailBanner({ email, className }: VerifyEmailBannerProps) {
  const [estado, acao, pendente] = useActionState(
    reenviarVerificacaoAction,
    ESTADO_INICIAL_DE_REENVIO,
  );

  return (
    <div
      className={cn(
        'rounded-card border-[1.5px] border-solid border-[#F8E7B4] bg-[#FEF7E0] p-4',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B67F0C"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-0.5 flex-none"
        >
          <rect x="2.8" y="5" width="18.4" height="14" rx="3" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>

        <div className="min-w-0 flex-1">
          <p className="m-0 text-[15px] font-extrabold leading-tight text-[#6B520A]">
            Confirme seu e-mail
          </p>
          <p className="m-0 mt-1 text-[14px] leading-snug text-[#8A6B12]">
            Enviamos um link para <span className="font-bold break-words">{email}</span>. Você pode
            continuar estudando enquanto isso.
          </p>

          {estado.mensagem ? (
            <p
              role="status"
              className={cn(
                'm-0 mt-2 text-[14px] font-semibold leading-snug',
                COR_DA_MENSAGEM[estado.estado],
              )}
            >
              {estado.mensagem}
            </p>
          ) : null}
        </div>

        <form action={acao} className="flex-none">
          <Button
            type="submit"
            variant="ghost"
            size="md"
            loading={pendente}
            loadingLabel="Enviando"
            // Cor do texto por style: `cn` não resolve conflito entre dois
            // utilitários de cor, e o inline sempre ganha do `text-navy` do ghost.
            style={{ color: '#6B520A' }}
          >
            Reenviar
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailBanner;
