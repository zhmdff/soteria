const BAKU_COORDS = { lat: 40.4093, lon: 49.8671 };
const CASPIAN_CENTER = { lat: 41.0, lon: 51.5 };

// Real-time data revalidated every hour
const REVALIDATE_INTERVAL = 3600; 
// Archival/Projection data revalidated every 24 hours
const REVALIDATE_ARCHIVE = 86400;

export async function getWeatherForecast() {
  // Added temperature_2m to current to have a local temp fallback if marine sst fails
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } });
  return res.json();
}

export async function getAirQuality() {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&hourly=european_aqi&forecast_days=7&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } });
  return res.json();
}

export async function getMarineData() {
  // Added cell_selection=nearest to ensure coordinates in the Caspian Sea return data
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${CASPIAN_CENTER.lat}&longitude=${CASPIAN_CENTER.lon}&current=sea_surface_temperature,wave_height,wave_period,wave_direction&forecast_days=8&timezone=auto&cell_selection=nearest`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_INTERVAL } });
  return res.json();
}

export async function getHistoricalArchive() {
  const end = new Date().toISOString().split("T")[0];
  const start = new Date(new Date().getFullYear() - 10, 0, 1).toISOString().split("T")[0];
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
  return res.json();
}

export async function getClimateProjections() {
  const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${BAKU_COORDS.lat}&longitude=${BAKU_COORDS.lon}&start_date=1950-01-01&end_date=2050-12-31&models=MRI_AGCM3_2_S&daily=temperature_2m_mean,precipitation_sum`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_ARCHIVE } });
  return res.json();
}
