import type { Match } from "@/types/match";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import LiveBadge from "./LiveBadge";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{match.competition}</span>
        {isLive && <LiveBadge />}
        {!isLive && (
          <span className="text-xs text-gray-400">
            {format(new Date(match.date), "EEE d MMM · HH:mm", { locale: fr })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <span className="font-semibold text-gray-900">{match.homeTeam}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isLive || isFinished ? (
            <span className="text-xl font-bold text-primary">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="text-sm font-medium text-gray-400">vs</span>
          )}
        </div>
        <div className="flex-1">
          <span className="font-semibold text-gray-900">{match.awayTeam}</span>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-gray-400">{match.venue}</p>
    </div>
  );
}
