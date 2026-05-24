"use client";

import { useMapSettings } from "@/context/MapContext";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import { ExternalLink, Bird, MapPin } from "lucide-react";

interface GBIFOccurrence {
  key: number;
  eventDate: string;
  decimalLatitude: number;
  decimalLongitude: number;
  locality?: string;
  stateProvince?: string;
  basisOfRecord: string;
}

export default function BiodiversityPage() {
  const { setLocation } = useMapSettings();
  const [loading, setLoading] = useState(true);
  const [observations, setObservations] = useState<GBIFOccurrence[]>([]);

  useEffect(() => {
    // Focus on Northern Caspian (Seal habitats)
    setLocation({ lat: 44.5, lon: 50.0, name: "Şimali Xəzər (Suiti arealları)" });
    
    async function fetchGBIFData() {
      try {
        // Pusa caspica taxonKey: 2433481
        const res = await fetch("https://api.gbif.org/v1/occurrence/search?taxonKey=2433481&hasCoordinate=true&limit=10&order=event_date+desc");
        const json = await res.json();
        setObservations(json.results || []);
      } catch (error) {
        console.error("Failed to fetch GBIF data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGBIFData();
  }, [setLocation]);

  const sealStats = [
    { label: "IUCN Statusu", value: "Təhlükədə", unit: "EN", icon: "Bird", status: "red", description: "Xəzər suitisi IUCN Qırmızı Siyahısında 'Endangered' statusundadır." },
    { label: "Müşahidə Sayı", value: observations.length, unit: "Yeni", icon: "Eye", status: "amber", trend: "Son 10 qeyd" },
    { label: "Habitat", value: "Caspian", icon: "Waves", status: "green", description: "Dünyada yalnız Xəzər dənizində yaşayan endemik növ." },
    { label: "Təhdid Səviyyəsi", value: "Kritik", icon: "AlertTriangle", status: "red", description: "Brakonyerlik və habitat itkisi əsas təhdidlərdəndir." },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-display-xl text-display-xl text-on-surface">Biomüxtəliflik</h2>
          <p className="font-body-lg text-outline max-w-2xl">
            Xəzər suitilərinin (*Pusa caspica*) qlobal qeydiyyatı və qorunma statusu.
          </p>
        </div>
        <a 
          href="https://www.iucnredlist.org/species/41669/45230746" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors border border-outline-variant"
        >
          IUCN Red List <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sealStats.map((stat, idx) => (
          <StatCard key={idx} {...(stat as any)} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-primary flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5" />
              Son Sahə Müşahidələri (GBIF API)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="py-3 text-[10px] uppercase tracking-wider text-outline font-bold">Tarix</th>
                    <th className="py-3 text-[10px] uppercase tracking-wider text-outline font-bold">Məkan</th>
                    <th className="py-3 text-[10px] uppercase tracking-wider text-outline font-bold">Koordinat</th>
                    <th className="py-3 text-[10px] uppercase tracking-wider text-outline font-bold">Metod</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs">
                  {observations.map((obs) => (
                    <tr key={obs.key} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 font-medium">{new Date(obs.eventDate).toLocaleDateString("az-AZ")}</td>
                      <td className="py-4 text-on-surface-variant">
                        {obs.locality || obs.stateProvince || "Naməlum məkan"}
                      </td>
                      <td className="py-4 font-technical-stat text-[10px] text-primary">
                        {obs.decimalLatitude.toFixed(3)}, {obs.decimalLongitude.toFixed(3)}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 bg-surface-container-high rounded-md text-[9px] uppercase font-bold text-outline">
                          {obs.basisOfRecord}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {observations.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-outline italic">Müşahidə məlumatı tapılmadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-[10px] text-outline font-medium italic">
              <span>Mənbə: Global Biodiversity Information Facility (GBIF)</span>
              <span>Lisenziya: CC BY 4.0</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <AIReport type="Marine" context="biodiversity" />
        </div>
      </div>
    </div>
  );
}
