"use client";

import type { MatchStat } from "@/types/matchDetail";
import { useTranslations } from "@/components/providers/LocaleProvider";

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number;
  away: string | number;
}) {
  const h = parseFloat(String(home).replace("%", "")) || 0;
  const a = parseFloat(String(away).replace("%", "")) || 0;
  const total = h + a || 1;
  const homePct = Math.round((h / total) * 100);
  const awayPct = 100 - homePct;

  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs font-semibold">
        <span>{home}</span>
        <span className="font-normal text-gray-500">{label}</span>
        <span>{away}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className="bg-primary" style={{ width: `${homePct}%` }} />
        <div className="bg-blue-500" style={{ width: `${awayPct}%` }} />
      </div>
    </div>
  );
}

interface MatchStatsSectionProps {
  stats: MatchStat[][];
}

export default function MatchStatsSection({ stats }: MatchStatsSectionProps) {
  const t = useTranslations();

  if (!stats?.length || stats.length < 2) {
    return <p className="py-8 text-center text-gray-400">{t.detail.match.noStats}</p>;
  }

  const homeStats = stats[0];
  const awayStats = stats[1];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {homeStats.map((s, i) => (
        <StatBar
          key={i}
          label={s.type}
          home={s.value ?? 0}
          away={awayStats[i]?.value ?? 0}
        />
      ))}
    </div>
  );
}
