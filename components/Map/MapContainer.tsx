"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef, useMemo } from "react";
import { getNASATileUrl, GIBS_LAYERS, REFERENCE_LABELS_LAYER, REFERENCE_FEATURES_LAYER } from "@/lib/nasagibs";
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
  activeLayerId?: string;
}

export default function Map({ center = [41.0, 51.5], zoom = 5, date, activeLayerId = GIBS_LAYERS[0].id }: MapProps) {
  const [isMapLoading, setIsMapLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeLayer = useMemo(() => {
    return GIBS_LAYERS.find((l) => l.id === activeLayerId) || GIBS_LAYERS[0];
  }, [activeLayerId]);

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
  }, [date, activeLayerId]);

  return (
    <div className="w-full h-full bg-black relative">
      {/* Central Loading Spinner */}
      {isMapLoading && (
        <div className="absolute inset-0 z-2000 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%", background: "#000" }} zoomControl={false}>
        {/* Dark Underlay for gaps */}
        <TileLayer attribution="&copy; CARTO" url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />

        {/* High-Resolution Daily NASA Snapshot */}
        {activeLayer &&
          (() => {
            const maxZoomStr = activeLayer.matrix.split("_Level")[1];
            const parsedZoom = maxZoomStr ? parseInt(maxZoomStr, 10) : 9;
            const maxNativeZoom = isNaN(parsedZoom) ? 9 : parsedZoom;

            return (
              <TileLayer
                key={`snapshot-${activeLayer.id}-${date}`}
                attribution="&copy; NASA GIBS"
                url={getNASATileUrl(activeLayer.id, date, activeLayer.matrix, activeLayer.ext)}
                opacity={1}
                maxNativeZoom={maxNativeZoom}
                zIndex={100}
                eventHandlers={{
                  tileload: () => setIsMapLoading(false),
                  tileerror: () => setIsMapLoading(false),
                }}
              />
            );
          })()}

        {/* NASA Reference Borders/Features */}
        <TileLayer key={`ref-features-${date}`} url={getNASATileUrl(REFERENCE_FEATURES_LAYER.id, date, REFERENCE_FEATURES_LAYER.matrix, REFERENCE_FEATURES_LAYER.ext)} opacity={0.8} maxNativeZoom={13} zIndex={110} />

        {/* NASA Reference Labels */}
        <TileLayer key={`ref-labels-${date}`} url={getNASATileUrl(REFERENCE_LABELS_LAYER.id, date, REFERENCE_LABELS_LAYER.matrix, REFERENCE_LABELS_LAYER.ext)} opacity={1} maxNativeZoom={13} zIndex={120} />

        <MapInner center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
