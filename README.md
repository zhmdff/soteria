# Soteria 🌍

Xəzər regionu üçün peşəkar ətraf mühit monitorinqi və proqnozlaşdırma platforması. NASA-nın elmi peyk görüntüləri, Open-Meteo API-nin dərin meteoroloji/marine dataları, lokal tarixi arxivlər və Google Gemini AI analitikasını vahid ekosistemdə birləşdirir.

## 🚀 Əsas İmkanlar

### 📡 Canlı Peyk Analizi (NASA GIBS)
*   **MODIS & VIIRS Görüntüləri**: NASA-nın Terra, Aqua və Suomi NPP peykləri vasitəsilə təbii rəngli və elmi spektral görüntülər.
*   **Çoxlaylı Xəritə**: Xlorofil-A, termal anomaliyalar, qar örtüyü və dəniz səthi temperaturu kimi 20-dən çox elmi layın vizuallaşdırılması.
*   **Dinamik Etiketlər**: Coğrafi sərhədlər və relyef xüsusiyyətlərinin idarə edilməsi.

### 🌊 Xəzər Dənizi və Marine Monitorinqi
*   **Su Səviyyəsi (1992-2026)**: Tarixi JSON datası əsasında səviyyə dinamikası və **Sahil Xətti Çəkilmə Modeli** (1m vertikal düşmə ≈ 400m horizontal çəkilmə).
*   **Dəniz Telemetriyası**: Canlı dalğa hündürlüyü, periodu, istiqaməti və dəniz səthi temperaturu.
*   **Okean Cərəyanları**: Open-Meteo Marine API vasitəsilə cərəyanların sürəti (velocity) və istiqamətinin (direction) anlıq monitorinqi.

### ⚡ Bərpa Olunan Enerji Potensialı
*   **Peyk Radiasiya Analizi**: GHI (Qlobal Horizontal), DNI (Birbaşa Normal) və DHI (Diffuz) şüalanma göstəriciləri.
*   **GTI (Global Tilted Irradiance)**: Müəyyən bucaq altında quraşdırılmış panellər üçün real enerji çıxışı hesablaması.
*   **Külək Enerjisi**: 10m, 80m və 100m hündürlüklərdə külək sürəti və istiqaməti analizləri.

### 🌪 Təbii Hadisələrin İzlənməsi (NASA EONET)
*   **Aktiv Hadisələr**: Meşə yanğınları, daşqınlar, quraqlıqlar və vulkanik aktivliyin regional və qlobal xəritədə izlənməsi.
*   **Təhlükə Bildirişləri**: Region üzrə aktiv hadisələrin kateqoriyalı siyahısı və NASA-dan birbaşa linklər.

### 🤖 AI Ekoloji Hesabat və Proqnozlaşdırma
*   **Gemini 1.5 Pro**: Riyazi reqressiya (Xətti və Polinomial) nəticələrinin AI tərəfindən Azərbaycan dilində elmi təhlili.
*   **AQI və Temp Proqnozu**: Hava keyfiyyəti və temperatur trendlərinin 7-30 günlük gələcək proyeksiyaları.

## 🛠 Texnoloji Stek

*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Vanilla CSS & Tailwind CSS v4
*   **Xəritə Mühərriki**: Leaflet.js (NASA GIBS REST Tile Integration)
*   **Riyazi Model**: Linear & Polynomial Regression (lib/predictions.ts)
*   **Data Mənbələri**: NASA EONET v3, NASA GIBS WMTS, Open-Meteo (Weather, Air Quality, Marine, Climate CMIP6), Lokal JSON Arxivləri
*   **AI**: Google Generative AI (Gemini SDK)

## 📦 Quraşdırma

1. Depozitoriyanı klonlayın:
```bash
git clone https://github.com/zhmdff/soteria.git
```

2. Paketləri pnpm ilə yükləyin:
```bash
pnpm install
```

3. `.env.local` faylında Gemini API açarını təyin edin:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

4. İnkişaf serverini başladın:
```bash
pnpm dev
```

## 📖 İstifadə Qaydaları

1.  **Naviqasiya**: Sol paneldəki menyu vasitəsilə dəniz, hava, iqlim, enerji və ya hadisələr bölməsinə keçid edin.
2.  **Məkan Seçimi**: Üst paneldəki axtarış və ya xəritə üzərinə klikləməklə koordinatları dəyişin (Xəzər dənizi mərkəzli optimallaşdırılmışdır).
3.  **Analiz**: "Analizi Başlat" düyməsi ilə AI-ın o anki dataları Azərbaycan dilində təhlil etməsini təmin edin.

---
**zhmdff** tərəfindən hazırlanmışdır. Xəzər dənizinin gələcəyi üçün texnoloji monitorinq.
