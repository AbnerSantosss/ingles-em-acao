/**
 * As ilustrações da landing, em SVG inline: nitidez em qualquer tela e cores
 * tiradas dos tokens do app (`globals.css`). A única requisição de rede é o chapéu
 * do celular do hero (`public/brand/icone-chapeu.webp`); os fundos e a logo da
 * primeira dobra ficam em `Landing.tsx`.
 *
 * As decorativas levam `aria-hidden` — o texto ao lado já diz tudo. O retrato do
 * professor é a exceção: tem `role="img"` e rótulo, porque é conteúdo.
 */
import type { ReactNode } from 'react';

const NAVY = '#0A1F4E';
const NAVY_CLARO = '#123A86';
const AMARELO = '#F6C945';
const TEAL = '#12A594';
const AZUL = '#1B6BE3';
const MENTA = '#DFF3EC';
const BORDA = '#DCE6F2';
const FUNDO = '#F7F9FC';

/* ------------------------------------------------------------------ ícones */

const TRACOS: Record<string, ReactNode> = {
  livro: (
    <>
      <path d="M12 6.5C10.5 5.2 8.6 4.5 6.5 4.5H4v13h2.5c2.1 0 4 .7 5.5 2" />
      <path d="M12 6.5C13.5 5.2 15.4 4.5 17.5 4.5H20v13h-2.5c-2.1 0-4 .7-5.5 2" />
      <path d="M12 6.5v13" />
    </>
  ),
  microfone: (
    <>
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
    </>
  ),
  degraus: (
    <>
      <path d="M4 19h4v-5H4z" />
      <path d="M10 19h4V9h-4z" />
      <path d="M16 19h4V4h-4z" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7.4 7 9 4-1.6 7-5 7-9V6z" />
      <path d="M9 12.3 11 14.3 15 10" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  bussola: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-2 4-4 2 2-4z" />
    </>
  ),
  lapis: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  play: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  balao: (
    <>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </>
  ),
  grafico: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="m7 14 4-4 3 3 5-6" />
    </>
  ),
  porta: (
    <>
      <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
      <path d="M4 21h16" />
      <path d="M14 12h.01" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19 7" />,
};

export type NomeDoIcone = keyof typeof TRACOS;

/** Ícone decorativo num círculo. O rótulo textual sempre está ao lado. */
export function Icone({
  nome,
  className = 'bg-navy text-white',
  tamanho = 'size-11',
}: {
  nome: NomeDoIcone;
  className?: string;
  tamanho?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex ${tamanho} shrink-0 items-center justify-center rounded-pill ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[55%]"
      >
        {TRACOS[nome]}
      </svg>
    </span>
  );
}

/* --------------------------------------------------------- hero: celular */

/**
 * O celular do hero: a aula aberta, a lista "Eu consigo" e dois balões de fala.
 * É a promessa desenhada — o aluno falando de si mesmo depois das primeiras aulas.
 *
 * Vive sobre o fundo escuro da primeira dobra: aro amarelo atrás, aparelho quase
 * preto e o chapéu de formatura (`public/brand/icone-chapeu.webp`) flutuando no
 * canto superior direito.
 *
 * ⚠️ O aparelho e o aro passam de propósito do fim do `viewBox` (400): o corte reto
 * é coberto pela `OndaDoHero`, que sobe por cima do pé do celular. Se mudar a
 * altura do `viewBox`, confira a sobreposição (`-mt-10`) em `Landing.tsx`.
 *
 * ⚠️ O `id` do gradiente é fixo: este SVG só pode aparecer uma vez por página.
 */
export function CelularDaAula({ className }: { className?: string }) {
  const consigo = ['Me apresentar', 'Cumprimentar', 'Dizer de onde sou'];

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={className}
      fontFamily="var(--font-figtree), system-ui, sans-serif"
    >
      <defs>
        <linearGradient id="celular-tela" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NAVY_CLARO} />
          <stop offset="0.45" stopColor="#5E7FB8" />
          <stop offset="0.8" stopColor={FUNDO} />
        </linearGradient>
      </defs>

      {/* aro amarelo atrás do aparelho */}
      <circle cx="200" cy="270" r="186" fill="none" stroke={AMARELO} strokeWidth="3" />

      {/* aparelho */}
      <rect x="103" y="18" width="194" height="470" rx="36" fill="#2A3F78" />
      <rect x="106" y="21" width="188" height="464" rx="33" fill="#050B1F" />
      <rect x="114" y="29" width="172" height="450" rx="26" fill="url(#celular-tela)" />
      <rect x="172" y="38" width="56" height="12" rx="6" fill="#050B1F" />

      {/* cabeçalho da aula */}
      <rect x="125" y="64" width="150" height="78" rx="16" fill={NAVY} />
      <text x="139" y="90" fill={AMARELO} fontSize="11" fontWeight="800" letterSpacing="1">
        AULA 05
      </text>
      <text x="139" y="111" fill="#fff" fontSize="16" fontWeight="800">
        Greetings
      </text>
      <rect x="139" y="123" width="122" height="6" rx="3" fill={NAVY_CLARO} />
      <rect x="139" y="123" width="86" height="6" rx="3" fill={AMARELO} />

      {/* Eu consigo */}
      <rect x="125" y="154" width="150" height="134" rx="16" fill="#fff" stroke={BORDA} />
      <text x="139" y="178" fill={TEAL} fontSize="11" fontWeight="800" letterSpacing="1">
        EU CONSIGO
      </text>
      {consigo.map((item, i) => (
        <g key={item} transform={`translate(139 ${193 + i * 30})`}>
          <circle cx="9" cy="9" r="9" fill={TEAL} />
          <path d="M5 9.5 8 12.5 13.5 6.5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="25" y="13" fill={NAVY} fontSize="11.5" fontWeight="700">
            {item}
          </text>
        </g>
      ))}

      {/* exercício */}
      <rect x="125" y="300" width="150" height="62" rx="16" fill="#fff" stroke={BORDA} />
      <text x="139" y="322" fill="#5B6B7F" fontSize="10.5" fontWeight="700">
        Complete:
      </text>
      <text x="139" y="344" fill={NAVY} fontSize="13" fontWeight="800">
        I
        <tspan fill={AZUL}> am </tspan>
        from Brazil.
      </text>

      {/* chapéu de formatura flutuando no canto do aparelho */}
      <image href="/brand/icone-chapeu.webp" x="290" y="44" width="76" height="76" />

      {/* balões de fala */}
      <g>
        <rect x="6" y="150" width="118" height="44" rx="22" fill="#fff" />
        <path d="M100 190 114 206 116 186z" fill="#fff" />
        <text x="65" y="177" fill={NAVY} fontSize="14" fontWeight="800" textAnchor="middle">
          Hi! I’m Ana.
        </text>
      </g>
      <g>
        <rect x="274" y="246" width="122" height="44" rx="22" fill={TEAL} />
        <path d="M292 286 282 304 306 288z" fill={TEAL} />
        <text x="335" y="273" fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle">
          I’m from Brazil.
        </text>
      </g>
    </svg>
  );
}

/**
 * A onda que fecha a primeira dobra: cobre o pé do celular e entrega um fundo
 * navy liso para a faixa de recursos, qualquer que seja o recorte do background.
 * Termina em NAVY puro — quem vem embaixo precisa ser `bg-navy`.
 */
export function OndaDoHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="onda-do-hero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NAVY_CLARO} />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
      </defs>
      {/* ⚠️ A crista nunca desce além de y=34: o pé do celular fica a 40px do topo. */}
      <path d="M0 30C220 2 420 0 640 18s500 22 800-14V64H0z" fill="url(#onda-do-hero)" />
      <path
        d="M0 30C220 2 420 0 640 18s500 22 800-14"
        fill="none"
        stroke="#5E7FB8"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* -------------------------------------------------- trilha das 42 aulas */

/**
 * As 42 aulas em trilha: um ponto por aula, bandeiras nos seis marcos e as duas
 * revisões (30 e 42) destacadas em amarelo.
 */
export function TrilhaDas42({ className }: { className?: string }) {
  const largura = 840;
  const pontos = Array.from({ length: 42 }, (_, i) => {
    const x = 24 + (i * (largura - 48)) / 41;
    const y = 62 + Math.sin(i / 4.2) * 22;
    return { x, y, aula: i + 1 };
  });
  const marcos = new Set([5, 9, 20, 29, 39, 42]);
  const revisoes = new Set([30, 42]);
  const caminho = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${largura} 124`} aria-hidden="true" className={className}>
      <path d={caminho} fill="none" stroke={BORDA} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {pontos.map((p) => {
        const marco = marcos.has(p.aula);
        const revisao = revisoes.has(p.aula);
        return (
          <g key={p.aula}>
            {marco ? (
              <>
                <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - 38} stroke={NAVY} strokeWidth="2" />
                <path d={`M${p.x} ${p.y - 38} h18 l-5 6 5 6 h-18z`} fill={revisao ? AMARELO : TEAL} />
              </>
            ) : null}
            <circle
              cx={p.x}
              cy={p.y}
              r={marco ? 8 : 5}
              fill={revisao ? AMARELO : marco ? NAVY : '#fff'}
              stroke={marco || revisao ? NAVY : TEAL}
              strokeWidth={marco ? 3 : 2}
            />
          </g>
        );
      })}
      <text x="24" y="116" fill="#5B6B7F" fontSize="13" fontWeight="700">
        Aula 01
      </text>
      <text x={largura - 24} y="116" fill="#5B6B7F" fontSize="13" fontWeight="700" textAnchor="end">
        Aula 42
      </text>
    </svg>
  );
}

/* -------------------------------------------------------- o professor */

/**
 * Retrato ilustrado — não é foto, e o rótulo diz isso. Quando houver foto
 * autorizada do professor, ela entra aqui (docs/LANDING.md §5).
 */
export function RetratoDoProfessor({ rotulo, className }: { rotulo: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 280" role="img" aria-label={rotulo} className={className}>
      <rect width="240" height="280" rx="26" fill={MENTA} />
      <circle cx="196" cy="48" r="22" fill={AMARELO} />
      {/* corpo */}
      <path d="M36 280c4-58 40-92 84-92s80 34 84 92z" fill={NAVY} />
      <path d="M104 190h32l-16 30z" fill="#fff" />
      <path d="M116 196h8l3 40-7 8-7-8z" fill={AMARELO} />
      {/* pescoço e rosto */}
      <rect x="106" y="160" width="28" height="34" rx="12" fill="#C98E6B" />
      <ellipse cx="120" cy="120" rx="46" ry="52" fill="#D9A07C" />
      {/* cabelo */}
      <path d="M74 112c-2-38 22-60 48-60 28 0 50 20 46 58-8-16-22-26-44-26-22 0-38 10-50 28z" fill="#2B1D16" />
      {/* orelhas */}
      <ellipse cx="74" cy="124" rx="8" ry="12" fill="#C98E6B" />
      <ellipse cx="166" cy="124" rx="8" ry="12" fill="#C98E6B" />
      {/* óculos */}
      <g fill="none" stroke={NAVY} strokeWidth="3.5">
        <rect x="88" y="112" width="28" height="22" rx="8" />
        <rect x="124" y="112" width="28" height="22" rx="8" />
        <path d="M116 121h8" />
      </g>
      <circle cx="102" cy="123" r="3" fill={NAVY} />
      <circle cx="138" cy="123" r="3" fill={NAVY} />
      {/* sorriso e barba curta */}
      <path d="M104 150c8 9 24 9 32 0" fill="none" stroke="#7A3E2A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M84 138c4 28 20 38 36 38s32-10 36-38c-6 10-18 16-36 16s-30-6-36-16z" fill="#2B1D16" opacity="0.55" />
    </svg>
  );
}

/* ------------------------------------------------------------ o fecho */

/** Skyline de Londres com o Big Ben — a mesma referência da marca, em SVG. */
export function SkylineDeLondres({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 200" aria-hidden="true" className={className}>
      <circle cx="286" cy="58" r="30" fill={AMARELO} opacity="0.95" />
      <g fill={NAVY_CLARO}>
        <rect x="0" y="140" width="46" height="60" />
        <rect x="40" y="120" width="30" height="80" />
        <rect x="200" y="128" width="40" height="72" />
        <rect x="236" y="110" width="26" height="90" />
        <rect x="258" y="146" width="60" height="54" />
        <rect x="312" y="124" width="48" height="76" />
        {/* London Eye */}
        <circle cx="316" cy="150" r="34" fill="none" stroke={NAVY_CLARO} strokeWidth="4" />
      </g>
      {/* Big Ben */}
      <g>
        <rect x="118" y="60" width="44" height="140" fill="#1E4FA8" />
        <path d="M114 60h52l-26-44z" fill="#1E4FA8" />
        <rect x="138" y="4" width="4" height="16" fill="#1E4FA8" />
        <circle cx="140" cy="86" r="16" fill={AMARELO} />
        <circle cx="140" cy="86" r="16" fill="none" stroke={NAVY} strokeWidth="2.5" />
        <path d="M140 86V76M140 86l7 4" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
        <g fill={NAVY_CLARO}>
          <rect x="126" y="116" width="8" height="18" rx="2" />
          <rect x="146" y="116" width="8" height="18" rx="2" />
          <rect x="126" y="146" width="8" height="18" rx="2" />
          <rect x="146" y="146" width="8" height="18" rx="2" />
        </g>
      </g>
      <rect x="0" y="194" width="360" height="6" fill={TEAL} opacity="0.6" />
    </svg>
  );
}
