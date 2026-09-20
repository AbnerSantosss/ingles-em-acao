/**
 * Tocador único do áudio das aulas (pacote 08).
 *
 * O Node não tem `Audio`. O `AudioFalso` abaixo imita só o que o tocador usa,
 * inclusive as duas manias do navegador que já viraram regra no tocador: trocar
 * o `src` volta a velocidade para a padrão, e `play()` rejeita com `AbortError`
 * quando outro clipe entra antes.
 *
 * O tocador guarda estado no módulo. Cada teste importa uma cópia nova.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Tocador = typeof import('@/components/lesson/audio/tocador');

class AudioFalso extends EventTarget {
  static criados: AudioFalso[] = [];
  /** Como o próximo `play()` termina. Volta para 'ok' depois de usado. */
  static proximoPlay: 'ok' | 'abort' | 'recusa' = 'ok';

  preload = 'auto';
  preservesPitch = false;
  paused = true;
  ended = false;
  currentTime = 0;
  duration = Number.NaN;
  defaultPlaybackRate = 1;
  playbackRate = 1;
  /** Ordem das chamadas, para conferir a sequência. */
  chamadas: string[] = [];
  private atributos = new Map<string, string>();

  constructor() {
    super();
    AudioFalso.criados.push(this);
  }

  set src(valor: string) {
    this.atributos.set('src', valor);
    // Igual ao navegador: carregar outro arquivo volta a velocidade para a padrão.
    this.playbackRate = this.defaultPlaybackRate;
    this.chamadas.push(`src=${valor}`);
  }

  get src(): string {
    return this.atributos.get('src') ?? '';
  }

  getAttribute(nome: string): string | null {
    return this.atributos.get(nome) ?? null;
  }

  removeAttribute(nome: string): void {
    this.atributos.delete(nome);
    this.chamadas.push(`removeAttribute(${nome})`);
  }

  load(): void {
    this.chamadas.push('load');
  }

  pause(): void {
    this.paused = true;
    this.chamadas.push('pause');
  }

  play(): Promise<void> {
    this.chamadas.push('play');
    const modo = AudioFalso.proximoPlay;
    AudioFalso.proximoPlay = 'ok';
    if (modo === 'abort') return Promise.reject(new DOMException('interrompido', 'AbortError'));
    if (modo === 'recusa') return Promise.reject(new DOMException('formato não suportado', 'NotSupportedError'));
    this.paused = false;
    this.ended = false;
    return Promise.resolve();
  }

  disparar(tipo: string): void {
    this.dispatchEvent(new Event(tipo));
  }
}

/** Deixa as promessas de `play()` terminarem. */
const esperar = () => new Promise<void>((resolver) => setTimeout(resolver, 0));

function elementoUnico(): AudioFalso {
  expect(AudioFalso.criados).toHaveLength(1);
  const el = AudioFalso.criados[0];
  if (!el) throw new Error('nenhum elemento criado');
  return el;
}

let t: Tocador;

beforeEach(async () => {
  AudioFalso.criados = [];
  AudioFalso.proximoPlay = 'ok';
  vi.resetModules();
  vi.stubGlobal('Audio', AudioFalso);
  t = await import('@/components/lesson/audio/tocador');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sem navegador', () => {
  it('sem `Audio` (servidor): tocar não quebra e nada muda', () => {
    vi.unstubAllGlobals();
    t.tocar('/audio/aula-02/a.mp3');
    expect(t.obterEstado()).toEqual(t.ESTADO_NO_SERVIDOR);
  });

  it('importar não cria elemento: nada é baixado antes do toque', () => {
    expect(AudioFalso.criados).toHaveLength(0);
  });

  it('mudarTaxa, pausar, continuar e parar sem clipe não fazem nada', () => {
    t.mudarTaxa(t.TAXA_DEVAGAR);
    t.pausar();
    t.continuar();
    t.parar();
    expect(AudioFalso.criados).toHaveLength(0);
    expect(t.obterEstado()).toEqual(t.ESTADO_NO_SERVIDOR);
  });
});

describe('tocar', () => {
  it('cria um elemento só, com preload none e tom preservado', () => {
    t.tocar('/a.mp3');
    t.tocar('/b.mp3');
    const el = elementoUnico();
    expect(el.preload).toBe('none');
    expect(el.preservesPitch).toBe(true);
  });

  it('publica carregando e depois tocando', () => {
    t.tocar('/a.mp3');
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'carregando', taxa: 1, posicao: 0, duracao: 0 });
    elementoUnico().disparar('playing');
    expect(t.obterEstado().estado).toBe('tocando');
  });

  it('a velocidade é definida depois do src e sobrevive à troca', () => {
    t.tocar('/a.mp3', { taxa: t.TAXA_DEVAGAR });
    const el = elementoUnico();
    expect(el.playbackRate).toBe(0.8);
    expect(el.defaultPlaybackRate).toBe(0.8);
    expect(t.obterEstado().taxa).toBe(0.8);
    t.tocar('/b.mp3');
    expect(el.playbackRate).toBe(1);
    expect(el.defaultPlaybackRate).toBe(1);
  });

  it('um clipe por vez: o segundo pausa o primeiro antes de trocar o src', () => {
    t.tocar('/a.mp3');
    t.tocar('/b.mp3');
    expect(elementoUnico().chamadas).toEqual(['pause', 'src=/a.mp3', 'play', 'pause', 'src=/b.mp3', 'play']);
    expect(t.obterEstado().src).toBe('/b.mp3');
  });

  it('AbortError do play não é erro', async () => {
    AudioFalso.proximoPlay = 'abort';
    t.tocar('/a.mp3');
    await esperar();
    expect(t.obterEstado().estado).toBe('carregando');
  });

  it('play recusado marca erro no clipe', async () => {
    AudioFalso.proximoPlay = 'recusa';
    t.tocar('/a.mp3');
    await esperar();
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'erro' });
  });

  it('recusa atrasada de um clipe que já saiu não marca erro no novo', async () => {
    AudioFalso.proximoPlay = 'recusa';
    t.tocar('/a.mp3');
    t.tocar('/b.mp3');
    await esperar();
    expect(t.obterEstado()).toMatchObject({ src: '/b.mp3', estado: 'carregando' });
  });

  it('evento error do elemento marca erro', () => {
    t.tocar('/a.mp3');
    elementoUnico().disparar('error');
    expect(t.obterEstado().estado).toBe('erro');
  });
});

describe('pausar, continuar, fim e parada', () => {
  it('pausar guarda a posição e continuar volta dali, sem recarregar o arquivo', async () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    el.disparar('playing');
    el.currentTime = 4;
    el.disparar('timeupdate');

    t.pausar();
    expect(el.paused).toBe(true);
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'pausado', posicao: 4 });

    const antes = el.chamadas.length;
    t.continuar();
    await esperar();
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'tocando', posicao: 4 });
    // Só `play`: nenhum `src=` novo, que faria o clipe voltar ao começo.
    expect(el.chamadas.slice(antes)).toEqual(['play']);
  });

  it('continuar recusado pelo navegador marca erro no clipe', async () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    el.disparar('playing');
    t.pausar();
    AudioFalso.proximoPlay = 'recusa';
    t.continuar();
    await esperar();
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'erro' });
  });

  it('pause atrasado, com o elemento já tocando, é ignorado', async () => {
    t.tocar('/a.mp3');
    await esperar();
    const el = elementoUnico();
    el.disparar('playing');
    expect(el.paused).toBe(false);
    el.disparar('pause');
    expect(t.obterEstado().estado).toBe('tocando');
  });

  it('pause vindo de fora (sistema, fone) deixa o clipe pausado na posição', () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    el.disparar('playing');
    el.currentTime = 2;
    el.disparar('timeupdate');
    el.paused = true;
    el.disparar('pause');
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'pausado', posicao: 2 });
  });

  it('parar depois de pausar zera tudo', () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    el.disparar('playing');
    el.currentTime = 5;
    el.disparar('timeupdate');
    t.pausar();
    t.parar();
    expect(t.obterEstado()).toEqual(t.ESTADO_NO_SERVIDOR);
  });

  it('fim do arquivo: o pause que vem antes do ended não decide nada', () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    el.disparar('playing');
    el.currentTime = 3;
    el.disparar('timeupdate');
    el.paused = true;
    el.ended = true;
    el.disparar('pause');
    expect(t.obterEstado().estado).toBe('tocando');
    el.disparar('ended');
    expect(t.obterEstado()).toMatchObject({ src: '/a.mp3', estado: 'parado', posicao: 0 });
  });

  it('parar esvazia o elemento sem src vazio e volta ao estado inicial', () => {
    t.tocar('/a.mp3', { taxa: t.TAXA_DEVAGAR });
    const el = elementoUnico();
    t.parar();
    expect(el.chamadas.slice(-3)).toEqual(['pause', 'removeAttribute(src)', 'load']);
    expect(el.chamadas).not.toContain('src=');
    expect(el.getAttribute('src')).toBeNull();
    expect(t.obterEstado()).toEqual(t.ESTADO_NO_SERVIDOR);
  });

  it('depois de parar, evento atrasado do clipe antigo não muda nada', () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    t.parar();
    el.disparar('error');
    el.disparar('playing');
    expect(t.obterEstado()).toEqual(t.ESTADO_NO_SERVIDOR);
  });
});

describe('velocidade, posição e duração', () => {
  it('mudarTaxa troca a velocidade sem recomeçar o clipe', () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    const antes = el.chamadas.length;
    t.mudarTaxa(t.TAXA_DEVAGAR);
    expect(el.playbackRate).toBe(0.8);
    expect(el.defaultPlaybackRate).toBe(0.8);
    expect(el.chamadas).toHaveLength(antes);
    expect(t.obterEstado().taxa).toBe(0.8);
  });

  it('posição vem do timeupdate e duração inválida vira 0', () => {
    t.tocar('/a.mp3');
    const el = elementoUnico();
    el.currentTime = 3.4;
    el.disparar('timeupdate');
    expect(t.obterEstado().posicao).toBe(3.4);
    el.duration = Number.NaN;
    el.disparar('loadedmetadata');
    expect(t.obterEstado().duracao).toBe(0);
    el.duration = 12;
    el.disparar('durationchange');
    expect(t.obterEstado().duracao).toBe(12);
    el.duration = Number.POSITIVE_INFINITY;
    el.disparar('durationchange');
    expect(t.obterEstado().duracao).toBe(0);
  });
});

describe('assinatura (formato do useSyncExternalStore)', () => {
  it('avisa quem assina a cada mudança e para de avisar depois de cancelar', () => {
    const ouvinte = vi.fn();
    const cancelar = t.assinar(ouvinte);
    t.tocar('/a.mp3');
    expect(ouvinte).toHaveBeenCalledTimes(1);
    cancelar();
    t.parar();
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });

  it('o mesmo objeto enquanto nada muda, um objeto novo quando muda', () => {
    const antes = t.obterEstado();
    expect(t.obterEstado()).toBe(antes);
    t.tocar('/a.mp3');
    expect(t.obterEstado()).not.toBe(antes);
  });
});
