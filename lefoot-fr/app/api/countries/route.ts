import { NextResponse } from "next/server";
import { getCountries } from "@/lib/countries";

export async function GET() {
  return NextResponse.json(getCountries("fr"));
}
