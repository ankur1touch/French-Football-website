"use client";

import Link from "next/link";
import type { TopScorer } from "@/types/tournament";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";

interface TopScorersTableProps {
  scorers: TopScorer[];
}

export default function TopScorersTable({ scorers }: TopScorersTableProps) {
  const lp = useLocalizedPath();

  if (scorers.length === 0) {
    return <p className="text-sm text-gray-500">Buteurs non disponibles.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
            <th className="pb-2 pr-2">#</th>
            <th className="pb-2">Joueur</th>
            <th className="pb-2">Club</th>
            <th className="pb-2 text-center">Buts</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((scorer) => (
            <tr key={scorer.rank} className="border-b border-gray-50">
              <td className="py-2 pr-2 text-gray-500">{scorer.rank}</td>
              <td className="py-2 font-medium">
                {scorer.playerId ? (
                  <Link
                    href={lp(`joueurs/${scorer.playerId}`)}
                    className="hover:text-primary"
                  >
                    {scorer.player}
                  </Link>
                ) : (
                  scorer.player
                )}
              </td>
              <td className="py-2 text-gray-600">
                {scorer.teamId ? (
                  <Link
                    href={lp(`equipes/${scorer.teamId}`)}
                    className="hover:text-primary"
                  >
                    {scorer.club}
                  </Link>
                ) : (
                  scorer.club
                )}
              </td>
              <td className="py-2 text-center font-bold text-primary">{scorer.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
