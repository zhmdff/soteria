"use client";

import { useState, useEffect } from "react";
import { MoveDown, ArrowRightLeft, Info } from "lucide-react";

export default function WaterLevelTracker() {
  const [activeMetric, setActiveMetric] = useState<"level" | "shoreline">("level");
  const [levels, setLevels] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestLevel() {
      try {
        const res = await fetch("/api/caspian-data");
        const json = await res.json();
        if (json.levels) {
          setLevels(json.levels);
        }
      } catch (e) {
        console.error("Failed to fetch latest level", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestLevel();
  }, []);

  const latestLevel = levels.length > 0 ? levels[levels.length - 1].value : null;
  const prevDecadeLevel = levels.length > 120 ? levels[levels.length - 121].value : levels[0]?.value;
  const decline = latestLevel !== null && prevDecadeLevel !== undefined ? (latestLevel - prevDecadeLevel).toFixed(2) : "--";

  // Shoreline is harder to calculate without bathymetry, but we can estimate based on level drop
  // 1m drop roughly equals 100-500m retreat in shallow areas.
  const shorelineRetreat = latestLevel !== null ? Math.abs((latestLevel - (-26.43)) * 400).toFixed(0) : "--";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col gap-Stack-md h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="font-headline-md text-lg">Səviyyə və Sahil Xətti İzleyici</h3>
          <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded w-fit mt-1 uppercase font-bold tracking-tighter">
            Arxiv Analizi
          </span>
        </div>
        <div className="flex bg-surface-container rounded-lg p-1">
          <button onClick={() => setActiveMetric("level")} className={`px-3 py-1.5 rounded-md text-xs transition-all ${activeMetric === "level" ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
            Səviyyə
          </button>
          <button onClick={() => setActiveMetric("shoreline")} className={`px-3 py-1.5 rounded-md text-xs transition-all ${activeMetric === "shoreline" ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
            Sahil
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center flex-1">
        <div className="flex-1 space-y-4">
          {activeMetric === "level" ? (
            <>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display-xl text-error">{latestLevel !== null ? latestLevel.toFixed(2) : "--"}</span>
                  <span className="text-xl text-outline">metr</span>
                </div>
                <div className="text-xs text-error font-bold mt-1">10 illik dəyişim: {decline}m</div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">Xəzər dənizinin orta səviyyəsi son onillikdə kəskin şəkildə aşağı düşüb. Bu rəqəm 1992-ci ildən bəri toplanan peyk altimetriya məlumatlarına əsaslanır.</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display-xl text-amber-500">~{shorelineRetreat}</span>
                <span className="text-xl text-outline">metrədək</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">Su səviyyəsinin hər 1 metr düşməsi, dayaz sahillərdə (məs. şimal sahili) quru sahəsinin yüzlərlə metr genişlənməsinə səbəb olur.</p>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
                <ArrowRightLeft className="w-4 h-4" />
                Dinamik model: Səviyyə asılılığı
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-40 h-40 bg-surface-container rounded-2xl flex items-center justify-center relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="relative z-10 flex flex-col items-center w-full px-4">
             <div className="w-full h-0.5 bg-outline-variant/40 absolute top-[30%]"></div>
             <span className="text-[8px] text-outline absolute top-[22%]">1992 Səviyyəsi</span>
             
             <div className="w-full h-1 bg-primary/60 absolute shadow-[0_0_15px_rgba(0,212,180,0.4)]" style={{ top: `${30 + (Math.abs(latestLevel || -28) - 26.4) * 20}%` }}></div>
             <span className="text-[8px] text-primary absolute font-bold" style={{ top: `${35 + (Math.abs(latestLevel || -28) - 26.4) * 20}%` }}>Cari Vəziyyət</span>
          </div>
        </div>
      </div>
    </div>
  );
}
