import { getAirQuality, getAirHistorical } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const pastDays = parseInt(searchParams.get("past_days") || "0");
    const forecastDays = parseInt(searchParams.get("forecast_days") || "7");
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    if (startDate && endDate) {
        const data = await getAirHistorical(startDate, endDate, latitude, longitude);
        return NextResponse.json(data);
    }

    const data = await getAirQuality(pastDays, forecastDays, latitude, longitude);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch air quality data" }, { status: 500 });
  }
}
