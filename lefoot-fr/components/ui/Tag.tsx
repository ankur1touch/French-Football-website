import { cn } from "@/lib/cn";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export default function Tag({ children, className, active }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        active ? "bg-primary text-white" : "bg-gray-100 text-gray-600",
        className
      )}
    >
      {children}
    </span>
  );
}
