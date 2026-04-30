import { getWeatherForecast } from "@/lib/openmeteo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const pastDays = Math.min(parseInt(searchParams.get("past_days") || "0"), 92);
    const forecastDays = parseInt(searchParams.get("forecast_days") || "7");

    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    const data = await getWeatherForecast(pastDays, forecastDays, latitude, longitude);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
