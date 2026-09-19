/**
 * O painel de "Duplicar aula": confirmação em linha, envio e o link para a cópia.
 *
 * É só o painel — quem decide quando ele aparece é quem o usa (a linha da lista
 * e a aba Dados). Fechar desmonta o painel, e o próximo abre limpo: o
 * `useActionState` não tem "zerar", e uma confirmação velha dizendo "cópia
 * criada" ao lado de um botão "Duplicar" convidaria a criar uma segunda cópia.
 */
'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';

import { duplicarAulaAction } from './actions';
import { DUPLICACAO_INICIAL } from './tipos';

function Enviar({ numero }: { numero: number }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" loading={pending} loadingLabel="Duplicando…">
      Duplicar aula {numero}
    </Button>
  );
}

export function DuplicarAula({
  aula,
  aoFechar,
}: {
  aula: { id: string; number: number; title: string };
  aoFechar: () => void;
}) {
  const [estado, enviar] = useActionState(duplicarAulaAction, DUPLICACAO_INICIAL);

  if (estado.estado === 'ok') {
    return (
      <div className="flex flex-col gap-3">
        <p
          role="status"
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={{ background: '#E4F5EA', color: '#136B45' }}
        >
          {estado.mensagem}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/aulas/${estado.numero}`}
            className="grid h-[46px] place-items-center rounded-pill bg-navy px-5 text-[15px] font-extrabold tracking-[0.03em] text-white transition-colors duration-150 hover:bg-navy-light"
          >
            Abrir a aula {estado.numero} →
          </Link>
          <Button type="button" size="md" variant="ghost" onClick={aoFechar}>
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={enviar} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={aula.id} />
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Cria uma aula nova, no próximo número livre, com uma cópia do conteúdo de{' '}
        <strong className="text-navy">
          Aula {aula.number} · {aula.title}
        </strong>{' '}
        (o publicado e o rascunho pendente, se houver). A cópia é criada{' '}
        <strong className="text-navy">em rascunho, fora do ar</strong>, e todo bloco de exercício
        ganha um id novo, para nenhuma resposta de aluno ser compartilhada com a original.
      </p>
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Não vão para a cópia: capa e vídeo (os dois mostram o número da aula de origem), progresso,
        respostas e versões. Selos e blocos de &ldquo;próxima aula&rdquo; que citam a aula{' '}
        {aula.number} ficam como estão. Revise na aba Páginas.
      </p>
      {estado.estado === 'erro' ? (
        <p
          role="status"
          className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
          style={{ background: '#FEF0F2', color: '#B21F31' }}
        >
          {estado.mensagem}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Enviar numero={aula.number} />
        <Button type="button" size="md" variant="ghost" onClick={aoFechar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default DuplicarAula;
