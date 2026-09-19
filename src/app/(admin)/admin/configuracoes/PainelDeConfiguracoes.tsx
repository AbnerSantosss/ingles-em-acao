/**
 * A parte interativa de `/admin/configuracoes`: os três formulários que esta
 * tela grava (link de checkout, mapa produto→plano do webhook de pagamento e
 * aviso de manutenção).
 *
 * ⚠️ `'use client'` por causa do estado de envio (`useActionState`). A leitura
 * continua no Server Component ao lado; este arquivo não fala com o banco, só
 * com as Server Actions.
 *
 * ⚠️ **Os formulários usam `onSubmit` + `startTransition`, não `action={...}`.**
 * No React 19, um `<form action>` limpa os campos não controlados depois de
 * cada envio — inclusive quando a action devolve erro de validação. Num
 * formulário com quatro endereços e um motivo, isso apagaria tudo o que o
 * admin digitou só porque um dos links estava sem `https://`.
 */
'use client';

import { startTransition, useActionState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import type { Plano } from '@/lib/planos';

import { salvarCheckoutAction, salvarManutencaoAction, salvarProdutosAction } from './actions';
import { FORMULARIO_INICIAL, type EstadoDoFormulario } from './tipos';

const TEXTAREA = [
  'block min-h-[92px] w-full rounded-field border-[1.5px] border-border bg-bg px-4 py-3',
  'text-[15px] font-semibold leading-snug text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
].join(' ');

const SELECT = [
  'block h-[52px] w-full rounded-field border-[1.5px] border-border bg-bg px-4',
  'text-[17px] font-bold text-navy',
  'focus:border-blue focus:shadow-[0_0_0_3px_rgba(27,107,227,0.22)] focus-visible:outline-hidden',
  'aria-invalid:border-danger',
].join(' ');

/** Limites espelhados de `@/lib/admin/settings` (não dá para importar de lá: é módulo de servidor). */
const TAMANHO_MAXIMO_DE_URL = 500;
const TAMANHO_MAXIMO_DO_AVISO = 280;
/** Espelhado de `@/lib/pagamento/produtos` (módulo de servidor, pelo mesmo motivo). */
const TAMANHO_MAXIMO_DO_CODIGO = 100;

const PLANOS: readonly { plano: Plano; rotulo: string }[] = [
  { plano: 'ESSENCIAL', rotulo: 'Essencial' },
  { plano: 'PREMIUM', rotulo: 'Premium' },
];

// ───────────────────────────── peças pequenas ────────────────────────────

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

function erroDoCampo(estado: EstadoDoFormulario, campo: string): string | undefined {
  if (estado.estado !== 'erro') return undefined;
  return estado.campos?.[campo];
}

/** Envia sem deixar o React 19 limpar o formulário (ver o cabeçalho). */
function enviarSemLimpar(despachar: (dados: FormData) => void) {
  return (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    startTransition(() => despachar(dados));
  };
}

// ──────────────────────────── link de checkout ───────────────────────────

export type CheckoutInicial = {
  global: string | null;
  porPlano: Record<Plano, string | null>;
};

/**
 * Link global + um por plano. Campo vazio = sem link: o plano cai no global e,
 * sem global, o botão de compra some do app.
 */
export function FormularioDeCheckout({ inicial }: { inicial: CheckoutInicial }) {
  const [estado, enviar, pendente] = useActionState(salvarCheckoutAction, FORMULARIO_INICIAL);

  return (
    <form onSubmit={enviarSemLimpar(enviar)} className="flex flex-col gap-4" noValidate>
      <Field
        label="Link global"
        hint="Usado por todos os planos que não tiverem link próprio."
        error={erroDoCampo(estado, 'global')}
      >
        <Input
          name="global"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          maxLength={TAMANHO_MAXIMO_DE_URL}
          placeholder="https://"
          defaultValue={inicial.global ?? ''}
        />
      </Field>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANOS.map(({ plano, rotulo }) => (
          <Field
            key={plano}
            label={`Plano ${rotulo}`}
            hint="Vazio: usa o global."
            error={erroDoCampo(estado, plano)}
          >
            <Input
              name={plano}
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              maxLength={TAMANHO_MAXIMO_DE_URL}
              placeholder="https://"
              defaultValue={inicial.porPlano[plano] ?? ''}
            />
          </Field>
        ))}
      </div>

      <Field
        label="Motivo da troca"
        required
        hint="Obrigatório. Vai para a auditoria e para o e-mail que todos os admins recebem."
        error={erroDoCampo(estado, 'motivo')}
      >
        <textarea
          name="motivo"
          maxLength={300}
          className={TEXTAREA}
        />
      </Field>

      <Recado estado={estado} />

      <div className="flex">
        <Button type="submit" size="md" variant="primary" loading={pendente}>
          Salvar links de checkout
        </Button>
      </div>
    </form>
  );
}

// ───────────────────────── produtos → plano (webhook) ────────────────────

export type ProdutoInicial = { codigo: string; plano: Plano };

/** Linhas vazias no fim da lista, para mapear produtos novos. */
const LINHAS_EM_BRANCO = 3;

/**
 * O mapa produto→plano do webhook: uma linha por produto da plataforma de
 * venda. Apagar o código de uma linha tira o produto do mapa.
 *
 * `versao` muda a cada salvamento (é o `updatedAt` da chave): o `key` abaixo
 * remonta as linhas com o mapa novo e o motivo limpo. Com erro de validação a
 * versão não muda e o que o admin digitou fica.
 */
export function FormularioDeProdutos({
  inicial,
  versao,
}: {
  inicial: readonly ProdutoInicial[];
  versao: string;
}) {
  const [estado, enviar, pendente] = useActionState(salvarProdutosAction, FORMULARIO_INICIAL);
  const linhas: (ProdutoInicial | null)[] = [
    ...inicial,
    ...Array.from({ length: LINHAS_EM_BRANCO }, () => null),
  ];

  return (
    <form onSubmit={enviarSemLimpar(enviar)} className="flex flex-col gap-4" noValidate>
      <div key={versao} className="flex flex-col gap-4">
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {linhas.map((linha, indice) => {
            // Só a primeira linha mostra os rótulos; nas outras eles ficam para
            // o leitor de tela, com o número da linha.
            const rotuloVisivel = indice === 0 ? undefined : 'sr-only';
            return (
              <li key={indice} className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <Field
                  label={indice === 0 ? 'Código do produto' : `Código do produto, linha ${indice + 1}`}
                  labelClassName={rotuloVisivel}
                  error={erroDoCampo(estado, `produto-${indice}`)}
                >
                  <Input
                    name="produto"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={TAMANHO_MAXIMO_DO_CODIGO}
                    placeholder={linha ? undefined : 'código na plataforma'}
                    defaultValue={linha?.codigo ?? ''}
                  />
                </Field>
                <Field
                  label={indice === 0 ? 'Plano liberado' : `Plano liberado, linha ${indice + 1}`}
                  labelClassName={rotuloVisivel}
                  error={erroDoCampo(estado, `plano-${indice}`)}
                >
                  <select name="plano" defaultValue={linha?.plano ?? ''} className={SELECT}>
                    <option value="">Escolha…</option>
                    {PLANOS.map(({ plano, rotulo }) => (
                      <option key={plano} value={plano}>
                        {rotulo}
                      </option>
                    ))}
                  </select>
                </Field>
              </li>
            );
          })}
        </ul>

        <p className="m-0 text-[14px] leading-snug text-muted-2">
          Para tirar um produto do mapa, apague o código e salve. Precisa de mais linhas? Salve e
          outras {LINHAS_EM_BRANCO} aparecem vazias.
        </p>

        <Field
          label="Motivo da alteração"
          required
          hint="Obrigatório. Vai para a auditoria junto com o mapa de antes e o de depois."
          error={erroDoCampo(estado, 'motivo')}
        >
          <textarea name="motivo" maxLength={300} className={TEXTAREA} />
        </Field>
      </div>

      <Recado estado={estado} />

      <div className="flex">
        <Button type="submit" size="md" variant="primary" loading={pendente}>
          Salvar produtos
        </Button>
      </div>
    </form>
  );
}

// ─────────────────────────── aviso de manutenção ─────────────────────────

export type ManutencaoInicial = {
  ligado: boolean;
  texto: string;
};

/** Texto + liga/desliga. Desligar guarda o texto para religar depois. */
export function FormularioDeManutencao({ inicial }: { inicial: ManutencaoInicial }) {
  const [estado, enviar, pendente] = useActionState(salvarManutencaoAction, FORMULARIO_INICIAL);

  return (
    <form onSubmit={enviarSemLimpar(enviar)} className="flex flex-col gap-4" noValidate>
      <Field
        label="Texto do aviso"
        hint={`Até ${TAMANHO_MAXIMO_DO_AVISO} caracteres. Aparece numa faixa no topo da Home do aluno.`}
        error={erroDoCampo(estado, 'texto')}
      >
        <textarea
          name="texto"
          maxLength={TAMANHO_MAXIMO_DO_AVISO}
          defaultValue={inicial.texto}
          className={TEXTAREA}
        />
      </Field>

      <label className="flex cursor-pointer items-center gap-3 text-[15px] font-bold text-navy">
        <input
          type="checkbox"
          name="ligado"
          defaultChecked={inicial.ligado}
          className="h-5 w-5 accent-[#123A86]"
        />
        Mostrar o aviso para os alunos
      </label>

      <Recado estado={estado} />

      <div className="flex">
        <Button type="submit" size="md" variant="primary" loading={pendente}>
          Salvar aviso
        </Button>
      </div>
    </form>
  );
}
