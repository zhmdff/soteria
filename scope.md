Perfect. Here's the full confirmed scope:

---

## 🌿 "Soteria" — Project Blueprint

### Stack

- **Next.js** (App Router) — frontend + API routes as backend proxy
- **Gemini API** — anomaly detection, risk reports, forecasting explanations
- **UI language** — Azerbaijani

### Data Layers (priority order)

| #   | Feature                                      | API                                  |
| --- | -------------------------------------------- | ------------------------------------ |
| 1   | Caspian water pollution (chlorophyll/color)  | NASA GIBS MODIS + Sentinel Hub       |
| 2   | Sea level & shoreline change (satellite map) | NASA GIBS time-lapse tiles + Leaflet |
| 3   | Baku air quality real-time + 16-day forecast | Open-Meteo Air Quality               |
| 4   | 10-year climate trends (temp, drought)       | Open-Meteo Historical                |
| 5   | Agricultural Profitability & AI Agronomy     | Internal Logic + Gemini AI           |

### AI Features (Gemini)

- 🔴 **Anomaly alerts** — detects unusual spikes in air quality / sea temp
- 📊 **Ecological risk report** — generated from all live data combined
- 📈 **Forecast explanation** — plain-language Azerbaijani text explaining what's coming
- 🚜 **Farmer Advisor** — crop-specific recommendations and financial analysis

### Pages / Sections

```
/ (Home)
├── 🗺️  Interactive Map      (satellite tiles + pollution overlay)
├── 📊  Statistics Panel     (charts: temp trend, AQI, sea level)
├── 🤖  AI Risk Report       (Gemini-generated, refreshable)
└── 🔔  Alert Banner         (auto-triggers on anomalies)
/farmers (Fermer Portalı)
├── 📋  Prediction Form      (Crop, Area, Budget, Climate, Soil)
├── 📈  Profitability Charts (ROI, Revenue, Cost)
└── 🤖  AI Agronomy Report   (Gemini-generated recommendations)
```

### No login, no DB — fully public, stateless.

---

### 2-Day Build Plan

- **Day 1 morning** — Next.js scaffold + map + NASA GIBS tiles
- **Day 1 afternoon** — Open-Meteo data + charts
- **Day 2 morning** — Gemini AI integration + report generation
- **Day 2 afternoon** — UI polish, Azerbaijani copy, demo prep
