import { NextResponse } from "next/server";
import { getFifaRankings } from "@/lib/football/services";

export const revalidate = 86400;

export async function GET() {
  const data = await getFifaRankings();
  return NextResponse.json(data);
}

export async function POST() {
  const data = await getFifaRankings();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600" },
  });
}
