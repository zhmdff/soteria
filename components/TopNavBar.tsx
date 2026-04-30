"use client";

import Image from "next/image";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import { useMapSettings } from "@/context/MapContext";

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
}

export default function TopNavBar() {
  const { toggleSidebar } = useUI();
  const { setLocation, location } = useMapSettings();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val: string) => {
    setSearch(val);
    if (val.length > 2) {
      try {
        const res = await fetch(`/api/geocoding?name=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    } else {
      setResults([]);
    }
  };

  const selectLocation = (res: GeocodingResult) => {
    setLocation({
      lat: res.latitude,
      lon: res.longitude,
      name: res.name,
    });
    setSearch(res.name);
    setShowResults(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-sidebar-width h-16 border-b border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md z-30 flex justify-between items-center px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo_new.png" alt="Logo" width={24} height={24} className="lg:hidden" />
          <span className="font-label-sm text-outline uppercase tracking-widest text-[9px] md:text-[10px]">Canlı Telemetriya Stansiyası</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => search.length > 2 && setShowResults(true)}
            placeholder="Şəhər axtar..."
            className="w-full h-10 bg-surface-container rounded-full pl-10 pr-4 text-xs font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant"
          />
        </div>
        
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
            {results.map((res) => (
              <button
                key={res.id}
                onClick={() => selectLocation(res)}
                className="w-full px-4 py-3 text-left hover:bg-surface-container-highest transition-colors flex flex-col"
              >
                <span className="text-xs font-bold text-on-surface">{res.name}</span>
                <span className="text-[10px] text-outline">{res.admin1}, {res.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-[10px] text-primary bg-primary/10 px-3 py-1.5 rounded-full font-bold">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
          SİSTEM AKTİVDİR: {location.name.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
