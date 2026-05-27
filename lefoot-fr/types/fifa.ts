export interface FifaRankingRow {
  rank: number;
  team: string;
  teamId: number;
  logo?: string;
  points: number;
  previousRank?: number;
}

export interface FifaRankingsData {
  updatedAt: string;
  rankings: FifaRankingRow[];
}
