import type { CSSProperties } from 'react';

import { cn } from '@/lib/ui/cn';

/**
 * O anel de progresso do protótipo: trilho cinza, arco teal, percentual no
 * centro e a contagem de aulas embaixo.
 *
 * O arco é desenhado com `stroke-dasharray` (o comprimento total do círculo) e
 * `stroke-dashoffset` (quanto falta para fechar). A entrada anima o offset do
 * círculo inteiro até o valor final — o anel "se preenche" quando a tela abre.
 */
export type ProgressRingProps = {
  /** Percentual de 0 a 100. */
  pct: number;
  /** Aulas concluídas. */
  done: number;
  /** Total de aulas da trilha. */
  total: number;
  /** Lado do anel em px. 92 na Home, 116 na tela de progresso. */
  size?: number;
  /** Mostra "N de 42 aulas" abaixo do anel. */
  caption?: boolean;
  className?: string;
};

const RAIO = 50;
const ESPESSURA = 13;
/** Comprimento do traço completo — o mesmo 314,16 do protótipo. */
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function limitar(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return Math.min(100, Math.max(0, Math.round(valor)));
}

export function ProgressRing({
  pct,
  done,
  total,
  size = 92,
  caption = true,
  className,
}: ProgressRingProps) {
  const percentual = limitar(pct);
  const deslocamento = CIRCUNFERENCIA - (percentual / 100) * CIRCUNFERENCIA;

  // Unidades explícitas: dentro de um keyframe o valor passa por `var()`, e um
  // número sem unidade não é um comprimento CSS válido (1px = 1 unidade do
  // viewBox, que é exatamente o que o arco precisa).
  const estiloDoArco = {
    strokeDasharray: `${CIRCUNFERENCIA}px`,
    strokeDashoffset: `${deslocamento}px`,
    '--iea-anel-total': `${CIRCUNFERENCIA}px`,
    animation: 'iea-anel-entrada 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
  } as CSSProperties;

  return (
    <div
      className={cn('flex flex-col items-center gap-2', className)}
      role="img"
      aria-label={`${percentual}% da trilha concluída — ${done} de ${total} aulas`}
    >
      {/*
        Keyframes locais do componente. O React 19 move esta folha para o
        <head> e a deduplica pelo `href`, então o anel não depende do
        globals.css (que é de outro agente) nem repete a regra por instância.
      */}
      <style href="iea-anel-entrada" precedence="default">
        {'@keyframes iea-anel-entrada{from{stroke-dashoffset:var(--iea-anel-total)}}'}
      </style>

      <div className="relative flex-none" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r={RAIO}
            fill="none"
            stroke="var(--border)"
            strokeWidth={ESPESSURA}
          />
          <circle
            cx="60"
            cy="60"
            r={RAIO}
            fill="none"
            stroke="var(--teal)"
            strokeWidth={ESPESSURA}
            // Ponta arredondada some quando não há arco nenhum: com 0% o
            // `round` desenharia um pontinho teal fingindo progresso.
            strokeLinecap={percentual > 0 ? 'round' : 'butt'}
            transform="rotate(-90 60 60)"
            style={estiloDoArco}
          />
        </svg>

        <div
          className="absolute inset-0 grid place-items-center font-black text-navy"
          style={{ fontSize: Math.round(size * 0.23) }}
        >
          {percentual}%
        </div>
      </div>

      {caption ? (
        <p className="m-0 text-center text-[15px] font-extrabold leading-tight text-navy">
          {done} de {total} aulas
        </p>
      ) : null}
    </div>
  );
}

export default ProgressRing;
