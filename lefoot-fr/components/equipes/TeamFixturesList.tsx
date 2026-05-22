"use client";

import Image from "next/image";
import Link from "next/link";
import type { H2HMatch } from "@/types/matchDetail";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

interface TeamFixturesListProps {
  matches: H2HMatch[];
}

export default function TeamFixturesList({ matches }: TeamFixturesListProps) {
  const lp = useLocalizedPath();
  const t = useTranslations();

  if (!matches?.length) {
    return <p className="py-8 text-center text-gray-400">{t.detail.team.noFixtures}</p>;
  }

  return (
    <div className="space-y-2">
      {matches.map((m) => (
        <Link
          key={m.fixtureId}
          href={lp(`matchs/${m.fixtureId}`)}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50"
        >
          <span className="w-24 text-xs text-gray-400">{m.date.slice(0, 10)}</span>
          {m.homeTeam.logo ? (
            <Image
              src={m.homeTeam.logo}
              alt={m.homeTeam.name}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          ) : null}
          <span className="flex-1 text-sm font-medium">{m.homeTeam.name}</span>
          <span className="text-sm font-bold tabular-nums text-primary">
            {m.homeScore ?? "–"} – {m.awayScore ?? "–"}
          </span>
          <span className="flex-1 text-right text-sm font-medium">{m.awayTeam.name}</span>
          {m.awayTeam.logo ? (
            <Image
              src={m.awayTeam.logo}
              alt={m.awayTeam.name}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          ) : null}
        </Link>
      ))}
    </div>
  );
}
