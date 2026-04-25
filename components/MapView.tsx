"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-container flex items-center justify-center animate-pulse">
      <span className="material-symbols-outlined text-4xl text-outline">
        satellite
      </span>
    </div>
  ),
});

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  showPollutionOverlay?: boolean;
}

export default function MapView(props: MapViewProps) {
  return <Map {...props} />;
}
