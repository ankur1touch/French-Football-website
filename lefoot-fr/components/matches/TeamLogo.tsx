import Image from "next/image";
import { cn } from "@/lib/cn";

interface TeamLogoProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: "h-7 w-7", px: 28 },
  md: { box: "h-10 w-10", px: 40 },
  lg: { box: "h-14 w-14", px: 56 },
};

export default function TeamLogo({ src, name, size = "md", className }: TeamLogoProps) {
  const dim = sizes[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={dim.px}
        height={dim.px}
        className={cn("object-contain", dim.box, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400",
        dim.box,
        size === "sm" ? "text-sm" : "text-xl",
        className
      )}
      aria-hidden
    >
      ⚽
    </div>
  );
}
