/**
 * A parte interativa de `/admin/midia` (BACKOFFICE §2.8).
 *
 * ⚠️ `'use client'` aqui porque existe interatividade de verdade: escolher
 * arquivo, abrir o formulário de edição de um item e acompanhar o estado de
 * cada envio (`useActionState`). A leitura da biblioteca continua no Server
 * Component ao lado — este arquivo não fala com o banco, só com as Server
 * Actions de `src/lib/media/acoes.ts`.
 *
 * O limite de corpo de Server Action já está em `'6mb'` no `next.config.ts`
 * (5 MB da imagem + folga do multipart) — ver o cabeçalho de `@/lib/media/acoes`.
 *
 * ⚠️ O quadro de especificações do envio sai de `@/lib/media/especificacoes`,
 * que lê as mesmas constantes da validação: não escreva limite à mão aqui.
 */

/* eslint-disable @next/next/no-img-element -- miniatura de caminho arbitrário vindo do banco; o mesmo raciocínio de components/lesson/blocks/Ilustracao.tsx */

'use client';

import { useActionState, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { QuadroDeEspecificacoes } from '@/components/admin/QuadroDeEspecificacoes';
import {
  arquivarMidiaAction,
  enviarMidiaAction,
  restaurarMidiaAction,
  salvarMidiaAction,
} from '@/lib/media/acoes';
import {
  ACEITE_DE_IMAGEM,
  ESPECIFICACOES_DE_IMAGEM,
  linhasDaEspecificacaoDeImagem,
  lerAlvoDeImagem,
  type AlvoDeImagem,
} from '@/lib/media/especificacoes';
import {
  FORMATOS_EM_TEXTO,
  FORMULARIO_INICIAL,
  TAMANHO_MAXIMO_ALT,
  TAMANHO_MAXIMO_IMAGEM,
  TAMANHO_MAXIMO_NOME,
  formatarBytes,
  formatarDimensoes,
  type EstadoDoFormulario,
  type MidiaDaBiblioteca,
} from '@/lib/media/tipos';

// ───────────────────────────── peças pequenas ────────────────────────────────

/** A resposta da última tentativa, em texto. Erro nunca é só cor. */
function Recado({ estado }: { estado: EstadoDoFormulario }) {
  if (estado.estado === 'inicial') return null;

  const erro = estado.estado === 'erro';
  return (
    <p
      role="status"
      className="m-0 rounded-field px-3 py-2 text-[14px] font-bold leading-snug"
      style={
        erro
          ? { background: '#FEF0F2', color: '#B21F31' }
          : { background: '#E4F5EA', color: '#136B45' }
      }
    >
      {estado.mensagem}
    </p>
  );
}

/** Botão de envio que sabe que o formulário está no ar. */
function Enviar({
  children,
  variant = 'primary',
  ...props
}: {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  disabled?: boolean;
  'aria-describedby'?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" variant={variant} loading={pending} {...props}>
      {children}
    </Button>
  );
}

function erroDoCampo(estado: EstadoDoFormulario, campo: string): string | undefined {
  if (estado.estado !== 'erro') return undefined;
  return estado.campos?.[campo];
}

/** Etiqueta curta de estado ("sem alt", "em uso"). */
function Etiqueta({
  children,
  tom,
}: {
  children: ReactNode;
  tom: 'alerta' | 'neutro' | 'ok';
}) {
  const cores =
    tom === 'alerta'
      ? { background: '#FFF7E8', color: '#8A5B00' }
      : tom === 'ok'
        ? { background: '#E4F5EA', color: '#136B45' }
        : { background: '#EEF2F8', color: '#4A5875' };

  return (
    <span
      className="inline-flex items-center rounded-pill px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.06em]"
      style={cores}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────── envio ───────────────────────────────────────

const ALVOS = Object.keys(ESPECIFICACOES_DE_IMAGEM) as AlvoDeImagem[];

/**
 * O formulário de envio.
 *
 * O `accept` é conveniência do seletor de arquivos do sistema, **não** validação:
 * quem decide o que entra é `conferirImagem`, que lê os bytes no servidor.
 *
 * O campo "Para onde vai" (`uso`) troca o quadro de especificações e faz o
 * servidor devolver avisos de proporção, dimensão mínima e peso alvo. Não muda
 * o que é aceito: a mesma imagem pode servir a mais de um lugar.
 */
function FormularioDeEnvio({ habilitado }: { habilitado: boolean }) {
  const [estado, enviar] = useActionState(enviarMidiaAction, FORMULARIO_INICIAL);
  const [uso, setUso] = useState<AlvoDeImagem>('ilustracao');

  return (
    <form action={enviar} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Field label="Para onde vai" hint="Muda só as recomendações abaixo e os avisos da resposta.">
          <select
            name="uso"
            value={uso}
            onChange={(evento) => setUso(lerAlvoDeImagem(evento.target.value) ?? 'ilustracao')}
            className="h-11 w-full max-w-[360px] rounded-field border-[1.5px] border-border bg-bg px-3 text-[15px] font-bold text-navy focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden"
          >
            {ALVOS.map((alvo) => (
              <option key={alvo} value={alvo}>
                {ESPECIFICACOES_DE_IMAGEM[alvo].rotulo}
              </option>
            ))}
          </select>
        </Field>
        <QuadroDeEspecificacoes
          titulo={`Especificações — ${ESPECIFICACOES_DE_IMAGEM[uso].rotulo}`}
          linhas={linhasDaEspecificacaoDeImagem(uso)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Field
          label="Arquivo"
          required
          error={erroDoCampo(estado, 'arquivo')}
          hint={`${FORMATOS_EM_TEXTO}, até ${formatarBytes(TAMANHO_MAXIMO_IMAGEM)}. SVG não é aceito.`}
        >
          <input
            type="file"
            name="arquivo"
            accept={ACEITE_DE_IMAGEM}
            required
            className="block w-full cursor-pointer rounded-field border-[1.5px] border-border bg-bg px-3 py-[11px] text-[15px] font-bold text-navy file:mr-3 file:cursor-pointer file:rounded-pill file:border-0 file:bg-navy file:px-4 file:py-2 file:text-[14px] file:font-extrabold file:text-white focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden aria-invalid:border-danger"
          />
        </Field>

        <Field
          label="Texto alternativo"
          required
          error={erroDoCampo(estado, 'alt')}
          hint="Descreva a cena em uma frase: é o que o leitor de tela lê em voz alta."
        >
          <Input
            name="alt"
            maxLength={TAMANHO_MAXIMO_ALT}
            autoComplete="off"
            placeholder="Duas pessoas se cumprimentando na recepção de um hotel"
          />
        </Field>
      </div>

      <Recado estado={estado} />

      <div className="flex flex-wrap items-center gap-3">
        <Enviar disabled={!habilitado}>Enviar imagem</Enviar>
        {!habilitado ? (
          <span className="text-[13px] font-semibold leading-snug text-muted">
            O envio está bloqueado enquanto o armazenamento não estiver pronto.
          </span>
        ) : null}
      </div>
    </form>
  );
}

// ──────────────────────────────── cartão ─────────────────────────────────────

function ListaDeUsos({ item }: { item: MidiaDaBiblioteca }) {
  if (item.usos.length === 0) {
    return (
      <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
        Não aparece em nenhuma aula publicada.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.06em] text-muted">
        Onde aparece
      </p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {item.usos.map((uso) => (
          <li
            key={`${uso.lessonId}-${uso.contexto}`}
            className="text-[13px] font-semibold leading-snug text-navy"
          >
            {uso.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormularioDeEdicao({
  item,
  aoFechar,
}: {
  item: MidiaDaBiblioteca;
  aoFechar: () => void;
}) {
  const [estado, salvar] = useActionState(salvarMidiaAction, FORMULARIO_INICIAL);

  return (
    <form action={salvar} className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
      <input type="hidden" name="id" value={item.id} />

      <Field label="Nome exibido" required error={erroDoCampo(estado, 'filename')}>
        <Input
          name="filename"
          defaultValue={item.filename}
          maxLength={TAMANHO_MAXIMO_NOME}
          autoComplete="off"
        />
      </Field>

      <Field
        label="Texto alternativo"
        required
        error={erroDoCampo(estado, 'alt')}
        hint="O arquivo no disco não muda — o caminho de uma imagem nunca é editável."
      >
        <Input
          name="alt"
          defaultValue={item.alt ?? ''}
          maxLength={TAMANHO_MAXIMO_ALT}
          autoComplete="off"
          placeholder="Descreva a cena em uma frase"
        />
      </Field>

      <Recado estado={estado} />

      <div className="flex flex-wrap items-center gap-2">
        <Enviar>Salvar</Enviar>
        <Button type="button" size="md" variant="ghost" onClick={aoFechar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function FormularioDeArquivo({ item }: { item: MidiaDaBiblioteca }) {
  const arquivada = item.arquivadoEm !== null;
  const acao = arquivada ? restaurarMidiaAction : arquivarMidiaAction;
  const [estado, executar] = useActionState(acao, FORMULARIO_INICIAL);

  const emUso = item.usos.length > 0;
  const idDoAviso = `${item.id}-bloqueio`;

  return (
    <form action={executar} className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
      <input type="hidden" name="id" value={item.id} />

      <Recado estado={estado} />

      <div className="flex flex-wrap items-center gap-2">
        {/*
          ⚠️ O botão desabilitado é conveniência. A recusa de verdade é da action
          (`arquivarMidiaAction`), que confere os usos no servidor e devolve a
          lista de onde a imagem aparece.
        */}
        <Enviar
          variant={arquivada ? 'primary' : 'ghost'}
          disabled={!arquivada && emUso}
          aria-describedby={!arquivada && emUso ? idDoAviso : undefined}
        >
          {arquivada ? 'Restaurar' : 'Arquivar'}
        </Enviar>

        {!arquivada && emUso ? (
          <span id={idDoAviso} className="text-[13px] font-semibold leading-snug text-muted">
            Em uso em {item.usos.length} lugar{item.usos.length > 1 ? 'es' : ''}: troque a imagem
            lá antes de arquivar.
          </span>
        ) : null}
      </div>
    </form>
  );
}

function CartaoDeMidia({ item }: { item: MidiaDaBiblioteca }) {
  const [aba, setAba] = useState<'nenhuma' | 'editar' | 'arquivar'>('nenhuma');

  const dimensoes = formatarDimensoes(item.width, item.height);
  const semAlt = !item.alt || item.alt.trim().length === 0;
  const arquivada = item.arquivadoEm !== null;

  return (
    <li className="rounded-card border border-border bg-bg p-3">
      <div className="flex gap-3">
        <div className="h-[92px] w-[124px] shrink-0 overflow-hidden rounded-field border border-border bg-[#EDEFF4]">
          <img
            src={item.src}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="m-0 truncate text-[15px] font-extrabold leading-snug text-navy">
            {item.filename}
          </p>

          <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
            {item.mime.replace('image/', '').toUpperCase()} · {formatarBytes(item.bytes)}
            {dimensoes ? ` · ${dimensoes}` : ''} · enviada em {item.criadoEm}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {semAlt ? (
              <Etiqueta tom="alerta">sem alt</Etiqueta>
            ) : (
              <Etiqueta tom="ok">com alt</Etiqueta>
            )}
            {item.usos.length > 0 ? (
              <Etiqueta tom="neutro">
                {item.usos.length} uso{item.usos.length > 1 ? 's' : ''}
              </Etiqueta>
            ) : (
              <Etiqueta tom="neutro">sem uso</Etiqueta>
            )}
            {arquivada ? <Etiqueta tom="neutro">arquivada em {item.arquivadoEm}</Etiqueta> : null}
          </div>

          {semAlt ? (
            <p className="m-0 text-[13px] font-semibold leading-snug" style={{ color: '#8A5B00' }}>
              Sem texto alternativo: quem usa leitor de tela não faz ideia do que há nesta imagem.
            </p>
          ) : (
            <p className="m-0 text-[13px] font-semibold leading-snug text-muted">“{item.alt}”</p>
          )}

          <ListaDeUsos item={item} />

          <div className="mt-1 flex flex-wrap gap-2">
            <Button
              type="button"
              size="md"
              variant="ghost"
              aria-expanded={aba === 'editar'}
              onClick={() => setAba((atual) => (atual === 'editar' ? 'nenhuma' : 'editar'))}
            >
              {aba === 'editar' ? 'Fechar edição' : 'Editar'}
            </Button>

            <Button
              type="button"
              size="md"
              variant="ghost"
              aria-expanded={aba === 'arquivar'}
              onClick={() => setAba((atual) => (atual === 'arquivar' ? 'nenhuma' : 'arquivar'))}
            >
              {arquivada ? 'Restaurar' : 'Arquivar'}
            </Button>

            <a
              href={item.src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[46px] items-center justify-center rounded-pill px-4 text-[15px] font-extrabold tracking-[0.03em] text-navy no-underline transition-colors hover:bg-[#EAF2FE]"
            >
              Abrir
            </a>
          </div>
        </div>
      </div>

      {aba === 'editar' ? (
        <FormularioDeEdicao item={item} aoFechar={() => setAba('nenhuma')} />
      ) : null}

      {aba === 'arquivar' ? <FormularioDeArquivo item={item} /> : null}
    </li>
  );
}

// ─────────────────────────────── o painel ────────────────────────────────────

export type BibliotecaDeMidiaPainelProps = {
  itens: MidiaDaBiblioteca[];
  /** A lista bateu no teto de leitura e foi cortada. */
  truncada: boolean;
  /** A tela está mostrando o arquivo morto (filtro `arquivo=arquivados`). */
  arquivadas: boolean;
  /** O armazenamento respondeu ao diagnóstico — sem isso, enviar não adianta. */
  podeEnviar: boolean;
};

export function BibliotecaDeMidiaPainel({
  itens,
  truncada,
  arquivadas,
  podeEnviar,
}: BibliotecaDeMidiaPainelProps) {
  return (
    <div className="flex flex-col gap-5">
      {!arquivadas ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[17px] font-black leading-tight tracking-[-0.01em] text-navy">
            Enviar uma imagem
          </h2>
          <FormularioDeEnvio habilitado={podeEnviar} />
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[17px] font-black leading-tight tracking-[-0.01em] text-navy">
          {arquivadas ? 'Imagens arquivadas' : 'Na biblioteca'}
          <span className="ml-2 text-[15px] font-bold text-muted">({itens.length})</span>
        </h2>

        {truncada ? (
          <p className="m-0 text-[13px] font-semibold leading-snug text-muted">
            A lista foi cortada no limite de leitura. Use a busca e os filtros para chegar ao
            arquivo que você procura.
          </p>
        ) : null}

        {itens.length === 0 ? (
          <p className="m-0 rounded-field border border-border bg-bg px-4 py-6 text-center text-[14px] font-semibold leading-snug text-muted">
            {arquivadas
              ? 'Nenhuma imagem arquivada.'
              : 'Nenhuma imagem corresponde a estes filtros.'}
          </p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 xl:grid-cols-2">
            {itens.map((item) => (
              <CartaoDeMidia key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BibliotecaDeMidiaPainel;
