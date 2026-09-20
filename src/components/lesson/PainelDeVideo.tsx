/**
 * Painel de vídeo da tela da aula — BACKOFFICE §2.6, CONTRACT §3.
 *
 * Este é **o player**: o mesmo componente que o aluno vê e que o painel usa
 * para pré-visualizar. Ter um só evita a armadilha clássica de o admin
 * aprovar num player e o aluno receber outro.
 *
 * ⚠️ Sem hooks e sem `'use client'` de propósito. Assim ele renderiza no
 * Server Component da aula (sem mandar JS para o navegador) e também dentro do
 * Client Component da pré-visualização do painel. Se alguém precisar de estado
 * aqui, crie um componente-filho cliente — não marque este arquivo.
 *
 * ## Regras que o painel não decide
 *
 * - **Sem vídeo configurado, não há painel.** Devolve `null` — nunca um quadro
 *   vazio, nunca um "em breve" que o aluno não pediu.
 * - **O WSA Essencial não vê a videoaula** (§2.6 e o bloco `cta`). Quem não tem o
 *   plano recebe a chamada de upgrade, não o player. A trava é de renderização:
 *   o endereço do vídeo não chega ao HTML de quem não tem direito a ele.
 * - **Arquivo enviado toca por link assinado de 15 minutos** (§4.3). Quem
 *   assina é o servidor, e só para quem tem o plano: o painel recebe o link
 *   pronto em `arquivo` e o entrega ao `VideoAssinado`, que renova sozinho.
 *   Sem `arquivo` (bucket fora do ar, arquivo removido), o painel some — nunca
 *   um player que não toca.
 */
import { NOME_DO_PLANO, type Plano } from '@/lib/planos';
import { planoVeVideoaula } from '@/lib/video/acesso';
import type { LinkAssinado } from '@/lib/video/envio';
import { montarReproducao, rotuloDaOrigem, type VideoSource } from '@/lib/video/fonte';

import { VideoAssinado } from './VideoAssinado';

/** O link de um arquivo enviado e como pedir outro quando ele vencer. */
export type ArquivoDoPainel = {
  /** Assinado junto com a página. Ausente = o player pede ao montar. */
  inicial?: LinkAssinado | null;
  renovar: () => Promise<LinkAssinado | null>;
};

export type PropsDoPainelDeVideo = {
  /** Já normalizada e revalidada (`@/lib/video/aula`). `null` = aula sem vídeo. */
  fonte: VideoSource | null;
  /** Plano de quem está vendo, de `SessionUser.plan`. */
  plano: Plano;
  /** Linha discreta embaixo do player: "Aula 07 · Verb TO BE". */
  legenda?: string;
  /** Texto alternativo do iframe, para leitor de tela. */
  titulo?: string;
  /**
   * Só para `fonte.kind === 'upload'`. ⚠️ Quem monta a página só preenche isto
   * para quem tem o plano: o link assinado não pode ir ao HTML do WSA Essencial.
   */
  arquivo?: ArquivoDoPainel;
  /**
   * Checkout do WSA Premium (`/admin/configuracoes`), para a chamada de
   * upgrade. Ausente ou `null` = a chamada fica sem botão. A pré-visualização do
   * painel não passa.
   */
  linkDeCompra?: string | null;
};

export function PainelDeVideo({
  fonte,
  plano,
  legenda,
  titulo,
  arquivo,
  linkDeCompra,
}: PropsDoPainelDeVideo) {
  if (!fonte) return null;

  const enviado = fonte.kind === 'upload';
  const reproducao = enviado ? null : montarReproducao(fonte);
  if (!enviado && !reproducao) return null;

  if (!planoVeVideoaula(plano)) {
    return <ChamadaDeUpgrade linkDeCompra={linkDeCompra} />;
  }

  if (enviado && !arquivo) return null;

  const nomeDoVideo = titulo ?? legenda ?? 'Videoaula';

  return (
    <section
      className="overflow-hidden rounded-hero bg-navy shadow-hero"
      aria-label="Videoaula desta aula"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
        <p className="kicker text-yellow">Videoaula</p>
        <span className="text-[12px] font-semibold text-white/55">{rotuloDaOrigem(fonte)}</span>
      </div>

      <div className="relative aspect-video w-full bg-black">
        {arquivo && enviado ? (
          <VideoAssinado
            key={fonte.assetId}
            inicial={arquivo.inicial}
            renovar={arquivo.renovar}
            titulo={nomeDoVideo}
          />
        ) : reproducao?.modo === 'iframe' ? (
          <iframe
            src={reproducao.src}
            title={nomeDoVideo}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : reproducao ? (
          <video
            src={reproducao.src}
            controls
            preload="metadata"
            playsInline
            className="absolute inset-0 h-full w-full"
          >
            Seu navegador não consegue tocar este vídeo.
          </video>
        ) : null}
      </div>

      {legenda ? (
        <p className="px-5 pt-3 pb-5 text-[13px] leading-relaxed text-white/70">{legenda}</p>
      ) : (
        <div className="pb-5" />
      )}
    </section>
  );
}

/**
 * O que o WSA Essencial vê no lugar do player.
 *
 * O botão só aparece com link de checkout configurado (`/admin/configuracoes`:
 * o campo do WSA Premium ou, vazio, o global). Um botão que não leva a
 * lugar nenhum é pior do que não ter botão. O texto conta o que existe e o que o
 * plano atual continua entregando.
 */
function ChamadaDeUpgrade({ linkDeCompra }: { linkDeCompra?: string | null }) {
  return (
    <section
      className="rounded-card border border-border bg-mint-2 p-5 shadow-card"
      aria-label="Videoaula não incluída no seu plano"
    >
      <p className="kicker text-teal-texto">Videoaula</p>
      <p className="mt-2 text-[15px] font-bold text-navy">Esta aula tem videoaula gravada.</p>
      <p className="mt-1 text-[14px] leading-relaxed text-muted">
        {`A videoaula faz parte do ${NOME_DO_PLANO.PREMIUM}. No seu plano, a leitura, os exercícios e os áudios desta aula continuam liberados do começo ao fim.`}
      </p>
      {linkDeCompra ? (
        <a
          href={linkDeCompra}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-pill bg-navy px-[22px] py-3 text-[13px] font-extrabold tracking-[.04em] text-white"
        >
          {`Conhecer o ${NOME_DO_PLANO.PREMIUM}`}
          <span className="sr-only"> (abre em outra aba)</span>
        </a>
      ) : null}
    </section>
  );
}
