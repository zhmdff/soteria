"use client";

import { useState, useEffect } from "react";
import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";
import MapView from "@/components/MapView";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import WaterLevelTracker from "@/components/WaterLevelTracker";
import { MarineData, WeatherData } from "@/lib/openmeteo";

interface CaspianSeaData extends MarineData {
  weatherFallback: WeatherData;
}

import { predictWaterLevel, generatePredictionData } from "@/lib/predictions";

export default function CaspianSea() {
  const [data, setData] = useState<CaspianSeaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [marineRes, weatherRes] = await Promise.all([fetch("/api/marine"), fetch("/api/weather")]);
        const marine = await marineRes.json();
        const weather = await weatherRes.json();
        setData({ ...marine, weatherFallback: weather });
      } catch (error) {
        console.error("Failed to fetch marine data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentLevel = -28.7;
  const waterLevelPrediction = generatePredictionData(currentLevel, 10, predictWaterLevel, "İl +");

  const mockHistoricalTemp = [
    { year: "2015", temp: 22.1 },
    { year: "2020", temp: 24.1 },
    { year: "2025", temp: 25.4 },
  ];

  const seaTemp = data?.current?.sea_surface_temperature ?? data?.weatherFallback?.current?.temperature_2m;

  return (
    <div className="flex min-h-screen">
      <SideNavBar activeTab="caspian" />
      <div className="flex flex-col flex-1 ml-sidebar-width">
        <TopNavBar />
        <main className="pt-16 min-h-screen p-gutter-lg flex flex-col gap-stack-md">
          <div className="mt-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface text-4xl">Xəzər Dənizi Monitorinqi</h1>
            <p className="font-body-md text-on-surface-variant">Səviyyə dəyişimi və çirklənmə analizi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
            <StatCard label="Dəniz Səthi Hərarəti" value={seaTemp || "--"} unit="°C" icon="Thermometer" loading={loading} description="Xəzər dənizinin mərkəzi hissəsində suyun səth temperaturu." />
            <StatCard label="Dalğa Hündürlüyü" value={data?.current?.wave_height || "--"} unit="m" icon="Waves" loading={loading} description="Mərkəzi Xəzərdə dalğaların əhəmiyyətli hündürlüyü." />
            <StatCard label="Xlorofil-a" value="4.2" unit="mg/m³" icon="Droplets" status="red" trend="Yüksək" description="Fitoplankton konsentrasiyası. Suyun bioloji sağlamlıq göstəricisidir." />
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
              <h3 className="font-headline-sm mb-6">10 İllik Temperatur Trendi</h3>
              <ChartPanel type="area" data={mockHistoricalTemp} xKey="year" yKey="temp" color="#00D4B4" height={250} />
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline-sm text-primary">Səviyyə Proyeksiyası (10 illik)</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider">Su Balansı Modeli</span>
              </div>
              <ChartPanel type="line" data={waterLevelPrediction} xKey="label" yKey="value" predictKey="prediction" color="#00D4B4" predictColor="#2DD4BF" height={250} />
              <div className="mt-4 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Analitik Model:</strong> <code className="bg-black/20 px-1 rounded">L(t+1) = L(t) + (P + R - E) / Area</code> tənliyi əsasında hesablanmışdır. Mövcud iqlim şəraitində buxarlanmanın (E) yağıntı (P) və çay axınından (R) çox olması mənfi su balansı yaradır. Model illik
                  orta <code className="bg-black/20 px-1 rounded">6.8 sm</code> azalma trendini simulyasiya edir.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
