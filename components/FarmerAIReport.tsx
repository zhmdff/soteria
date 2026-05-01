"use client";


import { useState } from "react";
import { Brain, RefreshCw, AlertTriangle, CheckCircle, Info, Timer } from "lucide-react";
import { PredictionInput, PredictionOutput } from "@/lib/predictionLogic";

interface EcologicalReport {
  status: string;
  evaluation: "good" | "bad" | "normal";
  reasoning: string;
  solutions?: string;
}

interface Props {
  input: PredictionInput;
  result: PredictionOutput;
}

export default function FarmerAIReport({ input, result }: Props) {
  const [report, setReport] = useState<EcologicalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    setQuotaExceeded(false);
    try {
      const res = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          page: "/farmers",
          predictionInput: input,
          predictionOutput: result
        }),
      });
      const data = await res.json();

      if (res.status === 429 || data.code === "QUOTA_EXCEEDED") {
        setQuotaExceeded(true);
        setLoading(false);
        return;
      }

      if (data.error) throw new Error(data.error);
      
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

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm flex flex-col overflow-hidden w-full h-full">
      <div className="p-5 border-b border-outline-variant/30 bg-surface-container/30 flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Məsləhətçi
        </h2>
        <div className="flex items-center gap-2">
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
        ) : error && !quotaExceeded ? (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        ) : quotaExceeded ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center">
              <Timer className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-amber-600 text-sm">Süni İntellekt Limiti Dolmuşdur</h4>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Günlük analiz kvotası sona çatmışdır. Zəhmət olmasa sabah və ya bir qədər sonra yenidən cəhd edin.
              </p>
            </div>
            <button 
              onClick={() => setQuotaExceeded(false)}
              className="text-[10px] text-amber-600 font-bold uppercase tracking-widest hover:underline"
            >
              Geri qayıt
            </button>
          </div>
        ) : report ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border ${styles.border} ${styles.bg} flex gap-3`}>
              <div className={styles.text}>{styles.icon}</div>
              <div>
                <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${styles.text}`}>Status: {report.evaluation === "good" ? "Mənfəətli" : report.evaluation === "bad" ? "Zərərli" : "Normal"}</h3>
                <p className="text-sm text-on-surface leading-relaxed font-medium">{report.status}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" /> Təhlil
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{report.reasoning}</p>
            </div>

            {report.solutions && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> Məsləhətlər
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
              <Brain className="w-8 h-8 text-primary/40" />
            </div>
            <div>
              <p className="text-sm text-on-surface font-medium">Fərdi Hesabat Yarat</p>
              <p className="text-xs text-on-surface-variant mt-1">Seçdiyiniz iqlim ({input.iqlim}) və torpaq ({input.torpaq}) göstəriciləri əsasında məhsuldarlığı AI ilə analiz edin.</p>
            </div>
            <button 
              onClick={fetchReport}
              className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-primary-container hover:text-primary transition-all"
            >
              Təhlili Başlat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
