'use client';

import { useEffect, useRef } from 'react';
import styles from './globe-pulse.module.css';

type GeoPoint = readonly [longitude: number, latitude: number];
type Vector = readonly [number, number, number];

// Contornos simplificados para desenhar o planeta em código, sem imagem de fundo.
const CONTINENTS: readonly (readonly GeoPoint[])[] = [
  [
    [-168, 70],
    [-145, 71],
    [-130, 62],
    [-112, 70],
    [-88, 73],
    [-58, 53],
    [-64, 45],
    [-80, 25],
    [-87, 22],
    [-82, 9],
    [-92, 16],
    [-108, 24],
    [-118, 33],
    [-125, 48],
    [-138, 59],
    [-163, 60],
  ],
  [
    [-81, 12],
    [-71, 11],
    [-60, 5],
    [-50, 0],
    [-35, -7],
    [-40, -22],
    [-51, -31],
    [-64, -55],
    [-72, -51],
    [-76, -29],
    [-80, -4],
  ],
  [
    [-53, 60],
    [-43, 61],
    [-20, 74],
    [-28, 82],
    [-47, 84],
    [-61, 76],
  ],
  [
    [-10, 36],
    [-10, 44],
    [-2, 44],
    [5, 48],
    [7, 54],
    [20, 59],
    [28, 71],
    [45, 68],
    [72, 72],
    [110, 74],
    [140, 69],
    [174, 61],
    [158, 52],
    [142, 46],
    [134, 35],
    [121, 30],
    [108, 20],
    [103, 9],
    [98, 9],
    [93, 23],
    [87, 22],
    [79, 8],
    [72, 20],
    [65, 25],
    [54, 24],
    [43, 13],
    [35, 30],
    [30, 41],
    [24, 35],
    [19, 40],
    [15, 38],
    [11, 44],
    [3, 42],
  ],
  [
    [-17, 28],
    [-7, 36],
    [11, 37],
    [24, 32],
    [33, 31],
    [36, 22],
    [43, 12],
    [51, 11],
    [43, -4],
    [39, -18],
    [30, -29],
    [18, -35],
    [12, -19],
    [10, -3],
    [3, 5],
    [-10, 5],
    [-17, 15],
  ],
  [
    [113, -22],
    [123, -14],
    [132, -12],
    [138, -16],
    [144, -12],
    [154, -25],
    [151, -37],
    [137, -38],
    [130, -32],
    [116, -35],
  ],
  [
    [-8, 50],
    [-6, 58],
    [-2, 59],
    [1, 52],
  ],
  [
    [-10, 51],
    [-10, 55],
    [-6, 55],
    [-6, 51],
  ],
  [
    [46, -13],
    [50, -16],
    [48, -25],
    [44, -25],
  ],
  [
    [130, 32],
    [138, 36],
    [142, 42],
    [145, 44],
    [144, 36],
    [135, 31],
  ],
  [
    [95, 5],
    [106, -6],
    [114, -8],
    [108, -8],
    [98, -1],
  ],
  [
    [109, 7],
    [119, 6],
    [117, -4],
    [111, -3],
  ],
  [
    [130, -1],
    [141, -3],
    [150, -7],
    [141, -10],
    [132, -5],
  ],
  [
    [172, -34],
    [178, -39],
    [173, -43],
    [166, -47],
    [168, -41],
  ],
];

const RAD = Math.PI / 180;
const toVector = ([longitude, latitude]: GeoPoint): Vector => [
  Math.cos(latitude * RAD) * Math.sin(longitude * RAD),
  Math.sin(latitude * RAD),
  Math.cos(latitude * RAD) * Math.cos(longitude * RAD),
];

function isInside(point: GeoPoint, polygon: readonly GeoPoint[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}

const LAND: Vector[] = [];
for (let latitude = -56; latitude < 84; latitude += 2.5) {
  const step = 2.5 / Math.max(0.3, Math.cos(latitude * RAD));
  for (let longitude = -178; longitude < 180; longitude += step) {
    if (CONTINENTS.some((polygon) => isInside([longitude, latitude], polygon)))
      LAND.push(toVector([longitude, latitude]));
  }
}

const OUTLINES = CONTINENTS.map((polygon) =>
  polygon.flatMap((point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    const steps = Math.ceil(
      Math.max(Math.abs(point[0] - next[0]), Math.abs(point[1] - next[1])) / 2,
    );
    return Array.from({ length: steps }, (_, i) =>
      toVector([
        point[0] + ((next[0] - point[0]) * i) / steps,
        point[1] + ((next[1] - point[1]) * i) / steps,
      ]),
    );
  }),
);

const GRID: Vector[][] = [];
for (let latitude = -60; latitude <= 60; latitude += 30)
  GRID.push(
    Array.from({ length: 181 }, (_, i) => toVector([-180 + i * 2, latitude])),
  );
for (let longitude = -180; longitude < 180; longitude += 30)
  GRID.push(
    Array.from({ length: 91 }, (_, i) => toVector([longitude, -90 + i * 2])),
  );

function project([x, y, z]: Vector, rotation: number) {
  const turnedX = x * Math.cos(rotation) + z * Math.sin(rotation);
  const turnedZ = z * Math.cos(rotation) - x * Math.sin(rotation);
  const tilt = 0.12;
  return [
    turnedX,
    -y * Math.cos(tilt) + turnedZ * Math.sin(tilt),
    turnedZ * Math.cos(tilt) + y * Math.sin(tilt),
  ] as const;
}

const STATIC_LAND = LAND.map((point) => project(point, 0.4)).filter(
  (point) => point[2] > 0.02,
);
const STATIC_LAND_PATH = STATIC_LAND.map(
  ([x, y]) =>
    `M${(250 + x * 220).toFixed(1)} ${(250 + y * 220).toFixed(1)}h.01`,
).join('');

/** Globo transparente: o tamanho e a baixa opacidade da hero são controlados pelo wrapper. */
export function GlobePulse({
  className,
  color = '#F6C945',
}: {
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = ref.current;
    const canvas = canvasRef.current;
    if (!element || !canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let size = 0;
    let dpr = 1;
    let frame = 0;
    let inView = false;
    let previousTime = 0;
    let activeTime = 0;
    let lastDraw = 0;

    const draw = () => {
      if (!size) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size, size);
      const center = size / 2;
      const pulse = motion.matches ? 0 : Math.sin(activeTime / 1800);
      const radius = size * (0.44 + pulse * 0.002);
      const rotation = 0.4 + activeTime / 65000;
      context.strokeStyle = color;
      context.fillStyle = color;

      const path = (
        points: readonly Vector[],
        opacity: number,
        width: number,
      ) => {
        context.globalAlpha = opacity;
        context.lineWidth = width;
        context.beginPath();
        let connected = false;
        for (const point of points) {
          const [x, y, depth] = project(point, rotation);
          if (depth <= 0.015) {
            connected = false;
            continue;
          }
          if (connected)
            context.lineTo(center + x * radius, center + y * radius);
          else context.moveTo(center + x * radius, center + y * radius);
          connected = true;
        }
        context.stroke();
      };

      context.globalAlpha = 0.48;
      context.lineWidth = 1.15;
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.stroke();
      for (const line of GRID) path(line, 0.15, 0.7);
      for (const outline of OUTLINES)
        path(outline, 0.46, Math.max(0.75, size / 550));
      context.globalAlpha = 0.7 + pulse * 0.05;
      context.beginPath();
      for (const point of LAND) {
        const [x, y, depth] = project(point, rotation);
        if (depth <= 0.015) continue;
        const dot = Math.max(0.8, size / 330) * (0.65 + depth * 0.35);
        context.moveTo(center + x * radius + dot, center + y * radius);
        context.arc(
          center + x * radius,
          center + y * radius,
          dot,
          0,
          Math.PI * 2,
        );
      }
      context.fill();
      context.globalAlpha = 0.1 + pulse * 0.035;
      context.lineWidth = 0.75;
      context.beginPath();
      context.arc(center, center, radius * 1.035, 0, Math.PI * 2);
      context.stroke();
      context.globalAlpha = 1;
      element.dataset.ready = 'true';
    };

    const tick = (time: number) => {
      if (!inView || document.hidden || motion.matches) {
        frame = 0;
        previousTime = 0;
        return;
      }
      if (previousTime) activeTime += Math.min(time - previousTime, 80);
      previousTime = time;
      if (time - lastDraw >= 32) {
        draw();
        lastDraw = time;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const updateAnimation = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      draw();
      if (inView && !document.hidden && !motion.matches)
        frame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      size = Math.round(element.getBoundingClientRect().width);
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateAnimation();
    });
    observer.observe(element);
    motion.addEventListener('change', updateAnimation);
    document.addEventListener('visibilitychange', updateAnimation);
    resize();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener('change', updateAnimation);
      document.removeEventListener('visibilitychange', updateAnimation);
    };
  }, [color]);

  return (
    <div
      ref={ref}
      className={`${styles.globe} ${className ?? ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 500 500" className={styles.fallback} fill={color}>
        <circle
          cx="250"
          cy="250"
          r="220"
          fill="none"
          stroke={color}
          strokeOpacity="0.48"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="112"
          ry="220"
          fill="none"
          stroke={color}
          strokeOpacity="0.15"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="220"
          ry="70"
          fill="none"
          stroke={color}
          strokeOpacity="0.15"
        />
        <path
          d={STATIC_LAND_PATH}
          fill="none"
          stroke={color}
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
