import { NextResponse } from "next/server";
import { getMatchDetail } from "@/lib/football/services";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const detail = await getMatchDetail(id);
  if (!detail) return NextResponse.json({ error: "Match not found" }, { status: 404 });
  return NextResponse.json(detail);
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await getMatchDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to fetch match detail" }, { status: 500 });
  }
}
