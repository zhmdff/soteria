import { getAirQuality, getAirHistorical } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const pastDays = parseInt(searchParams.get("past_days") || "0");
    const forecastDays = parseInt(searchParams.get("forecast_days") || "7");
    
    if (startDate && endDate) {
        const data = await getAirHistorical(startDate, endDate);
        return NextResponse.json(data);
    }

    const data = await getAirQuality(pastDays, forecastDays);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch air quality data" }, { status: 500 });
  }
}
