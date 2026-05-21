import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getTeams } from "@/lib/football/services";
import type { Team } from "@/types/team";

export const revalidate = 300;

export async function POST() {
  const teams = await withFallback(getTeams, "teams.json");
  return NextResponse.json(teams as Team[]);
}
