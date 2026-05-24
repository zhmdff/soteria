# Soteria Global Project Rules

This document outlines the architectural, design, and data consistency standards for the Soteria platform. All new features and modifications must adhere to these rules.

## 1. Data Integrity & "Trusted Source Only" Rule

- **Verified Global APIs**: Only use data from authoritative, global scientific organizations (e.g., NASA, Copernicus, Open-Meteo, IUCN, GBIF, DAHITI).
- **No Localhost Reliance**: NEVER rely on local databases, scapers, or unverified local APIs for production-level environmental metrics.
- **Dynamic Logic Only**: NEVER use static, hardcoded "dummy" arrays for production features.
- **Visual Distinction**: Real data points and predicted/prognostic data points must be visually distinct in charts (e.g., using `predictKey` for dashed lines).
- **Source Attribution**: Every analytical module must clearly state its data source (e.g., "Source: GBIF API").

## 2. Design System & Layout

- **Typography**:
  - Headings: `Space Grotesk` (via `--font-space-grotesk` / `font-headline-lg`).
  - Body: `Manrope` (via `--font-manrope` / `font-body-md`).
- **Color Palette**: Use the Tailwind v4 theme variables defined in `app/globals.css`.
  - Primary Action/Highlight: `--color-primary` (#006b5a).
  - Status Success: CSS `text-success`.
  - Status Warning/Alert: CSS `text-amber-500` or `text-error`.
- **Layout Consistency**:
  - Pages must use the standard padding: `p-6 md:p-10`.
  - Interactive elements must be wrapped in `AnimatePresence` or use `animate-in fade-in` classes.
  - SideNavBar must be updated for every new top-level module.

## 3. Component Standards

- **StatCards**:
  - Every dashboard must feature a responsive grid of `StatCard` components.
  - Mandatory props: `label`, `value`, `icon`, `status`.
  - Optional but preferred: `trend`, `description`.
- **Charts**:
  - Use `ChartPanel` for all data visualizations.
  - Charts must support responsive height and standardized Tooltip styling.
- **AI Reports**:
  - Every analytical page must include an `AIReport` component to provide context-aware summaries in Azerbaijani.

## 4. Internationalization (i18n)

- **Language**: The primary UI and content language is Azerbaijani (`az-AZ`).
- **AI Content**: AI prompts must specify reporting in Azerbaijani to maintain consistency.

## 5. Directory Structure

- `/app/[module]`: Route folders.
- `/components/[Category]`: Reusable UI elements.
- `/lib`: Core mathematical models and API clients.
- `/data`: Static historical baseline datasets (JSON).
- `/docs`: API references and research findings.
