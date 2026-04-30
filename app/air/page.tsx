"use client";

import { useState, useEffect, useCallback } from "react";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import { AirQualityData, getAvailableDateRange } from "@/lib/openmeteo";
import { predictAQI, generatePredictionData } from "@/lib/predictions";
import { Calendar, AlertCircle } from "lucide-react";
import { TimeRange } from "@/components/TimeRangeSelector";
import { useMapSettings } from "@/context/MapContext";

export default function AirQuality() {
  const { location } = useMapSettings();
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");

  const availableRange = getAvailableDateRange("pollution");

  const fetchData = useCallback(async (range: TimeRange) => {
    setLoading(true);
    try {
      let query = `lat=${location.lat}&lon=${location.lon}`;
      const now = new Date();
      const endDate = now.toISOString().split("T")[0];

      if (range === "1m") {
        query += "&past_days=31";
      } else if (range === "1y") {
        const start = new Date();
        start.setFullYear(now.getFullYear() - 1);
        query += `&start_date=${start.toISOString().split("T")[0]}&end_date=${endDate}`;
      } else if (range === "10y") {
        const start = new Date();
        start.setFullYear(now.getFullYear() - 10);
        query += `&start_date=${start.toISOString().split("T")[0]}&end_date=${endDate}`;
      }

      const res = await fetch(`/api/pollution?${query}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch air quality", error);
    } finally {
      setLoading(false);
    }
  }, [location.lat, location.lon]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(timeRange);
    }, 0);
    return () => clearTimeout(timer);
  }, [timeRange, fetchData]);

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
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Hava Keyfiyyəti: {location.name}</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg">Atmosfer tərkibi və temporal analiz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full absolute transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
              <circle className="text-tertiary-container transition-all duration-1000 ease-in-out" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset={283 - (283 * (data?.current?.european_aqi || 0)) / 200} strokeLinecap="round" strokeWidth="8" />
            </svg>
            <div className="text-center flex flex-col items-center justify-center bg-surface w-36 h-36 rounded-full shadow-inner">
              <span className="font-display-xl text-4xl text-on-surface">{data?.current?.european_aqi || "--"}</span>
              <span className="font-headline-md text-tertiary text-xl">AQI</span>
            </div>
          </div>
          <p className="text-outline uppercase tracking-widest text-[9px] md:text-[10px]">{location.lat.toFixed(2)}° N, {location.lon.toFixed(2)}° E</p>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="PM2.5" value={data?.current?.pm2_5 || "--"} unit="μg/m³" icon="Wind" loading={loading} status={(data?.current?.pm2_5 ?? 0) > 25 ? "amber" : "green"} />
          <StatCard label="O₃ (Ozon)" value={data?.current?.ozone || "--"} unit="μg/m³" icon="Sun" loading={loading} />
          <StatCard label="Toz Hissəcikləri" value={data?.current?.dust || "--"} unit="μg/m³" icon="Wind" loading={loading} description="Saharan və regional toz fırtınaları." />
          <StatCard label="Aerosol Optik Dərinlik" value={data?.current?.aerosol_optical_depth?.toFixed(2) || "--"} unit="index" icon="Activity" loading={loading} description="Atmosferdəki bulanıqlıq dərəcəsi." />
          <StatCard label="PM10" value={data?.current?.pm10 || "--"} unit="μg/m³" icon="Wind" loading={loading} />
          <StatCard label="NO₂" value={data?.current?.nitrogen_dioxide || "--"} unit="μg/m³" icon="Activity" loading={loading} />
          <StatCard label="NH₃ (Ammonyak)" value={data?.current?.ammonia || "--"} unit="μg/m³" icon="Wind" loading={loading} />
          <StatCard label="CO" value={data?.current?.carbon_monoxide || "--"} unit="mg/m³" icon="Wind" loading={loading} />
        </div>
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
                <p className="text-xs text-outline tracking-wide uppercase mt-1">AQI Trendi</p>
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

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-amber-500">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-headline-sm">Sağlamlıq Məsləhəti</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="text-xs font-bold text-on-surface mb-1">Həssas qruplar üçün:</p>
                <p className="text-[11px] text-on-surface-variant">Havanın keyfiyyəti {(data?.current?.european_aqi ?? 0) > 50 ? "məhdudlaşdırıcıdır. Fiziki aktivliyi azaldın." : "yaxşıdır. Açıq havada vaxt keçirmək tövsiyə olunur."}</p>
              </div>
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="text-xs font-bold text-on-surface mb-1">Toz miqdarı:</p>
                <p className="text-[11px] text-on-surface-variant">Cari toz miqdarı ({(data?.current?.dust ?? 0).toFixed(1)} μg/m³) {(data?.current?.dust ?? 0) > 50 ? "normadan yüksəkdir." : "normal həddədir."}</p>
              </div>
            </div>
          </div>
          <AIReport />
        </div>
      </div>
    </div>
  );
}
