"use client";

import type { TournamentStanding } from "@/types/tournament";
import type { FormResult, StandingRow } from "@/types/ranking";
import { cn } from "@/lib/cn";
import { useTranslations } from "@/components/providers/LocaleProvider";

const formColors: Record<FormResult, string> = {
  W: "bg-form-win",
  D: "bg-form-draw",
  L: "bg-form-loss",
};

interface StandingsTableProps {
  standings: TournamentStanding[] | StandingRow[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  const t = useTranslations();

  if (standings.length === 0) {
    return <p className="text-sm text-gray-500">{t.rankings.unavailable}</p>;
  }

  const playedLabel = t.nav.news === "News" ? "P" : "J";
  const wonLabel = t.nav.news === "News" ? "W" : "V";
  const drawnLabel = t.nav.news === "News" ? "D" : "N";
  const lostLabel = t.nav.news === "News" ? "L" : "D";
  const gdLabel = t.nav.news === "News" ? "GD" : "Diff";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
            <th className="pb-2 pr-2">#</th>
            <th className="pb-2">{t.common.team}</th>
            <th className="pb-2 text-center">{playedLabel}</th>
            <th className="pb-2 text-center">{wonLabel}</th>
            <th className="pb-2 text-center">{drawnLabel}</th>
            <th className="pb-2 text-center">{lostLabel}</th>
            <th className="pb-2 text-center">{gdLabel}</th>
            <th className="pb-2 text-center">{t.common.pts}</th>
            <th className="pb-2 text-right">{t.common.form}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team} className="border-b border-gray-50">
              <td className="py-2 pr-2 text-gray-500">{row.position}</td>
              <td className="py-2 font-medium">{row.team}</td>
              <td className="py-2 text-center text-gray-500">{row.played}</td>
              <td className="py-2 text-center text-gray-500">{row.won}</td>
              <td className="py-2 text-center text-gray-500">{row.drawn}</td>
              <td className="py-2 text-center text-gray-500">{row.lost}</td>
              <td className="py-2 text-center text-gray-500">
                {row.goalDifference > 0 ? "+" : ""}
                {row.goalDifference}
              </td>
              <td className="py-2 text-center font-bold text-primary">{row.points}</td>
              <td className="py-2">
                <div className="flex justify-end gap-0.5">
                  {row.form.map((result, i) => (
                    <span key={i} className={cn("h-2 w-2 rounded-full", formColors[result])} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
