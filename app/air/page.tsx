"use client";

import { useState, useEffect } from "react";
import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import { AirQualityData } from "@/lib/openmeteo";

import { predictAQI, generatePredictionData } from "@/lib/predictions";

export default function AirQuality() {
  const [data, setData] = useState<AirQualityData | null>(null);
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

  const currentAQI = data?.current?.european_aqi || 87;
  const aqiPrediction = generatePredictionData(currentAQI, 10, predictAQI, "Gün +");

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
            <StatCard 
              label="PM2.5" 
              value={data?.current?.pm2_5 || "--"} 
              unit="μg/m³" 
              icon="Wind" 
              loading={loading} 
              status={(data?.current?.pm2_5 ?? 0) > 25 ? "amber" : "green"} 
              description="Havadakı 2.5 mikrondan kiçik toz hissəcikləri. Ağciyərlərin dərinliyinə nüfuz edə bilir."
            />
            <StatCard 
              label="PM10" 
              value={data?.current?.pm10 || "--"} 
              unit="μg/m³" 
              icon="Wind" 
              loading={loading} 
              description="Havadakı 10 mikrondan kiçik toz hissəcikləri. Tənəffüs yollarına təsir edir."
            />
            <StatCard 
              label="NO₂" 
              value={data?.current?.nitrogen_dioxide || "--"} 
              unit="μg/m³" 
              icon="Activity" 
              loading={loading} 
              description="Azot dioksid. Əsasən avtomobil egzozlarından və sənaye sahələrindən yaranır."
            />
            <StatCard 
              label="O₃ (Ozon)" 
              value={data?.current?.ozone || "--"} 
              unit="μg/m³" 
              icon="Sun" 
              loading={loading} 
              description="Yer səthinə yaxın ozon. İnsan sağlamlığı və bitkilər üçün zərərlidir."
            />
            <StatCard 
              label="CO" 
              value={data?.current?.carbon_monoxide || "--"} 
              unit="mg/m³" 
              icon="Wind" 
              loading={loading} 
              description="Dəm qazı. Yanacağın tam yanmaması nəticəsində yaranan rəngsiz, dadsız qaz."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline-sm text-primary">Hava Keyfiyyəti Proyeksiya (10 günlük)</h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Trend Modeli</span>
              </div>
              <ChartPanel 
                type="area" 
                data={aqiPrediction} 
                xKey="label" 
                yKey="value" 
                predictKey="prediction" 
                color="#F59E0B" 
                predictColor="#D97706"
                height={250} 
              />
              <div className="mt-4 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Analitik Model:</strong> <code className="bg-black/20 px-1 rounded">AQI_pred = AQI_curr * e^(r*t)</code> eksponensial artım tənliyi əsasında qurulmuşdur. Burada <code className="bg-black/20 px-1 rounded">r = 0.005</code> lokal sənaye aktivliyi və mövsümi inversiya faktorlarını nəzərə alan variasiya əmsalıdır. Model qısamüddətli çirklənmə trendlərini proqnozlaşdırır.
                </p>
              </div>
            </div>
            <AIReport />
          </div>
        </main>
      </div>
    </div>
  );
}
