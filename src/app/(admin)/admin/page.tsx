/**
 * `/admin` — Dashboard (BACKOFFICE §2.1).
 *
 * **Só leitura.** É a tela que se abre cem vezes por dia; não é lugar de botão
 * perigoso. Nenhuma Server Action nasce aqui, e nenhuma deve nascer: as
 * mutações moram nas telas das áreas, cada uma com a sua auditoria.
 *
 * ⚠️ Se o banco não responder, a tela mostra o **estado degradado** — um aviso
 * no lugar dos números — em vez de estourar. Um dashboard que vira página de
 * erro esconde justamente a informação de que algo está errado.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import { Prisma, type Plan } from '@prisma/client';

import { AREAS } from '@/components/admin/nav';
import { carregarPendenciasDeMidia } from '@/lib/admin/pendencias';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

/** O curso tem 42 aulas (contrato §1). Serve de referência, não de verdade. */
const AULAS_PREVISTAS = 42;

/** Janela de "aluno ativo": entrou ou usou o app nos últimos 7 dias. */
const JANELA_ATIVOS_MS = 7 * 24 * 60 * 60 * 1000;

/** Quantas linhas da trilha cabem no dashboard sem ele virar a tela de auditoria. */
const LINHAS_DE_ATIVIDADE = 10;

const ROTULO_DO_PLANO: Record<Plan, string> = {
  ESSENCIAL: 'Essencial',
  COMPLETO: 'Completo',
  PREMIUM: 'Premium',
};

type LinhaDeAtividade = {
  id: string;
  createdAt: Date;
  actorEmail: string;
  action: string;
  resource: string;
  outcome: 'ALLOW' | 'DENY';
  reason: string | null;
};

type Panorama = {
  alunos: {
    total: number;
    verificados: number;
    ativos: number;
    porPlano: Record<Plan, number>;
  };
  aulas: {
    total: number;
    publicadas: number;
    comRascunho: number;
    semCapa: number;
    semVideo: number;
  };
  atividade: LinhaDeAtividade[];
  /** Espaços de ilustração sem imagem; `null` se a conta falhar (não derruba o resto). */
  ilustracoesSemImagem: number | null;
};

/**
 * Tudo o que o dashboard mostra, numa ida só ao banco.
 *
 * Devolve `null` quando o banco não responde — o erro vira estado de tela, não
 * exceção. A mensagem do erro vai para o log do servidor sem nenhum dado de
 * pessoa junto.
 */
async function carregarPanorama(): Promise<Panorama | null> {
  const desde = new Date(Date.now() - JANELA_ATIVOS_MS);

  try {
    const [
      total,
      verificados,
      ativos,
      porPlanoBruto,
      aulas,
      publicadas,
      comRascunho,
      semCapa,
      semVideo,
      atividade,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
      prisma.user.count({ where: { role: 'STUDENT', deletedAt: null, emailVerifiedAt: { not: null } } }),
      prisma.user.count({
        where: { role: 'STUDENT', deletedAt: null, sessions: { some: { lastSeenAt: { gte: desde } } } },
      }),
      prisma.user.groupBy({
        by: ['plan'],
        where: { role: 'STUDENT', deletedAt: null },
        _count: { _all: true },
      }),
      prisma.lesson.count({ where: { archivedAt: null } }),
      prisma.lesson.count({ where: { archivedAt: null, published: true } }),
      // Coluna Json anulável: "tem rascunho" é "não é NULL no banco"
      // (`Prisma.DbNull`), e não o JSON `null`, que seria um rascunho vazio.
      prisma.lesson.count({ where: { archivedAt: null, draftPages: { not: Prisma.DbNull } } }),
      prisma.lesson.count({ where: { archivedAt: null, coverUrl: null } }),
      prisma.lesson.count({ where: { archivedAt: null, videoUrl: null, videoRef: null } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: LINHAS_DE_ATIVIDADE,
        select: {
          id: true,
          createdAt: true,
          actorEmail: true,
          action: true,
          resource: true,
          outcome: true,
          reason: true,
        },
      }),
    ]);

    const porPlano: Record<Plan, number> = { ESSENCIAL: 0, COMPLETO: 0, PREMIUM: 0 };
    for (const linha of porPlanoBruto) porPlano[linha.plan] = linha._count._all;

    // Conta separada: lê o JSON das 42 aulas. Se falhar, só o número some.
    let ilustracoesSemImagem: number | null = null;
    try {
      ilustracoesSemImagem = (await carregarPendenciasDeMidia()).totais.ilustracoes;
    } catch (erro: unknown) {
      const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
      console.error(`[painel] dashboard sem pendências de mídia: ${motivo}`);
    }

    return {
      ilustracoesSemImagem,
      alunos: { total, verificados, ativos, porPlano },
      aulas: { total: aulas, publicadas, comRascunho, semCapa, semVideo },
      atividade,
    };
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] dashboard sem banco: ${motivo}`);
    return null;
  }
}

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

// ---------------------------------------------------------------------------
// Peças da tela
// ---------------------------------------------------------------------------

function Secao({
  titulo,
  children,
  acao,
}: {
  titulo: string;
  children: React.ReactNode;
  acao?: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="m-0 text-[17px] font-black tracking-[-0.01em] text-navy">{titulo}</h2>
        {acao ? <div className="ml-auto flex-none">{acao}</div> : null}
      </div>
      {children}
    </section>
  );
}

function Numero({
  valor,
  rotulo,
  detalhe,
  destaque = false,
}: {
  valor: number | string;
  rotulo: string;
  detalhe?: string;
  destaque?: boolean;
}) {
  return (
    <div
      className="rounded-[18px] border border-solid p-4"
      style={
        destaque
          ? { background: '#FEF7E0', borderColor: '#F8E7B4' }
          : { background: '#F1F5FA', borderColor: '#E3EAF3' }
      }
    >
      <p
        className="m-0 text-[28px] font-black leading-none"
        style={{ color: destaque ? '#6B520A' : '#0A1F4E' }}
      >
        {valor}
      </p>
      <p className="m-0 mt-2 text-[13px] font-extrabold leading-tight text-navy">{rotulo}</p>
      {detalhe ? (
        <p className="m-0 mt-1 text-[12px] font-semibold leading-tight text-muted">{detalhe}</p>
      ) : null}
    </div>
  );
}

function Degradado() {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        Os números não puderam ser carregados.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu a esta consulta. O painel continua de pé; recarregue a
        página em alguns instantes. Se persistir, o detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}

function Atividade({ linhas }: { linhas: LinhaDeAtividade[] }) {
  if (linhas.length === 0) {
    return (
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Nada registrado ainda. A partir daqui, toda ação do painel deixa uma linha — inclusive
        as tentativas negadas.
      </p>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {linhas.map((linha) => {
        const negada = linha.outcome === 'DENY';
        return (
          <li
            key={linha.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-field border border-solid border-border px-3 py-2.5"
          >
            <span
              className="flex-none rounded-pill px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
              style={
                negada
                  ? { background: '#FEF0F2', color: '#B21F31' }
                  : { background: '#E4F5EA', color: '#136B45' }
              }
            >
              {negada ? 'Negada' : 'Ok'}
            </span>
            <code className="flex-none text-[13px] font-extrabold text-navy">{linha.action}</code>
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-muted">
              {linha.resource}
              {linha.reason ? ` · ${linha.reason}` : ''}
            </span>
            <span className="flex-none text-[12px] font-semibold text-muted-2">
              {linha.actorEmail}
            </span>
            <time
              dateTime={linha.createdAt.toISOString()}
              className="flex-none text-[12px] font-semibold text-muted-2"
            >
              {FORMATO_DE_DATA.format(linha.createdAt)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}

/** Atalhos para as áreas — as que ainda não existem aparecem apagadas. */
function Areas() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
      {AREAS.filter((area) => area.href !== '/admin').map((area) => {
        const conteudo = (
          <>
            <span className="block text-[15px] font-extrabold leading-tight text-navy">
              {area.rotulo}
            </span>
            <span className="mt-1 block text-[13px] font-semibold leading-snug text-muted">
              {area.descricao}
            </span>
          </>
        );

        return (
          <li key={area.href}>
            {area.pronta ? (
              <Link
                href={area.href}
                className="block h-full rounded-[18px] border border-solid border-border p-4 transition-colors duration-150 hover:border-border-2 hover:bg-[#EAF2FE]"
              >
                {conteudo}
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="block h-full rounded-[18px] border border-dashed border-border p-4 opacity-70"
              >
                {conteudo}
                <span className="mt-2 inline-block rounded-pill bg-[#EEF3FA] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted-2">
                  Em breve
                </span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------------

export default async function DashboardDoPainel() {
  const panorama = await carregarPanorama();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Painel</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          O estado do produto
        </h1>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          Quantos alunos existem e em que pé está o conteúdo. Esta tela não muda nada — as
          alterações moram nas áreas da barra lateral.
        </p>
      </header>

      {panorama === null ? (
        <Degradado />
      ) : (
        <>
          <Secao titulo="Alunos">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <Numero valor={panorama.alunos.total} rotulo="Contas de aluno" />
              <Numero
                valor={panorama.alunos.verificados}
                rotulo="E-mail verificado"
                detalhe={`${panorama.alunos.total - panorama.alunos.verificados} sem verificar`}
              />
              <Numero
                valor={panorama.alunos.ativos}
                rotulo="Ativos em 7 dias"
                detalhe="sessão usada na última semana"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {(Object.keys(ROTULO_DO_PLANO) as Plan[]).map((plano) => (
                <Numero
                  key={plano}
                  valor={panorama.alunos.porPlano[plano]}
                  rotulo={`Plano ${ROTULO_DO_PLANO[plano]}`}
                />
              ))}
            </div>
          </Secao>

          <Secao
            titulo="Conteúdo"
            acao={
              <Link
                href="/admin/midia/pendencias"
                className="text-[13px] font-extrabold text-link no-underline hover:underline"
              >
                Pendências de mídia →
              </Link>
            }
          >
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <Numero
                valor={`${panorama.aulas.publicadas}/${panorama.aulas.total}`}
                rotulo="Aulas publicadas"
                detalhe={
                  panorama.aulas.total === AULAS_PREVISTAS
                    ? `${AULAS_PREVISTAS} aulas no curso`
                    : `⚠ o curso prevê ${AULAS_PREVISTAS} aulas`
                }
              />
              <Numero
                valor={panorama.aulas.comRascunho}
                rotulo="Com rascunho pendente"
                detalhe="salvo, ainda não publicado"
                destaque={panorama.aulas.comRascunho > 0}
              />
              <Numero
                valor={panorama.aulas.total - panorama.aulas.publicadas}
                rotulo="Ainda em rascunho"
                detalhe="invisíveis para o aluno"
              />
              <Numero
                valor={panorama.aulas.semCapa}
                rotulo="Sem capa"
                destaque={panorama.aulas.semCapa > 0}
              />
              <Numero
                valor={panorama.aulas.semVideo}
                rotulo="Sem vídeo"
                destaque={panorama.aulas.semVideo > 0}
              />
              {panorama.ilustracoesSemImagem !== null ? (
                <Numero
                  valor={panorama.ilustracoesSemImagem}
                  rotulo="Ilustrações sem imagem"
                  detalhe="espaços que ainda mostram o placeholder"
                  destaque={panorama.ilustracoesSemImagem > 0}
                />
              ) : null}
            </div>
          </Secao>

          <Secao titulo="Atividade recente">
            <Atividade linhas={panorama.atividade} />
          </Secao>
        </>
      )}

      <Secao titulo="Áreas do painel">
        <Areas />
      </Secao>
    </div>
  );
}
