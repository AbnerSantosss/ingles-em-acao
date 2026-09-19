/**
 * Quais rotas entram em modo foco (plano v2, pacote 05): só a aula e o resultado
 * dela. O resto do app logado continua com cabeçalho e barra de navegação.
 */
import { describe, expect, it } from 'vitest';

import { ehRotaDeFoco } from '@/components/app/modo-foco';

describe('ehRotaDeFoco', () => {
  it.each([
    '/aula/subject-pronouns',
    '/aula/subject-pronouns/',
    '/aula/subject-pronouns/resultado',
    '/aula/subject-pronouns/resultado/',
  ])('%s entra em modo foco', (caminho) => {
    expect(ehRotaDeFoco(caminho)).toBe(true);
  });

  it.each([
    '/inicio',
    '/trilha',
    '/progresso',
    '/perfil',
    '/aula',
    '/aula/',
    '/aula/subject-pronouns/outra',
    '/aula/subject-pronouns/resultado/extra',
    '/admin/aulas/1',
    '/trilha/aula/subject-pronouns',
    '',
  ])('"%s" fica com a moldura do app', (caminho) => {
    expect(ehRotaDeFoco(caminho)).toBe(false);
  });

  it('null fica com a moldura do app', () => {
    expect(ehRotaDeFoco(null)).toBe(false);
  });

  it('undefined fica com a moldura do app', () => {
    expect(ehRotaDeFoco(undefined)).toBe(false);
  });
});
