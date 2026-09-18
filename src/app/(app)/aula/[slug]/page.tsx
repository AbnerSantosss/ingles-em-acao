/**
 * O leitor da aula. Server Component: confere a sessão, carrega a aula
 * **publicada** e as respostas/progresso do banco, e entrega tudo pronto ao
 * cliente — que a partir daí vira páginas sem ir ao servidor de novo.
 *
 * A aula inteira vai junto de propósito: são 5 a 12 páginas, e paginar pelo
 * servidor trocaria uma virada instantânea por um ida-e-volta de rede a cada
 * toque, em troca de alguns quilobytes.
 *
 * ⚠️ **A porta de leitura é `@/lib/content/publicado`, não `content/lessons`.**
 * É ela que aplica as três regras: linha publicada manda; linha inexistente cai
 * no conteúdo estático; linha despublicada ou arquivada é 404 — nunca um
 * silencioso retorno ao estático, que faria "despublicar" não despublicar nada.
 */
import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LeitorDaAula } from '@/components/lesson/LeitorDaAula';
import { PainelDeVideo } from '@/components/lesson/PainelDeVideo';
import { ProvedorPersistente } from '@/components/lesson/interacao';
import { lerLinksDeCompra } from '@/lib/admin/settings';
import { requireUser } from '@/lib/auth/session';
import { carregarAulaPublicadaPorSlug } from '@/lib/content/publicado';
import { carregarProgressoDaAula, carregarRespostasDaAula } from '@/lib/lesson/respostas';
import { ID_DA_VIDEOAULA, planoVeVideoaula } from '@/lib/video/acesso';
import { renovarVideoDaAulaAction } from '@/lib/video/acoes';
import { assinarVideoEnviado, carregarVideoDaAula } from '@/lib/video/aula';

import { concluirAulaAction, salvarPaginaAction, salvarRespostaAction } from './actions';

/** ⚠️ Next 16: `params` chega como Promise e precisa de `await`. */
type ParametrosDaAula = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

/**
 * A mesma aula serve ao `generateMetadata` e à página.
 *
 * `cache()` memoiza dentro da requisição: sem ele, a leitura (que agora vai ao
 * banco) aconteceria duas vezes por render.
 */
const carregarAula = cache(carregarAulaPublicadaPorSlug);

export async function generateMetadata({ params }: ParametrosDaAula): Promise<Metadata> {
  const { slug } = await params;
  const publicada = await carregarAula(slug);
  return {
    title: publicada
      ? `${publicada.resumo.code} — ${publicada.resumo.title}`
      : 'Aula não encontrada',
  };
}

export default async function AulaPage({ params }: ParametrosDaAula) {
  const usuario = await requireUser();

  const { slug } = await params;
  const publicada = await carregarAula(slug);

  // Slug inexistente, aula despublicada, arquivada ou com conteúdo inválido:
  // 404 de verdade, não uma tela vazia nem uma aula quebrada.
  if (publicada === null) notFound();

  const { aula, resumo } = publicada;

  // Links de compra: nunca jogam (sem banco, os botões de compra só somem).
  const [respostas, progresso, video, compra] = await Promise.all([
    carregarRespostasDaAula(usuario.id, aula.id),
    carregarProgressoDaAula(usuario.id, aula.id, aula.pages.length),
    carregarVideoDaAula(aula.id),
    lerLinksDeCompra(),
  ]);

  // Arquivo enviado: o link de 15 minutos é assinado aqui, e **só** para quem
  // tem a videoaula no plano (§4.3). O Essencial recebe a chamada de upgrade
  // sem que endereço nenhum chegue ao HTML dele.
  const linkDoArquivo =
    video?.fonte.kind === 'upload' && planoVeVideoaula(usuario.plan)
      ? await assinarVideoEnviado(video.fonte.assetId)
      : null;

  // O painel aparece? Arquivo enviado que não conseguiu link some para quem tem
  // o plano (o painel devolve null) — e aí o `cta` não pode mandar o aluno para
  // um player que não está na tela.
  const videoNaTela =
    video !== null &&
    (video.fonte.kind !== 'upload' || !planoVeVideoaula(usuario.plan) || linkDoArquivo !== null);

  // Aula concluída abre do começo — REVISAR no resultado e a trilha levam à
  // página 1, como no design do Claude Designer (`onReviewLesson` → page: 0).
  // A concluída grava `currentPage` na última página; retomar de onde parou
  // só vale para aula em andamento.
  const paginaInicial = progresso.status === 'COMPLETED' ? 0 : progresso.currentPage;

  // Coluna do leitor (design do Claude Designer): 820px com 20px de respiro de
  // cada lado — 780px de conteúdo. A `.tela` do layout já dá os 20px no
  // desktop, então aqui só se estreita e centraliza. No celular, nada muda.
  return (
    <div className="lg:mx-auto lg:max-w-[780px]">
      {/*
        Videoaula desta aula (BACKOFFICE §2.6). Aula sem vídeo não mostra nada;
        quem não tem o Plano Completo recebe a chamada de upgrade em vez do
        player — as duas regras moram no próprio painel.
      */}
      {video ? (
        <div id={ID_DA_VIDEOAULA} className="mb-4 scroll-mt-4">
          <PainelDeVideo
            fonte={video.fonte}
            plano={usuario.plan}
            legenda={`${resumo.code} · ${resumo.title}`}
            titulo={`Videoaula — ${resumo.code}: ${resumo.title}`}
            arquivo={
              linkDoArquivo
                ? { inicial: linkDoArquivo, renovar: renovarVideoDaAulaAction.bind(null, aula.id) }
                : undefined
            }
            linkDeCompra={compra.COMPLETO}
          />
        </div>
      ) : null}

      <ProvedorPersistente
        iniciais={respostas.valores}
        conferidos={respostas.conferidos}
        salvar={salvarRespostaAction.bind(null, slug)}
      >
        <LeitorDaAula
          aula={aula}
          slug={slug}
          tempo={resumo.time}
          paginaInicial={paginaInicial}
          plano={usuario.plan}
          temVideoaula={videoNaTela}
          linksDeCompra={compra}
          aoVirarPagina={salvarPaginaAction.bind(null, slug)}
          aoConcluir={concluirAulaAction.bind(null, slug)}
        />
      </ProvedorPersistente>
    </div>
  );
}
