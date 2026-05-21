"use client";

import { useAppSelector } from "@/store/hooks";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "@/components/providers/LocaleProvider";

export default function LiveScoreStrip() {
  const { scores, status } = useAppSelector((state) => state.livescores);
  const t = useTranslations();

  if (status === "loading" || (status === "idle" && scores.length === 0)) {
    return (
      <div className="bg-primary py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4">
          <Skeleton className="h-6 w-16 shrink-0" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-32 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="bg-primary py-3">
        <div className="mx-auto max-w-7xl px-4 text-sm text-white/80">
          {t.home.noLiveMatches}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4">
        <Badge variant="live" className="shrink-0 gap-1">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          {t.common.live}
        </Badge>
        {scores.map((score) => (
          <div
            key={score.id}
            className="flex shrink-0 items-center gap-2 text-sm text-white"
          >
            <span>{score.homeTeam}</span>
            <span>vs</span>
            <span>{score.awayTeam}</span>
            <span className="font-bold text-gold">
              {score.homeScore}-{score.awayScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
