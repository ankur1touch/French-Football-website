"use client";

import Image from "next/image";
import Link from "next/link";
import type { MatchLineup, MatchLineupPlayer } from "@/types/matchDetail";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

function PlayerRow({ player }: { player: MatchLineupPlayer }) {
  const lp = useLocalizedPath();

  return (
    <Link
      href={lp(`joueurs/${player.id}`)}
      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50"
    >
      <span className="w-5 text-right text-xs text-gray-400">{player.number}</span>
      <span className="flex-1 text-xs font-medium">{player.name}</span>
      <span className="text-xs text-gray-400">{player.pos}</span>
    </Link>
  );
}

interface MatchLineupsProps {
  lineups: MatchLineup[];
}

export default function MatchLineups({ lineups }: MatchLineupsProps) {
  const t = useTranslations();

  if (!lineups?.length) {
    return <p className="py-8 text-center text-gray-400">{t.detail.match.noLineups}</p>;
  }

  const [home, away] = lineups;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[home, away].filter(Boolean).map((team, ti) => (
        <div
          key={ti}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
          <div className="flex items-center gap-2 bg-primary px-4 py-2">
            {team.team.logo ? (
              <Image
                src={team.team.logo}
                alt={team.team.name}
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            ) : null}
            <span className="text-xs font-semibold text-white">{team.team.name}</span>
            <span className="ml-auto text-xs text-gray-300">{team.formation}</span>
          </div>
          <div className="p-2">
            <p className="mb-1 px-2 text-xs font-medium text-gray-400">
              {t.detail.match.starters}
            </p>
            {team.startXI.map((p) => (
              <PlayerRow key={p.player.id} player={p.player} />
            ))}
            <p className="mb-1 mt-3 px-2 text-xs font-medium text-gray-400">
              {t.detail.match.substitutes}
            </p>
            {team.substitutes.map((p) => (
              <PlayerRow key={p.player.id} player={p.player} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
