import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getRankings } from "@/lib/football/services";
import type { RankingsData } from "@/types/ranking";

export const revalidate = 300;

export async function POST() {
  const rankings = await withFallback(getRankings, "rankings.json");
  return NextResponse.json(rankings as RankingsData);
}
