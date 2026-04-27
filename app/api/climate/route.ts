import { getClimateProjections } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    
    // If we have custom dates, use them, otherwise default to a relevant range
    const start = startDate || "2016-01-01";
    const end = endDate || "2026-01-01";
    
    const data = await getClimateProjections(start, end);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch climate projections" }, { status: 500 });
  }
}
