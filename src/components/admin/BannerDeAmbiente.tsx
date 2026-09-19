/**
 * Faixa de ambiente — BACKOFFICE §2.
 *
 * O motivo é banal e o estrago não é: editar a Aula 14 achando que está no
 * staging. A faixa responde, antes de qualquer clique, "onde eu estou?".
 *
 * As duas formas são deliberadamente diferentes:
 * - **produção** → faixa navy, discreta. Quem trabalha ali o dia inteiro não
 *   pode ter um alerta piscando na cara; o texto está lá para ser consultado.
 * - **qualquer outro ambiente** → faixa amarela, impossível de não ver. Aqui o
 *   risco invertido é pior: achar que uma edição valeu quando ela morreu num
 *   banco local.
 *
 * ⚠️ Server Component de propósito. `process.env.NODE_ENV` lido no servidor é o
 * ambiente do servidor; o mesmo código num Client Component seria congelado no
 * build e passaria a mentir em qualquer imagem promovida entre ambientes.
 */
export function BannerDeAmbiente() {
  const producao = process.env.NODE_ENV === 'production';

  if (producao) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 bg-navy px-4 py-1.5 text-center"
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-yellow">
          Produção
        </span>
        <span className="text-[12px] font-semibold text-white/70">
          o que você publicar aqui aparece para os alunos.
        </span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-yellow px-4 py-2 text-center"
    >
      <span className="text-[11px] font-black uppercase tracking-[0.14em] text-navy">
        Desenvolvimento
      </span>
      <span className="text-[12px] font-bold text-navy/75">
        este não é o ambiente dos alunos. Nada daqui chega a eles.
      </span>
    </div>
  );
}

export default BannerDeAmbiente;
