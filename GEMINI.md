# Soteria — Environmental Monitoring & Prediction Platform 🌍

Soteria is a professional environmental monitoring and forecasting platform for the Caspian region. It integrates NASA satellite imagery, Open-Meteo meteorological/marine data, local historical archives, and Google Gemini AI analytics into a single ecosystem.

## 🏗 Project Architecture & Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 + Vanilla CSS
- **Mapping**: Leaflet.js with NASA GIBS REST Tile integration
- **AI Analytics**: Google Generative AI (Gemini 2.0 Flash) with Groq (GPT-OSS-120B) fallback
- **Data Sources**:
  - **NASA GIBS**: WMTS satellite imagery (MODIS/VIIRS)
  - **NASA EONET**: Natural event tracking (fires, floods, etc.)
  - **Open-Meteo APIs**: Weather, Air Quality, Marine, and Climate (CMIP6) data
  - **Local JSON**: Historical Caspian water levels and volume variations (`/data`)

## 🚀 Key Modules

### 1. Satellite Explorer (`/app/map`, `/components/MapView.tsx`)
Interactive map using Leaflet to overlay NASA GIBS layers. Supports historical snapshot navigation (2020-2026) and category-based filtering (Natural Color, Thermal, Air Quality, etc.).

### 2. Prediction Engine (`/lib/predictions.ts`)
Mathematical models for environmental forecasting:
- **Global Warming**: Linear regression using Caspian-specific warming rate (0.032°C/year).
- **Caspian Water Level**: Predicts horizontal shoreline recession based on vertical drop (-0.068m/year).
- **Air Quality**: Exponential trend model for AQI projections.

### 3. AI Ecological Reporting (`/lib/gemini.ts`, `/app/api/ai-report/route.ts`)
Generates localized reports in Azerbaijani. Features:
- **Smart Rotation**: Cycles through multiple Gemini API keys.
- **Fallback Mechanism**: Switches to Groq SDK if Gemini quotas are exceeded.
- **Context-Aware**: Tailors reports based on the specific module (Air, Marine, Climate, or Agriculture).

### 4. Farmer Portal (`/app/farmers`)
Agricultural analytics providing ROI calculations and AI-driven cultivation advice based on crop type, climate zone, and soil composition.

## 🛠 Development Workflow

### Building and Running
- **Install dependencies**: `pnpm install`
- **Development server**: `pnpm dev`
- **Production build**: `pnpm build`
- **Linting**: `pnpm lint`

### Environment Setup (`.env.local`)
The project requires the following keys:
- `NEXT_PUBLIC_GEMINI_API_KEY`: Primary Google Generative AI key.
- `GEMINI_API_KEYS`: (Optional) Comma-separated list of fallback Gemini keys.
- `GROQ_API_KEY`: (Optional) Fallback key for Groq SDK.

### Conventions
- **Language**: UI and AI reports are in Azerbaijani (az-AZ).
- **Components**: Client-side interactive components use the `"use client"` directive. Heavy components like maps are dynamically imported to reduce initial bundle size.
- **Data Fetching**: Parallel fetching in `useEffect` or server components for performance optimization.
- **Predictive Analytics**: Always baseline predictions with the latest real-time data point to ensure continuity in visualizations.

### 📊 Data & Consistency
- **No Fake Data**: All visualizations must use real-time API data or mathematical models from `lib/predictions.ts`.
- **Global Rules**: See `global_rules.md` for strict architectural and design standards.

## 📁 Key Directories
- `app/`: Next.js App Router pages and API routes.
- `components/`: UI components (Charts, Maps, StatCards, AI Reports).
- `lib/`: Core logic (API clients, prediction algorithms, AI integration).
- `data/`: Static JSON datasets for historical Caspian sea levels.
- `public/`: Assets and branding.
