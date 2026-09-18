/**
 * `/admin/aulas/[numero]` — uma aula (BACKOFFICE §2.3).
 *
 * ⚠️ **As abas nascem aqui, inteiras.** Dados, Páginas, Versões e Vídeo têm
 * cada uma o seu componente; este arquivo só escolhe qual montar. **Não
 * implemente o conteúdo de uma aba aqui** — ele mora no componente dela.
 * Uma aba nova que nascer antes de estar pronta entra com `pronta: false` (a
 * navegação já mostra "em breve").
 *
 * ⚠️ Next 16: `params` e `searchParams` chegam como Promise e precisam de
 * `await`.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { carregarAulaDoPainel, type AulaDoPainel, type EstadoDaAula } from '@/lib/admin/aulas';
import { listarModulosParaSelecao, type OpcaoDeModulo } from '@/lib/admin/modulos';

import { AbaDeDados } from './AbaDeDados';
import { AbaDeVideo } from './AbaDeVideo';
import { AbaDePaginas } from './paginas/AbaDePaginas';
import { AbaDeVersoes } from './versoes/AbaDeVersoes';

export const dynamic = 'force-dynamic';

type Parametros = { numero: string };
type Busca = { [chave: string]: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Promise<Parametros>;
}): Promise<Metadata> {
  const { numero } = await params;
  return { title: `Aula ${numero}` };
}

const ABAS = [
  { id: 'dados', rotulo: 'Dados', pronta: true },
  { id: 'paginas', rotulo: 'Páginas', pronta: true },
  { id: 'versoes', rotulo: 'Versões', pronta: true },
  { id: 'video', rotulo: 'Vídeo', pronta: true },
] as const;

type IdDeAba = (typeof ABAS)[number]['id'];

function ehAba(valor: string): valor is IdDeAba {
  return ABAS.some((aba) => aba.id === valor);
}

const CORES_DO_ESTADO: Record<EstadoDaAula, { fundo: string; cor: string; rotulo: string }> = {
  publicada: { fundo: '#E4F5EA', cor: '#136B45', rotulo: 'Publicada' },
  rascunho: { fundo: '#FEF7E0', cor: '#6B520A', rotulo: 'Rascunho' },
  arquivada: { fundo: '#EEF3FA', cor: '#5B6B86', rotulo: 'Arquivada' },
};

function Selo({ estado }: { estado: EstadoDaAula }) {
  const { fundo, cor, rotulo } = CORES_DO_ESTADO[estado];
  return (
    <span
      className="inline-block rounded-pill px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]"
      style={{ background: fundo, color: cor }}
    >
      {rotulo}
    </span>
  );
}

function Painel({ aba, aula, modulos }: { aba: IdDeAba; aula: AulaDoPainel; modulos: OpcaoDeModulo[] }) {
  switch (aba) {
    case 'dados':
      return <AbaDeDados aula={aula} modulos={modulos} />;
    case 'paginas':
      return <AbaDePaginas aula={aula} />;
    case 'versoes':
      return <AbaDeVersoes aula={aula} />;
    case 'video':
      return <AbaDeVideo aula={aula} />;
    default:
      return null;
  }
}

export default async function TelaDaAula({
  params,
  searchParams,
}: {
  params: Promise<Parametros>;
  searchParams: Promise<Busca>;
}) {
  const [{ numero: numeroBruto }, busca] = await Promise.all([params, searchParams]);

  if (!/^\d{1,3}$/.test(numeroBruto)) notFound();
  const numero = Number(numeroBruto);

  let aula: AulaDoPainel | null = null;
  let modulos: OpcaoDeModulo[] = [];

  try {
    [aula, modulos] = await Promise.all([
      carregarAulaDoPainel(numero),
      listarModulosParaSelecao(),
    ]);
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] aula ${numero} sem banco: ${motivo}`);
    // Sem banco não dá para dizer se a aula existe. Cai no estado degradado
    // abaixo em vez de responder 404 para uma aula que provavelmente existe.
  }

  if (aula === null) {
    return (
      <div className="flex flex-col gap-5">
        <Link href="/admin/aulas" className="text-[14px] font-extrabold text-navy hover:underline">
          ← Todas as aulas
        </Link>
        <div
          className="rounded-card border border-solid p-5"
          style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
        >
          <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
            A aula {numero} não pôde ser carregada.
          </p>
          <p
            className="m-0 mt-1.5 text-[14px] font-semibold leading-snug"
            style={{ color: '#B21F31' }}
          >
            Ou ela não existe, ou o banco de dados não respondeu. Nada foi alterado; volte para a
            lista e tente de novo.
          </p>
        </div>
      </div>
    );
  }

  const abaPedida = Array.isArray(busca.aba) ? busca.aba[0] : busca.aba;
  const aba: IdDeAba = abaPedida && ehAba(abaPedida) ? abaPedida : 'dados';

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Link href="/admin/aulas" className="text-[14px] font-extrabold text-navy hover:underline">
          ← Todas as aulas
        </Link>
        <p className="kicker m-0 mt-3">{aula.code}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="m-0 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
            {aula.title}
          </h1>
          <Selo estado={aula.estado} />
          {aula.temRascunho ? (
            <span
              className="inline-block rounded-pill px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]"
              style={{ background: '#FEF7E0', color: '#6B520A' }}
            >
              Rascunho pendente
            </span>
          ) : null}
        </div>
        <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-muted">
          {aula.moduloTitulo ?? `módulo ${aula.moduleId}`} · {aula.paginas ?? 0} página(s) ·
          versão {aula.contentVersion} · {aula.alunosComProgresso} aluno(s) com progresso (
          {aula.alunosQueConcluiram} concluíram)
        </p>
      </header>

      <nav
        aria-label="Seções da aula"
        className="flex flex-wrap gap-2 border-b border-solid border-border pb-3"
      >
        {ABAS.map((item) => {
          const ativa = item.id === aba;
          return (
            <Link
              key={item.id}
              href={`/admin/aulas/${aula.number}?aba=${item.id}`}
              aria-current={ativa ? 'page' : undefined}
              className="grid h-11 place-items-center rounded-pill px-4 text-[15px] font-extrabold transition-colors duration-150"
              style={
                ativa
                  ? { background: '#0A1F4E', color: '#FFFFFF' }
                  : { background: 'transparent', color: item.pronta ? '#0A1F4E' : '#5B6B86' }
              }
            >
              {item.rotulo}
              {item.pronta ? null : (
                <span className="ml-2 text-[11px] font-extrabold uppercase tracking-[0.08em]">
                  em breve
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
        <Painel aba={aba} aula={aula} modulos={modulos} />
      </section>
    </div>
  );
}
