/** E-mails do app: templates do aluno, rodapé dos alertas do painel e senha de app do Gmail. */
import { describe, expect, it } from 'vitest';

import { layoutEmail, rodapeEmTexto } from '@/lib/mail/layout';
import { resetPasswordTemplate, verifyEmailTemplate, welcomeTemplate } from '@/lib/mail/templates';
import { montarRemetente, senhaParaOServidor } from '@/lib/mail/transport';

const URL_COM_TOKEN = 'https://app.exemplo.com/verificar-email?token=abc&x=1';

describe('templates do aluno', () => {
  it('confirmação: assunto, link completo no HTML e no texto, validade de 24 h', () => {
    const email = verifyEmailTemplate({ name: 'Maria Souza', url: URL_COM_TOKEN });

    expect(email.subject).toBe('Boas-vindas! Confirme seu e-mail');
    expect(email.html).toContain('href="https://app.exemplo.com/verificar-email?token=abc&amp;x=1"');
    expect(email.html).toContain('Olá, <strong>Maria</strong>!');
    expect(email.html).toContain('24 horas');
    expect(email.text).toContain(URL_COM_TOKEN);
    expect(email.text).toContain('Olá, Maria!');
  });

  it('redefinição: validade de 1 h e recado para quem não pediu', () => {
    const email = resetPasswordTemplate({ name: '', url: URL_COM_TOKEN });

    expect(email.subject).toBe('Seu link para criar uma nova senha');
    expect(email.html).toContain('1 hora');
    expect(email.html).toContain('Olá!');
    expect(email.text).toContain('sua senha continua a mesma');
  });

  it('escapa o nome do aluno no HTML', () => {
    const email = verifyEmailTemplate({ name: '<img src=x onerror=alert(1)>', url: URL_COM_TOKEN });

    expect(email.html).not.toContain('<img src=x');
    expect(email.html).toContain('&lt;img');
  });

  it('rodapé do aluno diz que ignorar é seguro', () => {
    const email = verifyEmailTemplate({ name: 'Maria', url: URL_COM_TOKEN });

    expect(email.html).toContain('é só ignorar esta mensagem');
    expect(email.text).toContain('é só ignorar esta mensagem');
  });
});

describe('boas-vindas de conta criada pela equipe', () => {
  const appUrl = 'https://app.exemplo.com';

  it('admin: entrar, criar senha e onde fica o painel', () => {
    const email = welcomeTemplate({ name: 'Joana Lima', appUrl, admin: true });

    expect(email.subject).toBe('Boas-vindas! Sua conta já está pronta');
    expect(email.html).toContain('Olá, <strong>Joana</strong>!');
    expect(email.html).toContain('href="https://app.exemplo.com/entrar"');
    expect(email.html).toContain('href="https://app.exemplo.com/esqueci-senha"');
    expect(email.html).toContain('Painel do administrador');
    expect(email.text).toContain('https://app.exemplo.com/esqueci-senha');
    expect(email.text).toContain('Painel do administrador');
  });

  it('aluno: sem menção ao painel, rodapé diz que a equipe criou a conta', () => {
    const email = welcomeTemplate({ name: '', appUrl, admin: false });

    expect(email.html).not.toContain('Painel do administrador');
    expect(email.html).toContain('Olá!');
    expect(email.html).toContain('a equipe do Inglês em Ação criou uma conta');
    expect(email.text).toContain('a equipe do Inglês em Ação criou uma conta');
  });
});

describe('rodapé dos alertas do painel', () => {
  it('não manda o admin ignorar o alerta', () => {
    const html = layoutEmail({ assunto: 'a', preheader: 'b', conteudo: '<p>c</p>', publico: 'painel' });
    const texto = rodapeEmTexto('painel');

    for (const saida of [html, texto]) {
      expect(saida).toContain('Confira a auditoria do painel agora.');
      expect(saida).not.toContain('ignorar');
    }
  });
});

describe('senhaParaOServidor', () => {
  it('no Gmail tira os espaços da senha de app colada em grupos', () => {
    expect(senhaParaOServidor('smtp.gmail.com', 'abcd efgh ijkl mnop')).toBe('abcdefghijklmnop');
    expect(senhaParaOServidor(' SMTP.Gmail.com ', ' abcd efgh ijkl mnop ')).toBe('abcdefghijklmnop');
    expect(senhaParaOServidor('smtp.googlemail.com', 'abcd efgh')).toBe('abcdefgh');
  });

  it('em outro servidor a senha fica intacta', () => {
    expect(senhaParaOServidor('smtp.exemplo.com', 'senha com espaço')).toBe('senha com espaço');
  });
});

describe('montarRemetente', () => {
  it('usa o nome de MAIL_FROM quando o e-mail não pede outro', () => {
    expect(montarRemetente('Inglês em Ação <conta@gmail.com>')).toEqual({
      name: 'Inglês em Ação',
      address: 'conta@gmail.com',
    });
    expect(montarRemetente(' "Inglês em Ação" <conta@gmail.com> ')).toEqual({
      name: 'Inglês em Ação',
      address: 'conta@gmail.com',
    });
  });

  it('troca só o nome e mantém o endereço de MAIL_FROM', () => {
    expect(montarRemetente('Inglês em Ação <conta@gmail.com>', 'Inglês em Ação · Painel')).toEqual({
      name: 'Inglês em Ação · Painel',
      address: 'conta@gmail.com',
    });
  });

  it('com MAIL_FROM sem nome, mostra a marca em vez do endereço cru', () => {
    expect(montarRemetente('conta@gmail.com')).toEqual({ name: 'Inglês em Ação', address: 'conta@gmail.com' });
    expect(montarRemetente('conta@gmail.com', '  ')).toEqual({ name: 'Inglês em Ação', address: 'conta@gmail.com' });
  });
});
