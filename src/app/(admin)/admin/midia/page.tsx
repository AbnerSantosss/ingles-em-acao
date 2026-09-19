/**
 * `/admin/midia` — a biblioteca de mídia (BACKOFFICE §2.8 e §4).
 *
 * A leitura acontece aqui, em Server Component; a interação (enviar, editar
 * `alt`, arquivar) mora em `BibliotecaDeMidia` ao lado. Se o banco não
 * responder, a tela mostra o **estado degradado** em vez de estourar — mesmo
 * critério do resto do painel: uma tela de erro genérica esconde justamente a
 * informação de que algo está errado.
 *
 * Os filtros viajam na URL (`?alt=faltando&uso=sem`), não em estado de cliente:
 * assim a lista "as 30 imagens sem texto alternativo" é um link que se manda
 * para outra pessoa, e o formulário funciona sem JavaScript.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import { diagnosticoDeMidia } from '@/lib/media/armazenamento';
import {
  FILTROS_PADRAO,
  listarBiblioteca,
  type BibliotecaDeMidia,
  type FiltrosDaBiblioteca,
} from '@/lib/media/consultas';
import {
  FORMATOS_EM_TEXTO,
  TAMANHO_MAXIMO_IMAGEM,
  formatarBytes,
} from '@/lib/media/tipos';

import { BibliotecaDeMidiaPainel } from './BibliotecaDeMidia';

export const metadata: Metadata = { title: 'Mídia' };
export const dynamic = 'force-dynamic';

type Busca = Record<string, string | string[] | undefined>;

/** Primeiro valor de um parâmetro repetido (`?tipo=a&tipo=b`). */
function um(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? '';
  return valor ?? '';
}

/**
 * Lê os filtros da URL. Qualquer valor desconhecido vira o padrão — a URL é
 * texto de fora, e um filtro estranho não pode virar erro de tela.
 */
function lerFiltros(busca: Busca): FiltrosDaBiblioteca {
  const tipo = um(busca.tipo);
  const alt = um(busca.alt);
  const uso = um(busca.uso);
  const arquivo = um(busca.arquivo);

  return {
    tipo: tipo === 'IMAGE' || tipo === 'VIDEO' ? tipo : FILTROS_PADRAO.tipo,
    alt: alt === 'faltando' ? 'faltando' : FILTROS_PADRAO.alt,
    uso: uso === 'sem' || uso === 'com' ? uso : FILTROS_PADRAO.uso,
    arquivo: arquivo === 'arquivados' ? 'arquivados' : FILTROS_PADRAO.arquivo,
    q: um(busca.q).slice(0, 80),
  };
}

async function carregar(filtros: FiltrosDaBiblioteca): Promise<BibliotecaDeMidia | null> {
  try {
    return await listarBiblioteca(filtros);
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] mídia sem banco: ${motivo}`);
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
        A biblioteca não pôde ser carregada.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; recarregue a página em alguns
        instantes. O detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}

/** Um número do resumo, que também é um link para o filtro correspondente. */
function Contador({
  rotulo,
  valor,
  href,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  href?: string;
  destaque?: boolean;
}) {
  const conteudo = (
    <>
      <span className="block text-[22px] font-black leading-none tracking-[-0.02em] text-navy">
        {valor}
      </span>
      <span className="mt-1 block text-[13px] font-bold leading-snug text-muted">{rotulo}</span>
    </>
  );

  const base = `rounded-field border-[1.5px] px-4 py-3 ${
    destaque ? 'border-[#F6D9A8] bg-[#FFF7E8]' : 'border-border bg-bg'
  }`;

  if (!href) return <div className={base}>{conteudo}</div>;

  return (
    <a
      href={href}
      className={`${base} block no-underline transition-colors hover:border-blue hover:bg-[#EAF2FE]`}
    >
      {conteudo}
    </a>
  );
}

const CLASSE_DO_SELECT = [
  'h-11 rounded-field border-[1.5px] border-border bg-bg px-3',
  'text-[15px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
].join(' ');

const CLASSE_DO_ROTULO = 'text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted';

/**
 * Os filtros da §2.8 — tipo, "sem alt", "sem uso" — como formulário `GET`.
 * Sem `'use client'`: o navegador monta a URL sozinho ao enviar.
 */
function Filtros({ filtros }: { filtros: FiltrosDaBiblioteca }) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-[220px] flex-1 flex-col gap-2">
        <label htmlFor="filtro-q" className={CLASSE_DO_ROTULO}>
          Buscar
        </label>
        <input
          id="filtro-q"
          name="q"
          type="search"
          defaultValue={filtros.q}
          maxLength={80}
          placeholder="Nome do arquivo ou texto alternativo"
          className="h-11 w-full rounded-field border-[1.5px] border-border bg-bg px-3 text-[15px] font-bold text-navy placeholder:font-medium placeholder:text-muted-2 focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filtro-tipo" className={CLASSE_DO_ROTULO}>
          Tipo
        </label>
        <select
          id="filtro-tipo"
          name="tipo"
          defaultValue={filtros.tipo}
          className={CLASSE_DO_SELECT}
        >
          <option value="todos">Todos</option>
          <option value="IMAGE">Imagem</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filtro-alt" className={CLASSE_DO_ROTULO}>
          Texto alternativo
        </label>
        <select id="filtro-alt" name="alt" defaultValue={filtros.alt} className={CLASSE_DO_SELECT}>
          <option value="todos">Tanto faz</option>
          <option value="faltando">Sem alt</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filtro-uso" className={CLASSE_DO_ROTULO}>
          Uso
        </label>
        <select id="filtro-uso" name="uso" defaultValue={filtros.uso} className={CLASSE_DO_SELECT}>
          <option value="todos">Tanto faz</option>
          <option value="sem">Sem uso</option>
          <option value="com">Em uso</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="filtro-arquivo" className={CLASSE_DO_ROTULO}>
          Situação
        </label>
        <select
          id="filtro-arquivo"
          name="arquivo"
          defaultValue={filtros.arquivo}
          className={CLASSE_DO_SELECT}
        >
          <option value="ativos">Ativas</option>
          <option value="arquivados">Arquivadas</option>
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-pill border-0 bg-navy px-5 text-[15px] font-extrabold tracking-[0.03em] text-white transition-colors hover:bg-navy-light"
      >
        Filtrar
      </button>

      <a
        href="/admin/midia"
        className="inline-flex h-11 items-center justify-center rounded-pill px-4 text-[15px] font-extrabold tracking-[0.03em] text-navy no-underline transition-colors hover:bg-[#EAF2FE]"
      >
        Limpar
      </a>
    </form>
  );
}

export default async function TelaDeMidia({
  searchParams,
}: {
  // ⚠️ Next 16: `searchParams` chega como Promise.
  searchParams: Promise<Busca>;
}) {
  const filtros = lerFiltros(await searchParams);
  const [biblioteca, armazenamento] = await Promise.all([carregar(filtros), diagnosticoDeMidia()]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Conteúdo</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Mídia
        </h1>
        <p className="m-0 mt-1.5 max-w-[68ch] text-[14px] font-semibold leading-snug text-muted">
          As imagens do curso, onde cada uma aparece e o texto alternativo de cada uma. Uma
          imagem em uso não pode ser arquivada: a tela mostra em que aula ela está antes de
          deixar você tentar. Limite de {formatarBytes(TAMANHO_MAXIMO_IMAGEM)} por arquivo,{' '}
          {FORMATOS_EM_TEXTO}.
        </p>
        <p className="m-0 mt-2 text-[14px] font-extrabold leading-snug">
          <Link href="/admin/midia/pendencias" className="text-link">
            Ver pendências de mídia por aula →
          </Link>{' '}
          <span className="font-semibold text-muted">
            (ilustrações sem imagem, capa e vídeo que faltam)
          </span>
        </p>
      </header>

      {!armazenamento.ok ? (
        <div
          className="rounded-card border border-solid p-5"
          style={{ background: '#FFF7E8', borderColor: '#F6D9A8' }}
        >
          <p className="m-0 text-[15px] font-extrabold leading-snug text-navy">
            O armazenamento de mídia não está pronto.
          </p>
          <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-navy">
            {armazenamento.problema} Enquanto isso, o envio de novas imagens vai falhar. O que
            já está na biblioteca continua sendo servido normalmente.
          </p>
        </div>
      ) : null}

      {biblioteca === null ? (
        <Degradado />
      ) : (
        <>
          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Contador rotulo="Imagens ativas" valor={String(biblioteca.resumo.total)} />
              <Contador
                rotulo="Sem texto alternativo"
                valor={String(biblioteca.resumo.semAlt)}
                href="/admin/midia?alt=faltando"
                destaque={biblioteca.resumo.semAlt > 0}
              />
              <Contador
                rotulo="Sem uso no conteúdo"
                valor={String(biblioteca.resumo.semUso)}
                href="/admin/midia?uso=sem"
              />
              <Contador
                rotulo="Arquivadas"
                valor={String(biblioteca.resumo.arquivados)}
                href="/admin/midia?arquivo=arquivados"
              />
              <Contador rotulo="Espaço em disco" valor={formatarBytes(biblioteca.resumo.bytes)} />
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <Filtros filtros={filtros} />
            </div>
          </section>

          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <BibliotecaDeMidiaPainel
              itens={biblioteca.itens}
              truncada={biblioteca.truncada}
              arquivadas={filtros.arquivo === 'arquivados'}
              podeEnviar={armazenamento.ok}
            />
          </section>
        </>
      )}
    </div>
  );
}
