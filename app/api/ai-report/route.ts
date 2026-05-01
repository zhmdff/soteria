import { generateEcologicalReport } from "@/lib/gemini";
import { getAirQuality, getMarineData, getClimateProjections, getWeatherForecast } from "@/lib/openmeteo";
import { predictTemperature, predictAQI, predictWaterLevel } from "@/lib/predictions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { page, predictionHorizon = "30d" } = await req.json();
    
    let data = {};
    let context = "";

    // Map horizon to steps
    const horizonMap: Record<string, { steps: number; label: string }> = {
      "7d": { steps: 7, label: "7 günlük" },
      "30d": { steps: 30, label: "30 günlük" },
      "1y": { steps: 12, label: "1 illik" },
      "10y": { steps: 10, label: "10 illik" },
    };

    const config = horizonMap[predictionHorizon] || horizonMap["30d"];

    if (page === "/caspian") {
      const marine = await getMarineData();
      const currentLevel = -28.70; // Hardcoded baseline or fetch from DB if available
      data = {
        current_conditions: {
          sea_surface_temperature: marine.current.sea_surface_temperature,
          wave_height: marine.current.wave_height,
        },
        mathematical_predictions: {
          horizon: config.label,
          predicted_water_level_change: predictWaterLevel(currentLevel, config.steps === 10 ? 10 : 1),
        }
      };
      context = "Xəzər dənizinin dəniz mühiti, suyun temperaturu və səviyyə dəyişimi trendləri.";
    } else if (page === "/air") {
      const air = await getAirQuality();
      const currentAQI = air.current.european_aqi;
      data = {
        historical_context: {
          aqi: currentAQI,
          pm2_5: air.current.pm2_5,
          pm10: air.current.pm10,
          no2: air.current.nitrogen_dioxide,
        },
        mathematical_predictions: {
          horizon: config.label,
          predicted_aqi: predictAQI(currentAQI, config.steps),
        }
      };
      context = "Bakı və Abşeron yarımadasında hava keyfiyyəti, atmosfer çirkliliyi və proqnozlar.";
    } else if (page === "/climate") {
      const weather = await getWeatherForecast();
      const currentTemp = weather.current.temperature_2m;
      data = {
        historical_context: {
          current_temp: currentTemp,
          relative_humidity: weather.current.relative_humidity_2m,
        },
        mathematical_predictions: {
          horizon: config.label,
          predicted_temp_increase: predictTemperature(currentTemp, config.steps === 10 ? 10 : 1),
        }
      };
      context = "Azərbaycan üçün uzunmüddətli iqlim trendləri, temperatur artımı və qlobal istiləşmənin təsirləri.";
    } else {
      const weather = await getWeatherForecast();
      data = {
        general_info: {
          temperature: weather.current.temperature_2m,
          aqi: 87, // Fallback
        }
      };
      context = "Ümumi ekoloji vəziyyət.";
    }
    
    const report = await generateEcologicalReport(data, context);

    if (report.status === "Hesabat yaradıla bilmədi." && report.reasoning.includes("əlçatmazdır")) {
      return NextResponse.json({ 
        error: "Süni intellekt limiti dolmuşdur. Zəhmət olmasa bir qədər sonra yenidən yoxlayın.",
        code: "QUOTA_EXCEEDED"
      }, { status: 429 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
