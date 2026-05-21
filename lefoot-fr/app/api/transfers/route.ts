import { NextResponse } from "next/server";
import { withFallback } from "@/lib/football/fallback";
import { getTransfers } from "@/lib/football/services";
import type { Transfer } from "@/types/transfer";

export const revalidate = 300;

export async function POST() {
  const transfers = await withFallback(getTransfers, "transfers.json");
  return NextResponse.json(transfers as Transfer[]);
}
