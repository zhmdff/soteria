import { getSeasonalForecast } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const data = await getSeasonalForecast(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Seasonal API Error:", error);
    return NextResponse.json({ error: "Failed to fetch seasonal forecast" }, { status: 500 });
  }
}
