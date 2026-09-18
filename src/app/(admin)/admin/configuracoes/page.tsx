/**
 * `/admin/configuracoes` — BACKOFFICE §2.9.
 *
 * O que a §2.9 lista, e quem grava cada coisa:
 *
 * | Item                  | Nesta tela                                              |
 * |-----------------------|---------------------------------------------------------|
 * | Link de checkout      | **grava** (motivo obrigatório + alerta por e-mail)      |
 * | Aviso de manutenção   | **grava**                                               |
 * | Vídeo padrão          | mostra; quem grava é `/admin/videos` (dono da chave)    |
 * | Allowlist de embed    | mostra; fixa no MVP porque vira o `frame-src` do CSP    |
 * | Estado do e-mail      | mostra `configurado` e remetente — **nunca** a senha    |
 *
 * O porquê das duas linhas "mostra" está no cabeçalho de `@/lib/admin/settings`.
 *
 * ⚠️ **Sem banco, a tela não cai.** As seções que dependem do banco viram um
 * aviso; o estado do e-mail (que vem do ambiente) continua aparecendo.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import {
  CHAVE_CHECKOUT,
  CHAVE_MANUTENCAO,
  CHAVE_VIDEO,
  carregarConfiguracoes,
  estadoDoEmail,
  type Configuracoes,
  type EstadoDoEmail,
} from '@/lib/admin/settings';

import { FormularioDeCheckout, FormularioDeManutencao } from './PainelDeConfiguracoes';

export const metadata: Metadata = {
  title: 'Configurações',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

const FORMATO_DE_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

// ───────────────────────────── peças pequenas ────────────────────────────

type Tom = 'ok' | 'alerta' | 'erro' | 'neutro';

const CORES: Record<Tom, { background: string; color: string }> = {
  ok: { background: '#E4F5EA', color: '#136B45' },
  alerta: { background: '#FEF7E0', color: '#6B520A' },
  erro: { background: '#FEF0F2', color: '#B21F31' },
  neutro: { background: '#EEF3FA', color: '#5B6B86' },
};

function Selo({ tom, children }: { tom: Tom; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-pill px-2.5 py-0.5 text-[12px] font-extrabold"
      style={CORES[tom]}
    >
      {children}
    </span>
  );
}

function Secao({
  titulo,
  descricao,
  selo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  descricao: React.ReactNode;
  selo?: React.ReactNode;
  atualizadoEm?: Date | null;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="m-0 text-[17px] font-black tracking-[-0.01em] text-navy">{titulo}</h2>
        {selo}
      </div>
      <p className="m-0 mb-4 mt-1.5 max-w-[70ch] text-[14px] font-semibold leading-snug text-muted">
        {descricao}
      </p>
      {children}
      {atualizadoEm ? (
        <p className="m-0 mt-4 text-[12px] font-semibold text-muted-2">
          Última alteração: {FORMATO_DE_DATA.format(atualizadoEm)} · o histórico completo está na
          auditoria.
        </p>
      ) : null}
    </section>
  );
}

function Degradado() {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        As configurações não puderam ser carregadas.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; recarregue a página em alguns instantes.
        O detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}

function Avisos({ avisos }: { avisos: readonly string[] }) {
  if (avisos.length === 0) return null;
  return (
    <div
      role="status"
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF7E0', borderColor: '#F3E2A9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#6B520A' }}>
        Há valores guardados fora do formato esperado.
      </p>
      <ul className="m-0 mt-1.5 pl-5 text-[14px] font-semibold leading-snug" style={{ color: '#6B520A' }}>
        {avisos.map((aviso) => (
          <li key={aviso}>{aviso}</li>
        ))}
      </ul>
      <p className="m-0 mt-1.5 text-[13px] font-semibold leading-snug" style={{ color: '#6B520A' }}>
        A tela está usando o padrão no lugar deles. Salvar de novo a seção corrige o valor.
      </p>
    </div>
  );
}

// ──────────────────────────── seções só leitura ──────────────────────────

function SecaoDeVideo({ config }: { config: Configuracoes }) {
  const { video } = config;
  return (
    <Secao
      titulo="Vídeo padrão"
      selo={video.configurado ? <Selo tom="ok">configurado</Selo> : <Selo tom="neutro">sem vídeo padrão</Selo>}
      descricao="O vídeo que as aulas sem configuração própria recebem. Ele é gravado na tela de Vídeos, que valida o endereço e sabe aplicá-lo às aulas — aqui ele só aparece."
      atualizadoEm={config.atualizadoEm[CHAVE_VIDEO]}
    >
      {video.configurado ? (
        <p className="m-0 text-[15px] font-bold leading-snug text-navy">
          {video.descricao}
          {video.link ? (
            <>
              {' · '}
              <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#123A86] underline underline-offset-2"
              >
                conferir em outra aba
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      <p className="m-0 mt-3">
        <Link
          href="/admin/videos"
          className="text-[14px] font-extrabold text-[#123A86] underline underline-offset-2"
        >
          Editar o vídeo padrão em Vídeos
        </Link>
      </p>
    </Secao>
  );
}

function SecaoDeAllowlist({ config }: { config: Configuracoes }) {
  const { allowlist } = config;
  return (
    <Secao
      titulo="Allowlist de embed"
      selo={<Selo tom="neutro">fixa nesta versão</Selo>}
      descricao="Os únicos sites de onde um vídeo pode ser embutido na aula. A lista vira também o cabeçalho de segurança (CSP) que o navegador obedece, e esse cabeçalho só muda com uma nova publicação do app. Por isso ela não é editável aqui: um domínio acrescentado nesta tela seria aceito pelo painel e bloqueado pelo navegador do aluno. Para incluir um site, peça a mudança à equipe técnica."
    >
      <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">
        Endereços aceitos ao colar um vídeo
      </p>
      <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
        {allowlist.hosts.map((host) => (
          <li key={host}>
            <Selo tom="neutro">{host}</Selo>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-4 text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">
        Origens liberadas para o player
      </p>
      <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
        {allowlist.origens.map((origem) => (
          <li key={origem}>
            <Selo tom="neutro">{origem}</Selo>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-3 text-[13px] font-semibold leading-snug text-muted">
        Arquivos .mp4/.webm servidos por https também são aceitos: eles tocam num player de vídeo
        comum, não dentro de um iframe.
      </p>
    </Secao>
  );
}

function SecaoDeEmail({ email }: { email: EstadoDoEmail | null }) {
  return (
    <Secao
      titulo="E-mail"
      selo={
        email === null ? (
          <Selo tom="erro">estado desconhecido</Selo>
        ) : email.configurado ? (
          <Selo tom="ok">configurado</Selo>
        ) : (
          <Selo tom="alerta">não configurado</Selo>
        )
      }
      descricao="Verificação de conta, recuperação de senha e os alertas do painel saem por aqui. As credenciais do servidor de e-mail ficam no ambiente de hospedagem e não aparecem nesta tela."
    >
      {email === null ? (
        <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
          Não foi possível ler o estado do e-mail. O detalhe técnico está no log do servidor.
        </p>
      ) : (
        <dl className="m-0 grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-[max-content_1fr]">
          <dt className="font-extrabold text-muted">Remetente</dt>
          <dd className="m-0 break-all font-bold text-navy">{email.remetente}</dd>
          <dt className="font-extrabold text-muted">Envio</dt>
          <dd className="m-0 font-bold text-navy">
            {email.configurado
              ? 'Servidor de e-mail configurado.'
              : 'Simulado: as mensagens vão para o log do servidor e não chegam a ninguém — nem os alertas do painel.'}
          </dd>
        </dl>
      )}
    </Secao>
  );
}

// ───────────────────────────────── a tela ────────────────────────────────

export default async function TelaDeConfiguracoes() {
  let config: Configuracoes | null = null;
  let email: EstadoDoEmail | null = null;

  try {
    config = await carregarConfiguracoes();
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] configurações sem banco: ${motivo}`);
  }

  try {
    email = await estadoDoEmail();
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] estado do e-mail ilegível: ${motivo}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">Sistema</p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Configurações
        </h1>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          O que vale para o app inteiro: para onde vão os botões de compra, o aviso que aparece na
          Home do aluno e o estado das peças que o painel não edita. Toda alteração fica na
          auditoria.
        </p>
      </header>

      {config === null ? (
        <Degradado />
      ) : (
        <>
          <Avisos avisos={config.avisos} />

          <Secao
            titulo="Link de checkout"
            selo={
              config.checkout.global ||
              Object.values(config.checkout.porPlano).some((link) => link !== null) ? (
                <Selo tom="ok">configurado</Selo>
              ) : (
                <Selo tom="alerta">sem link — botões de compra ocultos</Selo>
              )
            }
            descricao="Todos os botões de compra do app leem daqui. Só endereços https. A troca exige motivo e dispara um e-mail para todos os admins — se você não reconhecer um desses e-mails, alguém mexeu no lugar para onde o aluno leva o cartão."
            atualizadoEm={config.atualizadoEm[CHAVE_CHECKOUT]}
          >
            <FormularioDeCheckout inicial={config.checkout} />
          </Secao>

          <Secao
            titulo="Aviso de manutenção"
            selo={
              config.manutencao.ligado ? (
                <Selo tom="alerta">ligado — visível para os alunos</Selo>
              ) : (
                <Selo tom="neutro">desligado</Selo>
              )
            }
            descricao="Uma faixa no topo da Home do aluno, para avisar de instabilidade ou de uma parada programada. Desligar guarda o texto."
            atualizadoEm={config.atualizadoEm[CHAVE_MANUTENCAO]}
          >
            <FormularioDeManutencao inicial={config.manutencao} />
          </Secao>

          <SecaoDeVideo config={config} />
          <SecaoDeAllowlist config={config} />
        </>
      )}

      <SecaoDeEmail email={email} />
    </div>
  );
}
