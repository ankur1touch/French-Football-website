import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getMatchesFiltered, type MatchTab } from "@/lib/football/services";
import type { Match } from "@/types/match";

export const revalidate = 60;

export async function GET() {
  const matches = await withFallback(() => getMatchesFiltered(), "matches.json");
  return NextResponse.json(matches as Match[]);
}

export async function POST(req: Request) {
  let tab: MatchTab = "all";
  let countryId: string | undefined;

  try {
    const body = await req.json();
    tab = body.tab ?? "all";
    countryId = body.countryId;
  } catch {
    /* empty body */
  }

  const matches = await withFallback(
    () => getMatchesFiltered({ tab, countryId }),
    "matches.json"
  );

  return NextResponse.json(matches as Match[], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
  });
}
