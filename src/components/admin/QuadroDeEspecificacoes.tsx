/**
 * Quadro de especificações — o que o arquivo precisa ter **antes** de ser
 * enviado: formatos, tamanho máximo, proporção, dimensões, peso alvo.
 *
 * ⚠️ Não recebe texto solto: recebe as linhas montadas por
 * `@/lib/media/especificacoes`, que lê as mesmas constantes da validação.
 * Assim o quadro nunca promete um limite diferente do que o servidor aplica.
 *
 * Componente de apresentação puro (sem estado): serve a Server e Client
 * Components.
 */
import type { LinhaDeEspecificacao } from '@/lib/media/especificacoes';

export function QuadroDeEspecificacoes({
  titulo,
  linhas,
  className = '',
}: {
  titulo: string;
  linhas: LinhaDeEspecificacao[];
  className?: string;
}) {
  return (
    <section
      aria-label={titulo}
      className={`rounded-field border border-border bg-bg px-4 py-3 ${className}`}
    >
      <p className="kicker m-0 mb-2">{titulo}</p>
      <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-[max-content_1fr]">
        {linhas.map((linha) => (
          <div key={linha.rotulo} className="contents">
            <dt className="text-[13px] font-extrabold text-navy">{linha.rotulo}</dt>
            <dd className="m-0 text-[13px] font-semibold leading-snug text-muted">{linha.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default QuadroDeEspecificacoes;
