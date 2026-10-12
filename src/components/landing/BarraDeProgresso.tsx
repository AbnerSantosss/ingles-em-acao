'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './landing.module.css';

/**
 * A demonstração começa quando o terceiro passo entra na tela. Com `rotulo`
 * ("Aula 12 de 42"), o primeiro número do texto conta junto com a barra: ele é
 * lido da própria animação do CSS a cada quadro, então os dois nunca saem de
 * compasso. No HTML (e com movimento reduzido) fica o número final.
 */
export function BarraDeProgresso({ rotulo }: { rotulo?: string }) {
  const trilho = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [fracao, setFracao] = useState(1);

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

  useEffect(() => {
    const elemento = barra.current;
    if (!visivel || !rotulo || !elemento) return;
    let quadro = 0;
    const acompanhar = () => {
      /* O primeiro valor da matriz é o scaleX que a animação aplica agora. */
      const escala = new DOMMatrixReadOnly(getComputedStyle(elemento).transform).a;
      setFracao(escala);
      const rodando = elemento
        .getAnimations()
        .some((animacao) => animacao.playState === 'running');
      if (rodando) quadro = requestAnimationFrame(acompanhar);
      else setFracao(1);
    };
    quadro = requestAnimationFrame(acompanhar);
    return () => cancelAnimationFrame(quadro);
  }, [visivel, rotulo]);

  const texto = rotulo?.replace(/\d+/, (total) =>
    String(Math.max(1, Math.round(Number(total) * fracao))),
  );

  return (
    <>
      {rotulo ? (
        <p>
          {/* Leitor de tela ouve o número final, não a contagem. */}
          <span className="sr-only">{rotulo}</span>
          <span aria-hidden="true">{texto}</span>
        </p>
      ) : null}
      <div ref={trilho} className={styles.trilho}>
        <span
          ref={barra}
          className={`${styles.progresso} ${visivel ? styles.progressoAtivo : ''}`}
        />
      </div>
    </>
  );
}
