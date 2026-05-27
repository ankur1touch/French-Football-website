import { cn } from "@/lib/cn";

type BadgeVariant =
  | "live"
  | "category"
  | "direct"
  | "featured"
  | "default"
  | "green"
  | "yellow"
  | "red"
  | "navy"
  | "muted"
  | "wc"
  | "tournament";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  live: "bg-live-red text-white animate-pulse",
  category:
    "bg-primary-light/10 text-primary-light text-[10px] font-semibold uppercase tracking-wide",
  direct: "bg-live-red text-white font-bold uppercase",
  featured: "bg-live-red text-white uppercase",
  default: "bg-gray-100 text-gray-700",
  green: "bg-form-win/15 text-form-win",
  yellow: "bg-gold/20 text-primary-dark",
  red: "bg-live-red/15 text-live-red",
  navy: "bg-primary-dark text-white",
  muted: "bg-gray-100 text-gray-500",
  wc: "bg-gold text-primary-dark font-bold uppercase",
  tournament: "bg-primary/10 text-primary uppercase",
};

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
