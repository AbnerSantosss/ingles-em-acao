/**
 * Moldura HTML compartilhada pelos e-mails do "Inglês em Ação".
 *
 * Por que tudo em tabela e com CSS inline: o Gmail descarta `<style>` em boa
 * parte dos casos, o Outlook (motor do Word) ignora `flex`, `max-width` em
 * `div` e `padding` em `<a>`. O único layout que sobrevive aos três clientes
 * de maior uso (Gmail, Outlook e Apple Mail) é tabela + atributos + estilo
 * inline.
 *
 * Nenhuma imagem externa é usada: o logo é um quadrado amarelo com as letras
 * "IA" desenhado numa célula de tabela, então o e-mail continua com a cara da
 * marca mesmo com o bloqueio de imagens ligado (padrão do Outlook).
 */

/** Cores da marca (CONTRACT §3), repetidas aqui porque cliente de e-mail não lê o CSS do app. */
export const CORES = {
  fundo: '#F7F9FC',
  superficie: '#FFFFFF',
  texto: '#1F2430',
  suave: '#5B6B7F',
  terciario: '#8A96A8',
  borda: '#DCE6F2',
  navy: '#0A1F4E',
  navyClaro: '#123A86',
  amarelo: '#F6C945',
  link: '#0E9BAE',
  mint: '#E6F6F0',
  mintBorda: '#CFEDE2',
  mintTexto: '#0F5D50',
} as const;

/**
 * Figtree não existe em cliente de e-mail; a pilha abaixo cai na fonte de
 * sistema de cada plataforma, que é o comportamento mais previsível.
 */
export const FONTE =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

/** Largura máxima do e-mail, em px. */
const LARGURA = 600;

/** Escapa texto vindo de fora (nome do aluno, URL com token) antes de entrar no HTML. */
export function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Título principal do corpo do e-mail. */
export function titulo(texto: string): string {
  return (
    `<h1 style="margin:0 0 14px;font-family:${FONTE};font-size:24px;line-height:1.25;` +
    `font-weight:800;color:${CORES.navy};">${escaparHtml(texto)}</h1>`
  );
}

export type OpcoesParagrafo = {
  /** Cor do texto. Padrão: cinza de leitura. */
  cor?: string;
  /** Corpo da fonte em px. Padrão: 16. */
  tamanho?: number;
  /** Margem inferior em px. Padrão: 16. */
  margem?: number;
  /** Centraliza o parágrafo. */
  centro?: boolean;
};

/**
 * Parágrafo do corpo. Recebe HTML já pronto (para permitir `<strong>`), então
 * quem chama é responsável por escapar o que vier de fora — use `escaparHtml`.
 */
export function paragrafo(html: string, opcoes: OpcoesParagrafo = {}): string {
  const { cor = CORES.suave, tamanho = 16, margem = 16, centro = false } = opcoes;
  return (
    `<p style="margin:0 0 ${margem}px;font-family:${FONTE};font-size:${tamanho}px;` +
    `line-height:1.6;color:${cor};${centro ? 'text-align:center;' : ''}">${html}</p>`
  );
}

/** Frase de incentivo da marca — em itálico, já que a Caveat não carrega em e-mail. */
export function assinaturaManuscrita(frase: string): string {
  return (
    `<p style="margin:26px 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;` +
    `font-size:17px;line-height:1.5;color:${CORES.navy};">${escaparHtml(frase)}</p>`
  );
}

/**
 * Botão "à prova de balas": o `padding` mora na célula (com `mso-padding-alt`
 * para o Outlook) e o `<a>` é `inline-block` dentro dela. Pílula amarela
 * #F6C945 com texto navy em negrito, como manda o CONTRACT §6.
 */
export function botao({ href, rotulo }: { href: string; rotulo: string }): string {
  const url = escaparHtml(href);
  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"',
    ' style="margin:6px auto 4px;border-collapse:separate;">',
    '<tr>',
    `<td align="center" bgcolor="${CORES.amarelo}"`,
    ` style="background-color:${CORES.amarelo};border-radius:999px;mso-padding-alt:16px 34px;">`,
    `<a href="${url}" target="_blank" rel="noopener"`,
    ` style="display:inline-block;padding:16px 34px;font-family:${FONTE};font-size:16px;`,
    `line-height:20px;font-weight:700;color:${CORES.navy};text-decoration:none;`,
    'border-radius:999px;mso-padding-alt:0;">',
    `<span style="color:${CORES.navy};text-decoration:none;">${escaparHtml(rotulo)}</span>`,
    '</a>',
    '</td>',
    '</tr>',
    '</table>',
  ].join('');
}

/** Caixa de aviso (validade do link, recado de segurança). Recebe HTML pronto. */
export function aviso(html: string): string {
  return [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"',
    ' style="margin:22px 0 0;">',
    '<tr>',
    `<td bgcolor="${CORES.mint}" style="padding:14px 16px;background-color:${CORES.mint};`,
    `border:1px solid ${CORES.mintBorda};border-radius:14px;font-family:${FONTE};`,
    `font-size:14px;line-height:1.55;color:${CORES.mintTexto};">${html}</td>`,
    '</tr>',
    '</table>',
  ].join('');
}

/**
 * Alternativa para quem não consegue clicar no botão: a URL completa em texto,
 * com quebra forçada para não estourar a largura em telas estreitas.
 */
export function urlDeApoio(url: string): string {
  const seguro = escaparHtml(url);
  return [
    `<p style="margin:22px 0 0;font-family:${FONTE};font-size:13px;line-height:1.6;`,
    `color:${CORES.terciario};">`,
    'Se o botão não funcionar, copie e cole este endereço no seu navegador:',
    '</p>',
    `<p style="margin:6px 0 0;font-family:${FONTE};font-size:13px;line-height:1.6;`,
    `color:${CORES.link};word-break:break-all;overflow-wrap:break-word;">`,
    `<a href="${seguro}" target="_blank" rel="noopener"`,
    ` style="color:${CORES.link};text-decoration:underline;word-break:break-all;">${seguro}</a>`,
    '</p>',
  ].join('');
}

/** Linha divisória fina (tabela, porque cada cliente desenha o `<hr>` de um jeito). */
export function separador(): string {
  return [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"',
    ' style="margin:24px 0 0;">',
    '<tr>',
    `<td height="1" style="height:1px;line-height:1px;font-size:0;background-color:${CORES.borda};">`,
    '&nbsp;</td>',
    '</tr>',
    '</table>',
  ].join('');
}

/** Texto invisível que aparece na prévia da caixa de entrada, logo após o assunto. */
function preheaderOculto(texto: string): string {
  // O rabo de espaços de largura zero empurra o conteúdo do corpo para fora da prévia.
  const enchimento = '&#8203;&nbsp;'.repeat(60);
  return (
    '<div style="display:none;max-height:0;max-width:0;opacity:0;overflow:hidden;' +
    `mso-hide:all;font-size:1px;line-height:1px;color:${CORES.fundo};">` +
    `${escaparHtml(texto)}${enchimento}</div>`
  );
}

/** Cabeçalho navy com o logo (quadrado amarelo "IA") e a marca em texto. */
function cabecalho(): string {
  return [
    '<tr>',
    `<td bgcolor="${CORES.navy}" style="padding:26px 28px;background-color:${CORES.navy};`,
    'border-radius:16px 16px 0 0;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0">',
    '<tr>',
    `<td width="46" height="46" align="center" valign="middle" bgcolor="${CORES.amarelo}"`,
    ` style="width:46px;height:46px;background-color:${CORES.amarelo};border-radius:14px;`,
    `font-family:${FONTE};font-size:19px;line-height:46px;font-weight:900;`,
    `letter-spacing:0.02em;color:${CORES.navy};text-align:center;">IA</td>`,
    '<td width="14" style="width:14px;font-size:0;line-height:0;">&nbsp;</td>',
    `<td valign="middle" style="font-family:${FONTE};font-size:18px;line-height:1.25;`,
    'font-weight:800;color:#FFFFFF;">',
    'Inglês em Ação',
    '<span style="display:block;font-size:12px;font-weight:600;line-height:1.4;',
    'color:#AFC3E6;letter-spacing:0.04em;text-transform:uppercase;">',
    'Seu inglês, uma aula por vez</span>',
    '</td>',
    '</tr>',
    '</table>',
    '</td>',
    '</tr>',
  ].join('');
}

/** Rodapé cinza, fora do card branco. */
function rodape(): string {
  return [
    '<tr>',
    `<td style="padding:22px 18px 6px;font-family:${FONTE};font-size:12px;line-height:1.6;`,
    `color:${CORES.terciario};text-align:center;">`,
    'Você recebeu este e-mail porque alguém usou este endereço no Inglês em Ação.',
    '<br />',
    'Se não foi você, é só ignorar esta mensagem — nada acontece sem a sua confirmação.',
    '</td>',
    '</tr>',
    '<tr>',
    `<td style="padding:0 18px 4px;font-family:${FONTE};font-size:12px;line-height:1.6;`,
    `color:${CORES.terciario};text-align:center;">`,
    '© Inglês em Ação · mensagem automática, não é preciso responder.',
    '</td>',
    '</tr>',
  ].join('');
}

export type OpcoesLayout = {
  /** Vai para o `<title>` do documento (alguns webmails o exibem). */
  assunto: string;
  /** Prévia exibida na lista de mensagens, logo depois do assunto. */
  preheader: string;
  /** HTML do corpo, já montado com os helpers deste módulo. */
  conteudo: string;
};

/** Monta o documento HTML completo do e-mail. */
export function layoutEmail({ assunto, preheader, conteudo }: OpcoesLayout): string {
  return [
    '<!DOCTYPE html>',
    '<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width,initial-scale=1" />',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge" />',
    '<meta name="x-apple-disable-message-reformatting" />',
    '<meta name="color-scheme" content="light only" />',
    '<meta name="supported-color-schemes" content="light only" />',
    `<title>${escaparHtml(assunto)}</title>`,
    // O Outlook ignora a pilha de fontes inline em tabela; este bloco condicional conserta.
    '<!--[if mso]>',
    '<style type="text/css">',
    'table,td,div,p,a{font-family:Arial,Helvetica,sans-serif !important;}',
    'table{border-collapse:collapse !important;}',
    '</style>',
    '<![endif]-->',
    '</head>',
    `<body style="margin:0;padding:0;width:100%;background-color:${CORES.fundo};` +
      '-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">',
    preheaderOculto(preheader),
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"' +
      ` style="width:100%;background-color:${CORES.fundo};">`,
    '<tr>',
    '<td align="center" style="padding:28px 14px 34px;">',
    `<table role="presentation" width="${LARGURA}" cellpadding="0" cellspacing="0" border="0"` +
      ` style="width:100%;max-width:${LARGURA}px;margin:0 auto;">`,
    cabecalho(),
    '<tr>',
    `<td bgcolor="${CORES.superficie}" style="padding:30px 28px 32px;` +
      `background-color:${CORES.superficie};border-radius:0 0 16px 16px;` +
      `border-left:1px solid ${CORES.borda};border-right:1px solid ${CORES.borda};` +
      `border-bottom:1px solid ${CORES.borda};">`,
    conteudo,
    '</td>',
    '</tr>',
    rodape(),
    '</table>',
    '</td>',
    '</tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join('\n');
}

/** Rodapé equivalente da versão em texto puro — usado pelos dois templates. */
export function rodapeEmTexto(): string {
  return [
    '--',
    'Inglês em Ação',
    'Você recebeu este e-mail porque alguém usou este endereço no Inglês em Ação.',
    'Se não foi você, é só ignorar esta mensagem.',
    'Mensagem automática — não é preciso responder.',
  ].join('\n');
}

export default layoutEmail;
