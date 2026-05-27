"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import TeamCrest from "@/components/ui/TeamCrest";
import Badge from "@/components/ui/Badge";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

function getCountdown(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export default function MatchOfTheDay() {
  const { matches } = useAppSelector((s) => s.matches);
  const t = useTranslations();
  const lp = useLocalizedPath();
  const [countdown, setCountdown] = useState<string | null>(null);

  const featured =
    matches.find((m) => m.status === "live") ??
    matches.find((m) => m.status === "upcoming");

  useEffect(() => {
    if (!featured?.date) return;
    setCountdown(getCountdown(featured.date));
    const timer = setInterval(() => setCountdown(getCountdown(featured.date)), 1000);
    return () => clearInterval(timer);
  }, [featured?.date]);

  if (!featured) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-wider text-gray-700">
          {t.home.matchOfDay}
        </h3>
        {featured.status === "live" ? (
          <Badge variant="live">{t.common.live}</Badge>
        ) : countdown ? (
          <span className="text-xs font-bold text-primary">{countdown}</span>
        ) : null}
      </div>
      <Link href={lp(`matchs/${featured.id}`)} className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center gap-1">
          <TeamCrest name={featured.homeTeam} logo={featured.homeLogo} size={40} />
          <span className="text-center text-xs font-semibold">{featured.homeTeam}</span>
        </div>
        <div className="font-display text-2xl text-primary">
          {featured.homeScore ?? "-"} : {featured.awayScore ?? "-"}
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <TeamCrest name={featured.awayTeam} logo={featured.awayLogo} size={40} />
          <span className="text-center text-xs font-semibold">{featured.awayTeam}</span>
        </div>
      </Link>
      <p className="mt-2 text-center text-xs text-gray-500">{featured.competition}</p>
    </div>
  );
}
