"use client";

import Image from "next/image";
import Link from "next/link";
import type { Team } from "@/types/team";
import type { FormResult } from "@/types/ranking";
import { cn } from "@/lib/cn";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";

const formColors: Record<FormResult, string> = {
  W: "bg-form-win",
  D: "bg-form-draw",
  L: "bg-form-loss",
};

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const lp = useLocalizedPath();

  return (
    <Link
      href={lp(`equipes/${team.id}`)}
      className="group rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
          <Image
            src={team.image}
            alt={team.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary">{team.name}</h3>
          <p className="text-xs text-gray-500">{team.confederation} · {team.coach}</p>
          <div className="mt-2 flex gap-0.5">
            {team.form.map((result, i) => (
              <span key={i} className={cn("h-2 w-2 rounded-full", formColors[result])} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
