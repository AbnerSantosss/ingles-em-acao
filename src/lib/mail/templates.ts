/**
 * Os dois e-mails transacionais do "WSA English".
 *
 * Cada template devolve `{ subject, html, text }`. A versão `text` não é
 * enfeite: é ela que o cliente mostra quando o HTML é bloqueado, e é ela que
 * mantém o e-mail longe do spam — por isso traz o mesmo conteúdo, legível, com
 * a URL completa.
 */
import {
  assinaturaManuscrita,
  aviso,
  botao,
  CORES,
  escaparHtml,
  layoutEmail,
  paragrafo,
  rodapeEmTexto,
  separador,
  titulo,
  urlDeApoio,
} from './layout';

export type DadosDoTemplate = {
  /** Nome do aluno, como veio do cadastro. Pode vir vazio. */
  name: string;
  /** URL absoluta e completa do link de ação (já com o token). */
  url: string;
  /** Base pública do app, sem barra no fim. Liga a logo no cabeçalho do e-mail. */
  appUrl?: string;
};

export type EmailRenderizado = {
  subject: string;
  html: string;
  text: string;
};

/**
 * Primeiro nome, para o e-mail soar como gente e não como formulário.
 * Corta em 40 caracteres porque o campo `name` não tem limite no formulário e
 * uma saudação gigante quebra a linha do título.
 */
function primeiroNome(name: string): string {
  const limpo = name.trim().replace(/\s+/g, ' ');
  if (!limpo) return '';
  const primeiro = limpo.split(' ')[0] ?? '';
  return primeiro.length > 40 ? primeiro.slice(0, 40) : primeiro;
}

/** "Olá, Maria!" ou "Olá!" quando não sabemos o nome. */
function saudacao(name: string): { html: string; texto: string } {
  const nome = primeiroNome(name);
  if (!nome) return { html: 'Olá!', texto: 'Olá!' };
  return { html: `Olá, <strong>${escaparHtml(nome)}</strong>!`, texto: `Olá, ${nome}!` };
}

/** Junta as linhas da versão em texto, normalizando o excesso de linhas em branco. */
function montarTexto(linhas: string[]): string {
  return linhas.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * E-mail de confirmação de endereço. Tom de boas-vindas: a conta já existe e já
 * pode ser usada — confirmar só garante a recuperação de acesso depois.
 */
export function verifyEmailTemplate({ name, url, appUrl }: DadosDoTemplate): EmailRenderizado {
  // O remetente já mostra a marca; o assunto diz só do que se trata.
  const subject = 'Boas-vindas! Confirme seu e-mail';
  const oi = saudacao(name);

  const conteudo = [
    titulo('Que bom ter você aqui!'),
    paragrafo(`${oi.html} Sua conta no WSA English já está pronta.`, {
      cor: CORES.texto,
      margem: 12,
    }),
    paragrafo(
      'Falta só confirmar que este endereço é seu. É isso que nos permite ' +
        'devolver seu acesso caso você esqueça a senha um dia.',
    ),
    botao({ href: url, rotulo: 'Confirmar meu e-mail' }),
    aviso(
      'Este link vale por <strong>24 horas</strong>. Se ele expirar, é só pedir ' +
        'um novo e-mail de confirmação dentro do app.',
    ),
    urlDeApoio(url),
    separador(),
    paragrafo(
      'Enquanto isso, pode estudar à vontade: as 42 aulas já estão liberadas, ' +
        'a confirmação não trava nada.',
      { tamanho: 14, margem: 0 },
    ),
    assinaturaManuscrita('Small steps, big results.'),
  ].join('\n');

  const html = layoutEmail({
    assunto: subject,
    appUrl,
    preheader: 'Sua conta já está pronta. Falta só confirmar que este endereço é seu.',
    conteudo,
  });

  const text = montarTexto([
    'QUE BOM TER VOCÊ AQUI!',
    '',
    oi.texto,
    '',
    'Sua conta no WSA English já está pronta. Falta só confirmar que este',
    'endereço é seu. É isso que nos permite devolver seu acesso caso você',
    'esqueça a senha um dia.',
    '',
    'Confirme seu e-mail abrindo o endereço abaixo no navegador:',
    url,
    '',
    'O link vale por 24 horas. Se ele expirar, é só pedir um novo e-mail de',
    'confirmação dentro do app.',
    '',
    'Enquanto isso, pode estudar à vontade: as 42 aulas já estão liberadas,',
    'a confirmação não trava nada.',
    '',
    'Small steps, big results.',
    '',
    rodapeEmTexto(),
  ]);

  return { subject, html, text };
}

/**
 * E-mail de redefinição de senha. Tom sóbrio e curto: quem pediu quer resolver
 * rápido, e quem não pediu precisa entender em uma frase que está tudo bem.
 */
export function resetPasswordTemplate({ name, url, appUrl }: DadosDoTemplate): EmailRenderizado {
  const subject = 'Seu link para criar uma nova senha';
  const oi = saudacao(name);

  const conteudo = [
    titulo('Vamos criar uma senha nova'),
    paragrafo(
      `${oi.html} Recebemos um pedido para redefinir a senha da sua conta no WSA English.`,
      { cor: CORES.texto, margem: 12 },
    ),
    paragrafo('Clique no botão abaixo para escolher uma senha nova (mínimo de 8 caracteres).'),
    botao({ href: url, rotulo: 'Criar nova senha' }),
    aviso(
      'Este link vale por <strong>1 hora</strong> e só pode ser usado uma vez. ' +
        'Ao criar a senha nova, encerramos as sessões abertas em outros aparelhos.',
    ),
    urlDeApoio(url),
    separador(),
    paragrafo(
      '<strong>Se não foi você que pediu, pode ignorar este e-mail: ' +
        'sua senha continua a mesma.</strong>',
      { tamanho: 14, margem: 0, cor: CORES.texto },
    ),
  ].join('\n');

  const html = layoutEmail({
    assunto: subject,
    appUrl,
    preheader: 'Link para criar uma senha nova. Vale por 1 hora.',
    conteudo,
  });

  const text = montarTexto([
    'VAMOS CRIAR UMA SENHA NOVA',
    '',
    oi.texto,
    '',
    'Recebemos um pedido para redefinir a senha da sua conta no WSA English.',
    'Abra o endereço abaixo no navegador para escolher uma senha nova',
    '(mínimo de 8 caracteres):',
    url,
    '',
    'O link vale por 1 hora e só pode ser usado uma vez. Ao criar a senha nova,',
    'encerramos as sessões abertas em outros aparelhos.',
    '',
    'Se não foi você que pediu, pode ignorar este e-mail: sua senha continua a mesma.',
    '',
    rodapeEmTexto(),
  ]);

  return { subject, html, text };
}

export type DadosDeBoasVindas = {
  /** Nome para a saudação. Pode vir vazio. */
  name: string;
  /** Base pública do app, sem barra no fim. */
  appUrl: string;
  /** Conta de admin: o e-mail também explica onde fica o painel. */
  admin: boolean;
};

/**
 * Boas-vindas para uma conta criada pela equipe (contas do MVP, admin novo),
 * que não passou pelo cadastro e por isso nunca recebeu e-mail nenhum.
 *
 * Não leva token de senha: esse link vence em 1 hora, e um e-mail de
 * boas-vindas costuma ser aberto dias depois. Quem não tem senha cria a sua
 * pelo "Esqueci minha senha", que manda um link novo na hora.
 */
export function welcomeTemplate({ name, appUrl, admin }: DadosDeBoasVindas): EmailRenderizado {
  const subject = 'Boas-vindas! Sua conta já está pronta';
  const oi = saudacao(name);
  const entrar = `${appUrl}/entrar`;
  const esqueci = `${appUrl}/esqueci-senha`;

  const acesso = admin
    ? 'Ela tem acesso de <strong>aluno</strong>, com as 42 aulas liberadas, e de ' +
      '<strong>administrador</strong>, para cuidar das aulas, dos alunos e dos vídeos.'
    : 'As <strong>42 aulas</strong> já estão liberadas para você.';

  const conteudo = [
    titulo('Boas-vindas ao WSA English!'),
    paragrafo(`${oi.html} Sua conta já está pronta.`, { cor: CORES.texto, margem: 12 }),
    paragrafo(acesso),
    botao({ href: entrar, rotulo: 'Entrar no app' }),
    aviso(
      '<strong>Primeiro acesso?</strong> Se você ainda não tem senha, ou quer criar uma só sua, ' +
        `use <a href="${escaparHtml(esqueci)}" target="_blank" rel="noopener" ` +
        `style="color:${CORES.link};font-weight:700;text-decoration:underline;">Esqueci minha senha</a> ` +
        'com este e-mail. O link para criar a senha chega aqui em seguida.',
    ),
    ...(admin
      ? [
          separador(),
          paragrafo('<strong>Onde fica cada coisa</strong>', { cor: CORES.texto, margem: 8 }),
          paragrafo(
            'Depois de entrar, você começa na área do aluno. Para abrir o painel, toque em ' +
              '<strong>Perfil</strong> e depois em <strong>Painel do administrador</strong>. ' +
              'No painel, <strong>Ver como aluno</strong> traz você de volta.',
            { tamanho: 15, margem: 0 },
          ),
        ]
      : []),
    assinaturaManuscrita('Small steps, big results.'),
  ].join('\n');

  const html = layoutEmail({
    assunto: subject,
    appUrl,
    preheader: admin
      ? 'Acesso de aluno e de administrador liberado. Veja como entrar.'
      : 'As 42 aulas já estão liberadas. Veja como entrar.',
    conteudo,
    publico: 'conta',
  });

  const text = montarTexto([
    'BOAS-VINDAS AO WSA ENGLISH!',
    '',
    oi.texto,
    '',
    'Sua conta já está pronta.',
    admin
      ? 'Ela tem acesso de aluno, com as 42 aulas liberadas, e de administrador,\npara cuidar das aulas, dos alunos e dos vídeos.'
      : 'As 42 aulas já estão liberadas para você.',
    '',
    'Entre no app:',
    entrar,
    '',
    'Primeiro acesso? Se você ainda não tem senha, ou quer criar uma só sua,',
    'use "Esqueci minha senha" com este e-mail:',
    esqueci,
    ...(admin
      ? [
          '',
          'ONDE FICA CADA COISA',
          'Depois de entrar, você começa na área do aluno. Para abrir o painel, toque',
          'em Perfil e depois em Painel do administrador. No painel, "Ver como aluno"',
          'traz você de volta.',
        ]
      : []),
    '',
    'Small steps, big results.',
    '',
    rodapeEmTexto('conta'),
  ]);

  return { subject, html, text };
}
