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
  teamId?: string;
  age: number;
  image: string;
  stats: PlayerStats;
  bio: string;
}

export interface PlayerInfo {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

export interface PlayerStatistics {
  team: { id: number; name: string; logo: string };
  league: { id: number; name: string; country: string; logo: string; season: number };
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    position: string;
    rating: string;
  };
  goals: { total: number; assists: number; saves: number | null };
  shots: { total: number; on: number };
  passes: { total: number; key: number; accuracy: number };
  tackles: { total: number; blocks: number; interceptions: number };
  cards: { yellow: number; yellowred: number; red: number };
}

export interface PlayerDetailResponse {
  player: PlayerInfo;
  statistics: PlayerStatistics[];
  recentFixtures: import("@/types/matchDetail").H2HMatch[];
  bio?: string;
}
