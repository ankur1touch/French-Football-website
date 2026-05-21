import { NextResponse } from "next/server";
import { readLocalJSON } from "@/lib/data";
import { footballConfig } from "@/lib/football/config";
import { getLiveScores } from "@/lib/football/services";
import type { Match } from "@/types/match";
import type { LiveScore } from "@/types/match";

export const revalidate = 60;

function mockLiveScores(): LiveScore[] {
  const matches = readLocalJSON<Match[]>("matches.json");
  return matches
    .filter((m) => m.status === "live")
    .map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeScore: m.homeScore ?? 0,
      awayScore: m.awayScore ?? 0,
    }));
}

export async function POST() {
  let scores: LiveScore[];
  try {
    scores = await getLiveScores();
    if (!scores.length && footballConfig.mockFallback) {
      scores = mockLiveScores();
    }
  } catch {
    scores = footballConfig.mockFallback ? mockLiveScores() : [];
  }

  return NextResponse.json({
    scores,
    lastUpdated: new Date().toISOString(),
  });
}
