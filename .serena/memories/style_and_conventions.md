# Style and Conventions for Xəzər Monitor

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet.js
- **Charts**: Recharts
- **AI**: Google Gemini SDK

## Architectural Patterns
- **API Proxy Pattern**: Use Next.js API routes (`app/api/`) as proxies for external API calls. This is mandatory for APIs requiring keys (like Gemini) to keep them server-side.
- **Data Source Separation**: All external API interaction logic should be encapsulated in a dedicated file in the `lib/` directory (one file per data source).
- **Component-Based UI**: Reusable UI elements should be placed in `components/`.

## Coding Style
- Follow standard TypeScript and React best practices.
- Use explicit types and interfaces for data structures.
- Adhere to Next.js App Router conventions.
- Tailwind CSS v4 is used for all styling.

## Important Note
- This project may use a version of Next.js with breaking changes. Always check for deprecation notices and refer to internal documentation if available.
