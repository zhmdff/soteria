"use client";

import React from 'react';
import { PredictionOutput, PredictionInput } from '@/lib/predictionLogic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '@/components/StatCard';
import FarmerAIReport from '@/components/FarmerAIReport';

interface Props {
  result: PredictionOutput;
  input: PredictionInput;
}

export default function PredictionResults({ result, input }: Props) {
  const chartData = [
    {
      name: 'Maliyyə',
      Cost: result.estimatedCostAzn,
      Revenue: result.expectedRevenueAzn,
      Profit: result.netProfitAzn,
    }
  ];

  const isProfitable = result.isProfitable;

  return (
    <div className="flex flex-col gap-stack-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        <StatCard 
          label="Gözlənilən Məhsul" 
          value={result.expectedYieldTonnes.toFixed(1)} 
          unit="t" 
          icon="Scale" 
          description="Hesablanmış gözlənilən məhsuldarlıq." 
        />
        <StatCard 
          label="Təxm. Xərc" 
          value={result.estimatedCostAzn.toLocaleString('az-AZ')} 
          unit="AZN" 
          icon="Banknote" 
          status="red"
          description="Ümumi proqnozlaşdırılan xərclər." 
        />
        <StatCard 
          label="Təxm. Gəlir" 
          value={result.expectedRevenueAzn.toLocaleString('az-AZ')} 
          unit="AZN" 
          icon="TrendingUp" 
          status="green"
          description="Satışdan əldə ediləcək təxmini gəlir." 
        />
        <StatCard 
          label="ROI" 
          value={`${result.roi > 0 ? '+' : ''}${result.roi.toFixed(1)}`} 
          unit="%" 
          icon="Percent" 
          status={isProfitable ? "green" : "red"}
          description="İnvestisiyanın gəlirliliyi." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-md">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
          <h3 className="font-headline-sm text-primary flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-base">bar_chart</span>
            Maliyyə Qrafiki
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="currentColor" className="text-on-surface-variant text-xs" />
                <YAxis stroke="currentColor" className="text-on-surface-variant text-xs" tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                    if (value === undefined) return '';
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AZN' }).format(Number(value));
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="Cost" name="Xərc" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Revenue" name="Gəlir" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" name="Xalis Mənfəət" fill={isProfitable ? "#00D4B4" : "#fca5a5"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-full min-h-[300px]">
          <FarmerAIReport key={JSON.stringify(input)} input={input} result={result} />
        </div>
      </div>

    </div>
  );
}
