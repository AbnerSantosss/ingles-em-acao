/**
 * Regras do vídeo **enviado** (upload) — BACKOFFICE §4.3, D6.
 *
 * O painel oferece duas formas de pôr vídeo numa aula: colar um link (YouTube,
 * Vimeo, arquivo .mp4/.webm por https — ver `./fonte.ts`) ou **enviar o
 * arquivo**. Este módulo é o contrato da segunda.
 *
 * ## O caminho do arquivo (e por que ele não passa pelo Node)
 *
 * 1. O navegador pede à Server Action uma URL pré-assinada de `PUT`;
 * 2. o navegador manda o arquivo **direto para o bucket** (Cloudflare R2 ou
 *    outro S3-compatível), com barra de progresso;
 * 3. o navegador avisa a Server Action, que confere no bucket (tamanho, tipo e
 *    os primeiros bytes) antes de ligar o arquivo à aula.
 *
 * 500 MB atravessando o Node derrubaria a requisição e comeria memória por
 * minutos — é o que a §4.3 proíbe. E **vídeo nunca vai para o volume Docker**
 * (D6): a banda da VPS satura, e caminho estático é link público para conteúdo
 * pago. O aluno assiste por URL assinada de 15 minutos, renovada pelo player.
 *
 * ⚠️ Módulo **puro**: importado pelo formulário do painel (navegador) e pelas
 * actions (servidor). Nada de `node:*`, Prisma, `process.env` ou sessão aqui.
 */
import { formatarBytes } from '@/lib/media/tipos';

// ─────────────────────────────── limites ─────────────────────────────────────

/** Teto de um arquivo de vídeo (§4.3: 500 MB). */
export const TAMANHO_MAXIMO_VIDEO = 500 * 1024 * 1024;

/** Os dois formatos que o `<video>` de qualquer navegador toca sem biblioteca. */
export const FORMATOS_DE_VIDEO = [
  { mime: 'video/mp4', ext: 'mp4', rotulo: 'MP4' },
  { mime: 'video/webm', ext: 'webm', rotulo: 'WebM' },
] as const;

export type FormatoDeVideo = (typeof FORMATOS_DE_VIDEO)[number];
export type MimeDeVideo = FormatoDeVideo['mime'];

/** O que o `accept` do `<input type="file">` recebe. */
export const ACEITE_DE_VIDEO = FORMATOS_DE_VIDEO.map((formato) => formato.mime).join(',');

/**
 * O alvo de exportação (§4.3). ⚠️ Não há transcodificação: o arquivo que sobe é
 * o arquivo que o aluno baixa. Por isso a tela mostra o alvo e avisa quando o
 * arquivo passa muito dele — um 1080p de 8 Mbps "funciona" e custa o plano de
 * dados de quem assiste no celular.
 */
export const ALVO_DO_VIDEO = { altura: 720, mbps: 2, mbMinimo: 80, mbMaximo: 150 } as const;

/** "Passa muito disso": a folga antes de o aviso aparecer. */
const LIMIAR_DE_AVISO = { altura: ALVO_DO_VIDEO.altura, mbps: 3, bytes: 200 * 1024 * 1024 };

/** Quanto tempo o navegador tem para **começar** o envio depois de pedir a URL. */
export const VALIDADE_DO_ENVIO_S = 30 * 60;

/** Validade do link de reprodução (§4.3: 15 minutos, renovado pelo player). */
export const VALIDADE_DA_LEITURA_S = 15 * 60;

/** Link de reprodução assinado. `expiraEm` é epoch em milissegundos. */
export type LinkAssinado = { src: string; expiraEm: number };

// ────────────────────────────── conferências ─────────────────────────────────

/**
 * O formato do arquivo, pelo MIME e — quando o sistema não informa o MIME, o
 * que acontece com `.webm` em alguns Windows — pela extensão.
 */
export function formatoDoVideo(mime: string, nome: string): FormatoDeVideo | null {
  const porMime = FORMATOS_DE_VIDEO.find((formato) => formato.mime === mime.trim().toLowerCase());
  if (porMime) return porMime;
  if (mime.trim() !== '') return null;

  const extensao = nome.trim().toLowerCase().split('.').pop() ?? '';
  return FORMATOS_DE_VIDEO.find((formato) => formato.ext === extensao) ?? null;
}

export type ArquivoDeclarado = { nome: string; mime: string; bytes: number };

/**
 * A conferência que **bloqueia**: vazio, grande demais, formato fora da lista.
 * Roda no navegador (para não mandar 500 MB à toa) e de novo no servidor, que
 * não confia no que o navegador declarou — e confere o objeto no bucket depois.
 */
export function conferirArquivoDeVideo(
  arquivo: ArquivoDeclarado,
): { ok: true; formato: FormatoDeVideo } | { ok: false; erro: string } {
  if (!Number.isFinite(arquivo.bytes) || arquivo.bytes <= 0) {
    return { ok: false, erro: 'O arquivo está vazio.' };
  }
  if (arquivo.bytes > TAMANHO_MAXIMO_VIDEO) {
    return {
      ok: false,
      erro:
        `O arquivo tem ${formatarBytes(arquivo.bytes)}, e o limite é ${formatarBytes(TAMANHO_MAXIMO_VIDEO)}. ` +
        `Exporte de novo em ${ALVO_DO_VIDEO.altura}p, por volta de ${ALVO_DO_VIDEO.mbps} Mbps: ` +
        `uma aula fica entre ${ALVO_DO_VIDEO.mbMinimo} e ${ALVO_DO_VIDEO.mbMaximo} MB.`,
    };
  }

  const formato = formatoDoVideo(arquivo.mime, arquivo.nome);
  if (!formato) {
    return {
      ok: false,
      erro:
        `Só entram arquivos ${FORMATOS_DE_VIDEO.map((f) => f.rotulo).join(' ou ')} ` +
        `(até ${formatarBytes(TAMANHO_MAXIMO_VIDEO)}), os dois formatos que qualquer navegador toca. ` +
        'Exporte em MP4 com vídeo H.264 e áudio AAC.',
    };
  }

  return { ok: true, formato };
}

/** Medidas lidas pelo navegador (`loadedmetadata`) antes do envio. */
export type MedidasDoVideo = { largura: number; altura: number; duracaoS: number };

/** Taxa média em Mbps, ou `null` sem duração válida. */
export function taxaMediaEmMbps(bytes: number, duracaoS: number): number | null {
  if (!Number.isFinite(duracaoS) || duracaoS <= 0) return null;
  return (bytes * 8) / duracaoS / 1_000_000;
}

/**
 * Os avisos que **não** bloqueiam — o "avisa quando passa muito disso" da §4.3.
 * `medidas` é `null` quando o navegador não conseguiu ler o arquivo.
 */
export function avisosDoVideo(bytes: number, medidas: MedidasDoVideo | null): string[] {
  const avisos: string[] = [];

  if (medidas === null) {
    avisos.push(
      'Este navegador não conseguiu ler o vídeo. Se ele não abre aqui, é provável que o aluno ' +
        'também não consiga assistir: exporte em MP4 com H.264 (ou WebM com VP9) antes de enviar.',
    );
  } else {
    if (medidas.altura > LIMIAR_DE_AVISO.altura) {
      avisos.push(
        `Resolução ${medidas.largura}×${medidas.altura}, acima do alvo de ${ALVO_DO_VIDEO.altura}p. ` +
          'Na tela do celular a diferença quase não aparece; no consumo de dados do aluno, aparece.',
      );
    }
    // O player da aula é 16:9: vídeo vertical ou quadrado vira faixa preta dos lados.
    if (medidas.largura > 0 && medidas.altura > 0) {
      const razao = medidas.largura / medidas.altura;
      if (Math.abs(razao / (16 / 9) - 1) > 0.08) {
        avisos.push(
          `Proporção ${medidas.largura}×${medidas.altura}, fora do 16:9 do player da aula ` +
            `(ex.: ${Math.round((ALVO_DO_VIDEO.altura * 16) / 9)}×${ALVO_DO_VIDEO.altura}). ` +
            'O vídeo toca com faixas pretas nas bordas.',
        );
      }
    }
    const taxa = taxaMediaEmMbps(bytes, medidas.duracaoS);
    if (taxa !== null && taxa > LIMIAR_DE_AVISO.mbps) {
      avisos.push(
        `Taxa média de ${formatarDecimal(taxa)} Mbps, acima do alvo de ~${ALVO_DO_VIDEO.mbps} Mbps.`,
      );
    }
  }

  if (bytes > LIMIAR_DE_AVISO.bytes) {
    avisos.push(
      `O arquivo tem ${formatarBytes(bytes)}; o alvo é de ${ALVO_DO_VIDEO.mbMinimo} a ` +
        `${ALVO_DO_VIDEO.mbMaximo} MB por aula. Ele sobe e toca, mas pesa para quem assiste pelo celular.`,
    );
  }

  return avisos;
}

/** "1280×720 · 14 min · 1,9 Mbps" — o resumo do arquivo escolhido. */
export function descreverMedidas(bytes: number, medidas: MedidasDoVideo | null): string {
  const partes = [formatarBytes(bytes)];
  if (medidas) {
    if (medidas.largura > 0 && medidas.altura > 0) partes.push(`${medidas.largura}×${medidas.altura}`);
    if (Number.isFinite(medidas.duracaoS) && medidas.duracaoS > 0) {
      partes.push(formatarDuracao(medidas.duracaoS));
    }
    const taxa = taxaMediaEmMbps(bytes, medidas.duracaoS);
    if (taxa !== null) partes.push(`${formatarDecimal(taxa)} Mbps`);
  }
  return partes.join(' · ');
}

function formatarDecimal(valor: number): string {
  return valor.toFixed(1).replace('.', ',');
}

function formatarDuracao(segundos: number): string {
  const total = Math.round(segundos);
  const minutos = Math.floor(total / 60);
  const resto = total % 60;
  if (minutos === 0) return `${resto} s`;
  return resto === 0 ? `${minutos} min` : `${minutos} min ${resto} s`;
}

// ───────────────────────────── chave no bucket ───────────────────────────────

/** Pasta dos vídeos no bucket. */
export const PASTA_DE_VIDEOS = 'videos';

/**
 * A chave que **o servidor** gera: `videos/<uuid>.mp4`. Qualquer outra forma é
 * recusada antes de chegar perto do bucket — o nome enviado pelo admin nunca
 * vira caminho.
 */
const CHAVE_DE_VIDEO =
  /^videos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:mp4|webm)$/;

export function chaveDeVideoValida(chave: unknown): chave is string {
  return typeof chave === 'string' && CHAVE_DE_VIDEO.test(chave);
}

// ──────────────────────────── os primeiros bytes ─────────────────────────────

/**
 * O formato de verdade, pelos primeiros bytes — a mesma ideia da conferência
 * de assinatura das imagens (`@/lib/media/validacao`). MP4 traz `ftyp` do byte
 * 4 ao 7; WebM (Matroska/EBML) começa com `1A 45 DF A3`. Extensão e
 * `Content-Type` são só o que alguém disse que o arquivo é.
 */
export function formatoPelosBytes(inicio: Uint8Array): FormatoDeVideo['ext'] | null {
  const ftyp =
    inicio.length >= 8 &&
    inicio[4] === 0x66 &&
    inicio[5] === 0x74 &&
    inicio[6] === 0x79 &&
    inicio[7] === 0x70;
  if (ftyp) return 'mp4';

  const ebml =
    inicio.length >= 4 &&
    inicio[0] === 0x1a &&
    inicio[1] === 0x45 &&
    inicio[2] === 0xdf &&
    inicio[3] === 0xa3;
  if (ebml) return 'webm';

  return null;
}
