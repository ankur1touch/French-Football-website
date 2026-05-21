/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T> {
  source?: string;
  response: T;
  results?: number;
  get?: string;
  parameters?: Record<string, string>;
}

export interface ApiFixtureItem {
  fixtureId?: number;
  fixture?: {
    id: number;
    date: string;
    venue?: { name?: string | null; city?: string | null };
    status?: { short?: string; long?: string; elapsed?: number | null };
  };
  league?: { id?: number; name?: string; country?: string; season?: number };
  teams?: {
    home?: { id?: number; name?: string; logo?: string };
    away?: { id?: number; name?: string; logo?: string };
  };
  goals?: { home?: number | null; away?: number | null };
  score?: { fulltime?: { home?: number | null; away?: number | null } };
  date?: string;
}

export interface ApiStandingRow {
  rank: number;
  team: { id: number; name: string; logo?: string };
  points: number;
  goalsDiff: number;
  group?: string;
  form?: string | null;
  all?: { played: number; win: number; draw: number; lose: number };
}

export interface ApiStandingsBlock {
  league?: {
    id: number;
    name: string;
    country?: string;
    logo?: string;
    season?: number;
    standings?: ApiStandingRow[][];
  };
  standings?: ApiStandingRow[][];
}

export interface ApiLeague {
  league?: {
    id: number;
    name: string;
    type?: string;
    logo?: string;
    country?: string;
  };
  country?: { name?: string; code?: string };
  seasons?: { year: number; start?: string; end?: string }[];
}

export interface ApiTeamItem {
  team?: { id: number; name: string; logo?: string; country?: string };
  venue?: { name?: string };
}

export interface ApiTopScorerItem {
  player?: { id: number; name: string; photo?: string; age?: number };
  statistics?: Array<{
    team?: { id: number; name: string };
    games?: { appearances?: number; appearences?: number };
    goals?: { total?: number | null; assists?: number | null };
    cards?: { yellow?: number; red?: number };
  }>;
}

export interface ApiSquadItem {
  team?: { id: number; name: string; logo?: string };
  players?: Array<{
    id: number;
    name: string;
    age?: number;
    position?: string;
    photo?: string;
  }>;
}

export interface ApiTransferItem {
  player?: { id: number; name: string };
  update?: string;
  transfers?: Array<{
    date?: string;
    type?: string;
    teams?: { in?: { name?: string }; out?: { name?: string } };
  }>;
}

export type ApiAny = any;
