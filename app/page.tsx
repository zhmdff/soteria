"use client";

import { useState, useEffect } from "react";
import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";
import MapView from "@/components/MapView";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import { AirQualityData, MarineData, WeatherData } from "@/lib/openmeteo";

interface HomeData {
  air: AirQualityData;
  marine: MarineData;
  weather: WeatherData;
}

import { predictTemperature, predictWaterLevel, predictAQI, generatePredictionData } from "@/lib/predictions";

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [airRes, marineRes, weatherRes] = await Promise.all([fetch("/api/pollution"), fetch("/api/marine"), fetch("/api/weather")]);
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

  const currentAQI = data?.air?.current?.european_aqi || 87;
  const aqiPrediction = generatePredictionData(currentAQI, 7, predictAQI, "Gün +");

  const currentTemp = data?.weather?.current?.temperature_2m || 15;
  const tempPrediction = generatePredictionData(currentTemp, 10, predictTemperature, "İl +");

  const waterLevelPrediction = generatePredictionData(-28.7, 10, predictWaterLevel, "İl +");

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
            <StatCard label="Dəniz Səthi Temperaturu" value={seaTemp || "--"} unit="°C" trend="Stabil" icon="Thermometer" status={(seaTemp ?? 0) > 26 ? "red" : "green"} loading={loading} description="Dəniz suyunun üst qatının temperaturu. Yüksək temperatur ekosistemə mənfi təsir edə bilər." />
            <StatCard
              label="Hava Keyfiyyəti İndeksi"
              value={data?.air?.current?.european_aqi || "--"}
              trend="Moderate"
              icon="Wind"
              status={(data?.air?.current?.european_aqi ?? 0) > 100 ? "red" : "amber"}
              loading={loading}
              description="Havanın təmizlik dərəcəsi. 0-50 əla, 50-100 orta, 100+ isə həssas qruplar üçün zərərlidir."
            />
            <StatCard label="Xlorofil-a" value="4.2" unit="mg/m³" trend="Yüksək" icon="Droplets" status="red" loading={loading} description="Suda bitki planktonlarının miqdarı. Çox olması dənizdə oksigenin azalmasına səbəb olur." />
            <StatCard label="Dalğa Hündürlüyü" value={data?.marine?.current?.wave_height || "--"} unit="m" trend="Sakit" icon="Waves" loading={loading} description="Dəniz səthindəki dalğaların orta hündürlüyü. Naviqasiya üçün vacib göstəricidir." />
          </div>

          {/* Two-column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
            <div className="col-span-1 lg:col-span-2">
              <MapView />
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

          {/* Prediction Center Section */}
          <div className="mt-8 border-t border-outline-variant/20 pt-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">monitoring</span>
              </div>
              <div>
                <h2 className="text-2xl font-headline-lg text-on-surface">Proqnozlaşdırma Mərkəzi</h2>
                <p className="text-on-surface-variant text-sm">Riyazi modellər əsasında ekoloji trendlər</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
              {/* AQI Prediction */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold mb-4 flex items-center justify-between">
                  Hava Keyfiyyəti (7 günlük)
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase">Trend</span>
                </h4>
                <ChartPanel type="area" data={aqiPrediction} xKey="label" yKey="value" predictKey="prediction" color="#F59E0B" height={160} />
                <div className="mt-4 text-[10px] text-on-surface-variant leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
                   AQI_pred = AQI_curr * e^(0.005*t) modeli ilə hesablanıb.
                </div>
              </div>

              {/* Water Level Prediction */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold mb-4 flex items-center justify-between">
                  Dəniz Səviyyəsi (10 illik)
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Balans</span>
                </h4>
                <ChartPanel type="line" data={waterLevelPrediction} xKey="label" yKey="value" predictKey="prediction" color="#00D4B4" height={160} />
                <div className="mt-4 text-[10px] text-on-surface-variant leading-relaxed italic border-l-2 border-primary/30 pl-3">
                   İllik -6.8sm mənfi su balansı trendini simulyasiya edir.
                </div>
              </div>

              {/* Temp Prediction */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold mb-4 flex items-center justify-between">
                  İqlim İstiləşməsi (10 illik)
                  <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase">Warming</span>
                </h4>
                <ChartPanel type="line" data={tempPrediction} xKey="label" yKey="value" predictKey="prediction" color="#EF4444" height={160} />
                <div className="mt-4 text-[10px] text-on-surface-variant leading-relaxed italic border-l-2 border-red-500/30 pl-3">
                   T = T₀ + 0.032*(Year-Year₀) lineer artım modeli.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
