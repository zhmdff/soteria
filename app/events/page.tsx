"use client";

import { useState, useEffect, useCallback } from "react";
import MapView from "@/components/MapView";
import AIReport from "@/components/AIReport";
import StatCard from "@/components/StatCard";
import { EONETEvent } from "@/lib/eonet";
import { AlertTriangle, Flame, Droplets, Wind, Zap, Activity } from "lucide-react";
import { useMapSettings } from "@/context/MapContext";

export default function NaturalEvents() {
  const { location } = useMapSettings();
  const [events, setEvents] = useState<EONETEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [isGlobal, setIsGlobal] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?days=${days}`);
      const data = await res.json();
      
      // Filter for events in the Caspian region (roughly 35-50N, 45-55E)
      const regionalEvents = data.filter((event: EONETEvent) => {
        return event.geometry.some(geo => {
          const [lon, lat] = geo.coordinates;
          return lat >= 35 && lat <= 55 && lon >= 45 && lon <= 60;
        });
      });
      
      if (regionalEvents.length > 0) {
        setEvents(regionalEvents);
        setIsGlobal(false);
      } else {
        setEvents(data.slice(0, 10)); // Fallback to latest global if none regional
        setIsGlobal(true);
      }
    } catch (error) {
      console.error("Failed to fetch EONET events", error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "wildfires": return <Flame className="text-red-500" />;
      case "floods": return <Droplets className="text-blue-500" />;
      case "severe storms": return <Wind className="text-slate-500" />;
      case "volcanoes": return <Activity className="text-orange-600" />;
      case "earthquakes": return <Zap className="text-amber-500" />;
      default: return <AlertTriangle className="text-amber-500" />;
    }
  };

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">
            {isGlobal ? "Təbii Hadisələr: Qlobal Monitorinq" : "Təbii Hadisələr: Regional İzləmə"}
          </h1>
          <p className="font-body-md text-on-surface-variant">
            {isGlobal 
              ? "Regionda aktiv hadisə tapılmadı, qlobal NASA EONET məlumatları göstərilir" 
              : "NASA EONET vasitəsilə Xəzər regionunda aktiv yanğınlar və daşqınlar"}
          </p>
        </div>
        <div className="flex gap-2">
          {[30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                days === d ? "bg-primary text-white shadow-lg" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              Son {d} Gün
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        <div className="lg:col-span-2 flex flex-col gap-stack-md">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm h-[500px]">
            <MapView 
              center={isGlobal ? [20, 0] : [location.lat, location.lon]} 
              zoom={isGlobal ? 2 : 4} 
              title={isGlobal ? "Qlobal Aktiv Hadisələr" : "Regional Aktiv Hadisələr"} 
              // In a real app, we'd pass events to MapView to render markers
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                <div className="bg-surface-container p-3 rounded-lg flex items-center justify-center h-fit">
                  {getEventIcon(event.categories[0]?.title || "")}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">{event.title}</h4>
                  <p className="text-[10px] text-outline uppercase tracking-wider font-bold">
                    {event.categories[0]?.title} • {new Date(event.geometry[0].date).toLocaleDateString("az-AZ")}
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {isGlobal 
                      ? "Bu qlobal hadisə region kənarında baş verib və ümumi monitorinq altındadır." 
                      : `Hadisə ${location.name} regionu üçün monitorinq altındadır.`}
                  </p>
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary underline mt-2">
                    NASA-dan ətraflı məlumat
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-12 flex flex-col items-center justify-center text-outline opacity-50 border-2 border-dashed border-outline-variant/20 rounded-xl">
                <AlertTriangle className="w-12 h-12 mb-2" />
                <p className="font-bold uppercase tracking-widest">Cari dövrdə aktiv hadisə tapılmadı</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <StatCard label={isGlobal ? "Qlobal Hadisələr" : "Regional Hadisələr"} value={events.length} unit="ədəd" icon="AlertTriangle" loading={loading} />
            <StatCard label="Monitorinq Sahəsi" value={isGlobal ? "Qlobal" : "Xəzər Hövzəsi"} unit="" icon="Globe" loading={loading} />
          </div>
          <AIReport />
        </div>
      </div>
    </div>
  );
}
