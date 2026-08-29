# AptiMet Trainee Portal

An operational training platform for meteorologists — combining forecasting calibration labs, live cyclone war-zone simulations, forecast duels with live ELO scoring, crowd-sourced ground reports, and multilingual emergency broadcasts — built for the India Meteorological Department (IMD) training ecosystem.

---

## Quick Start (Two terminals)

> **Prerequisites:** Node.js ≥ 20, pnpm ≥ 9, PostgreSQL running locally (or supply a `DATABASE_URL` in `.env`).

### 1. Install dependencies (once)

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set your PostgreSQL connection string:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aptimet
```

### 3. Set up the database (once, idempotent)

```bash
# Run migrations — creates all 12 tables + leaderboard VIEW
pnpm migrate

# Seed with realistic historical demo data
pnpm seed
```

### 4. Run the app

Open **two terminals** from this directory:

**Terminal 1 — API server (port 5000):**
```bash
pnpm run dev:api
```

**Terminal 2 — Frontend dev server (port 5173):**
```bash
pnpm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> **Replit users:** The `.replit` file is pre-configured. Both servers start automatically. Just hit **Run**.

---

## Database Commands

```bash
# Run migrations (idempotent — safe to re-run, uses IF NOT EXISTS / ALTER ADD IF NOT EXISTS)
pnpm migrate

# Seed historical cyclones + users + sample duels/reports (idempotent — upserts on conflict)
pnpm seed

# (Optional) Generate versioned Drizzle SQL migration files
pnpm --filter @workspace/db run db:generate

# (Optional) Push schema directly to DB without migration files (dev only)
pnpm --filter @workspace/db run push
```

---

## Project Layout

```
AptiMet-Trainee-Portal/
├── artifacts/
│   ├── aptimet-trainee-portal/   # React + Vite frontend (port 5173)
│   │   └── src/
│   │       ├── pages/            # war-room.tsx, forecast-duel.tsx, dashboard.tsx, …
│   │       ├── components/features/  # EloLeaderboardModal, GroundReportsHub, AlertBroadcastModal, …
│   │       └── lib/api.ts        # Unified API client with graceful offline fallbacks
│   └── api-server/               # Express 5 backend (port 5000)
│       └── src/
│           ├── routes/           # cyclones, forecasts, duels, warzone, groundReports, alerts, …
│           └── lib/
│               ├── accuracyEngine.ts   # AI Forecast Accuracy (Haversine composite)
│               ├── eloEngine.ts        # FIDE ELO ranking engine
│               └── publicDataService.ts  # Live cyclone data ingest (NOAA/IMD hook)
├── lib/
│   └── db/                       # Drizzle ORM schema + DB pool
│       └── src/schema/schema.ts  # 12 tables + leaderboard view definition
├── scripts/
│   └── src/
│       ├── migrate.ts            # Idempotent SQL migration runner
│       └── seed.ts               # Realistic historical cyclone + user seed data
├── .env.example                  # Environment variable template
└── pnpm-workspace.yaml           # Monorepo workspace config
```

---

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript 5.9 |
| Frontend | React 19, Vite 7, Wouter (routing), Lucide icons |
| API | Express 5 |
| Database | PostgreSQL + Drizzle ORM + drizzle-zod |
| Validation | Zod v4, drizzle-zod |
| Styling | Vanilla CSS (custom design system — no Tailwind runtime classes at runtime) |
| Build | esbuild (API), Vite (frontend) |
| Offline | Service Worker (`public/sw.js`) + localStorage queue |
| i18n | Custom context provider — EN / हिन्दी / ଓଡ଼ିଆ / বাংলা / தமிழ் |

---

## Feature Suite

### A. Core Competitive Loop
- **AI Forecast Accuracy Engine** (`accuracyEngine.ts`) — Haversine great-circle track error in km, timing error in hours, intensity error in knots. Composite 0–100 score stored in `forecast_scores`.
- **Live ELO Ranking** (`eloEngine.ts`) — FIDE ELO formula with dynamic K-factors (K=32 Trainee / K=24 Forecaster / K=16 Senior). Head-to-head duels and solo calibrations. Persisted to DB.
- **Explainable Prediction Assist** (`ExplainablePredictionAssist.tsx`) — Historical analogue matching (Phailin, Fani, Tauktae), 500 hPa steering mechanisms, Holland MPI equations.

### B. Social Impact Features
- **Disaster-Ready Mode** (War Zone, `war-room.tsx`) — Evacuation & resource-allocation decisions scored against a lives-saved / cost model. Results persisted to `warzone_sessions`.
- **Crowd-Sourced Ground Reports** (`GroundReportsHub.tsx`) — Geotagged storm-spotter reports with photo URL, upvote flow, and ≥3-upvote auto-verification. DB-backed.

### C. Reach & Realism Features
- **Offline-First / Low-Bandwidth Mode** — Service Worker CacheStorage, `useOfflineStatus` hook, localStorage offline queue.
- **Multilingual UI** — 5-language support (EN, HI, OR, BN, TA) covering all major feature labels.
- **SMS/WhatsApp Emergency Fan-Out** (`AlertBroadcastModal.tsx`) — CAP-compliant broadcast simulator with delivery telemetry.
- **Public Real-Data Hook** (`publicDataService.ts`) — `/api/cyclones/sync-live` ingests near-live Bay of Bengal telemetry into the DB.

---

## Real vs. Simulated Logic

| Feature | Real Data & Logic | Simulated / Mocked for Demo |
|---|---|---|
| **AI Accuracy Engine** | Real Haversine formula, real WMO composite scoring (40% track + 35% rainfall + 25% intensity), real IMD precipitation actuals from seed data | Sub-km radar timing lag is synthesized within realistic operational bounds |
| **Live ELO Ranking** | Exact FIDE ELO equation, dynamic K-factors, full DB persistence of win/loss deltas | Solo mode uses an empirical Climatological Model benchmark (rating 1420) |
| **Explainable Assist** | Real historical analogue trajectories (Phailin, Fani, Tauktae), real Holland vortex MPI equations | Live NWP ensemble spaghetti spread uses calibrated Gaussian perturbations |
| **Disaster-Ready Mode** | Real OSDMA/NDMA 3-tier coastal evacuation protocol, real relief kit cost indices | Exposed population figures are representative synthesized census estimates |
| **Ground Reports** | Geotagged coordinates, real DB schema, real community threshold logic (≥3 upvotes = verified) | Spotter photos use curated field observation imagery |
| **Offline Resilience** | Real Service Worker CacheStorage API, real localStorage sync queues | Low-bandwidth mode is a UI toggle for desktop sandbox testing |
| **Multilingual UI** | Real native translations matching official IMD bulletin language | N/A — fully localized string dictionary |
| **SMS/WhatsApp Fan-Out** | CAP payload formatting, real multilingual warning messages | Telecom SMS-C and WhatsApp Business API gateways are simulated |
| **Public Data Ingest** | Real backend sync endpoint, real DB normalization into `cyclones` & `cyclone_tracks` | Provides fallback near-realtime Bay of Bengal telemetry if external API rate limits are encountered |
