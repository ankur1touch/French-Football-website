"use client";

import type { PlayerStatistics } from "@/types/player";

const STAT_CARDS = [
  { key: "goals.total", labelKey: "goals" as const },
  { key: "goals.assists", labelKey: "assists" as const },
  { key: "games.appearences", labelKey: "apps" as const },
  { key: "games.minutes", labelKey: "minutes" as const },
  { key: "shots.total", labelKey: "shots" as const },
  { key: "passes.key", labelKey: "keyPasses" as const },
  { key: "tackles.total", labelKey: "tackles" as const },
  { key: "cards.yellow", labelKey: "yellow" as const },
];

const LABELS: Record<string, { fr: string; en: string }> = {
  goals: { fr: "Buts", en: "Goals" },
  assists: { fr: "Passes D.", en: "Assists" },
  apps: { fr: "Matchs", en: "Apps" },
  minutes: { fr: "Minutes", en: "Minutes" },
  shots: { fr: "Tirs", en: "Shots" },
  keyPasses: { fr: "Passes clés", en: "Key passes" },
  tackles: { fr: "Tacles", en: "Tackles" },
  yellow: { fr: "Jaunes", en: "Yellow" },
};

function getNestedValue(obj: Record<string, unknown>, path: string): string | number {
  const val = path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return null;
  }, obj);
  return (val as string | number) ?? "–";
}

interface PlayerSeasonStatsProps {
  statistics: PlayerStatistics[];
  title: string;
  locale?: string;
}

export default function PlayerSeasonStats({
  statistics,
  title,
  locale = "fr",
}: PlayerSeasonStatsProps) {
  if (!statistics?.length) return null;
  const stat = statistics[0];
  const lang = locale === "en" ? "en" : "fr";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-gray-700">
        {title} — {stat.league?.season}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-xl font-bold text-primary">
              {String(getNestedValue(stat as unknown as Record<string, unknown>, card.key))}
            </div>
            <div className="mt-0.5 text-xs text-gray-400">
              {LABELS[card.labelKey][lang]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
