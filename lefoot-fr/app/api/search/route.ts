import { NextResponse } from "next/server";
import { searchAll } from "@/lib/football/services";

export const revalidate = 60;

export async function POST(req: Request) {
  let q = "";
  try {
    const body = await req.json();
    q = body.q ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const results = await searchAll(q);
  return NextResponse.json(results, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
  });
}
