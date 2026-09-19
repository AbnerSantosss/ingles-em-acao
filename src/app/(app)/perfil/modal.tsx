'use client';

/**
 * Modal de informação do `/perfil` — réplica do `<sc-if value="{{ modalOpen }}">`
 * do design (Claude Designer): ícone de 44px + título, texto, e a dupla de botões
 * [ação principal | Fechar].
 *
 * Cada linha do perfil abre uma chave (`MODAL` do protótipo). As que têm backend
 * de verdade (sair, encerrar outras sessões, reenviar confirmação, trocar senha
 * pelo fluxo de e-mail, conhecer o próximo plano) fazem a coisa real; as que
 * ainda não têm dizem "em breve" em vez de fingir.
 *
 * ⚠️ `<dialog>` nativo com `showModal()`: prende o foco, fecha no Esc e põe o
 * resto da página como inerte — o que o overlay do protótipo não fazia.
 */
import Image from 'next/image';
import Link from 'next/link';
import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useFormStatus } from 'react-dom';

import {
  encerrarOutrasSessoesAction,
  reenviarVerificacaoAction,
  sairAction,
} from '@/app/(app)/perfil/actions';
import { ESTADO_INICIAL_DE_REENVIO } from '@/components/app/VerifyEmailBanner';

export type ChaveDoModal =
  | 'edit'
  | 'photo'
  | 'senha'
  | 'email'
  | 'notif'
  | 'idioma'
  | 'privacidade'
  | 'metas'
  | 'lembretes'
  | 'conquistas'
  | 'certificado'
  | 'plano'
  | 'apagar'
  | 'sair';

/** Só dados reais da conta — nada aqui é inventado para preencher o modal. */
export type DadosDoPerfil = {
  nome: string;
  email: string;
  emailConfirmado: boolean;
  temFoto: boolean;
  nomeDoPlano: string;
  descricaoDoPlano: string;
  /** Convite para o degrau seguinte; `null` quando não há plano acima ou link configurado. */
  proximoPlano: { nome: string; link: string } | null;
  aulasFeitas: number;
  totalDeAulas: number;
};

const AbrirModal = createContext<((chave: ChaveDoModal) => void) | null>(null);

/* Estilos dos dois botões do rodapé do modal (px e cores do design). */
const BOTAO_PRINCIPAL =
  'flex min-w-[140px] flex-1 cursor-pointer items-center justify-center rounded-pill border-0 bg-navy p-[14px] text-center text-[16px] font-extrabold text-white no-underline hover:bg-[#123A86] disabled:cursor-not-allowed disabled:opacity-60';
const BOTAO_FECHAR =
  'flex-none cursor-pointer rounded-pill border-[1.5px] border-solid border-[#DCE6F2] bg-white px-[22px] py-[14px] text-[16px] font-extrabold text-[#5B6B7F] hover:bg-[#F7F9FC]';

/** Botão de envio que se desliga enquanto a Server Action roda. */
function BotaoDeEnvio({ children, pendente }: { children: ReactNode; pendente: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={BOTAO_PRINCIPAL}>
      {pending ? pendente : children}
    </button>
  );
}

/** Parte do modal "E-mail e segurança": estado do e-mail + reenviar + outras sessões. */
function ConteudoDeEmail({ dados }: { dados: DadosDoPerfil }) {
  const [estado, reenviar, reenviando] = useActionState(
    reenviarVerificacaoAction,
    ESTADO_INICIAL_DE_REENVIO,
  );

  return (
    <div className="mb-[18px] flex flex-col gap-3">
      <div className="rounded-[16px] bg-[#F7F9FC] px-4 py-3">
        <p className="m-0 break-words text-[16px] font-extrabold text-navy">{dados.email}</p>
        <span
          className={
            dados.emailConfirmado
              ? 'mt-1.5 inline-block rounded-pill bg-[#CFEFDF] px-[13px] py-[5px] text-[14px] font-extrabold text-[#136B45]'
              : 'mt-1.5 inline-block rounded-pill bg-[#FEF7E0] px-[13px] py-[5px] text-[14px] font-extrabold text-[#8A6B12]'
          }
        >
          {dados.emailConfirmado ? 'Confirmado' : 'Confirmação pendente'}
        </span>

        {dados.emailConfirmado ? null : (
          <form action={reenviar} className="mt-2">
            <button
              type="submit"
              disabled={reenviando}
              className="cursor-pointer border-0 bg-transparent p-0 text-[15px] font-extrabold text-blue underline underline-offset-4 disabled:opacity-60"
            >
              {reenviando ? 'Enviando...' : 'Reenviar link de confirmação'}
            </button>
            {estado.mensagem ? (
              <p role="status" className="m-0 mt-1.5 text-[14px] font-semibold leading-snug text-[#5B6B7F]">
                {estado.mensagem}
              </p>
            ) : null}
          </form>
        )}
      </div>

      <p className="m-0 text-[15px] leading-[1.45] text-[#5B6B7F]">
        Esqueceu o app aberto em outro aparelho? Encerre as outras sessões sem sair daqui. A
        verificação em duas etapas chega em breve.
      </p>
    </div>
  );
}

type ConteudoDoModal = {
  titulo: string;
  icone: string | null;
  texto: ReactNode;
  extra?: ReactNode;
  /** Ação principal; sem ela, o botão principal só fecha ("Entendi"). */
  principal?: ReactNode;
};

function conteudoDe(chave: ChaveDoModal, dados: DadosDoPerfil): ConteudoDoModal {
  switch (chave) {
    case 'edit':
      return {
        titulo: 'Editar perfil',
        icone: '/icons/perfil.png',
        texto: (
          <>
            Em breve você poderá alterar o nome que aparece no app. Por enquanto, sua conta está
            como <strong className="font-extrabold text-navy">{dados.nome}</strong>.
          </>
        ),
      };
    case 'photo':
      return {
        titulo: 'Trocar foto',
        icone: '/icons/camera.png',
        texto: dados.temFoto
          ? 'A troca de foto pelo app chega em breve. Por enquanto, sua foto atual continua valendo.'
          : 'A troca de foto pelo app chega em breve. Por enquanto, seu perfil mostra as suas iniciais.',
      };
    case 'senha':
      return {
        titulo: 'Alterar senha',
        icone: '/icons/cadeado.png',
        texto: `Na próxima tela, informe o seu e-mail (${dados.email}) e enviaremos um link para você criar uma nova senha.`,
        principal: (
          <Link href="/esqueci-senha" className={BOTAO_PRINCIPAL}>
            Continuar
          </Link>
        ),
      };
    case 'email':
      return {
        titulo: 'E-mail e segurança',
        icone: '/icons/email.png',
        texto: 'Este é o e-mail que usamos para te identificar e para recuperar sua senha.',
        extra: <ConteudoDeEmail dados={dados} />,
        principal: (
          <form action={encerrarOutrasSessoesAction} className="flex min-w-[140px] flex-1">
            <BotaoDeEnvio pendente="Encerrando...">Encerrar outras sessões</BotaoDeEnvio>
          </form>
        ),
      };
    case 'notif':
      return {
        titulo: 'Notificações',
        icone: '/icons/sino.png',
        texto:
          'Em breve você poderá escolher o que quer receber: lembretes de estudo, novidades e conquistas.',
      };
    case 'idioma':
      return {
        titulo: 'Idioma do app',
        icone: '/icons/globo.png',
        texto: 'A interface está em Português (Brasil). Mais idiomas em breve.',
      };
    case 'privacidade':
      return {
        titulo: 'Privacidade',
        icone: '/icons/escudo.png',
        texto: (
          <>
            Seu progresso e suas respostas ficam salvos na sua conta. Veja como cuidamos dos seus
            dados na{' '}
            <Link href="/privacidade" className="font-extrabold text-blue underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </>
        ),
      };
    case 'metas':
      return {
        titulo: 'Metas de estudo',
        icone: '/icons/alvo.png',
        texto: 'Em breve você poderá definir quantas aulas quer concluir por semana e manter o foco.',
      };
    case 'lembretes':
      return {
        titulo: 'Lembretes de estudo',
        icone: '/icons/relogio.png',
        texto:
          'Em breve você poderá receber um lembrete diário no horário que combina com sua rotina.',
      };
    case 'conquistas':
      return {
        titulo: 'Minhas conquistas',
        icone: '/icons/trofeu.png',
        texto: 'Em breve seus badges e marcos aparecem aqui conforme você avança na trilha.',
      };
    case 'certificado':
      return {
        titulo: 'Baixar certificado',
        icone: '/icons/certificado.png',
        texto:
          dados.aulasFeitas >= dados.totalDeAulas && dados.totalDeAulas > 0
            ? 'Você concluiu a trilha inteira! O download do certificado chega em breve.'
            : `O certificado fica disponível ao concluir as ${dados.totalDeAulas} aulas da trilha. Você já concluiu ${dados.aulasFeitas}.`,
      };
    case 'plano':
      return {
        titulo: dados.nomeDoPlano,
        icone: null,
        texto: `Seu plano está ativo. ${dados.descricaoDoPlano}`,
        principal: dados.proximoPlano ? (
          <a
            href={dados.proximoPlano.link}
            target="_blank"
            rel="noopener noreferrer"
            className={BOTAO_PRINCIPAL}
          >
            Conhecer o {dados.proximoPlano.nome}
            <span className="sr-only"> (abre em outra aba)</span>
          </a>
        ) : undefined,
      };
    case 'apagar':
      // ⚠️ Ação destrutiva sem backend: o modal explica, não apaga nada.
      return {
        titulo: 'Apagar progresso',
        icone: '/icons/lixeira.png',
        texto:
          'Em breve. Quando chegar, esta opção vai remover todas as respostas, aulas concluídas e anotações, e não poderá ser desfeita. Por enquanto, nada é apagado.',
      };
    case 'sair':
      return {
        titulo: 'Sair da conta',
        icone: '/icons/sair.png',
        texto: 'Você encerrará a sessão neste aparelho. Seu progresso continua salvo na sua conta.',
        principal: (
          <form action={sairAction} className="flex min-w-[140px] flex-1">
            <BotaoDeEnvio pendente="Saindo...">Sair</BotaoDeEnvio>
          </form>
        ),
      };
  }
}

export function ProvedorDoModal({
  dados,
  children,
}: {
  dados: DadosDoPerfil;
  children: ReactNode;
}) {
  const [chave, setChave] = useState<ChaveDoModal | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  const abrir = useCallback((nova: ChaveDoModal) => setChave(nova), []);
  const fechar = useCallback(() => setChave(null), []);

  // O `<dialog>` só entra em modo modal via API imperativa.
  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    if (chave && !el.open) el.showModal();
    if (!chave && el.open) el.close();
  }, [chave]);

  const conteudo = chave ? conteudoDe(chave, dados) : null;

  return (
    <AbrirModal.Provider value={abrir}>
      {children}

      <dialog
        ref={dialogo}
        aria-labelledby="titulo-modal-perfil"
        onClose={fechar}
        // Clique no fundo escuro (fora do cartão) fecha, como no protótipo.
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
        className="m-auto w-[calc(100%-40px)] max-w-[440px] rounded-[24px] border-0 bg-white p-0 shadow-[0_24px_60px_rgba(10,31,78,.3)] backdrop:bg-[rgba(10,31,78,.48)]"
      >
        {conteudo ? (
          <div className="px-7 pb-6 pt-7">
            <div className="mb-3 flex items-center gap-[14px]">
              {conteudo.icone ? (
                <Image
                  src={conteudo.icone}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 flex-none object-contain"
                />
              ) : null}
              <h2
                id="titulo-modal-perfil"
                className="m-0 text-[25px] font-black tracking-[-0.01em] text-navy"
              >
                {conteudo.titulo}
              </h2>
            </div>

            <p className="m-0 mb-[18px] text-[17px] leading-[1.45] text-[#5B6B7F]">
              {conteudo.texto}
            </p>

            {conteudo.extra}

            <div className="flex flex-wrap gap-2.5">
              {conteudo.principal ?? (
                <button type="button" onClick={fechar} className={BOTAO_PRINCIPAL}>
                  Entendi
                </button>
              )}
              <button type="button" onClick={fechar} className={BOTAO_FECHAR}>
                Fechar
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </AbrirModal.Provider>
  );
}

/**
 * Qualquer coisa clicável que abre o modal (linhas, botão da câmera, "Ver plano").
 * É um `<button>` de verdade: o protótipo usava `<div onClick>`, que teclado e
 * leitor de tela não alcançam.
 */
export function AbreModal({
  chave,
  className,
  children,
  'aria-label': rotulo,
  enviaSemModal = false,
}: {
  chave: ChaveDoModal;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  /**
   * Botão de envio do `<form>` em volta (o "Sair"). Com o app hidratado, o
   * clique só abre o modal de confirmação; se o JavaScript da página não
   * carregou (ou o modal não existe), o clique envia o formulário e a ação
   * roda do mesmo jeito. Sem isso, o "Sair" ficava mudo e a sessão aberta.
   */
  enviaSemModal?: boolean;
}) {
  const abrir = useContext(AbrirModal);
  return (
    <button
      type={enviaSemModal ? 'submit' : 'button'}
      aria-haspopup="dialog"
      aria-label={rotulo}
      onClick={(e) => {
        if (!abrir) return;
        if (enviaSemModal) e.preventDefault();
        abrir(chave);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
