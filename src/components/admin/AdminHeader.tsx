/**
 * Cabeçalho do painel: quem está logado, em que ambiente, e a saída.
 *
 * Server Component: não há estado nenhum aqui. O "Sair" é um `<form>` apontando
 * para a Server Action que o app já tem — `sairAction` apaga a linha de
 * `Session`, limpa o cookie e manda para `/entrar`. Reaproveitar a ação em vez
 * de escrever outra evita o pior dos bugs possíveis nesta tela: uma saída que
 * some com o cookie e deixa a sessão viva no banco.
 *
 * O admin também é aluno (mesma conta, mesmo login): "Ver como aluno" leva ao
 * app de estudo, e o perfil de lá tem o caminho de volta para o painel.
 */
import Link from 'next/link';

import { sairAction } from '@/app/(app)/perfil/actions';
import { Button } from '@/components/ui/Button';
import type { SessionUser } from '@/lib/auth/session';

export type AdminHeaderProps = {
  usuario: SessionUser;
};

export function AdminHeader({ usuario }: AdminHeaderProps) {
  const producao = process.env.NODE_ENV === 'production';

  return (
    <header className="sticky top-0 z-20 border-b border-solid border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-4 py-3 lg:px-8">
        <div className="min-w-0">
          <p className="m-0 truncate text-[15px] font-extrabold leading-tight text-navy">
            {usuario.name}
          </p>
          <p className="m-0 truncate text-[12px] font-semibold leading-tight text-muted">
            {usuario.email}
          </p>
        </div>

        <span
          className="ml-auto flex-none rounded-pill border border-solid px-3 py-1.5 text-[11px] font-extrabold uppercase leading-none tracking-[0.1em]"
          style={
            producao
              ? { background: '#EAF2FE', borderColor: '#D6E5FB', color: '#123A86' }
              : { background: '#FEF7E0', borderColor: '#F8E7B4', color: '#6B520A' }
          }
        >
          {producao ? 'Produção' : 'Desenvolvimento'}
        </span>

        <Link
          href="/inicio"
          aria-label="Ver o app como aluno"
          className="inline-flex h-[46px] flex-none items-center justify-center rounded-pill border-[1.5px] border-solid border-border px-4 text-[15px] font-extrabold tracking-[0.03em] text-navy no-underline transition-colors duration-150 hover:bg-[#EAF2FE] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue sm:px-5"
        >
          {/* No celular o cabeçalho divide a linha com nome, ambiente e "Sair". */}
          <span className="sm:hidden">Aluno</span>
          <span className="hidden sm:inline">Ver como aluno</span>
        </Link>

        <form action={sairAction} className="flex-none">
          <Button type="submit" variant="ghost" size="md">
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}

export default AdminHeader;
