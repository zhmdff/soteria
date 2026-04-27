import { generateEcologicalReport } from "@/lib/gemini";
import { getAirQuality, getMarineData, getClimateProjections, getWeatherForecast } from "@/lib/openmeteo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { page } = await req.json();
    
    let data = {};
    let context = "General environmental overview";

    if (page === "/caspian") {
      const marine = await getMarineData();
      data = {
        sea_surface_temperature: marine.current.sea_surface_temperature,
        wave_height: marine.current.wave_height,
        wave_period: marine.current.wave_period,
        wave_direction: marine.current.wave_direction,
      };
      context = "Caspian Sea marine environment and water conditions";
    } else if (page === "/air") {
      const air = await getAirQuality();
      data = {
        aqi: air.current.european_aqi,
        pm2_5: air.current.pm2_5,
        pm10: air.current.pm10,
        no2: air.current.nitrogen_dioxide,
        o3: air.current.ozone,
        co: air.current.carbon_monoxide,
      };
      context = "Air quality and atmospheric pollution in Baku/Absheron";
    } else if (page === "/climate") {
      const climate = await getClimateProjections();
      data = {
        projections: climate.daily,
      };
      context = "Long-term climate trends and projections for Azerbaijan";
    } else {
      const weather = await getWeatherForecast();
      const air = await getAirQuality();
      data = {
        temperature: weather.current.temperature_2m,
        humidity: weather.current.relative_humidity_2m,
        wind_speed: weather.current.wind_speed_10m,
        aqi: air.current.european_aqi,
      };
      context = "General weather and air quality summary for Baku";
    }
    
    const report = await generateEcologicalReport(data, context);

    return NextResponse.json(report);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
