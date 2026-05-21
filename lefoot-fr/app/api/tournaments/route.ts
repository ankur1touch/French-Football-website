import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getTournaments } from "@/lib/football/services";
import type { Tournament } from "@/types/tournament";

export const revalidate = 300;

export async function POST() {
  const tournaments = await withFallback(getTournaments, "tournaments.json");
  return NextResponse.json(tournaments as Tournament[]);
}
