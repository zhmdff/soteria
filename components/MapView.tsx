"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Calendar, ChevronLeft, ChevronRight, History, Layers } from "lucide-react";
import { GIBS_LAYERS } from "@/lib/nasagibs";

const MapContainer = dynamic(() => import("./Map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-4xl text-outline text-primary/20">satellite</span>
    </div>
  ),
});

// NASA Limit & Historical Range
const MAX_DATE = new Date("2026-04-25");
const MIN_DATE = new Date("2020-01-01");

// Total days between 2020 and 2026 (~2192 days)
const TOTAL_DAYS = Math.floor((MAX_DATE.getTime() - MIN_DATE.getTime()) / (1000 * 60 * 60 * 24));

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  title?: string;
}

export default function MapView({ 
  center, 
  zoom, 
  title = "NASA GIBS Satellite Explorer" 
}: MapViewProps) {
  // daysOffset: 0 = Today (Jan 1, 2026), TOTAL_DAYS = Past (Jan 1, 2020)
  const [daysOffset, setDaysOffset] = useState(0);
  const [activeLayerId, setActiveLayerId] = useState(GIBS_LAYERS[0].id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const currentDate = useMemo(() => {
    const d = new Date(MAX_DATE);
    d.setDate(d.getDate() - daysOffset);
    return d;
  }, [daysOffset]);

  const dateString = useMemo(() => currentDate.toISOString().split("T")[0], [currentDate]);

  const activeLayer = useMemo(() => 
    GIBS_LAYERS.find(l => l.id === activeLayerId) || GIBS_LAYERS[0]
  , [activeLayerId]);

  return (
    <div className="flex flex-col h-full w-full gap-gutter-md">
      {/* 1. Map Image Container */}
      <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-outline-variant/20 shadow-lg relative min-h-[400px]">
        <MapContainer center={center} zoom={zoom} date={dateString} activeLayerId={activeLayerId} />

        {/* Floating Top Labels */}
        <div className="absolute top-4 left-4 z-[3000] flex flex-col gap-2">
          <div className="bg-slate-900/80 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{title}</span>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-lg">
            <span className="text-[10px] text-white/70 font-medium">Cari Lay: {activeLayer.name}</span>
          </div>
        </div>
      </div>

      {/* 2. Unified Control Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-8">
        
        {/* ROW 1: Timeline Slider */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Date Display */}
          <div className="flex items-center gap-4 min-w-[280px]">
            <div className="p-3.5 bg-primary/10 rounded-2xl text-primary shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-outline uppercase font-black tracking-widest mb-0.5">Snapshot Tarixi</span>
              <span className="text-2xl font-display-md text-on-surface font-bold tracking-tight">
                {mounted ? currentDate.toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" }) : "Yüklənir..."}
              </span>
            </div>
          </div>

          {/* Slider Section */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-outline font-black uppercase tracking-widest flex items-center gap-2">
                <History className="w-3.5 h-3.5" /> Arxiv Dərinliyi: {daysOffset} gün
              </span>
              <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono font-black">2020 - 2026</span>
            </div>

            <div className="relative h-6 flex items-center px-1 group">
              <input 
                type="range" 
                min="0" 
                max={TOTAL_DAYS} 
                value={daysOffset} 
                onChange={(e) => setDaysOffset(parseInt(e.target.value))} 
                className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary hover:h-2.5 transition-all" 
              />
            </div>

            <div className="flex justify-between text-[10px] text-outline font-black uppercase tracking-widest opacity-60">
              <span className="text-primary">BUGÜN</span>
              <span>2023</span>
              <span>2020</span>
            </div>
          </div>

          {/* Time Controls */}
          <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-8">
            <button onClick={() => setDaysOffset((prev) => Math.min(TOTAL_DAYS, prev + 1))} className="p-3 hover:bg-surface-container rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-transparent hover:border-primary/20">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => setDaysOffset(0)} className="px-8 py-3 bg-primary text-white text-[11px] font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">
              Bugün
            </button>
            <button onClick={() => setDaysOffset((prev) => Math.max(0, prev - 1))} disabled={daysOffset === 0} className="p-3 hover:bg-surface-container rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-transparent hover:border-primary/20 disabled:opacity-20">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ROW 2: Layer Selection */}
        <div className="border-t border-outline-variant/20 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-outline uppercase font-black tracking-[0.2em]">Məlumat Layını Seçin</span>
          </div>

          <div className="flex flex-wrap gap-4">
            {Array.from(new Set(GIBS_LAYERS.map(l => l.category))).map((category) => (
              <div key={category} className="flex flex-col gap-3">
                <span className="text-[9px] text-primary/60 font-black uppercase tracking-widest px-1">{category}</span>
                <div className="flex flex-wrap gap-2">
                  {GIBS_LAYERS.filter(l => l.category === category).map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        activeLayerId === layer.id 
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                          : "bg-surface-container hover:bg-surface-container-high border-outline-variant/30 text-on-surface-variant"
                      }`}
                    >
                      {layer.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
