"use client";

import Link from "next/link";
import type { MatchEvent, MatchDetailTeam } from "@/types/matchDetail";
import { useLocalizedPath } from "@/components/providers/LocaleProvider";
import { useTranslations } from "@/components/providers/LocaleProvider";

const ICON: Record<string, string> = {
  Goal: "⚽",
  subst: "🔄",
  Card: "🟡",
  Var: "📺",
};

function eventIcon(type: string, detail: string) {
  if (type === "Goal") return ICON.Goal;
  if (type === "subst") return ICON.subst;
  if (detail.toLowerCase().includes("red")) return "🔴";
  if (detail.toLowerCase().includes("yellow")) return "🟡";
  return "•";
}

interface MatchEventTimelineProps {
  events: MatchEvent[];
  homeTeam: MatchDetailTeam;
}

export default function MatchEventTimeline({ events, homeTeam }: MatchEventTimelineProps) {
  const lp = useLocalizedPath();
  const t = useTranslations();

  if (!events?.length) {
    return <p className="py-8 text-center text-gray-400">{t.detail.match.noEvents}</p>;
  }

  return (
    <div className="space-y-2">
      {events.map((ev, i) => {
        const isHome = ev.team.id === homeTeam.id;
        return (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 ${
              isHome ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <span className="text-lg">{eventIcon(ev.type, ev.detail)}</span>
            <span className="w-8 text-center text-xs font-bold text-gray-400">
              {ev.time.elapsed}&apos;
            </span>
            <div className={`flex-1 ${isHome ? "text-left" : "text-right"}`}>
              {ev.player.id ? (
                <Link
                  href={lp(`joueurs/${ev.player.id}`)}
                  className="text-sm font-semibold hover:text-primary"
                >
                  {ev.player.name}
                </Link>
              ) : (
                <span className="text-sm font-semibold">{ev.player.name}</span>
              )}
              {ev.assist?.name && (
                <span className="ml-1 text-xs text-gray-400">
                  (
                  {ev.assist.id ? (
                    <Link
                      href={lp(`joueurs/${ev.assist.id}`)}
                      className="hover:text-primary"
                    >
                      {ev.assist.name}
                    </Link>
                  ) : (
                    ev.assist.name
                  )}
                  )
                </span>
              )}
              <p className="text-xs text-gray-400">{ev.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
