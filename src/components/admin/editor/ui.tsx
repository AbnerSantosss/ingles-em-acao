/**
 * Peças pequenas e repetidas do editor: recado de resultado, botão de envio e
 * lista de problemas. Seguem o mesmo visual da aba Dados.
 */
'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import type { EstadoDoEditor } from '@/lib/admin/editor';

export const COR_ERRO = { fundo: '#FEF0F2', borda: '#F9D3D9', texto: '#B21F31' } as const;
export const COR_OK = { fundo: '#E4F5EA', borda: '#C5E8D2', texto: '#136B45' } as const;
export const COR_AVISO = { fundo: '#FEF7E0', borda: '#F3E2A6', texto: '#6B520A' } as const;

/** Transforma `` `campo` `` em <code>. As mensagens de validação usam crase para campos. */
export function TextoComCodigo({ texto }: { texto: string }) {
  const partes = texto.split(/(`[^`]+`)/g);
  return (
    <>
      {partes.map((parte, i) =>
        parte.startsWith('`') && parte.endsWith('`') && parte.length > 2 ? (
          <code key={i} className="rounded-[6px] bg-white/70 px-1 font-mono text-[0.92em]">
            {parte.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{parte}</span>
        ),
      )}
    </>
  );
}

export function ListaDeProblemas({
  titulo,
  itens,
  tom,
  id,
}: {
  titulo?: string;
  itens: string[];
  tom: 'erro' | 'aviso' | 'ok';
  id?: string;
}) {
  if (itens.length === 0) return null;
  const cor = tom === 'erro' ? COR_ERRO : tom === 'aviso' ? COR_AVISO : COR_OK;
  return (
    <div
      id={id}
      className="rounded-field border-[1.5px] border-solid px-3 py-2.5"
      style={{ background: cor.fundo, borderColor: cor.borda, color: cor.texto }}
    >
      {titulo ? <p className="m-0 mb-1 text-[13px] font-black">{titulo}</p> : null}
      <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-[13px] font-bold leading-snug">
        {itens.map((item, i) => (
          <li key={i}>
            <TextoComCodigo texto={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RecadoDoEditor({ estado }: { estado: EstadoDoEditor }) {
  if (estado.estado === 'inicial') return null;
  const erro = estado.estado === 'erro';
  const cor = erro ? COR_ERRO : COR_OK;
  return (
    <div role="status" className="flex flex-col gap-2">
      <p
        className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
        style={{ background: cor.fundo, color: cor.texto }}
      >
        {estado.mensagem}
      </p>
      {estado.estado === 'erro' && estado.erros ? (
        <ListaDeProblemas itens={estado.erros} tom="erro" />
      ) : null}
    </div>
  );
}

export function BotaoEnviar({
  children,
  variant = 'primary',
  disabled = false,
}: {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" variant={variant} loading={pending} disabled={disabled || pending}>
      {children}
    </Button>
  );
}

/** Botão pequeno de ação sobre um item (↑, ↓, duplicar, remover). Alvo de toque ≥ 44px. */
export function BotaoDeItem({
  children,
  rotulo,
  onClick,
  disabled = false,
  perigo = false,
}: {
  children: ReactNode;
  rotulo: string;
  onClick: () => void;
  disabled?: boolean;
  perigo?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      onClick={onClick}
      disabled={disabled}
      className="grid min-h-11 min-w-11 place-items-center rounded-[12px] border-[1.5px] border-solid border-border bg-surface px-2 text-[14px] font-extrabold transition-colors hover:border-navy-light disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border"
      style={{ color: perigo ? COR_ERRO.texto : '#0A1F4E' }}
    >
      {children}
    </button>
  );
}
