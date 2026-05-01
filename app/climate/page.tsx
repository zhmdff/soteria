"use client";

import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import RenewableEnergyTool from "@/components/RenewableEnergyTool";
import TimeRangeSelector, { TimeRange } from "@/components/TimeRangeSelector";
import { useState, useEffect, useCallback, useMemo } from "react";
import { predictTemperature, mergeDataWithPredictions } from "@/lib/predictions";
import { getAvailableDateRange, ClimateStatsData, SeasonalForecastData } from "@/lib/openmeteo";
import { Calendar, Info, TrendingUp } from "lucide-react";
import { useMapSettings } from "@/context/MapContext";

interface ClimateData {
  daily: {
    time: string[];
    temperature_2m_mean: number[];
  };
}

interface MonthlySeasonalData {
  month: string;
  avgMaxTemp: number;
  totalPrecip: number;
}

export default function ClimateTrends() {
  const { location } = useMapSettings();
  const [data, setData] = useState<ClimateData | null>(null);
  const [seasonal, setSeasonal] = useState<SeasonalForecastData | null>(null);
  const [stats, setStats] = useState<ClimateStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("10y");
  const [predictionRange, setPredictionRange] = useState<TimeRange>("10y");

  const availableRange = getAvailableDateRange("climate");

  // Fetch climate projection chart data
  const fetchData = useCallback(async (range: TimeRange) => {
    try {
      const now = new Date();
      const endDate = now.toISOString().split("T")[0];
      let startDate = "";

      if (range === "1m") {
        const start = new Date();
        start.setMonth(now.getMonth() - 1);
        startDate = start.toISOString().split("T")[0];
      } else if (range === "1y") {
        const start = new Date();
        start.setFullYear(now.getFullYear() - 1);
        startDate = start.toISOString().split("T")[0];
      } else {
        const start = new Date();
        start.setFullYear(now.getFullYear() - 10);
        startDate = start.toISOString().split("T")[0];
      }

      const res = await fetch(`/api/climate?start_date=${startDate}&end_date=${endDate}&lat=${location.lat}&lon=${location.lon}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch climate data", error);
    }
  }, [location.lat, location.lon]);

  // Fetch seasonal forecast
  const fetchSeasonal = useCallback(async () => {
    try {
      const res = await fetch(`/api/seasonal?lat=${location.lat}&lon=${location.lon}`);
      const json = await res.json();
      setSeasonal(json);
    } catch (error) {
      console.error("Failed to fetch seasonal forecast", error);
    }
  }, [location.lat, location.lon]);

  // Fetch real climate stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/climate-stats?lat=${location.lat}&lon=${location.lon}`);
      const json = await res.json();
      setStats(json);
    } catch (error) {
      console.error("Failed to fetch climate stats", error);
    } finally {
      setStatsLoading(false);
    }
  }, [location.lat, location.lon]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats();
      fetchSeasonal();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStats, fetchSeasonal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(timeRange);
    }, 0);
    return () => clearTimeout(timer);
  }, [timeRange, fetchData]);

  const temperatureHistory = useMemo(() => 
    data?.daily?.time
      .map((time: string, index: number) => ({
        label: new Date(time).toLocaleDateString("az-AZ", {
          day: timeRange === "1m" ? "numeric" : undefined,
          month: "short",
          year: timeRange !== "1m" ? "2-digit" : undefined,
        }),
        value: data.daily.temperature_2m_mean[index],
      }))
      .filter((_, i: number) => {
        if (timeRange === "1m") return true;
        if (timeRange === "1y") return i % 7 === 0;
        return i % 30 === 0;
      }) || [], [data, timeRange]);

  const combinedData = useMemo(() => {
    const predictionSteps = predictionRange === "10y" ? 10 : predictionRange === "20y" ? 20 : 50;
    return temperatureHistory.length > 0
      ? mergeDataWithPredictions(temperatureHistory, predictionSteps, predictTemperature, "İl +")
      : [];
  }, [temperatureHistory, predictionRange]);

  // Monthly aggregations for seasonal forecast
  const seasonalMonthly = useMemo<MonthlySeasonalData[]>(() => {
    if (!seasonal?.daily?.time) return [];
    
    const monthly: Record<string, { temp: number[]; precip: number[] }> = {};
    seasonal.daily.time.forEach((t, i) => {
      const month = new Date(t).toLocaleDateString("az-AZ", { month: "long" });
      if (!monthly[month]) monthly[month] = { temp: [], precip: [] };
      monthly[month].temp.push(seasonal.daily.temperature_2m_max_mean[i]);
      monthly[month].precip.push(seasonal.daily.precipitation_sum_mean[i]);
    });

    return Object.entries(monthly).map(([month, monthData]) => ({
      month,
      avgMaxTemp: monthData.temp.reduce((a, b) => a + b, 0) / monthData.temp.length,
      totalPrecip: monthData.precip.reduce((a, b) => a + b, 0),
    }));
  }, [seasonal]);

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">İqlim Trendləri: {location.name}</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg">Uzunmüddətli temporal analiz və gələcək proqnozlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <StatCard
          label="Orta Temp. Artımı"
          value={statsLoading ? "--" : (stats?.avgTempIncrease ?? "N/A")}
          unit="°C"
          icon="TrendingUp"
          status="red"
          loading={statsLoading}
          description="İl-il orta temperaturun müqayisəsi (ERA5-Land)."
        />
        <StatCard
          label="İsti Günlər (illik)"
          value={statsLoading ? "--" : (stats?.hotDaysCount ?? "--")}
          unit="gün"
          icon="Sun"
          status="amber"
          loading={statsLoading}
          description="Keçən ildə maks. temperaturun 35°C-dən yuxarı olduğu günlər."
        />
        <StatCard
          label="Quraqlıq Günləri"
          value={statsLoading ? "--" : (stats?.droughtDaysCount ?? "--")}
          unit="gün"
          icon="Droplets"
          status="amber"
          loading={statsLoading}
          description="Keçən ildə yağıntının 1 mm-dən az olduğu günlər."
        />
        <StatCard
          label="Analiz Rejimi"
          value="Qlobal"
          unit=""
          icon="Globe"
          description="Azerbaycan mərkəzli, dünya miqyaslı analiz."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 md:p-6 shadow-sm overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div className="flex-1 w-full">
              <h3 className="font-headline-md text-xl md:text-2xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Temperatur Dinamikası və Trendi
              </h3>
              <p className="text-[10px] md:text-xs text-on-surface-variant mt-1">Bütöv xətt: Tarixi/Proyeksiya Məlumatı, Qırıq xətt: 10 dövrlük Trend</p>
            </div>
          </div>

          <div className="min-w-[600px] lg:min-w-0">
            <ChartPanel
              type="line"
              data={combinedData}
              xKey="label"
              yKey="value"
              predictKey="prediction"
              color="#EF4444"
              predictColor="#F87171"
              height={400}
              activeRange={timeRange}
              onRangeChange={setTimeRange}
              availableMin={availableRange.min}
              availableMax={availableRange.max}
            />
          </div>
          <div className="mt-6 border-t border-outline-variant/20 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Proqnoz Müddəti
              </h4>
            </div>
            <TimeRangeSelector 
              activeRange={predictionRange} 
              onChange={setPredictionRange}
              customRanges={[
                { label: "10 İl", value: "10y" },
                { label: "20 İl", value: "20y" },
                { label: "50 İl", value: "50y" },
              ]}
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="font-headline-md text-lg font-bold">Mövsümi Görünüş (6 Ay)</h3>
          </div>
          <div className="flex flex-col gap-4">
            {seasonalMonthly.length > 0 ? seasonalMonthly.map((m: MonthlySeasonalData, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 bg-surface-container rounded-lg border border-outline-variant/10">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-on-surface">{m.month}</span>
                  <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">ECMWF SEAS5</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-outline">Ort. Max Temp</span>
                    <span className="text-lg font-bold text-primary">{m.avgMaxTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex flex-col border-l border-outline-variant/20 pl-4">
                    <span className="text-[10px] text-outline">Cəmi Yağıntı</span>
                    <span className="text-lg font-bold text-tertiary">{m.totalPrecip.toFixed(0)} mm</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-outline gap-2 opacity-50">
                <Info className="w-8 h-8" />
                <span className="text-xs uppercase font-bold tracking-widest text-center">Analiz məlumatları toplanır...</span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-on-surface-variant leading-relaxed">
            * Mövsümi proqnozlar geniş ərazilər üçün ümumi meyilləri göstərir və dəyişə bilər.
          </p>
        </div>
      </div>

      <RenewableEnergyTool />

      <AIReport />
    </div>
  );
}
