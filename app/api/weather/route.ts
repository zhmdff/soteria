import { getWeatherForecast } from "@/lib/openmeteo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Cap past_days at 92 — the weather forecast API maximum
    const pastDays = Math.min(parseInt(searchParams.get("past_days") || "0"), 92);
    const forecastDays = parseInt(searchParams.get("forecast_days") || "7");
    const data = await getWeatherForecast(pastDays, forecastDays);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
