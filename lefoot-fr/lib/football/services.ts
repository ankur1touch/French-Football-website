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

export async function getAllMatches(): Promise<Match[]> {
  const [live, upcoming, finished] = await Promise.all([
    getLiveFixtures().catch(() => [] as ApiFixtureItem[]),
    fetchFootball<ApiFixtureItem[]>("fixtures", {
      league: primaryLeagueId,
      season,
      next: 15,
    }).catch(() => [] as ApiFixtureItem[]),
    fetchFootball<ApiFixtureItem[]>("fixtures", {
      league: primaryLeagueId,
      season,
      last: 15,
    }).catch(() => [] as ApiFixtureItem[]),
  ]);

  const liveMatches = mapFixtures(live).map((m) => ({ ...m, status: "live" as const }));
  const upcomingMatches = mapFixtures(upcoming).map((m) => ({
    ...m,
    status: "upcoming" as const,
  }));
  const finishedMatches = mapFixtures(finished).map((m) => ({
    ...m,
    status: "finished" as const,
  }));

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
  const standings = await fetchFootball<ApiStandingsBlock[]>("standings", {
    league: primaryLeagueId,
    season,
  });
  const teamIds = extractTeamsFromStandings(standings)
    .map((t) => t.team?.id)
    .filter((id): id is number => id !== undefined)
    .slice(0, 8);

  if (!teamIds.length) {
    return mapTransfers([]).slice(0, 20);
  }

  const results = await Promise.all(
    teamIds.map((team) =>
      fetchFootball<ApiTransferItem[]>("transfers", { team }).catch(
        () => [] as ApiTransferItem[]
      )
    )
  );
  return mapTransfers(results.flat()).slice(0, 20);
}
