/**
 * A aba "Vídeo" de uma aula — o mesmo editor de `/admin/videos`, só que já
 * aberto nesta aula: colar link (YouTube, Vimeo, .mp4/.webm por https) ou
 * enviar o arquivo ao armazenamento, com o quadro de especificações antes.
 *
 * ⚠️ Não há segunda implementação: é o `EditorDeVideo` da tela de vídeos, com as
 * mesmas Server Actions, a mesma allowlist e a mesma pré-visualização (o player
 * do aluno). Mudou lá, muda aqui.
 */
import Link from 'next/link';

import type { AulaDoPainel } from '@/lib/admin/aulas';
import { formatarBytes } from '@/lib/media/tipos';
import { listarVideosDasAulas } from '@/lib/video/aula';
import { estadoDoEnvioDeVideo } from '@/lib/video/bucket';
import { descreverFonte } from '@/lib/video/fonte';

import { EditorDeVideo } from '../../videos/EditorDeVideo';

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        {children}
      </p>
    </div>
  );
}

export async function AbaDeVideo({ aula }: { aula: AulaDoPainel }) {
  if (aula.estado === 'arquivada') {
    return (
      <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
        Esta aula está arquivada. Restaure-a na aba Dados antes de mexer no vídeo.
      </p>
    );
  }

  const linhas = await listarVideosDasAulas();
  if (linhas === null) {
    return (
      <Aviso>
        O vídeo desta aula não pôde ser carregado: o banco de dados não respondeu. Nada foi
        alterado; recarregue a página em alguns instantes.
      </Aviso>
    );
  }

  const linha = linhas.find((item) => item.id === aula.id);
  if (!linha) {
    return <Aviso>Esta aula não aparece na lista de vídeos. Recarregue a página.</Aviso>;
  }

  const envio = estadoDoEnvioDeVideo();
  const atual = linha.fonte
    ? linha.fonte.kind === 'upload'
      ? linha.arquivo
        ? `Arquivo enviado · ${linha.arquivo.nome} (${formatarBytes(linha.arquivo.bytes)})`
        : 'Arquivo enviado · registro não encontrado'
      : descreverFonte(linha.fonte)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="m-0 text-[17px] font-black tracking-[-0.01em] text-navy">Videoaula</h2>
        <p className="m-0 mt-1.5 max-w-[62ch] text-[14px] font-semibold leading-snug text-muted">
          {atual
            ? `Hoje: ${atual}${linha.padrao ? ' (vídeo padrão)' : ''}.`
            : 'Esta aula ainda não tem vídeo.'}{' '}
          O vídeo vale na hora, sem publicar a aula de novo. O vídeo padrão e a visão das 42 aulas
          ficam em{' '}
          <Link href="/admin/videos" className="font-extrabold text-link underline">
            Painel · Vídeos
          </Link>
          .
        </p>
      </div>

      <EditorDeVideo
        aula={{
          id: linha.id,
          code: linha.code,
          title: linha.title,
          fonte: linha.fonte,
          refBruta: linha.refBruta,
          invalida: linha.invalida,
          padrao: linha.padrao,
          legada: linha.legada,
        }}
        envio={envio}
      />
    </div>
  );
}

export default AbaDeVideo;
