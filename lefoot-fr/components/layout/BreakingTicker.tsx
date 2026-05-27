"use client";

import { useAppSelector } from "@/store/hooks";
import Badge from "@/components/ui/Badge";
import { useTranslations } from "@/components/providers/LocaleProvider";

const fallbackHeadlinesFr = [
  "PSG remporte la Ligue des Champions 4-2",
  "Mbappé Ballon d'Or 2026 favori",
  "Coupe du Monde 2026 : groupes confirmés",
];

const fallbackHeadlinesEn = [
  "PSG wins the Champions League 4-2",
  "Mbappé Ballon d'Or 2026 favourite",
  "World Cup 2026: groups confirmed",
];

export default function BreakingTicker() {
  const { articles } = useAppSelector((state) => state.news);
  const t = useTranslations();

  const fallback = t.nav.news === "News" ? fallbackHeadlinesEn : fallbackHeadlinesFr;
  const headlines =
    articles.length > 0 ? articles.slice(0, 5).map((a) => a.title) : fallback;

  const tickerText = headlines.join(" · ");

  return (
    <div className="bg-live-red text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-1.5">
        <Badge variant="direct" className="shrink-0 bg-white/20 text-[10px] text-white">
          {t.common.breaking}
        </Badge>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-sm font-medium">
            <span>{tickerText}</span>
            <span className="mx-8">{tickerText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
