/**
 * `/admin/alunos` — a lista de alunos (BACKOFFICE §2.7).
 *
 * ⚠️ **Busca, filtro e paginação são do servidor.** Os filtros são um
 * `<form method="get">`: viram query string, a página recarrega no servidor e o
 * estado da busca fica no endereço (dá para recarregar, compartilhar e voltar).
 * Filtrar no navegador exigiria mandar a base inteira de alunos para ele — que
 * é exatamente o que esta tela não pode fazer.
 *
 * ⚠️ **`noindex`.** O painel inteiro já é `noindex` pelo layout; esta tela
 * repete por ser a de maior concentração de dado pessoal do produto.
 *
 * ⚠️ **Sem exportação.** Não existe botão de CSV aqui (§2.7): a lista pagina de
 * 50 em 50 e as ações moram no detalhe.
 *
 * Conta anonimizada ("Excluir minha conta" ou "Anonimizar conta") continua na
 * lista — a linha de `User` fica por causa dos pagamentos — com o selo "Conta
 * excluída" no lugar do de verificação. A data vem de `datasDeExclusao()`
 * (uma consulta só, pelos ids da página), porque `listarAlunos()` não traz
 * `deletedAt`; se essa consulta falhar, a lista aparece sem o selo.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ALUNOS_POR_PAGINA,
  JANELA_DE_ATIVIDADE_DIAS,
  listarAlunos,
  type AlunoDaLista,
  type FiltroDeAtividade,
  type FiltroDePlano,
  type FiltroDeVerificacao,
  type ListaDeAlunos,
} from '@/lib/admin/alunos';
import { datasDeExclusao } from '@/lib/conta/consultas';

export const metadata: Metadata = {
  title: 'Alunos',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

type Busca = { [chave: string]: string | string[] | undefined };

/** Primeiro valor de um parâmetro repetido — `?q=a&q=b` vira `a`. */
function primeiro(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? '';
  return valor ?? '';
}

const PLANOS: readonly { valor: FiltroDePlano; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos os planos' },
  { valor: 'ESSENCIAL', rotulo: 'Essencial' },
  { valor: 'COMPLETO', rotulo: 'Completo' },
  { valor: 'PREMIUM', rotulo: 'Premium' },
];

const VERIFICACOES: readonly { valor: FiltroDeVerificacao; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Verificado ou não' },
  { valor: 'verificados', rotulo: 'E-mail verificado' },
  { valor: 'pendentes', rotulo: 'Verificação pendente' },
];

const ATIVIDADES: readonly { valor: FiltroDeAtividade; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Qualquer atividade' },
  { valor: 'ativos', rotulo: `Ativos nos últimos ${JANELA_DE_ATIVIDADE_DIAS} dias` },
  { valor: 'inativos', rotulo: `Parados há mais de ${JANELA_DE_ATIVIDADE_DIAS} dias` },
];

function ehPlano(valor: string): valor is FiltroDePlano {
  return PLANOS.some((opcao) => opcao.valor === valor);
}

function ehVerificacao(valor: string): valor is FiltroDeVerificacao {
  return VERIFICACOES.some((opcao) => opcao.valor === valor);
}

function ehAtividade(valor: string): valor is FiltroDeAtividade {
  return ATIVIDADES.some((opcao) => opcao.valor === valor);
}

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

const FORMATO_CURTO = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

const CAMPO_DE_FILTRO = [
  'h-11 rounded-field border-[1.5px] border-border bg-bg px-3',
  'text-[15px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
].join(' ');

const CORES_DO_PLANO: Record<string, { fundo: string; cor: string }> = {
  ESSENCIAL: { fundo: '#EEF3FA', cor: '#5B6B86' },
  COMPLETO: { fundo: '#EAF2FE', cor: '#123A86' },
  PREMIUM: { fundo: '#FEF7E0', cor: '#6B520A' },
};

function Selo({ texto, fundo, cor }: { texto: string; fundo: string; cor: string }) {
  return (
    <span
      className="inline-block rounded-pill px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
      style={{ background: fundo, color: cor }}
    >
      {texto}
    </span>
  );
}

function Filtros({
  busca,
  plano,
  verificado,
  atividade,
}: {
  busca: string;
  plano: FiltroDePlano;
  verificado: FiltroDeVerificacao;
  atividade: FiltroDeAtividade;
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
          placeholder="nome ou e-mail"
          className={`${CAMPO_DE_FILTRO} w-full`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="filtro-plano"
          className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted"
        >
          Plano
        </label>
        <select id="filtro-plano" name="plano" defaultValue={plano} className={CAMPO_DE_FILTRO}>
          {PLANOS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="filtro-verificado"
          className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted"
        >
          Verificação
        </label>
        <select
          id="filtro-verificado"
          name="verificado"
          defaultValue={verificado}
          className={CAMPO_DE_FILTRO}
        >
          {VERIFICACOES.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="filtro-atividade"
          className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted"
        >
          Atividade
        </label>
        <select
          id="filtro-atividade"
          name="atividade"
          defaultValue={atividade}
          className={CAMPO_DE_FILTRO}
        >
          {ATIVIDADES.map((opcao) => (
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
        href="/admin/alunos"
        className="grid h-11 place-items-center rounded-pill px-4 text-[15px] font-extrabold text-navy transition-colors duration-150 hover:bg-[#EAF2FE]"
      >
        Limpar
      </Link>
    </form>
  );
}

function Linha({ aluno, excluidaEm }: { aluno: AlunoDaLista; excluidaEm: Date | null }) {
  const plano = CORES_DO_PLANO[aluno.plano] ?? CORES_DO_PLANO.ESSENCIAL;

  return (
    <li className="rounded-[18px] border border-solid border-border p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/alunos/${aluno.id}`}
              className="text-[17px] font-black leading-tight text-navy underline-offset-4 hover:underline"
            >
              {aluno.nome}
            </Link>
            <Selo texto={aluno.plano} fundo={plano.fundo} cor={plano.cor} />
            {excluidaEm !== null ? (
              <Selo texto="Conta excluída" fundo="#FEF0F2" cor="#B21F31" />
            ) : aluno.verificado ? (
              <Selo texto="Verificado" fundo="#E4F5EA" cor="#136B45" />
            ) : (
              <Selo texto="Verificação pendente" fundo="#FEF7E0" cor="#6B520A" />
            )}
          </p>
          <p className="m-0 mt-1 truncate text-[13px] font-semibold leading-snug text-muted">
            {aluno.email}
          </p>
          <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-muted-2">
            {aluno.aulasConcluidas} aula(s) concluída(s)
            {aluno.aulaAtual
              ? ` · agora na aula ${aluno.aulaAtual.numero} (${aluno.aulaAtual.titulo})`
              : ' · nenhuma aula em andamento'}
          </p>
        </div>

        <div className="flex-none text-right">
          <p className="m-0 text-[12px] font-semibold text-muted-2">
            {aluno.ultimoAcesso === null ? (
              'sem acesso registrado'
            ) : (
              <>
                último acesso{' '}
                <time dateTime={aluno.ultimoAcesso.toISOString()}>
                  {FORMATO_DE_DATA.format(aluno.ultimoAcesso)}
                </time>
              </>
            )}
          </p>
          <p className="m-0 mt-1 text-[12px] font-semibold text-muted-2">
            criado em{' '}
            <time dateTime={aluno.criadoEm.toISOString()}>
              {FORMATO_CURTO.format(aluno.criadoEm)}
            </time>
          </p>
          {excluidaEm !== null ? (
            <p className="m-0 mt-1 text-[12px] font-bold text-[#B21F31]">
              excluída em{' '}
              <time dateTime={excluidaEm.toISOString()}>{FORMATO_CURTO.format(excluidaEm)}</time>
            </p>
          ) : null}
        </div>
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
        A lista de alunos não pôde ser carregada.
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
  for (const chave of ['q', 'plano', 'verificado', 'atividade']) {
    const valor = primeiro(busca[chave]);
    if (valor) parametros.set(chave, valor);
  }
  if (pagina > 1) parametros.set('pagina', String(pagina));

  const consulta = parametros.toString();
  return consulta === '' ? '/admin/alunos' : `/admin/alunos?${consulta}`;
}

export default async function TelaDeAlunos({ searchParams }: { searchParams: Promise<Busca> }) {
  const busca = await searchParams;

  const q = primeiro(busca.q);
  const planoBruto = primeiro(busca.plano);
  const verificadoBruto = primeiro(busca.verificado);
  const atividadeBruta = primeiro(busca.atividade);
  const paginaBruta = Number(primeiro(busca.pagina));

  const plano = ehPlano(planoBruto) ? planoBruto : 'todos';
  const verificado = ehVerificacao(verificadoBruto) ? verificadoBruto : 'todos';
  const atividade = ehAtividade(atividadeBruta) ? atividadeBruta : 'todos';
  const pagina = Number.isInteger(paginaBruta) && paginaBruta > 0 ? paginaBruta : 1;

  let lista: ListaDeAlunos | null = null;
  let excluidas = new Map<string, Date>();

  try {
    lista = await listarAlunos({ busca: q, plano, verificado, atividade, pagina });
  } catch (erro: unknown) {
    // ⚠️ Log sem dado pessoal: só o motivo técnico.
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] alunos sem banco: ${motivo}`);
  }

  if (lista !== null && lista.alunos.length > 0) {
    try {
      excluidas = await datasDeExclusao(lista.alunos.map((aluno) => aluno.id));
    } catch (erro: unknown) {
      // O selo "Conta excluída" é complemento: sem ele, a lista ainda serve.
      const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
      console.error(`[painel] alunos sem data de exclusão: ${motivo}`);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Pessoas</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Alunos
        </h1>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          Quem está estudando, em que plano e até onde chegou. Clique no nome para abrir a conta,
          o progresso e as respostas — as ações moram lá dentro, com o contexto na frente.
        </p>
      </header>

      {lista === null ? (
        <Degradado />
      ) : (
        <>
          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <Filtros busca={q} plano={plano} verificado={verificado} atividade={atividade} />
          </section>

          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="m-0 text-[17px] font-black tracking-[-0.01em] text-navy">
                {lista.total} aluno(s)
              </h2>
              {lista.paginas > 1 ? (
                <span className="text-[13px] font-semibold text-muted">
                  página {lista.pagina} de {lista.paginas} · {ALUNOS_POR_PAGINA} por página
                </span>
              ) : null}
            </div>

            {lista.alunos.length === 0 ? (
              <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
                Nenhum aluno bate com esses filtros.
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {lista.alunos.map((aluno) => (
                  <Linha key={aluno.id} aluno={aluno} excluidaEm={excluidas.get(aluno.id) ?? null} />
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

          <p className="m-0 max-w-[62ch] text-[13px] font-semibold leading-snug text-muted-2">
            Esta tela não exporta lista de alunos e não é indexada por buscador. Cada abertura de
            detalhe fica registrada na auditoria.
          </p>
        </>
      )}
    </div>
  );
}
