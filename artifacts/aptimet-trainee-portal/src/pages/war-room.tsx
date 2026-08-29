import {
  ArrowLeft, ArrowRight, Check, CircleHelp, CloudLightning,
  GripVertical, Radio, RotateCcw, Send, ShieldAlert,
  Thermometer, TimerReset, Wind, ChevronUp, ChevronDown,
  ShieldCheck, HeartHandshake, IndianRupee, Users, FileText
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { scenario } from "@/mockData/scenario.js";
import { getCourse } from "@/mockData/courses";
import { submitWarzoneSessionApi } from "@/lib/api";
import { HowThisWorksButton } from "@/components/ui/HowThisWorksModal";

type Decision = { type: string; input: unknown; subScore: number; feedback: string };

const rainDrops = Array.from({ length: 72 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 11) * 0.23}s`,
  duration: `${1.5 + (i % 5) * 0.35}s`,
  height: `${10 + (i % 4) * 4}px`,
}));

const flow = [
  { type: "info", key: "i1" },
  { type: "mcq", key: "m1" },
  { type: "info", key: "i2" },
  { type: "allocation", key: "a1" },
  { type: "info", key: "i3" },
  { type: "ranking", key: "r1" },
  { type: "info", key: "i4" },
  { type: "freetext", key: "f1" },
  { type: "info", key: "i5" },
];

export default function WarRoom() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(360);
  const [finished, setFinished] = useState(false);

  const item = flow[step];
  const intensity = Math.min(10, Math.round((step / (flow.length - 1)) * 10));

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, finished]);

  useEffect(() => {
    if (item?.type !== "info" && !finished) setRunning(false);
  }, [step, item, finished]);

  useEffect(() => {
    if (!running || finished || !item || item.type !== "info") return;
    const t = window.setTimeout(() => {
      if (step < flow.length - 1) setStep(step + 1);
      else {
        setFinished(true);
      }
    }, 2500);
    return () => window.clearTimeout(t);
  }, [step, running, finished, item]);

  const submitDecision = (decision: Decision) => {
    const updatedDecisions = [...decisions, decision];
    setDecisions(updatedDecisions);
    if (step < flow.length - 1) {
      setStep(step + 1);
      setRunning(true);
    } else {
      setFinished(true);
      const totalScore = updatedDecisions.reduce((sum, d) => sum + d.subScore, 0);
      submitWarzoneSessionApi(updatedDecisions, totalScore);
    }
  };

  const restart = () => {
    setStep(0);
    setDecisions([]);
    setSeconds(360);
    setFinished(false);
    setRunning(true);
  };

  return (
    <div
      className="min-h-[100dvh] overflow-hidden text-[#183743] relative"
      style={{
        background: `hsl(${190 - intensity * 2} ${Math.max(18, 32 - intensity * 1.1)}% ${Math.max(13, 90 - intensity * 6.2)}%)`,
        transition: "background 1.4s ease-out",
      }}
    >
      {/* Dynamic Rain & Wave Canvas Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[.13]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 42px, rgba(255,255,255,.55) 43px 45px, transparent 46px 78px)",
            transform: `translateX(${intensity * -10}px)`,
            transition: "transform 1.4s ease-out",
          }}
        />
        {rainDrops.map((drop, i) => (
          <i
            key={i}
            className="absolute top-[-25px] w-px bg-[#d9eeec]"
            style={{
              left: drop.left,
              height: drop.height,
              opacity: Math.max(0.08, (intensity / 10) * 0.65),
              animation: `rain-fall ${drop.duration} linear ${drop.delay} infinite`,
            }}
          />
        ))}
        <svg className="absolute bottom-0 left-0 h-[35vh] w-full opacity-25" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path
            d="M0 235 C120 210 155 250 260 221 C360 190 420 230 510 206 C615 177 681 234 780 206 C890 173 935 196 1000 172 C1080 143 1134 182 1200 130 L1200 300 L0 300Z"
            fill="#183743"
          />
          <path
            d="M0 256 C140 228 190 274 310 242 C414 215 508 260 610 229 C740 190 822 250 930 213 C1030 178 1122 232 1200 182"
            fill="none"
            stroke="#d9eeec"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#183743]/15 bg-[#dbe9e4]/65 px-5 py-4 backdrop-blur-md md:px-8">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 rounded-lg text-sm font-semibold hover:opacity-75 focus-ring"
          data-testid="button-exit-war-room"
        >
          <ArrowLeft size={17} /> Exit Simulation
        </button>
        <div className="hidden items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em] md:flex">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#b85042]" /> Simulation Live Mode
          </span>
          <span className="opacity-35">/</span>
          <span>Bay of Bengal · Regional Ops Cell 04</span>
        </div>
        <div className="flex items-center gap-3">
          <HowThisWorksButton featureKey="disaster" size="sm" />
          <div
            className="flex items-center gap-2 rounded-lg bg-[#183743] px-3.5 py-2 font-mono-ui text-sm text-[#f0c477] shadow-sm"
            data-testid="text-simulation-timer"
          >
            <TimerReset size={15} /> T-{String(Math.floor(seconds / 3600)).padStart(2, "0")}:
            {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
          </div>
        </div>
      </header>

      {/* Main Simulation View or Final Scorecard */}
      {!finished ? (
        <main className="relative z-10 mx-auto grid max-w-[1500px] gap-6 px-5 py-6 lg:grid-cols-[1fr_390px] lg:px-8 lg:py-8">
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] opacity-65">
                  AptiMet Operational Lab / {scenario.subtitle}
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold leading-none md:text-5xl">
                  {scenario.title}
                  <span className="text-[#b85042]">.</span>
                </h1>
              </div>
              <div className="flex items-center gap-6">
                <Stat icon={<Wind size={16} />} value={`${62 + intensity * 18} km/h`} label="surface wind" />
                <Stat icon={<Thermometer size={16} />} value={`${1002 - intensity * 7} hPa`} label="central pressure" />
              </div>
            </div>

            {/* Simulated Radar Track Visualizer */}
            <div className="relative mt-7 min-h-[300px] overflow-hidden rounded-[24px] border border-[#183743]/15 bg-[#183743]/[.1] p-6 md:min-h-[380px]">
              <div className="absolute right-[12%] top-[19%] h-44 w-44 rounded-full border border-[#f0c477]/30 md:h-64 md:w-64" />
              <div className="absolute right-[16%] top-[28%] h-28 w-28 animate-breathe rounded-full border-2 border-[#f0c477]/60 md:h-40 md:w-40" />
              <div
                className="absolute right-[19%] top-[34%] grid h-16 w-16 place-items-center rounded-full border-2 border-[#b85042] bg-[#b85042]/20 shadow-[0_0_45px_rgba(184,80,66,.35)] transition-all duration-1000 md:h-24 md:w-24"
                style={{ transform: `translateX(${intensity * -15}px) translateY(${intensity * 7}px)` }}
              >
                <span className="font-mono-ui text-[9px] font-bold text-[#b85042]">EYE WALL</span>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-widest opacity-75">
                <span className="h-2 w-2 rounded-full bg-[#b85042]" /> Track projection · Paradip Coastline
              </div>
              <div className="absolute left-6 top-6 max-w-[220px]">
                <p className="font-mono-ui text-[10px] uppercase tracking-widest opacity-60">Storm Intensity</p>
                <p className="mt-2 font-display text-5xl font-semibold">
                  {intensity}
                  <span className="text-lg opacity-40"> / 10</span>
                </p>
              </div>
              <svg className="absolute bottom-0 right-0 h-full w-3/5 opacity-60" viewBox="0 0 560 360">
                <path
                  d="M510 0 C468 52 510 85 464 124 C430 154 462 206 419 238 C382 268 413 311 370 360"
                  fill="none"
                  stroke="#f0c477"
                  strokeWidth="2"
                  strokeDasharray="7 10"
                />
                <path
                  d="M560 0 C518 58 558 88 508 130 C475 159 505 210 461 249 C427 277 448 322 418 360"
                  fill="none"
                  stroke="#183743"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Current Event Frame */}
            <div className="mt-5 rounded-[24px] border border-[#183743]/15 bg-[#edf5f1]/75 p-6 backdrop-blur-sm md:p-8">
              {item.type === "info" && (
                <InfoEvent
                  data={scenario.info.find((e) => e.id === item.key)!}
                  onSkip={() => {
                    if (step < flow.length - 1) setStep(step + 1);
                    else setFinished(true);
                  }}
                />
              )}
              {item.type === "mcq" && <McqEvent data={scenario.mcq} onSubmit={submitDecision} />}
              {item.type === "allocation" && <AllocationEvent data={scenario.allocation} onSubmit={submitDecision} />}
              {item.type === "ranking" && <RankingEvent data={scenario.ranking} onSubmit={submitDecision} />}
              {item.type === "freetext" && <FreetextEvent data={scenario.freetext} onSubmit={submitDecision} />}
            </div>
          </section>

          <Timeline current={step} />
        </main>
      ) : (
        <Scorecard decisions={decisions} onRestart={restart} onExit={() => setLocation("/")} />
      )}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-1.5 text-sm font-semibold">{icon}{value}</div>
      <p className="mt-1 font-mono-ui text-[9px] uppercase tracking-widest opacity-60">{label}</p>
    </div>
  );
}

function InfoEvent({
  data,
  onSkip,
}: {
  data: { at: string; title: string; body: string; tag: string };
  onSkip: () => void;
}) {
  return (
    <div className="animate-rise-in">
      <div className="flex items-center gap-3">
        <span className="font-mono-ui text-[10px] tracking-widest text-[#b85042] font-bold">{data.at}</span>
        <span className="h-px w-8 bg-[#183743]/20" />
        <span className="font-mono-ui text-[10px] tracking-widest opacity-60">{data.tag}</span>
      </div>
      <h2 className="mt-4 font-display text-3xl font-semibold text-[#183743]">{data.title}</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#284955]">{data.body}</p>
      <div className="mt-6 flex items-center gap-3 text-xs text-[#3b5d69]">
        <Radio size={15} className="text-[#b85042] animate-pulse" /> Reading incoming meteorological bulletin automatically...
        <span className="ml-auto hidden sm:block font-mono-ui text-[10px]">Auto-advancing in 2.5s</span>
      </div>
      <button
        onClick={onSkip}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#183743] underline decoration-[#f0c477] decoration-2 underline-offset-4 focus-ring"
        data-testid={`button-continue-info-${data.at}`}
      >
        Continue Now <ArrowRight size={15} />
      </button>
    </div>
  );
}

function DecisionFrame({
  at,
  title,
  prompt,
  category,
  children,
}: {
  at: string;
  title: string;
  prompt: string;
  category: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-rise-in">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono-ui text-[10px] tracking-widest text-[#b85042] font-bold">{at}</span>
        <span className="h-px w-8 bg-[#183743]/20" />
        <span className="font-mono-ui text-[10px] tracking-widest opacity-60">{category} · Decision Point</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#183743]">{title}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#2c4e5a]">{prompt}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-[#b85042]/10 px-3 py-1.5 font-mono-ui text-[10px] text-[#b85042] font-bold">
          <CircleHelp size={13} /> Immediate action required
        </span>
      </div>
      {children}
    </div>
  );
}

function McqEvent({
  data,
  onSubmit,
}: {
  data: typeof scenario.mcq;
  onSubmit: (d: Decision) => void;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <DecisionFrame at={data.at} title={data.title} prompt={data.prompt} category={data.category}>
      <div className="mt-6 grid gap-2.5">
        {data.options.map((option, i) => (
          <button
            key={option}
            onClick={() => setChoice(i)}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors focus-ring ${
              choice === i
                ? "border-[#b85042] bg-[#b85042]/10 font-semibold text-[#183743]"
                : "border-[#183743]/15 bg-[#f7fbf8]/70 hover:border-[#183743]/35 text-[#2c4e5a]"
            }`}
            data-testid={`button-mcq-option-${i}`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono-ui text-xs font-bold ${
                choice === i ? "bg-[#b85042] text-white" : "bg-[#183743]/[.08] text-[#183743]"
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>
      <button
        disabled={choice === null}
        onClick={() =>
          onSubmit({
            type: "mcq",
            input: data.options[choice!],
            subScore: choice === data.answer ? data.score : 0,
            feedback: data.feedback,
          })
        }
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#183743] px-6 py-3 text-sm font-semibold text-[#f7fbf8] disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90 transition-opacity focus-ring"
        data-testid="button-submit-mcq"
      >
        Lock My Decision <Check size={16} />
      </button>
    </DecisionFrame>
  );
}

function AllocationEvent({
  data,
  onSubmit,
}: {
  data: typeof scenario.allocation;
  onSubmit: (d: Decision) => void;
}) {
  const [values, setValues] = useState([20, 35, 35, 10]);
  const total = values.reduce((a, b) => a + b, 0);
  const score = Math.max(0, data.score - values.reduce((a, v, i) => a + Math.abs(v - data.recommended[i]), 0) / 2);

  return (
    <DecisionFrame at={data.at} title={data.title} prompt={data.prompt} category={data.category}>
      <div className="mt-6 space-y-3">
        {data.zones.map((zone, i) => (
          <label key={zone} className="flex items-center gap-4 rounded-xl border border-[#183743]/15 bg-[#f7fbf8]/70 p-3">
            <span className="w-28 text-sm font-semibold sm:w-40 text-[#183743]">{zone}</span>
            <input
              aria-label={`${zone} allocation`}
              data-testid={`input-allocation-${i}`}
              type="range"
              min="0"
              max="70"
              value={values[i]}
              onChange={(e) => setValues(values.map((v, j) => (j === i ? Number(e.target.value) : v)))}
              className="flex-1 accent-[#b85042]"
            />
            <span className="w-12 rounded-md bg-[#183743]/[.08] py-2 text-center font-mono-ui text-xs font-bold text-[#183743]">
              {values[i]}
            </span>
          </label>
        ))}
      </div>
      <div
        className={`mt-5 flex items-center justify-between rounded-xl p-4 font-mono-ui text-xs font-bold ${
          total === 100 ? "bg-[#2d806f]/15 text-[#246957]" : "bg-[#b85042]/10 text-[#b85042]"
        }`}
      >
        <span>Total Capacity Allocated</span>
        <strong>{total} / 100 Points</strong>
      </div>
      <button
        disabled={total !== 100}
        onClick={() =>
          onSubmit({
            type: "allocation",
            input: values,
            subScore: Math.round(score),
            feedback:
              total === 100 && values[2] < 25
                ? `${data.feedback} South Zone was under-allocated, cascading into fuel constraints in subsequent updates.`
                : data.feedback,
          })
        }
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#183743] px-6 py-3 text-sm font-semibold text-[#f7fbf8] disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90 transition-opacity focus-ring"
        data-testid="button-submit-allocation"
      >
        Submit Exact Resource Budget <Send size={16} />
      </button>
    </DecisionFrame>
  );
}

function RankingEvent({
  data,
  onSubmit,
}: {
  data: typeof scenario.ranking;
  onSubmit: (d: Decision) => void;
}) {
  const [items, setItems] = useState(data.items);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const copy = [...items];
    [copy[from], copy[to]] = [copy[to], copy[from]];
    setItems(copy);
  };
  const score = items.reduce((sum, item, i) => sum + (item === data.recommended[i] ? 6.25 : 0), 0);

  return (
    <DecisionFrame at={data.at} title={data.title} prompt={data.prompt} category={data.category}>
      <div className="mt-6 space-y-2">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-3 rounded-xl border border-[#183743]/15 bg-[#f7fbf8]/70 p-3.5">
            <GripVertical size={16} className="opacity-35" />
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f0c477]/40 font-mono-ui text-xs font-bold text-[#183743]">
              {i + 1}
            </span>
            <button
              onClick={() => move(i, 0)}
              className="flex-1 cursor-pointer text-left text-sm font-semibold text-[#183743] hover:text-[#b85042] focus-ring"
              data-testid={`button-rank-item-${i}`}
            >
              {item}
            </button>
            <button
              onClick={() => move(i, i - 1)}
              disabled={i === 0}
              className="rounded-md p-1.5 opacity-60 hover:bg-[#183743]/10 disabled:opacity-20 focus-ring"
              aria-label={`Move ${item} up`}
              data-testid={`button-rank-up-${i}`}
            >
              <ChevronUp size={15} />
            </button>
            <button
              onClick={() => move(i, i + 1)}
              disabled={i === items.length - 1}
              className="rounded-md p-1.5 opacity-60 hover:bg-[#183743]/10 disabled:opacity-20 focus-ring"
              aria-label={`Move ${item} down`}
              data-testid={`button-rank-down-${i}`}
            >
              <ChevronDown size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          onSubmit({
            type: "ranking",
            input: items,
            subScore: Math.round(score),
            feedback: data.feedback,
          })
        }
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#183743] px-6 py-3 text-sm font-semibold text-[#f7fbf8] hover:opacity-90 transition-opacity focus-ring"
        data-testid="button-submit-ranking"
      >
        Confirm Action Sequence <Check size={16} />
      </button>
    </DecisionFrame>
  );
}

function FreetextEvent({
  data,
  onSubmit,
}: {
  data: typeof scenario.freetext;
  onSubmit: (d: Decision) => void;
}) {
  const [text, setText] = useState("");
  const [left, setLeft] = useState(90);

  useEffect(() => {
    const timer = window.setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (left === 0) {
      onSubmit({
        type: "freetext",
        input: text,
        subScore: scoreText(text, data.keywords, data.score),
        feedback: data.feedback,
      });
    }
  }, [left]);

  return (
    <DecisionFrame at={data.at} title={data.title} prompt={data.prompt} category={data.category}>
      <div className="mt-6">
        <div className="flex items-center justify-between font-mono-ui text-[10px] uppercase tracking-wider opacity-65">
          <span>Incoming Night Desk Briefing</span>
          <span className={left < 20 ? "text-[#b85042] font-bold animate-pulse" : "font-bold"}>
            Time Remaining: 00:{String(left).padStart(2, "0")}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={320}
          rows={5}
          placeholder="Brief the incoming shift desk on system hazard, evacuation priorities, and central pressure trends to watch..."
          className="mt-3 w-full resize-none rounded-xl border border-[#183743]/15 bg-[#f7fbf8]/85 p-4 text-sm leading-6 outline-none transition-colors placeholder:text-[#183743]/35 focus:border-[#b85042] focus:ring-2 focus:ring-[#b85042]/20"
          data-testid="textarea-handover"
        />
        <div className="mt-2 text-right font-mono-ui text-[10px] opacity-55">{text.length} / 320 characters</div>
      </div>
      <button
        disabled={!text.trim() || left === 0}
        onClick={() =>
          onSubmit({
            type: "freetext",
            input: text,
            subScore: scoreText(text, data.keywords, data.score),
            feedback: data.feedback,
          })
        }
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#183743] px-6 py-3 text-sm font-semibold text-[#f7fbf8] disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90 transition-opacity focus-ring"
        data-testid="button-submit-handover"
      >
        Transmit Shift Handover <Send size={16} />
      </button>
    </DecisionFrame>
  );
}

function scoreText(text: string, keywords: string[], max: number) {
  const lower = text.toLowerCase();
  const hit = keywords.filter((k) => lower.includes(k)).length;
  return Math.round(Math.min(max, (hit / Math.max(1, keywords.length)) * max * 1.15));
}

function Timeline({ current }: { current: number }) {
  return (
    <aside className="rounded-[24px] border border-[#183743]/15 bg-[#edf5f1]/65 p-5 backdrop-blur-sm lg:sticky lg:top-6 lg:self-start">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-widest opacity-60">Operations Log</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-[#183743]">Incoming Signals</h2>
        </div>
        <CloudLightning size={20} className="text-[#b85042]" />
      </div>
      <div className="relative mt-6 space-y-1">
        {flow.map((entry, i) => (
          <div
            key={entry.key}
            className={`relative flex gap-3 rounded-xl p-3 transition-colors ${
              i === current ? "bg-[#183743]/[.08]" : ""
            }`}
          >
            <div className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border border-[#183743]/30 bg-[#edf5f1]">
              {i < current && <span className="absolute inset-0 rounded-full bg-[#2d806f]" />}
            </div>
            <div className="min-w-0">
              <p
                className={`font-mono-ui text-[9px] uppercase tracking-wider ${
                  i === current ? "text-[#b85042] font-bold" : "opacity-45"
                }`}
              >
                {entry.type === "info" ? "Situation report" : "Decision point"} · {i + 1}
              </p>
              <p className={`mt-1 text-sm ${i === current ? "font-semibold text-[#183743]" : "opacity-60"}`}>
                {labelFor(entry.key)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f0c477]/20 p-3 text-xs leading-5 text-[#183743]/80">
        <ShieldAlert size={16} className="shrink-0 text-[#b85042]" />
        Decisions pause the live timeline. Take the time you need to analyze the data.
      </div>
    </aside>
  );
}

function labelFor(key: string) {
  const all = [...scenario.info, scenario.mcq, scenario.allocation, scenario.ranking, scenario.freetext];
  return all.find((e) => e.id === key)?.title ?? "Incoming signal";
}

function Scorecard({
  decisions,
  onRestart,
  onExit,
}: {
  decisions: Decision[];
  onRestart: () => void;
  onExit: () => void;
}) {
  const [, setLocation] = useLocation();
  const total = decisions.reduce((sum, d) => sum + d.subScore, 0);
  const categories = ["Forecasting", "Emergency planning", "Communication", "Situational awareness"];
  const byCategory = categories.map((category) => {
    const found = decisions.find(
      (d) =>
        d.type ===
        (category === "Forecasting"
          ? "mcq"
          : category === "Emergency planning"
          ? "allocation"
          : category === "Communication"
          ? "ranking"
          : "freetext")
    );
    return {
      category,
      score: found?.subScore ?? 0,
      max: category === "Situational awareness" ? 30 : category === "Forecasting" ? 20 : category === "Emergency planning" ? 25 : 25,
    };
  });

  const weakest = [...byCategory].sort((a, b) => a.score / a.max - b.score / b.max)[0];

  return (
    <main className="relative z-10 mx-auto max-w-[1100px] px-5 py-12 md:px-8 animate-rise-in">
      <div className="text-center">
        <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b85042] font-bold">
          Simulation Complete · Operational Incident Debrief
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold md:text-6xl text-[#183743]">
          Your Decision Scorecard<span className="text-[#b85042]">.</span>
        </h1>
        <div className="mx-auto mt-8 grid h-36 w-36 place-items-center rounded-full border-[8px] border-[#f0c477] bg-[#183743] text-center text-[#f7fbf8] shadow-lg">
          <div>
            <span className="font-display text-4xl font-semibold">{total}</span>
            <span className="block font-mono-ui text-[9px] uppercase tracking-widest opacity-60">out of 100</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-4">
        {byCategory.map((item) => (
          <div key={item.category} className="rounded-2xl border border-[#183743]/15 bg-[#edf5f1]/80 p-4">
            <p className="text-xs font-semibold opacity-70 text-[#183743]">{item.category}</p>
            <p className="mt-3 font-display text-2xl font-semibold text-[#183743]">
              {item.score}
              <span className="text-sm opacity-40"> / {item.max}</span>
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-[#183743]/10">
              <div
                className="h-full rounded-full bg-[#2d806f]"
                style={{ width: `${Math.min(100, (item.score / item.max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Feature B4: Disaster-Ready Evacuation & Cost/Lives-Saved Model */}
      <div className="mt-6 rounded-[24px] border border-[#183743]/15 bg-[#edf5f1]/90 p-6 md:p-8 panel-shadow text-[#183743]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183743]/15 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#227263]">
              <HeartHandshake size={13} /> Disaster-Ready Humanitarian & Economic Scorecard
            </span>
            <h3 className="text-xl font-bold font-display text-[#183743] mt-1">
              State EOC Situation Report (SitRep)
            </h3>
          </div>
          <HowThisWorksButton featureKey="disaster" size="sm" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 border border-[#183743]/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64808c] flex items-center gap-1">
              <Users size={12} /> Estimated Lives Protected
            </span>
            <p className="mt-2 font-display text-2xl font-bold text-[#1e6f5c]">
              ~{Math.round(420000 * (total / 100) * 0.042).toLocaleString()} Citizens
            </p>
            <p className="mt-1 text-[11px] text-[#55717d]">
              91.4% evacuation compliance in high-risk surge sectors
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#183743]/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64808c] flex items-center gap-1">
              <IndianRupee size={12} /> Total Relief Allocation
            </span>
            <p className="mt-2 font-display text-2xl font-bold text-[#183743]">
              ₹ 142.50 Lakhs
            </p>
            <p className="mt-1 text-[11px] text-[#55717d]">
              34 multi-purpose cyclone shelters fully provisioned
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#183743]/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64808c] flex items-center gap-1">
              <ShieldCheck size={12} /> Zero-Casualty Protocol
            </span>
            <p className="mt-2 font-display text-2xl font-bold text-[#145d7d]">
              {total >= 80 ? "Fully Achieved" : "Substantial Mitigation"}
            </p>
            <p className="mt-1 text-[11px] text-[#55717d]">
              SOP timely warning threshold passed with IMD CWD
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] bg-[#183743] p-6 text-[#f7fbf8] md:p-8 shadow-md">
        <p className="font-mono-ui text-[10px] uppercase tracking-widest text-[#f0c477] font-bold">Recommended Remediation</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Strengthen {weakest.category.toLowerCase()} competency before your next shift.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f7fbf8]/70">
          You made decisive calls under pressure. Revisit one focused learning pathway, then replay this simulation with a different resource allocation to observe downstream effects on evacuation readiness.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {["synoptic", "communication"].map((id) => {
            const course = getCourse(id);
            return (
              course && (
                <button
                  key={id}
                  onClick={() => setLocation(`/courses/${id}`)}
                  className="rounded-lg bg-[#f7fbf8]/15 px-3.5 py-2 text-xs font-semibold text-[#f0c477] hover:bg-[#f7fbf8]/25 transition-colors focus-ring"
                  data-testid={`button-recommended-${id}`}
                >
                  {course.title} <ArrowRight className="ml-1 inline" size={13} />
                </button>
              )
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl font-semibold text-[#183743]">Itemized Operational Decision Log</h2>
        <div className="mt-4 space-y-3">
          {decisions.map((decision, index) => (
            <div key={`${decision.type}-${index}`} className="rounded-2xl border border-[#183743]/15 bg-[#edf5f1]/80 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-ui text-[10px] uppercase tracking-wider opacity-60 font-bold">
                  Stage 0{index + 1} · {decision.type}
                </span>
                <span className="font-mono-ui text-xs font-bold text-[#2d806f]">+{decision.subScore} pts</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#183743]">
                {typeof decision.input === "string" ? decision.input : JSON.stringify(decision.input)}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-[#3b5d69]">{decision.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl bg-[#183743] px-6 py-3 text-sm font-semibold text-[#f7fbf8] hover:opacity-90 transition-opacity focus-ring"
          data-testid="button-replay-simulation"
        >
          <RotateCcw size={16} /> Replay Simulation
        </button>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-xl border border-[#183743]/30 px-6 py-3 text-sm font-semibold text-[#183743] hover:bg-[#183743]/[.06] transition-colors focus-ring"
          data-testid="button-return-dashboard"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    </main>
  );
}
