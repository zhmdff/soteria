"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Calendar, ChevronLeft, ChevronRight, History } from "lucide-react";

const MapContainer = dynamic(() => import("./Map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-4xl text-outline text-primary/20">satellite</span>
    </div>
  ),
});

// NASA Limit & Historical Range
const MAX_DATE = new Date("2026-01-01");
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

  const currentDate = useMemo(() => {
    const d = new Date(MAX_DATE);
    d.setDate(d.getDate() - daysOffset);
    return d;
  }, [daysOffset]);

  const dateString = useMemo(() => currentDate.toISOString().split("T")[0], [currentDate]);

  return (
    <div className="flex flex-col h-full w-full gap-gutter-md">
      {/* 1. Map Image Container */}
      <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-outline-variant/20 shadow-lg relative min-h-[400px]">
        <MapContainer center={center} zoom={zoom} date={dateString} />

        <div className="absolute top-4 left-4 z-20">
          <div className="bg-slate-900/80 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{title}</span>
          </div>
        </div>
      </div>

      {/* 2. Zaman Naviqatoru Container */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Date Info Display */}
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-outline uppercase font-bold tracking-widest">Snapshot Tarixi</span>
              <span className="text-xl font-display-md text-on-surface font-bold tracking-tight">{currentDate.toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Slider Section: Left is TODAY, Right is PAST */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-outline font-bold flex items-center gap-1.5">
                <History className="w-3 h-3" /> Arxiv Dərinliyi: {daysOffset} gün əvvəl
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-bold">2020 - 2026</span>
              </div>
            </div>

            <div className="relative h-6 flex items-center px-1">
              <input type="range" min="0" max={TOTAL_DAYS} value={daysOffset} onChange={(e) => setDaysOffset(parseInt(e.target.value))} className="w-full h-1.5 bg-surface-container rounded-full appearance-none cursor-pointer accent-primary hover:bg-surface-container-high transition-colors" />
            </div>

            <div className="flex justify-between text-[9px] text-outline font-bold uppercase tracking-tighter opacity-60">
              <span className="text-primary font-black">BUGÜN (2026)</span>
              <span>2023 ARXİVİ</span>
              <span>2020 ARXİVİ</span>
            </div>
          </div>

          {/* Precise Adjustment Buttons */}
          <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-6 h-12">
            <button onClick={() => setDaysOffset((prev) => Math.min(TOTAL_DAYS, prev + 1))} className="p-2.5 hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-primary transition-all border border-transparent hover:border-primary/20" title="Geri">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button onClick={() => setDaysOffset(0)} className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,212,180,0.3)]">
              GÜNCƏLLƏ
            </button>

            <button onClick={() => setDaysOffset((prev) => Math.max(0, prev - 1))} disabled={daysOffset === 0} className="p-2.5 hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-primary transition-all border border-transparent hover:border-primary/20 disabled:opacity-20" title="İrəli">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
