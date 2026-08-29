import { ReactNode, useState } from 'react';
import { useLocation, Link } from 'wouter';
import {
  Activity, ArrowRight, ArrowUpRight, Award,
  ChevronRight, Clock3, FileText, Play, Sparkles, Target, Compass, CloudRain,
  Trophy, MapPin, Radio, ShieldCheck
} from 'lucide-react';
import { PolarAngleAxis, PolarGrid, RadarChart, Radar as RadarShape, ResponsiveContainer } from 'recharts';
import { courses, Course } from '@/mockData/courses';
import { radarData } from '@/mockData/skillGaps';
import { notifications } from '@/mockData/notifications';
import { EloLeaderboardModal } from '@/components/features/EloLeaderboardModal';
import { GroundReportsHub } from '@/components/features/GroundReportsHub';
import { AlertBroadcastModal } from '@/components/features/AlertBroadcastModal';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

function SectionHeading({ eyebrow, title, action, className }: { eyebrow?: string; title: string; action?: ReactNode; className?: string }) {
  return (
    <div className={`${className ?? 'mb-4'} flex items-end justify-between gap-3`}>
      <div>
        {eyebrow && <div className="tiny-label mb-1">{eyebrow}</div>}
        <h2 className="text-[17px] font-bold tracking-[-.02em] text-[#203a52]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const [, setLocation] = useLocation();
  return (
    <div
      className="panel-shadow group overflow-hidden rounded-xl border border-[#d6e0e7] bg-white transition-all hover:-translate-y-0.5"
      data-testid={`card-course-${course.id}`}
    >
      <button
        onClick={() => setLocation(`/courses/${course.id}`)}
        className="block w-full text-left"
        data-testid={`button-open-course-${course.id}`}
      >
        <div
          className="relative h-[94px] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${course.color} 0%, #d9e8ed 100%)` }}
        >
          <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border-[18px] border-white/20" />
          <div className="absolute bottom-3 left-4 max-w-[80%] text-[11px] font-bold uppercase tracking-[.1em] text-white/90">
            {course.category}
          </div>
          {course.progress > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-[#c6efed] px-2 py-0.5 text-[10px] font-bold text-[#1e6b73]">
              In progress
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate text-[14px] font-bold text-[#21384d]">{course.title}</h3>
          <p className="mt-1 text-[11px] text-[#70808e]">{course.trainer}</p>
          <div className="mt-3 flex justify-between text-[10px] font-semibold text-[#687b8b]">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-[#e6eaed]">
            <div className="h-full rounded-full bg-[#137c7e]" style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [eloOpen, setEloOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-6 md:pb-10 md:px-8 space-y-6">
      {/* Welcome Banner */}
      <div className="rise flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="tiny-label mb-1">Thursday Briefing · Operations Cycle 04</div>
          <h1 className="text-[28px] font-bold tracking-[-.04em] text-[#124b78] md:text-[30px]">
            Welcome back, Ananya
          </h1>
          <p className="mt-1 text-sm text-[#667887]">
            Here is your active operational training status and upcoming simulation readiness.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-[#d3dfe7] bg-white px-4 py-2.5 panel-shadow">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e2f2f0] text-[#167876]">
              <CloudRain size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#738592]">Training rhythm</p>
              <p className="text-sm font-bold text-[#1f3d53]">4 day streak</p>
            </div>
            <Sparkles size={16} className="text-[#d8973d]" />
          </div>

          <div
            onClick={() => setEloOpen(true)}
            className="cursor-pointer flex items-center gap-3 rounded-xl border border-[#b7ded9] bg-[#eef8f7] px-4 py-2.5 panel-shadow hover:bg-[#e2f3f1] transition-all"
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#146b71] text-white">
              <Trophy size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#146b71]">Live ELO Ranking</p>
              <p className="text-sm font-bold text-[#14476c]">1460 ELO · #2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => setEloOpen(true)}
          className="rounded-xl border border-[#d6e3ea] bg-white p-4 text-left panel-shadow hover:border-[#146b71] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e2f0f8] text-[#164d78]">
              <Trophy size={19} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1e3e52]">ELO Duel Leaderboard</h3>
              <p className="text-[10px] text-[#6b8292]">Compare ratings against IMD colleagues</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#899ca8]" />
        </button>

        <button
          onClick={() => setReportsOpen(true)}
          className="rounded-xl border border-[#d6e3ea] bg-white p-4 text-left panel-shadow hover:border-[#146b71] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e3f4f4] text-[#146b71]">
              <MapPin size={19} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1e3e52]">Citizen Ground Reports</h3>
              <p className="text-[10px] text-[#6b8292]">Geotagged spotter damage observations</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#899ca8]" />
        </button>

        <button
          onClick={() => setBroadcastOpen(true)}
          className="rounded-xl border border-[#d6e3ea] bg-white p-4 text-left panel-shadow hover:border-[#b85042] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffece8] text-[#b85042]">
              <Radio size={19} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1e3e52]">Emergency Fan-Out</h3>
              <p className="text-[10px] text-[#6b8292]">SMS & WhatsApp mass broadcast</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#899ca8]" />
        </button>
      </div>

      {/* Feature Differentiators Promo Banners */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <Link
          href="/war-room"
          data-testid="link-banner-warroom"
          className="group relative min-h-[200px] overflow-hidden rounded-2xl bg-[#143d54] p-6 text-white panel-shadow transition-transform hover:-translate-y-0.5"
        >
          <div className="absolute -right-8 -top-12 h-60 w-60 rounded-full border border-[#86d4cf]/20 transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute -right-16 top-4 h-72 w-72 rounded-full border border-[#86d4cf]/10" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-full bg-[#b85042]/20 border border-[#b85042]/40 px-3 py-1 font-mono-ui text-[10px] font-bold uppercase tracking-wider text-[#ffb0a3]">
                <Activity size={13} className="text-[#ff7460] animate-pulse" /> Live Simulation Mode
              </span>
              <ArrowUpRight className="text-[#87deda] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
            </div>
            <div className="my-4">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl font-display">
                Cyclone War Zone <span className="text-[#87deda]">Simulation</span>
              </h2>
              <p className="mt-1.5 max-w-lg text-xs leading-5 text-[#b0cbcf]">
                Experience a live Bay of Bengal rapid intensification event. Make 4 critical calls under time pressure and receive an explainable operational scorecard.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#87deda]">Launch live decision room →</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#87deda] text-[#143d54] shadow-md transition-transform group-hover:scale-105">
                <Play fill="currentColor" size={14} className="ml-0.5" />
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/forecast-duel"
          data-testid="link-banner-forecast-duel"
          className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d2dfdf] bg-[#eef7f7] p-6 panel-shadow transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <span className="rounded-full bg-white px-2.5 py-1 font-mono-ui text-[10px] font-bold uppercase tracking-wider text-[#2e7479]">
              Historical Practice Lab
            </span>
            <ArrowUpRight className="text-[#2e7479] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={19} />
          </div>
          <div className="my-2">
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4edec] text-[#196e74]">
              <Compass size={20} />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1f3f4c]">Forecast Duels</h3>
            <p className="mt-1 text-xs leading-5 text-[#5e777f]">
              Test your judgement against historical extremes: Phailin 2013, Fani 2019, and Tauktae 2021.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a6e75]">
            Enter the archive <ArrowRight size={13} />
          </div>
        </Link>
      </div>

      {/* Grid Layout: Main Progress Area vs Sidebar Activity */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          {/* Enrolled Courses */}
          <section className="rise-2">
            <SectionHeading
              title="Enrolled Pathways"
              action={
                <button
                  onClick={() => setLocation('/catalog')}
                  data-testid="button-view-all-courses"
                  className="text-xs font-bold text-[#176b8a] hover:underline flex items-center gap-1"
                >
                  View All Catalog <ChevronRight size={14} />
                </button>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.filter((c) => c.progress > 0 || c.id === 'numerical').map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>

          {/* Skill Radar Snapshot */}
          <section className="rise-3 rounded-xl border border-[#d6e0e7] bg-white p-5 panel-shadow">
            <SectionHeading
              className="mb-2"
              title="Skill Competency Radar"
              action={
                <button
                  onClick={() => setLocation('/skills')}
                  data-testid="button-take-assessment"
                  className="rounded-md border border-[#6aaeb3] px-3 py-1.5 text-[11px] font-bold text-[#23727b] hover:bg-[#edf8f7] transition-colors"
                >
                  Full Assessment
                </button>
              }
            />
            <div className="grid items-center gap-5 sm:grid-cols-[200px_1fr]">
              <div className="mx-auto h-[160px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#c5d5db" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: '#657887' }} />
                    <RadarShape name="Current" dataKey="current" stroke="#12757b" fill="#7fd1cb" fillOpacity={0.3} strokeWidth={2} />
                    <RadarShape name="Target" dataKey="target" stroke="#b5c4cb" fill="transparent" strokeDasharray="4 3" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2.5">
                {[
                  ['Data Analysis', 'Proficient', '#137c7e', '78/90 pts'],
                  ['Forecasting', 'Intermediate', '#137c7e', '61/88 pts'],
                  ['Modelling', 'Priority Gap', '#d49c56', '38/72 pts'],
                  ['Climatology', 'Developing', '#7c8790', '42/78 pts'],
                ].map(([skill, level, color, score]) => (
                  <div key={skill} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      <span className="font-semibold text-[#324b5e]">{skill}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#718491]">{level}</span>
                      <span className="font-mono text-[10px] font-bold text-[#456173]">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recommended Courses */}
          <section>
            <SectionHeading title="Recommended to close gaps" />
            <div className="grid gap-3 sm:grid-cols-3">
              {courses.slice(2, 5).map((c) => (
                <button
                  onClick={() => setLocation(`/courses/${c.id}`)}
                  key={c.id}
                  data-testid={`button-recommendation-${c.id}`}
                  className="panel-shadow flex items-center gap-3 rounded-xl border border-[#d6e0e7] bg-white p-3.5 text-left transition-all hover:-translate-y-0.5"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white" style={{ background: c.color }}>
                    <FileText size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-[#294157]">{c.title}</div>
                    <div className="mt-1 text-[10px] text-[#728392]">
                      {c.duration} · {c.level}
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-[#7f909d]" />
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Announcements & Readiness */}
        <aside className="space-y-5">
          <div className="rounded-xl border border-[#d6e0e7] bg-white p-4 panel-shadow">
            <div className="mb-4 rounded-lg border border-[#f0bbb3] bg-[#ffe0da] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#a4463b]">Active simulation</span>
                <span className="h-2 w-2 rounded-full bg-[#a4463b] animate-ping" />
              </div>
              <button
                onClick={() => setLocation('/war-room')}
                data-testid="button-enter-simulation"
                className="mt-2 text-xs font-bold text-[#9d4037] hover:underline flex items-center gap-1"
              >
                Enter Cyclone War Room <ArrowRight size={13} />
              </button>
            </div>

            <SectionHeading title="Recent Announcements" />
            <div className="divide-y divide-[#edf0f2]">
              {notifications.map((n) => (
                <div key={n.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <span className="rounded bg-[#e5f0fb] px-1.5 py-0.5 text-[10px] font-bold text-[#356586]">
                      {n.label}
                    </span>
                    <span className="text-[10px] text-[#8796a1]">{n.time}</span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold leading-5 text-[#32485a]">{n.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setLocation('/skills')}
              data-testid="button-rail-assessment"
              className="mt-4 w-full rounded-lg border border-[#72aaa9] py-2 text-xs font-bold text-[#267278] hover:bg-[#eff8f7] transition-colors"
            >
              Check Target Readiness
            </button>
          </div>

          <div className="rounded-xl border border-[#d6e0e7] bg-white p-4 panel-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="tiny-label">Certification Status</p>
                <p className="mt-1 text-2xl font-bold text-[#1c4b63]">68 <span className="text-sm font-normal text-[#6f8290]">/ 100 pts</span></p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e3f2f1] text-[#197576]">
                <Award size={20} />
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#e6edef]">
              <div className="h-full rounded-full bg-[#1e787d]" style={{ width: '68%' }} />
            </div>
            <p className="mt-2.5 text-[11px] text-[#697d8b]">
              32 points required to unlock Senior Forecast Analyst credential.
            </p>
          </div>
        </aside>
      </div>

      {/* Feature Modals */}
      <EloLeaderboardModal isOpen={eloOpen} onClose={() => setEloOpen(false)} />
      <GroundReportsHub isOpen={reportsOpen} onClose={() => setReportsOpen(false)} />
      <AlertBroadcastModal isOpen={broadcastOpen} onClose={() => setBroadcastOpen(false)} />
    </div>
  );
}
