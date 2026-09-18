/**
 * Hash de senhas — Argon2id.
 *
 * ⚠️ MÓDULO DE SERVIDOR. O `@node-rs/argon2` é um binário nativo; importá-lo de um
 * componente `'use client'` quebra o bundle do navegador.
 *
 * Regra 1 do contrato (§5): "Argon2id via @node-rs/argon2. Nunca texto puro, nunca em log."
 * Nenhuma função deste arquivo escreve senha, hash ou trecho deles em log — nem em
 * mensagem de erro.
 */
import { type Algorithm, hash, verify } from '@node-rs/argon2';

import { TAMANHO_MAXIMO_SENHA } from '@/lib/auth/constantes';

/**
 * `Algorithm.Argon2id` (= 2).
 *
 * O `@node-rs/argon2` declara `Algorithm` como `declare const enum`, e o projeto
 * compila com `isolatedModules: true` — nessa combinação o TypeScript proíbe ler
 * o membro do enum (TS2748), porque cada arquivo é transpilado isolado e o valor
 * não estaria disponível. O valor numérico é estável (faz parte do formato PHC
 * do Argon2, não da biblioteca), então fixá-lo aqui com o tipo correto é seguro.
 */
const ARGON2ID = 2 as Algorithm;

/**
 * Parâmetros de custo do Argon2id.
 *
 * Alvo: ~100 ms por hash num servidor modesto (VPS de 2 vCPU compartilhadas).
 * Medido nesta máquina de desenvolvimento (Intel i9-14900HX): 26 ms por hash.
 * Um vCPU compartilhado de VPS costuma ser 3–4× mais lento por thread, o que coloca
 * o custo real na faixa de 80–110 ms — caro o bastante para brute force, barato o
 * bastante para não travar o login.
 *
 * - `memoryCost` 32768 KiB = 32 MiB por hash. É o parâmetro que mais atrapalha
 *   ataque com GPU (memória é cara em paralelo). Acima da recomendação mínima da
 *   OWASP para Argon2id (19 MiB) e ainda seguro para um servidor pequeno: com
 *   `parallelism: 1`, cada login concorrente reserva 32 MiB por alguns
 *   milissegundos. Subir isso para 64 MiB dobraria o pico de memória sob rajada
 *   de logins — foi a razão de parar em 32.
 * - `timeCost` 3 passagens sobre a memória. É o botão de ajuste barato: se o
 *   servidor final for mais rápido que o previsto, suba este número antes de mexer
 *   na memória.
 * - `parallelism` 1 thread. O servidor já é concorrente por requisição; usar mais
 *   threads por hash roubaria CPU do resto do app e mudaria o hash resultante.
 * - `outputLen` 32 bytes, o padrão recomendado.
 *
 * ⚠️ Mudar qualquer valor aqui NÃO invalida os hashes antigos: os parâmetros vão
 * gravados dentro da própria string PHC (`$argon2id$v=19$m=32768,t=3,p=1$...`), e a
 * verificação usa os parâmetros do hash, não os daqui. Use `precisaRehash()` para
 * migrar as senhas antigas aos poucos, no login bem-sucedido.
 */
export const PARAMETROS_ARGON2 = {
  algorithm: ARGON2ID,
  memoryCost: 32768,
  timeCost: 3,
  parallelism: 1,
  outputLen: 32,
} as const;

// O limite mora em `constantes.ts` (módulo sem dependência nativa) para que o
// `schemas.ts` possa usá-lo no cliente sem arrastar o Argon2 para o navegador.
export { TAMANHO_MAXIMO_SENHA } from '@/lib/auth/constantes';

/** Formato PHC de um hash Argon2 gerado aqui — usado só para descartar lixo cedo. */
const FORMATO_PHC = /^\$argon2(?:id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+(?:,keyid=[^$]*)?(?:,data=[^$]*)?\$[A-Za-z0-9+/]+=*\$[A-Za-z0-9+/]+=*$/;

/**
 * Gera o hash Argon2id de uma senha em texto puro.
 *
 * O salt é aleatório por chamada (gerado pela biblioteca) e vai embutido no
 * resultado, então dois usuários com a mesma senha têm hashes diferentes.
 *
 * @throws Se a senha for vazia ou maior que {@link TAMANHO_MAXIMO_SENHA}. A
 * mensagem nunca contém a senha.
 */
export async function hashPassword(senha: string): Promise<string> {
  if (typeof senha !== 'string' || senha.length === 0) {
    throw new Error('Senha vazia: não há o que gerar.');
  }

  if (senha.length > TAMANHO_MAXIMO_SENHA) {
    throw new Error(`Senha longa demais (limite de ${TAMANHO_MAXIMO_SENHA} caracteres).`);
  }

  return hash(senha, PARAMETROS_ARGON2);
}

/**
 * Confere uma senha contra o hash guardado no banco.
 *
 * **Nunca lança.** Hash malformado, truncado, vazio, nulo (coluna corrompida ou
 * registro migrado de outro sistema) ou binário nativo reclamando: tudo vira
 * `false`. Quem chama trata apenas "bateu" ou "não bateu" — assim um dado
 * estranho no banco vira credencial inválida, não um 500 que entrega ao atacante
 * a informação de que aquele usuário existe e está num estado especial.
 */
export async function verifyPassword(hashGuardado: string, senha: string): Promise<boolean> {
  if (typeof hashGuardado !== 'string' || typeof senha !== 'string') return false;
  if (hashGuardado.length === 0 || senha.length === 0) return false;
  if (senha.length > TAMANHO_MAXIMO_SENHA) return false;
  if (!FORMATO_PHC.test(hashGuardado)) return false;

  try {
    return await verify(hashGuardado, senha);
  } catch {
    // Silêncio proposital: logar aqui imprimiria o hash na saída padrão.
    return false;
  }
}

/**
 * Diz se um hash foi gerado com parâmetros mais fracos que os atuais.
 *
 * Uso previsto: no login bem-sucedido, se `precisaRehash(user.passwordHash)` for
 * verdadeiro, gere um hash novo com a senha que o usuário acabou de digitar (é o
 * único momento em que ela existe em texto puro) e grave por cima. Assim o custo
 * sobe junto com o hardware sem pedir nada ao usuário.
 */
export function precisaRehash(hashGuardado: string): boolean {
  if (typeof hashGuardado !== 'string' || !FORMATO_PHC.test(hashGuardado)) return true;

  if (!hashGuardado.startsWith('$argon2id$')) return true;

  const parametros = /\$m=(\d+),t=(\d+),p=(\d+)\$/.exec(hashGuardado);
  if (!parametros) return true;

  const memoria = Number(parametros[1]);
  const tempo = Number(parametros[2]);
  const paralelismo = Number(parametros[3]);

  return (
    memoria < PARAMETROS_ARGON2.memoryCost ||
    tempo < PARAMETROS_ARGON2.timeCost ||
    paralelismo !== PARAMETROS_ARGON2.parallelism
  );
}
