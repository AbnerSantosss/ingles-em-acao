/**
 * `/admin/aulas` — a lista das aulas (BACKOFFICE §2.3).
 *
 * ⚠️ Os filtros são um `<form method="get">`: eles viram query string, a página
 * recarrega no servidor e **o estado da busca fica no endereço**. Dá para
 * recarregar, compartilhar o link de "todas as arquivadas do módulo 3" e usar o
 * botão voltar. Um filtro em `useState` perderia as três coisas e ainda mandaria
 * as 42 linhas para o navegador.
 *
 * ⚠️ Next 16: `searchParams` chega como Promise e precisa de `await`.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import {
  listarAulas,
  type AulaDaLista,
  type EstadoDaAula,
  type ListaDeAulas,
} from '@/lib/admin/aulas';
import { listarModulosParaSelecao, type OpcaoDeModulo } from '@/lib/admin/modulos';

import { NovaAula } from './NovaAula';

export const metadata: Metadata = { title: 'Aulas' };
export const dynamic = 'force-dynamic';

type Busca = { [chave: string]: string | string[] | undefined };

/** Primeiro valor de um parâmetro repetido — `?q=a&q=b` vira `a`. */
function primeiro(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? '';
  return valor ?? '';
}

const ESTADOS: readonly { valor: EstadoDaAula | 'todas'; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'publicada', rotulo: 'Publicadas' },
  { valor: 'rascunho', rotulo: 'Rascunhos' },
  { valor: 'arquivada', rotulo: 'Arquivadas' },
];

function ehEstado(valor: string): valor is EstadoDaAula | 'todas' {
  return ESTADOS.some((estado) => estado.valor === valor);
}

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

const CORES_DO_ESTADO: Record<EstadoDaAula, { fundo: string; cor: string; rotulo: string }> = {
  publicada: { fundo: '#E4F5EA', cor: '#136B45', rotulo: 'Publicada' },
  rascunho: { fundo: '#FEF7E0', cor: '#6B520A', rotulo: 'Rascunho' },
  arquivada: { fundo: '#EEF3FA', cor: '#5B6B86', rotulo: 'Arquivada' },
};

function Selo({ estado }: { estado: EstadoDaAula }) {
  const { fundo, cor, rotulo } = CORES_DO_ESTADO[estado];
  return (
    <span
      className="inline-block rounded-pill px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
      style={{ background: fundo, color: cor }}
    >
      {rotulo}
    </span>
  );
}

const CAMPO_DE_FILTRO = [
  'h-11 rounded-field border-[1.5px] border-border bg-bg px-3',
  'text-[15px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
].join(' ');

function Filtros({
  busca,
  modulo,
  estado,
  modulos,
}: {
  busca: string;
  modulo: string;
  estado: EstadoDaAula | 'todas';
  modulos: OpcaoDeModulo[];
}) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-[220px] flex-1 flex-col gap-2">
        <label
          htmlFor="filtro-q"
          className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted"
        >
          Buscar
        </label>
        <input
          id="filtro-q"
          name="q"
          type="search"
          defaultValue={busca}
          placeholder="número, título, código ou slug"
          className={`${CAMPO_DE_FILTRO} w-full`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="filtro-modulo"
          className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted"
        >
          Módulo
        </label>
        <select id="filtro-modulo" name="modulo" defaultValue={modulo} className={CAMPO_DE_FILTRO}>
          <option value="">Todos</option>
          {modulos.map((opcao) => (
            <option key={opcao.id} value={String(opcao.id)}>
              {opcao.order}. {opcao.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="filtro-estado"
          className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted"
        >
          Estado
        </label>
        <select id="filtro-estado" name="estado" defaultValue={estado} className={CAMPO_DE_FILTRO}>
          {ESTADOS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-11 cursor-pointer rounded-pill border-0 bg-navy px-5 text-[15px] font-extrabold tracking-[0.03em] text-white transition-colors duration-150 hover:bg-navy-light"
      >
        Filtrar
      </button>

      <Link
        href="/admin/aulas"
        className="grid h-11 place-items-center rounded-pill px-4 text-[15px] font-extrabold text-navy transition-colors duration-150 hover:bg-[#EAF2FE]"
      >
        Limpar
      </Link>
    </form>
  );
}

function Linha({ aula }: { aula: AulaDaLista }) {
  return (
    <li className="rounded-[18px] border border-solid border-border p-4">
      <div className="flex flex-wrap items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 flex-none place-items-center rounded-field bg-[#F1F5FA] text-[17px] font-black text-navy"
        >
          {aula.number}
        </span>

        <div className="min-w-0 flex-1">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/aulas/${aula.number}`}
              className="text-[17px] font-black leading-tight text-navy underline-offset-4 hover:underline"
            >
              {aula.title}
            </Link>
            <Selo estado={aula.estado} />
            {aula.temRascunho ? (
              <span
                className="inline-block rounded-pill px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
                style={{ background: '#FEF7E0', color: '#6B520A' }}
              >
                Rascunho pendente
              </span>
            ) : null}
            {aula.coverUrl === null ? (
              <span className="text-[12px] font-bold text-muted-2">sem capa</span>
            ) : null}
            {aula.temVideo ? null : (
              <span className="text-[12px] font-bold text-muted-2">sem vídeo</span>
            )}
          </p>
          <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-muted">
            {aula.code} · {aula.moduloTitulo ?? `módulo ${aula.moduleId}`} · {aula.estimatedTime}{' '}
            · /aula/{aula.slug}
          </p>
          {aula.subtitle ? (
            <p className="m-0 mt-1 truncate text-[13px] font-semibold leading-snug text-muted-2">
              {aula.subtitle}
            </p>
          ) : null}
        </div>

        <time
          dateTime={aula.atualizadaEm.toISOString()}
          className="flex-none text-[12px] font-semibold text-muted-2"
        >
          {FORMATO_DE_DATA.format(aula.atualizadaEm)}
        </time>
      </div>
    </li>
  );
}

function Degradado() {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        A lista de aulas não pôde ser carregada.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; recarregue a página em alguns
        instantes. O detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}

/** Link de paginação que preserva os filtros atuais. */
function linkDaPagina(busca: Busca, pagina: number): string {
  const parametros = new URLSearchParams();
  const q = primeiro(busca.q);
  const modulo = primeiro(busca.modulo);
  const estado = primeiro(busca.estado);

  if (q) parametros.set('q', q);
  if (modulo) parametros.set('modulo', modulo);
  if (estado) parametros.set('estado', estado);
  if (pagina > 1) parametros.set('pagina', String(pagina));

  const consulta = parametros.toString();
  return consulta === '' ? '/admin/aulas' : `/admin/aulas?${consulta}`;
}

export default async function TelaDeAulas({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const busca = await searchParams;

  const q = primeiro(busca.q);
  const moduloBruto = primeiro(busca.modulo);
  const estadoBruto = primeiro(busca.estado);
  const paginaBruta = Number(primeiro(busca.pagina));

  const moduloId = /^\d+$/.test(moduloBruto) ? Number(moduloBruto) : undefined;
  const estado = ehEstado(estadoBruto) ? estadoBruto : 'todas';
  const pagina = Number.isInteger(paginaBruta) && paginaBruta > 0 ? paginaBruta : 1;

  let lista: ListaDeAulas | null = null;
  let modulos: OpcaoDeModulo[] = [];

  try {
    [lista, modulos] = await Promise.all([
      listarAulas({ busca: q, moduloId, estado, pagina }),
      listarModulosParaSelecao(),
    ]);
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] aulas sem banco: ${motivo}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Conteúdo</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Aulas
        </h1>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          Todas as aulas do curso, publicadas ou não. Clique no título para abrir os dados, e
          publique quando o conteúdo estiver pronto — só aula publicada chega ao aluno.
        </p>
        <p className="m-0 mt-2 text-[14px] font-extrabold leading-snug">
          <Link href="/admin/midia/pendencias" className="text-link">
            Pendências de mídia →
          </Link>{' '}
          <span className="font-semibold text-muted">
            ilustrações, capas e vídeos que faltam em cada aula
          </span>
        </p>
      </header>

      {lista === null ? (
        <Degradado />
      ) : (
        <>
          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <Filtros busca={q} modulo={moduloBruto} estado={estado} modulos={modulos} />
          </section>

          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="m-0 text-[17px] font-black tracking-[-0.01em] text-navy">
                {lista.total} aula(s)
              </h2>
              {lista.paginas > 1 ? (
                <span className="text-[13px] font-semibold text-muted">
                  página {lista.pagina} de {lista.paginas}
                </span>
              ) : null}
            </div>

            {lista.aulas.length === 0 ? (
              <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
                Nenhuma aula bate com esses filtros.
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {lista.aulas.map((aula) => (
                  <Linha key={aula.id} aula={aula} />
                ))}
              </ul>
            )}

            {lista.paginas > 1 ? (
              <nav className="mt-4 flex items-center gap-3" aria-label="Paginação">
                {lista.pagina > 1 ? (
                  <Link
                    href={linkDaPagina(busca, lista.pagina - 1)}
                    className="grid h-11 place-items-center rounded-pill px-4 text-[15px] font-extrabold text-navy hover:bg-[#EAF2FE]"
                  >
                    ← Anterior
                  </Link>
                ) : null}
                {lista.pagina < lista.paginas ? (
                  <Link
                    href={linkDaPagina(busca, lista.pagina + 1)}
                    className="grid h-11 place-items-center rounded-pill px-4 text-[15px] font-extrabold text-navy hover:bg-[#EAF2FE]"
                  >
                    Próxima →
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </section>

          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <h2 className="m-0 mb-4 text-[17px] font-black tracking-[-0.01em] text-navy">
              Nova aula
            </h2>
            <NovaAula modulos={modulos} />
          </section>
        </>
      )}
    </div>
  );
}
