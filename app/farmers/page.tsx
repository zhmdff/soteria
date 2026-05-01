"use client";

import React, { useState } from 'react';
import FarmerPredictionForm from '@/components/FarmerPredictionForm';
import PredictionResults from '@/components/PredictionResults';
import { calculatePrediction, PredictionInput, PredictionOutput } from '@/lib/predictionLogic';

export default function FarmersPage() {
  const [result, setResult] = useState<PredictionOutput | null>(null);
  const [lastInput, setLastInput] = useState<PredictionInput | null>(null);

  const handlePredict = (input: PredictionInput) => {
    // In a real app, this might trigger an API call.
    // For now, we use our local heuristic calculation based on typical open data averages.
    const output = calculatePrediction(input);
    setResult(output);
    setLastInput(input);
  };

  return (
    <div className="p-4 md:p-gutter-lg flex flex-col gap-stack-md">
      <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl md:text-4xl">Fermer Portalı</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg">Kənd təsərrüfatı proqnozları və gəlirlilik analizi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
        {/* Form Section */}
        <div className="col-span-1">
          <FarmerPredictionForm onPredict={handlePredict} />
        </div>

        {/* Results Section */}
        <div className="col-span-1 lg:col-span-2">
          {result && lastInput ? (
            <PredictionResults result={result} input={lastInput} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 text-center text-on-surface-variant border-dashed">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">analytics</span>
              <p className="font-body-lg">Gəlirlilik hesabatını görmək üçün formu doldurun və proqnozlaşdırın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
