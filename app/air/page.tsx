"use client";

import { useState, useEffect } from "react";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import { AirQualityData, getAvailableDateRange } from "@/lib/openmeteo";
import { predictAQI, generatePredictionData } from "@/lib/predictions";
import { Calendar } from "lucide-react";
import { TimeRange } from "@/components/TimeRangeSelector";

export default function AirQuality() {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");

  const availableRange = getAvailableDateRange("pollution");

  async function fetchData(range: TimeRange) {
    try {
      let query = "";
      const now = new Date();
      const endDate = now.toISOString().split("T")[0];

      if (range === "1m") {
        query = "past_days=31";
      } else if (range === "1y") {
        const start = new Date();
        start.setFullYear(now.getFullYear() - 1);
        query = `start_date=${start.toISOString().split("T")[0]}&end_date=${endDate}`;
      } else if (range === "10y") {
        const start = new Date();
        start.setFullYear(now.getFullYear() - 10);
        query = `start_date=${start.toISOString().split("T")[0]}&end_date=${endDate}`;
      }

      const res = await fetch(`/api/pollution?${query}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch air quality", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(timeRange);
    }, 0);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const currentAQI = data?.current?.european_aqi || 87;
  const aqiPrediction = generatePredictionData(currentAQI, 10, predictAQI, "Gün +");

  // Format hourly data for chart with sampling for long ranges
  const historicalData = data?.hourly?.time.map((time, index) => ({
    label: new Date(time).toLocaleDateString("az-AZ", {
        day: timeRange === "1m" ? "numeric" : undefined,
        month: "short",
        year: timeRange === "10y" ? "2-digit" : undefined
    }),
    aqi: data.hourly.european_aqi[index],
  })).filter((_, i) => {
      if (timeRange === "1m") return i % 12 === 0; // twice a day
      if (timeRange === "1y") return i % 168 === 0; // weekly
      if (timeRange === "10y") return i % (168 * 4) === 0; // monthly-ish
      return true;
  }) || [];

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Hava Keyfiyyəti Monitorinqi</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg">Bakı və Abşeron yarımadası üçün temporal analiz</p>
        </div>
      </div>

      <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-6">
          <svg className="w-full h-full absolute transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
            <circle className="text-tertiary-container transition-all duration-1000 ease-in-out" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset={283 - (283 * (data?.current?.european_aqi || 0)) / 200} strokeLinecap="round" strokeWidth="8" />
          </svg>
          <div className="text-center flex flex-col items-center justify-center bg-surface w-36 h-36 md:w-48 md:h-48 rounded-full shadow-inner">
            <span className="font-display-xl text-4xl md:text-6xl text-on-surface">{data?.current?.european_aqi || "--"}</span>
            <span className="font-headline-md text-tertiary text-xl md:text-2xl">AQI</span>
          </div>
        </div>
        <p className="text-outline uppercase tracking-widest text-[9px] md:text-[10px]">Bakı: 40.40° N, 49.86° E</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-gutter-md">
        <StatCard label="PM2.5" value={data?.current?.pm2_5 || "--"} unit="μg/m³" icon="Wind" loading={loading} status={(data?.current?.pm2_5 ?? 0) > 25 ? "amber" : "green"} description="Havadakı 2.5 mikrondan kiçik toz hissəcikləri." />
        <StatCard label="PM10" value={data?.current?.pm10 || "--"} unit="μg/m³" icon="Wind" loading={loading} description="Havadakı 10 mikrondan kiçik toz hissəcikləri." />
        <StatCard label="NO₂" value={data?.current?.nitrogen_dioxide || "--"} unit="μg/m³" icon="Activity" loading={loading} description="Azot dioksid. Əsasən avtomobil egzozlarından yaranır." />
        <StatCard label="O₃ (Ozon)" value={data?.current?.ozone || "--"} unit="μg/m³" icon="Sun" loading={loading} description="Yer səthinə yaxın ozon. İnsan sağlamlığı üçün zərərlidir." />
        <StatCard label="CO" value={data?.current?.carbon_monoxide || "--"} unit="mg/m³" icon="Wind" loading={loading} description="Dəm qazı. Yanacağın tam yanmaması nəticəsində yaranır." /> 
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        <div className="lg:col-span-2 space-y-gutter-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-primary flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Hava Keyfiyyəti Dinamikası
                </h3>
                <p className="text-xs text-outline tracking-wide uppercase mt-1">Seçilmiş {timeRange === '1m' ? 'ay' : timeRange === '1y' ? 'il' : '10 il'} üzrə AQI dinamikası</p>
              </div>
            </div>
            <ChartPanel 
                type="area" 
                data={historicalData} 
                xKey="label" 
                yKey="aqi" 
                color="#00b196" 
                height={300} 
                activeRange={timeRange}
                onRangeChange={(r) => { setTimeRange(r); setLoading(true); }}
                availableMin={availableRange.min}
                availableMax={availableRange.max}
            />
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-headline-sm text-primary">AQI Proyeksiyası (10 günlük)</h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Trend Modeli</span>
            </div>
            <ChartPanel type="area" data={aqiPrediction} xKey="label" yKey="value" predictKey="prediction" color="#F59E0B" predictColor="#D97706" height={250} />
          </div>
        </div>

        <AIReport />
      </div>
    </div>
  );
}
