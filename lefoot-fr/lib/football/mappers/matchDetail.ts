import type {
  H2HMatch,
  MatchDetail,
  MatchDetailTeam,
  MatchEvent,
  MatchLineup,
  MatchStat,
} from "@/types/matchDetail";
import type { ApiFixtureItem } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapTeam(team?: { id?: number; name?: string; logo?: string }): MatchDetailTeam {
  return {
    id: team?.id ?? 0,
    name: team?.name ?? "—",
    logo: team?.logo ?? "",
  };
}

export function mapFixtureToH2H(item: ApiFixtureItem): H2HMatch {
  const f = item.fixture ?? { id: item.fixtureId ?? 0, date: item.date ?? "" };
  return {
    fixtureId: f.id ?? item.fixtureId ?? 0,
    date: f.date ?? item.date ?? "",
    leagueName: item.league?.name ?? "—",
    homeTeam: mapTeam(item.teams?.home),
    awayTeam: mapTeam(item.teams?.away),
    homeScore: item.goals?.home ?? item.score?.fulltime?.home ?? null,
    awayScore: item.goals?.away ?? item.score?.fulltime?.away ?? null,
  };
}

export function mapEvents(raw: any[]): MatchEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((ev) => (ev.time?.elapsed ?? 0) >= 0)
    .map((ev) => ({
    time: {
      elapsed: ev.time?.elapsed ?? 0,
      extra: ev.time?.extra ?? null,
    },
    team: mapTeam(ev.team),
    player: {
      id: ev.player?.id ?? 0,
      name: ev.player?.name ?? "—",
    },
    assist: {
      id: ev.assist?.id ?? null,
      name: ev.assist?.name ?? null,
    },
    type: ev.type ?? "",
    detail: ev.detail ?? "",
  }));
}

export function mapLineups(raw: any[]): MatchLineup[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((lu) => ({
    team: mapTeam(lu.team),
    formation: lu.formation ?? "—",
    startXI: (lu.startXI ?? []).map((p: any) => ({
      player: {
        id: p.player?.id ?? 0,
        name: p.player?.name ?? "—",
        number: p.player?.number ?? 0,
        pos: p.player?.pos ?? "",
        grid: p.player?.grid ?? null,
      },
    })),
    substitutes: (lu.substitutes ?? []).map((p: any) => ({
      player: {
        id: p.player?.id ?? 0,
        name: p.player?.name ?? "—",
        number: p.player?.number ?? 0,
        pos: p.player?.pos ?? "",
        grid: p.player?.grid ?? null,
      },
    })),
    coach: lu.coach
      ? { id: lu.coach.id ?? 0, name: lu.coach.name ?? "—", photo: lu.coach.photo }
      : undefined,
  }));
}

export function mapMatchStats(raw: any[]): MatchStat[][] {
  if (!Array.isArray(raw)) return [];
  return raw.map((teamStats) =>
    (teamStats.statistics ?? []).map((s: any) => ({
      type: s.type ?? "",
      value: s.value ?? null,
    }))
  );
}

export function buildMatchDetail(
  fixture: ApiFixtureItem,
  events: any[],
  lineups: any[],
  stats: any[],
  h2h: ApiFixtureItem[]
): MatchDetail {
  const f = fixture.fixture ?? {
    id: fixture.fixtureId ?? 0,
    date: fixture.date ?? "",
    status: { short: "NS", long: "Not Started" },
  };

  return {
    fixture: {
      id: f.id ?? fixture.fixtureId ?? 0,
      date: f.date ?? fixture.date ?? "",
      round: (f as any).round,
      venue: f.venue
        ? {
            name: f.venue.name ?? undefined,
            city: f.venue.city ?? undefined,
          }
        : undefined,
      status: {
        short: f.status?.short ?? "NS",
        long: f.status?.long ?? "Not Started",
        elapsed: f.status?.elapsed ?? null,
      },
    },
    league: {
      id: fixture.league?.id ?? 0,
      name: fixture.league?.name ?? "—",
      season: fixture.league?.season,
    },
    teams: {
      home: mapTeam(fixture.teams?.home),
      away: mapTeam(fixture.teams?.away),
    },
    goals: {
      home: fixture.goals?.home ?? fixture.score?.fulltime?.home ?? null,
      away: fixture.goals?.away ?? fixture.score?.fulltime?.away ?? null,
    },
    events: mapEvents(events),
    lineups: mapLineups(lineups),
    stats: mapMatchStats(stats),
    h2h: h2h.map(mapFixtureToH2H),
  };
}

export function mapPlayerStatisticsDetail(raw: any): import("@/types/player").PlayerStatistics | null {
  if (!raw) return null;
  const s = raw.statistics?.[0] ?? raw;
  const team = s.team ?? {};
  const league = s.league ?? {};
  const games = s.games ?? {};
  const goals = s.goals ?? {};
  const shots = s.shots ?? {};
  const passes = s.passes ?? {};
  const tackles = s.tackles ?? {};
  const cards = s.cards ?? {};

  return {
    team: {
      id: team.id ?? 0,
      name: team.name ?? "—",
      logo: team.logo ?? "",
    },
    league: {
      id: league.id ?? 0,
      name: league.name ?? "—",
      country: league.country ?? "",
      logo: league.logo ?? "",
      season: league.season ?? new Date().getFullYear(),
    },
    games: {
      appearences: games.appearences ?? games.appearances ?? 0,
      lineups: games.lineups ?? 0,
      minutes: games.minutes ?? 0,
      position: games.position ?? "—",
      rating: games.rating ?? "—",
    },
    goals: {
      total: goals.total ?? 0,
      assists: goals.assists ?? 0,
      saves: goals.saves ?? null,
    },
    shots: { total: shots.total ?? 0, on: shots.on ?? 0 },
    passes: { total: passes.total ?? 0, key: passes.key ?? 0, accuracy: passes.accuracy ?? 0 },
    tackles: {
      total: tackles.total ?? 0,
      blocks: tackles.blocks ?? 0,
      interceptions: tackles.interceptions ?? 0,
    },
    cards: {
      yellow: cards.yellow ?? 0,
      yellowred: cards.yellowred ?? 0,
      red: cards.red ?? 0,
    },
  };
}

export function mapPlayerInfo(raw: any): import("@/types/player").PlayerInfo {
  const p = raw.player ?? raw;
  return {
    id: p.id ?? 0,
    name: p.name ?? "—",
    firstname: p.firstname ?? "",
    lastname: p.lastname ?? "",
    age: p.age ?? 0,
    nationality: p.nationality ?? "—",
    height: p.height ?? "—",
    weight: p.weight ?? "—",
    injured: p.injured ?? false,
    photo: p.photo ?? "",
  };
}

export function mapTeamInfo(raw: any): import("@/types/team").TeamInfo {
  const t = raw.team ?? raw;
  const v = raw.venue ?? t.venue ?? {};
  return {
    id: t.id ?? 0,
    name: t.name ?? "—",
    code: t.code ?? "",
    country: t.country ?? raw.country?.name ?? "—",
    founded: t.founded ?? 0,
    logo: t.logo ?? "",
    venue: {
      id: v.id ?? 0,
      name: v.name ?? "—",
      address: v.address ?? "",
      city: v.city ?? "",
      capacity: v.capacity ?? 0,
      image: v.image ?? "",
    },
  };
}

export function mapDetailSquad(raw: any[]): import("@/types/team").DetailSquadPlayer[] {
  if (!Array.isArray(raw)) return [];
  const players = raw[0]?.players ?? raw;
  if (!Array.isArray(players)) return [];
  return players.map((p: any) => ({
    id: p.id ?? 0,
    name: p.name ?? "—",
    age: p.age ?? 0,
    number: p.number ?? null,
    position: p.position ?? "—",
    photo: p.photo ?? "",
  }));
}

export function mapTeamDetailStanding(raw: any): import("@/types/team").TeamDetailStandingRow {
  return {
    rank: raw.rank ?? 0,
    team: {
      id: raw.team?.id ?? 0,
      name: raw.team?.name ?? "—",
      logo: raw.team?.logo ?? "",
    },
    points: raw.points ?? 0,
    all: {
      played: raw.all?.played ?? 0,
      win: raw.all?.win ?? 0,
      draw: raw.all?.draw ?? 0,
      lose: raw.all?.lose ?? 0,
      goals: {
        for: raw.all?.goals?.for ?? 0,
        against: raw.all?.goals?.against ?? 0,
      },
    },
    description: raw.description,
    form: raw.form,
  };
}
