/**
 * `/admin/midia/pendencias` — o que ainda falta de mídia em cada aula.
 *
 * Por aula: espaços de ilustração sem imagem (blocos `image`/`profile` e itens
 * de `cards`/`steps`), capa ausente e vídeo ausente — cada item com o link
 * direto para a aba que resolve. **Só leitura**, calculada na hora a partir do
 * conteúdo publicado e do rascunho (`@/lib/admin/pendencias`); não existe
 * tabela de pendências para ficar desatualizada.
 *
 * ⚠️ Placeholder não é defeito: a aula funciona sem imagem (o aluno vê o quadro
 * desenhado). Esta tela é o checklist de produção, não um bloqueio.
 *
 * O filtro viaja na URL (`?mostrar=ilustracoes`), como na biblioteca: a lista
 * "aulas sem vídeo" é um link que se manda para outra pessoa.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ROTULO_DO_ESPACO,
  aulaCompleta,
  carregarPendenciasDeMidia,
  emEdicao,
  type EspacoSemImagem,
  type PanoramaDePendencias,
  type PendenciasDaAula,
} from '@/lib/admin/pendencias';

export const metadata: Metadata = { title: 'Pendências de mídia' };
export const dynamic = 'force-dynamic';

type Busca = Record<string, string | string[] | undefined>;

const FILTROS = [
  { id: 'pendentes', rotulo: 'Com pendência' },
  { id: 'ilustracoes', rotulo: 'Ilustrações sem imagem' },
  { id: 'capa', rotulo: 'Sem capa' },
  { id: 'video', rotulo: 'Sem vídeo' },
  { id: 'todas', rotulo: 'Todas as aulas' },
] as const;

type Filtro = (typeof FILTROS)[number]['id'];

function lerFiltro(busca: Busca): Filtro {
  const bruto = Array.isArray(busca.mostrar) ? busca.mostrar[0] : busca.mostrar;
  return FILTROS.find((filtro) => filtro.id === bruto)?.id ?? 'pendentes';
}

function passa(aula: PendenciasDaAula, filtro: Filtro): boolean {
  switch (filtro) {
    case 'todas':
      return true;
    case 'ilustracoes':
      return emEdicao(aula).length > 0;
    case 'capa':
      return aula.semCapa;
    case 'video':
      return aula.semVideo;
    case 'pendentes':
      return !aulaCompleta(aula);
  }
}

async function carregar(): Promise<PanoramaDePendencias | null> {
  try {
    return await carregarPendenciasDeMidia();
  } catch (erro: unknown) {
    const motivo = erro instanceof Error ? erro.message : 'erro desconhecido';
    console.error(`[painel] pendências de mídia sem banco: ${motivo}`);
    return null;
  }
}

// ─────────────────────────────── peças da tela ───────────────────────────────

function Degradado() {
  return (
    <div
      className="rounded-card border border-solid p-5"
      style={{ background: '#FEF0F2', borderColor: '#F9D3D9' }}
    >
      <p className="m-0 text-[15px] font-extrabold leading-snug" style={{ color: '#B21F31' }}>
        As pendências não puderam ser calculadas.
      </p>
      <p className="m-0 mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#B21F31' }}>
        O banco de dados não respondeu. Nada foi alterado; recarregue a página em alguns
        instantes. O detalhe técnico está no log do servidor.
      </p>
    </div>
  );
}

function Contador({
  rotulo,
  valor,
  href,
  destaque = false,
  ativo = false,
}: {
  rotulo: string;
  valor: string;
  href: string;
  destaque?: boolean;
  ativo?: boolean;
}) {
  const base = destaque ? 'border-[#F6D9A8] bg-[#FFF7E8]' : 'border-border bg-bg';
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      className={`block rounded-field border-[1.5px] px-4 py-3 no-underline transition-colors hover:border-blue hover:bg-[#EAF2FE] ${base} ${
        ativo ? 'outline outline-2 outline-offset-2 outline-blue' : ''
      }`}
    >
      <span className="block text-[22px] font-black leading-none tracking-[-0.02em] text-navy">
        {valor}
      </span>
      <span className="mt-1 block text-[13px] font-bold leading-snug text-muted">{rotulo}</span>
    </Link>
  );
}

function Selo({ children, tom }: { children: React.ReactNode; tom: 'alerta' | 'ok' | 'neutro' }) {
  const estilo =
    tom === 'alerta'
      ? { background: '#FFF7E8', color: '#6B520A' }
      : tom === 'ok'
        ? { background: '#E4F5EA', color: '#136B45' }
        : { background: '#EEF3FA', color: '#4A5B78' };
  return (
    <span
      className="inline-flex flex-none items-center rounded-pill px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.08em]"
      style={estilo}
    >
      {children}
    </span>
  );
}

const CLASSE_DO_LINK =
  'inline-flex h-9 items-center justify-center rounded-pill border-[1.5px] border-border bg-surface px-3.5 text-[13px] font-extrabold tracking-[0.02em] text-navy no-underline transition-colors hover:border-blue hover:bg-[#EAF2FE]';

function descreverEspaco(espaco: EspacoSemImagem): string {
  const onde = `Página ${espaco.pagina}`;
  const oque =
    espaco.item !== null
      ? `${ROTULO_DO_ESPACO[espaco.tipo]} ${espaco.item}`
      : ROTULO_DO_ESPACO[espaco.tipo];
  return `${onde} · ${oque}`;
}

function ListaDeEspacos({ espacos }: { espacos: EspacoSemImagem[] }) {
  return (
    <ul className="m-0 mt-3 flex list-none flex-col gap-1.5 p-0">
      {espacos.map((espaco, indice) => (
        <li
          key={`${espaco.pagina}-${espaco.id ?? indice}-${espaco.item ?? 0}`}
          className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-field border border-solid border-border px-3 py-2"
        >
          <span className="flex-none text-[13px] font-extrabold text-navy">
            {descreverEspaco(espaco)}
          </span>
          {espaco.id ? (
            <code className="flex-none text-[12px] font-bold text-muted-2">{espaco.id}</code>
          ) : null}
          {espaco.ph ? (
            <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-muted">
              {espaco.ph}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function CartaoDaAula({ aula }: { aula: PendenciasDaAula }) {
  const espacos = emEdicao(aula);
  const base = `/admin/aulas/${aula.numero}`;
  const completa = aulaCompleta(aula);
  // O publicado pode ter pendências que o rascunho já resolveu (ou o contrário).
  const diferencaDoPublicado =
    aula.rascunho !== null && aula.publicado.length !== aula.rascunho.length;

  return (
    <li className="rounded-card border border-solid border-border bg-surface p-4 lg:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="kicker m-0">{aula.codigo}</span>
        <h2 className="m-0 min-w-0 flex-1 text-[16px] font-black leading-tight tracking-[-0.01em] text-navy">
          {aula.titulo}
        </h2>
        {completa ? <Selo tom="ok">Completa</Selo> : null}
        {!aula.publicada ? <Selo tom="neutro">Não publicada</Selo> : null}
        {aula.temRascunho ? <Selo tom="neutro">Rascunho em edição</Selo> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {espacos.length > 0 ? (
          <Selo tom="alerta">
            {espacos.length} {espacos.length === 1 ? 'ilustração sem imagem' : 'ilustrações sem imagem'}
          </Selo>
        ) : null}
        {aula.semCapa ? <Selo tom="alerta">Sem capa</Selo> : null}
        {aula.semVideo ? <Selo tom="alerta">Sem vídeo</Selo> : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`${base}?aba=paginas`} className={CLASSE_DO_LINK}>
          {espacos.length > 0 ? 'Pôr imagens nos blocos' : 'Abrir páginas'}
        </Link>
        <Link href={`${base}?aba=dados`} className={CLASSE_DO_LINK}>
          {aula.semCapa ? 'Definir capa' : 'Trocar capa'}
        </Link>
        <Link href={`${base}?aba=video`} className={CLASSE_DO_LINK}>
          {aula.semVideo ? 'Anexar vídeo' : 'Trocar vídeo'}
        </Link>
      </div>

      {espacos.length > 0 ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-[13px] font-extrabold text-link">
            Ver os {espacos.length} espaços {aula.rascunho !== null ? '(no rascunho)' : ''}
          </summary>
          <ListaDeEspacos espacos={espacos} />
        </details>
      ) : null}

      {diferencaDoPublicado ? (
        <p className="m-0 mt-2 text-[12px] font-semibold leading-snug text-muted-2">
          No conteúdo publicado são {aula.publicado.length}. O aluno só vê as imagens novas
          depois que o rascunho for publicado.
        </p>
      ) : null}
    </li>
  );
}

// ───────────────────────────────────── tela ──────────────────────────────────

export default async function TelaDePendenciasDeMidia({
  searchParams,
}: {
  // ⚠️ Next 16: `searchParams` chega como Promise.
  searchParams: Promise<Busca>;
}) {
  const filtro = lerFiltro(await searchParams);
  const panorama = await carregar();
  const aulas = panorama ? panorama.aulas.filter((aula) => passa(aula, filtro)) : [];

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker m-0">
          <Link href="/admin/midia" className="text-inherit no-underline hover:underline">
            Mídia
          </Link>
        </p>
        <h1 className="m-0 mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-navy">
          Pendências de mídia
        </h1>
        <p className="m-0 mt-1.5 max-w-[70ch] text-[14px] font-semibold leading-snug text-muted">
          O que falta de imagem e de vídeo em cada aula: espaços de ilustração sem imagem, capa e
          vídeo. A lista é calculada na hora a partir do conteúdo (o rascunho, quando existe).
          Ao pôr a imagem no bloco e salvar, o item some daqui. Espaço sem imagem não quebra a
          aula: o aluno vê o quadro desenhado até a imagem chegar.
        </p>
      </header>

      {panorama === null ? (
        <Degradado />
      ) : (
        <>
          <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Contador
                rotulo="Aulas com pendência"
                valor={`${panorama.totais.aulas - panorama.totais.completas}/${panorama.totais.aulas}`}
                href="/admin/midia/pendencias?mostrar=pendentes"
                ativo={filtro === 'pendentes'}
              />
              <Contador
                rotulo="Ilustrações sem imagem"
                valor={String(panorama.totais.ilustracoes)}
                href="/admin/midia/pendencias?mostrar=ilustracoes"
                destaque={panorama.totais.ilustracoes > 0}
                ativo={filtro === 'ilustracoes'}
              />
              <Contador
                rotulo="Aulas sem capa"
                valor={String(panorama.totais.semCapa)}
                href="/admin/midia/pendencias?mostrar=capa"
                destaque={panorama.totais.semCapa > 0}
                ativo={filtro === 'capa'}
              />
              <Contador
                rotulo="Aulas sem vídeo"
                valor={String(panorama.totais.semVideo)}
                href="/admin/midia/pendencias?mostrar=video"
                destaque={panorama.totais.semVideo > 0}
                ativo={filtro === 'video'}
              />
              <Contador
                rotulo="Todas as aulas"
                valor={String(panorama.totais.aulas)}
                href="/admin/midia/pendencias?mostrar=todas"
                ativo={filtro === 'todas'}
              />
            </div>
          </section>

          {aulas.length === 0 ? (
            <section className="rounded-card bg-surface p-5 shadow-card lg:p-6">
              <p className="m-0 text-[14px] font-semibold leading-snug text-muted">
                Nenhuma aula neste filtro. {filtro !== 'todas' ? 'Nada pendente aqui.' : ''}
              </p>
            </section>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {aulas.map((aula) => (
                <CartaoDaAula key={aula.id} aula={aula} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
