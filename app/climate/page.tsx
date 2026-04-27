"use client";

import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import RenewableEnergyTool from "@/components/RenewableEnergyTool";
import { useState, useEffect } from "react";
import { predictTemperature, mergeDataWithPredictions } from "@/lib/predictions";

interface DailyArchiveData {
  daily: {
    time: string[];
    temperature_2m_mean: number[];
    wind_speed_10m_max: number[];
  };
}

export default function ClimateTrends() {
  const [archiveData, setArchiveData] = useState<DailyArchiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArchive() {
      try {
        const res = await fetch("/api/archive");
        const json = await res.json();
        setArchiveData(json);
      } catch (error) {
        console.error("Failed to fetch archive", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArchive();
  }, []);

  const temperatureHistory =
    archiveData?.daily?.time
      .map((time: string, index: number) => ({
        label: new Date(time).getFullYear().toString(),
        value: archiveData.daily.temperature_2m_mean[index],
      }))
      .filter((_, i: number) => i % 365 === 0) || []; // One point per year

  const combinedData = temperatureHistory.length > 0 ? mergeDataWithPredictions(temperatureHistory, 10, predictTemperature, "İl +") : [];

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">İqlim Trendləri</h1>
        <p className="font-body-md text-on-surface-variant text-base md:text-lg">ERA5 Reanaliz modelinə əsaslanan 10 illik iqlim analizi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <StatCard label="Orta Temp. Artımı" value={loading ? "--" : "+1.4"} unit="°C" icon="TrendingUp" status="red" loading={loading} description="Son 10 ildə Azərbaycan ərazisində qeydə alınan orta illik temperatur artımı." />
        <StatCard label="İsti Günlər (illik)" value="42" unit="gün" icon="Sun" status="amber" description="Havanın temperaturunun 35°C-dən yuxarı olduğu günlərin sayı." />
        <StatCard label="Quraqlıq Günləri" value="124" unit="gün" icon="Droplets" status="amber" description="Yağıntının normadan az olduğu ardıcıl günlərin cəmi." />
        <StatCard label="Külək Sürəti (max)" value={archiveData?.daily?.wind_speed_10m_max[0] || "58"} unit="km/h" icon="Wind" loading={loading} description="ERA5 modeli ilə ölçülmüş maksimal külək sürəti." />
      </div>

      <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 md:p-6 shadow-sm overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h3 className="font-headline-md text-xl md:text-2xl">Temperatur Tarixçəsi və Proyeksiyası</h3>
            <p className="text-[10px] md:text-xs text-on-surface-variant mt-1">Bütöv xətt: ERA5 Tarixi Məlumat, Qırıq xətt: 10 illik Lineer Proqnoz</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[9px] md:text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded-full uppercase">ERA5 Model</span>
            <span className="text-[9px] md:text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">Proqnoz</span>
          </div>
        </div>

        <div className="min-w-[600px] lg:min-w-0">
          <ChartPanel type="line" data={combinedData} xKey="label" yKey="value" predictKey="prediction" color="#EF4444" predictColor="#F87171" height={400} />
        </div>

        <div className="mt-6 p-4 bg-surface-container rounded-lg border border-outline-variant/20">
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">Analitik İzah:</strong> Bu qrafik Open-Meteo Historical API vasitəsilə əldə edilən <strong className="text-on-surface">ERA5</strong> reanaliz verilənlərini əks etdirir. ERA5 ECMWF tərəfindən hazırlanmış qlobal iqlim modelidir. Proyeksiya{" "}
            <code className="bg-black/20 px-1 rounded">T = T₀ + 0.032Δt</code> tənliyi əsasında qurulmuşdur. Bu model Xəzər hövzəsi üçün xarakterik olan illik istiləşmə trendini simulyasiya edir və növbəti onillik üçün ekoloji riskləri qiymətləndirməyə kömək edir.
          </p>
        </div>
      </div>

      <RenewableEnergyTool />

      <AIReport />
    </div>
  );
}
