export type FormResult = "W" | "D" | "L";

export interface StandingRow {
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

export interface StandingGroup {
  name: string;
  rows: StandingRow[];
}

export interface RankingsData {
  ligue1: StandingRow[];
  championsLeague?: StandingRow[];
  groups?: StandingGroup[];
  leagueName?: string;
}
