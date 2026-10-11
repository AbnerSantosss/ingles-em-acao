'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './landing.module.css';

/** A demonstração começa quando o terceiro passo entra na tela. */
export function BarraDeProgresso() {
  const trilho = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = trilho.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={trilho} className={styles.trilho}>
      <span
        className={`${styles.progresso} ${visivel ? styles.progressoAtivo : ''}`}
      />
    </div>
  );
}
