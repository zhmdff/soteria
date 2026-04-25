"use client";

import { useState, useEffect } from "react";
import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";
import MapView from "@/components/MapView";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [airRes, marineRes, weatherRes] = await Promise.all([
          fetch("/api/pollution"),
          fetch("/api/marine"),
          fetch("/api/weather")
        ]);
        const air = await airRes.json();
        const marine = await marineRes.json();
        const weather = await weatherRes.json();
        setData({ air, marine, weather });
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const mockAQIData = [
    { day: "Nov 1", aqi: 45 },
    { day: "Nov 5", aqi: 52 },
    { day: "Nov 10", aqi: 38 },
    { day: "Nov 15", aqi: 65 },
    { day: "Nov 20", aqi: 42 },
    { day: "Nov 25", aqi: 55 },
    { day: "Nov 30", aqi: 48 },
  ];

  const seaTemp = data?.marine?.current?.sea_surface_temperature ?? data?.weather?.current?.temperature_2m;

  return (
    <div className="flex min-h-screen">
      <SideNavBar activeTab="home" />
      <div className="flex flex-col flex-1 ml-sidebar-width">
        <TopNavBar />
        <main className="pt-16 min-h-screen p-gutter-lg flex flex-col gap-stack-md">
          <div className="mt-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface text-4xl">Ana səhifə</h1>
            <p className="font-body-md text-on-surface-variant text-lg">Canlı analiz</p>
          </div>
          {/* StatCard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
            <StatCard 
              label="Dəniz Səthi Temperaturu" 
              value={seaTemp || "--"} 
              unit="°C" 
              trend="Stabil" 
              icon="Thermometer" 
              status={seaTemp > 26 ? "red" : "green"} 
              loading={loading}
              description="Dəniz suyunun üst qatının temperaturu. Yüksək temperatur ekosistemə mənfi təsir edə bilər."
            />
            <StatCard 
              label="Hava Keyfiyyəti İndeksi" 
              value={data?.air?.current?.european_aqi || "--"} 
              trend="Moderate" 
              icon="Wind" 
              status={data?.air?.current?.european_aqi > 100 ? "red" : "amber"} 
              loading={loading}
              description="Havanın təmizlik dərəcəsi. 0-50 əla, 50-100 orta, 100+ isə həssas qruplar üçün zərərlidir."
            />
            <StatCard 
              label="Xlorofil-a" 
              value="4.2" 
              unit="mg/m³" 
              trend="Yüksək" 
              icon="Droplets" 
              status="red" 
              loading={loading}
              description="Suda bitki planktonlarının miqdarı. Çox olması dənizdə oksigenin azalmasına səbəb olur."
            />
            <StatCard 
              label="Dalğa Hündürlüyü" 
              value={data?.marine?.current?.wave_height || "--"} 
              unit="m" 
              trend="Sakit" 
              icon="Waves" 
              loading={loading}
              description="Dəniz səthindəki dalğaların orta hündürlüyü. Naviqasiya üçün vacib göstəricidir."
            />
          </div>

          {/* Two-column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
            <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden relative flex flex-col shadow-sm h-[600px]">
              <div className="absolute top-0 left-0 w-full p-4 bg-surface-container-lowest/80 backdrop-blur-md z-10 border-b border-outline-variant/30 flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md text-on-surface text-lg">Caspian Sea Live Telemetry</h2>
                <div className="flex gap-2">
                  <button className="bg-surface border border-outline-variant px-3 py-1.5 rounded-lg text-xs font-label-sm flex items-center gap-2 hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm">layers</span> Layers
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-surface-container relative z-0">
                <MapView />
              </div>
            </div>

            <AIReport />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
              <h3 className="font-label-sm text-outline uppercase mb-4">Hava Keyfiyyəti (30 gün)</h3>
              <ChartPanel type="area" data={mockAQIData} xKey="day" yKey="aqi" color="#F59E0B" height={200} />
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm lg:col-span-2">
              <h3 className="font-label-sm text-outline uppercase mb-4">Həftəlik Temperatur Trendi</h3>
              <ChartPanel type="line" data={mockAQIData} xKey="day" yKey="aqi" color="#00D4B4" height={200} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
