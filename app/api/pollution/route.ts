import { getAirQuality } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAirQuality();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch air quality data" }, { status: 500 });
  }
}
