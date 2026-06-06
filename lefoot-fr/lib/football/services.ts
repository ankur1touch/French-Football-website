import { footballConfig } from "./config";
import { fetchFootball } from "./client";
import type {
  ApiFixtureItem,
  ApiLeague,
  ApiSquadItem,
  ApiStandingsBlock,
  ApiTeamItem,
  ApiTopScorerItem,
  ApiTransferItem,
} from "./types";
import { mapFixtures, mapFixtureToLiveScore } from "./mappers/match";
import { mapRankings } from "./mappers/ranking";
import { mapLeagueToTournament, mapLeagues } from "./mappers/tournament";
import { mapTeamItem, mapNationalTeamId } from "./mappers/team";
import { mapTopScorers } from "./mappers/player";
import { mapTransfers } from "./mappers/transfer";
import type { Match, LiveScore } from "@/types/match";
import type { RankingsData } from "@/types/ranking";
import type { Tournament } from "@/types/tournament";
import type { Team } from "@/types/team";
import type { Player } from "@/types/player";
import type { Transfer } from "@/types/transfer";
import type { MatchDetail } from "@/types/matchDetail";
import type { PlayerDetailResponse } from "@/types/player";
import type { TeamDetailResponse } from "@/types/team";
import type { FifaRankingsData } from "@/types/fifa";
import { countryIdToTeamId } from "@/lib/countries";
import { getAllArticles } from "@/lib/articles";
import { getRssArticles } from "@/lib/rss-news";
import {
  buildMatchDetail,
  mapDetailSquad,
  mapFixtureToH2H,
  mapPlayerInfo,
  mapPlayerStatisticsDetail,
  mapTeamDetailStanding,
  mapTeamInfo,
} from "./mappers/matchDetail";
import { readLocalJSON } from "@/lib/data";

const { season, primaryLeagueId, worldCupId } = footballConfig;

function isPrimaryLeague(item: ApiFixtureItem): boolean {
  const leagueId = item.league?.id;
  return leagueId === primaryLeagueId || leagueId === worldCupId;
}

function filterPrimaryFixtures(items: ApiFixtureItem[]): ApiFixtureItem[] {
  const filtered = items.filter(isPrimaryLeague);
  return filtered.length ? filtered : items;
}

export async function getLiveFixtures(): Promise<ApiFixtureItem[]> {
  try {
    const live = await fetchFootball<ApiFixtureItem[]>("live");
    if (live?.length) return filterPrimaryFixtures(live);
  } catch {
    /* try fixtures?live=all */
  }
  const fixtures = await fetchFootball<ApiFixtureItem[]>("fixtures", { live: "all" });
  return filterPrimaryFixtures(fixtures);
}

export async function getLiveScores(): Promise<LiveScore[]> {
  const items = await getLiveFixtures();
  return items.map(mapFixtureToLiveScore);
}

async function getFinishedFixtures(): Promise<ApiFixtureItem[]> {
  const primary = await fetchFootball<ApiFixtureItem[]>("fixtures", {
    league: primaryLeagueId,
    season,
    last: 15,
  }).catch(() => [] as ApiFixtureItem[]);

  if (primary.length) return primary;

  const wc2022 = await fetchFootball<ApiFixtureItem[]>("fixtures", {
    league: worldCupId,
    season: 2022,
    last: 15,
  }).catch(() => [] as ApiFixtureItem[]);

  if (wc2022.length) return wc2022;

  const recentFt = await fetchFootball<ApiFixtureItem[]>("fixtures", {
    last: 20,
    status: "FT",
  }).catch(() => [] as ApiFixtureItem[]);

  const filtered = filterPrimaryFixtures(recentFt);
  if (filtered.length) return filtered.slice(0, 15);
  if (recentFt.length) return recentFt.slice(0, 15);

  return [];
}

export async function getAllMatches(): Promise<Match[]> {
  const [live, upcoming, finished] = await Promise.all([
    getLiveFixtures().catch(() => [] as ApiFixtureItem[]),
    fetchFootball<ApiFixtureItem[]>("fixtures", {
      league: primaryLeagueId,
      season,
      next: 15,
    }).catch(() => [] as ApiFixtureItem[]),
    getFinishedFixtures(),
  ]);

  const liveMatches = mapFixtures(live).map((m) => ({ ...m, status: "live" as const }));
  const upcomingMatches = mapFixtures(upcoming).map((m) => ({
    ...m,
    status: "upcoming" as const,
  }));
  let finishedMatches = mapFixtures(finished).map((m) => ({
    ...m,
    status: "finished" as const,
  }));

  if (!finishedMatches.length && footballConfig.mockFallback) {
    const mockAll = readLocalJSON<Match[]>("matches.json");
    finishedMatches = mockAll
      .filter((m) => m.status === "finished")
      .map((m) => ({ ...m, status: "finished" as const }));
  }

  const seen = new Set<string>();
  return [...liveMatches, ...upcomingMatches, ...finishedMatches].filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function getRankings(): Promise<RankingsData> {
  const primary = await fetchFootball<ApiStandingsBlock[]>("standings", {
    league: primaryLeagueId,
    season,
  });
  return mapRankings(primary[0] ?? {});
}

async function fetchLeagueById(leagueId: number): Promise<ApiLeague | null> {
  const byId = await fetchFootball<ApiLeague[]>("leagues", { id: leagueId, season });
  if (byId[0]) return byId[0];

  const current = await fetchFootball<ApiLeague[]>("leagues", { id: leagueId, current: "true" });
  return current[0] ?? null;
}

export async function getTournaments(): Promise<Tournament[]> {
  const wc = await getTournamentById(String(worldCupId));
  if (wc) return [wc];

  const leagues = await fetchFootball<ApiLeague[]>("leagues", { country: "France", season });
  return mapLeagues(leagues);
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  const leagueId = Number(id);
  if (Number.isNaN(leagueId)) return null;

  const [standings, topScorers, league] = await Promise.all([
    fetchFootball<ApiStandingsBlock[]>("standings", { league: leagueId, season }),
    fetchFootball<ApiTopScorerItem[]>("topscorers", { league: leagueId, season }),
    fetchLeagueById(leagueId),
  ]);

  if (league) {
    return mapLeagueToTournament(league, standings, topScorers);
  }

  return mapLeagueToTournament(
    {
      league: { id: leagueId, name: `Compétition ${id}`, type: "Cup" },
      country: { name: "Monde" },
    },
    standings,
    topScorers
  );
}

function extractTeamsFromStandings(blocks: ApiStandingsBlock[]): ApiTeamItem[] {
  const block = blocks[0];
  if (!block) return [];

  const tables = block.standings ?? block.league?.standings ?? [];
  const seen = new Set<number>();
  const teams: ApiTeamItem[] = [];

  for (const table of tables) {
    for (const row of table) {
      if (!row.team?.id || seen.has(row.team.id)) continue;
      seen.add(row.team.id);
      teams.push({ team: row.team });
    }
  }
  return teams;
}

export async function getTeams(): Promise<Team[]> {
  const standings = await fetchFootball<ApiStandingsBlock[]>("standings", {
    league: primaryLeagueId,
    season,
  });

  const standingTeams = extractTeamsFromStandings(standings);
  if (standingTeams.length) {
    const teams = await Promise.all(
      standingTeams.map(async (item) => {
        const teamId = item.team?.id;
        if (!teamId) return mapTeamItem(item);
        try {
          const squad = await fetchFootball<ApiSquadItem[]>("players-squads", { team: teamId });
          const standingRow = (standings[0]?.standings?.flat() ??
            standings[0]?.league?.standings?.flat() ??
            []).find((r) => r.team.id === teamId);
          return mapTeamItem(item, { squad: squad[0], standing: standingRow });
        } catch {
          return mapTeamItem(item);
        }
      })
    );
    return teams;
  }

  const nationalTeams: Team[] = await Promise.all(
    footballConfig.nationalTeamIds.map(async (teamId) => {
      try {
        const [teamData, squad] = await Promise.all([
          fetchFootball<ApiTeamItem[]>("teams", { team: teamId }),
          fetchFootball<ApiSquadItem[]>("players-squads", { team: teamId }),
        ]);
        const item = teamData[0] ?? { team: { id: teamId, name: `Team ${teamId}` } };
        return mapTeamItem(item, {
          squad: squad[0],
          slug: mapNationalTeamId(teamId),
        });
      } catch {
        return mapTeamItem(
          { team: { id: teamId, name: mapNationalTeamId(teamId) } },
          { slug: mapNationalTeamId(teamId) }
        );
      }
    })
  );

  return nationalTeams;
}

export async function getTeamById(id: string): Promise<Team | null> {
  const numericId = Number(id);
  const isNumeric = !Number.isNaN(numericId);

  const teamId = isNumeric
    ? numericId
    : footballConfig.nationalTeamIds.find((tid) => mapNationalTeamId(tid) === id);

  if (!teamId) {
    const standings = await fetchFootball<ApiStandingsBlock[]>("standings", {
      league: primaryLeagueId,
      season,
    });
    const standingTeams = extractTeamsFromStandings(standings);
    const club = standingTeams.find((c) => String(c.team?.id) === id);
    if (!club?.team?.id) return null;
    const squad = await fetchFootball<ApiSquadItem[]>("players-squads", {
      team: club.team.id,
    });
    return mapTeamItem(club, { squad: squad[0] });
  }

  const [teamData, squad] = await Promise.all([
    fetchFootball<ApiTeamItem[]>("teams", { team: teamId }),
    fetchFootball<ApiSquadItem[]>("players-squads", { team: teamId }),
  ]);

  const item = teamData[0];
  if (!item) return null;

  return mapTeamItem(item, {
    squad: squad[0],
    slug: isNumeric ? String(teamId) : id,
  });
}

export async function getPlayers(): Promise<Player[]> {
  const scorers = await fetchFootball<ApiTopScorerItem[]>("topscorers", {
    league: primaryLeagueId,
    season,
  });
  return mapTopScorers(scorers);
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const playerId = Number(id);
  if (Number.isNaN(playerId)) return null;

  const stats = await fetchFootball<ApiTopScorerItem[]>("players-statistics", {
    player: playerId,
    season,
    league: primaryLeagueId,
  });

  const item = stats[0];
  if (!item) {
    const scorers = await getPlayers();
    return scorers.find((p) => p.id === id) ?? null;
  }

  return mapTopScorers([item])[0] ?? null;
}

export async function getTransfers(): Promise<Transfer[]> {
  const scorers = await fetchFootball<ApiTopScorerItem[]>("topscorers", {
    league: footballConfig.ligue1Id,
    season: 2024,
  }).catch(() => [] as ApiTopScorerItem[]);

  const playerIds = scorers
    .map((s) => s.player?.id)
    .filter((id): id is number => id !== undefined)
    .slice(0, 12);

  if (!playerIds.length) {
    return readLocalJSON<Transfer[]>("transfers.json").slice(0, 20);
  }

  const results = await Promise.all(
    playerIds.map((player) =>
      fetchFootball<ApiTransferItem[]>("transfers", { player }).catch(
        () => [] as ApiTransferItem[]
      )
    )
  );

  const transfers = mapTransfers(results.flat()).slice(0, 20);

  if (!transfers.length && footballConfig.mockFallback) {
    return readLocalJSON<Transfer[]>("transfers.json").slice(0, 20);
  }

  return transfers;
}

async function resolveTeamNumericId(id: string): Promise<number | null> {
  const numericId = Number(id);
  if (!Number.isNaN(numericId)) return numericId;

  const slugMatch = footballConfig.nationalTeamIds.find(
    (tid) => mapNationalTeamId(tid) === id
  );
  if (slugMatch) return slugMatch;

  const standings = await fetchFootball<ApiStandingsBlock[]>("standings", {
    league: primaryLeagueId,
    season,
  }).catch(() => [] as ApiStandingsBlock[]);
  const standingTeams = extractTeamsFromStandings(standings);
  const club = standingTeams.find((c) => String(c.team?.id) === id);
  return club?.team?.id ?? null;
}

export async function getMatchDetail(id: string): Promise<MatchDetail | null> {
  const fixtureId = Number(id);
  if (Number.isNaN(fixtureId)) return null;

  const fixtures = await fetchFootball<ApiFixtureItem[]>("fixtures", { id: fixtureId }).catch(
    () => [] as ApiFixtureItem[]
  );
  const fixture = fixtures[0];
  if (!fixture) return null;

  const homeId = fixture.teams?.home?.id;
  const awayId = fixture.teams?.away?.id;

  const [lineupsRes, eventsRes, statsRes, h2hRes] = await Promise.allSettled([
    fetchFootball<unknown[]>("lineups", { fixture: fixtureId }),
    fetchFootball<unknown[]>("events", { fixture: fixtureId }),
    fetchFootball<unknown[]>("stats", { fixture: fixtureId }),
    homeId && awayId
      ? fetchFootball<ApiFixtureItem[]>("headtohead", {
          h2h: `${homeId}-${awayId}`,
          last: 5,
        })
      : Promise.resolve([] as ApiFixtureItem[]),
  ]);

  const lineups = lineupsRes.status === "fulfilled" ? lineupsRes.value : [];
  const events = eventsRes.status === "fulfilled" ? eventsRes.value : [];
  const stats = statsRes.status === "fulfilled" ? statsRes.value : [];
  const h2h = h2hRes.status === "fulfilled" ? h2hRes.value : [];

  return buildMatchDetail(fixture, events as never[], lineups as never[], stats as never[], h2h);
}

async function findPlayerInTopScorers(playerId: number): Promise<ApiTopScorerItem | null> {
  const scorers = await fetchFootball<ApiTopScorerItem[]>("topscorers", {
    league: primaryLeagueId,
    season,
  }).catch(() => [] as ApiTopScorerItem[]);
  return scorers.find((s) => s.player?.id === playerId) ?? null;
}

function collectPlayerStatistics(
  profileItem: ApiTopScorerItem | undefined,
  statsData: ApiTopScorerItem[],
  topscorerItem: ApiTopScorerItem | null
): NonNullable<ReturnType<typeof mapPlayerStatisticsDetail>>[] {
  const results: NonNullable<ReturnType<typeof mapPlayerStatisticsDetail>>[] = [];
  const seen = new Set<string>();

  const add = (raw: unknown) => {
    const mapped = mapPlayerStatisticsDetail(raw);
    if (!mapped) return;
    const key = `${mapped.team.id}-${mapped.league.id}-${mapped.league.season}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push(mapped);
  };

  if (profileItem?.statistics?.length) {
    for (const stat of profileItem.statistics) {
      add({ statistics: [stat] });
    }
  }

  for (const item of statsData) {
    add(item);
  }

  if (topscorerItem?.statistics?.length) {
    add(topscorerItem);
  }

  return results;
}

export async function getPlayerDetail(id: string): Promise<PlayerDetailResponse | null> {
  const playerId = Number(id);
  if (Number.isNaN(playerId)) return null;

  const [profileRes, statsRes, fixturesRes, topscorerRes] = await Promise.allSettled([
    fetchFootball<ApiTopScorerItem[]>("players", { id: playerId }),
    fetchFootball<ApiTopScorerItem[]>("players-statistics", {
      player: playerId,
      season,
      league: primaryLeagueId,
    }),
    fetchFootball<ApiFixtureItem[]>("fixtures", { player: playerId, last: 5 }),
    findPlayerInTopScorers(playerId),
  ]);

  const profileData = profileRes.status === "fulfilled" ? profileRes.value : [];
  const statsData = statsRes.status === "fulfilled" ? statsRes.value : [];
  const fixtures = fixturesRes.status === "fulfilled" ? fixturesRes.value : [];
  const topscorerItem = topscorerRes.status === "fulfilled" ? topscorerRes.value : null;

  const profileItem = profileData[0];
  const statsItem = statsData[0];
  const sourceItem = profileItem ?? statsItem ?? topscorerItem;

  if (!sourceItem?.player) {
    const fallback = await getPlayerById(id);
    if (!fallback) return null;
    return {
      player: {
        id: Number(fallback.id),
        name: fallback.name,
        firstname: fallback.name.split(" ")[0] ?? "",
        lastname: fallback.name.split(" ").slice(1).join(" ") ?? "",
        age: fallback.age,
        nationality: fallback.nationality,
        height: "—",
        weight: "—",
        injured: false,
        photo: fallback.image,
      },
      statistics: [],
      recentFixtures: fixtures.map(mapFixtureToH2H),
      bio: fallback.bio,
    };
  }

  const statistics = collectPlayerStatistics(profileItem, statsData, topscorerItem);
  const player = mapPlayerInfo(sourceItem);
  const teamName = statistics[0]?.team?.name ?? topscorerItem?.statistics?.[0]?.team?.name ?? "—";

  return {
    player,
    statistics,
    recentFixtures: fixtures.map(mapFixtureToH2H),
    bio: `${player.name} — ${teamName} · Coupe du Monde FIFA 2026.`,
  };
}

export async function getTeamDetail(id: string): Promise<TeamDetailResponse | null> {
  const teamId = await resolveTeamNumericId(id);

  // Fetch standings upfront — used for standings rows and as team info fallback
  const standingsBlocks = await fetchFootball<ApiStandingsBlock[]>("standings", {
    league: primaryLeagueId,
    season,
  }).catch(() => [] as ApiStandingsBlock[]);

  const tables =
    standingsBlocks[0]?.standings ?? standingsBlocks[0]?.league?.standings ?? [];
  const allRows = tables.flat().map(mapTeamDetailStanding);

  if (teamId) {
    const [teamRes, squadRes, fixturesRes, resultsRes] = await Promise.allSettled([
      fetchFootball<ApiTeamItem[]>("teams", { team: teamId }),
      fetchFootball<ApiSquadItem[]>("players-squads", { team: teamId }),
      fetchFootball<ApiFixtureItem[]>("fixtures", { team: teamId, next: 5 }),
      fetchFootball<ApiFixtureItem[]>("fixtures", { team: teamId, last: 5 }),
    ]);

    const teamData = teamRes.status === "fulfilled" ? teamRes.value : [];
    const squadData = squadRes.status === "fulfilled" ? squadRes.value : [];
    const fixtures = fixturesRes.status === "fulfilled" ? fixturesRes.value : [];
    const results = resultsRes.status === "fulfilled" ? resultsRes.value : [];

    const teamItem = teamData[0];
    if (teamItem) {
      return {
        team: mapTeamInfo(teamItem),
        squad: mapDetailSquad(squadData as never[]),
        fixtures: fixtures.map(mapFixtureToH2H),
        results: results.map(mapFixtureToH2H),
        standings: allRows,
      };
    }

    // Team detail endpoint returned nothing — build info from the standings row
    const standingRow = tables.flat().find((r) => r.team?.id === teamId);
    if (standingRow?.team) {
      return {
        team: {
          id: standingRow.team.id,
          name: standingRow.team.name,
          code: standingRow.team.name.slice(0, 3).toUpperCase(),
          logo: standingRow.team.logo ?? "",
          country: "—",
          founded: 0,
          venue: { id: 0, name: "—", address: "", city: "", capacity: 0, image: "" },
        },
        squad: mapDetailSquad(squadData as never[]),
        fixtures: fixtures.map(mapFixtureToH2H),
        results: results.map(mapFixtureToH2H),
        standings: allRows,
      };
    }
  }

  // Last resort: mock data (slug-based IDs like "france", "senegal")
  if (!footballConfig.mockFallback) return null;

  const mockTeams = readLocalJSON<import("@/types/team").Team[]>("teams.json");
  const mockTeam = mockTeams.find((t) => t.id === id || String(t.id) === id);
  if (!mockTeam) return null;

  return {
    team: {
      id: 0,
      name: mockTeam.name,
      code: mockTeam.id.slice(0, 3).toUpperCase(),
      logo: mockTeam.image,
      country: mockTeam.confederation,
      founded: 0,
      venue: { id: 0, name: "—", address: "", city: "", capacity: 0, image: "" },
    },
    squad: (mockTeam.squad ?? []).map((p, i) => ({
      id: i + 1,
      name: p.name,
      age: p.age ?? 0,
      number: null,
      position: p.position ?? "—",
      photo: "",
    })),
    fixtures: [],
    results: [],
    standings: [],
  };
}

export type MatchTab = "live" | "upcoming" | "results" | "all";

export async function getMatchesFiltered(options?: {
  tab?: MatchTab;
  countryId?: string;
}): Promise<Match[]> {
  let matches = await getAllMatches();
  const teamId = countryIdToTeamId(options?.countryId);

  if (teamId) {
    const tid = String(teamId);
    matches = matches.filter(
      (m) => m.homeTeamId === tid || m.awayTeamId === tid
    );
  }

  const tab = options?.tab ?? "all";
  if (tab === "live") return matches.filter((m) => m.status === "live");
  if (tab === "upcoming") return matches.filter((m) => m.status === "upcoming");
  if (tab === "results") return matches.filter((m) => m.status === "finished");
  return matches;
}

export async function getRankingsFiltered(options?: {
  countryId?: string;
  leagueId?: number;
}): Promise<RankingsData> {
  const league = options?.leagueId ?? primaryLeagueId;
  const blocks = await fetchFootball<ApiStandingsBlock[]>("standings", {
    league,
    season,
  }).catch(() => [] as ApiStandingsBlock[]);

  const data = mapRankings(blocks[0] ?? {});

  if (options?.countryId && data.groups) {
    const teamId = countryIdToTeamId(options.countryId);
    if (teamId) {
      data.groups = data.groups.map((g) => ({
        ...g,
        rows: g.rows.filter((r) => r.teamId === String(teamId)),
      }));
    }
  }

  return data;
}

export async function getFifaRankings(): Promise<FifaRankingsData> {
  try {
    const remote = await fetchFootball<{ rank?: number; team?: { name?: string; id?: number; logo?: string }; points?: number }[]>(
      "rankings/fifa"
    ).catch(() => null);

    if (remote?.length) {
      return {
        updatedAt: new Date().toISOString(),
        rankings: remote.map((r, i) => ({
          rank: r.rank ?? i + 1,
          team: r.team?.name ?? "—",
          teamId: r.team?.id ?? 0,
          logo: r.team?.logo,
          points: r.points ?? 0,
        })),
      };
    }
  } catch {
    /* fallback */
  }

  const mock = readLocalJSON<FifaRankingsData["rankings"]>("fifa-rankings.json");
  return { updatedAt: new Date().toISOString(), rankings: mock };
}

export interface SearchResults {
  news: import("@/types/news").NewsItem[];
  teams: Team[];
  players: Player[];
  matches: Match[];
}

export async function searchAll(query: string): Promise<SearchResults> {
  const q = query.toLowerCase().trim();
  if (!q) return { news: [], teams: [], players: [], matches: [] };

  const [cmsArticles, rssArticles, teams, players, matches] = await Promise.all([
    getAllArticles(),
    getRssArticles().catch(() => []),
    getTeams(),
    getPlayers(),
    getAllMatches(),
  ]);

  const seenSlugs = new Set<string>();
  const news = [...cmsArticles, ...rssArticles].filter((a) => {
    if (seenSlugs.has(a.slug)) return false;
    seenSlugs.add(a.slug);
    return true;
  });

  return {
    news: news.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    ),
    teams: teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.confederation.toLowerCase().includes(q)
    ),
    players: players.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.club.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q)
    ),
    matches: matches.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.competition.toLowerCase().includes(q)
    ),
  };
}
