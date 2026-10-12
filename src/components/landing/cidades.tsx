import type { ReactNode } from 'react';

/**
 * Panoramas em traço das seis cidades da trilha, na ordem dos marcos. O miolo
 * (x de 100 a 500) leva os pontos turísticos e é o que cabe no celular; os
 * prédios genéricos das pontas só aparecem em telas largas.
 */
function Panorama({
  className,
  ativa,
  children,
}: {
  className?: string;
  ativa?: boolean;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="-300 0 1200 220"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      data-ativa={ativa ? '' : undefined}
    >
      <g fill="currentColor" stroke="none" opacity="0.28">
        <path d="M-300 220V160h40v-25h35v40h30v-55h45v70h35v-40h50v-30h40v60h45v-45h40v65h20V220Z" />
        <path d="M520 220V185h30v-50h45v35h35v-60h40v80h45v-45h50v25h35v-55h45v70h55V220Z" />
      </g>
      <path d="M-300 219H900" />
      {children}
    </svg>
  );
}

function Londres() {
  return (
    <>
      {/* Big Ben e o Parlamento */}
      <path d="M150 220V95h36v125M146 95h44V60h-44zM146 60l22-38 22 38M168 22V8" />
      <circle cx="168" cy="78" r="11" />
      <path d="M168 70v8l5 3M158 112h20m-20 16h20m-20 16h20" />
      <path d="M186 220v-50h90v50M186 170l9-14 9 14 9-14 9 14 9-14 9 14 9-14 9 14 9-14 9 14M200 185v25m18-25v25m18-25v25m18-25v25" />
      {/* London Eye */}
      <circle cx="360" cy="140" r="62" />
      <circle cx="360" cy="140" r="55" />
      {Array.from({ length: 12 }, (_, i) => {
        const angulo = (i * Math.PI) / 6;
        return (
          <path
            key={i}
            d={`M360 140L${(360 + Math.cos(angulo) * 62).toFixed(1)} ${(140 + Math.sin(angulo) * 62).toFixed(1)}`}
          />
        );
      })}
      <path d="M360 140l-22 80m22-80 22 80" />
      {/* Tower Bridge */}
      <path d="M438 220v-90h26v90m-28-90 15-20 15 20m-15-20V98M488 220v-90h26v90m-28-90 15-20 15 20m-15-20V98M464 148h24m-24 12h24M438 165c-12 26-24 40-40 50" />
    </>
  );
}

function NovaYork() {
  return (
    <>
      {/* Estátua da Liberdade */}
      <path d="M116 220v-32h28v32M121 188v-18h18v18M124 170c2-22 4-34 6-44 2 10 6 26 8 44M124 116l-4-5m7 2-1-7m6 7 3-6M133 126l8-22M138 104h7l-3.5-10z" />
      <circle cx="130" cy="120" r="5" />
      {/* One World Trade Center */}
      <path d="M196 220V70l19-20 19 20v150M215 50V22M196 70l19 150 19-150" />
      {/* Empire State */}
      <path d="M276 220V110h48v110M284 110V84h32v26M292 84V62h16v22M300 62V18M288 122v98m12-98v98m12-98v98" />
      {/* Chrysler */}
      <path d="M364 220V120h32v100M364 120c0-22 32-22 32 0M369 106c0-18 22-18 22 0M374 93c0-13 12-13 12 0M380 84V48" />
      {/* Ponte do Brooklyn */}
      <path d="M440 220v-70h22v70M446 220v-34c0-8 10-8 10 0v34M404 214c18-26 28-48 36-64m22 0c12 28 24 46 44 62M400 214h110" />
    </>
  );
}

function Toronto() {
  return (
    <>
      <path d="M120 220v-70h34v70M128 162h18m-18 14h18m-18 14h18" />
      {/* Rogers Centre */}
      <path d="M170 220v-18c0-42 100-42 100 0v18M170 202h100M195 176v26m25-32v32m25-26v26" />
      {/* CN Tower */}
      <path d="M292 220l5-120h6l5 120M286 100h28l-4-14h-20zM297 86V56h6v30M294 56h12v-8h-12zM300 48V8" />
      <path d="M350 220V110h34v110M356 110V96h22v14M358 124v96m9-96v96m9-96v96M396 220v-90h30v90M436 220V95h28v125m-28-125 14-16 14 16M444 108v112m12-112v112" />
    </>
  );
}

function Sydney() {
  return (
    <>
      {/* Sydney Tower */}
      <path d="M108 220V110h4v110M100 110h20l-3-12h-14zM110 98V68" />
      {/* Opera House */}
      <path d="M140 220v-14h200v14M150 206c2-18 10-30 22-36M160 206c4-40 26-66 56-78-6 30-8 54-6 78M210 206c6-48 32-78 66-90-8 36-10 62-8 90M268 206c4-36 22-58 48-68-4 26-6 46-4 68" />
      {/* Harbour Bridge */}
      <path d="M330 200C380 110 470 110 520 200M330 200c55-60 135-60 190 0M320 200h210M360 200v-38m20 38v-53m20 53v-63m20 63v-67m20 67v-66m20 66v-60m20 60v-47m20 47v-30M322 220v-40h12v40m184 0v-40h12v40" />
    </>
  );
}

function Dublin() {
  return (
    <>
      {/* Casas georgianas */}
      <path d="M100 220v-64h54v64M110 170h12v14h-12zm22 0h12v14h-12zM120 220v-20c0-10 14-10 14 0v20" />
      {/* Ha'penny Bridge */}
      <path d="M160 204c38-30 92-30 130 0M160 214c38-30 92-30 130 0M186 190v8m26-17v8m26-8v8m26 1v8M200 182c0-14 18-14 18 0m14-3c0-14 18-14 18 0" />
      {/* The Spire */}
      <path d="M296 220l4-206 4 206" />
      {/* Ponte Samuel Beckett */}
      <path d="M340 214h160M362 214c10-60 40-108 92-138M380 160l92 54m-78-76 56 76m-38-98 16 98m-4-116-14 116" />
    </>
  );
}

function Auckland() {
  return (
    <>
      {/* Harbour Bridge */}
      <path d="M100 202h170M112 202c42-38 104-38 146 0M130 202l10-16 10 16 10-24 10 24 10-28 10 28 10-28 10 28 10-24 10 24 10-16 10 16M112 220v-18m146 18v-18" />
      {/* Sky Tower */}
      <path d="M295 220l2-120h6l2 120M286 100h28l-3-10h-22zM289 90h22l-2-9h-18zM297 81V58h6v23M300 58V12" />
      <path d="M322 220v-80h24v80M328 152h12m-12 14h12m-12 14h12" />
      {/* Veleiros e o Rangitoto */}
      <path d="M362 210h44l-7 9h-30zM384 210v-52l22 46zM384 166l-16 38M432 213h32l-5 6h-22zM448 213v-38l15 32zM410 220c26-6 44-40 62-42s34 36 58 42" />
    </>
  );
}

const DESENHOS = [Londres, NovaYork, Toronto, Sydney, Dublin, Auckland];

/** Todas as cidades empilhadas; só a marcada com `data-ativa` aparece. */
export function PanoramasDasCidades({
  className,
  ativa,
}: {
  className?: string;
  /** Índice da cidade na ordem dos marcos; -1 para nenhuma. */
  ativa: number;
}) {
  return (
    <>
      {DESENHOS.map((Desenho, i) => (
        <Panorama key={i} className={className} ativa={i === ativa}>
          <Desenho />
        </Panorama>
      ))}
    </>
  );
}
