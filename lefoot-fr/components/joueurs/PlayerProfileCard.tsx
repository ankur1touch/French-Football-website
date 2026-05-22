"use client";

import Image from "next/image";
import Link from "next/link";
import type { PlayerInfo, PlayerStatistics } from "@/types/player";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";

interface PlayerProfileCardProps {
  player: PlayerInfo;
  statistics: PlayerStatistics[];
  injuredLabel: string;
  heightLabel: string;
  weightLabel: string;
  yearsOldLabel: string;
}

export default function PlayerProfileCard({
  player,
  statistics,
  injuredLabel,
  heightLabel,
  weightLabel,
  yearsOldLabel,
}: PlayerProfileCardProps) {
  const lp = useLocalizedPath();
  const stat = statistics?.[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
          {player.photo ? (
            <Image
              src={player.photo}
              alt={player.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {stat?.team && (
              <Link
                href={lp(`equipes/${stat.team.id}`)}
                className="flex items-center gap-1.5 hover:opacity-80"
              >
                {stat.team.logo ? (
                  <Image
                    src={stat.team.logo}
                    alt={stat.team.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                ) : null}
                <span className="text-sm font-medium text-primary">{stat.team.name}</span>
              </Link>
            )}
            {stat?.league && (
              <span className="text-xs text-gray-400">· {stat.league.name}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
            {player.nationality && player.nationality !== "—" && (
              <span>{player.nationality}</span>
            )}
            {player.age > 0 && (
              <span>
                {player.age} {yearsOldLabel}
              </span>
            )}
            {player.height && player.height !== "—" && (
              <span>
                {heightLabel}: {player.height} cm
              </span>
            )}
            {player.weight && player.weight !== "—" && (
              <span>
                {weightLabel}: {player.weight} kg
              </span>
            )}
            {stat?.games?.position && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {stat.games.position}
              </span>
            )}
          </div>
        </div>
      </div>

      {player.injured && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {injuredLabel}
        </div>
      )}
    </div>
  );
}
