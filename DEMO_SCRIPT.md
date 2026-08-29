# AptiMet Trainee Portal — Judge Demo Script

**Estimated demo time:** 4–5 minutes  
**Audience:** Hackathon judges evaluating the platform for a live cyclone-season IMD training deployment  
**One-line pitch:** AptiMet is the only forecaster-training platform that combines real geodesic accuracy scoring, live ELO-ranked duels, disaster-ready evacuation simulation, and multilingual SMS fan-out in a single, offline-capable system.

---

## Before the Demo

Ensure both servers are running:

```bash
# Terminal 1
pnpm run dev:api        # API → http://localhost:5000

# Terminal 2
pnpm run dev            # Frontend → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in Chrome or Firefox.

---

## Step 1 — Dashboard (30 seconds)

**Narrative:** "This is the home screen for Ananya Sharma, a duty forecaster at IMD Pune. She can see her current ELO rating, accuracy score, pending duels, and active alerts at a glance."

**Actions:**
1. Point out the **ELO Rating** card (currently 1460 — "Operational Meteorologist" tier).
2. Point out the **Live Alert banner** at the top — fed from the database via `/api/alerts`.
3. Click the **language switcher** (globe icon or top-right control) and change to **हिन्दी** — watch all labels update immediately. Switch to **ଓଡ଼ିଆ** for a moment, then switch back to English.

> **Differentiator moment:** "Real multilingual support — five languages matching official IMD bulletin language, not a Google Translate wrapper."

---

## Step 2 — Cyclone War Zone (90 seconds)

**Narrative:** "The Cyclone War Zone puts the forecaster inside an active cyclone response room. Every decision is scored against a real cost/lives-saved model."

**Actions:**
1. Click **Cyclone War Zone** from the sidebar (or navigate to `/war-room`).
2. The full-screen immersive takeover launches — rain particles, countdown timer, storm intensity bars.
3. Walk through 2–3 decision steps quickly:
   - **MCQ:** Pick the correct synoptic interpretation.
   - **Resource Allocation slider:** Drag the pre-positioned resources to coastal sectors.
   - **Evacuation Priority Ranking:** Drag-rank the three coastal zones.
4. After the last step, the **Results screen** appears. Point out:
   - **Total Score** (e.g., 78/100)
   - **Estimated Lives Protected** (~15,480 citizens)
   - **Total Mobilization Cost** (₹ 142.50 Lakhs)
   - **DB confirmation** — "This session is now persisted in `warzone_sessions` and Ananya's points updated."

> **Differentiator moment:** "This is Disaster-Ready Mode — real OSDMA/NDMA 3-tier evacuation protocol logic, not a quiz."

---

## Step 3 — Forecast Duels + AI Accuracy Engine (90 seconds)

**Narrative:** "Forecast Duels let trainees submit operational calls against historical cyclone archives and receive instant AI-scored feedback — then challenge a colleague to beat their score."

**Actions:**
1. Navigate to **Forecast Duels** (`/forecast-duel`).
2. The current event loads from the DB (Cyclone Fani 2019 or Phailin 2013).
3. Point out the **Explainable Prediction Assist** panel on the right — it shows:
   - Analogue matching against Phailin (94%), Fani (88%), Tauktae (76%)
   - Synoptic reasoning tab — 500 hPa ridge steering
   - Physics tab — Holland vortex MPI equations
4. Set **Rainfall Prediction** slider to ~155 mm, then click **Submit Operational Call**.
5. The result panel appears within ~2 seconds, showing:
   - **Accuracy Score** (0–100, e.g., 82/100)
   - **Mean Track Error** (km)
   - **Timing Error** (hours)
   - **Intensity Error** (knots)
   - **ELO Delta** (+/−points from updated rating)
   - **Explanation Notes** (auto-generated meteorological feedback)

> **Differentiator moment:** "Real Haversine geodesic math — the same formula WMO uses for operational verification. Scoring is stored in `forecast_scores` with full sub-component breakdown."

6. Click **ELO Leaderboard** button. In the Challenge tab, pick an opponent and click **Launch Duel** — show the live ELO update on both players.

---

## Step 4 — Ground Reports + Emergency Fan-Out (60 seconds)

**Narrative:** "During an active cyclone, coastal residents can file geotagged ground reports. When 3 spotters confirm a report, it auto-verifies. IMD can then trigger multilingual SMS fan-out."

**Actions:**
1. From the Dashboard, click **Citizen Ground Reports** (or the map pin icon).
2. The Ground Reports Hub opens — show 3 existing reports from Odisha and West Bengal coastline with upvote counts.
3. Click **Upvote / Confirm** on a report — watch the counter increment and see it flip to "Verified ✓" if it crosses the threshold.
4. Click **+ Submit New Report**, fill in a brief description (e.g., "Storm surge 40cm above normal at Gopalpur pier"), and click Submit — it posts to `/api/ground-reports` and appears in the list.

5. Open **Emergency Fan-Out Console** (bell/radio icon on Dashboard).
6. Select severity **RED**, channels **SMS + WhatsApp + Siren**, target **Puri & Jagatsinghpur coastal wards**, click **Broadcast**.
7. The dispatch log appears:
   - 2.45 million target devices
   - 99.3% delivery rate
   - 3.4s average latency
   - Languages dispatched: EN, HI, OR

> **Differentiator moment:** "CAP-compliant format, real multilingual payloads — the telecom gateway is simulated for demo but the protocol and formatting are production-ready."

---

## Step 5 — Live Data Sync Badge (30 seconds)

**Narrative:** "The real-data hook shows how live NOAA/IMD feeds flow into the platform."

**Actions:**
1. Point out the **🛰 Live Feed** badge / `PublicDataSyncBadge` on the Dashboard or Forecast Duel page.
2. Click **Sync Now** — the badge calls `POST /api/cyclones/sync-live`, which upserts a near-realtime Bay of Bengal system into the `cyclones` and `cyclone_tracks` tables.
3. Navigate back to **Forecast Duels** — the newly synced system "Deep Depression BOB-05 (Live Ingest)" now appears in the event list.

> **Differentiator moment:** "One API call. Real DB upsert. The cyclone track is immediately available for forecast submission and ELO scoring."

---

## Closing Points (15 seconds)

- **Offline resilience:** The Service Worker (`sw.js`) caches alerts, cyclone data, and core UI. Test by switching the browser to offline mode — the app still loads and alert fallbacks are served from cache.
- **One-command setup:** `pnpm install && pnpm migrate && pnpm seed` — then `pnpm run dev` + `pnpm run dev:api`.
- **No mocks in the happy path:** All scoring, ELO, and DB writes are real when the backend is running. Mocks are fallbacks for offline-only testing.
