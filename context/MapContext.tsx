"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MapSettings {
  is3D: boolean;
  showSST: boolean;
  showChlorophyll: boolean;
  showCurrents: boolean;
}

interface Location {
  lat: number;
  lon: number;
  name: string;
}

const AZERBAIJAN_DEFAULT: Location = { lat: 40.4093, lon: 49.8671, name: "Bakı" };

interface MapContextType {
  settings: MapSettings;
  location: Location;
  toggle3D: () => void;
  toggleLayer: (layer: keyof MapSettings) => void;
  setLocation: (loc: Location) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MapSettings>({
    is3D: false,
    showSST: false,
    showChlorophyll: false,
    showCurrents: true,
  });

  const [location, setLocation] = useState<Location>(AZERBAIJAN_DEFAULT);

  const toggle3D = () => setSettings(s => ({ ...s, is3D: !s.is3D }));
  
  const toggleLayer = (layer: keyof MapSettings) => {
    setSettings(s => ({ ...s, [layer]: !s[layer] }));
  };

  return (
    <MapContext.Provider value={{ settings, location, toggle3D, toggleLayer, setLocation }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapSettings() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapSettings must be used within a MapProvider");
  }
  return context;
}
