"use client";

import { useState, useEffect } from "react";
import { Sun, Wind, Zap, Calculator } from "lucide-react";
import { WeatherData } from "@/lib/openmeteo";

export default function RenewableEnergyTool() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        const json = await res.json();
        setWeather(json);
      } catch (e) {
        console.error(e);
      }
    }
    fetchWeather();
  }, []);

  // Solar potential from real shortwave_radiation_sum (MJ/m²/day)
  // daily[0] = today (no past_days requested, so forecast starts today)
  // Conversion: 1 MJ/m² = 0.2778 kWh/m²
  // For 10 m² panel at 20% efficiency: kWh = sum * 0.2778 * 10 * 0.20
  const todayRadiation = weather?.daily?.shortwave_radiation_sum?.[0];
  const solarPotential =
    todayRadiation != null
      ? (todayRadiation * 0.2778 * 10 * 0.20).toFixed(1)
      : "--";

  // Wind potential: P = 0.5 * ρ * A * v³ * Cp
  // ρ ≈ 1.225 kg/m³, A = swept area (micro-turbine r=1m → A≈3.14m²), Cp=0.35
  const windSpeedMs = weather?.current?.wind_speed_10m
    ? weather.current.wind_speed_10m / 3.6
    : null;
  const windPotential =
    windSpeedMs != null
      ? (0.5 * 1.225 * 3.14 * Math.pow(windSpeedMs, 3) * 0.35 / 1000).toFixed(2)
      : "--";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-headline-md text-lg">Alternativ Enerji Potensialı (Baku)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solar */}
        <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/20 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="font-label-md">Günəş Enerjisi</span>
            </div>
            <span className="text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded">
              {todayRadiation != null ? "Real-vaxt" : "Gözlənilir"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display-lg text-on-surface">{solarPotential}</span>
            <span className="text-sm text-outline">kWh / gün (10m²)</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            * Günlük günəş radiasiyası ({todayRadiation != null ? `${todayRadiation.toFixed(1)} MJ/m²` : "—"}) əsasında,
            20% effektivliklə 10 kv.m panel üçün hesablanıb.
          </p>
        </div>

        {/* Wind */}
        <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/20 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-tertiary" />
              <span className="font-label-md">Külək Enerjisi</span>
            </div>
            <span className="text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded">Real-vaxt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display-lg text-on-surface">{windPotential}</span>
            <span className="text-sm text-outline">kW (Micro-turbin)</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            * Cari külək sürətinə ({weather?.current?.wind_speed_10m != null ? `${weather.current.wind_speed_10m} km/h` : "—"}) əsasən hesablanıb.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-outline border-t border-outline-variant/20 pt-4">
        <Calculator className="w-3 h-3" />
        <span>
          Günəş: E = GHI × A × η | Külək: P = ½ × ρ × A × v³ × Cₚ (Betz limiti nəzərə alınmaqla)
        </span>
      </div>
    </div>
  );
}
