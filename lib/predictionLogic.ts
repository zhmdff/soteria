export type CropType = 'Wheat' | 'Potato' | 'Tomato' | 'Nuts' | 'Grape' | 'Vegetable';

export interface PredictionInput {
  cropType: CropType;
  landAreaHectares: number;
  budgetAzn: number;
  iqlim: 'Quru' | 'Subtropik' | 'Mülayim' | 'Seçin';
  torpaq: 'Qara' | 'Gil' | 'Qum' | 'Çınqıl' | 'Seçin';
}

export interface PredictionOutput {
  expectedYieldTonnes: number;
  estimatedCostAzn: number;
  expectedRevenueAzn: number;
  netProfitAzn: number;
  isProfitable: boolean;
  profitabilityScore: number; // 0 to 100
  roi: number; // Return on investment percentage
}

const CROP_DATA: Record<CropType, { yieldPerHectare: number; costPerHectare: number; pricePerTonne: number }> = {
  Wheat: { yieldPerHectare: 3.5, costPerHectare: 400, pricePerTonne: 350 },
  Potato: { yieldPerHectare: 25, costPerHectare: 1200, pricePerTonne: 300 },
  Tomato: { yieldPerHectare: 50, costPerHectare: 3000, pricePerTonne: 400 },
  Nuts: { yieldPerHectare: 2, costPerHectare: 800, pricePerTonne: 4000 },
  Grape: { yieldPerHectare: 10, costPerHectare: 1500, pricePerTonne: 800 },
  Vegetable: { yieldPerHectare: 30, costPerHectare: 2000, pricePerTonne: 500 },
};

const SOIL_MULTIPLIERS: Record<string, number> = {
  Qara: 1.4,
  Gil: 1.0,
  Qum: 0.7,
  Çınqıl: 0.5,
  Seçin: 1.0,
};

const CLIMATE_MULTIPLIERS: Record<string, number> = {
  Subtropik: 1.3,
  Mülayim: 1.1,
  Quru: 0.8,
  Seçin: 1.0,
};

export function calculatePrediction(input: PredictionInput): PredictionOutput {
  const crop = CROP_DATA[input.cropType];
  const soilMultiplier = SOIL_MULTIPLIERS[input.torpaq] || 1.0;
  const climateMultiplier = CLIMATE_MULTIPLIERS[input.iqlim] || 1.0;

  const expectedYieldTonnes = crop.yieldPerHectare * input.landAreaHectares * soilMultiplier * climateMultiplier;
  const estimatedCostAzn = crop.costPerHectare * input.landAreaHectares;
  const expectedRevenueAzn = expectedYieldTonnes * crop.pricePerTonne;
  const netProfitAzn = expectedRevenueAzn - estimatedCostAzn;
  
  const roi = estimatedCostAzn > 0 ? (netProfitAzn / estimatedCostAzn) * 100 : 0;
  
  let profitabilityScore = 0;
  if (roi > 50) profitabilityScore = 100;
  else if (roi > 20) profitabilityScore = 80;
  else if (roi > 0) profitabilityScore = 50;
  else if (roi > -20) profitabilityScore = 20;
  else profitabilityScore = 0;

  return {
    expectedYieldTonnes,
    estimatedCostAzn,
    expectedRevenueAzn,
    netProfitAzn,
    isProfitable: netProfitAzn > 0,
    profitabilityScore,
    roi,
  };
}
