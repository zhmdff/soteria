# Soteria: Project Structure & Architecture

## 📂 File Structure

```text
app/
├── (routes)
│   ├── page.tsx (Dashboard)
│   ├── farmers/ (Farmer Portal)
│   ├── caspian/ (Caspian Sea Analysis)
│   ├── air/ (Air Quality)
│   ├── climate/ (Climate Trends)
│   ├── energy/ (Renewable Energy)
│   ├── events/ (Natural Events)
│   └── map/ (Full-screen Satellite)
├── api/
│   ├── ai-report/ (Gemini analysis)
│   ├── caspian-data/ (Local JSON archive)
│   ├── marine/ (Sea telemetry)
│   ├── pollution/ (AQI & Pollen)
│   ├── weather/ (Forecast & History)
│   └── events/ (NASA EONET proxy)
components/
├── Map/ (Leaflet logic)
├── FarmerPredictionForm.tsx
├── PredictionResults.tsx
├── FarmerAIReport.tsx
├── WaterLevelTracker.tsx
├── ChartPanel.tsx
├── AIReport.tsx
└── SideNavBar.tsx
lib/
├── gemini.ts (AI SDK)
├── openmeteo.ts (Weather/Marine)
├── predictionLogic.ts (Agro Math)
├── predictions.ts (Regression models)
└── nasagibs.ts (Satellite tiles)
data/
├── caspian_sea_levels.json
└── caspian_volume_variations.json
```

## 🛠 Tech Stack & Architecture

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Vanilla CSS & Tailwind CSS v4
- **Charts**: Recharts
- **Maps**: Leaflet.js with NASA GIBS integration

### Backend (Stateless Proxy)
- **API Routes**: All external API calls are proxied through Next.js API routes to protect the `GEMINI_API_KEY` and handle CORS/formatting.
- **AI Engine**: Google Gemini 1.5 Pro (Generative AI SDK)
- **Mathematics**: Linear and Polynomial regression for AQI, Temperature, and Water Level projections.

### Data Sources
- **NASA GIBS**: MODIS/VIIRS satellite imagery.
- **NASA EONET**: Real-time natural event tracking (fires, floods).
- **Open-Meteo**: Weather, Air Quality, Marine, and Climate CMIP6 data.
- **Local Archives**: Historical Caspian water level data (1992-2026).

## 🔄 Data Flow
1. **User Action**: User selects a location or triggers an analysis.
2. **Data Fetching**: Frontend calls `/api/*` routes.
3. **AI Analysis**: Collected data is passed to Gemini with Azerbaijani-specific context.
4. **Caching**: AI reports are cached locally for 24 hours to save API quota.
5. **Visualization**: Data is rendered via Recharts and custom StatCards.

---
**Soteria** is built to be a pure Next.js application with zero database dependency, ensuring high performance and instant deployment capability.
