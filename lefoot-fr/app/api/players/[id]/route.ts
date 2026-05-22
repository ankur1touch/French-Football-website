import { NextResponse } from "next/server";
import { getPlayerDetail } from "@/lib/football/services";

export const revalidate = 300;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await getPlayerDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to fetch player detail" }, { status: 500 });
  }
}
