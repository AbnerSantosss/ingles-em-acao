import Image from 'next/image';
import Link from 'next/link';

import type { LessonSummary } from '@/lib/content/lessons';
import { cn } from '@/lib/ui/cn';

/**
 * O card navy de "próxima aula" da Home, fiel ao design do Claude Designer:
 * a capa da aula ao fundo (`cover`, cadastrada no painel ou a arte estática),
 * com a foto do Big Ben do design como reserva quando a aula ainda não tem
 * capa; gradiente por cima para o texto continuar legível, o CTA amarelo e, à
 * direita, a pílula de tempo e o "Small steps big results" manuscrito.
 *
 * Como no design, a coluna da direita quebra para baixo do texto quando não há
 * largura (`flex-wrap`) — é o que acontece no mobile.
 */
export type NextLessonCardProps = {
  /** Sem `pageCount`: a Home recebe o resumo publicado, que não conta páginas. */
  lesson: Omit<LessonSummary, 'pageCount'>;
  /** Destino do botão. Padrão: a página da aula. */
  href?: string;
  /** Rótulo do botão. Padrão: "CONTINUAR AULA". */
  label?: string;
  className?: string;
};

/** Gradiente que garante contraste do texto sobre a foto (design). */
const VEU =
  'linear-gradient(90deg,#0A1F4E 30%, rgba(10,31,78,.72) 52%, rgba(10,31,78,.18) 78%, rgba(10,31,78,.05))';

export function NextLessonCard({
  lesson,
  href,
  label = 'CONTINUAR AULA',
  className,
}: NextLessonCardProps) {
  const destino = href ?? `/aula/${lesson.slug}`;
  const capa = lesson.cover ?? null;

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[22px] bg-navy shadow-[0_14px_40px_rgba(11,31,75,0.18)]',
        className,
      )}
    >
      <Image
        src={capa ?? '/brand/bigben.png'}
        alt=""
        fill
        priority
        // A capa é uma faixa 3:1; no celular o card fica mais alto que largo e o
        // `object-cover` amplia uma fatia central — então pede a versão grande.
        sizes={capa ? '(max-width: 1024px) 300vw, 1024px' : '(max-width: 1024px) 100vw, 1024px'}
        // Só a arte estática de /public passa pelo otimizador: upload do painel
        // (/midia, rota própria) e URL https externa vão direto.
        unoptimized={capa !== null && (capa.startsWith('/midia/') || !capa.startsWith('/'))}
        className={cn('object-cover', capa ? 'object-center' : 'object-[center_70%]')}
      />
      <div className="absolute inset-0" style={{ background: VEU }} />

      <div className="relative flex flex-wrap items-start gap-5 px-6 pb-7 pt-6 lg:px-[34px] lg:pb-9 lg:pt-[34px]">
        <div className="min-w-[240px] flex-1 lg:min-w-[260px]">
          <p className="m-0 mb-3 text-[14px] font-extrabold tracking-[0.14em] text-yellow lg:text-[17px]">
            PRÓXIMA AULA
          </p>

          <h2 className="m-0 mb-2 text-[clamp(28px,7.5vw,40px)] font-black leading-[1.08] tracking-[-0.02em] text-white text-pretty">
            {lesson.code} — {lesson.title}
          </h2>

          <p className="m-0 mb-[26px] text-[16px] text-[#C9D6EC] lg:text-[19px]">
            {lesson.subtitle}
          </p>

          <Link
            href={destino}
            className={cn(
              'inline-flex items-center gap-4 rounded-pill bg-yellow px-[22px] py-4 lg:px-[26px] lg:py-[18px]',
              'text-[16px] font-black tracking-[0.02em] text-navy lg:text-[19px]',
              'shadow-[0_10px_26px_rgba(246,201,69,0.34)]',
              'transition-colors duration-150 hover:bg-[#FFD75C] hover:text-navy',
            )}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 4.5v15l13-7.5-13-7.5Z" />
            </svg>
            {label}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="ml-2.5"
            >
              <path d="M4 12h15" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="ml-auto flex flex-col items-end gap-[34px]">
          <div className="flex items-center gap-2.5 rounded-pill border border-solid border-white/20 bg-[rgba(12,38,92,0.82)] px-5 py-[11px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.3"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </svg>
            <span className="whitespace-nowrap text-[15px] font-extrabold text-white lg:text-[17px]">
              {lesson.time}
            </span>
          </div>

          <div aria-hidden="true" className="rotate-[-7deg] text-center">
            <div className="manuscrito text-[30px] leading-[1.05] text-white lg:text-[38px]">
              Small
              <br />
              steps
              <br />
              big results
            </div>
            <div className="mt-1 h-1 w-[150px] rounded-pill bg-yellow" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default NextLessonCard;
