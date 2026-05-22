import type { FormResult, RankingsData, StandingGroup, StandingRow } from "@/types/ranking";
import type { ApiStandingsBlock, ApiStandingRow } from "../types";
import type { TournamentStanding } from "@/types/tournament";

function parseForm(form?: string | null): FormResult[] {
  if (!form) return [];
  return form.split("").slice(-5).map((c) => {
    if (c === "W") return "W";
    if (c === "D") return "D";
    return "L";
  }) as FormResult[];
}

function mapRow(row: ApiStandingRow): StandingRow {
  return {
    position: row.rank,
    team: row.team.name,
    teamId: String(row.team.id),
    points: row.points,
    played: row.all?.played ?? 0,
    won: row.all?.win ?? 0,
    drawn: row.all?.draw ?? 0,
    lost: row.all?.lose ?? 0,
    goalDifference: row.goalsDiff,
    form: parseForm(row.form),
  };
}

export function mapStandingRow(row: ApiStandingRow): TournamentStanding {
  return mapRow(row);
}

function getStandingTables(block: ApiStandingsBlock): ApiStandingRow[][] {
  return block.standings ?? block.league?.standings ?? [];
}

function groupLabel(table: ApiStandingRow[], index: number): string {
  return table[0]?.group ?? `Groupe ${String.fromCharCode(65 + index)}`;
}

export function mapStandingsBlock(block: ApiStandingsBlock): StandingRow[] {
  const tables = getStandingTables(block);
  return (tables[0] ?? []).map(mapRow);
}

export function mapStandingsGroups(block: ApiStandingsBlock): StandingGroup[] {
  return getStandingTables(block).map((table, index) => ({
    name: groupLabel(table, index),
    rows: table.map(mapRow),
  }));
}

export function mapRankings(
  primaryBlock: ApiStandingsBlock | ApiStandingsBlock[],
  secondaryBlock?: ApiStandingsBlock | ApiStandingsBlock[]
): RankingsData {
  const primary = Array.isArray(primaryBlock) ? (primaryBlock[0] ?? {}) : primaryBlock;
  const groups = mapStandingsGroups(primary);

  if (groups.length > 1) {
    return {
      ligue1: groups[0]?.rows ?? [],
      championsLeague: groups[1]?.rows ?? [],
      groups,
      leagueName: primary.league?.name ?? "Coupe du Monde",
    };
  }

  const secondary = secondaryBlock
    ? Array.isArray(secondaryBlock)
      ? (secondaryBlock[0] ?? {})
      : secondaryBlock
    : undefined;

  return {
    ligue1: mapStandingsBlock(primary),
    championsLeague: secondary ? mapStandingsBlock(secondary) : [],
    leagueName: primary.league?.name,
  };
}
