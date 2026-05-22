"use client";

import Link from "next/link";
import type { H2HMatch } from "@/types/matchDetail";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

interface MatchH2HProps {
  h2h: H2HMatch[];
}

export default function MatchH2H({ h2h }: MatchH2HProps) {
  const lp = useLocalizedPath();
  const t = useTranslations();

  if (!h2h?.length) {
    return <p className="py-8 text-center text-gray-400">{t.detail.match.noH2h}</p>;
  }

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-gray-400">
        {t.detail.match.lastMeetings} ({h2h.length})
      </p>
      {h2h.map((m) => (
        <Link
          key={m.fixtureId}
          href={lp(`matchs/${m.fixtureId}`)}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50"
        >
          <span className="w-20 text-xs text-gray-500">{m.date.slice(0, 10)}</span>
          <span className="flex-1 text-right text-sm font-medium">{m.homeTeam.name}</span>
          <span className="mx-3 text-sm font-bold text-primary">
            {m.homeScore ?? "–"} – {m.awayScore ?? "–"}
          </span>
          <span className="flex-1 text-sm font-medium">{m.awayTeam.name}</span>
          <span className="w-16 text-right text-xs text-gray-400">{m.leagueName}</span>
        </Link>
      ))}
    </div>
  );
}
