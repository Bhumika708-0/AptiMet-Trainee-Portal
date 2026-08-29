# AptiMet Trainee Portal

An operational training platform for meteorologists — combining forecasting calibration labs, live cyclone war-zone simulations, forecast duels, and an ELO rating system — built for the India Meteorological Department (IMD) training ecosystem.

## Run & Operate

```bash
# Start the API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Start the frontend dev server (port 5173)
pnpm run dev

# Full typecheck across all packages
pnpm run typecheck

# Build all packages (typecheck + esbuild)
pnpm run build
```

## Database Setup

Required env var: `DATABASE_URL` — PostgreSQL connection string.  
Copy `.env.example` → `.env` and fill in your values.

```bash
# 1. Run migrations — creates all 12 tables + leaderboard VIEW (idempotent)
pnpm migrate

# 2. Seed with realistic demo data (idempotent — safe to re-run)
pnpm seed

# 3. (Optional) Generate versioned Drizzle SQL migration files
pnpm --filter @workspace/db run db:generate

# 4. (Dev shortcut) Push schema directly to DB without migration files
pnpm --filter @workspace/db run push
```

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript 5.9 |
| Frontend | React 19, Vite 7, Wouter (routing), Lucide icons |
| API | Express 5 |
| Database | PostgreSQL + Drizzle ORM + drizzle-zod |
| Validation | Zod v4, drizzle-zod |
| Styling | Vanilla CSS (custom design system) |
| Build | esbuild (API), Vite (frontend) |

## Implemented Feature Suite (Batches A, B, C)

### BATCH A — Core Scoring & Competitive Loop
1. **AI Forecast Accuracy Engine (`accuracyEngine.ts`)**:
   - Geodesic Great-Circle distance calculations using the Haversine trigonometric formula across all waypoint coordinates.
   - Computes Mean Track Error in km, Timing error in hours, and Intensity error in knots.
   - Generates composite 0–100 accuracy score (40% Track + 35% Precipitation + 25% Central Pressure) and persists metrics into `forecast_scores`.
2. **Live ELO-Style Ranking System (`eloEngine.ts`)**:
   - Chess/FIDE calibrated ELO model with dynamic K-factors ($K=32$ for Trainee, $K=24$ for Forecaster, $K=16$ for Senior Analyst).
   - Expected probability curve $E = 1 / (1 + 10^{(R_B - R_A)/400})$.
   - Solo practice calibrations against historical benchmarks ($R_{\text{benchmark}} = 1420$) and live head-to-head duel matchmaking.
   - Dynamic rank tiers: Chief Synoptic Forecaster, Senior Cyclone Analyst, Operational Meteorologist, Duty Forecaster, Trainee Observer.
3. **Explainable Prediction Assist (`ExplainablePredictionAssist.tsx`)**:
   - Interactive reasoning panel providing historical analogue matching (Phailin, Fani, Tauktae, Amphan).
   - Subtropical ridge 500 hPa steering mechanisms, beta-drift corrections, Holland pressure deficit calculations, and Maximum Potential Intensity (MPI).

### BATCH B — Social Impact Features
4. **Disaster-Ready Mode & EOC SitRep (`war-room.tsx`)**:
   - Extends the Cyclone War Zone with a quantitative cost/lives-saved evacuation impact model.
   - Calculates Estimated Lives Protected ($\approx 15,480$ citizens), Total Relief Budget (₹ 142.50 Lakhs), and Zero-Casualty Protocol compliance.
5. **Crowd-Sourced Ground Reports (`GroundReportsHub.tsx`)**:
   - Geotagged situation reports for storm spotters & coastal citizens (Storm surge, gale gusts, waterlogging, structural damage).
   - Community consensus verification flow ( $\ge 3$ spotter confirmations automatically validates report) with PostgreSQL persistence.

### BATCH C — Reach & Realism Features
6. **Offline-First / Low-Bandwidth Mode (`useOfflineStatus.ts`, `sw.js`)**:
   - Service Worker cache storage for offline asset delivery and bulletin availability during coastal network collapse.
   - LocalStorage offline queue for forecasts and citizen spotter reports with automatic background sync.
   - Low-bandwidth 2G UI toggle mode.
7. **Multilingual UI (`i18n.tsx`)**:
   - Multi-language engine supporting English (EN), Hindi (हिन्दी), Odia (ଓଡ଼ିଆ), Bengali (বাংলা), and Tamil (தமிழ்).
8. **SMS / WhatsApp Emergency Fan-Out Console (`AlertBroadcastModal.tsx`)**:
   - CAP-compliant multi-channel emergency broadcast simulator with realistic Cell Broadcast SMS & WhatsApp push message previews.
   - Dispatch telemetry with delivery speed (3.4s) and delivery rate (99.3% across 2.45M devices).
9. **Public Real-Data Ingest Hook (`publicDataService.ts`, `PublicDataSyncBadge.tsx`)**:
   - Backend sync endpoint `/api/cyclones/sync-live` ingesting near-live tropical cyclone systems from NOAA IBTrACS / GDACS / IMD feeds into PostgreSQL tables.

## Real vs. Simulated Logic Transparency Summary

| Feature | Real Data & Algorithmic Logic | Simulated / Mocked for Demo |
|---|---|---|
| **AI Accuracy Engine** | Real Haversine geodesic distance formula, real IMD ground station precipitation actuals, real WMO composite scoring equation. | Sub-km radar timing lag is synthesized within realistic operational bounds for historical cases. |
| **Live ELO Ranking** | Exact mathematical FIDE ELO equation, dynamic K-factors, database-persisted player ratings and win/loss deltas. | Solo mode uses an empirical Climatological Model benchmark rating (1420) to calibrate lone trainees. |
| **Explainable Assist** | Real historical analogue trajectories (Phailin, Fani, Tauktae), real Holland vortex MPI equations, real 500 hPa synoptic steering principles. | Live numerical weather prediction (NWP) ensemble spaghetti spread uses calibrated Gaussian perturbations. |
| **Disaster-Ready Mode** | Real OSDMA/NDMA 3-tier coastal evacuation protocol, standard relief kit & shelter cost indices. | Exposed population figures are representative synthesized census demographic estimates. |
| **Ground Reports** | Geotagged coordinates, real database schema and persistence, real community threshold consensus logic ( $\ge 3$ upvotes). | Spotter photos use curated field observation imagery. |
| **Offline Resilience** | Real Service Worker CacheStorage API (`sw.js`), real localStorage synchronization queues. | Low-bandwidth and offline UI toggles provide realistic desktop sandbox testing without turning off Wi-Fi. |
| **Multilingual UI** | Real native translations in Hindi, Odia, Bengali, Tamil, and English matching official IMD bulletins. | N/A — fully localized string dictionary. |
| **SMS/WhatsApp Fan-Out** | Common Alerting Protocol (CAP) payload formatting, real multilingual warning messages, interactive phone preview. | Telecom SMS-C and WhatsApp Business API gateways are simulated with realistic latency and delivery metrics. |
| **Public Data Ingest** | Real backend sync endpoint, real database normalization and ingestion into `cyclones` & `cyclone_tracks`. | Provides fallback near-realtime Bay of Bengal telemetry if external API rate limits or firewalls are encountered. |
