"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix for Leaflet default icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  showPollutionOverlay?: boolean;
}

export default function Map({
  center = [41.0, 51.5],
  zoom = 5,
  showPollutionOverlay = false,
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#0E1620" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapInner center={center} zoom={zoom} />
      
      {/* Station Alpha */}
      <Marker position={[40.4, 49.9]}>
        <Popup>
          <div className="text-slate-900 font-manrope">
            <h3 className="font-bold">Station Alpha</h3>
            <p>Hərarət: 24.5°C</p>
          </div>
        </Popup>
      </Marker>

      {/* Anomaly Station */}
      <Marker position={[38.5, 52.5]}>
        <Popup>
          <div className="text-slate-900 font-manrope">
            <h3 className="font-bold text-error">Anomaly Detected</h3>
            <p>Chlorophyll: 4.2 mg/m³</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
