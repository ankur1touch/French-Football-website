import { cn } from "@/lib/cn";

interface LeFootLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
}

const sizes = {
  sm: { width: 100, height: 28 },
  md: { width: 130, height: 36 },
  lg: { width: 160, height: 44 },
  xl: { width: 200, height: 56 },
};

export default function LeFootLogo({
  className,
  size = "md",
  variant = "light",
}: LeFootLogoProps) {
  const { width, height } = sizes[size];
  const textColor = variant === "light" ? "#ffffff" : "#003087";
  const goldColor = "#FFD700";
  const ballScale = height * 0.75;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OnzeActu"
      className={cn(className)}
    >
      {/* Football circle */}
      <circle
        cx={ballScale / 2}
        cy={height / 2}
        r={ballScale / 2}
        fill={variant === "light" ? "rgba(255,255,255,0.15)" : "rgba(0,48,135,0.1)"}
        stroke={goldColor}
        strokeWidth="1.5"
      />
      {/* Pentagon center patch */}
      <polygon
        points={pentagonPoints(ballScale / 2, height / 2, ballScale * 0.18)}
        fill={goldColor}
      />
      {/* Hex seam lines */}
      {hexSeamLines(ballScale / 2, height / 2, ballScale * 0.18, ballScale * 0.44).map(
        (line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={goldColor}
            strokeWidth="1"
            opacity="0.6"
          />
        )
      )}

      {/* "LeFoot" text */}
      <text
        x={ballScale + 6}
        y={height * 0.68}
        fontFamily="'Bebas Neue', 'Arial Black', sans-serif"
        fontSize={height * 0.62}
        fontWeight="700"
        letterSpacing="1"
        fill={textColor}
      >
        LeFoot
      </text>

      {/* "FR" in gold */}
      <text
        x={ballScale + 6 + estimateFontWidth("LeFoot", height * 0.62)}
        y={height * 0.68}
        fontFamily="'Bebas Neue', 'Arial Black', sans-serif"
        fontSize={height * 0.62}
        fontWeight="700"
        letterSpacing="1"
        fill={goldColor}
      >
        FR
      </text>
    </svg>
  );
}

function pentagonPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(" ");
}

function hexSeamLines(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number
): { x1: number; y1: number; x2: number; y2: number }[] {
  const lines = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    lines.push({
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
    });
  }
  return lines;
}

// Approximate pixel width for Bebas Neue characters
function estimateFontWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.54;
}
