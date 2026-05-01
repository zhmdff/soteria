"use client";

import React, { useState } from 'react';
import { PredictionInput, CropType } from '@/lib/predictionLogic';

interface Props {
  onPredict: (input: PredictionInput) => void;
}

export default function FarmerPredictionForm({ onPredict }: Props) {
  const [cropType, setCropType] = useState<CropType>('Wheat');
  const [landArea, setLandArea] = useState<number>(1);
  const [budget, setBudget] = useState<number>(1000);
  const [iqlim, setIqlim] = useState<'Quru' | 'Subtropik' | 'Mülayim' | 'Seçin'>('Seçin');
  const [torpaq, setTorpaq] = useState<'Qara' | 'Gil' | 'Qum' | 'Çınqıl' | 'Seçin'>('Seçin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict({
      cropType,
      landAreaHectares: landArea,
      budgetAzn: budget,
      iqlim,
      torpaq,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm w-full">
      <h2 className="font-headline-sm text-primary mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined">psychology</span>
        Proqnoz Parametrləri
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-on-surface-variant">Məhsul Növü</label>
          <select 
            className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            value={cropType}
            onChange={(e) => setCropType(e.target.value as CropType)}
          >
            <option value="Wheat">Buğda (Wheat)</option>
            <option value="Potato">Kartof (Potato)</option>
            <option value="Tomato">Pomidor (Tomato)</option>
            <option value="Nuts">Qoz/Fındıq (Nuts)</option>
            <option value="Grape">Üzüm (Grape)</option>
            <option value="Vegetable">Tərəvəz (Vegetable)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-on-surface-variant">Torpaq Sahəsi (Hektar)</label>
          <input 
            type="number" 
            min="0.1" 
            step="0.1"
            className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            value={landArea}
            onChange={(e) => setLandArea(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-on-surface-variant">Büdcə (AZN)</label>
          <input 
            type="number" 
            min="0"
            step="100"
            className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label htmlFor="s4" className="block text-sm font-medium mb-1 text-on-surface-variant">Bölgənin iqlim sinfi</label>
          <select 
            id="s4"
            className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            value={iqlim}
            onChange={(e) => setIqlim(e.target.value as 'Quru' | 'Subtropik' | 'Mülayim' | 'Seçin')}
          >
            <option value="Seçin">Seçin</option>
            <option value="Quru">Quru</option>
            <option value="Subtropik">Subtropik</option>
            <option value="Mülayim">Mülayim</option>
          </select>
        </div>

        <div>
          <label htmlFor="s2" className="block text-sm font-medium mb-1 text-on-surface-variant">Torpaq növü</label>
          <select 
            id="s2"
            className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
            value={torpaq}
            onChange={(e) => setTorpaq(e.target.value as 'Qara' | 'Gil' | 'Qum' | 'Çınqıl' | 'Seçin')}
          >
            <option value="Seçin">Seçin</option>
            <option value="Qara">Qara</option>
            <option value="Gil">Gil</option>
            <option value="Qum">Qum</option>
            <option value="Çınqıl">Çınqıl</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full mt-8 bg-primary hover:bg-primary/90 text-on-primary font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">analytics</span>
        Gəlirliliyi Hesabla
      </button>
    </form>
  );
}
