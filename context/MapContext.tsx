"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MapSettings {
  is3D: boolean;
  showSST: boolean;
  showChlorophyll: boolean;
  showCurrents: boolean;
}

interface MapContextType {
  settings: MapSettings;
  toggle3D: () => void;
  toggleLayer: (layer: keyof MapSettings) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MapSettings>({
    is3D: false,
    showSST: false,
    showChlorophyll: false,
    showCurrents: true,
  });

  const toggle3D = () => setSettings(s => ({ ...s, is3D: !s.is3D }));
  
  const toggleLayer = (layer: keyof MapSettings) => {
    setSettings(s => ({ ...s, [layer]: !s[layer] }));
  };

  return (
    <MapContext.Provider value={{ settings, toggle3D, toggleLayer }}>
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
