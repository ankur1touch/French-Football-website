"use client";

import type { TeamDetailStandingRow } from "@/types/team";
import { useTranslations } from "@/components/providers/LocaleProvider";

interface TeamLeaguePositionProps {
  standings: TeamDetailStandingRow[];
  teamId: number;
}

export default function TeamLeaguePosition({ standings, teamId }: TeamLeaguePositionProps) {
  const t = useTranslations();
  const row = standings?.find((s) => s.team.id === teamId);
  if (!row) return null;

  return (
    <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{row.rank}</div>
        <div className="text-xs text-gray-400">{t.detail.team.position}</div>
      </div>
      <div className="flex flex-1 justify-center gap-6 text-center">
        {[
          { label: "PJ", val: row.all.played },
          { label: "G", val: row.all.win },
          { label: "N", val: row.all.draw },
          { label: "P", val: row.all.lose },
          { label: "BP", val: row.all.goals.for },
          { label: "BC", val: row.all.goals.against },
          { label: t.common.pts, val: row.points },
        ].map((s) => (
          <div key={s.label}>
            <div className="font-semibold">{s.val}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
      {row.form && (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
          {row.form}
        </span>
      )}
    </div>
  );
}
