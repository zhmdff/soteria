"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Brain, RefreshCw, AlertTriangle, CheckCircle, Info, Timer } from "lucide-react";
import { usePathname } from "next/navigation";

interface EcologicalReport {
  status: string;
  evaluation: "good" | "bad" | "normal";
  reasoning: string;
  solutions?: string;
}

export default function AIReport() {
  const pathname = usePathname();
  const [report, setReport] = useState<EcologicalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [horizon, setHorizon] = useState<string>("30d");

  // Load from cache on mount or when horizon/pathname changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const cacheKey = `ai_report_${pathname}_${horizon}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          // Optional: Add timestamp check for expiry (e.g., 24 hours)
          const now = new Date().getTime();
          if (now - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setReport(parsed.data);
            setError(null);
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }
      setReport(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, horizon]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          page: pathname,
          predictionHorizon: horizon 
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Save to cache
      const cacheKey = `ai_report_${pathname}_${horizon}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: new Date().getTime()
      }));

      setReport(data);
    } catch {
      setError("Hesabat yaradıla bilmədi. Zəhmət olmasa API açarını yoxlayın.");
    } finally {
      setLoading(false);
    }
  };

  const getEvaluationStyles = (evalType?: string) => {
    switch (evalType) {
      case "good":
        return { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary", icon: <CheckCircle className="w-5 h-5" /> };
      case "bad":
        return { bg: "bg-error/10", border: "border-error/20", text: "text-error", icon: <AlertTriangle className="w-5 h-5" /> };
      default:
        return { bg: "bg-secondary/10", border: "border-secondary/20", text: "text-secondary", icon: <Info className="w-5 h-5" /> };
    }
  };

  const styles = getEvaluationStyles(report?.evaluation);

  const horizonOptions = [
    { label: "7 Gün", value: "7d" },
    { label: "30 Gün", value: "30d" },
    { label: "1 İl", value: "1y" },
    { label: "10 İl", value: "10y" },
  ];

  return (
    <div className="col-span-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
      <div className="p-5 border-b border-outline-variant/30 bg-surface-container/30 flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Analiz & Proqnoz
        </h2>
        <div className="flex items-center gap-2">
          <select 
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="text-[10px] bg-surface-container border border-outline-variant/30 rounded px-2 py-1 outline-none text-on-surface-variant font-medium"
          >
            {horizonOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label} Proqnoz</option>
            ))}
          </select>
          <button onClick={fetchReport} disabled={loading} className={`p-2 hover:bg-surface-container rounded-full transition-all ${loading ? "animate-spin" : ""}`}>
            <RefreshCw className={`w-4 h-4 ${loading ? "text-primary" : "text-outline hover:text-primary"}`} />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-surface-container rounded w-3/4"></div>
            <div className="h-4 bg-surface-container rounded w-full"></div>
            <div className="h-4 bg-surface-container rounded w-5/6"></div>
            <div className="h-10 bg-surface-container rounded w-full"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        ) : report ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border ${styles.border} ${styles.bg} flex gap-3`}>
              <div className={styles.text}>{styles.icon}</div>
              <div>
                <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${styles.text}`}>Status: {report.evaluation === "good" ? "Yaxşı" : report.evaluation === "bad" ? "Təhlükəli" : "Normal"}</h3>
                <p className="text-sm text-on-surface leading-relaxed font-medium">{report.status}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" /> Niyə baş verir?
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{report.reasoning}</p>
            </div>

            {report.solutions && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> Necə dayandıraq?
                </h4>
                <div className="p-3 bg-surface-container/50 rounded-lg border border-outline-variant/20">
                  <p className="text-sm text-on-surface-variant leading-relaxed italic">{report.solutions}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
              <Timer className="w-8 h-8 text-primary/40" />
            </div>
            <div>
              <p className="text-sm text-on-surface font-medium">Analizə başlamaq üçün müddəti seçin</p>
              <p className="text-xs text-on-surface-variant mt-1">Yuxarıdakı düyməni sıxaraq tarixi və riyazi məlumatlar əsasında AI hesabatı yarada bilərsiniz.</p>
            </div>
            <button 
              onClick={fetchReport}
              className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-primary-container hover:text-primary transition-all"
            >
              Analizi Başlat
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant/30 bg-surface text-center flex flex-col items-center gap-2">
        <Image src="/logo_new.png" alt="Logo" width={24} height={24} className="opacity-50" />
        <p className="text-[10px] text-outline uppercase tracking-widest">Soteria Predictive Engine</p>
      </div>
    </div>
  );
}
