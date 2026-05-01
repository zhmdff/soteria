"use client";

import { useState, useEffect } from "react";
import MapView from "@/components/MapView";
import { GIBS_LAYERS, GIBSLayer } from "@/lib/nasagibs";
import { Layers, Map as MapIcon, Info, Calendar } from "lucide-react";
import { useMapSettings } from "@/context/MapContext";

export default function SatelliteMap() {
  const { location } = useMapSettings();
  const [activeLayer, setActiveLayer] = useState<GIBSLayer>(GIBS_LAYERS[0]);
  const [showLabels, setShowLabels] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md h-full min-h-[calc(100vh-120px)]">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Canlı Peyk Görünüşü</h1>
          <p className="font-body-md text-on-surface-variant">NASA GIBS vasitəsilə regional vizual analiz</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-2 flex gap-2 items-center px-4 shadow-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-on-surface uppercase tracking-widest">
                {mounted ? new Date().toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" }) : "..."}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter-lg flex-1">
        <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-lg relative min-h-[600px]">
          <MapView 
            center={[location.lat, location.lon]} 
            zoom={6} 
            title={activeLayer.name}
            activeLayerId={activeLayer.id}
            onLayerChange={(id) => {
              const layer = GIBS_LAYERS.find(l => l.id === id);
              if (layer) setActiveLayer(layer);
            }}
            hideLayerControls={true}
          />
          
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button 
              onClick={() => setShowLabels(!showLabels)}
              className={`p-3 rounded-full shadow-lg transition-all ${showLabels ? "bg-primary text-white" : "bg-white text-on-surface-variant"}`}
              title="Etiketləri Göstər/Gizlə"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary border-b border-outline-variant/20 pb-4">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold">Peyk Layları</h3>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {GIBS_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer)}
                  className={`w-full text-left p-3 rounded-lg text-xs font-medium transition-all border ${
                    activeLayer.id === layer.id 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-surface hover:bg-surface-container border-transparent text-on-surface-variant"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{layer.name}</span>
                    <span className="text-[10px] opacity-70 uppercase tracking-tighter">{layer.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-sm">Təsvir</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              {activeLayer.description || "Bu lay NASA GIBS tərəfindən təmin edilən elmi məlumatın vizual təsviridir."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
