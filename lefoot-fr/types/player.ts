export type PlayerPosition = "Attaquant" | "Milieu" | "Défenseur" | "Gardien";

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  nationality: string;
  club: string;
  age: number;
  image: string;
  stats: PlayerStats;
  bio: string;
}
