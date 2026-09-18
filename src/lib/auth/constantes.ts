/**
 * Constantes de autenticação compartilhadas entre servidor e cliente.
 *
 * Este módulo é DELIBERADAMENTE neutro: não importa `@node-rs/argon2`, Prisma,
 * `next/headers` nem nada que só exista no servidor. É o único lugar do diretório
 * `auth/` que um componente `'use client'` pode importar com segurança.
 *
 * Motivo: `schemas.ts` (zod, usado nos formulários) precisa dos limites de tamanho
 * de senha. Quando esses limites moravam em `password.ts`, qualquer form com
 * `'use client'` arrastava o binário nativo do Argon2 para o bundle do navegador e
 * o build quebrava em "Export verify doesn't exist in target module".
 */

/** Mínimo de caracteres de senha exigido pelo contrato (§5.8). */
export const TAMANHO_MINIMO_SENHA = 8;

/**
 * Teto de tamanho da senha aceita.
 *
 * O custo do Argon2 quase não depende do tamanho da entrada, mas aceitar uma senha
 * de vários megabytes gasta memória e banda à toa (DoS barato). 1024 caracteres é
 * folgado para qualquer gerenciador de senhas.
 */
export const TAMANHO_MAXIMO_SENHA = 1024;
