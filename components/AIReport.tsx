"use client";

import { useState, useEffect } from "react";
import { Brain, RefreshCw } from "lucide-react";

export default function AIReport() {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-report", { method: "POST" });
      const data = await res.json();
      setReport(data.report);
    } catch (error) {
      setReport("Hesabat yaradıla bilmədi. Zəhmət olmasa API açarını yoxlayın.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

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
          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-sm ${loading ? "animate-spin" : ""}`}>
            {loading ? "sync" : "auto_awesome"}
          </span>
          AI Report
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
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{report}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant/30 bg-surface text-center">
        <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Powered by zhmdff's intelegence</p>
      </div>
    </div>
  );
}
