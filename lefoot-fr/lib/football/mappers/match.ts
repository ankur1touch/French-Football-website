import type { Match, MatchStatus, LiveScore } from "@/types/match";
import type { ApiFixtureItem } from "../types";

const LIVE_STATUSES = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
const UPCOMING_STATUSES = new Set(["NS", "TBD", "PST"]);

function mapStatus(short?: string): MatchStatus {
  if (!short) return "upcoming";
  if (LIVE_STATUSES.has(short)) return "live";
  if (FINISHED_STATUSES.has(short)) return "finished";
  if (UPCOMING_STATUSES.has(short)) return "upcoming";
  return "finished";
}

function normalizeFixture(item: ApiFixtureItem): ApiFixtureItem {
  if (item.fixture) return item;
  return {
    ...item,
    fixture: {
      id: item.fixtureId ?? 0,
      date: item.date ?? new Date().toISOString(),
      venue: { name: null },
      status: { short: "NS" },
    },
  };
}

export function mapFixtureToMatch(item: ApiFixtureItem, forceStatus?: MatchStatus): Match {
  const f = normalizeFixture(item);
  const statusShort = f.fixture?.status?.short;
  const status = forceStatus ?? mapStatus(statusShort);
  const homeScore =
    f.goals?.home ?? f.score?.fulltime?.home ?? (status === "upcoming" ? null : 0);
  const awayScore =
    f.goals?.away ?? f.score?.fulltime?.away ?? (status === "upcoming" ? null : 0);

  return {
    id: String(f.fixture?.id ?? item.fixtureId ?? ""),
    homeTeam: f.teams?.home?.name ?? "—",
    awayTeam: f.teams?.away?.name ?? "—",
    homeTeamId: f.teams?.home?.id ? String(f.teams.home.id) : undefined,
    awayTeamId: f.teams?.away?.id ? String(f.teams.away.id) : undefined,
    homeLogo: f.teams?.home?.logo,
    awayLogo: f.teams?.away?.logo,
    homeScore: status === "upcoming" ? null : homeScore,
    awayScore: status === "upcoming" ? null : awayScore,
    status,
    competition: f.league?.name ?? "Football",
    date: f.fixture?.date ?? item.date ?? new Date().toISOString(),
    venue: f.fixture?.venue?.name ?? f.fixture?.venue?.city ?? "—",
  };
}

export function mapFixtureToLiveScore(item: ApiFixtureItem): LiveScore {
  const match = mapFixtureToMatch(item, "live");
  return {
    id: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeLogo: match.homeLogo,
    awayLogo: match.awayLogo,
    homeScore: match.homeScore ?? 0,
    awayScore: match.awayScore ?? 0,
  };
}

export function mapFixtures(items: ApiFixtureItem[]): Match[] {
  return items.map((item) => mapFixtureToMatch(item));
}
