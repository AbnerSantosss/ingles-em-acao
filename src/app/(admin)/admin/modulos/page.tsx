/**
 * `/admin/modulos` — os módulos do curso (BACKOFFICE §2.2).
 *
 * A leitura acontece aqui, em Server Component; a interação mora no
 * `PainelDeModulos` ao lado. Se o banco não responder, a tela mostra o **estado
 * degradado** em vez de estourar — o mesmo critério do dashboard: uma tela de
 * erro esconde justamente a informação de que algo está errado.
 */
import type { Metadata } from 'next';

import { listarModulosDoPainel, type ModuloDoPainel } from '@/lib/admin/modulos';

import { PainelDeModulos } from './PainelDeModulos';

export const metadata: Metadata = { title: 'Módulos' };
export const dynamic = 'force-dynamic';

async function carregar(): Promise<ModuloDoPainel[] | null> {
  try {
    return await listarModulosDoPainel();
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] módulos sem banco: ${motivo}`);
    return null;
  }
}

function Degradado() {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        Os módulos não puderam ser carregados.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; recarregue a página em alguns
        instantes. O detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}

export default async function TelaDeModulos() {
  const modulos = await carregar();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Conteúdo</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Módulos
        </h1>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          A ordem em que os módulos aparecem na trilha do aluno, o título de cada um e a faixa de
          aulas que ele declara. Arquivar um módulo só é possível quando ele está vazio.
        </p>
      </header>

      <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
        {modulos === null ? <Degradado /> : <PainelDeModulos modulos={modulos} />}
      </section>
    </div>
  );
}
