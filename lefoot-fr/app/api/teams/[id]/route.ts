import { NextResponse } from "next/server";
import { getTeamDetail } from "@/lib/football/services";

export const revalidate = 300;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const detail = await getTeamDetail(id);
  if (!detail) return NextResponse.json({ error: "Team not found" }, { status: 404 });
  return NextResponse.json(detail);
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await getTeamDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to fetch team detail" }, { status: 500 });
  }
}
