const BAKU_COORDS = { lat: 40.4093, lon: 49.8671 };
const CASPIAN_CENTER = { lat: 41.0, lon: 51.5 };

// Real-time data revalidated every hour
const REVALIDATE_INTERVAL = 3600;
// Archival/Projection data revalidated every 24 hours
const REVALIDATE_ARCHIVE = 86400;

export interface AirQualityData {
  current: {
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    ozone: number;
    carbon_monoxide: number;
  };
  hourly: {
    time: string[];
    european_aqi: number[];
    pm2_5?: number[];
    pm10?: number[];
    nitrogen_dioxide?: number[];
    ozone?: number[];
    carbon_monoxide?: number[];
  };
}

export interface MarineData {
  current: {
    sea_surface_temperature: number;
    wave_height: number;
    wave_period: number;
    wave_direction: number;
  };
  hourly: {
    time: string[];
    sea_surface_temperature?: number[];
    wave_height?: number[];
  };
}

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation?: number[];
  };
  // daily.shortwave_radiation_sum is in MJ/m²/day
  daily?: {
    time: string[];
    shortwave_radiation_sum: number[];
  };
}

export interface ClimateStatsData {
  avgTempIncrease: string; // e.g. "+0.8"
  hotDaysCount: number;    // days with max temp > 35°C in past year
  droughtDaysCount: number; // days with precip < 1 mm in past year
}

export async function getWeatherForecast(pastDays = 0, forecastDays = 7): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=shortwave_radiation_sum&past_days=${pastDays}&forecast_days=${forecastDays}&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } });
  return res.json();
}

export async function getAirQuality(pastDays = 0, forecastDays = 7): Promise<AirQualityData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&hourly=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&forecast_days=${forecastDays}&past_days=${pastDays}&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } });
  return res.json();
}

export async function getAirHistorical(startDate: string, endDate: string) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&start_date=${startDate}&end_date=${endDate}&hourly=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
  return res.json();
}

export async function getMarineData(pastDays = 0, forecastDays = 8): Promise<MarineData> {
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${CASPIAN_CENTER.lat}&longitude=${CASPIAN_CENTER.lon}&current=sea_surface_temperature,wave_height,wave_period,wave_direction&hourly=sea_surface_temperature,wave_height&forecast_days=${forecastDays}&past_days=${pastDays}&timezone=auto&cell_selection=nearest`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } });
  return res.json();
}

export async function getMarineHistorical(startDate: string, endDate: string) {
  // Note: Marine archive might need specific coordinates and may use ERA5-Ocean
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${CASPIAN_CENTER.lat}&longitude=${CASPIAN_CENTER.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
  return res.json();
}

export async function getHistoricalArchive(startDate?: string, endDate?: string) {
  const end = endDate || new Date().toISOString().split("T")[0];
  const start = startDate || new Date(new Date().getFullYear() - 10, 0, 1).toISOString().split("T")[0];
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_mean,precipitation_sum,wind_speed_10m_max&models=era5&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
  return res.json();
}

export async function getClimateProjections(startDate = "1950-01-01", endDate = "2050-12-31") {
  const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&start_date=${startDate}&end_date=${endDate}&models=MRI_AGCM3_2_S&daily=temperature_2m_mean,precipitation_sum`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
  return res.json();
}

/**
 * Fetches 2 years of daily historical archive data and derives:
 * - avgTempIncrease: difference between last year's and prev year's mean temperature
 * - hotDaysCount: days where max temp > 35°C in the last year
 * - droughtDaysCount: days where precipitation < 1 mm in the last year
 *
 * Note: archive-api has ~5-day delay, so we end 5 days before today.
 */
export async function getClimateStats(): Promise<ClimateStatsData> {
  const now = new Date();
  // Archive has ~5-day delay
  const endDt = new Date(now);
  endDt.setDate(now.getDate() - 5);
  const endDate = endDt.toISOString().split("T")[0];

  // 2 full years back from end
  const startDt = new Date(endDt);
  startDt.setFullYear(endDt.getFullYear() - 2);
  const startDate = startDt.toISOString().split("T")[0];

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_mean,precipitation_sum&timezone=auto`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
    const data = await res.json();

    if (!data?.daily?.time) {
      return { avgTempIncrease: "N/A", hotDaysCount: 0, droughtDaysCount: 0 };
    }

    const times = data.daily.time as string[];
    const tempMax = data.daily.temperature_2m_max as (number | null)[];
    const tempMean = data.daily.temperature_2m_mean as (number | null)[];
    const precip = data.daily.precipitation_sum as (number | null)[];

    // Split point: 1 year before endDate
    const splitDt = new Date(endDt);
    splitDt.setFullYear(endDt.getFullYear() - 1);
    const splitDate = splitDt.toISOString().split("T")[0];

    const lastYearIdx: number[] = [];
    const prevYearIdx: number[] = [];
    times.forEach((t, i) => {
      if (t >= splitDate) lastYearIdx.push(i);
      else prevYearIdx.push(i);
    });

    const avg = (arr: (number | null)[], indices: number[]) => {
      const vals = indices.map(i => arr[i]).filter((v): v is number => v != null && !isNaN(v));
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    };

    const lastAvg = avg(tempMean, lastYearIdx);
    const prevAvg = avg(tempMean, prevYearIdx);
    const diff = lastAvg - prevAvg;
    const avgTempIncrease = (diff >= 0 ? "+" : "") + diff.toFixed(1);

    const hotDaysCount = lastYearIdx.filter(i => {
      const v = tempMax[i];
      return v != null && v > 35;
    }).length;

    const droughtDaysCount = lastYearIdx.filter(i => {
      const v = precip[i];
      return v != null && v < 1;
    }).length;

    return { avgTempIncrease, hotDaysCount, droughtDaysCount };
  } catch {
    return { avgTempIncrease: "N/A", hotDaysCount: 0, droughtDaysCount: 0 };
  }
}

export function getAvailableDateRange(type: "pollution" | "marine" | "climate") {
  const now = new Date();

  switch (type) {
    case "pollution": {
      const pStart = new Date();
      pStart.setDate(now.getDate() - 92);
      const pEnd = new Date();
      pEnd.setDate(now.getDate() + 7);
      return { min: pStart.toISOString().split("T")[0], max: pEnd.toISOString().split("T")[0] };
    }
    case "marine": {
      const mStart = new Date();
      mStart.setDate(now.getDate() - 92);
      const mEnd = new Date();
      mEnd.setDate(now.getDate() + 8);
      return { min: mStart.toISOString().split("T")[0], max: mEnd.toISOString().split("T")[0] };
    }
    case "climate":
      return { min: "1950-01-01", max: "2050-12-31" };
  }
}
