"use client";

import { useState, useEffect, useCallback } from "react";
import AIReport from "@/components/AIReport";
import StatCard from "@/components/StatCard";
import ChartPanel from "@/components/ChartPanel";
import RenewableEnergyTool from "@/components/RenewableEnergyTool";
import { SatelliteRadiationData } from "@/lib/openmeteo";
import { Sun, Info } from "lucide-react";
import { useMapSettings } from "@/context/MapContext";

export default function RenewableEnergy() {
  const { location } = useMapSettings();
  const [data, setData] = useState<SatelliteRadiationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRadiation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/satellite-radiation?lat=${location.lat}&lon=${location.lon}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch radiation data", error);
    } finally {
      setLoading(false);
    }
  }, [location.lat, location.lon]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRadiation();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRadiation]);

  const radiationData = data?.hourly?.time.map((time, index) => ({
    label: new Date(time).getHours() + ":00",
    ghi: data.hourly.shortwave_radiation[index],
    dni: data.hourly.direct_normal_irradiance[index],
    dhi: data.hourly.diffuse_radiation[index],
  })) || [];

  const maxGHI = Math.max(...(data?.hourly?.shortwave_radiation || [0]));
  const avgDNI = (data?.hourly?.direct_normal_irradiance.reduce((a, b) => a + b, 0) || 0) / 24;

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Bərpa Olunan Enerji Potensialı</h1>
        <p className="font-body-md text-on-surface-variant">Günəş və külək enerjisi üçün peyk əsaslı temporal analiz</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <StatCard label="Maks. Radiasiya (GHI)" value={maxGHI.toFixed(0)} unit="W/m²" icon="Sun" loading={loading} status={maxGHI > 800 ? "green" : "amber"} description="Yer səthinə düşən toplam qısa dalğalı radiasiya (birbaşa və diffuz şüalanmanın cəmi)." />
        <StatCard label="Orta DNI" value={avgDNI.toFixed(0)} unit="W/m²" icon="Zap" loading={loading} description="Birbaşa normal şüalanma (günəş panelləri üçün kritik)." />
        <StatCard label="Fotovoltayik Effektivlik" value="Yüksək" unit="" icon="Battery" loading={loading} description="Günəş radiasiyası və temperatur əsasında günəş panellərinin elektrik istehsalı potensialı." />
        <StatCard label="Külək Potensialı" value="7.2" unit="m/s" icon="Wind" loading={loading} description="80m hündürlükdə proqnozlaşdırılan orta sürət." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        <div className="lg:col-span-2 space-y-gutter-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-primary flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Günəş Radiasiyası Analizi (24 Saat)
                </h3>
                <p className="text-[10px] text-outline uppercase tracking-widest font-bold mt-1">GHI vs DNI vs DHI</p>
              </div>
            </div>
            <ChartPanel 
              type="area" 
              data={radiationData} 
              xKey="label" 
              yKey="ghi" 
              color="#F59E0B" 
              height={350} 
            />
            <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"></div> GHI (Qlobal Horizontal)</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded"></div> DNI (Birbaşa Normal)</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded"></div> DHI (Diffuz Horizontal)</div>
            </div>
          </div>

          <RenewableEnergyTool />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-sm mb-4 flex items-center gap-2 text-primary">
              <Info className="w-5 h-5" />
              Texniki Qeyd
            </h3>
            <div className="space-y-4 text-xs text-on-surface-variant leading-relaxed">
              <p>
                <strong>GHI (Global Horizontal Irradiance):</strong> Yer səthinə düşən toplam qısa dalğalı radiasiya.
              </p>
              <p>
                <strong>DNI (Direct Normal Irradiance):</strong> Günəş şüalarına perpendikulyar olan səthə düşən birbaşa radiasiya. İzləmə sistemli panellər üçün əsas göstəricidir.
              </p>
              <p>
                <strong>GTI (Global Tilted Irradiance):</strong> Müəyyən bucaq altında (adətən 45°) quraşdırılmış panellər üçün hesablanmış radiasiya.
              </p>
            </div>
          </div>
          <AIReport />
        </div>
      </div>
    </div>
  );
}
