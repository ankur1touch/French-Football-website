import { cn } from "@/lib/cn";

type BadgeVariant = "live" | "category" | "direct" | "featured" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  live: "bg-live-red text-white",
  category: "bg-primary-light/10 text-primary-light text-[10px] font-semibold uppercase tracking-wide",
  direct: "bg-live-red text-white font-bold uppercase",
  featured: "bg-live-red text-white uppercase",
  default: "bg-gray-100 text-gray-700",
};

export default function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
