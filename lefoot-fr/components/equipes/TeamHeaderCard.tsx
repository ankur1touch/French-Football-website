"use client";

import Image from "next/image";
import type { TeamInfo } from "@/types/team";
import { useTranslations } from "@/components/providers/LocaleProvider";

interface TeamHeaderCardProps {
  team: TeamInfo;
}

export default function TeamHeaderCard({ team }: TeamHeaderCardProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-white p-6">
      {team.logo ? (
        <Image
          src={team.logo}
          alt={team.name}
          width={80}
          height={80}
          className="h-20 w-20 object-contain"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
          ⚽
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          {team.country && team.country !== "—" && <span>{team.country}</span>}
          {team.founded > 0 && (
            <span>
              {t.detail.team.founded}: {team.founded}
            </span>
          )}
          {team.venue?.name && team.venue.name !== "—" && (
            <span>{team.venue.name}</span>
          )}
          {team.venue?.capacity > 0 && (
            <span>
              {t.detail.team.capacity} {team.venue.capacity.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
