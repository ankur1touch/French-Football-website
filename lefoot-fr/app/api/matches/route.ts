import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getAllMatches } from "@/lib/football/services";
import type { Match } from "@/types/match";

export const revalidate = 120;

export async function POST() {
  const matches = await withFallback(getAllMatches, "matches.json");
  return NextResponse.json(matches as Match[]);
}
