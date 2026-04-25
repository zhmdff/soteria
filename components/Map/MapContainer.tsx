"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { getNASATileUrl } from "@/lib/nasagibs";
import { Loader2 } from "lucide-react";

interface MapInnerProps {
  center: [number, number];
  zoom: number;
}

function MapInner({ center, zoom }: MapInnerProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  date: string;
}

export default function Map({
  center = [41.0, 51.5],
  zoom = 5,
  date,
}: MapProps) {
  const [isMapLoading, setIsMapLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // We use a micro-task delay to avoid the 'cascading render' warning
    // while still showing the loading state immediately on prop change.
    const loadingTrigger = setTimeout(() => {
      setIsMapLoading(true);
    }, 0);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Auto-clear loading after a reasonable time for satellite tiles
    timerRef.current = setTimeout(() => {
      setIsMapLoading(false);
    }, 5000);

    return () => {
      clearTimeout(loadingTrigger);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [date]);

  return (
    <div className="w-full h-full bg-black relative">
      {/* Central Loading Spinner */}
      {isMapLoading && (
        <div className="absolute inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", background: "#000" }}
        zoomControl={false}
      >
        {/* Dark Underlay for gaps */}
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* High-Resolution Daily NASA Snapshot */}
        <TileLayer
          key={`daily-snapshot-${date}`}
          attribution='&copy; NASA GIBS'
          url={getNASATileUrl(date)}
          opacity={1}
          maxNativeZoom={9}
          zIndex={100}
          eventHandlers={{
            tileload: () => setIsMapLoading(false),
            tileerror: () => setIsMapLoading(false)
          }}
        />

        <MapInner center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
