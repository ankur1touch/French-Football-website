"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import Skeleton from "@/components/ui/Skeleton";
import {
  useLocalizedPath,
  useTranslations,
} from "@/components/providers/LocaleProvider";

export default function TopScorersWidget() {
  const { players, status } = useAppSelector((state) => state.players);
  const lp = useLocalizedPath();
  const t = useTranslations();

  if (status === "loading" || status === "idle") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
      </div>
    );
  }

  const top = [...players]
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 5);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-700">
        {t.home.topScorers}
      </h2>
      {top.length === 0 ? (
        <p className="text-sm text-gray-500">{t.home.topScorersEmpty}</p>
      ) : (
        <ol className="divide-y divide-gray-100">
          {top.map((player, index) => (
            <li key={player.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-sm font-bold text-primary">{index + 1}</span>
                <div>
                  <Link
                    href={lp(`joueurs/${player.id}`)}
                    className="text-sm font-medium text-gray-900 hover:text-primary"
                  >
                    {player.name}
                  </Link>
                  <p className="text-xs text-gray-500">{player.club}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gold">{player.stats.goals}</span>
            </li>
          ))}
        </ol>
      )}
      <Link
        href={lp("joueurs")}
        className="mt-3 inline-block text-xs font-medium text-primary-light hover:underline"
      >
        {t.home.viewAllPlayers}
      </Link>
    </div>
  );
}
