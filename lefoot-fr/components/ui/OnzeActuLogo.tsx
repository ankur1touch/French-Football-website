"use client";

import { cn } from "@/lib/cn";

interface OnzeActuLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  locale?: "fr" | "en" | string;
}

const sizes = {
  sm:  { w: 124, h: 32,  ball: 22, font: 17, sub: 7,  gap: 8  },
  md:  { w: 162, h: 42,  ball: 30, font: 23, sub: 9,  gap: 10 },
  lg:  { w: 200, h: 52,  ball: 36, font: 28, sub: 10, gap: 12 },
  xl:  { w: 250, h: 64,  ball: 44, font: 35, sub: 12, gap: 14 },
};

export default function OnzeActuLogo({
  className,
  size = "md",
  variant = "light",
  locale = "fr",
}: OnzeActuLogoProps) {
  const { w, h, ball, font, sub, gap } = sizes[size];
  const isFr = locale !== "en";
  const isLight = variant === "light";

  const cx = ball / 2 + 2;
  const cy = h / 2;
  const textX = ball + gap + 4;
  const uid = `logo-${size}-${variant}-${locale}`;

  /* ── colour tokens ── */
  const gold  = "#FFD700";
  const navy  = "#003087";
  const dark  = "#0d1117";
  const white = "#FFFFFF";

  const onzeColor = isLight ? white : navy;
  const actuColor = gold;

  /* ── locale accent colours ── */
  // FR: bleu-blanc-rouge  |  EN: red-white-blue (union jack)
  const strip = isFr
    ? ["#002395", "#FFFFFF", "#ED2939"]   // French tricolor
    : ["#CF142B", "#FFFFFF", "#00247D"];  // English flag

  const stripH = Math.max(3, Math.round(h * 0.07));
  const stripW = Math.round(w * 0.46);
  const stripX = textX - 1;
  const stripY = h - stripH - 1;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OnzeActu"
      role="img"
      className={cn(className)}
    >
      <defs>
        {/* Ball radial gradient */}
        <radialGradient id={`${uid}-ball`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor={isLight ? "rgba(255,255,255,0.25)" : "rgba(0,48,135,0.15)"} />
          <stop offset="100%" stopColor={isLight ? "rgba(255,255,255,0.04)" : "rgba(0,48,135,0.04)"} />
        </radialGradient>

        {/* Gold shimmer on "Onze" */}
        <linearGradient id={`${uid}-onze`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={isLight ? "#ffffff" : navy} />
          <stop offset="50%"  stopColor={isLight ? "#e8edf5" : "#1a4aa0"} />
          <stop offset="100%" stopColor={isLight ? "#c8d4e8" : navy} />
        </linearGradient>

        {/* Gold shimmer on "Actu" */}
        <linearGradient id={`${uid}-actu`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFE566" />
          <stop offset="45%"  stopColor="#FFD700" />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id={`${uid}-shadow`} x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5"
            floodColor={isLight ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.15)"} />
        </filter>
      </defs>

      {/* ════════════════════════════
          FOOTBALL ICON
          ════════════════════════════ */}

      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={ball / 2 + 2}
        fill="none" stroke={gold} strokeWidth="0.6" opacity="0.35" />

      {/* Ball body */}
      <circle cx={cx} cy={cy} r={ball / 2}
        fill={`url(#${uid}-ball)`}
        stroke={gold} strokeWidth="1.4" />

      {/* Pentagon center patch */}
      <polygon
        points={pentagon(cx, cy, ball * 0.19)}
        fill={gold} opacity="0.92"
        filter={`url(#${uid}-shadow)`}
      />

      {/* 5 seam lines from pentagon corners to edge */}
      {pentagonPts(cx, cy, ball * 0.19).map((pt, i) => {
        const outer = {
          x: cx + (ball * 0.48) * Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2),
          y: cy + (ball * 0.48) * Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2),
        };
        return (
          <line key={i}
            x1={pt.x} y1={pt.y}
            x2={outer.x} y2={outer.y}
            stroke={gold} strokeWidth="0.9" opacity="0.55"
            strokeLinecap="round"
          />
        );
      })}

      {/* ════════════════════════════
          WORDMARK
          ════════════════════════════ */}

      {/* "Onze" — white/navy gradient */}
      <text
        x={textX}
        y={cy + font * 0.36}
        fontFamily="'Bebas Neue', 'Arial Black', Impact, sans-serif"
        fontSize={font}
        fontWeight="700"
        fill={`url(#${uid}-onze)`}
        letterSpacing="1.5"
        filter={`url(#${uid}-shadow)`}
      >
        Onze
      </text>

      {/* "Actu" — gold gradient */}
      <text
        x={textX + onzeWidth(font)}
        y={cy + font * 0.36}
        fontFamily="'Bebas Neue', 'Arial Black', Impact, sans-serif"
        fontSize={font}
        fontWeight="700"
        fill={`url(#${uid}-actu)`}
        letterSpacing="1.5"
        filter={`url(#${uid}-shadow)`}
      >
        Actu
      </text>

      {/* ════════════════════════════
          LOCALE ACCENT STRIP (flag colors)
          ════════════════════════════ */}
      <g opacity="0.88">
        {strip.map((color, i) => (
          <rect
            key={i}
            x={stripX + (stripW / 3) * i}
            y={stripY}
            width={stripW / 3}
            height={stripH}
            fill={color}
            rx={i === 0 ? 1 : 0}
            style={i === 2 ? { borderRadius: "0 1px 1px 0" } : {}}
          />
        ))}
      </g>

      {/* Locale label micro-text above strip */}
      <text
        x={stripX + stripW + 3}
        y={stripY + stripH}
        fontFamily="'Bebas Neue', 'Arial Black', sans-serif"
        fontSize={sub}
        fontWeight="700"
        fill={gold}
        opacity="0.75"
        letterSpacing="0.5"
      >
        {isFr ? "FR" : "EN"}
      </text>

      {/* Thin separator line between ball and text */}
      <line
        x1={ball + 4} y1={h * 0.22}
        x2={ball + 4} y2={h * 0.78}
        stroke={isLight ? "rgba(255,255,255,0.25)" : "rgba(0,48,135,0.2)"}
        strokeWidth="1"
      />
    </svg>
  );
}

/* ── helpers ── */
function pentagonPts(cx: number, cy: number, r: number) {
  return Array.from({ length: 5 }, (_, i) => ({
    x: cx + r * Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2),
    y: cy + r * Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2),
  }));
}

function pentagon(cx: number, cy: number, r: number): string {
  return pentagonPts(cx, cy, r)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
}

// Approximate pixel width of "Onze" in Bebas Neue at given fontSize
function onzeWidth(fontSize: number): number {
  return fontSize * 2.52; // 4 chars × ~0.63 ratio
}
