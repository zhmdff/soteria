import { getMarineData, getMarineHistorical } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const pastDays = parseInt(searchParams.get("past_days") || "0");
    const forecastDays = parseInt(searchParams.get("forecast_days") || "8");
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    if (startDate && endDate) {
        const data = await getMarineHistorical(startDate, endDate, latitude, longitude);
        return NextResponse.json(data);
    }

    const data = await getMarineData(pastDays, forecastDays, latitude, longitude);
    
    // Fallback: If current marine data is missing (Open-Meteo returns null for land),
    // try fetching from the Caspian Center as a reliable water point.
    if (!data?.current?.wave_height && data?.current?.wave_height !== 0) {
        const fallbackData = await getMarineData(pastDays, forecastDays, 41.0, 51.5);
        if (fallbackData?.current) {
            return NextResponse.json(fallbackData);
        }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch marine data" }, { status: 500 });
  }
}
