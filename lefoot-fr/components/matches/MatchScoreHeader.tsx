"use client";

import Image from "next/image";
import Link from "next/link";
import type { MatchDetail } from "@/types/matchDetail";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

interface MatchScoreHeaderProps {
  match: MatchDetail;
}

export default function MatchScoreHeader({ match }: MatchScoreHeaderProps) {
  const lp = useLocalizedPath();
  const t = useTranslations();
  const { fixture, teams, goals, league } = match;

  const short = fixture.status.short;
  const statusLabel =
    short === "FT"
      ? t.detail.match.final
      : short === "HT"
        ? t.detail.match.halftime
        : short === "NS"
          ? fixture.date.slice(0, 10)
          : fixture.status.elapsed
            ? `${fixture.status.elapsed}'`
            : fixture.status.long;

  const isLive = !["FT", "NS", "TBD", "PST"].includes(short);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="mb-4 text-center text-xs text-gray-500">
        {league.name}
        {fixture.round ? ` · ${fixture.round.replace("Regular Season - ", "")}` : ""}
      </p>

      <div className="flex items-center justify-between gap-4">
        <Link
          href={lp(`equipes/${teams.home.id}`)}
          className="flex flex-1 flex-col items-center gap-2 hover:opacity-80"
        >
          {teams.home.logo ? (
            <Image
              src={teams.home.logo}
              alt={teams.home.name}
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              ⚽
            </div>
          )}
          <span className="text-center text-sm font-semibold">{teams.home.name}</span>
        </Link>

        <div className="text-center">
          <div className="text-4xl font-bold tracking-tight text-primary">
            {goals.home ?? "–"} : {goals.away ?? "–"}
          </div>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
              isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <Link
          href={lp(`equipes/${teams.away.id}`)}
          className="flex flex-1 flex-col items-center gap-2 hover:opacity-80"
        >
          {teams.away.logo ? (
            <Image
              src={teams.away.logo}
              alt={teams.away.name}
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              ⚽
            </div>
          )}
          <span className="text-center text-sm font-semibold">{teams.away.name}</span>
        </Link>
      </div>

      {fixture.venue?.name && (
        <p className="mt-3 text-center text-xs text-gray-400">
          {fixture.venue.name}
          {fixture.venue.city ? `, ${fixture.venue.city}` : ""}
        </p>
      )}
    </div>
  );
}
