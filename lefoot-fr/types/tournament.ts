import type { FormResult } from "./ranking";

export interface TopScorer {
  rank: number;
  player: string;
  club: string;
  goals: number;
}

export interface TournamentStanding {
  position: number;
  team: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: number;
  form: FormResult[];
}

export type TournamentCategory =
  | "Domestique"
  | "International"
  | "Continental";

export interface TournamentGroupStandings {
  name: string;
  standings: TournamentStanding[];
}

export interface Tournament {
  id: string;
  name: string;
  category: TournamentCategory;
  startDate: string;
  endDate: string;
  host: string;
  image: string;
  standings: TournamentStanding[];
  topScorers: TopScorer[];
  groups?: TournamentGroupStandings[];
}
