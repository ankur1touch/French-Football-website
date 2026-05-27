"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import TeamCrest from "@/components/ui/TeamCrest";
import Badge from "@/components/ui/Badge";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

export default function MatchTickerStrip() {
  const { scores, status } = useAppSelector((s) => s.livescores);
  const t = useTranslations();
  const lp = useLocalizedPath();

  if (status !== "succeeded" || !scores.length) return null;

  return (
    <div className="border-b border-gray-200 bg-white py-2">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 scrollbar-none">
        <Badge variant="live" className="shrink-0 text-[10px]">
          {t.common.live}
        </Badge>
        {scores.map((s) => (
          <Link
            key={s.id}
            href={lp(`matchs/${s.id}`)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium hover:border-primary"
          >
            <TeamCrest name={s.homeTeam} logo={s.homeLogo} size={18} />
            <span>{s.homeTeam}</span>
            <span className="font-bold text-primary">
              {s.homeScore}-{s.awayScore}
            </span>
            <span>{s.awayTeam}</span>
            <TeamCrest name={s.awayTeam} logo={s.awayLogo} size={18} />
          </Link>
        ))}
      </div>
    </div>
  );
}
