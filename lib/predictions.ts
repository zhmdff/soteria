/**
 * REAL-LIFE EQUATIONS FOR PREDICTION
 */

// 1. GLOBAL WARMING EQUATION (Linear Regression)
// T = T0 + alpha * (Year - Year0)
// alpha for Caspian region is approx 0.03°C/year
export function predictTemperature(currentTemp: number, yearsAhead: number): number {
  const alpha = 0.032; // Caspian specific warming rate
  return currentTemp + (alpha * yearsAhead);
}

// 2. CASPIAN WATER LEVEL EQUATION
// L(t+1) = L(t) + (P + R - E) / Area
// Current trend shows approx -0.07 meters per year decline due to negative water balance
export function predictWaterLevel(currentLevel: number, yearsAhead: number): number {
  const annualDecline = -0.068; // Observed annual decline in meters
  return currentLevel + (annualDecline * yearsAhead);
}

// 3. AIR QUALITY DECAY/TREND MODEL (Simplified)
// AQI_predicted = AQI_current * e^(r * t)
// r is the growth rate based on industrialization and season
export function predictAQI(currentAQI: number, daysAhead: number): number {
  const growthRate = 0.005; // 0.5% daily variation based on local trends
  return currentAQI * Math.exp(growthRate * daysAhead);
}

export function generatePredictionData(
  currentValue: number, 
  steps: number, 
  predictor: (val: number, step: number) => number,
  labelPrefix: string = "Day"
) {
  const data = [];
  // Add current data point as baseline
  data.push({
    label: `${labelPrefix} 0`,
    value: currentValue,
    prediction: currentValue
  });

  for (let i = 1; i <= steps; i++) {
    data.push({
      label: `${labelPrefix} ${i}`,
      value: undefined as any,
      prediction: predictor(currentValue, i)
    });
  }
  return data;
}

export function mergeDataWithPredictions(
  realData: { label: string; value: number }[],
  predictionSteps: number,
  predictor: (val: number, step: number) => number,
  labelPrefix: string = "Proqnoz +"
) {
  const merged = realData.map(d => ({ ...d, prediction: undefined }));
  const lastRealValue = realData[realData.length - 1].value;

  // Add the last real point as the first prediction point to connect the lines
  merged[merged.length - 1].prediction = lastRealValue;

  for (let i = 1; i <= predictionSteps; i++) {
    merged.push({
      label: `${labelPrefix} ${i}`,
      value: undefined as any,
      prediction: predictor(lastRealValue, i)
    });
  }
  return merged;
}
