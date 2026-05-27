"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import TeamCrest from "@/components/ui/TeamCrest";
import { useLocalizedPath, useTranslations } from "@/components/providers/LocaleProvider";

export default function UpcomingMatchesStrip() {
  const { matches } = useAppSelector((s) => s.matches);
  const t = useTranslations();
  const lp = useLocalizedPath();

  const upcoming = matches.filter((m) => m.status === "upcoming").slice(0, 8);
  if (!upcoming.length) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-lg uppercase tracking-wider text-gray-800">
        {t.home.upcomingMatches}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {upcoming.map((m) => (
          <Link
            key={m.id}
            href={lp(`matchs/${m.id}`)}
            className="flex min-w-[180px] shrink-0 flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <TeamCrest name={m.homeTeam} logo={m.homeLogo} size={28} />
              <span className="text-xs text-gray-400">vs</span>
              <TeamCrest name={m.awayTeam} logo={m.awayLogo} size={28} />
            </div>
            <p className="text-center text-xs font-semibold text-gray-800">
              {m.homeTeam} vs {m.awayTeam}
            </p>
            <p className="text-[10px] text-gray-400">{m.competition}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
