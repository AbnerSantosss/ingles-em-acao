'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import gravacao from './conversa-audio.json';
import { copyDaLanding as copy } from './copy';
import styles from './landing.module.css';
import { copyDosExemplos as visual } from './visual-copy';

const ALTURAS = [6, 12, 18, 9, 15, 20, 11, 7, 17, 13, 8, 19, 12, 6, 15, 10];
/** Milissegundos do cartão vazio antes do áudio, da conversa parada no fim e da saída. */
const ENTRADA = 180;
const ESPERA = 2600;
const SAIDA = 450;
/** Passo do relógio: a tela só redesenha quando ele muda. */
const PASSO = 40;
const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';

/*
 * A conversa é um MP3 só, com uma voz para cada lado (scripts/audio/landing.py).
 * O manifesto diz onde cada fala começa e quanto dura dentro dele, e a animação
 * segue esses tempos com ou sem som.
 */
const falas = copy.ia.chat.map((mensagem, i) => ({
  ...mensagem,
  doAluno: mensagem.autor === 'aluno',
  inicio: ENTRADA + gravacao.falas[i].inicioMs,
  duracao: gravacao.falas[i].duracaoMs,
}));
const FIM_DAS_FALAS = falas.at(-1)!.inicio + falas.at(-1)!.duracao;
const CICLO = FIM_DAS_FALAS + ESPERA + SAIDA;

/**
 * Toca do começo. `play()` rejeita com AbortError quando o áudio é pausado
 * antes de começar: isso é esperado e não é falha.
 */
function tocarDoComeco(audio: HTMLAudioElement, aoFalhar: () => void) {
  audio.currentTime = 0;
  audio.play().catch((erro: unknown) => {
    if (!(erro instanceof DOMException && erro.name === 'AbortError')) aoFalhar();
  });
}

/**
 * A conversa acontece enquanto o cartão está na tela: cada fala entra na sua
 * vez, o áudio toca, a transcrição é escrita e o robô fala ou escuta. No fim o
 * cartão esvazia e a conversa recomeça. No HTML (e com movimento reduzido) fica
 * a conversa inteira, parada.
 *
 * O som começa desligado, porque o navegador só deixa tocar depois de um toque:
 * o botão do topo liga as vozes e a conversa volta ao "Hi!". Até esse primeiro
 * toque, o robô aponta para o botão, um balão diz o que fazer e o botão pulsa.
 */
export function ConversaComRobo() {
  const cartao = useRef<HTMLDivElement>(null);
  /* Lidos pelo laço da animação: o áudio ligado, o começo da volta e se ela já tocou. */
  const som = useRef<HTMLAudioElement | null>(null);
  const origem = useRef(0);
  const tocou = useRef(false);
  const [relogio, setRelogio] = useState(FIM_DAS_FALAS);
  const [naTela, setNaTela] = useState(false);
  const [comSom, setComSom] = useState(false);
  const [jaOuviu, setJaOuviu] = useState(false);

  const desligarSom = useCallback(() => {
    som.current?.pause();
    som.current = null;
    setComSom(false);
  }, []);

  useEffect(() => {
    const elemento = cartao.current;
    if (!elemento || !('IntersectionObserver' in window)) return;
    /* Com movimento reduzido a conversa fica inteira e parada; só importa se o cartão está na tela. */
    const parado = window.matchMedia(MOVIMENTO_REDUZIDO).matches;

    let quadro = 0;
    const avancar = (agora: number) => {
      let tempo = agora - origem.current;
      if (tempo >= CICLO) {
        origem.current = agora;
        tocou.current = false;
        tempo = 0;
      }
      const audio = som.current;
      if (audio && !tocou.current && tempo >= ENTRADA) {
        tocou.current = true;
        tocarDoComeco(audio, desligarSom);
      }
      /* Com som, quem marca o tempo é o áudio: a animação espera por ele. */
      if (audio && tocou.current && !audio.paused && !audio.ended) {
        tempo = ENTRADA + audio.currentTime * 1000;
        origem.current = agora - tempo;
      }
      setRelogio(Math.floor(tempo / PASSO) * PASSO);
      quadro = requestAnimationFrame(avancar);
    };
    const observador = new IntersectionObserver(
      ([entrada]) => {
        cancelAnimationFrame(quadro);
        setNaTela(entrada.isIntersecting);
        if (parado) return;
        if (!entrada.isIntersecting) {
          /* Fora da tela o cartão espera vazio e calado, para a conversa começar do "Hi!". */
          som.current?.pause();
          setRelogio(0);
          return;
        }
        origem.current = performance.now();
        tocou.current = false;
        quadro = requestAnimationFrame(avancar);
      },
      { threshold: 0.35 },
    );
    observador.observe(elemento);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
      som.current?.pause();
    };
  }, [desligarSom]);

  function alternarSom() {
    if (som.current) {
      desligarSom();
      return;
    }
    const audio = new Audio(gravacao.src);
    /* Sem a animação (movimento reduzido) a conversa toca uma vez só. */
    audio.addEventListener('ended', () => {
      if (window.matchMedia(MOVIMENTO_REDUZIDO).matches) desligarSom();
    });
    som.current = audio;
    origem.current = performance.now() - ENTRADA;
    tocou.current = true;
    tocarDoComeco(audio, desligarSom);
    setComSom(true);
    setJaOuviu(true);
  }

  const tocando = naTela
    ? falas.findIndex(
        ({ inicio, duracao }) => relogio >= inicio && relogio < inicio + duracao,
      )
    : -1;
  const saindo = naTela && relogio >= FIM_DAS_FALAS + ESPERA;
  /* Enquanto chama para ouvir, o robô fica apontando e não reage às falas. */
  const chamando = naTela && !jaOuviu;
  const postura =
    chamando || tocando === -1
      ? ''
      : falas[tocando].doAluno
        ? styles.roboEscutando
        : styles.roboFalando;

  return (
    <div
      ref={cartao}
      className={`${styles.conversaRobo} ${chamando ? styles.chamandoParaOuvir : ''}`}
    >
      <div className={styles.roboConversa}>
        <Image
          src="/brand/robo-wsa-apontando.webp"
          alt=""
          width={700}
          height={719}
          sizes="200px"
          unoptimized
          className={postura}
        />
        {/* Atalho só para o ponteiro: quem lê "clique aqui" clica no balão. O botão de verdade é o do topo. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={alternarSom}
          className={styles.balaoDoRobo}
        >
          {visual.audioChat.convite}
        </button>
      </div>
      <figure
        className={`${styles.chat} ${styles.chatCompacto} ${styles.chatSeuGpt}`}
      >
        <div className={styles.chatTopo}>
          <span className={styles.avatarGpt}>
            <Image
              src="/brand/robo-wsa-apontando.webp"
              alt=""
              width={38}
              height={39}
              unoptimized
            />
          </span>
          <p className="font-extrabold text-navy">{visual.seuGPT}</p>
          <button
            type="button"
            onClick={alternarSom}
            className={`${styles.somDaConversa} ${comSom ? styles.somLigado : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              {comSom ? (
                <path d="m16 9.5 5 5m0-5-5 5" />
              ) : (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
              )}
            </svg>
            {comSom ? visual.audioChat.silenciar : visual.audioChat.ouvir}
          </button>
        </div>
        <div
          className={`${styles.mensagens} ${saindo ? styles.conversaSaindo : ''}`}
        >
          {falas.map((fala, i) => {
            const { inicio, duracao } = fala;
            const avanco = Math.min(1, Math.max(0, (relogio - inicio) / duracao));
            const total = Math.max(1, Math.round(duracao / 1000));
            const letras = Math.ceil(avanco * fala.texto.length);
            return (
              <div
                key={`${i}-${fala.autor}`}
                className={`${styles.mensagem} ${fala.doAluno ? styles.aluno : styles.ia} ${relogio >= inicio ? '' : styles.falaOculta} ${i === tocando ? styles.falaTocando : ''}`}
              >
                <span className={styles.autor}>
                  {fala.doAluno ? visual.aluno : visual.ia}
                </span>
                <div className={styles.audioMensagem} aria-hidden="true">
                  <span className={styles.audioPlay}>
                    {i === tocando ? <i className={styles.audioPausa} /> : '▶'}
                  </span>
                  <div className={styles.audioOnda}>
                    {ALTURAS.map((altura, barra) => (
                      <span
                        key={barra}
                        className={
                          barra < Math.ceil(avanco * ALTURAS.length)
                            ? undefined
                            : styles.barraApagada
                        }
                        style={{
                          height: altura,
                          animationDuration: `${420 + ((barra * 137) % 300)}ms`,
                          animationDelay: `-${(barra * 211) % 500}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className={`${styles.audioTempo} ${styles.vozTempo}`}>
                    0:{String(Math.round(avanco * total)).padStart(2, '0')}
                  </span>
                </div>
                <p lang="en" className={styles.transcricao}>
                  {/* Leitor de tela ouve a fala inteira, não a digitação. */}
                  <span className="sr-only">
                    {visual.audioChat.transcricao} {fala.texto}
                  </span>
                  <span aria-hidden="true">
                    {fala.texto.slice(0, letras)}
                    <span className={styles.falaPorVir}>
                      {fala.texto.slice(letras)}
                    </span>
                  </span>
                </p>
              </div>
            );
          })}
        </div>
        <figcaption className={styles.chatLegenda}>{copy.ia.chatNota}</figcaption>
      </figure>
    </div>
  );
}
