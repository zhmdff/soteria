# Xəzər Monitor 🌊

Xəzər dənizi və Azərbaycanın ekoloji vəziyyətini izləmək üçün hazırlanmış peşəkar monitorinq platforması. Bu layihə NASA-nın peyk görüntüləri, Open-Meteo telemetriya məlumatları və Google Gemini AI analitikasını bir araya gətirərək real vaxt rejimində ətraf mühit analizi təqdim edir.

## 🚀 Əsas İmkanlar

### 📡 Canlı Peyk Arxivi (NASA GIBS)
*   **MODIS Daily Snapshot**: NASA-nın Terra peyki vasitəsilə hər gün yenilənən yüksək keyfiyyətli real görüntülər.
*   **Zaman Naviqatoru**: 2020-ci ildən 2026-cı ilin yanvarınadək olan arxiv görüntüləri arasında interaktiv keçid.
*   **Bulud və Toz Analizi**: Atmosfer dəyişikliklərini və toz fırtınalarını vizual izləmə imkanı.

### 🤖 AI Ekoloji Hesabat
*   **Gemini 3 Flash**: Ən son süni intellekt modeli vasitəsilə dəniz və hava məlumatlarının anlıq təhlili.
*   **Avtomatlaşdırılmış Tövsiyələr**: Mövcud anomaliyalara əsaslanan elmi proqnozlar və tövsiyələr.

### 📊 Ekoloji Göstəricilər
*   **Hava Keyfiyyəti (AQI)**: Bakı və Abşeron yarımadası üçün PM2.5, NO₂, O₃ və CO göstəriciləri.
*   **Dəniz Telemetriyası**: Xəzər dənizinin səth temperaturu, dalğa hündürlüyü və axın istiqamətləri.
*   **Xəzər Səviyyə İzləyicisi**: Dəniz səviyyəsinin tarixi enmə trendlərinin vizuallaşdırılması.
*   **Yaşıl Enerji Potensialı**: Külək və günəş enerjisi üzrə riyazi modelləşdirmə (Betz qanunu əsasında).

## 🛠 Texnoloji Stek

*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Tailwind CSS v4
*   **Xəritə Mühərriki**: Leaflet.js
*   **Data Mənbələri**: NASA GIBS, NASA EONET, Open-Meteo API
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

1.  **Xəritə Naviqasiyası**: Xəritənin altındakı interaktiv slider vasitəsilə tarixi geri çəkərək arxiv görüntülərinə baxa bilərsiniz.
2.  **Hesabat Yaratma**: Sağ tərəfdəki "AI Ekoloji Hesabat" bölməsində yeniləmə düyməsini sıxaraq anlıq süni intellekt təhlilini əldə edin.
3.  **Statistikalar**: Kartların üzərindəki məlumat (i) işarəsinə toxunaraq hər bir göstəricinin elmi izahını oxuya bilərsiniz.

---
**zhmdff** tərəfindən hazırlanmışdır. Xəzər dənizinin gələcəyi üçün texnoloji monitorinq.
