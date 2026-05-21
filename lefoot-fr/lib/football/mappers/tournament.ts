import type {
  Tournament,
  TournamentCategory,
  TopScorer,
  TournamentGroupStandings,
} from "@/types/tournament";
import type { ApiLeague, ApiStandingsBlock, ApiTopScorerItem } from "../types";
import { mapStandingRow } from "./ranking";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop";

function mapCategory(type?: string, name?: string): TournamentCategory {
  const n = (name ?? "").toLowerCase();
  if (
    n.includes("champions") ||
    n.includes("europa") ||
    n.includes("coupe d'afrique") ||
    n.includes("afcon")
  ) {
    return "Continental";
  }
  if (n.includes("world") || n.includes("coupe du monde")) {
    return "International";
  }
  if (type === "Cup" || n.includes("coupe")) {
    return n.includes("france") ? "Domestique" : "International";
  }
  return "Domestique";
}

function buildGroups(standings: ApiStandingsBlock[]): TournamentGroupStandings[] {
  const block = standings[0] ?? {};
  const tables = block.standings ?? block.league?.standings ?? [];
  if (tables.length <= 1) return [];

  return tables.map((table, index) => ({
    name: table[0]?.group ?? `Groupe ${String.fromCharCode(65 + index)}`,
    standings: table.map(mapStandingRow),
  }));
}

export function mapLeagueToTournament(
  item: ApiLeague,
  standings: ApiStandingsBlock[] = [],
  topScorers: ApiTopScorerItem[] = []
): Tournament {
  const league = item.league ?? { id: 0, name: "Compétition", type: "League" };
  const season = item.seasons?.find((s) => s.year) ?? item.seasons?.[0];
  const standingBlock = standings.find((s) => s.league?.id === league.id) ?? standings[0];
  const groups = buildGroups(standings);
  const table = standingBlock?.standings?.[0] ?? standingBlock?.league?.standings?.[0] ?? [];

  const scorers: TopScorer[] = topScorers.slice(0, 10).map((s, i) => ({
    rank: i + 1,
    player: s.player?.name ?? "—",
    club: s.statistics?.[0]?.team?.name ?? "—",
    goals: s.statistics?.[0]?.goals?.total ?? 0,
  }));

  return {
    id: String(league.id),
    name: league.name,
    category: mapCategory(league.type, league.name),
    startDate: season?.start ?? `${new Date().getFullYear()}-06-01`,
    endDate: season?.end ?? `${new Date().getFullYear()}-07-15`,
    host: item.country?.name ?? league.country ?? "Monde",
    image: league.logo ?? DEFAULT_IMAGE,
    standings: table.map(mapStandingRow),
    topScorers: scorers,
    groups: groups.length ? groups : undefined,
  };
}

export function mapLeagues(items: ApiLeague[]): Tournament[] {
  return items.map((item) => mapLeagueToTournament(item));
}
