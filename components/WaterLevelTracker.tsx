"use client";

import { useState, useEffect } from "react";
import { MoveDown, ArrowRightLeft, Info } from "lucide-react";

export default function WaterLevelTracker() {
  const [activeMetric, setActiveMetric] = useState<"level" | "shoreline">("level");
  const [latestLevel, setLatestLevel] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLatestLevel() {
      try {
        const res = await fetch("/api/caspian-data");
        const json = await res.json();
        if (json.levels && json.levels.length > 0) {
          // get the last entry
          const lastEntry = json.levels[json.levels.length - 1];
          setLatestLevel(lastEntry.value);
        }
      } catch (e) {
        console.error("Failed to fetch latest level", e);
      }
    }
    fetchLatestLevel();
  }, []);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="font-headline-md text-lg">Səviyyə və Sahil Xətti İzleyici</h3>
          <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded w-fit mt-1">
            Arxiv Məlumatı (Daimi olaraq yenilənmir)
          </span>
        </div>
        <div className="flex bg-surface-container rounded-lg p-1">
          <button onClick={() => setActiveMetric("level")} className={`px-3 py-1.5 rounded-md text-xs transition-all ${activeMetric === "level" ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
            Su Səviyyəsi
          </button>
          <button onClick={() => setActiveMetric("shoreline")} className={`px-3 py-1.5 rounded-md text-xs transition-all ${activeMetric === "shoreline" ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
            Sahil Xətti
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          {activeMetric === "level" ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display-xl text-error">{latestLevel !== null ? latestLevel.toFixed(2) : "-28.70"}</span>
                <span className="text-xl text-outline">metr</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">Xəzər dənizinin orta səviyyəsi son illərdə sürətlə aşağı düşüb. Bu rəqəm lokal arxiv bazasındakı son məlumatı göstərir.</p>
              <div className="flex items-center gap-2 text-error text-xs font-label-sm">
                <MoveDown className="w-4 h-4" />
                Davamlı azalma trendi
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display-xl text-amber-500">+1200</span>
                <span className="text-xl text-outline">metrədək</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">Bəzi ərazilərdə (xüsusilə şimal-şərq) sahil xətti dənizin içərisinə doğru 1 kilometrdən çox geri çəkilib. Bu məlumat da peyk analizlərindən alınır (statikdir).</p>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-label-sm">
                <ArrowRightLeft className="w-4 h-4" />
                Geri çəkilmə sürəti: Artır
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-48 h-48 bg-surface-container rounded-xl flex items-center justify-center relative overflow-hidden group">
          {/* Visual representation of level drop */}
          <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-1 bg-outline-variant/30 absolute top-12"></div>
            <div className="w-32 h-1 bg-primary/60 absolute top-24 shadow-[0_0_10px_rgba(0,212,180,0.5)]"></div>
            <span className="text-[10px] text-outline absolute top-6">2020 Səviyyəsi</span>
            <span className="text-[10px] text-primary absolute top-28">Son Səviyyə</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex gap-3 items-start">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] text-on-surface-variant leading-normal">Dəniz səviyyəsi lokal JSON arxiv fayllarından əldə edilib və gündəlik real-time yenilənmir.</p>
      </div>
    </div>
  );
}
