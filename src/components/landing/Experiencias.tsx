import Image from 'next/image';

import { copyDaLanding as copy } from './copy';
import { Icone } from './ilustracoes';
import styles from './landing.module.css';
import { copyDosExemplos as visual } from './visual-copy';

/** Exemplo estático: a conversa real acontece na IA escolhida pelo aluno. */
export function ChatDaLanding({
  compacto = false,
  celular = false,
  seuGPT = false,
}: {
  compacto?: boolean;
  celular?: boolean;
  seuGPT?: boolean;
}) {
  return (
    <figure
      className={`${styles.chat} ${compacto ? styles.chatCompacto : ''} ${celular ? styles.celular : ''} ${seuGPT ? styles.chatSeuGpt : ''}`}
    >
      {celular ? <div className={styles.camera} aria-hidden="true" /> : null}
      <div className={styles.chatTopo}>
        {seuGPT ? (
          <span className={styles.avatarGpt}>
            <Image
              src="/brand/robo-wsa-apontando.webp"
              alt=""
              width={38}
              height={39}
              unoptimized
            />
          </span>
        ) : (
          <Icone
            nome="balao"
            className="bg-purple text-white"
            tamanho={compacto ? 'size-8' : 'size-11'}
          />
        )}
        <div>
          <p className="font-extrabold text-navy">
            {seuGPT ? visual.seuGPT : visual.premium}
          </p>
          {!seuGPT ? (
            <p className="text-xs text-muted">{visual.chatContexto}</p>
          ) : null}
        </div>
        {!seuGPT ? (
          <span className={styles.chatSelo} aria-hidden="true">
            ✦
          </span>
        ) : null}
      </div>
      <div className={styles.mensagens}>
        {copy.ia.chat
          .slice(0, compacto || celular ? 2 : 4)
          .map((mensagem, i) => (
            <div
              key={`${i}-${mensagem.autor}`}
              className={`${styles.mensagem} ${mensagem.autor === 'aluno' ? styles.aluno : styles.ia}`}
            >
              <span className={styles.autor}>
                {mensagem.autor === 'aluno' ? visual.aluno : visual.ia}
              </span>
              {seuGPT ? (
                <div className={styles.audioMensagem} aria-hidden="true">
                  <span className={styles.audioPlay}>▶</span>
                  <div className={styles.audioOnda}>
                    {[
                      6, 12, 18, 9, 15, 20, 11, 7, 17, 13, 8, 19, 12, 6, 15, 10,
                    ].map((altura, indice) => (
                      <span key={indice} style={{ height: altura }} />
                    ))}
                  </div>
                  <span className={styles.audioTempo}>
                    {mensagem.autor === 'aluno'
                      ? visual.audioChat.resposta
                      : visual.audioChat.pergunta}
                  </span>
                </div>
              ) : null}
              <p lang="en" className={seuGPT ? styles.transcricao : undefined}>
                {seuGPT ? (
                  <span className="sr-only">
                    {visual.audioChat.transcricao}{' '}
                  </span>
                ) : null}
                {mensagem.texto}
              </p>
            </div>
          ))}
      </div>
      {!compacto && !celular ? (
        <div className={styles.chatCampo}>
          <span>{visual.chatCampo}</span>
          <span aria-hidden="true">↑</span>
        </div>
      ) : null}
      <figcaption className={celular ? 'sr-only' : styles.chatLegenda}>
        {copy.ia.chatNota}
      </figcaption>
    </figure>
  );
}

/** Elementos ilustrativos: não são controles de reprodução. */
export function PraticaVisual({ passo }: { passo: number }) {
  return passo === 0 ? (
    <div className={styles.passoMidia} aria-hidden="true">
      <span className={styles.midiaRotulo}>{visual.video.rotulo}</span>
      <div className={styles.videoLinha}>
        <span className={styles.midiaPlay}>▶</span>
        <div className={styles.videoTrilho}>
          <span />
        </div>
        <span className={styles.midiaTempo}>{visual.video.tempo}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5" />
        </svg>
      </div>
    </div>
  ) : (
    <div className={styles.passoMidia} aria-hidden="true">
      <span className={styles.midiaRotulo}>{visual.voz.rotulo}</span>
      <div className={styles.videoLinha}>
        <span className={styles.midiaPlay}>▶</span>
        <div className={styles.ondaVoz}>
          {[
            9, 17, 25, 12, 30, 21, 13, 26, 34, 15, 23, 11, 29, 18, 32, 20, 10,
            25, 15, 28, 18, 9,
          ].map((altura, i) => (
            <span key={i} style={{ height: altura }} />
          ))}
        </div>
        <span className={styles.midiaTempo}>{visual.voz.tempo}</span>
        <Icone nome="microfone" className="text-yellow" tamanho="size-6" />
      </div>
    </div>
  );
}

export function CelularDeConversa() {
  return (
    <div className={styles.heroVisual}>
      <div className={styles.heroEtiqueta}>
        <span aria-hidden="true">✦</span> {copy.ia.selo}
      </div>
      <ChatDaLanding celular />
    </div>
  );
}

/** Três quadros de um segundo, sem fade; movimento reduzido mantém o primeiro. */
export function FotosDaEstudante() {
  return (
    <figure className={styles.fotos}>
      <div
        className={styles.fotosQuadro}
        role="img"
        aria-label={visual.fotos.alt}
      >
        {[1, 2, 3].map((numero) => (
          <Image
            key={numero}
            src={`/brand/estudante-frustrada-${numero}.webp`}
            alt=""
            fill
            sizes="(max-width: 767px) 90vw, 440px"
            className={`${styles.foto} ${styles[`foto${numero}`]}`}
            unoptimized
          />
        ))}
        <span className={styles.fotosAspas} aria-hidden="true">
          “
        </span>
      </div>
      <Image
        src="/brand/robo-wsa-pensando.webp"
        alt=""
        width={480}
        height={590}
        sizes="(max-width: 767px) 110px, 150px"
        unoptimized
        className={styles.roboPensando}
      />
    </figure>
  );
}
