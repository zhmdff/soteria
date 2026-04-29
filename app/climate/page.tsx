"use client";

import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import RenewableEnergyTool from "@/components/RenewableEnergyTool";
import { TimeRange } from "@/components/TimeRangeSelector";
import { useState, useEffect } from "react";
import { predictTemperature, mergeDataWithPredictions } from "@/lib/predictions";
import { getAvailableDateRange, ClimateStatsData } from "@/lib/openmeteo";
import { Calendar } from "lucide-react";

interface ClimateData {
  daily: {
    time: string[];
    temperature_2m_mean: number[];
  };
}

export default function ClimateTrends() {
  const [data, setData] = useState<ClimateData | null>(null);
  const [stats, setStats] = useState<ClimateStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("10y");

  const availableRange = getAvailableDateRange("climate");

  // Fetch climate projection chart data
  async function fetchData(range: TimeRange) {
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

      const res = await fetch(`/api/climate?start_date=${startDate}&end_date=${endDate}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch climate data", error);
    }
  }

  // Fetch real climate stats (temp increase, hot days, drought days) from archive API
  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      try {
        const res = await fetch("/api/climate-stats");
        const json = await res.json();
        setStats(json);
      } catch (error) {
        console.error("Failed to fetch climate stats", error);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(timeRange);
    }, 0);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const temperatureHistory =
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
      }) || [];

  const combinedData =
    temperatureHistory.length > 0
      ? mergeDataWithPredictions(temperatureHistory, 10, predictTemperature, "İl +")
      : [];

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">İqlim Trendləri</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg">Uzunmüddətli temporal analiz</p>
        </div>
      </div>

      {/* Climate Stats Cards — real data from OpenMeteo historical archive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <StatCard
          label="Orta Temp. Artımı"
          value={statsLoading ? "--" : (stats?.avgTempIncrease ?? "N/A")}
          unit="°C"
          icon="TrendingUp"
          status="red"
          loading={statsLoading}
          description="İl-il orta temperaturun müqayisəsi (arxiv məlumatı, OpenMeteo ERA5)."
        />
        <StatCard
          label="İsti Günlər (illik)"
          value={statsLoading ? "--" : (stats?.hotDaysCount ?? "--")}
          unit="gün"
          icon="Sun"
          status="amber"
          loading={statsLoading}
          description="Keçən ildə maks. temperaturun 35°C-dən yuxarı olduğu günlər (arxiv məlumatı)."
        />
        <StatCard
          label="Quraqlıq Günləri"
          value={statsLoading ? "--" : (stats?.droughtDaysCount ?? "--")}
          unit="gün"
          icon="Droplets"
          status="amber"
          loading={statsLoading}
          description="Keçən ildə yağıntının 1 mm-dən az olduğu günlər (arxiv məlumatı)."
        />
        <StatCard
          label="Külək Enerjisi"
          value="Yüksək"
          unit=""
          icon="Wind"
          description="Bərpa olunan enerji potensialı."
        />
      </div>

      <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 md:p-6 shadow-sm overflow-x-auto">
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
      </div>

      <RenewableEnergyTool />

      <AIReport />
    </div>
  );
}
