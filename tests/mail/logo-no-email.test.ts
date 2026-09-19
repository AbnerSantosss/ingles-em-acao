import { describe, expect, it } from 'vitest';

import { layoutEmail, rodapeEmTexto } from '@/lib/mail/layout';
import { resetPasswordTemplate, verifyEmailTemplate, welcomeTemplate } from '@/lib/mail/templates';
import { MARCA } from '@/lib/mail/transport';

const APP = 'https://app.exemplo.com';
const LOGO = `src="${APP}/brand/email/wsa-logo-email.png"`;
const BASICO = { assunto: 'a', preheader: 'b', conteudo: '<p>c</p>' };
const URL_COM_TOKEN = `${APP}/verificar-email?token=abc`;

describe('logo no e-mail', () => {
  it('com appUrl, mostra a logo PNG em 150x48 com alt', () => {
    const html = layoutEmail({ ...BASICO, appUrl: APP });
    expect(html).toContain(LOGO);
    expect(html).toContain('alt="WSA English"');
    expect(html).toContain('width="150"');
    expect(html).toContain('height="48"');
    expect(html).not.toContain('.webp');
    expect(html).not.toContain('Inglês em Ação');
  });

  it('tira a barra do fim da base', () => {
    const html = layoutEmail({ ...BASICO, appUrl: `${APP}/` });
    expect(html).toContain(LOGO);
    expect(html).not.toContain('//brand');
  });

  it('sem appUrl, mostra só o nome em texto', () => {
    const html = layoutEmail(BASICO);
    expect(html).not.toContain('<img');
    expect(html).toContain('WSA English');
  });

  it('ignora appUrl que não é http nem https', () => {
    const html = layoutEmail({ ...BASICO, appUrl: 'javascript:alert(1)' });
    expect(html).not.toContain('<img');
    expect(html).not.toContain('javascript:');
  });

  it('os três templates levam a logo e não citam o nome antigo', () => {
    const emails = [
      verifyEmailTemplate({ name: 'Maria', url: URL_COM_TOKEN, appUrl: APP }),
      resetPasswordTemplate({ name: 'Maria', url: URL_COM_TOKEN, appUrl: APP }),
      welcomeTemplate({ name: 'Maria', appUrl: APP, admin: false }),
    ];
    for (const email of emails) {
      expect(email.html).toContain(LOGO);
      expect(email.html.toLowerCase()).not.toContain('em ação');
      expect(email.text.toLowerCase()).not.toContain('em ação');
    }
  });

  it('remetente e rodapés usam o nome novo', () => {
    expect(MARCA).toBe('WSA English');
    expect(rodapeEmTexto('painel')).toContain('WSA English');
    expect(rodapeEmTexto('conta')).toContain('WSA English');
  });
});
