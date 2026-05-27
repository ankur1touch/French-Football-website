"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFifaRankings } from "@/store/features/fifaRankingsSlice";
import TeamCrest from "@/components/ui/TeamCrest";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "@/components/providers/LocaleProvider";

export default function FifaRankingsWidget() {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((s) => s.fifaRankings);
  const t = useTranslations();

  useEffect(() => {
    if (status === "idle") dispatch(fetchFifaRankings());
  }, [dispatch, status]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Skeleton className="mb-3 h-5 w-32" />
        <SkeletonListPlaceholder />
      </div>
    );
  }

  const rows = data?.rankings.slice(0, 10) ?? [];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="font-display text-sm uppercase tracking-wider text-gray-800">
        {t.home.fifaRankings}
      </h3>
      <ol className="mt-3 space-y-2">
        {rows.map((row) => (
          <li key={row.teamId} className="flex items-center gap-2 text-sm">
            <span className="w-5 font-bold text-gray-400">{row.rank}</span>
            <TeamCrest name={row.team} logo={row.logo} size={22} />
            <span className="flex-1 truncate font-medium text-gray-800">{row.team}</span>
            <span className="text-xs font-bold text-primary">{row.points}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SkeletonListPlaceholder() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  );
}
