import { getClimateProjections } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getClimateProjections();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch climate projections" }, { status: 500 });
  }
}
