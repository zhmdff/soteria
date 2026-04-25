"use client";

import { useState } from "react";
import { Brain, RefreshCw } from "lucide-react";

export default function AIReport() {
  const [report, setReport] = useState<string>("Hesabat yaratmaq üçün yeniləmə düyməsini sıxın.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-report", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data.report);
    } catch (_err) {
      setError("Hesabat yaradıla bilmədi. Zəhmət olmasa API açarını yoxlayın.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
      <div className="p-5 border-b border-outline-variant/30 bg-surface-container/30 flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Ekoloji Hesabat
        </h2>
        <button 
          onClick={fetchReport} 
          disabled={loading} 
          className={`p-2 hover:bg-surface-container rounded-full transition-all ${loading ? "animate-spin" : ""}`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "text-primary" : "text-outline hover:text-primary"}`} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-surface-container rounded w-3/4"></div>
            <div className="h-4 bg-surface-container rounded w-full"></div>
            <div className="h-4 bg-surface-container rounded w-5/6"></div>
            <div className="h-4 bg-surface-container rounded w-2/3"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
             <p className="text-sm text-error font-medium">{error}</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{report}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant/30 bg-surface text-center flex flex-col items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-6 h-6 opacity-50" />
        <p className="text-[10px] text-outline uppercase tracking-widest">Powered by zhmdff&apos;s intelligence</p>
      </div>
    </div>
  );
}
