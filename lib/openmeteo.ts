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
  }
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
  }
}

export async function getWeatherForecast(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&timezone=auto`;
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

export function getAvailableDateRange(type: "pollution" | "marine" | "climate") {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    
    switch (type) {
        case "pollution":
            // 92 days past, 7 days forecast
            const pStart = new Date();
            pStart.setDate(now.getDate() - 92);
            const pEnd = new Date();
            pEnd.setDate(now.getDate() + 7);
            return { min: pStart.toISOString().split("T")[0], max: pEnd.toISOString().split("T")[0] };
        case "marine":
            // 92 days past, 8 days forecast
            const mStart = new Date();
            mStart.setDate(now.getDate() - 92);
            const mEnd = new Date();
            mEnd.setDate(now.getDate() + 8);
            return { min: mStart.toISOString().split("T")[0], max: mEnd.toISOString().split("T")[0] };
        case "climate":
            return { min: "1950-01-01", max: "2050-12-31" };
    }
}
