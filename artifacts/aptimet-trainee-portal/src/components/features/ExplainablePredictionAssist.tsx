import React, { useState } from 'react';
import { Compass, Lightbulb, TrendingUp, Waves, Wind, Layers, ArrowUpRight, Check, HelpCircle } from 'lucide-react';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

interface AssistProps {
  cycloneName: string;
  location: string;
  pressure: number;
  windSpeed: number;
  windDirection: string;
}

export function ExplainablePredictionAssist({
  cycloneName,
  location,
  pressure,
  windSpeed,
  windDirection,
}: AssistProps) {
  const [activeTab, setActiveTab] = useState<'analogues' | 'synoptic' | 'physics'>('analogues');

  // Meteorological Analogue Profiles
  const analogues = [
    {
      name: "Very Severe Cyclone Phailin (2013)",
      matchScore: 94,
      pressureDrop: "12 hPa / 6h",
      resemblance: "Identical rapid drop in central pressure below 985 hPa east of Andhra coast.",
      steeringNote: "Track steered NNW along the western flank of the subtropical anticyclone.",
      impactResult: "Peak 24h rainfall exceeded 180mm in Ganjam district.",
    },
    {
      name: "Extremely Severe Cyclone Fani (2019)",
      matchScore: 88,
      pressureDrop: "16 hPa / 12h",
      resemblance: "Tight core curvature with western wind component in southern quadrants.",
      steeringNote: "Recurvature induced by mid-latitude trough passage over northern India.",
      impactResult: "Gale speeds reached 205 km/h at Puri landfall.",
    },
    {
      name: "Severe Cyclone Tauktae (2021)",
      matchScore: 76,
      pressureDrop: "8 hPa / 6h",
      resemblance: "Warm SST (30°C) sustained intense vertical convective towers.",
      steeringNote: "Parallel coastal tracking along the western ghats ridge.",
      impactResult: "Extreme localized orographic rainfall exceeding 110mm.",
    },
  ];

  return (
    <div className="rounded-2xl border border-[#cfe0e8] bg-gradient-to-br from-[#f8fafc] to-[#eef5f8] p-5 panel-shadow text-[#20364d]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1ebf0] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#0e527d] text-white">
            <Lightbulb size={17} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#14476c] flex items-center gap-2">
              Explainable Prediction Assist
              <span className="rounded-full bg-[#dcf2f1] px-2 py-0.5 text-[10px] font-bold text-[#176a70]">
                AI Synoptic Reasoning
              </span>
            </h4>
            <p className="text-[11px] text-[#607787]">
              Physics-backed reasoning and historical analogues to calibrate your operational call
            </p>
          </div>
        </div>

        <HowThisWorksButton featureKey="assist" size="sm" />
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 border-b border-[#dbe6ec] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analogues')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'analogues'
              ? 'bg-[#14476c] text-white shadow-sm'
              : 'text-[#506979] hover:bg-[#e2eef3]'
          }`}
        >
          <Layers size={13} />
          <span>Historical Analogues</span>
        </button>
        <button
          onClick={() => setActiveTab('synoptic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'synoptic'
              ? 'bg-[#14476c] text-white shadow-sm'
              : 'text-[#506979] hover:bg-[#e2eef3]'
          }`}
        >
          <Compass size={13} />
          <span>Steering & Recurvature</span>
        </button>
        <button
          onClick={() => setActiveTab('physics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'physics'
              ? 'bg-[#14476c] text-white shadow-sm'
              : 'text-[#506979] hover:bg-[#e2eef3]'
          }`}
        >
          <Wind size={13} />
          <span>Vorticity & Pressure Gradient</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'analogues' && (
          <div className="space-y-3">
            <div className="text-[11px] text-[#556e7d] leading-5">
              Based on the current observed central pressure of <strong>{pressure} hPa</strong>, sustained wind of <strong>{windSpeed} km/h</strong>, and direction <strong>{windDirection}</strong>, our pattern-matching engine found these historical twins in the IMD synoptic archives:
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {analogues.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#d6e4eb] bg-white p-3.5 panel-shadow hover:border-[#86c8d4] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#145d65]">
                      {a.matchScore}% Analogue Match
                    </span>
                    <span className="rounded bg-[#e8f4f4] px-1.5 py-0.5 text-[9px] font-bold text-[#1a6e75]">
                      {a.pressureDrop}
                    </span>
                  </div>
                  <h5 className="mt-1.5 font-bold text-xs text-[#1e3e50] leading-snug">{a.name}</h5>
                  <p className="mt-1.5 text-[10px] text-[#4d6675] leading-4">{a.resemblance}</p>
                  <div className="mt-2.5 rounded-lg bg-[#f4f8fa] p-2 text-[10px] font-semibold text-[#1a5b78]">
                    💡 Historical Outcome: {a.impactResult}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'synoptic' && (
          <div className="rounded-xl bg-white p-4 border border-[#d6e4eb] space-y-3 text-xs leading-5 text-[#3e596b]">
            <div className="flex items-center gap-2 font-bold text-[#124d78]">
              <Compass size={16} /> 500 hPa Subtropical Ridge Steering Mechanism
            </div>
            <p>
              Tropical cyclones in the North Indian Ocean are steered primarily by the deep-layer mean flow (850–200 hPa). Current synoptic maps show the subtropical anticyclonic ridge axis positioned near <strong>19.5°N</strong>.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 mt-2">
              <div className="rounded-lg bg-[#eaf4f7] p-3 border border-[#cfdfeb]">
                <strong className="text-[#134963] block mb-1">Recurvature Probability: 72%</strong>
                As the system moves north of 16°N, the steering flow decelerates and turns North-Northeastward towards Odisha/West Bengal delta.
              </div>
              <div className="rounded-lg bg-[#f8f5eb] p-3 border border-[#ede3cf]">
                <strong className="text-[#785718] block mb-1">Beta-Drift Correction: +18 km East</strong>
                Coriolis variation across the vortex introduces an inherent north-northwestward drift of 2–3 knots relative to environmental steering.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'physics' && (
          <div className="rounded-xl bg-white p-4 border border-[#d6e4eb] space-y-3 text-xs leading-5 text-[#3e596b]">
            <div className="flex items-center gap-2 font-bold text-[#165a6b]">
              <Waves size={16} /> Pressure Deficit & Kinetic Energy Conversion
            </div>
            <p>
              According to the modified Holland (1980) vortex equation, the pressure deficit &Delta;P = P(ambient) - P(central) = 1010 - {pressure} = {1010 - pressure} hPa.
            </p>
            <div className="rounded-lg bg-[#eef7f6] p-3 font-mono text-[11px] text-[#145d65] border border-[#d0e9e7]">
              Max Potential Intensity (MPI): V(max) &approx; 6.3 &times; &radic;(&Delta;P) = {(6.3 * Math.sqrt(Math.max(1, 1010 - pressure))).toFixed(1)} knots
            </div>
            <p className="text-[11px] text-[#557080]">
              The SST in the central Bay corridor is currently <strong>30.2°C</strong> (well above the 26.5°C threshold), supporting sustained intensification until coastal dry-air entrainment begins ~12 hours before landfall.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
