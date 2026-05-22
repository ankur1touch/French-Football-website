import type { FormResult } from "@/types/ranking";

export interface SquadPlayer {
  id: string;
  name: string;
  position: string;
  club: string;
  age: number;
}

export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export type Confederation = "UEFA" | "CAF" | "CONMEBOL" | "CONCACAF" | "AFC" | "OFC";

export interface Team {
  id: string;
  name: string;
  confederation: Confederation;
  image: string;
  coach: string;
  squad: SquadPlayer[];
  stats: TeamStats;
  form: FormResult[];
}

export interface TeamInfo {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  logo: string;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    image: string;
  };
}

export interface DetailSquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

export interface TeamDetailStandingRow {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  description?: string;
  form?: string;
}

export interface TeamDetailResponse {
  team: TeamInfo;
  squad: DetailSquadPlayer[];
  fixtures: import("@/types/matchDetail").H2HMatch[];
  results: import("@/types/matchDetail").H2HMatch[];
  standings: TeamDetailStandingRow[];
}
