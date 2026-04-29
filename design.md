# Soteria — UI/UX Design Prompts

---

# Soteria — UI/UX Design Prompts

Design a production-grade ecological monitoring web application called **"Soteria"** built in Next.js with Tailwind CSS. The entire application must follow a single, cohesive design system defined below.

## 1. Design Philosophy

The app is a serious scientific dashboard for ecological monitoring and environmental analysis. The aesthetic must feel like a **premium geospatial intelligence tool** — think satellite control room meets environmental observatory. Dark, data-dense, authoritative, yet visually striking. Not a corporate SaaS dashboard. Not a government portal. A tool that feels alive with real data.


### Color Palette

- **Background primary**: `#080D12` (near-black with a blue tint)
- **Background surface**: `#0E1620` (dark navy — for cards and panels)
- **Background elevated**: `#152030` (lighter navy — for hover states, modals)
- **Border**: `rgba(255,255,255,0.08)` (subtle white borders)
- **Accent primary**: `#00D4B4` (Caspian teal — the brand color, used for key metrics, active states, CTAs)
- **Accent secondary**: `#3B82F6` (electric blue — for charts, satellite overlays)
- **Accent warning**: `#F59E0B` (amber — for medium alerts)
- **Accent danger**: `#EF4444` (red — for critical anomaly alerts)
- **Accent success**: `#10B981` (green — for normal/healthy readings)
- **Text primary**: `#F0F4F8`
- **Text secondary**: `#8BA4BE`
- **Text muted**: `#4A6580`

### Typography

- **Display font**: `Space Grotesk` (headings, stat numbers, hero text) — bold, geometric, technical
- **Body font**: `DM Sans` (paragraphs, labels, UI text) — clean, readable at small sizes
- **Mono font**: `JetBrains Mono` (data values, coordinates, timestamps, API outputs)
- All Azerbaijani text must render correctly (unicode)

### Layout System

- Full-width dark layout, no white space waste
- Left sidebar navigation: 64px collapsed, 220px expanded
- Main content area fills remaining width
- Consistent 16px/24px/32px spacing grid
- Cards use `border-radius: 12px`, `border: 1px solid rgba(255,255,255,0.08)`, `backdrop-filter: blur(8px)` for a glassmorphism effect

### Navigation (Sidebar)

The sidebar contains:

- App logo: stylized "X" with teal wave icon + "Soteria" wordmark
- Nav items (with icons): Ana Səhifə (Dashboard), Xəzər Dənizi, Hava Keyfiyyəti, İqlim Trendləri
- Bottom of sidebar: last data refresh timestamp, connection status indicator (green dot = live)

### Shared Components

**StatCard**

- Icon (top left, teal)
- Metric label (text-secondary, 12px mono)
- Large value (48px, Space Grotesk bold, text-primary)
- Unit (16px, text-secondary)
- Trend indicator: arrow up/down + percentage change vs yesterday
- Thin colored bottom border reflecting status (green/amber/red)

**AlertBanner**

- Full-width strip at top of page when anomaly detected
- Left: colored severity icon (⚠ amber or 🔴 red)
- Center: Azerbaijani alert text, e.g. "Xəzər dənizinin səthi temperaturu normaldan 2.4°C yüksəkdir"
- Right: "AI Hesabatına Bax" button (teal outline)
- Dismissible with X

**AIReportCard**

- Dark navy card, full-width
- Header: "AI Ekoloji Hesabat" + Gemini logo badge + timestamp
- Body: Azerbaijani paragraphs of generated text
- Three sub-sections: Cari Vəziyyət (Current status), Anomaliya (Anomaly), Proqnoz (Forecast)
- Footer: "Yenilə" (Refresh) button + "Bu hesabat Gemini AI tərəfindən yaradılıb" disclaimer

**MapView**

- Leaflet.js interactive map
- Dark map base tile (CartoDB dark matter)
- Caspian Sea highlighted with teal outline overlay
- Layer toggle buttons (top-right of map): Xlorofil | Dəniz Hərarəti | Çirklənmə
- Current date displayed (top-left of map)
- Coordinates display on hover (bottom-left of map, monospace)
- Loading skeleton: pulsing dark overlay while tiles load

**ChartPanel**

- Recharts wrapper
- Dark background: `#0E1620`
- Grid lines: `rgba(255,255,255,0.05)`
- Axis labels: text-secondary, 11px, DM Sans
- Tooltip: dark card with teal border, shows exact value + date
- All charts have a title (top-left) and a "Son 30 gün / Son 10 il" toggle

### Iconography

Use `lucide-react` icon library throughout. Key icons:

- Waves → Caspian / sea data
- Wind → air quality
- Thermometer → temperature
- AlertTriangle → warnings
- TrendingDown → declining metrics
- Droplets → water/pollution
- Satellite → satellite data source badge
- Brain → AI report

### Responsive

- Desktop (≥1280px): sidebar + full dashboard
- Tablet (768–1279px): collapsed sidebar (icon only), 2-column grid
- Mobile (< 768px): bottom tab bar, single column

### Loading & Empty States

- All data panels show a shimmer skeleton while fetching
- If API fails: show "Məlumat əlçatmaz" (Data unavailable) with retry button
- Never show raw error messages to users

---

## 2. Landing / Home Page Prompt (`/`)

Design the **main dashboard page** of Soteria. This is the first screen users see. It must feel like a mission control room — dense with live data, immediately impressive to hackathon judges.

### Layout (top to bottom)

1. AlertBanner (conditional — only if anomaly detected)
2. Page header: "Soteria" h1 + subtitle "Azərbaycanın Ekoloji Monitorinq Platforması" + last updated timestamp
3. StatCard row (4 cards, equal width)
4. Two-column section: MapView (left, 60%) + AIReportCard (right, 40%)
5. Three-column chart section

### StatCard Row — Exact Fields

**Card 1 — Dəniz Səthi Temperaturu**

- Icon: Thermometer
- Value: sea surface temperature in `°C` (from Open-Meteo Marine API `sea_surface_temperature`)
- Trend: vs 30-day average
- Status color: green (<22°C), amber (22–26°C), red (>26°C)

**Card 2 — Hava Keyfiyyəti İndeksi**

- Icon: Wind
- Value: AQI number (from Open-Meteo Air Quality `european_aqi`)
- Label below value: "Yaxşı / Orta / Pis / Çox Pis" (text changes by AQI range)
- Status color: green (<50), amber (50–100), red (>100)

**Card 3 — Xlorofil-a Konsentrasiyası**

- Icon: Droplets
- Value: chlorophyll-a level in `mg/m³` (from Sentinel Hub API)
- Trend: vs historical baseline
- Status color: green (<5), amber (5–15), red (>15)

**Card 4 — Orta Temperatur Anomaliyası**

- Icon: TrendingDown or TrendingUp
- Value: deviation from 10-year average in `°C` (from Open-Meteo Historical)
- Positive = warmer than normal (red), Negative = cooler (blue)

### MapView — Fields & Behavior

- Default layer: Chlorophyll-a overlay on Caspian Sea
- Layer toggle (3 buttons):
  - "Xlorofil": Sentinel Hub MODIS chlorophyll tile
  - "Dəniz Hərarəti": NASA GIBS SST tile
  - "Çirklənmə": NASA GIBS true-color MODIS tile
- Date slider at bottom of map: scrub back 12 months to see satellite layer change over time
- Map center: Caspian Sea (41.0°N, 51.5°E), zoom level 5
- Caspian Sea polygon outlined in teal (GeoJSON overlay)
- On map click: show lat/long tooltip

### AIReportCard — Fields & Behavior

- Triggered automatically on page load
- Input sent to Gemini: all 4 StatCard values + their trends + anomaly flags
- Output (Azerbaijani text, 3 paragraphs):
  - Paragraph 1: Overall ecological status summary
  - Paragraph 2: Most critical anomaly explanation
  - Paragraph 3: 7-day forecast and recommendation
- "Yenilə" button regenerates report (with loading spinner)

### Chart Section (3 columns)

**Chart 1 — Dəniz Səthi Temperaturu (30 gün)**

- Type: Line chart
- X-axis: dates (last 30 days)
- Y-axis: temperature °C
- Data source: Open-Meteo Marine `sea_surface_temperature`
- Teal line, amber dashed reference line = 10-year average

**Chart 2 — Hava Keyfiyyəti İndeksi (30 gün)**

- Type: Area chart
- X-axis: dates
- Y-axis: AQI value
- Data source: Open-Meteo Air Quality `european_aqi`
- Fill color changes with severity: green/amber/red gradient
- Shows PM2.5 as secondary line (dashed blue)

**Chart 3 — Xlorofil-a Trendi (12 ay)**

- Type: Bar chart
- X-axis: months
- Y-axis: mg/m³
- Data source: Sentinel Hub monthly average
- Bars colored green (normal) or red (elevated)

---

## 3. Caspian Sea Page Prompt (`/caspian`)

Design the **Caspian Sea monitoring page**. This page covers problems #2 (sea level drop) and #5 (pollution). It is the most visually dramatic page — it must communicate the scale of the Caspian crisis.

### Layout (top to bottom)

1. AlertBanner (if sea temp or chlorophyll anomaly)
2. Page header: "Xəzər Dənizi Monitorinqi" + subtitle "Səviyyə dəyişimi, çirklənmə və temperatur analizi"
3. Hero: full-width before/after satellite image comparison (2015 vs current year)
4. StatCard row (4 cards)
5. Two-column: large map (left) + data panel (right)
6. Full-width chart: sea surface temperature 10-year trend
7. AI analysis card (full-width)

### Hero Before/After Comparison

- Side-by-side NASA GIBS MODIS true-color tiles
- Left tile: year 2015, labeled "2015"
- Right tile: current year, labeled "2025"
- Center divider: draggable slider to reveal left/right (like a before/after slider component)
- Caption below: "Xəzər dənizinin sahə itkisi: 2015–2025" with calculated km² difference

### StatCard Row — Exact Fields

**Card 1 — Dəniz Səthi Hərarəti**

- Value: `°C` from Open-Meteo Marine `sea_surface_temperature`
- Trend: vs same month last year

**Card 2 — Dalğa Hündürlüyü**

- Value: `m` from Open-Meteo Marine `wave_height`
- Secondary: `wave_period` in seconds

**Card 3 — Xlorofil-a**

- Value: `mg/m³` from Sentinel Hub
- Status: green/amber/red with Azerbaijani label

**Card 4 — Dəniz Səthi Anomaliyası**

- Value: deviation from 30-year average `°C`
- Source: Open-Meteo Historical

### Map (left panel)

- Full Caspian Sea view
- Three overlay layers:
  - Chlorophyll-a concentration (green→red heatmap)
  - Sea surface temperature (blue→red heatmap)
  - True-color satellite (NASA GIBS MODIS)
- Shoreline change polygon: historical shoreline (2015) as dashed white line, current as solid teal
- Legend bottom-left: shows layer color scale

### Data Panel (right panel, beside map)

Stacked data rows, each showing:

**Dəniz Səthi Temperaturu Profili**

- Current value + unit
- 7-day min/max range (sparkline)
- Source badge: "Open-Meteo Marine API"

**Xlorofil-a Paylanması**

- Current mg/m³
- Category: Oliqotrofik / Mezotrofik / Eutrofik
- Source badge: "Sentinel Hub"

**Dalğa Parametrləri**

- Wave height (m)
- Wave period (s)
- Wave direction (°)
- Source badge: "Open-Meteo Marine API"

**Son Yenilənmə**

- Timestamp of last API fetch
- Manual refresh button

### 10-Year Temperature Chart (full-width)

- Type: Line chart with area fill
- X-axis: years (2015–2025), monthly data points
- Y-axis: sea surface temperature °C
- Primary line: actual temperature (teal)
- Secondary line: 30-year climate normal (dashed white)
- Shaded region between lines: colored red when above normal
- Annotation markers: 2 or 3 significant anomaly years labeled
- Source: Open-Meteo Historical API

### AI Analysis Card

- Full-width, same style as general AIReportCard
- Title: "Xəzər Dənizi AI Analizi"
- Input to Gemini: all 4 stat values + 10-year temperature array + current chlorophyll
- Output (Azerbaijani, 4 paragraphs):
  - Current sea health summary
  - Pollution risk assessment (chlorophyll interpretation)
  - Sea level trend explanation
  - 30-day ecological forecast

---

## 4. Air Quality Page Prompt (`/air`)

Design the **Baku Air Quality monitoring page**. This covers problem #6 (urban air pollution). The page should feel urgent and health-focused. Use warmer tones (amber, orange) to signal danger when AQI is elevated.

### Layout (top to bottom)

1. AlertBanner (if AQI > 100)
2. Page header: "Hava Keyfiyyəti Monitorinqi" + "Bakı və Abşeron yarımadası"
3. AQI Hero: large centered AQI display with radial gauge
4. StatCard row (5 cards, smaller)
5. Two-column: 16-day forecast chart (left) + pollutant breakdown (right)
6. 30-day historical AQI chart (full-width)
7. AI health report card

### AQI Hero

- Centered radial/arc gauge (SVG or canvas)
- Large number in center: current AQI value (e.g. "87")
- Arc colored: green (0–50), yellow (51–100), orange (101–150), red (151–200), purple (201+)
- Text below gauge: AQI category in Azerbaijani ("Orta" / "Sağlıksız" / "Təhlükəli" etc.)
- Sub-text: "Bakı üçün cari AQI dəyəri"
- Location: Baku coordinates `40.4093° N, 49.8671° E`

### StatCard Row — Exact Fields (all from Open-Meteo Air Quality API)

**Card 1 — PM2.5**

- Value: `μg/m³` (`pm2_5`)
- WHO limit reference line shown as thin indicator

**Card 2 — PM10**

- Value: `μg/m³` (`pm10`)

**Card 3 — NO₂**

- Value: `μg/m³` (`nitrogen_dioxide`)

**Card 4 — O₃ (Ozon)**

- Value: `μg/m³` (`ozone`)

**Card 5 — CO**

- Value: `μg/m³` (`carbon_monoxide`)

### 16-Day Forecast Chart (left column)

- Type: Bar chart
- X-axis: next 16 days (dates)
- Y-axis: European AQI forecast value (`european_aqi`)
- Source: Open-Meteo Air Quality forecast
- Bar color: follows AQI category color scale
- Hover tooltip: date + AQI value + category label
- Legend: color-to-category mapping

### Pollutant Breakdown (right column)

- Visual breakdown panel (not a chart)
- For each pollutant (PM2.5, PM10, NO₂, O₃, CO):
  - Pollutant name
  - Current value + unit
  - Horizontal progress bar showing % of WHO limit
  - Color: green (<50% of limit), amber (50–100%), red (>100%)
- Source badge: "Open-Meteo Air Quality API"

### 30-Day Historical AQI Chart (full-width)

- Type: Area chart
- X-axis: last 30 days
- Y-axis: European AQI
- Source: Open-Meteo Air Quality historical
- Teal/amber/red gradient fill based on value threshold
- Secondary dashed line: PM2.5 scaled to same axis
- Reference bands: colored horizontal zones for each AQI category

### AI Health Report Card

- Title: "Hava Keyfiyyəti AI Hesabatı"
- Input to Gemini: current AQI + all 5 pollutants + 16-day forecast array
- Output (Azerbaijani, 3 paragraphs):
  - Current air quality assessment
  - Main pollution source analysis (industrial vs traffic vs seasonal)
  - Health recommendations for next 7 days + expected AQI range

---

## 5. Climate Trends Page Prompt (`/climate`)

Design the **10-year climate trends page**. This covers problem #10 (climate change vulnerability). The page should feel analytical and data-heavy — like a scientific research dashboard. Use cooler, more neutral tones with sharp data visualizations.

### Layout (top to bottom)

1. Page header: "İqlim Trendləri" + "Azərbaycanın son 10 illik iqlim dəyişikliyi analizi"
2. Key metrics strip (inline, horizontal — not cards)
3. Temperature anomaly chart (full-width, hero chart)
4. Two-column: drought index chart (left) + precipitation chart (right)
5. Two-column: wind speed trends (left) + extreme weather frequency (right)
6. AI climate forecast card (full-width)

### Key Metrics Strip (horizontal row, no cards — just numbers)

Each metric: large value + label below + small trend arrow

**Metric 1 — Orta Temperatur Artımı**

- Value: `+X.X°C` above baseline (calculated from Open-Meteo Historical `temperature_2m_mean`)
- Label: "1991–2025 dövrü üçün"

**Metric 2 — İsti Günlər**

- Value: number of days per year above 35°C (from `temperature_2m_max`)
- Label: "35°C-dən yuxarı günlər (illik)"

**Metric 3 — Yağış Kəsiri**

- Value: `mm` below historical average precipitation
- Label: "Orta illik yağış kəsiri"
- Source: `precipitation_sum` from Open-Meteo

**Metric 4 — Güclü Küləklər**

- Value: frequency of wind speed >50 km/h events per year
- Source: `wind_speed_10m_max`

**Metric 5 — Quraqlıq Günləri**

- Value: days with precipitation < 1mm per year
- Source: `precipitation_sum` daily

### Temperature Anomaly Chart (full-width, hero)

- Type: Diverging bar chart (positive = above average, negative = below)
- X-axis: years 2015–2025
- Y-axis: temperature anomaly in °C vs 1991–2020 baseline
- Bars: red if above average, blue if below
- Zero line: white horizontal reference
- Trendline: dashed white diagonal line showing overall warming direction
- Source: Open-Meteo Historical `temperature_2m_mean`
- Title: "İllik Temperatur Anomaliyası (1991–2020 bazasına görə)"
- Subtitle: "Mənbə: Open-Meteo ERA5 tarixi iqlim məlumatı"

### Drought Index Chart (left column)

- Type: Line chart
- X-axis: months (last 24 months)
- Y-axis: drought severity index (calculated from precipitation deficit + temp anomaly)
- Color zones: green (normal), yellow (moderate drought), orange (severe), red (extreme)
- Shaded bands in background for each zone
- Source: calculated from `precipitation_sum` + `temperature_2m_max`
- Title: "Quraqlıq İndeksi"

### Precipitation Chart (right column)

- Type: Bar + line combo
- X-axis: months (last 24 months)
- Y-axis left: monthly precipitation mm (bars, blue)
- Y-axis right: cumulative deviation from average (line, amber)
- Reference dashed line: historical monthly average
- Source: `precipitation_sum`
- Title: "Aylıq Yağıntı və Kənar"

### Wind Speed Trends (left column)

- Type: Area chart
- X-axis: last 12 months
- Y-axis: wind speed km/h
- Shows: daily max wind speed (light line) + monthly average (bold line)
- Source: `wind_speed_10m_max`
- Title: "Maksimal Külək Sürəti"

### Extreme Weather Frequency (right column)

- Type: Grouped bar chart
- X-axis: years (2015–2025)
- Y-axis: number of events per year
- Groups: Extreme heat days (>38°C), No-rain streaks (>15 days), High wind events (>50km/h)
- Three-color bars (red, amber, blue)
- Source: all from Open-Meteo Historical
- Title: "Ekstremal Hava Hadisələrinin Tezliyi"

### AI Climate Forecast Card

- Title: "İqlim Dəyişikliyi AI Proqnozu"
- Input to Gemini: all 5 key metrics + 10-year temperature anomaly array + drought index array
- Output (Azerbaijani, 4 paragraphs):
  - Summary of observed climate change in Azerbaijan
  - Most significant trend identified
  - Risk assessment for next 5 years (agriculture, water, health)
  - Recommended adaptation measures for local context

---

## Cross-Page Design Rules (applies to all pages)

### Animations

- Page load: stagger-in animation for StatCards (100ms delay each)
- Charts: draw-on animation when entering viewport (Recharts built-in)
- AIReportCard: typewriter-style text reveal while streaming Gemini response
- AlertBanner: slides down from top with bounce

### Source Badges

Every data display element must show a small pill badge indicating its data source:

- "NASA GIBS" (gray)
- "Sentinel Hub" (teal)
- "Open-Meteo" (blue)
- "Gemini AI" (purple)

### Timestamps

Every data value must show when it was last fetched, in format: `Yeniləndi: 14:32 · 26 Apr 2025`

### Error States

- API unavailable: card turns dark red border, shows "Məlumat əlçatmaz" + retry icon
- AI report failed: shows "Hesabat yaradıla bilmədi. Yenidən cəhd edin." with retry button
- Map tiles fail: shows dark placeholder with satellite icon + error text

### Language

All UI text is in Azerbaijani. Data values (numbers, units) are universal. Only source badge names, technical API terms remain in English.
