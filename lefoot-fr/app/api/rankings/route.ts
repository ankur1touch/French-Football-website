import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getRankings, getRankingsFiltered } from "@/lib/football/services";
import type { RankingsData } from "@/types/ranking";

export const revalidate = 600;

export async function GET() {
  const rankings = await withFallback(getRankings, "rankings.json");
  return NextResponse.json(rankings as RankingsData);
}

export async function POST(req: Request) {
  let countryId: string | undefined;
  let leagueId: number | undefined;

  try {
    const body = await req.json();
    countryId = body.countryId;
    leagueId = body.leagueId ? Number(body.leagueId) : undefined;
  } catch {
    /* empty body */
  }

  const rankings = await withFallback(
    () => getRankingsFiltered({ countryId, leagueId }),
    "rankings.json"
  );

  return NextResponse.json(rankings as RankingsData, {
    headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1800" },
  });
}
