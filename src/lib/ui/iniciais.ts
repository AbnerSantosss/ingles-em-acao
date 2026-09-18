/**
 * Iniciais do nome: primeira letra do primeiro e do último nome.
 * "Maria Souza" → MS · "Maria" → MA · vazio → A
 *
 * Módulo neutro (sem `'use client'`) para poder ser chamado tanto pelo
 * cabeçalho, que é Client Component, quanto pelo `/perfil`, que é de servidor.
 */
export function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'A';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();

  const primeira = partes[0][0];
  const ultima = partes[partes.length - 1][0];
  return `${primeira}${ultima}`.toUpperCase();
}
