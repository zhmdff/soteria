"use client";

import { Settings, History, Globe, Waves, Wind, Mountain } from "lucide-react";
import { NASA_CATEGORIES } from "@/lib/nasagibs";

interface MapControlPanelProps {
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  currentDate: Date;
  onAdjustDate: (type: 'day' | 'month' | 'year', amount: number) => void;
  onSetDate: (d: number, m: number, y: number) => void;
}

export default function MapControlPanel({ 
  activeLayerId, 
  onSelectLayer, 
  currentDate, 
  onAdjustDate, 
  onSetDate 
}: MapControlPanelProps) {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return (
    <div className="w-72 bg-surface-container-lowest border-r border-outline-variant flex flex-col overflow-hidden">
      <div className="p-4 border-b border-outline-variant bg-surface-container/30 flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        <h3 className="font-label-md text-sm text-on-surface uppercase tracking-tight">NASA Parametrləri</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {/* Date Navigator */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-primary" /> Zaman Naviqatoru
          </p>
          <div className="bg-surface-container/50 p-4 rounded-xl border border-outline-variant/20 space-y-4">
            <div className="flex gap-1.5">
               <input type="number" value={day} onChange={(e) => onSetDate(parseInt(e.target.value), month, year)} className="w-12 bg-surface border border-outline-variant/30 rounded px-1.5 py-1 text-xs font-mono text-center text-primary" />
               <input type="number" value={month} onChange={(e) => onSetDate(day, parseInt(e.target.value), year)} className="w-12 bg-surface border border-outline-variant/30 rounded px-1.5 py-1 text-xs font-mono text-center text-primary" />
               <input type="number" value={year} onChange={(e) => onSetDate(day, month, parseInt(e.target.value))} className="flex-1 bg-surface border border-outline-variant/30 rounded px-1.5 py-1 text-xs font-mono text-center text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div className="space-y-1">
                 <button onClick={() => onAdjustDate('day', 1)} className="w-full text-[9px] py-1 bg-primary/10 border border-primary/20 rounded hover:bg-primary/20 text-primary">+1 Gün</button>
                 <button onClick={() => onAdjustDate('month', 1)} className="w-full text-[9px] py-1 bg-primary/10 border border-primary/20 rounded hover:bg-primary/20 text-primary">+1 Ay</button>
                 <button onClick={() => onAdjustDate('year', 1)} className="w-full text-[9px] py-1 bg-primary/10 border border-primary/20 rounded hover:bg-primary/20 text-primary">+1 İl</button>
               </div>
               <div className="space-y-1">
                 <button onClick={() => onAdjustDate('day', -1)} className="w-full text-[9px] py-1 bg-surface border border-outline-variant/20 rounded hover:bg-surface-container text-on-surface-variant">-1 Gün</button>
                 <button onClick={() => onAdjustDate('month', -1)} className="w-full text-[9px] py-1 bg-surface border border-outline-variant/20 rounded hover:bg-surface-container text-on-surface-variant">-1 Ay</button>
                 <button onClick={() => onAdjustDate('year', -1)} className="w-full text-[9px] py-1 bg-surface border border-outline-variant/20 rounded hover:bg-surface-container text-on-surface-variant">-1 İl</button>
               </div>
            </div>
          </div>
        </div>

        {/* EONET Based Categories */}
        <CategorySection 
          title="Atmosfer" 
          icon={<Wind className="w-3.5 h-3.5" />} 
          layers={NASA_CATEGORIES.Atmosphere} 
          activeId={activeLayerId} 
          onSelect={onSelectLayer} 
        />
        
        <CategorySection 
          title="Okeanlar" 
          icon={<Waves className="w-3.5 h-3.5" />} 
          layers={NASA_CATEGORIES.Oceans} 
          activeId={activeLayerId} 
          onSelect={onSelectLayer} 
        />
        
        <CategorySection 
          title="Quru Səthi" 
          icon={<Mountain className="w-3.5 h-3.5" />} 
          layers={NASA_CATEGORIES.Land} 
          activeId={activeLayerId} 
          onSelect={onSelectLayer} 
        />
      </div>

      <div className="p-4 bg-surface-container/20 border-t border-outline-variant/30">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-3 h-3 text-outline" />
          <span className="text-[9px] text-outline font-bold uppercase">NASA GIBS EONET V3</span>
        </div>
        <p className="text-[8px] text-on-surface-variant leading-tight">
          Peyk görüntüləri real vaxtda sinxronizasiya edilir. Bəzi parametrlər buludlu havada görünməyə bilər.
        </p>
      </div>
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  layers: { id: string; name: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}

function CategorySection({ title, icon, layers, activeId, onSelect }: CategorySectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
        {icon} {title}
      </p>
      <div className="space-y-1.5">
        {layers.map((layer) => (
          <button 
            key={layer.id}
            onClick={() => onSelect(layer.id)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
              activeId === layer.id 
              ? "bg-primary/10 border-primary text-primary shadow-sm" 
              : "bg-surface border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container/50"
            }`}
          >
            <span className="text-[10px] font-medium leading-tight">{layer.name}</span>
            {activeId === layer.id && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
          </button>
        ))}
      </div>
    </div>
  );
}
