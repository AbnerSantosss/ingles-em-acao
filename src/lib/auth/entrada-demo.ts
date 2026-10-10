/**
 * Chave do acesso rápido ("Entrar como aluno" / "Entrar como admin").
 *
 * Fora de produção está sempre ligado. Em produção só liga com
 * `ENTRADA_DEMO=aberta` no ambiente do container.
 *
 * ⚠️ Ligado em produção, QUALQUER visitante entra como admin sem senha: vê os
 * dados dos alunos e altera o conteúdo. Foi decisão do dono em 2026-10-10, para
 * a fase de validação. Para fechar, cadastre `ENTRADA_DEMO=fechada` nas
 * variáveis da stack no Portainer e refaça o deploy — tem que sair antes de a
 * página de vendas ir ao ar (PENDENCIAS.md, item 28).
 */
export function entradaDemoLiberada(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ENTRADA_DEMO === 'aberta';
}
