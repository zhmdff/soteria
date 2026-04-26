import { generateEcologicalReport } from "@/lib/gemini";
import { getAirQuality, getMarineData } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

// Simple in-memory cache for the AI report
let reportCache: { report: string; timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour in ms

export async function POST() {
  try {
    const now = Date.now();
    if (reportCache && now - reportCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({ report: reportCache.report, cached: true });
    }

    const air = await getAirQuality();
    const marine = await getMarineData();
    
    const report = await generateEcologicalReport({
      current_aqi: air.current.european_aqi,
      sea_temp: marine.current.sea_surface_temperature,
      wave_height: marine.current.wave_height,
      anomaly: "Temperatur baza göstəricisindən 2.1C yüksəkdir",
    });

    reportCache = { report, timestamp: now };

    return NextResponse.json({ report, cached: false });
  } catch {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}

