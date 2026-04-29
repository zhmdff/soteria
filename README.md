# Soteria 🌍

Ətraf mühitin və ekoloji vəziyyətin izlənilməsi üçün hazırlanmış peşəkar monitorinq platforması. Bu layihə NASA-nın peyk görüntüləri, Open-Meteo API (canlı və arxiv məlumatları), lokal verilənlər bazası və Google Gemini AI analitikasını bir araya gətirərək real vaxt rejimində ekoloji analiz təqdim edir.

## 🚀 Əsas İmkanlar

### 📡 Xəritə və Peyk Naviqasiyası (NASA GIBS)
*   **MODIS Görüntüləri**: NASA-nın Terra peyki vasitəsilə əldə edilən real və arxiv peyk görüntüləri.
*   **İnteraktiv Zaman Naviqatoru**: Tarixi görüntülər və datalar arasında keçid imkanı.

### 🤖 AI Ekoloji Hesabat
*   **Gemini AI**: Ən son süni intellekt modeli vasitəsilə ekoloji və telemetrik məlumatların anlıq təhlili.
*   **Avtomatlaşdırılmış Tövsiyələr**: Süni intellekt əsaslı proqnozlar.

### 📊 Dinamik Ekoloji və İqlim Göstəriciləri (Open-Meteo & Lokal Arxivlər)
*   **Hava Keyfiyyəti (AQI)**: Open-Meteo API-dən alınan canlı PM2.5, PM10, NO₂, O₃ və CO göstəriciləri.
*   **Dəniz Telemetriyası**: Dəniz səthi temperaturu, dalğa hündürlüyü və periodu (Canlı Open-Meteo Marine məlumatları).
*   **Xəzər Dənizi Səviyyə İzləyicisi**: NASA və lokal stansiya arxivlərinə əsaslanan (JSON bazası) su səviyyəsinin real və tarixi trendləri.
*   **Tarixi İqlim Trendləri**: ERA5 arxivi üzərindən orta temperatur artımı, quraqlıq günləri və isti günlərin real məlumatlara əsasən hesablanması.
*   **Yaşıl Enerji Potensialı**: Günəş radiasiyası (`shortwave_radiation_sum`) və külək sürəti əsasında avtomatik hesablanan real potensial (kWh).

*Qeyd: Xlorofil-a və bənzəri dəniz biologiyası parametrləri Open-Meteo-da mövcud olmadığı üçün yalnız məlumat məqsədli sistemdən qeyd kimi verilmişdir.*

## 🛠 Texnoloji Stek

*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Tailwind CSS v4
*   **Xəritə Mühərriki**: Leaflet.js
*   **Qrafiklər**: Recharts / Chart.js
*   **Data Mənbələri**: NASA GIBS, Open-Meteo (Weather, Air Quality, Marine, Historical Archive API), Lokal JSON Verilənlər Bazası
*   **AI**: Google Generative AI (Gemini SDK)
*   **Dillər**: TypeScript (Tam tip təhlükəsizliyi)

## 📦 Quraşdırma

Layihəni lokal mühitdə işə salmaq üçün:

1. Depozitoriyanı klyonlayın:
```bash
git clone https://github.com/zhmdff/xazar-monitor.git
```

2. Lazımi paketləri yükləyin:
```bash
npm install
```

3. `.env.local` faylını yaradın və Gemini API açarınızı əlavə edin:
```env
GEMINI_API_KEY=sizin_acarınız_burada
```

4. İnkişaf serverini başladın:
```bash
npm run dev
```

## 📖 İstifadə Qaydaları

1.  **Dinamik Tablolar**: Ana Səhifə, Xəzər Dənizi və İqlim bölmələrindəki tablolara daxil olaraq canlı və ya tarixi məlumatlara asanlıqla nəzər sala bilərsiniz.
2.  **Hesabat Yaratma**: AI Ekoloji Hesabat bölməsində yeniləmə düyməsini sıxaraq o anki bütün sensor məlumatlarına əsaslanan süni intellekt təhlilini əldə edin.
3.  **Tarixi İntervallar**: Qrafiklərin üzərindəki zaman intervallarını (məs. 10 il, 1 il, 1 ay) seçərək trendləri asanlıqla incələyin.

---
**zhmdff** tərəfindən hazırlanmışdır. Xəzər dənizinin gələcəyi üçün texnoloji monitorinq.
