"use client";

import { useState, useEffect } from "react";
import { Sun, Wind, Zap, Calculator, Satellite } from "lucide-react";
import { WeatherData, SatelliteRadiationData } from "@/lib/openmeteo";
import { useMapSettings } from "@/context/MapContext";

export default function RenewableEnergyTool() {
  const { location } = useMapSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [satellite, setSatellite] = useState<SatelliteRadiationData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [wRes, sRes] = await Promise.all([
          fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}`),
          fetch(`/api/satellite-radiation?lat=${location.lat}&lon=${location.lon}`)
        ]);
        const wJson = await wRes.json();
        const sJson = await sRes.json();
        setWeather(wJson);
        setSatellite(sJson);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [location]);

  // Satellite-based GHI (Global Horizontal Irradiance) is more accurate
  // Summing up last 24 hours or using direct values
  const satelliteGHI = satellite?.hourly?.shortwave_radiation ? 
    (satellite.hourly.shortwave_radiation.reduce((a, b) => a + b, 0) / satellite.hourly.shortwave_radiation.length) : null;
  
  // Model-based daily radiation (MJ/m²/day)
  const todayRadiation = weather?.daily?.shortwave_radiation_sum?.[0];
  
  // Solar potential using satellite data if available, otherwise model data
  // If using satellite hourly mean (W/m²), convert to kWh/m²/day by * 24 / 1000
  const solarPotential = satelliteGHI != null
    ? (satelliteGHI * 24 / 1000 * 10 * 0.20).toFixed(1)
    : todayRadiation != null
      ? (todayRadiation * 0.2778 * 10 * 0.20).toFixed(1)
      : "--";

  // Wind potential
  const windSpeedMs = weather?.current?.wind_speed_10m
    ? weather.current.wind_speed_10m / 3.6
    : null;
  const windPotential =
    windSpeedMs != null
      ? (0.5 * 1.225 * 3.14 * Math.pow(windSpeedMs, 3) * 0.35 / 1000).toFixed(2)
      : "--";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-headline-md text-lg">Alternativ Enerji Potensialı ({location.name})</h3>
        </div>
        {satellite && (
          <div className="flex items-center gap-1.5 text-[10px] text-tertiary bg-tertiary/10 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
            <Satellite className="w-3 h-3" />
            Peyk Analizi Aktivdir
          </div>
        )}
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
              {satellite ? "Yüksək Dəqiqlik" : (todayRadiation != null ? "Model" : "Gözlənilir")}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display-lg text-on-surface">{solarPotential}</span>
            <span className="text-sm text-outline">kWh / gün (10m²)</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            * {satellite ? "EUMETSAT peyk datası" : "Cari model datası"} əsasında, 20% effektivliklə 10 kv.m panel üçün hesablanıb.
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
          Günəş: {satellite ? "Satellite-GHI" : "Model-GHI"} × Area × Eff | Külək: P = ½ × ρ × A × v³ × Cₚ
        </span>
      </div>
    </div>
  );
}
