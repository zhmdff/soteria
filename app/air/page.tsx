"use client";

import { useState, useEffect } from "react";
import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";

export default function AirQuality() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/pollution");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch air quality", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const mock16DayForecast = [
    { date: "Apr 26", aqi: 87 },
    { date: "Apr 27", aqi: 92 },
    { date: "Apr 28", aqi: 75 },
    { date: "Apr 29", aqi: 68 },
    { date: "Apr 30", aqi: 72 },
    { date: "May 1", aqi: 85 },
    { date: "May 2", aqi: 110 },
  ];

  return (
    <div className="flex min-h-screen">
      <SideNavBar activeTab="air" />
      <div className="flex flex-col flex-1 ml-sidebar-width">
        <TopNavBar />
        <main className="pt-16 min-h-screen p-gutter-lg flex flex-col gap-stack-md">
          <div className="mt-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface text-4xl">
              Hava Keyfiyyəti Monitorinqi
            </h1>
            <p className="font-body-md text-on-surface-variant text-lg">
              Bakı və Abşeron yarımadası üçün canlı analiz
            </p>
          </div>

          <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-64 h-64 flex items-center justify-center mb-6">
              <svg className="w-full h-full absolute transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
                <circle className="text-tertiary-container transition-all duration-1000 ease-in-out" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset={283 - (283 * (data?.current?.european_aqi || 0) / 200)} strokeLinecap="round" strokeWidth="8" />
              </svg>
              <div className="text-center flex flex-col items-center justify-center bg-surface w-48 h-48 rounded-full shadow-inner">
                <span className="font-display-xl text-6xl text-on-surface">{data?.current?.european_aqi || "--"}</span>
                <span className="font-headline-md text-tertiary">AQI</span>
              </div>
            </div>
            <p className="text-outline uppercase tracking-widest text-[10px]">Bakı: 40.40° N, 49.86° E</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-gutter-md">
            <StatCard label="PM2.5" value={data?.current?.pm2_5 || "--"} unit="μg/m³" icon="Wind" loading={loading} status={data?.current?.pm2_5 > 25 ? "amber" : "green"} />
            <StatCard label="PM10" value={data?.current?.pm10 || "--"} unit="μg/m³" icon="Wind" loading={loading} />
            <StatCard label="NO₂" value={data?.current?.nitrogen_dioxide || "--"} unit="μg/m³" icon="Activity" loading={loading} />
            <StatCard label="O₃ (Ozon)" value={data?.current?.ozone || "--"} unit="μg/m³" icon="Sun" loading={loading} />
            <StatCard label="CO" value={data?.current?.carbon_monoxide || "--"} unit="mg/m³" icon="Wind" loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm h-[320px]">
              <h3 className="font-headline-md mb-6 text-lg">7 Günlük AQI Proqnozu</h3>
              <ChartPanel type="bar" data={mock16DayForecast} xKey="date" yKey="aqi" color="#F59E0B" height={200} />
            </div>
            <AIReport />
          </div>
        </main>
      </div>
    </div>
  );
}
