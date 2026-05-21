import type { Player, PlayerPosition, PlayerStats } from "@/types/player";
import type { ApiTopScorerItem } from "../types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=500&fit=crop";

function mapPosition(pos?: string): PlayerPosition {
  if (!pos) return "Attaquant";
  const p = pos.toLowerCase();
  if (p.includes("goalkeeper") || p === "g") return "Gardien";
  if (p.includes("defender") || p === "d") return "Défenseur";
  if (p.includes("midfielder") || p === "m") return "Milieu";
  return "Attaquant";
}

function extractStats(item: ApiTopScorerItem): PlayerStats {
  const s = item.statistics?.[0];
  const games = s?.games?.appearances ?? s?.games?.appearences ?? 0;
  return {
    appearances: games,
    goals: s?.goals?.total ?? 0,
    assists: s?.goals?.assists ?? 0,
    yellowCards: s?.cards?.yellow ?? 0,
    redCards: s?.cards?.red ?? 0,
  };
}

export function mapTopScorerToPlayer(item: ApiTopScorerItem, index: number): Player {
  const player = item.player ?? { id: index, name: "Joueur" };
  const club = item.statistics?.[0]?.team?.name ?? "—";
  const stats = extractStats(item);

  return {
    id: String(player.id),
    name: player.name,
    position: "Attaquant",
    nationality: "—",
    club,
    age: player.age ?? 25,
    image: player.photo ?? DEFAULT_IMAGE,
    stats,
    bio: `${player.name} — ${club} · Coupe du Monde FIFA 2026.`,
  };
}

export function mapPlayerStatistics(data: ApiTopScorerItem): Player {
  const base = mapTopScorerToPlayer(data, 0);
  const pos = data.statistics?.[0]?.games ? mapPosition(undefined) : base.position;
  return { ...base, position: pos };
}

export function mapTopScorers(items: ApiTopScorerItem[]): Player[] {
  return items.map((item, i) => mapTopScorerToPlayer(item, i));
}
