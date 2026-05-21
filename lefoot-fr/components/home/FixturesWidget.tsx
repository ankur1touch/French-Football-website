"use client";

import { useAppSelector } from "@/store/hooks";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import Skeleton from "@/components/ui/Skeleton";
import {
  useLocale,
  useTranslations,
} from "@/components/providers/LocaleProvider";

export default function FixturesWidget() {
  const { matches, status } = useAppSelector((state) => state.matches);
  const locale = useLocale();
  const t = useTranslations();
  const dateLocale = locale === "en" ? enUS : fr;

  const upcoming = matches.filter((m) => m.status === "upcoming").slice(0, 3);

  if (status === "loading" || status === "idle") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Skeleton className="mb-4 h-5 w-36" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
        {t.home.upcomingMatches}
      </h2>
      <div className="divide-y divide-gray-100">
        {upcoming.length === 0 ? (
          <p className="py-3 text-sm text-gray-500">{t.home.upcomingEmpty}</p>
        ) : (
          upcoming.map((match) => (
            <div key={match.id} className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-gray-900">
                {match.homeTeam} vs {match.awayTeam}
              </span>
              <span className="text-xs font-medium text-primary-light">
                {format(new Date(match.date), "EEE d MMM", { locale: dateLocale })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
