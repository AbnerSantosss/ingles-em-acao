/**
 * Tocador único do áudio das aulas (pacote 08 do plano v2).
 *
 * Um só `HTMLAudioElement` para o app inteiro: tocar um clipe interrompe o que
 * estava tocando. Por isso nunca há dois áudios ao mesmo tempo (prompt-mestre de
 * áudios, seção 20), sem coordenação entre os botões.
 *
 * Tem tocar, pausar, continuar de onde parou e parar (pendência 9 do MVP, agora
 * fechada). Pausar guarda a posição no próprio elemento; parar esvazia o
 * elemento e zera tudo.
 *
 * Não é componente nem hook: é um módulo com estado e assinantes, no formato que
 * o `useSyncExternalStore` do React espera (`assinar` e `obterEstado`). Os
 * componentes leem daqui por `useEstadoDoTocador.ts`.
 *
 * Regras do elemento de mídia que este arquivo segue, porque cada uma já é uma
 * armadilha conhecida:
 * - `preload = 'none'`: nada é baixado antes do toque do aluno.
 * - Trocar o `src` recarrega o elemento, e a recarga volta `playbackRate` para
 *   `defaultPlaybackRate`. Por isso as duas taxas são definidas DEPOIS do `src`.
 * - `play()` devolve uma promessa que rejeita com `AbortError` quando outro clipe
 *   entra antes de o primeiro começar. Isso é esperado e não é erro.
 * - Para esvaziar o elemento: `removeAttribute('src')` e `load()`. Nunca
 *   `src = ''`, que faz o navegador tentar baixar a própria página.
 * - O evento `pause` pode chegar atrasado, quando o próximo clipe já começou. Ele
 *   só vale se o elemento estiver de fato pausado e não tiver terminado.
 */

export type EstadoDoTocador = 'parado' | 'carregando' | 'tocando' | 'pausado' | 'erro';

export interface InstantaneoDoTocador {
  /** Caminho do clipe atual, igual ao `AudioClip.src`. `null` quando nada foi escolhido. */
  readonly src: string | null;
  readonly estado: EstadoDoTocador;
  /** 1 na velocidade normal, 0.8 no "Devagar". */
  readonly taxa: number;
  /** Segundos já tocados. */
  readonly posicao: number;
  /** Duração em segundos. 0 enquanto o navegador não souber. */
  readonly duracao: number;
}

export const TAXA_NORMAL = 1;
/** "Ouvir mais devagar" do prompt-mestre de áudios, seção 11: 80%, mesmo arquivo. */
export const TAXA_DEVAGAR = 0.8;

/** Estado inicial, e também o que o servidor enxerga (lá não existe áudio). */
export const ESTADO_NO_SERVIDOR: InstantaneoDoTocador = {
  src: null,
  estado: 'parado',
  taxa: TAXA_NORMAL,
  posicao: 0,
  duracao: 0,
};

type Ouvinte = () => void;

let elemento: HTMLAudioElement | null = null;
let atual: InstantaneoDoTocador = ESTADO_NO_SERVIDOR;
const ouvintes = new Set<Ouvinte>();

/** Troca o instantâneo por um objeto NOVO e avisa quem assina. */
function publicar(parcial: Partial<InstantaneoDoTocador>): void {
  atual = { ...atual, ...parcial };
  for (const ouvinte of ouvintes) ouvinte();
}

/** Para o `useSyncExternalStore`: devolve a função que cancela a assinatura. */
export function assinar(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

/** Para o `useSyncExternalStore`: o mesmo objeto enquanto nada mudar. */
export function obterEstado(): InstantaneoDoTocador {
  return atual;
}

function ehAbortError(erro: unknown): boolean {
  return typeof erro === 'object' && erro !== null && 'name' in erro && erro.name === 'AbortError';
}

/** Número finito e positivo, senão 0. A duração chega como NaN ou Infinity no começo. */
function segundos(valor: number): number {
  return Number.isFinite(valor) && valor > 0 ? valor : 0;
}

/**
 * O elemento único, criado no primeiro toque. `null` fora do navegador
 * (renderização no servidor e testes sem `Audio`).
 */
function obterElemento(): HTMLAudioElement | null {
  if (elemento) return elemento;
  if (typeof Audio === 'undefined') return null;

  const el = new Audio();
  el.preload = 'none';
  // Mantém o tom da voz no "Devagar". O Safari antigo só conhece o nome com prefixo.
  el.preservesPitch = true;
  (el as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;

  // Evento de um clipe que já saiu (erro atrasado, por exemplo) não mexe no atual.
  // `getAttribute` devolve o caminho como foi escrito; `el.src` devolveria a URL inteira.
  const ehDoClipeAtual = () => atual.src !== null && el.getAttribute('src') === atual.src;

  el.addEventListener('playing', () => {
    if (ehDoClipeAtual()) publicar({ estado: 'tocando' });
  });
  el.addEventListener('waiting', () => {
    if (ehDoClipeAtual()) publicar({ estado: 'carregando' });
  });
  el.addEventListener('pause', () => {
    // Vale tanto para o botão "Pausar" quanto para a pausa vinda de fora (fone
    // desconectado, controle do sistema): o clipe fica pausado e a posição
    // continua onde estava. No fim do arquivo quem decide é o `ended`.
    if (ehDoClipeAtual() && el.paused && !el.ended) publicar({ estado: 'pausado' });
  });
  el.addEventListener('ended', () => {
    if (ehDoClipeAtual()) publicar({ estado: 'parado', posicao: 0 });
  });
  el.addEventListener('error', () => {
    if (ehDoClipeAtual()) publicar({ estado: 'erro' });
  });
  el.addEventListener('timeupdate', () => {
    if (ehDoClipeAtual()) publicar({ posicao: segundos(el.currentTime) });
  });
  const lerDuracao = () => {
    if (ehDoClipeAtual()) publicar({ duracao: segundos(el.duration) });
  };
  el.addEventListener('loadedmetadata', lerDuracao);
  el.addEventListener('durationchange', lerDuracao);

  elemento = el;
  return el;
}

/** Toca um clipe do começo. O que estava tocando para. */
export function tocar(src: string, opcoes: { taxa?: number } = {}): void {
  const el = obterElemento();
  if (!el) return;
  const taxa = opcoes.taxa ?? TAXA_NORMAL;

  el.pause();
  el.src = src;
  // Depois do `src`: a recarga do elemento volta a taxa para `defaultPlaybackRate`.
  el.defaultPlaybackRate = taxa;
  el.playbackRate = taxa;
  publicar({ src, estado: 'carregando', taxa, posicao: 0, duracao: 0 });

  el.play().catch((erro: unknown) => {
    if (ehAbortError(erro)) return;
    // A recusa de um clipe que já foi trocado não pode marcar erro no clipe novo.
    if (atual.src === src) publicar({ estado: 'erro' });
  });
}

/**
 * Pausa o clipe atual e guarda a posição. O evento `pause` do elemento publica
 * o estado; aqui a publicação é imediata para o botão trocar de cara no mesmo
 * toque, mesmo que o navegador demore a mandar o evento.
 */
export function pausar(): void {
  if (!elemento || atual.src === null) return;
  elemento.pause();
  publicar({ estado: 'pausado' });
}

/** Continua o clipe atual de onde parou, na velocidade em que estava. */
export function continuar(): void {
  const el = elemento;
  const src = atual.src;
  if (!el || src === null) return;
  publicar({ estado: 'tocando' });
  el.play().catch((erro: unknown) => {
    if (ehAbortError(erro)) return;
    if (atual.src === src) publicar({ estado: 'erro' });
  });
}

/** Troca a velocidade do clipe atual sem recomeçar. */
export function mudarTaxa(taxa: number): void {
  if (!elemento || atual.src === null) return;
  elemento.defaultPlaybackRate = taxa;
  elemento.playbackRate = taxa;
  publicar({ taxa });
}

/** Para tudo e esvazia o elemento. Usado na troca de página e na saída da aula. */
export function parar(): void {
  const el = elemento;
  if (!el || atual.src === null) return;
  el.pause();
  el.removeAttribute('src');
  el.load();
  publicar({ src: null, estado: 'parado', taxa: TAXA_NORMAL, posicao: 0, duracao: 0 });
}
