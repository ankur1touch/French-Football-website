export interface MatchDetailTeam {
  id: number;
  name: string;
  logo: string;
}

export interface MatchDetailFixture {
  id: number;
  date: string;
  round?: string;
  venue?: { name?: string; city?: string };
  status: { short: string; long: string; elapsed?: number | null };
}

export interface MatchDetailLeague {
  id: number;
  name: string;
  season?: number;
}

export interface MatchDetailGoals {
  home: number | null;
  away: number | null;
}

export interface MatchEvent {
  time: { elapsed: number; extra: number | null };
  team: MatchDetailTeam;
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
}

export interface MatchLineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid?: string | null;
}

export interface MatchLineup {
  team: MatchDetailTeam;
  formation: string;
  startXI: { player: MatchLineupPlayer }[];
  substitutes: { player: MatchLineupPlayer }[];
  coach?: { id: number; name: string; photo?: string };
}

export interface MatchStat {
  type: string;
  value: string | number | null;
}

export interface H2HMatch {
  fixtureId: number;
  date: string;
  leagueName: string;
  homeTeam: MatchDetailTeam;
  awayTeam: MatchDetailTeam;
  homeScore: number | null;
  awayScore: number | null;
}

export interface MatchDetail {
  fixture: MatchDetailFixture;
  league: MatchDetailLeague;
  teams: { home: MatchDetailTeam; away: MatchDetailTeam };
  goals: MatchDetailGoals;
  events: MatchEvent[];
  lineups: MatchLineup[];
  stats: MatchStat[][];
  h2h: H2HMatch[];
}
