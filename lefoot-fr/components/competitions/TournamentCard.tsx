"use client";

import Image from "next/image";
import Link from "next/link";
import type { Tournament } from "@/types/tournament";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const lp = useLocalizedPath();

  return (
    <Link
      href={lp(`competitions/${tournament.id}`)}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-primary">
        <Image
          src={tournament.image}
          alt={tournament.name}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover opacity-80 transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium uppercase text-primary-light">
          {tournament.category}
        </span>
        <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-primary">
          {tournament.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {format(new Date(tournament.startDate), "MMM yyyy", { locale: fr })} —{" "}
          {format(new Date(tournament.endDate), "MMM yyyy", { locale: fr })}
        </p>
        <p className="text-xs text-gray-400">{tournament.host}</p>
      </div>
    </Link>
  );
}
