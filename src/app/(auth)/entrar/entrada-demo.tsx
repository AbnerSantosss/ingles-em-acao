'use client';

/**
 * Botões "Entrar como aluno" / "Entrar como admin" — TEMPORÁRIO, só em dev.
 * A página só renderiza este bloco fora de produção, e a ação recusa em
 * produção de qualquer forma (ver `../dev-actions.ts`).
 */
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';

import { entradaDemoAction } from '../dev-actions';

function Botao({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="accent" size="md" fullWidth loading={pending} loadingLabel="ENTRANDO...">
      {children}
    </Button>
  );
}

export function EntradaDemo() {
  return (
    <section
      aria-label="Acesso rápido de desenvolvimento"
      className="mt-6 rounded-[16px] border-[1.5px] border-dashed border-navy/30 p-4"
    >
      <p className="mb-3 text-center text-[13px] font-bold uppercase tracking-[0.06em] text-muted">
        Acesso rápido (só em desenvolvimento)
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <form action={entradaDemoAction.bind(null, 'aluno')} className="flex-1">
          <Botao>ENTRAR COMO ALUNO</Botao>
        </form>
        <form action={entradaDemoAction.bind(null, 'admin')} className="flex-1">
          <Botao>ENTRAR COMO ADMIN</Botao>
        </form>
      </div>
    </section>
  );
}
