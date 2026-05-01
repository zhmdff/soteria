"use client";

import { useState, useEffect, useMemo } from "react";
import MapView from "@/components/MapView";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import { TimeRange } from "@/components/TimeRangeSelector";
import { AirQualityData, MarineData, WeatherData } from "@/lib/openmeteo";
import { predictTemperature, predictAQI, generatePredictionData } from "@/lib/predictions";
import { Calendar } from "lucide-react";

interface HomeData {
  air: AirQualityData;
  marine: MarineData;
  weather: WeatherData;
  caspian?: {
    levels: { date: string; value: number }[];
    volume: { date: string; value: number }[];
  };
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const now = new Date();
        const endDate = now.toISOString().split("T")[0];
        let startDate = "";

        if (timeRange === "1m") {
          const start = new Date();
          start.setMonth(now.getMonth() - 1);
          startDate = start.toISOString().split("T")[0];
        } else if (timeRange === "1y") {
          const start = new Date();
          start.setFullYear(now.getFullYear() - 1);
          startDate = start.toISOString().split("T")[0];
        } else if (timeRange === "10y") {
          const start = new Date();
          start.setFullYear(now.getFullYear() - 10);
          startDate = start.toISOString().split("T")[0];
        }

        const [airRes, marineRes, weatherRes, caspianRes] = await Promise.all([
          fetch(`/api/pollution?${timeRange === "1m" ? "past_days=31" : `start_date=${startDate}&end_date=${endDate}`}`),
          fetch(`/api/marine?${timeRange === "1m" ? "past_days=31" : `start_date=${startDate}&end_date=${endDate}`}`),
          fetch(`/api/weather?${timeRange === "1m" ? "past_days=31" : `start_date=${startDate}&end_date=${endDate}`}`),
          fetch("/api/caspian-data"),
        ]);
        
        const air = await airRes.json();
        const marine = await marineRes.json();
        const weather = await weatherRes.json();
        const caspian = await caspianRes.json();
        setData({ air, marine, weather, caspian });
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  const currentAQI = data?.air?.current?.european_aqi ?? null;
  const aqiPrediction = currentAQI !== null ? generatePredictionData(currentAQI, 7, predictAQI, "Gün +") : [];

  const currentTemp = data?.weather?.current?.temperature_2m ?? data?.weather?.daily?.temperature_2m_mean?.[data.weather.daily.temperature_2m_mean.length - 1] ?? null;
  const tempPrediction = currentTemp !== null ? generatePredictionData(currentTemp, 10, predictTemperature, "İl +") : [];

  // Format real historical water level data (downsampled for performance)
  const historicalWaterLevel = data?.caspian?.levels
    ? data.caspian.levels
        .filter((_, i) => i % 12 === 0) 
        .map((entry) => ({
          label: new Date(entry.date).getFullYear().toString(),
          value: entry.value,
        }))
    : [];

  const historicalAQI = data?.air?.hourly?.time.map((time, index) => ({
    day: new Date(time).toLocaleDateString("az-AZ", { day: "numeric", month: "short" }),
    aqi: data.air.hourly.european_aqi[index],
  })).filter((_, i) => i % (timeRange === "1m" ? 24 : 168) === 0) || [];

  // Smart scaling for Temperature Dynamics (Su/Hava)
  const historicalTemp = useMemo(() => {
    if (!data) return [];
    
    interface ProcessedTemp {
      day: string;
      airTemp: number | null;
      waterTemp: number | null;
      [key: string]: string | number | null;
    }
    let processed: ProcessedTemp[] = [];

    // For 1m, we use hourly data from weather/marine
    if (timeRange === "1m") {
      processed = data.weather.hourly?.time.map((time, index) => ({
        day: new Date(time).toLocaleDateString("az-AZ", { day: "numeric", month: "short" }),
        airTemp: data.weather.hourly.temperature_2m[index],
        waterTemp: data.marine.hourly?.sea_surface_temperature?.[index] ?? null,
      })).filter((_, i) => i % 24 === 0) || [];
    } else {
      // For 1y and 10y, we use daily data from archive/marine
      const weatherDaily = data.weather.daily;
      const marineDaily = data.marine.daily;

      if (!weatherDaily?.time) return [];

      processed = weatherDaily.time.map((time, index) => ({
        day: new Date(time).toLocaleDateString("az-AZ", { 
          month: "short", 
          year: timeRange === "10y" ? "2-digit" : undefined 
        }),
        airTemp: weatherDaily.temperature_2m_mean[index],
        waterTemp: marineDaily?.sea_surface_temperature_mean?.[index] ?? null,
      })).filter((_, i) => {
        if (timeRange === "1y") return i % 7 === 0; // Weekly samples
        if (timeRange === "10y") return i % 30 === 0; // Monthly samples
        return true;
      });
    }

    // Smart filtering: Find the first index with actual data to avoid showing "half data" or leading zeros
    const firstDataIndex = processed.findIndex(d => d.airTemp !== null || d.waterTemp !== null);
    return firstDataIndex === -1 ? [] : processed.slice(firstDataIndex);
  }, [data, timeRange]);

  const seaTemp = data?.marine?.current?.sea_surface_temperature ?? data?.weather?.current?.temperature_2m;

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Ana Səhifə</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg">Dashboard üzrə canlı analiz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md">
        <StatCard label="Dəniz Səthi Temp." value={seaTemp ?? "--"} unit="°C" icon="Thermometer" status={(seaTemp ?? 0) > 26 ? "red" : "green"} loading={loading} description="Suyun səth temperaturu." />
        <StatCard
          label="Hava Keyfiyyəti"
          value={data?.air?.current?.european_aqi ?? "--"}
          icon="Wind"
          status={(data?.air?.current?.european_aqi ?? 0) > 100 ? "red" : "amber"}
          loading={loading}
          description="Havanın təmizlik dərəcəsi (AQI)."
        />
        <StatCard label="Dalğa Hündürlüyü" value={data?.marine?.current?.wave_height ?? "--"} unit="m" icon="Waves" loading={loading} description="Naviqasiya üçün kritik göstərici." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        <div className="col-span-1 lg:col-span-2">
          <MapView />
        </div>
        <AIReport />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
          <h3 className="font-label-sm text-outline uppercase mb-4 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Hava Keyfiyyəti Trendi
          </h3>
          <ChartPanel
            type="area"
            data={historicalAQI}
            xKey="day"
            yKey="aqi"
            color="#F59E0B"
            height={200}
            activeRange={timeRange}
            onRangeChange={setTimeRange}
          />
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-label-sm text-outline uppercase flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Hərarət Dinamikası (Su/Hava)
            </h3>
            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#00D4B4] rounded-full"></div> Hava</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div> Su</div>
            </div>
          </div>
          <ChartPanel
            type="line"
            data={historicalTemp}
            xKey="day"
            yKey="airTemp"
            yKey2="waterTemp"
            color="#00D4B4"
            color2="#3B82F6"
            height={200}
          />
        </div>
      </div>


      <div className="mt-8 border-t border-outline-variant/20 pt-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">monitoring</span>
          </div>
          <div>
            <h2 className="text-2xl font-headline-lg text-on-surface">Analiz Mərkəzi</h2>
            <p className="text-on-surface-variant text-sm">Riyazi modellər və tarixi trendlər</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm mb-4 flex items-center justify-between font-bold">
              AQI Proyeksiya (7 gün)
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase">Trend</span>
            </h4>
            <ChartPanel type="area" data={aqiPrediction} xKey="label" yKey="value" predictKey="prediction" color="#F59E0B" height={160} />
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm mb-4 flex items-center justify-between font-bold">
              Dəniz Səviyyəsi (Tarixi)
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Arxiv</span>
            </h4>
            <ChartPanel type="line" data={historicalWaterLevel} xKey="label" yKey="value" color="#00D4B4" height={160} />
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm md:col-span-2 lg:col-span-1">
            <h4 className="text-sm mb-4 flex items-center justify-between font-bold">
              İqlim İstiləşməsi (10 il)
              <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase">Warming</span>
            </h4>
            <ChartPanel type="line" data={tempPrediction} xKey="label" yKey="value" predictKey="prediction" color="#EF4444" height={160} />
          </div>
        </div>
      </div>
    </div>
  );
}
