import { cn } from "@/lib/cn";

interface OnzeActuLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
}

const sizes = {
  sm:  { width: 110, height: 28,  font: 16, badgeFont: 9,  r: 10, badgeW: 18, badgeH: 14 },
  md:  { width: 148, height: 38,  font: 22, badgeFont: 12, r: 13, badgeW: 24, badgeH: 18 },
  lg:  { width: 185, height: 48,  font: 28, badgeFont: 15, r: 17, badgeW: 30, badgeH: 23 },
  xl:  { width: 230, height: 60,  font: 35, badgeFont: 18, r: 21, badgeW: 38, badgeH: 29 },
};

export default function OnzeActuLogo({
  className,
  size = "md",
  variant = "light",
}: OnzeActuLogoProps) {
  const { width, height, font, badgeFont, r, badgeW, badgeH } = sizes[size];
  const cx = r + 2;
  const cy = height / 2;

  const white   = "#FFFFFF";
  const gold    = "#FFD700";
  const navy    = "#003087";
  const dark    = "#1a1a2e";

  const mainText  = variant === "light" ? white : navy;
  const accentText = gold;
  const bgCircle   = variant === "light" ? "rgba(255,255,255,0.12)" : "rgba(0,48,135,0.08)";

  // "11" badge x position (right after the circle)
  const badgeX = cx * 2 + 4;
  const badgeY = cy - badgeH / 2;

  // "Onze" text starts after badge
  const textX = badgeX + badgeW + 5;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OnzeActu"
      role="img"
      className={cn(className)}
    >
      {/* ── Circle backdrop ── */}
      <circle cx={cx} cy={cy} r={r} fill={bgCircle} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={gold} strokeWidth="1.5" />

      {/* Football stitching lines */}
      <line x1={cx - r * 0.5} y1={cy - r * 0.6} x2={cx + r * 0.5} y2={cy - r * 0.6}
        stroke={gold} strokeWidth="1" strokeLinecap="round" />
      <line x1={cx - r * 0.7} y1={cy} x2={cx + r * 0.7} y2={cy}
        stroke={gold} strokeWidth="1" strokeLinecap="round" />
      <line x1={cx - r * 0.5} y1={cy + r * 0.6} x2={cx + r * 0.5} y2={cy + r * 0.6}
        stroke={gold} strokeWidth="1" strokeLinecap="round" />
      {/* Center stitch cross */}
      <line x1={cx} y1={cy - r * 0.7} x2={cx} y2={cy + r * 0.7}
        stroke={gold} strokeWidth="0.8" strokeLinecap="round" />

      {/* ── "11" pill badge ── */}
      <rect
        x={badgeX}
        y={badgeY}
        width={badgeW}
        height={badgeH}
        rx={badgeH / 2}
        fill={gold}
      />
      <text
        x={badgeX + badgeW / 2}
        y={badgeY + badgeH * 0.73}
        textAnchor="middle"
        fontFamily="'Bebas Neue', 'Arial Black', Impact, sans-serif"
        fontSize={badgeFont}
        fontWeight="900"
        fill={dark}
        letterSpacing="0.5"
      >
        11
      </text>

      {/* ── "Onze" text ── */}
      <text
        x={textX}
        y={cy + font * 0.35}
        fontFamily="'Bebas Neue', 'Arial Black', Impact, sans-serif"
        fontSize={font}
        fontWeight="700"
        fill={mainText}
        letterSpacing="1"
      >
        Onze
      </text>

      {/* ── "Actu" text in gold ── */}
      <text
        x={textX + font * 2.6}
        y={cy + font * 0.35}
        fontFamily="'Bebas Neue', 'Arial Black', Impact, sans-serif"
        fontSize={font}
        fontWeight="700"
        fill={accentText}
        letterSpacing="1"
      >
        Actu
      </text>
    </svg>
  );
}
