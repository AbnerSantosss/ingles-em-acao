'use client';

import { useEffect, useRef, useState } from 'react';

import { Icone } from './ilustracoes';
import styles from './landing.module.css';

const ALTURAS = [
  9, 17, 25, 12, 30, 21, 13, 26, 34, 15, 23, 11, 29, 18, 32, 20, 10, 25, 15, 28,
  18, 9,
];
/** Segundos parado no fim, com a onda inteira acesa, antes de recomeçar. */
const PAUSA = 2;

/**
 * A fala toca enquanto o passo está na tela: as barras pulsam, acendem na ordem
 * e o tempo conta em segundos reais. No HTML (e com movimento reduzido) fica o
 * quadro final, igual ao desenho estático.
 */
export function OndaDeVoz({ tempo }: { tempo: string }) {
  const linha = useRef<HTMLDivElement>(null);
  const [minutos, segundos] = tempo.split(':').map(Number);
  const total = minutos * 60 + segundos;
  const [segundo, setSegundo] = useState(total);
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const elemento = linha.current;
    if (
      !elemento ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    let relogio: number | undefined;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) {
          window.clearInterval(relogio);
          relogio = undefined;
          setNaTela(false);
          return;
        }
        if (relogio !== undefined) return;
        setNaTela(true);
        setSegundo((atual) => (atual >= total ? 0 : atual));
        relogio = window.setInterval(
          () => setSegundo((atual) => (atual >= total + PAUSA ? 0 : atual + 1)),
          1000,
        );
      },
      { threshold: 0.5 },
    );
    observador.observe(elemento);
    return () => {
      observador.disconnect();
      window.clearInterval(relogio);
    };
  }, [total]);

  const decorrido = Math.min(segundo, total);
  const falando = naTela && segundo < total;
  const acesas = Math.ceil((decorrido / total) * ALTURAS.length);

  return (
    <div
      ref={linha}
      className={`${styles.videoLinha} ${falando ? styles.vozFalando : ''}`}
    >
      <span className={styles.midiaPlay}>▶</span>
      <div className={styles.ondaVoz}>
        {ALTURAS.map((altura, i) => (
          <span
            key={i}
            className={i < acesas ? undefined : styles.ondaApagada}
            style={{
              height: altura,
              animationDuration: `${620 + ((i * 137) % 360)}ms`,
              animationDelay: `-${(i * 211) % 700}ms`,
            }}
          />
        ))}
      </div>
      <span className={`${styles.midiaTempo} ${styles.vozTempo}`}>
        {Math.floor(decorrido / 60)}:{String(decorrido % 60).padStart(2, '0')}
      </span>
      <span className={styles.vozMicrofone}>
        <Icone nome="microfone" className="text-yellow" tamanho="size-6" />
      </span>
    </div>
  );
}
