/**
 * Videoaula e plano (BACKOFFICE §2.6, CONTRACT §3): o Essencial não recebe o
 * endereço do vídeo — nem no HTML, nem no payload RSC da navegação no cliente.
 * Ele vê a chamada de upgrade no lugar do player.
 *
 * Nenhuma aula do seed tem vídeo, então o teste aponta a Aula 02 para um vídeo
 * do YouTube de mentira (`A1e2eVideo0`) direto no banco de dev e devolve os
 * campos como estavam no `afterAll`. O controle positivo (Plano Completo vê o
 * player com esse id) garante que a ausência no Essencial não é só "a aula
 * ficou sem vídeo".
 */
import { expect, test, type Page, type Response } from '@playwright/test';

import {
  definirVideoDoYoutube,
  fecharBancoDeDev,
  fotografarAula,
  restaurarVideoDaAula,
  type FotoDaAula,
} from './support/banco-dev';
import { entrarComo } from './support/entrar';

const NUMERO = 2;
const AULA_02 = '/aula/verb-to-be-affirmative';
/** 11 caracteres, o formato de id do YouTube que `parseVideoSource` aceita. */
const ID_DO_VIDEO = 'A1e2eVideo0';
/**
 * Um trecho **só ASCII** da chamada de upgrade. ⚠️ O payload RSC vem como
 * `text/x-component` sem charset e o navegador o decodifica como latin-1 —
 * "não incluída" chegaria como "nÃ£o incluÃ­da". Nada acentuado nas buscas em
 * corpo de resposta.
 */
const MARCA_DA_CHAMADA = 'A videoaula faz parte do Plano Completo';

let foto: FotoDaAula | null = null;

test.beforeAll(async () => {
  foto = await fotografarAula(NUMERO);
  await definirVideoDoYoutube(NUMERO, ID_DO_VIDEO);
});

test.afterAll(async () => {
  try {
    if (foto) await restaurarVideoDaAula(foto);
  } finally {
    await fecharBancoDeDev();
  }
});

/** Nenhum player de terceiros é carregado de verdade: só o `src` importa aqui. */
async function bloquearPlayers(page: Page): Promise<void> {
  await page.route(/youtube-nocookie\.com|youtube\.com|player\.vimeo\.com/, (rota) => rota.abort());
}

/**
 * Guarda o corpo dos documentos e das buscas (RSC, inclusive prefetch) do
 * próprio app que a página receber a partir de agora.
 */
function capturarCorpos(page: Page, baseURL: string): { corpos: () => Promise<string[]> } {
  const pendentes: Promise<string>[] = [];
  const origem = new URL(baseURL).origin;

  page.on('response', (resposta: Response) => {
    const tipo = resposta.request().resourceType();
    if (tipo !== 'document' && tipo !== 'fetch') return;
    if (!resposta.url().startsWith(origem)) return;
    // Redirecionamento não tem corpo: a leitura rejeita, e isso não é falha.
    pendentes.push(resposta.text().catch(() => ''));
  });

  return { corpos: () => Promise.all(pendentes) };
}

test('Plano Completo (controle): a Aula 02 mostra o player com o vídeo configurado', async ({ page }) => {
  await bloquearPlayers(page);
  await entrarComo(page, 'ALUNO COMPLETO');

  const resposta = await page.goto(AULA_02);
  expect(resposta?.status()).toBe(200);

  const painel = page.getByRole('region', { name: 'Videoaula desta aula' });
  await expect(painel).toBeVisible();
  await expect(painel.locator('iframe')).toHaveAttribute(
    'src',
    new RegExp(`^https://www\\.youtube-nocookie\\.com/embed/${ID_DO_VIDEO}\\?`),
  );
});

test('Essencial: a Aula 02 não entrega o endereço do vídeo (HTML e RSC)', async ({ page, baseURL }) => {
  await bloquearPlayers(page);
  await entrarComo(page, 'ALUNO ESSENCIAL');

  // 1) Navegação no cliente, pela trilha: a aula chega como payload RSC.
  const captura = capturarCorpos(page, baseURL ?? 'http://localhost:3000');
  await page.goto('/trilha');
  await page.locator(`a[href="${AULA_02}"]`).first().click();
  await page.waitForURL(new RegExp(`${AULA_02}$`));

  const chamada = page.getByRole('region', { name: 'Videoaula não incluída no seu plano' });
  await expect(chamada).toBeVisible();
  await expect(chamada).toContainText('Esta aula tem videoaula gravada.');
  await expect(page.getByRole('region', { name: 'Videoaula desta aula' })).toHaveCount(0);
  await expect(page.locator('iframe, video')).toHaveCount(0);

  const corposDaNavegacao = await captura.corpos();
  // A aula (com a chamada de upgrade) veio mesmo por aqui — senão a checagem
  // abaixo não provaria nada.
  expect(corposDaNavegacao.some((corpo) => corpo.includes(MARCA_DA_CHAMADA))).toBe(true);
  for (const corpo of corposDaNavegacao) {
    expect(corpo).not.toContain(ID_DO_VIDEO);
    expect(corpo).not.toContain('youtube-nocookie.com/embed');
  }

  // 2) Carga direta: o HTML (com o payload RSC embutido) também não tem o id.
  const html = await page.request.get(AULA_02);
  expect(html.status()).toBe(200);
  const texto = await html.text();
  expect(texto).toContain(MARCA_DA_CHAMADA);
  expect(texto).not.toContain(ID_DO_VIDEO);
  expect(texto).not.toContain('youtube-nocookie.com/embed');

  // 3) O DOM final, depois da hidratação.
  await page.goto(AULA_02);
  await expect(page.getByRole('region', { name: 'Videoaula não incluída no seu plano' })).toBeVisible();
  expect(await page.content()).not.toContain(ID_DO_VIDEO);
});
