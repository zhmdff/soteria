"use client";

import { useState, useEffect } from "react";
import MapView from "@/components/MapView";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import WaterLevelTracker from "@/components/WaterLevelTracker";
import { TimeRange } from "@/components/TimeRangeSelector";
import { MarineData, WeatherData, getAvailableDateRange } from "@/lib/openmeteo";
import { predictWaterLevel, generatePredictionData } from "@/lib/predictions";
import { Calendar } from "lucide-react";

interface CaspianSeaData extends MarineData {
  weatherFallback: WeatherData;
}

export default function CaspianSea() {
  const [data, setData] = useState<CaspianSeaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");
  
  const availableRange = getAvailableDateRange("marine");

  async function fetchData(range: TimeRange) {
    setLoading(true);
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

      const [marineRes, weatherRes] = await Promise.all([
        fetch(`/api/marine?${query}`), 
        fetch("/api/weather")
      ]);
      const marine = await marineRes.json();
      const weather = await weatherRes.json();
      setData({ ...marine, weatherFallback: weather });
    } catch (error) {
      console.error("Failed to fetch marine data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const currentLevel = -28.7;
  const waterLevelPrediction = generatePredictionData(currentLevel, 10, predictWaterLevel, "İl +");

  // Format data for chart
  let historicalTempData: any[] = [];
  if (data?.hourly) {
      historicalTempData = data.hourly.time.map((time, index) => ({
        label: new Date(time).toLocaleDateString("az-AZ", { 
            day: timeRange === "1m" ? "numeric" : undefined,
            month: "short",
            year: timeRange === "10y" ? "2-digit" : undefined
        }),
        temp: data.hourly.sea_surface_temperature?.[index],
      })).filter((_, i) => {
          if (timeRange === "1m") return i % 24 === 0; // once a day
          if (timeRange === "1y") return i % 168 === 0; // weekly
          if (timeRange === "10y") return i % (168 * 4) === 0; // monthly-ish
          return true;
      });
  } else if ((data as any)?.daily) {
      historicalTempData = (data as any).daily.time.map((time: string, index: number) => ({
        label: new Date(time).toLocaleDateString("az-AZ", { 
            month: "short",
            year: timeRange === "10y" ? "2-digit" : undefined
        }),
        temp: (data as any).daily.temperature_2m_mean[index],
      })).filter((_: any, i: number) => {
          if (timeRange === "1y") return i % 7 === 0;
          if (timeRange === "10y") return i % 30 === 0;
          return true;
      });
  }

  const seaTemp = data?.current?.sea_surface_temperature ?? data?.weatherFallback?.current?.temperature_2m;

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Xəzər Dənizi Monitorinqi</h1>
          <p className="font-body-md text-on-surface-variant">Səviyyə dəyişimi və ekoloji temporal analiz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <StatCard label="Dəniz Səthi Hərarəti" value={seaTemp || "--"} unit="°C" icon="Thermometer" loading={loading} description=" Suyun səth temperaturu." />
        <StatCard label="Dalğa Hündürlüyü" value={data?.current?.wave_height || "--"} unit="m" icon="Waves" loading={loading} description="Dalğaların hündürlüyü." />
        <StatCard label="Xlorofil-a" value="4.2" unit="mg/m³" icon="Droplets" status="red" trend="Yüksək" description="Fitoplankton konsentrasiyası." />
        <StatCard label="Dalğa Periodu" value={data?.current?.wave_period || "--"} unit="s" icon="Activity" loading={loading} description="Dalğalar arasındakı zaman intervalı." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-stack-md">
          <div>
            <MapView center={[41.0, 51.5]} zoom={5} title="Xəzər Dənizi Coğrafi Analizi" />
          </div>
          <WaterLevelTracker />
        </div>
        <AIReport />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
          <h3 className="font-headline-sm text-primary flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4" />
            Səth Temperaturu Dinamikası
          </h3>
          <ChartPanel 
            type="area" 
            data={historicalTempData} 
            xKey="label" 
            yKey="temp" 
            color="#00D4B4" 
            height={250} 
            activeRange={timeRange}
            onRangeChange={setTimeRange}
            availableMin={availableRange.min}
            availableMax={availableRange.max}
          />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-headline-sm text-primary">Səviyyə Proyeksiyası (10 illik)</h3>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider font-bold">Su Balansı Modeli</span>
          </div>
          <ChartPanel 
            type="line" 
            data={waterLevelPrediction} 
            xKey="label" 
            yKey="value" 
            predictKey="prediction" 
            color="#00D4B4" 
            predictColor="#2DD4BF" 
            height={250} 
          />
        </div>
      </div>
    </div>
  );
}
