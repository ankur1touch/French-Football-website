"use client";

import Link from "next/link";
import type { Match } from "@/types/match";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import LiveBadge from "./LiveBadge";
import TeamLogo from "./TeamLogo";
import {
  useLocalizedPath,
  useLocale,
  useTranslations,
} from "@/components/providers/LocaleProvider";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const lp = useLocalizedPath();
  const locale = useLocale();
  const t = useTranslations();
  const dateLocale = locale === "en" ? enUS : fr;
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";

  return (
    <Link
      href={lp(`matchs/${match.id}`)}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-2">
        <span className="truncate text-xs font-semibold uppercase tracking-wide text-gray-500">
          {match.competition}
        </span>
        {isLive ? (
          <LiveBadge />
        ) : (
          <span className="shrink-0 text-xs text-gray-400">
            {format(new Date(match.date), "EEE d MMM · HH:mm", { locale: dateLocale })}
          </span>
        )}
      </div>

      <div className="px-4 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamLogo src={match.homeLogo} name={match.homeTeam} size="md" />
            <span className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 group-hover:text-primary">
              {match.homeTeam}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex min-w-[4.5rem] flex-col items-center justify-center">
            {isLive || isFinished ? (
              <span className="text-2xl font-bold tabular-nums text-primary">
                {match.homeScore}
                <span className="mx-1 text-gray-300">-</span>
                {match.awayScore}
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                vs
              </span>
            )}
            {isFinished && (
              <span className="mt-1 text-[10px] font-medium uppercase text-gray-400">
                {t.matches.tabs.finished}
              </span>
            )}
            {isUpcoming && (
              <span className="mt-1 text-[10px] font-medium text-primary-light">
                {format(new Date(match.date), "HH:mm", { locale: dateLocale })}
              </span>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamLogo src={match.awayLogo} name={match.awayTeam} size="md" />
            <span className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 group-hover:text-primary">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {match.venue && match.venue !== "—" && (
          <p className="mt-4 truncate text-center text-xs text-gray-400">{match.venue}</p>
        )}
      </div>
    </Link>
  );
}
