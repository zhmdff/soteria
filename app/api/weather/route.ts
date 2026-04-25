import { getWeatherForecast } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getWeatherForecast();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
