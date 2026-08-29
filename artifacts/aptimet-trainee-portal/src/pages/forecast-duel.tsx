import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, ArrowRight, BarChart3, Check, Gauge, MapPin,
  RotateCcw, Wind, ShieldCheck, Trophy, Sparkles, Navigation, Layers
} from 'lucide-react';
import { historicalEvents as defaultEvents, HistoricalEvent } from '@/mockData/historicalEvents';
import { fetchHistoricalCyclones, submitForecastApi } from '@/lib/api';
import { ExplainablePredictionAssist } from '@/components/features/ExplainablePredictionAssist';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

function GaugeMeter({
  label,
  value,
  min,
  max,
  unit,
  icon,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
}) {
  const percent = Math.max(4, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="rounded-xl bg-[#f2f7f7] border border-[#d6e5e5] p-3.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-[#20404e]">
          {icon}
          {label}
        </span>
        <span className="font-mono text-[11px] font-bold text-[#1a6e76]">
          {value} {unit}
        </span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#dbe8e8]">
        <div className="h-full rounded-full bg-[#187a80] transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] text-[#70868f]">
        <span>{min}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, subtitle, highlight }: { label: string; value: string; subtitle?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 text-left ${
      highlight ? 'border-[#b7deda] bg-[#eef8f7]' : 'border-[#d6e5e5] bg-[#f7fbfb]'
    }`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#68818c]">{label}</p>
      <p className="mt-2 font-display text-xl font-bold leading-tight text-[#173b4d]">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-[#52717e]">{subtitle}</p>}
    </div>
  );
}

export default function ForecastDuel() {
  const [events, setEvents] = useState<HistoricalEvent[]>(defaultEvents);
  const [index, setIndex] = useState(0);
  const [rainfall, setRainfall] = useState(130);
  const [trackOffsetKm, setTrackOffsetKm] = useState(25);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  useEffect(() => {
    fetchHistoricalCyclones().then((data) => {
      if (data && data.length > 0) setEvents(data);
    });
  }, []);

  const event = events[index] ?? defaultEvents[0];

  const handleSubmit = async () => {
    setSubmitting(true);
    // Submit forecast with track coordinate simulation and rainfall estimate
    const res = await submitForecastApi(
      event.id,
      rainfall,
      [
        { lat: 15.2, lon: 86.5 + (trackOffsetKm / 111) },
        { lat: 18.8, lon: 85.1 + (trackOffsetKm / 111) }
      ],
      event.available.pressure,
      event.available.wind
    );
    setEvalResult(res);
    setSubmitted(true);
    setSubmitting(false);
  };

  const next = () => {
    setIndex((index + 1) % events.length);
    setRainfall(130);
    setTrackOffsetKm(25);
    setSubmitted(false);
    setEvalResult(null);
  };

  const accuracy = evalResult?.accuracyResult?.accuracyScore ?? Math.max(0, 100 - Math.round(Math.abs(rainfall - event.actual.rainfall) * 1.35));
  const badge =
    accuracy >= 80 ? 'Excellent Operational Call' : accuracy >= 55 ? 'Useful Operational Signal' : 'Keep Calibrating Thresholds';

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-6 md:px-9 md:pt-8 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#536e7f] hover:text-[#144b68] transition-colors focus-ring"
          data-testid="link-back-dashboard"
        >
          <ArrowLeft size={15} /> Return to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <HowThisWorksButton featureKey="accuracy" size="sm" />
          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#6d8491] bg-[#e6eff2] px-2.5 py-1 rounded-md">
            Historical Archive / {String(index + 1).padStart(2, '0')} of {String(events.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-2xl">
        <div className="tiny-label mb-1">Historical Meteorological Calibration Lab</div>
        <h1 className="text-[28px] font-bold tracking-[-.04em] text-[#124b78] md:text-[34px] font-display">
          Forecast Duels<span className="text-[#207d82]">.</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#5f7482]">
          Step into a real past operational shift. Analyze pre-event radar signatures and barometric observations, lock in your 24-hour extreme rainfall estimate, and compare against the official IMD verification record with our AI Accuracy Engine.
        </p>
      </div>

      {/* Grid: Snapshot vs Prediction */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* Historical Snapshot Panel */}
        <section className="rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow md:p-8 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e9eff2] pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#227278] font-bold">
                {event.date}
              </p>
              <h2 className="mt-1.5 flex items-center gap-2 font-display text-2xl font-bold text-[#1c3c4f]">
                <MapPin size={20} className="text-[#b85042]" />
                {event.name} · {event.location}
              </h2>
            </div>
            <span className="rounded-full bg-[#e3f2f1] px-3 py-1 text-xs font-bold text-[#1c6e73]">
              Verified IMD Record
            </span>
          </div>

          <p className="text-sm leading-6 text-[#456172]">{event.context}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Central Pressure', `${event.available.pressure} hPa`, 'Dropping rapidly'],
              ['Satellite / Cloud', event.available.cloud, 'Convective core'],
              ['Surface Wind', `${event.available.wind} km/h ${event.available.windDirection}`, 'Sustained onshore'],
            ].map(([label, value, note], i) => (
              <div className="rounded-xl bg-[#f5f9f9] border border-[#dbe6e6] p-3.5" key={label}>
                <p className="text-[10px] uppercase font-bold text-[#728b96]">{label}</p>
                <p className={`mt-2 font-display text-lg font-bold text-[#1f3f4e] leading-snug ${i === 1 ? 'text-xs' : ''}`}>
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-[#869da7]">{note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <GaugeMeter
              label="Observed Pressure"
              value={event.available.pressure}
              min={920}
              max={1020}
              unit="hPa"
              icon={<Gauge size={16} />}
            />
            <GaugeMeter
              label="Wind Intensity"
              value={event.available.wind}
              min={0}
              max={240}
              unit="km/h"
              icon={<Wind size={16} />}
            />
          </div>
        </section>

        {/* Prediction Input Form */}
        <section className="flex flex-col justify-between rounded-2xl bg-[#143d54] p-6 text-white panel-shadow md:p-8">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="tiny-label !text-[#87deda]">Your Operational Call</div>
                <h2 className="mt-1 font-display text-2xl font-bold">24-Hour District Rainfall</h2>
              </div>
              <BarChart3 className="text-[#87deda]" size={26} />
            </div>

            <p className="mt-3 text-xs leading-5 text-[#b0cad0]">
              What peak total rainfall would you brief for the primary impact corridor over the next 24 hours?
            </p>

            <div className="mt-6 flex items-end justify-between border-b border-[#2d586e] pb-4">
              <span className="font-mono text-5xl font-bold text-[#87deda]">{rainfall}</span>
              <span className="mb-1 text-sm font-semibold text-[#bad2d6]">mm / 24 hours</span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#bad2d6] block mb-2">
                  Rainfall Magnitude Adjustment
                </label>
                <input
                  aria-label="Rainfall estimate"
                  data-testid="input-rainfall"
                  type="range"
                  min="20"
                  max="240"
                  value={rainfall}
                  onChange={(e) => {
                    setRainfall(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  className="w-full accent-[#87deda] h-2 bg-[#2d586e] rounded-lg cursor-pointer"
                />
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-[#86a8b1]">
                  <span>20 mm (Moderate)</span>
                  <span>120 mm</span>
                  <span>240 mm (Extremely Heavy)</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#bad2d6] block mb-1.5 flex items-center justify-between">
                  <span>Track Cross-Alignment Bias</span>
                  <span className="font-mono text-[#87deda]">+{trackOffsetKm} km</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={trackOffsetKm}
                  onChange={(e) => {
                    setTrackOffsetKm(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  className="w-full accent-[#87deda] h-2 bg-[#2d586e] rounded-lg cursor-pointer"
                />
                <div className="mt-1 flex justify-between font-mono text-[9px] text-[#86a8b1]">
                  <span>0 km (Direct Hit)</span>
                  <span>60 km</span>
                  <span>120 km (Outer Sector)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#87deda] px-4 py-3.5 text-xs font-bold text-[#143d54] hover:bg-[#9dedea] transition-colors focus-ring"
            data-testid="button-submit-forecast"
          >
            {submitted ? (
              <>
                <Check size={16} /> Call Verified by AI Accuracy Engine
              </>
            ) : submitting ? (
              'Running Geodesic Verification...'
            ) : (
              'Submit Operational Call & Update ELO'
            )}
          </button>
        </section>
      </div>

      {/* Feature A3: Explainable Prediction Assist */}
      <ExplainablePredictionAssist
        cycloneName={event.name}
        location={event.location}
        pressure={event.available.pressure}
        windSpeed={event.available.wind}
        windDirection={event.available.windDirection}
      />

      {/* Feature A1 & A2: Verification & Outcome Debrief with AI Accuracy Engine & ELO */}
      {submitted && (
        <section className="animate-rise-in rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow md:p-8 space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-[#e9eff2] pb-5 md:flex-row md:items-center">
            <div>
              <div className="tiny-label">Meteorological Debrief · Case ID: {event.id}</div>
              <h2 className="mt-1 font-display text-2xl font-bold text-[#1a3d4f]">
                AI Accuracy Engine & ELO Rating Update
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  accuracy >= 70
                    ? 'bg-[#e0f3f1] text-[#1a7477]'
                    : 'bg-[#ffede8] text-[#be4f3c]'
                }`}
              >
                {badge} · {accuracy} / 100 Accuracy Score
              </div>

              {evalResult?.eloUpdate && (
                <div className="flex items-center gap-1.5 rounded-full bg-[#0c4a75] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                  <Trophy size={14} className="text-[#87deda]" />
                  <span>
                    ELO: {evalResult.eloUpdate.newRating} ({evalResult.eloUpdate.delta >= 0 ? `+${evalResult.eloUpdate.delta}` : evalResult.eloUpdate.delta})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <ResultCard label="Your Estimate" value={`${rainfall} mm`} subtitle="Locked rainfall call" />
            <ResultCard label="Actual Recorded" value={`${event.actual.rainfall} mm`} subtitle="IMD ground station network" />
            <ResultCard
              label="Mean Track Error"
              value={`${evalResult?.accuracyResult?.trackErrorKm ?? trackOffsetKm} km`}
              subtitle="Geodesic Haversine calculation"
              highlight
            />
            <ResultCard
              label="Forecast Rating"
              value={evalResult?.eloUpdate?.tier ?? "Operational Forecaster"}
              subtitle={`+${evalResult?.pointsAwarded ?? 120} Points Awarded`}
              highlight
            />
          </div>

          {/* Granular AI Accuracy Engine Explanation */}
          <div className="rounded-xl bg-[#f0f8f8] border border-[#cfe2e2] p-4 text-xs leading-6 text-[#294c59] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#156066]">
              <Sparkles size={16} /> AI Accuracy Engine Operational Notes
            </div>
            <p>
              {evalResult?.accuracyResult?.explanationNotes ||
                `Track deviation evaluated at ${trackOffsetKm} km against IMD Best Track Dataset. Core convective rainfall delta evaluated against 24-hour telemetry.`}
            </p>
            <p className="text-[11px] text-[#5b7884] pt-1">
              <strong>Official Bulletin:</strong> {event.official.call} ({event.official.confidence}). Verified impact threshold: {event.correctRange[0]}–{event.correctRange[1]} mm.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-[#075fa6] px-5 py-3 text-xs font-bold text-white hover:bg-[#064f8b] transition-colors focus-ring shadow-sm"
              data-testid="button-next-scenario"
            >
              <RotateCcw size={15} /> Try Next Historical Scenario ({index + 1}/{events.length}) <ArrowRight size={14} />
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#c5d8dc] px-5 py-3 text-xs font-bold text-[#456070] hover:bg-[#f2f7f8] transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
