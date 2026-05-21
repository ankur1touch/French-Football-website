import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getPlayers } from "@/lib/football/services";
import type { Player } from "@/types/player";

export const revalidate = 300;

export async function POST() {
  const players = await withFallback(getPlayers, "players.json");
  return NextResponse.json(players as Player[]);
}
