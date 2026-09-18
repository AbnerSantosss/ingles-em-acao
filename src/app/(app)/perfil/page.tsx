/**
 * `/perfil` — réplica do `<sc-if value="{{ isProfile }}">` do design (Claude
 * Designer): cartão de apresentação com avatar, quatro números, e duas colunas
 * (Configurações da conta + Apagar progresso | Seu plano + Seu aprendizado + Sair).
 * No fim, fora do design original, a zona de risco "Excluir minha conta"
 * (`./ExcluirConta.tsx`, LGPD).
 *
 * Toda linha abre o modal de informação (`./modal.tsx`), como no protótipo. O que
 * tem backend faz a coisa real lá dentro; o resto diz "em breve".
 *
 * ⚠️ O design usava 1160px; aqui o conteúdo fica dentro da coluna `.tela`
 * (1024px no desktop, 460px no celular). As grades usam `auto-fit` com
 * `min(..., 100%)` para não estourar a 375px.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { ExcluirConta } from '@/app/(app)/perfil/ExcluirConta';
import { AbreModal, ProvedorDoModal, type ChaveDoModal } from '@/app/(app)/perfil/modal';
import { lerLinksDeCompra } from '@/lib/admin/settings';
import { requireUser, type SessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getStreak, getUserProgress, rotuloDeSequencia } from '@/lib/progress';
import { iniciaisDe } from '@/lib/ui/iniciais';

export const metadata: Metadata = { title: 'Perfil' };
export const dynamic = 'force-dynamic';

/** ⚠️ Next 16: `searchParams` chega como Promise. */
type PerfilProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const NOME_DO_PLANO: Record<SessionUser['plan'], string> = {
  ESSENCIAL: 'Plano Essencial',
  COMPLETO: 'Plano Completo',
  PREMIUM: 'Plano Premium',
};

const DESCRICAO_DO_PLANO: Record<SessionUser['plan'], string> = {
  ESSENCIAL: 'E-book completo das 42 aulas e exercícios interativos.',
  COMPLETO: 'Tudo do Essencial mais as videoaulas de cada aula.',
  PREMIUM: 'Tudo do Completo mais a prática oral com o professor de IA.',
};

/** O degrau seguinte de cada plano. O Premium não tem para onde subir. */
const PROXIMO_PLANO: Record<SessionUser['plan'], 'COMPLETO' | 'PREMIUM' | null> = {
  ESSENCIAL: 'COMPLETO',
  COMPLETO: 'PREMIUM',
  PREMIUM: null,
};

type Linha = { chave: ChaveDoModal; icone: string; titulo: string; descricao: string };

const LINHAS_DA_CONTA: Linha[] = [
  { chave: 'edit', icone: 'perfil', titulo: 'Editar perfil', descricao: 'Altere seu nome e informações pessoais' },
  { chave: 'photo', icone: 'camera', titulo: 'Trocar foto', descricao: 'Escolha uma nova foto de perfil' },
  { chave: 'senha', icone: 'cadeado', titulo: 'Alterar senha', descricao: 'Mantenha sua conta segura' },
  { chave: 'email', icone: 'email', titulo: 'E-mail e segurança', descricao: 'Gerencie seu e-mail e verificação em duas etapas' },
  { chave: 'notif', icone: 'sino', titulo: 'Notificações', descricao: 'Escolha o que você quer receber' },
  { chave: 'idioma', icone: 'globo', titulo: 'Idioma do app', descricao: 'Defina o idioma da interface' },
  { chave: 'privacidade', icone: 'escudo', titulo: 'Privacidade', descricao: 'Gerencie seus dados e privacidade' },
];

const LINHAS_DO_APRENDIZADO: Linha[] = [
  { chave: 'metas', icone: 'alvo', titulo: 'Metas de estudo', descricao: 'Defina seu objetivo e mantenha o foco' },
  { chave: 'lembretes', icone: 'relogio', titulo: 'Lembretes de estudo', descricao: 'Nunca perca o ritmo' },
  { chave: 'conquistas', icone: 'trofeu', titulo: 'Minhas conquistas', descricao: 'Veja seus badges e marcos' },
  { chave: 'certificado', icone: 'certificado', titulo: 'Baixar certificado', descricao: 'Comprove seu progresso' },
];

/* Medidas repetidas do design. */
const CARTAO = 'rounded-[20px] bg-white px-6 py-[22px] shadow-[0_6px_22px_rgba(11,31,75,.05)]';
const FOCO = 'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue';

function primeiroNome(nome: string): string {
  const limpo = nome.trim();
  if (!limpo) return 'aluno(a)';
  return limpo.split(/\s+/)[0] ?? limpo;
}

/** Quantas respostas de exercício o aluno já gravou. `null` se o banco falhar — nunca um número inventado. */
async function contarRespostas(userId: string): Promise<number | null> {
  try {
    return await prisma.exerciseAnswer.count({ where: { userId } });
  } catch {
    return null;
  }
}

function Seta({ cor = '#9BA9BC' }: { cor?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function LinhaDoCartao({ chave, icone, titulo, descricao }: Linha) {
  return (
    <AbreModal
      chave={chave}
      className={`flex w-full cursor-pointer items-center gap-4 border-0 border-t border-solid border-[#EEF2F8] bg-transparent px-1 py-[15px] text-left ${FOCO}`}
    >
      <Image
        src={`/icons/${icone}.png`}
        alt=""
        width={34}
        height={34}
        className="size-[34px] flex-none object-contain"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[18px] font-extrabold text-navy">{titulo}</span>
        <span className="block text-[15px] text-[#6B7C90]">{descricao}</span>
      </span>
      <Seta />
    </AbreModal>
  );
}

function CabecalhoDoCartao({
  icone,
  titulo,
  descricao,
  margem = 'mb-1.5',
}: {
  icone: ReactNode;
  titulo: string;
  descricao: string;
  margem?: string;
}) {
  return (
    <div className={`flex items-center gap-[14px] ${margem}`}>
      <div className="grid size-[54px] flex-none place-items-center rounded-[15px] bg-[#E8F0FB]">
        {icone}
      </div>
      <div>
        <h2 className="m-0 text-[23px] font-black tracking-[-0.01em] text-navy">{titulo}</h2>
        <p className="m-0 text-[16px] text-[#5B6B7F]">{descricao}</p>
      </div>
    </div>
  );
}

function Numero({
  fundo,
  borda,
  fundoIcone,
  cor,
  corRotulo,
  icone,
  valor,
  rotulo,
  apoio,
}: {
  fundo: string;
  borda: string;
  fundoIcone: string;
  cor: string;
  corRotulo: string;
  icone: ReactNode;
  valor: ReactNode;
  rotulo: string;
  apoio: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-[18px] border border-solid px-5 py-[18px]"
      style={{ background: fundo, borderColor: borda }}
    >
      <div
        className="grid size-14 flex-none place-items-center rounded-[15px]"
        style={{ background: fundoIcone }}
      >
        {icone}
      </div>
      <div className="min-w-0">
        <p className="m-0 text-[28px] font-black leading-[1.05]" style={{ color: cor }}>
          {valor}
        </p>
        <p
          className="m-0 mt-1 text-[13px] font-extrabold leading-[1.3] tracking-[0.07em]"
          style={{ color: corRotulo }}
        >
          {rotulo}
        </p>
        <p className="m-0 mt-1 text-[14px] leading-[1.35] text-[#6B7C90]">{apoio}</p>
      </div>
    </div>
  );
}

export default async function PerfilPage({ searchParams }: PerfilProps) {
  const usuario = await requireUser();
  const [progresso, sequencia, respostas, parametros, compra] = await Promise.all([
    getUserProgress(usuario.id),
    getStreak(usuario.id),
    contarRespostas(usuario.id),
    searchParams,
    lerLinksDeCompra(usuario.id),
  ]);

  // Convite para o próximo plano, com o link que o painel configurou para ele.
  // Sem link (nem o do plano, nem o global), o convite não aparece.
  const proximoPlano = PROXIMO_PLANO[usuario.plan];
  const linkDoProximo = proximoPlano ? compra[proximoPlano] : null;

  const aviso = typeof parametros.aviso === 'string' ? parametros.aviso : '';
  const outrasEncerradas = aviso === 'sessoes-encerradas';
  // Foto local (`/uploads/...`) passa pelo otimizador; URL externa não tem
  // hostname liberado no next.config, então vai sem otimização em vez de quebrar.
  const fotoLocal = usuario.photoUrl?.startsWith('/') ?? false;

  return (
    // `key` pelo aviso: depois de "encerrar outras sessões" o redirect volta
    // para cá, e o modal precisa remontar fechado para o aviso aparecer.
    <ProvedorDoModal
      key={aviso}
      dados={{
        nome: usuario.name,
        email: usuario.email,
        emailConfirmado: Boolean(usuario.emailVerifiedAt),
        temFoto: Boolean(usuario.photoUrl),
        nomeDoPlano: NOME_DO_PLANO[usuario.plan],
        descricaoDoPlano: DESCRICAO_DO_PLANO[usuario.plan],
        proximoPlano:
          proximoPlano && linkDoProximo
            ? { nome: NOME_DO_PLANO[proximoPlano], link: linkDoProximo }
            : null,
        aulasFeitas: progresso.done,
        totalDeAulas: progresso.total,
      }}
    >
      <div className="flex flex-col gap-4">
        {outrasEncerradas ? (
          <p
            role="status"
            className="m-0 rounded-[18px] border-[1.5px] border-solid border-[#CFEFDF] bg-[#EAF7F1] px-[22px] py-4 text-[16px] font-bold text-[#136B45]"
          >
            Pronto: as outras sessões foram encerradas. Este aparelho continua conectado.
          </p>
        ) : null}

        {/* Apresentação: avatar + saudação + frase manuscrita. */}
        <section className="flex flex-wrap items-center gap-[34px] rounded-[22px] bg-white px-[34px] py-[30px] shadow-[0_6px_22px_rgba(11,31,75,.05)]">
          <div className="relative size-[158px] flex-none">
            <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-full border-[7px] border-solid border-[#E8F0FB] bg-navy">
              {usuario.photoUrl ? (
                <Image
                  src={usuario.photoUrl}
                  alt=""
                  width={144}
                  height={144}
                  unoptimized={!fotoLocal}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="text-[46px] font-black text-[#F6C945]">
                  {iniciaisDe(usuario.name)}
                </span>
              )}
            </div>
            <AbreModal
              chave="photo"
              aria-label="Trocar foto"
              className={`absolute bottom-2 right-1.5 size-12 cursor-pointer rounded-full border-4 border-solid border-white bg-white p-1.5 shadow-[0_4px_12px_rgba(11,31,75,.18)] ${FOCO}`}
            >
              <Image
                src="/icons/camera.png"
                alt=""
                width={28}
                height={28}
                className="size-full object-contain"
              />
            </AbreModal>
          </div>

          <div className="min-w-[min(260px,100%)] flex-1">
            <h1 className="m-0 mb-1.5 text-[36px] font-black tracking-[-0.02em] text-navy">
              Olá, {primeiroNome(usuario.name)}! 👋
            </h1>
            <p className="m-0 mb-[14px] text-[19px] font-bold text-[#1F3A6E]">
              {NOME_DO_PLANO[usuario.plan]} — Inglês em Ação
            </p>
            <p className="m-0 text-[18px] leading-[1.45] text-[#5B6B7F] text-pretty">
              Continue firme na sua jornada. Cada pequeno passo te aproxima de grandes conquistas!
            </p>
          </div>

          <div aria-hidden="true" className="flex-none rotate-[-7deg] pr-2 text-center">
            <p className="manuscrito m-0 max-w-[230px] text-[31px] font-semibold leading-[1.15] text-[#1B3A6B]">
              Pequenos passos, grandes conquistas!
            </p>
            <svg width="200" height="18" viewBox="0 0 200 18" fill="none" className="mt-0.5">
              <path d="M6 12C48 4 150 2 194 9" stroke="#8FBEF5" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        {/* Os quatro números. */}
        <section
          aria-label="Seus números"
          className="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-[14px]"
        >
          <Numero
            fundo="#EAF7F1"
            borda="#D3EDE2"
            fundoIcone="#D6F0E5"
            cor="#0F8F7A"
            corRotulo="#0A1F4E"
            icone={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#0F8F7A" aria-hidden="true">
                <path d="M12 3 23 8.2 12 13.4 1 8.2 12 3Z" />
                <path d="M6 11.6V16c0 1.9 2.7 3.4 6 3.4s6-1.5 6-3.4v-4.4l-6 2.8-6-2.8Z" />
              </svg>
            }
            valor={progresso.done}
            rotulo="AULAS CONCLUÍDAS"
            apoio="Continue aprendendo!"
          />
          <Numero
            fundo="#F2EFFD"
            borda="#E3DCF9"
            fundoIcone="#E5DEFA"
            cor="#5B21B6"
            corRotulo="#5B21B6"
            icone={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#5B21B6" aria-hidden="true">
                <path
                  d="M6 2.5h8.5L19.5 7.5V21a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 21V4A1.5 1.5 0 0 1 6 2.5Z"
                  opacity=".35"
                />
                <rect x="7.5" y="9" width="9" height="1.9" rx=".95" />
                <rect x="7.5" y="13" width="9" height="1.9" rx=".95" />
                <rect x="7.5" y="17" width="6" height="1.9" rx=".95" />
              </svg>
            }
            valor={respostas ?? '—'}
            rotulo="EXERCÍCIOS RESPONDIDOS"
            apoio="Suas anotações estão seguras."
          />
          <Numero
            fundo="#FEF7E0"
            borda="#F8E7B4"
            fundoIcone="#FBEFC6"
            cor="#E39C10"
            corRotulo="#0A1F4E"
            icone={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#E39C10" aria-hidden="true">
                <rect x="3.5" y="12" width="4.4" height="8.5" rx="1.6" />
                <rect x="9.8" y="7" width="4.4" height="13.5" rx="1.6" />
                <rect x="16.1" y="3.5" width="4.4" height="17" rx="1.6" />
              </svg>
            }
            valor={`${progresso.pct}%`}
            rotulo="DA TRILHA"
            apoio="Muito bem! Vamos em frente!"
          />
          <Numero
            fundo="#EAF2FE"
            borda="#D6E5FB"
            fundoIcone="#DCE9FC"
            cor="#1B6BE3"
            corRotulo="#0A1F4E"
            icone={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#1B6BE3" aria-hidden="true">
                <path d="M13 2c.6 3.2-1.1 4.8-2.7 6.3C8.6 9.9 7 11.4 7 14.3A5.9 5.9 0 0 0 12.9 20 5.9 5.9 0 0 0 19 14.3c0-4-2.3-6.4-4.1-8.1C13.9 5.3 13.2 3.9 13 2Z" />
              </svg>
            }
            valor={rotuloDeSequencia(sequencia)}
            rotulo="SEQUÊNCIA"
            apoio="Todo dia conta!"
          />
        </section>

        {/* Duas colunas: conta à esquerda, plano e aprendizado à direita. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] items-start gap-4">
          <div className="flex flex-col gap-4">
            <section className={CARTAO}>
              <CabecalhoDoCartao
                icone={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1B4FA8" aria-hidden="true">
                    <path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm9 3.4c0-.6-.05-1.15-.14-1.7l2.02-1.5-2.1-3.63-2.35.98a8.9 8.9 0 0 0-2.94-1.7L15.2 1.8h-4.2l-.3 2.65a8.9 8.9 0 0 0-2.94 1.7l-2.35-.98-2.1 3.63 2.02 1.5c-.09.55-.14 1.1-.14 1.7s.05 1.15.14 1.7l-2.02 1.5 2.1 3.63 2.35-.98a8.9 8.9 0 0 0 2.94 1.7l.3 2.65h4.2l.3-2.65a8.9 8.9 0 0 0 2.94-1.7l2.35.98 2.1-3.63-2.02-1.5c.09-.55.14-1.1.14-1.7Z" />
                  </svg>
                }
                titulo="Configurações da conta"
                descricao="Gerencie suas informações e preferências."
              />
              {LINHAS_DA_CONTA.map((linha) => (
                <LinhaDoCartao key={linha.chave} {...linha} />
              ))}
            </section>

            <AbreModal
              chave="apagar"
              className={`flex w-full cursor-pointer items-center gap-4 rounded-[18px] border-[1.5px] border-solid border-[#F9D3D9] bg-[#FEF0F2] px-[22px] py-4 text-left ${FOCO}`}
            >
              <Image
                src="/icons/lixeira.png"
                alt=""
                width={36}
                height={36}
                className="size-9 flex-none object-contain"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-extrabold tracking-[0.03em] text-[#E03B4C]">
                  APAGAR PROGRESSO
                </span>
                <span className="block text-[15px] text-[#C4606C]">
                  Zera suas aulas e exercícios; a conta continua.
                </span>
              </span>
              <Seta cor="#E03B4C" />
            </AbreModal>
          </div>

          <div className="flex flex-col gap-4">
            <section className={CARTAO}>
              <CabecalhoDoCartao
                margem="mb-4"
                icone={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1F4E" aria-hidden="true">
                    <path d="M3 7.5 7.2 11 12 4.5 16.8 11 21 7.5 19.2 18H4.8L3 7.5Z" />
                  </svg>
                }
                titulo="Seu plano"
                descricao="Aproveite todos os recursos do Inglês em Ação."
              />
              <div className="flex flex-wrap items-center gap-[18px] rounded-[16px] bg-[linear-gradient(100deg,#FEF6DC,#FBF3E6)] px-5 py-[18px]">
                <div className="grid size-[78px] flex-none place-items-center rounded-full bg-[#FBE29A]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#E39C10" aria-hidden="true">
                    <path d="M3 7.5 7.2 11 12 4.5 16.8 11 21 7.5 19.2 18H4.8L3 7.5Z" />
                  </svg>
                </div>
                <div className="min-w-[180px] flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2.5">
                    <span className="text-[20px] font-black text-navy">
                      {NOME_DO_PLANO[usuario.plan]}
                    </span>
                    <span className="rounded-pill bg-[#CFEFDF] px-[13px] py-[5px] text-[14px] font-extrabold text-[#136B45]">
                      Ativo
                    </span>
                  </div>
                  <p className="m-0 text-[16px] leading-[1.4] text-[#5B6B7F]">
                    {DESCRICAO_DO_PLANO[usuario.plan]}
                  </p>
                </div>
                <AbreModal
                  chave="plano"
                  className={`flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-pill border-0 bg-navy px-[22px] py-[14px] text-[17px] font-extrabold text-white hover:bg-[#123A86] ${FOCO}`}
                >
                  Ver plano
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12h15" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </AbreModal>
              </div>
            </section>

            <section className={CARTAO}>
              <CabecalhoDoCartao
                icone={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1B6BE3" aria-hidden="true">
                    <rect x="3.5" y="12" width="4.4" height="8" rx="1.6" />
                    <rect x="9.8" y="7" width="4.4" height="13" rx="1.6" />
                    <rect x="16.1" y="3.5" width="4.4" height="16.5" rx="1.6" />
                  </svg>
                }
                titulo="Seu aprendizado"
                descricao="Ferramentas para você evoluir ainda mais."
              />
              {LINHAS_DO_APRENDIZADO.map((linha) => (
                <LinhaDoCartao key={linha.chave} {...linha} />
              ))}
            </section>

            {/* O admin também estuda com a mesma conta; daqui ele volta ao painel. */}
            {usuario.role === 'ADMIN' ? (
              <Link
                href="/admin"
                className={`flex w-full items-center gap-4 rounded-[18px] bg-white px-[22px] py-4 text-left no-underline shadow-[0_6px_22px_rgba(11,31,75,.05)] ${FOCO}`}
              >
                <span className="grid size-9 flex-none place-items-center rounded-full bg-navy">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F6C945"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] font-extrabold text-navy">
                    Painel do administrador
                  </span>
                  <span className="block text-[15px] text-[#6B7C90]">
                    Aulas, alunos, vídeos e configurações.
                  </span>
                </span>
                <Seta />
              </Link>
            ) : null}

            <AbreModal
              chave="sair"
              className={`flex w-full cursor-pointer items-center gap-4 rounded-[18px] border-0 bg-white px-[22px] py-4 text-left shadow-[0_6px_22px_rgba(11,31,75,.05)] ${FOCO}`}
            >
              <Image
                src="/icons/sair.png"
                alt=""
                width={36}
                height={36}
                className="size-9 flex-none object-contain"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-extrabold text-navy">Sair</span>
                <span className="block text-[15px] text-[#6B7C90]">
                  Encerrar sua sessão no Inglês em Ação.
                </span>
              </span>
              <Seta />
            </AbreModal>
          </div>
        </div>

        {/* Zona de risco, sozinha no fim da página e fora das duas colunas. */}
        <ExcluirConta administrador={usuario.role === 'ADMIN'} />
      </div>
    </ProvedorDoModal>
  );
}
