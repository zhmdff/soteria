import { getClimateStats } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getClimateStats();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch climate stats" }, { status: 500 });
  }
}
