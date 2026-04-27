"use client";

import { Calendar, Info } from "lucide-react";

export type TimeRange = "1m" | "1y" | "10y";

interface TimeRangeSelectorProps {
  activeRange: TimeRange;
  onChange: (range: TimeRange) => void;
  availableMin?: string;
  availableMax?: string;
}

export default function TimeRangeSelector({ activeRange, onChange, availableMin, availableMax }: TimeRangeSelectorProps) {
  const ranges: { label: string; value: TimeRange }[] = [
    { label: "1 Ay", value: "1m" },
    { label: "1 İl", value: "1y" },
    { label: "10 İl", value: "10y" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
      {availableMin && availableMax && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-[10px] text-outline font-bold border border-outline-variant/30 shadow-sm uppercase tracking-tight">
          <Info className="w-3 h-3 text-primary" />
          <span className="opacity-70">Məlumat:</span> {availableMin} — {availableMax}
        </div>
      )}
      
      <div className="flex bg-surface-container/50 backdrop-blur-sm rounded-lg p-1 border border-outline-variant/30 shadow-sm">
        <div className="hidden md:flex items-center px-2 mr-1 text-outline">
          <Calendar className="w-3.5 h-3.5" />
        </div>
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={`px-3 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${
              activeRange === range.value
                ? "bg-primary text-on-primary shadow-sm scale-105"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
