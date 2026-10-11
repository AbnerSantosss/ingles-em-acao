'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react';
import styles from './interacoes.module.css';

type WrapperProps = {
  children: ReactNode;
  className?: string;
};

/** O conteúdo nasce visível no HTML; só os itens ainda fora da tela são preparados. */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: WrapperProps & { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (
      motion.matches ||
      element.getBoundingClientRect().top < window.innerHeight
    )
      return;

    element.dataset.reveal = 'waiting';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.reveal = 'visible';
        observer.unobserve(element);
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' },
    );
    const showWithoutMotion = () => {
      if (!motion.matches) return;
      element.dataset.reveal = 'visible';
      observer.disconnect();
    };

    observer.observe(element);
    motion.addEventListener('change', showWithoutMotion);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', showWithoutMotion);
      delete element.dataset.reveal;
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${className ?? ''}`}
      style={
        {
          '--reveal-delay': `${Math.min(Math.max(delay, 0), 500)}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** Balões recuam à esquerda; cards de foto respondem às quatro margens. */
export function BalaoComPerspectiva({
  children,
  className,
  todasAsMargens = false,
}: WrapperProps & { todasAsMargens?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    const element = ref.current;
    element?.style.setProperty('--tilt-x', '0deg');
    element?.style.setProperty('--tilt-y', '0deg');
  };

  const incline = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    const y = Math.min(
      1,
      Math.max(0, (event.clientY - rect.top) / rect.height),
    );
    element.style.setProperty(
      '--tilt-y',
      `${todasAsMargens ? (x - 0.5) * 10 : -Math.max(0, 1 - x * 2) * 5}deg`,
    );
    element.style.setProperty(
      '--tilt-x',
      `${(0.5 - y) * (todasAsMargens ? 10 : 2)}deg`,
    );
  };

  return (
    <div
      ref={ref}
      className={`${styles.balao} ${className ?? ''}`}
      onPointerMove={incline}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}
