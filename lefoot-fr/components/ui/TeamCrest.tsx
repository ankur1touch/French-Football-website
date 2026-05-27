"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

interface TeamCrestProps {
  name: string;
  logo?: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamCrest({ name, logo, size = 32, className }: TeamCrestProps) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        width={size}
        height={size}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
        className
      )}
      style={{ width: size, height: size }}
    >
      {getInitials(name)}
    </div>
  );
}
