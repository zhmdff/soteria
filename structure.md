Pages (UI)
/ — Dashboard
Map + charts + AI panel
/caspian — Caspian
Pollution + sea level
/air — Air Quality
Baku AQI + forecast
/climate — Climate
10-year trends + drought

API Routes (proxy)
/api/satellite
NASA GIBS tile params
/api/pollution
Chlorophyll + water color
/api/weather
Air quality + forecast
/api/climate
Historical temp + drought
/api/ai-report
Gemini risk report gen.
/api/anomaly
Spike detection + alerts

External APIs
NASA GIBS
Satellite map tiles
Sentinel Hub
Chlorophyll-a layer
Open-Meteo Air
AQI, PM2.5, forecast
Open-Meteo History
10-yr temp + drought
Open-Meteo Marine
Sea temp + wave height
Gemini API
Report + anomaly + forecast

Components
MapView
Leaflet + GIBS tiles
ChartPanel
Recharts time-series
AIReport
Gemini output card
AlertBanner
Anomaly notifications
StatCard
Metric tiles on dashboard

Libs & Config
leaflet.js
Interactive map base
recharts
Time-series charts
@google/generative-ai
Gemini SDK
.env.local
GEMINI_API_KEY only
tailwindcss
Styling

Data flow
Fetch on page load
All APIs called server-side
via Next.js API routes
Anomaly detection
Compare live vs 30-day avg
Trigger Gemini alert
AI report generation
All data → single Gemini
prompt → AZ report

app/ → page.tsx (dashboard) /caspian/ /air/ /climate/
app/api/ → satellite/ pollution/ weather/ climate/ ai-report/ anomaly/
components/ → MapView ChartPanel AIReport AlertBanner StatCard
lib/ → gemini.ts openmeteo.ts nasagibs.ts sentinel.ts

Here's the full picture. A few key decisions baked in:

**Why API routes as proxy?** NASA GIBS and Open-Meteo don't need keys, but Gemini does — the API route keeps your key server-side, never exposed to the browser.

**Only one secret** — `GEMINI_API_KEY` in `.env.local`. Everything else is public, keyless.

**`lib/` folder** holds one file per data source — clean separation so each teammate can own one integration.

**No database, no auth, no backend server** — pure Next.js. Deploy to Vercel for free in under 2 minutes, which means you can demo a live URL on stage.
