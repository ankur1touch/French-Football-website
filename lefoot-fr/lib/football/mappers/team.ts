import type { FormResult } from "@/types/ranking";
import type { Team, SquadPlayer, TeamStats, Confederation } from "@/types/team";
import { NATIONAL_TEAM_META } from "../config";
import type { ApiSquadItem, ApiStandingRow, ApiTeamItem } from "../types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop";

function parseForm(form?: string | null): FormResult[] {
  if (!form) return ["D", "D", "D", "D", "D"];
  return form.split("").slice(-5).map((c) => {
    if (c === "W") return "W";
    if (c === "D") return "D";
    return "L";
  }) as FormResult[];
}

function mapPosition(pos?: string): string {
  if (!pos) return "Milieu";
  const p = pos.toLowerCase();
  if (p.includes("goalkeeper") || p === "g") return "Gardien";
  if (p.includes("defender") || p === "d") return "Défenseur";
  if (p.includes("midfielder") || p === "m") return "Milieu";
  return "Attaquant";
}

export function mapTeamItem(
  item: ApiTeamItem,
  options?: {
    squad?: ApiSquadItem;
    standing?: ApiStandingRow;
    confederation?: Confederation;
    slug?: string;
    coach?: string;
  }
): Team {
  const team = item.team ?? { id: 0, name: "Équipe" };
  const squadPlayers: SquadPlayer[] =
    options?.squad?.players?.map((p) => ({
      id: String(p.id),
      name: p.name,
      position: mapPosition(p.position),
      club: team.name,
      age: p.age ?? 0,
    })) ?? [];

  const stats: TeamStats = options?.standing
    ? {
        played: options.standing.all?.played ?? 0,
        won: options.standing.all?.win ?? 0,
        drawn: options.standing.all?.draw ?? 0,
        lost: options.standing.all?.lose ?? 0,
        goalsFor: 0,
        goalsAgainst: 0,
      }
    : { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };

  const meta = NATIONAL_TEAM_META[team.id as keyof typeof NATIONAL_TEAM_META];

  return {
    id: options?.slug ?? String(team.id),
    name: team.name,
    confederation: options?.confederation ?? meta?.confederation ?? "UEFA",
    image: team.logo ?? DEFAULT_IMAGE,
    coach: options?.coach ?? "—",
    squad: squadPlayers,
    stats,
    form: parseForm(options?.standing?.form),
  };
}

export function mapNationalTeamId(teamId: number): string {
  return NATIONAL_TEAM_META[teamId as keyof typeof NATIONAL_TEAM_META]?.slug ?? String(teamId);
}
