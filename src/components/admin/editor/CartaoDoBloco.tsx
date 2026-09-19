/**
 * Um bloco na lista do editor: cabeçalho (tipo, id somente leitura, quantos
 * alunos responderam), ações (↑ ↓ duplicar remover) e a caixa de JSON.
 *
 * ⚠️ O `id` dos blocos interativos **não está na caixa de texto** — aparece
 * acima dela, somente leitura. É a chave das respostas dos alunos (§6.2);
 * se o admin colar um `id` no JSON, a leitura acusa erro e o salvar trava.
 *
 * Nos 14 tipos com formulário, o bloco abre no formulário e alterna com o JSON.
 * Os dois modos editam o MESMO texto (`texto`/`aoEditar`); não há segundo estado.
 */
'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';

import { FormularioDoBloco, temFormulario } from '@/components/admin/forms/FormularioDoBloco';
import { lerObjeto } from '@/components/admin/forms/objeto';
import { rotuloDoTipo, type LeituraDoBloco, type TipoDeBloco } from '@/lib/admin/editor';

import { BotaoDeItem, COR_ERRO, ListaDeProblemas } from './ui';

export function CartaoDoBloco({
  indice,
  total,
  t,
  id,
  texto,
  leitura,
  alunos,
  aberto,
  selecionado,
  aoAlternar,
  aoEditar,
  aoFormatar,
  aoSubir,
  aoDescer,
  aoDuplicar,
  aoRemover,
}: {
  indice: number;
  total: number;
  t: TipoDeBloco;
  id?: string;
  texto: string;
  leitura: LeituraDoBloco;
  /** Alunos distintos com resposta gravada neste bloco (versão publicada). */
  alunos: number;
  aberto: boolean;
  selecionado: boolean;
  aoAlternar: () => void;
  aoEditar: (texto: string) => void;
  aoFormatar: () => void;
  aoSubir: () => void;
  aoDescer: () => void;
  aoDuplicar: () => void;
  aoRemover: () => void;
}) {
  const base = useId();
  const idDaCaixa = `${base}-json`;
  const idDosErros = `${base}-erros`;
  const linhas = Math.min(28, Math.max(6, texto.split('\n').length + 1));
  const valido = leitura.ok;
  const comFormulario = temFormulario(t);
  // O formulário só abre o que consegue ler inteiro; JSON quebrado fica no modo JSON.
  const legivel = useMemo(() => comFormulario && lerObjeto(texto) !== null, [comFormulario, texto]);
  const [modo, setModo] = useState<'formulario' | 'json'>(() =>
    comFormulario && legivel ? 'formulario' : 'json',
  );
  const noFormulario = modo === 'formulario' && comFormulario && legivel;
  const idDoModo = `${base}-modo`;

  return (
    <li
      className="rounded-[18px] border-[1.5px] border-solid bg-surface p-3"
      style={{ borderColor: !valido ? COR_ERRO.borda : selecionado ? '#1B6BE3' : '#E3EAF3' }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={aoAlternar}
          aria-expanded={aberto}
          aria-controls={idDaCaixa}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-[12px] px-2 text-left hover:bg-[#F4F7FB]"
        >
          <span className="grid size-7 flex-none place-items-center rounded-full bg-[#EEF3FA] text-[12px] font-black text-navy">
            {indice + 1}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-black text-navy">
              {rotuloDoTipo(t)}{' '}
              <code className="font-mono text-[12px] font-bold text-muted">{t}</code>
            </span>
            {!valido ? (
              <span className="block text-[12px] font-extrabold" style={{ color: COR_ERRO.texto }}>
                {leitura.erros.length} erro(s): não pode ser salvo assim
              </span>
            ) : null}
          </span>
          <span aria-hidden="true" className="ml-auto text-[13px] font-black text-muted">
            {aberto ? '▲' : '▼'}
          </span>
        </button>
        <div className="flex gap-1.5">
          <BotaoDeItem rotulo={`Subir bloco ${indice + 1}`} onClick={aoSubir} disabled={indice === 0}>
            ↑
          </BotaoDeItem>
          <BotaoDeItem
            rotulo={`Descer bloco ${indice + 1}`}
            onClick={aoDescer}
            disabled={indice === total - 1}
          >
            ↓
          </BotaoDeItem>
          <BotaoDeItem
            rotulo={`Duplicar bloco ${indice + 1}`}
            onClick={aoDuplicar}
            disabled={!valido}
          >
            ⧉
          </BotaoDeItem>
          <BotaoDeItem rotulo={`Remover bloco ${indice + 1}`} onClick={aoRemover} perigo>
            ✕
          </BotaoDeItem>
        </div>
      </div>

      {id !== undefined || alunos > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
          {id !== undefined ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-[#EEF3FA] px-2.5 py-1 text-[12px] font-extrabold text-muted-2">
              id <code className="font-mono text-navy">{id}</code>
              <span className="sr-only">(somente leitura)</span>
              <span aria-hidden="true">· fixo</span>
            </span>
          ) : null}
          {alunos > 0 ? (
            <span
              className="inline-block rounded-pill px-2.5 py-1 text-[12px] font-extrabold"
              style={{ background: '#FEF7E0', color: '#6B520A' }}
            >
              {alunos} aluno(s) já responderam
            </span>
          ) : null}
        </div>
      ) : null}

      <div id={idDaCaixa} hidden={!aberto} className="mt-3 flex flex-col gap-2">
        {comFormulario ? (
          <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <div
              role="group"
              aria-label="Modo de edição do bloco"
              className="inline-flex gap-1 rounded-pill bg-[#EEF3FA] p-1"
            >
              <BotaoDeModo
                ativo={noFormulario}
                onClick={() => setModo('formulario')}
                disabled={!legivel}
                descritoPor={!legivel ? idDoModo : undefined}
              >
                Formulário
              </BotaoDeModo>
              <BotaoDeModo ativo={!noFormulario} onClick={() => setModo('json')}>
                JSON
              </BotaoDeModo>
            </div>
            {!legivel ? (
              <p id={idDoModo} className="m-0 text-[12px] font-bold text-muted">
                O formulário volta quando o JSON estiver sem erro de sintaxe.
              </p>
            ) : null}
          </div>
        ) : null}
        {noFormulario && comFormulario ? (
          aberto ? (
            <FormularioDoBloco t={t} id={id} texto={texto} alunos={alunos} aoEditar={aoEditar} />
          ) : null
        ) : (
          <>
            <label htmlFor={`${idDaCaixa}-area`} className="kicker m-0">
              Conteúdo do bloco (JSON)
            </label>
            <textarea
              id={`${idDaCaixa}-area`}
              value={texto}
              onChange={(evento) => aoEditar(evento.target.value)}
              rows={linhas}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-invalid={!valido}
              aria-describedby={!valido ? idDosErros : undefined}
              className="block w-full resize-y rounded-field border-[1.5px] border-solid border-border bg-bg p-3 font-mono text-[13px] leading-[1.5] text-navy focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] aria-invalid:border-danger"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={aoFormatar}
                disabled={!valido}
                className="min-h-11 rounded-pill bg-[#EEF3FA] px-4 text-[13px] font-extrabold text-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reformatar JSON
              </button>
              <p className="m-0 text-[12px] font-bold text-muted">
                O tipo (<code className="font-mono">t</code>)
                {id !== undefined ? (
                  <>
                    {' '}e o <code className="font-mono">id</code>
                  </>
                ) : null}{' '}
                ficam fora da caixa e não mudam.
              </p>
            </div>
          </>
        )}
        {!valido ? <ListaDeProblemas id={idDosErros} itens={leitura.erros} tom="erro" /> : null}
      </div>
    </li>
  );
}

/** Botão do seletor Formulário | JSON: 44px de altura, estado em `aria-pressed`. */
function BotaoDeModo({
  ativo,
  onClick,
  disabled,
  descritoPor,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  disabled?: boolean;
  descritoPor?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      disabled={disabled}
      aria-describedby={descritoPor}
      className={
        ativo
          ? 'min-h-11 rounded-pill bg-navy px-4 text-[13px] font-extrabold text-white'
          : 'min-h-11 rounded-pill px-4 text-[13px] font-extrabold text-navy hover:bg-white disabled:cursor-not-allowed disabled:opacity-50'
      }
    >
      {children}
    </button>
  );
}
