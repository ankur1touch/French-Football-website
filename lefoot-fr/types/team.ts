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
