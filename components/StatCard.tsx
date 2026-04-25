"use client";

import { Info } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: string;
  icon: keyof typeof Icons;
  status?: "green" | "amber" | "red";
  loading?: boolean;
}

export default function StatCard({ label, value, unit, description, trend, icon, status = "green", loading = false }: StatCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const IconComponent = (Icons[icon] as React.ElementType) || Icons.Activity;

  if (loading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm animate-pulse h-32">
        <div className="flex justify-between items-start mb-4">
          <div className="w-20 h-3 bg-surface-container rounded"></div>
          <div className="w-6 h-6 bg-surface-container rounded-full"></div>
        </div>
        <div className="w-24 h-8 bg-surface-container rounded"></div>
      </div>
    );
  }

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm relative transition-all hover:scale-[1.02] group z-10`}>
      {/* Background clipping layer for decorative elements and status bar */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-current opacity-20 ${status === "red" ? "text-error" : status === "amber" ? "text-warning" : "text-success"}`}></div>
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider text-[10px]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {description && (
            <div className="relative">
              <button onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} className="text-outline hover:text-primary transition-colors cursor-help">
                <Info className="w-4 h-4 opacity-50 hover:opacity-100" />
              </button>
              {showInfo && (
                <div className="absolute bottom-full right-0 mb-3 w-48 p-3 bg-surface-container-high border border-outline-variant rounded-xl shadow-2xl z-[9999] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200">
                  <p className="text-[11px] font-body-sm text-on-surface leading-normal">{description}</p>
                </div>
              )}
            </div>
          )}
          <IconComponent className="w-5 h-5 text-primary opacity-70" />
        </div>
      </div>

      <div className="font-display-xl text-display-xl text-on-surface relative z-10">
        {value}
        {unit && <span className="text-2xl text-outline ml-1">{unit}</span>}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 relative z-10">
          <div className="px-2 py-1 bg-surface-container rounded text-[10px] font-label-sm text-primary">{trend}</div>
        </div>
      )}
    </div>
  );
}
