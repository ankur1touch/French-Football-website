export const footballConfig = {
  baseUrl:
    process.env.FOOTBALL_PROXY_BASE_URL ??
    "https://api.labenditaec.com/api/football",
  season: Number(process.env.FOOTBALL_SEASON ?? "2026"),
  worldCupId: Number(process.env.FOOTBALL_WORLD_CUP_ID ?? "1"),
  primaryLeagueId: Number(
    process.env.FOOTBALL_PRIMARY_LEAGUE_ID ??
      process.env.FOOTBALL_WORLD_CUP_ID ??
      "1"
  ),
  primaryLeagueName:
    process.env.FOOTBALL_PRIMARY_LEAGUE_NAME ?? "Coupe du Monde FIFA 2026",
  ligue1Id: Number(process.env.FOOTBALL_LIGUE1_ID ?? "61"),
  championsLeagueId: Number(process.env.FOOTBALL_CHAMPIONS_LEAGUE_ID ?? "2"),
  ligue2Id: Number(process.env.FOOTBALL_LIGUE2_ID ?? "62"),
  mockFallback: process.env.FOOTBALL_ENABLE_MOCK_FALLBACK !== "false",
  timeoutMs: Number(process.env.FOOTBALL_TIMEOUT_MS ?? "8000"),
  nationalTeamIds: [77, 13, 25, 28, 1530, 26, 22, 31] as const,
};

export const NATIONAL_TEAM_META: Record<
  number,
  { confederation: "UEFA" | "CAF" | "CONMEBOL"; slug: string }
> = {
  77: { confederation: "UEFA", slug: "france" },
  13: { confederation: "UEFA", slug: "senegal" },
  25: { confederation: "CAF", slug: "cote-ivoire" },
  28: { confederation: "CAF", slug: "cameroun" },
  1530: { confederation: "UEFA", slug: "espagne" },
  26: { confederation: "CONMEBOL", slug: "bresil" },
  22: { confederation: "CONMEBOL", slug: "argentine" },
  31: { confederation: "CAF", slug: "maroc" },
};
