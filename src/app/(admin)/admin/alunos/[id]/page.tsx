/**
 * `/admin/alunos/[id]` — um aluno, em três abas (BACKOFFICE §2.7).
 *
 * ⚠️ **A abertura do detalhe é auditada.** É a tela com mais dado pessoal do
 * produto; saber *quem* abriu a ficha de *quem* é parte do controle, não
 * paranoia. A linha sai a cada carregamento, com a aba junto.
 *
 * ⚠️ **Nada de segredo na tela.** Nem `passwordHash`, nem `tokenHash` de
 * sessão, nem token de verificação — nem mascarado. A aba "conta" mostra
 * *quantas* sessões existem e de onde; a aba "respostas" mostra *quanto* o
 * aluno acertou, nunca o que ele escreveu.
 *
 * ⚠️ **Excluir aluno é anonimizar** (§7): a ação "Anonimizar conta" usa o
 * núcleo de `src/lib/conta/anonimizar.ts`. Conta anonimizada continua abrindo
 * aqui (a linha de `User` fica, por causa dos pagamentos), com o selo "Conta
 * excluída" e sem ações. A data vem de `dataDeExclusao()`, porque
 * `carregarContaDoAluno()` não traz `deletedAt`.
 *
 * ⚠️ Next 16: `params` e `searchParams` chegam como Promise e precisam de
 * `await`.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  carregarAprendizagemDoAluno,
  carregarContaDoAluno,
  carregarRespostasDoAluno,
  DIAS_DE_ESTUDO_NA_TELA,
  type AprendizagemDoAluno,
  type ContaDoAluno,
  type RespostasDoAluno,
} from '@/lib/admin/alunos';
import { auditar } from '@/lib/admin/audit';
import { requireAdmin } from '@/lib/admin/guard';
import { dataDeExclusao } from '@/lib/conta/consultas';

import { AcoesDoAluno } from './AcoesDoAluno';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aluno',
  robots: { index: false, follow: false },
};

type Parametros = { id: string };
type Busca = { [chave: string]: string | string[] | undefined };

const ABAS = [
  { id: 'conta', rotulo: 'Conta' },
  { id: 'progresso', rotulo: 'Progresso' },
  { id: 'respostas', rotulo: 'Respostas' },
] as const;

type IdDeAba = (typeof ABAS)[number]['id'];

function ehAba(valor: string): valor is IdDeAba {
  return ABAS.some((aba) => aba.id === valor);
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

const CORES_DO_PLANO: Record<string, { fundo: string; cor: string }> = {
  ESSENCIAL: { fundo: '#EEF3FA', cor: '#5B6B86' },
  COMPLETO: { fundo: '#EAF2FE', cor: '#123A86' },
  PREMIUM: { fundo: '#FEF7E0', cor: '#6B520A' },
};

const CORES_DO_STATUS: Record<string, { fundo: string; cor: string; rotulo: string }> = {
  COMPLETED: { fundo: '#E4F5EA', cor: '#136B45', rotulo: 'Concluída' },
  IN_PROGRESS: { fundo: '#FEF7E0', cor: '#6B520A', rotulo: 'Em andamento' },
  NOT_STARTED: { fundo: '#EEF3FA', cor: '#5B6B86', rotulo: 'Não iniciada' },
};

function Selo({ texto, fundo, cor }: { texto: string; fundo: string; cor: string }) {
  return (
    <span
      className="inline-block rounded-pill px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]"
      style={{ background: fundo, color: cor }}
    >
      {texto}
    </span>
  );
}

/** Um número grande com rótulo — o resumo do topo das abas. */
function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="rounded-[18px] border border-solid border-border p-4">
      <p className="m-0 text-[22px] font-black leading-none text-navy">{valor}</p>
      <p className="m-0 mt-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted-2">
        {rotulo}
      </p>
    </div>
  );
}

/** Linha "rótulo / valor" das fichas. */
function Dado({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 border-b border-solid border-border py-2 last:border-b-0">
      <span className="min-w-[160px] text-[12px] font-extrabold uppercase tracking-[0.08em] text-muted-2">
        {rotulo}
      </span>
      <span className="text-[15px] font-bold text-navy">{children}</span>
    </div>
  );
}

// ─────────────────────────────── aba: conta ──────────────────────────────

function AbaDeConta({ conta, excluidaEm }: { conta: ContaDoAluno; excluidaEm: Date | null }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Numero valor={String(conta.aulasConcluidas)} rotulo="aulas concluídas" />
        <Numero valor={String(conta.aulasEmAndamento)} rotulo="em andamento" />
        <Numero valor={String(conta.respostasGravadas)} rotulo="respostas" />
        <Numero valor={String(conta.diasDeEstudo)} rotulo="dias de estudo" />
      </div>

      <div>
        <h3 className="m-0 mb-2 text-[15px] font-black tracking-[-0.01em] text-navy">Ficha</h3>
        <Dado rotulo="E-mail">{conta.email}</Dado>
        <Dado rotulo="Plano">{conta.plano}</Dado>
        <Dado rotulo="Verificação">
          {conta.verificadoEm === null
            ? 'pendente'
            : `verificado em ${FORMATO_DE_DATA.format(conta.verificadoEm)}`}
        </Dado>
        <Dado rotulo="Criado em">{FORMATO_DE_DATA.format(conta.criadoEm)}</Dado>
        <Dado rotulo="Atualizado em">{FORMATO_DE_DATA.format(conta.atualizadoEm)}</Dado>
        <Dado rotulo="Foto de perfil">{conta.temFoto ? 'tem' : 'não tem'}</Dado>
        <Dado rotulo="Identificador">{conta.id}</Dado>
      </div>

      <div>
        <h3 className="m-0 mb-2 text-[15px] font-black tracking-[-0.01em] text-navy">
          Sessões abertas ({conta.sessoes.length})
        </h3>
        {conta.sessoes.length === 0 ? (
          <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
            Nenhuma sessão aberta no momento.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {conta.sessoes.map((sessao) => (
              <li
                key={sessao.id}
                className="rounded-[14px] border border-solid border-border px-3 py-2"
              >
                <p className="m-0 text-[14px] font-bold leading-snug text-navy">
                  {sessao.userAgent ?? 'aparelho não identificado'}
                </p>
                <p className="m-0 mt-0.5 text-[12px] font-semibold leading-snug text-muted-2">
                  {sessao.ip ?? 'sem IP'} · último uso {FORMATO_DE_DATA.format(sessao.ultimoUso)} ·
                  expira {FORMATO_CURTO.format(sessao.expiraEm)}
                  {sessao.lembrar ? ' · "continuar conectado"' : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="m-0 mt-2 text-[12px] font-semibold leading-snug text-muted-2">
          O painel mostra de onde a sessão veio, nunca o que a abre: o token fica só no navegador
          do aluno e, em forma de hash, no banco.
        </p>
      </div>

      <AcoesDoAluno
        id={conta.id}
        plano={conta.plano}
        verificado={conta.verificadoEm !== null}
        sessoes={conta.sessoes.length}
        reenvio={{
          permitido: conta.reenvio.permitido,
          enviados: conta.reenvio.enviados,
          limite: conta.reenvio.limite,
          liberaEm: conta.reenvio.liberaEm === null ? null : conta.reenvio.liberaEm.toISOString(),
        }}
        administrador={conta.admin}
        excluidaEm={excluidaEm === null ? null : excluidaEm.toISOString()}
      />
    </div>
  );
}

// ───────────────────────────── aba: progresso ────────────────────────────

function AbaDeProgresso({ aprendizagem }: { aprendizagem: AprendizagemDoAluno }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Numero valor={String(aprendizagem.concluidas)} rotulo="concluídas" />
        <Numero valor={String(aprendizagem.emAndamento)} rotulo="em andamento" />
        <Numero valor={String(aprendizagem.naoIniciadas)} rotulo="não iniciadas" />
        <Numero
          valor={String(aprendizagem.diasDeEstudo.length)}
          rotulo={`dias em ${DIAS_DE_ESTUDO_NA_TELA}`}
        />
      </div>

      <div>
        <h3 className="m-0 mb-2 text-[15px] font-black tracking-[-0.01em] text-navy">
          Aula a aula
        </h3>
        {aprendizagem.aulas.length === 0 ? (
          <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
            Não há aulas cadastradas ainda.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {aprendizagem.aulas.map((aula) => {
              const cores = CORES_DO_STATUS[aula.status] ?? CORES_DO_STATUS.NOT_STARTED;
              return (
                <li
                  key={aula.lessonId}
                  className="flex flex-wrap items-center gap-3 rounded-[14px] border border-solid border-border px-3 py-2"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 flex-none place-items-center rounded-field bg-[#F1F5FA] text-[14px] font-black text-navy"
                  >
                    {aula.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-navy">
                      {aula.titulo}
                    </span>
                    <span className="block text-[12px] font-semibold text-muted-2">
                      página {aula.paginaAtual + 1}
                      {aula.score !== null && aula.total !== null
                        ? ` · placar guardado ${aula.score}/${aula.total}`
                        : ' · sem placar guardado'}
                      {aula.concluidaEm
                        ? ` · concluída em ${FORMATO_CURTO.format(aula.concluidaEm)}`
                        : ''}
                      {aula.arquivada ? ' · aula arquivada' : ''}
                      {!aula.publicada && !aula.arquivada ? ' · aula não publicada' : ''}
                    </span>
                  </span>
                  <Selo texto={cores.rotulo} fundo={cores.fundo} cor={cores.cor} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h3 className="m-0 mb-2 text-[15px] font-black tracking-[-0.01em] text-navy">
          Dias de estudo (últimos {DIAS_DE_ESTUDO_NA_TELA})
        </h3>
        {aprendizagem.diasDeEstudo.length === 0 ? (
          <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
            Nenhum dia de estudo registrado nesse intervalo.
          </p>
        ) : (
          <p className="m-0 flex flex-wrap gap-1.5">
            {aprendizagem.diasDeEstudo.map((dia) => (
              <span
                key={dia.toISOString()}
                className="rounded-pill bg-[#E4F5EA] px-2 py-0.5 text-[12px] font-bold"
                style={{ color: '#136B45' }}
              >
                {FORMATO_CURTO.format(dia)}
              </span>
            ))}
          </p>
        )}
      </div>

      <p className="m-0 rounded-field bg-[#EEF3FA] px-3 py-2 text-[13px] font-semibold leading-snug text-muted">
        Não existe edição livre de progresso. O que o painel faz é recalcular o placar a partir
        das respostas gravadas — o botão está na aba Conta.
      </p>
    </div>
  );
}

// ───────────────────────────── aba: respostas ────────────────────────────

function AbaDeRespostas({ respostas }: { respostas: RespostasDoAluno }) {
  const divergentes = respostas.aulas.filter((aula) => aula.divergente).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Numero valor={String(respostas.totalDeRespostas)} rotulo="respostas gravadas" />
        <Numero valor={String(respostas.aulas.length)} rotulo="aulas com resposta" />
        <Numero valor={String(divergentes)} rotulo="placares divergentes" />
      </div>

      {respostas.aulas.length === 0 ? (
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          Este aluno ainda não respondeu nenhum exercício.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {respostas.aulas.map((aula) => (
            <li
              key={aula.numero}
              className="flex flex-wrap items-center gap-3 rounded-[14px] border border-solid border-border px-3 py-2"
            >
              <span
                aria-hidden="true"
                className="grid h-9 w-9 flex-none place-items-center rounded-field bg-[#F1F5FA] text-[14px] font-black text-navy"
              >
                {aula.numero}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-navy">
                  {aula.titulo}
                </span>
                <span className="block text-[12px] font-semibold text-muted-2">
                  {aula.gravadas} resposta(s), {aula.conferidas} conferida(s)
                  {aula.atualizadaEm
                    ? ` · última em ${FORMATO_CURTO.format(aula.atualizadaEm)}`
                    : ''}
                  {aula.observacao ? ` · ${aula.observacao}` : ''}
                </span>
              </span>
              <span className="flex-none text-right">
                <span className="block text-[15px] font-black text-navy">
                  {aula.recontado ? `${aula.recontado.acertos}/${aula.recontado.total}` : '—'}
                </span>
                <span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-2">
                  recontado
                </span>
              </span>
              {aula.divergente ? (
                <Selo
                  texto={`guardado ${aula.guardado?.score ?? '—'}/${aula.guardado?.total ?? '—'}`}
                  fundo="#FEF7E0"
                  cor="#6B520A"
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <p className="m-0 rounded-field bg-[#EEF3FA] px-3 py-2 text-[13px] font-semibold leading-snug text-muted">
        O painel mostra quanto o aluno acertou, não o que ele escreveu: produção livre é dele. O
        placar guardado é cache — a verdade é a recontagem, feita agora com o conteúdo publicado.
      </p>
    </div>
  );
}

function Degradado({ id }: { id: string }) {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        Este aluno não pôde ser carregado.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; volte para a lista e tente de novo em
        alguns instantes. Identificador: {id}.
      </p>
    </div>
  );
}

export default async function TelaDoAluno({
  params,
  searchParams,
}: {
  params: Promise<Parametros>;
  searchParams: Promise<Busca>;
}) {
  const [{ id }, busca] = await Promise.all([params, searchParams]);

  const abaPedida = Array.isArray(busca.aba) ? busca.aba[0] : busca.aba;
  const aba: IdDeAba = abaPedida && ehAba(abaPedida) ? abaPedida : 'conta';

  let conta: ContaDoAluno | null = null;
  let excluidaEm: Date | null = null;
  let aprendizagem: AprendizagemDoAluno | null = null;
  let respostas: RespostasDoAluno | null = null;
  let semBanco = false;

  try {
    conta = await carregarContaDoAluno(id);
    if (conta !== null) excluidaEm = await dataDeExclusao(conta.id);

    // Só a aba aberta paga a consulta dela.
    if (conta !== null && aba === 'progresso') aprendizagem = await carregarAprendizagemDoAluno(id);
    if (conta !== null && aba === 'respostas') respostas = await carregarRespostasDoAluno(id);
  } catch (erro: unknown) {
    semBanco = true;
    // ⚠️ Log sem dado pessoal: id e motivo técnico, nada de nome ou e-mail.
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] aluno ${id} sem banco: ${motivo}`);
  }

  // Banco respondeu e o aluno não existe: 404 de verdade.
  if (!semBanco && conta === null) notFound();

  if (conta === null) {
    return (
      <div className="flex flex-col gap-5">
        <Link href="/admin/alunos" className="text-[14px] font-extrabold text-navy hover:underline">
          ← Todos os alunos
        </Link>
        <Degradado id={id} />
      </div>
    );
  }

  // ⚠️ §2.7: abertura de detalhe individual é auditada. `auditar()` nunca
  // lança, então isto não pode derrubar a tela.
  try {
    const admin = await requireAdmin();
    await auditar({
      actor: admin,
      action: 'user.detail.view',
      resource: `User:${conta.id}`,
      after: { aba },
    });
  } catch {
    // O layout do painel já garantiu que quem chegou aqui é admin; se a sessão
    // venceu entre o layout e a página, a próxima navegação resolve.
  }

  const plano = CORES_DO_PLANO[conta.plano] ?? CORES_DO_PLANO.ESSENCIAL;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Link href="/admin/alunos" className="text-[14px] font-extrabold text-navy hover:underline">
          ← Todos os alunos
        </Link>
        <p className="kicker m-0 mt-3">Aluno</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="m-0 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
            {conta.nome}
          </h1>
          <Selo texto={conta.plano} fundo={plano.fundo} cor={plano.cor} />
          {conta.verificadoEm === null ? (
            <Selo texto="Verificação pendente" fundo="#FEF7E0" cor="#6B520A" />
          ) : (
            <Selo texto="Verificado" fundo="#E4F5EA" cor="#136B45" />
          )}
          {conta.admin ? <Selo texto="Administrador" fundo="#EAF2FE" cor="#123A86" /> : null}
          {excluidaEm !== null ? (
            <Selo texto="Conta excluída" fundo="#FEF0F2" cor="#B21F31" />
          ) : null}
        </div>
        <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-muted">
          {conta.email} · criado em {FORMATO_CURTO.format(conta.criadoEm)} ·{' '}
          {conta.ultimoAcesso === null
            ? 'sem acesso registrado'
            : `último acesso ${FORMATO_DE_DATA.format(conta.ultimoAcesso)}`}
        </p>
      </header>

      <nav
        aria-label="Seções do aluno"
        className="flex flex-wrap gap-2 border-b border-solid border-border pb-3"
      >
        {ABAS.map((item) => {
          const ativa = item.id === aba;
          return (
            <Link
              key={item.id}
              href={`/admin/alunos/${conta.id}?aba=${item.id}`}
              aria-current={ativa ? 'page' : undefined}
              className="grid h-11 place-items-center rounded-pill px-4 text-[15px] font-extrabold transition-colors duration-150"
              style={
                ativa
                  ? { background: '#0A1F4E', color: '#FFFFFF' }
                  : { background: 'transparent', color: '#0A1F4E' }
              }
            >
              {item.rotulo}
            </Link>
          );
        })}
      </nav>

      <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
        {aba === 'conta' ? <AbaDeConta conta={conta} excluidaEm={excluidaEm} /> : null}
        {aba === 'progresso' && aprendizagem !== null ? (
          <AbaDeProgresso aprendizagem={aprendizagem} />
        ) : null}
        {aba === 'respostas' && respostas !== null ? (
          <AbaDeRespostas respostas={respostas} />
        ) : null}
      </section>

      <p className="m-0 max-w-[62ch] text-[13px] font-semibold leading-snug text-muted-2">
        {excluidaEm !== null
          ? `Conta excluída em ${FORMATO_DE_DATA.format(excluidaEm)}. A ficha continua aqui porque os pagamentos apontam para ela; o que identificava a pessoa e o progresso já saíram.`
          : 'Excluir aluno é anonimizar: a linha da conta fica (os pagamentos apontam para ela), mas nome, e-mail, senha, sessões e progresso saem, e o e-mail fica livre para um cadastro novo. É a mesma coisa que o aluno faz sozinho em "Excluir minha conta", no perfil.'}
      </p>
    </div>
  );
}
