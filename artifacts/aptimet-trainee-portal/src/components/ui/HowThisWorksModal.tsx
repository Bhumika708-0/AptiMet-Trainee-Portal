import React, { useState } from 'react';
import { CircleHelp, CheckCircle2, AlertTriangle, Sparkles, X, Database, Cpu, Radio, ShieldCheck } from 'lucide-react';

export interface FeatureExplanation {
  featureTitle: string;
  category: 'accuracy' | 'elo' | 'assist' | 'disaster' | 'crowdsource' | 'offline' | 'i18n' | 'broadcast' | 'publicdata';
  realComponents: string[];
  simulatedComponents: string[];
  scientificFormula?: string;
  operationalContext?: string;
}

export const FEATURE_EXPLANATIONS: Record<string, FeatureExplanation> = {
  accuracy: {
    featureTitle: "AI Forecast Accuracy Engine (WMO Standard)",
    category: "accuracy",
    realComponents: [
      "True Geodesic Great-Circle distance via Haversine trigonometric formula across all waypoint coordinates.",
      "IMD station 24-hour rainfall verification actuals & barometric minimum pressure records from PostgreSQL database.",
      "Composite weighted multi-component scoring (40% Track + 35% Precipitation + 25% Central Pressure).",
      "Dynamic feedback generator highlighting cross-track displacement and 500 hPa steering biases."
    ],
    simulatedComponents: [
      "Sub-kilometer Doppler radar micro-scale timing errors are randomized within operational bounds for historical cases with incomplete high-frequency radar loops."
    ],
    scientificFormula: "d = 2R · arcsin(√(sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)))",
    operationalContext: "Calibrated to IMD Cyclone Warning Division & WMO Tropical Cyclone Operational Plan for the Bay of Bengal & Arabian Sea."
  },
  elo: {
    featureTitle: "Live Chess ELO Rating System for Meteorologists",
    category: "elo",
    realComponents: [
      "Standard FIDE Elo calculation with dynamic K-factors (K=32 for Trainee, K=24 for Forecaster, K=16 for Senior Analyst).",
      "Expected probability curve E = 1 / (1 + 10^((R_opponent - R_player)/400)).",
      "Live rating updates persisted in PostgreSQL database users & duels tables.",
      "Dynamic rank tiers (Trainee → Duty Forecaster → Operational Meteorologist → Senior Analyst → Chief Synoptic Forecaster)."
    ],
    simulatedComponents: [
      "Solo practice mode uses an empirical Climatological Model benchmark (ELO 1420) to calibrate lone trainees against historical records."
    ],
    scientificFormula: "R' = R + K · (S - E), where E = 1 / (1 + 10^((R_B - R_A)/400))",
    operationalContext: "Brings objective competitive skill tracking to operational meteorologist training pipelines."
  },
  assist: {
    featureTitle: "Explainable Prediction Assist",
    category: "assist",
    realComponents: [
      "Historical analogue trajectory matching against North Indian Ocean cyclone tracks (Phailin, Fani, Tauktae, Amphan).",
      "Physical reasoning indicators: 500 hPa subtropical ridge orientation, vertical wind shear threshold (<10 kt favorable), MJO phase.",
      "Barometric drop rate cues based on pressure gradient equations."
    ],
    simulatedComponents: [
      "Real-time GFS/ECMWF ensemble spaghetti spread is simulated using calibrated Gaussian perturbations around the synoptic track."
    ],
    operationalContext: "Designed to train forecasters to look beyond black-box numerical weather prediction (NWP) outputs."
  },
  disaster: {
    featureTitle: "Disaster-Ready Evacuation & Cost/Lives Model",
    category: "disaster",
    realComponents: [
      "Odisha State Disaster Management Authority (OSDMA) / NDMA standard 3-tier coastal evacuation zoning.",
      "Cost model incorporating shelter provisioning, emergency drinking water filtration, NDRF battalion transport, and fishing ban subsidies.",
      "Casualties-prevented estimation based on storm surge depth and evacuation compliance percentage."
    ],
    simulatedComponents: [
      "Exposed population figures are representative synthesized census demographic estimates for coastal sectors."
    ],
    scientificFormula: "Lives Saved = Exposed Population × Compliance% × Surge Vulnerability Factor (0.042)",
    operationalContext: "Simulates high-stakes decisions faced by State Relief Commissioners during Category 4/5 threats."
  },
  crowdsource: {
    featureTitle: "Crowd-Sourced Ground Reports & Spotter Network",
    category: "crowdsource",
    realComponents: [
      "Geotagged coordinate pinning and real-time database persistence in PostgreSQL ground_reports table.",
      "Community consensus thresholding (≥3 spotter confirmations automatically elevates report to 'Community Verified').",
      "Official IMD Duty Meteorologist triage and verification pipeline."
    ],
    simulatedComponents: [
      "Sample spotter photos use curated field observation imagery for demonstration."
    ],
    operationalContext: "Empowers citizen science while maintaining operational data hygiene against false reports."
  },
  offline: {
    featureTitle: "Offline-First & Low-Bandwidth Resilience",
    category: "offline",
    realComponents: [
      "Service Worker cache storage for offline asset delivery during communication network collapse.",
      "LocalStorage offline queue for forecasts and citizen ground reports with automatic sync on reconnection.",
      "Low-bandwidth 2G UI mode minimizing network roundtrips."
    ],
    simulatedComponents: [
      "Simulated low-bandwidth and offline toggles allow testing field scenarios on desktop browsers without disabling Wi-Fi."
    ]
  },
  broadcast: {
    featureTitle: "SMS / WhatsApp Multi-Channel Emergency Fan-Out",
    category: "broadcast",
    realComponents: [
      "Common Alerting Protocol (CAP) and ITU-T X.1303 formatted emergency alert payloads.",
      "Multilingual message templates matching official IMD bulletined phrasing in Hindi, Odia, Bengali, Tamil, and English.",
      "Interactive realistic smartphone push and WhatsApp message simulator."
    ],
    simulatedComponents: [
      "Telecom operator SMS-C and WhatsApp Business API gateways are mathematically simulated with realistic delivery latency (3.4s) and delivery success rates (99.3%)."
    ],
    operationalContext: "Mirrors NDMA SACHET and State Emergency Operation Centre broadcast systems."
  },
  publicdata: {
    featureTitle: "Public Real-Data Ingest Hook",
    category: "publicdata",
    realComponents: [
      "Backend sync endpoint connecting to public meteorological APIs (NOAA IBTrACS, GDACS, and IMD RSMC).",
      "Automatic ingestion and normalization into PostgreSQL cyclones and cyclone_tracks database tables."
    ],
    simulatedComponents: [
      "Provides realistic near-realtime Bay of Bengal depression telemetry when external API rate limits or network boundaries are reached."
    ]
  }
};

export function HowThisWorksButton({ featureKey, size = "sm" }: { featureKey: string; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const data = FEATURE_EXPLANATIONS[featureKey] || FEATURE_EXPLANATIONS.accuracy;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg transition-all ${
          size === 'sm'
            ? 'px-2.5 py-1 text-[11px] bg-[#eef5f8] text-[#1a5b88] hover:bg-[#dfeef5] border border-[#cbdfe9]'
            : 'px-3.5 py-1.5 text-xs bg-[#164d78] text-white hover:bg-[#123e61] shadow-sm'
        }`}
        data-testid={`button-how-this-works-${featureKey}`}
        title="View transparency breakdown of real vs simulated logic"
      >
        <CircleHelp size={size === 'sm' ? 13 : 15} />
        <span>How this works</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2a3b]/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#cfe0e8] bg-white p-6 panel-shadow animate-rise-in text-[#20364d]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#e5ecf0] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e0f0f5] text-[#145d82]">
                  <ShieldCheck size={13} /> Engineering Transparency & Operational Logic
                </span>
                <h3 className="mt-2 text-lg font-bold font-display text-[#153b52]">
                  {data.featureTitle}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-[#637a89] hover:bg-[#edf2f6]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs leading-relaxed">
              {/* Scientific Formula if available */}
              {data.scientificFormula && (
                <div className="rounded-xl bg-[#f2f7f9] border border-[#d8e6ec] p-3.5 font-mono text-[11px] text-[#18536f]">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#6a8492] mb-1">
                    Mathematical / Verification Equation:
                  </div>
                  <code>{data.scientificFormula}</code>
                </div>
              )}

              {/* Real Components */}
              <div className="rounded-xl bg-[#f0f9f5] border border-[#cde8dc] p-4">
                <div className="flex items-center gap-2 font-bold text-[#1a704c] mb-2 text-xs">
                  <CheckCircle2 size={16} className="text-[#1a704c]" />
                  <span>Real Data & Algorithmic Logic in this App:</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc text-[#29513e]">
                  {data.realComponents.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Simulated Components */}
              <div className="rounded-xl bg-[#fff8ee] border border-[#fae4c3] p-4">
                <div className="flex items-center gap-2 font-bold text-[#9e5f18] mb-2 text-xs">
                  <AlertTriangle size={16} className="text-[#c77a22]" />
                  <span>Simulated / Mocked for Demo & Offline Sandbox:</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc text-[#63451e]">
                  {data.simulatedComponents.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Operational Context */}
              {data.operationalContext && (
                <p className="text-[11px] text-[#597384] italic bg-[#f7fafc] p-3 rounded-lg border border-[#e2edf3]">
                  💡 <strong>Operational Context:</strong> {data.operationalContext}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#144d75] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#103e5e] transition-colors"
              >
                Got it, continue testing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
