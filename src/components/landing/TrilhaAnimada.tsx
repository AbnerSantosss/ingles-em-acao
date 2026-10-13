'use client';

import { useEffect, useRef, useState } from 'react';

import { PanoramasDasCidades } from './cidades';
import {
  AULAS_DOS_MARCOS,
  LARGURA_DA_TRILHA,
  TrilhaDas42,
  xDaAula,
} from './ilustracoes';
import styles from './landing.module.css';
import { copyDosExemplos as visual } from './visual-copy';

const { paradas, chegada } = visual.trilha;

/*
 * A volta inteira dura 3 segundos: PARTIDA + 6 × PARADA + CHEGADA + VOLTA.
 * As transições da trilha em landing.module.css cabem dentro de uma PARADA;
 * quem mexer aqui confere lá.
 */
/** Tempo em cada cidade, já contando o voo até ela. */
const PARADA = 320;
/** Tempo da cena final, com a trilha inteira e o destino na tela. */
const CHEGADA = 900;
/** Tempo com tudo apagado antes da nova partida. */
const VOLTA = 120;
/** Espera entre o cartão aparecer e o avião sair. */
const PARTIDA = 60;
const ULTIMA = AULAS_DOS_MARCOS.length - 1;
/** Cena depois da última cidade: a câmera abre e mostra o destino. */
const FIM = ULTIMA + 1;
const ALTURA_DA_TRILHA = 178;

/** Altura do ponto de uma aula no desenho, igual à conta de `TrilhaDas42`. */
function yDaAula(aula: number) {
  return 90 + Math.sin((aula - 1) / 4.2) * 22;
}

/**
 * A viagem pelas seis cidades parte assim que o cartão aparece e roda em loop
 * enquanto ele está na tela; a cada nova entrada recomeça de Londres. A
 * câmera aproxima e acompanha o avião de marco em marco; no fundo, o panorama
 * da cidade se desenha e o nome dela entra em letras grandes. Depois de
 * Auckland a câmera abre e mostra o destino. No HTML (e com movimento
 * reduzido) fica o desenho estático, rolável no celular.
 */
export function TrilhaAnimada({ className = '' }: { className?: string }) {
  const cartao = useRef<HTMLDivElement>(null);
  const rolagem = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  /* Hora prevista da próxima troca de cena; zero enquanto a viagem está parada. */
  const previsto = useRef(0);
  const [naTela, setNaTela] = useState(false);
  const [emCena, setEmCena] = useState(false);
  const [viagem, setViagem] = useState({ cena: -1, acesa: false });

  useEffect(() => {
    const elemento = cartao.current;
    if (
      !elemento ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        setNaTela(entrada.isIntersecting);
        if (entrada.isIntersecting) setEmCena(true);
        /* Saiu da tela: volta ao começo, para a próxima entrada partir de
           Londres. */
        else setViagem({ cena: -1, acesa: false });
      },
      { threshold: 0.2 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!naTela) {
      previsto.current = 0;
      return;
    }
    const { cena, acesa } = viagem;
    const [espera, proxima] =
      cena === -1
        ? [PARTIDA, { cena: 0, acesa: true }]
        : !acesa
          ? [VOLTA, { cena: -1, acesa: false }]
          : cena < FIM
            ? [PARADA, { cena: cena + 1, acesa: true }]
            : [CHEGADA, { cena, acesa: false }];
    /* Cada cena é marcada a partir da hora prevista da anterior, não da hora
       em que ela de fato trocou: assim o atraso dos relógios não se acumula e
       a volta fecha nos 3 segundos. */
    const agora = performance.now();
    /* Atraso grande é aba em segundo plano: recomeça a conta em vez de correr atrás. */
    const base =
      previsto.current && agora - previsto.current < PARADA
        ? previsto.current
        : agora;
    previsto.current = base + espera;
    const relogio = window.setTimeout(
      () => setViagem(proxima),
      Math.max(0, base + espera - agora),
    );
    return () => window.clearTimeout(relogio);
  }, [naTela, viagem]);

  /* A câmera é um transform no desenho: perto do marco da vez, ou aberta. */
  useEffect(() => {
    const janela = rolagem.current;
    const quadro = camera.current;
    if (!janela || !quadro || !emCena) return;
    janela.scrollLeft = 0;
    /* Antes da partida o quadro fica como está: parado na primeira volta,
       aberto nas seguintes. */
    if (viagem.cena === -1) return;
    const estilo = getComputedStyle(janela);
    const largura =
      janela.clientWidth -
      parseFloat(estilo.paddingLeft) -
      parseFloat(estilo.paddingRight);
    const desenho = quadro.offsetWidth;
    const altura = quadro.offsetHeight;
    const cabe = desenho <= largura + 1;
    /* Altura livre da janela. No desktop o CSS dá mais altura que o desenho,
       e é ela que limita o zoom: a trilha nunca é cortada em cima ou embaixo. */
    const vao = Math.max(
      altura,
      janela.clientHeight -
        parseFloat(estilo.paddingTop) -
        parseFloat(estilo.paddingBottom),
    );
    /* O desenho fica centrado na janela; o transform parte dessa folga. */
    const folga = (vao - altura) / 2;

    let zoom: number;
    let x: number;
    let y: number;
    if (viagem.cena >= 0 && viagem.cena <= ULTIMA) {
      const aula = AULAS_DOS_MARCOS[viagem.cena];
      zoom = folga > 1 ? Math.min(1.6, vao / altura) : cabe ? 1.6 : 1.2;
      const alvoX = (xDaAula(aula) / LARGURA_DA_TRILHA) * desenho;
      /* Mira um pouco acima do ponto, para a bandeira e o nome caberem. */
      const alvoY = ((yDaAula(aula) - 14) / ALTURA_DA_TRILHA) * altura;
      x = Math.min(0, Math.max(largura - zoom * desenho, largura / 2 - zoom * alvoX));
      y = Math.min(0, Math.max(vao - zoom * altura, vao / 2 - zoom * alvoY));
    } else {
      zoom = Math.min(1, largura / desenho);
      x = 0;
      y = (vao - zoom * altura) / 2;
    }
    y -= folga;
    quadro.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${zoom.toFixed(3)})`;
  }, [emCena, viagem.cena]);

  const naCidade = viagem.acesa && viagem.cena >= 0 && viagem.cena <= ULTIMA;
  const noDestino = viagem.acesa && viagem.cena === FIM;

  return (
    <div
      ref={cartao}
      className={`${styles.trilhaCartao} ${viagem.acesa ? styles.trilhaAcesa : ''} ${naTela ? styles.trilhaRodando : ''} ${emCena ? styles.trilhaEmCena : ''} ${noDestino ? styles.trilhaNoDestino : ''} ${className}`}
    >
      <div className={styles.trilhaFundo} aria-hidden="true">
        <PanoramasDasCidades
          className={styles.trilhaPanorama}
          ativa={naCidade ? viagem.cena : -1}
        />
        {paradas.map((parada, i) => (
          <p
            key={parada.cidade}
            className={styles.trilhaLetreiro}
            data-ativa={naCidade && i === viagem.cena ? '' : undefined}
          >
            <span>{parada.cidade}</span>
            <small>{parada.pais}</small>
          </p>
        ))}
      </div>
      <div ref={rolagem} className={`${styles.trilhaScroll} px-3 py-5 sm:px-6`}>
        <div ref={camera} className={styles.trilhaCamera}>
          <TrilhaDas42
            className={styles.trilha}
            viagem={{
              ate: Math.min(viagem.cena, ULTIMA),
              todas: noDestino,
              classeDaLinha: styles.trilhaLinha,
              classeDoAviao: styles.trilhaAviao,
              classeDoPulso: styles.trilhaPulso,
              classeDaCidade: styles.trilhaCidade,
            }}
          />
        </div>
      </div>
      <p
        className={styles.trilhaDestino}
        aria-hidden="true"
        data-ativa={noDestino ? '' : undefined}
      >
        <small>{chegada.legenda}</small>
        <span>{chegada.titulo}</span>
      </p>
    </div>
  );
}
