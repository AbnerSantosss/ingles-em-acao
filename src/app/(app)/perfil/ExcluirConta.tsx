'use client';

/**
 * Zona de risco do `/perfil`: "Excluir minha conta".
 *
 * Mesma linguagem visual do bloco "Apagar progresso" (rosa claro, borda
 * `#F9D3D9`, título em `#E03B4C`), mas em cartão próprio no fim da página —
 * longe dos botões do dia a dia, para ninguém chegar aqui por engano.
 *
 * Dois toques antes de qualquer coisa acontecer: o botão só abre o formulário,
 * e o formulário pede a senha de novo **e** a caixa de confirmação. O que sai
 * e o que fica é dito antes do botão final, sem letra miúda.
 *
 * ⚠️ `onSubmit` + `startTransition`, não `<form action>`: no React 19 o
 * `action` limpa os campos depois de cada envio, até quando a action devolve
 * erro — o aluno perderia a caixa marcada a cada senha errada.
 *
 * Quando a exclusão dá certo a action redireciona para `/entrar`; este
 * componente só vê os erros.
 */
import Image from 'next/image';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import { excluirContaAction } from '@/app/(app)/perfil/actions';
import {
  ESTADO_INICIAL_DA_EXCLUSAO,
  VALOR_DA_CONFIRMACAO,
  type CampoDaExclusao,
  type EstadoDaExclusao,
} from '@/app/(app)/perfil/tipos';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { TAMANHO_MAXIMO_SENHA } from '@/lib/auth/constantes';

const FOCO = 'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue';

function erroDo(estado: EstadoDaExclusao, campo: CampoDaExclusao): string | undefined {
  if (estado.estado !== 'erro' || estado.campo !== campo) return undefined;
  return estado.mensagem;
}

function Lista({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div>
      <p className="m-0 mb-1 text-[15px] font-extrabold text-navy">{titulo}</p>
      <ul className="m-0 flex flex-col gap-1 pl-5 text-[15px] leading-[1.45] text-[#5B6B7F]">
        {itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ExcluirConta({ administrador }: { administrador: boolean }) {
  const [aberto, setAberto] = useState(false);
  const [estado, enviar, pendente] = useActionState(excluirContaAction, ESTADO_INICIAL_DA_EXCLUSAO);
  const campoDeSenha = useRef<HTMLInputElement>(null);

  // Ao abrir, o foco vai direto para a senha — o próximo passo óbvio.
  useEffect(() => {
    if (aberto) campoDeSenha.current?.focus();
  }, [aberto]);

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    startTransition(() => enviar(dados));
  }

  // Erro que não pertence a um campo (bloqueio por tentativas, banco fora).
  const erroGeral = estado.estado === 'erro' && !estado.campo ? estado.mensagem : null;

  return (
    <section
      aria-labelledby="titulo-excluir-conta"
      className="rounded-[20px] border-[1.5px] border-solid border-[#F9D3D9] bg-[#FEF0F2] px-6 py-[22px]"
    >
      <div className="flex items-center gap-[14px]">
        <div className="grid size-[54px] flex-none place-items-center rounded-[15px] bg-white">
          <Image
            src="/icons/lixeira.png"
            alt=""
            width={36}
            height={36}
            className="size-9 object-contain"
          />
        </div>
        <div className="min-w-0">
          <h2
            id="titulo-excluir-conta"
            className="m-0 text-[23px] font-black tracking-[-0.01em] text-[#E03B4C]"
          >
            Excluir minha conta
          </h2>
          <p className="m-0 text-[16px] text-[#C4606C]">
            Apaga seus dados pessoais e todo o seu progresso. Não pode ser desfeito.
          </p>
        </div>
      </div>

      {administrador ? (
        <p className="m-0 mt-4 text-[15px] leading-[1.45] text-[#5B6B7F]">
          Esta é uma conta de administrador e não pode ser excluída por aqui. Outro administrador
          precisa tirar o seu acesso de administrador antes, pelo painel.
        </p>
      ) : !aberto ? (
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-expanded={false}
          aria-controls="formulario-excluir-conta"
          className={`mt-4 cursor-pointer rounded-pill border-[1.5px] border-solid border-[#E03B4C] bg-white px-[22px] py-3 text-[16px] font-extrabold text-[#E03B4C] hover:bg-[#FFF7F8] ${FOCO}`}
        >
          Quero excluir minha conta
        </button>
      ) : (
        <form
          id="formulario-excluir-conta"
          onSubmit={aoEnviar}
          noValidate
          className="mt-4 flex flex-col gap-4 rounded-[16px] bg-white px-5 py-[18px]"
        >
          <Lista
            titulo="O que é apagado"
            itens={[
              'Seu nome, e-mail, foto e senha.',
              'Aulas concluídas, respostas dos exercícios e dias de estudo.',
              'Todas as sessões abertas, em todos os aparelhos.',
            ]}
          />
          <Lista
            titulo="O que fica, e por quê"
            itens={[
              'O registro das suas compras, sem o seu nome nem o seu e-mail — é obrigação fiscal.',
              'O registro deste pedido de exclusão, para comprovar que ele foi atendido.',
            ]}
          />
          <p className="m-0 text-[15px] leading-[1.45] text-[#5B6B7F]">
            O acesso do seu plano termina junto com a conta. Seu e-mail fica livre: se quiser voltar
            um dia, é possível criar uma conta nova, começando do zero.
          </p>

          <Field label="Sua senha" required error={erroDo(estado, 'senha')}>
            <Input
              ref={campoDeSenha}
              type="password"
              name="senha"
              autoComplete="current-password"
              maxLength={TAMANHO_MAXIMO_SENHA}
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="flex cursor-pointer items-start gap-3 text-[15px] font-bold leading-[1.4] text-navy">
              <input
                type="checkbox"
                name="confirmacao"
                value={VALOR_DA_CONFIRMACAO}
                aria-invalid={erroDo(estado, 'confirmacao') ? true : undefined}
                aria-describedby={erroDo(estado, 'confirmacao') ? 'erro-confirmacao' : undefined}
                className="mt-0.5 size-5 flex-none cursor-pointer accent-[#E03B4C]"
              />
              Entendo que a exclusão é definitiva e não pode ser desfeita.
            </label>
            {erroDo(estado, 'confirmacao') ? (
              <p id="erro-confirmacao" className="m-0 text-[14px] font-bold text-[#B21F31]">
                {erroDo(estado, 'confirmacao')}
              </p>
            ) : null}
          </div>

          {erroGeral ? (
            <p
              role="alert"
              className="m-0 rounded-[12px] bg-[#FEF0F2] px-3 py-2 text-[14px] font-bold leading-snug text-[#B21F31]"
            >
              {erroGeral}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <Button
              type="submit"
              size="md"
              variant="danger"
              loading={pendente}
              loadingLabel="Excluindo..."
            >
              Excluir minha conta
            </Button>
            <Button
              type="button"
              size="md"
              variant="ghost"
              disabled={pendente}
              onClick={() => setAberto(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
