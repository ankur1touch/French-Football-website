"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

function StripLogo({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 object-contain"
      />
    );
  }
  return null;
}

export default function LiveScoreStrip() {
  const { scores, status } = useAppSelector((state) => state.livescores);
  const t = useTranslations();
  const lp = useLocalizedPath();

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
          <Link
            key={score.id}
            href={lp(`matchs/${score.id}`)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white hover:bg-white/10 hover:text-gold"
          >
            <StripLogo src={score.homeLogo} name={score.homeTeam} />
            <span className="max-w-[5rem] truncate">{score.homeTeam}</span>
            <span className="font-bold text-gold">
              {score.homeScore}-{score.awayScore}
            </span>
            <span className="max-w-[5rem] truncate">{score.awayTeam}</span>
            <StripLogo src={score.awayLogo} name={score.awayTeam} />
          </Link>
        ))}
      </div>
    </div>
  );
}
