import { useLocation } from 'wouter';
import { ArrowRight, BookOpen } from 'lucide-react';
import {
  Legend, PolarAngleAxis, PolarGrid,
  RadarChart, Radar as RadarShape, ResponsiveContainer, Tooltip as ChartTooltip
} from 'recharts';
import { radarData, priorityGaps } from '@/mockData/skillGaps';
import { getCourse, courses } from '@/mockData/courses';

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="tiny-label mb-1">{eyebrow}</div>}
        <h2 className="text-[17px] font-bold tracking-[-.02em] text-[#203a52]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function Skills() {
  const [, setLocation] = useLocation();

  const recommendedCourses = [
    getCourse('numerical') ?? courses[1],
    getCourse('data') ?? courses[2],
    getCourse('climate-risk') ?? courses[5],
  ];

  return (
    <div className="mx-auto max-w-[1200px] p-5 md:p-8">
      <div className="mb-7">
        <div className="tiny-label mb-1">Competency Mapping Engine</div>
        <h1 className="text-[28px] font-bold tracking-[-.04em] text-[#124b78] md:text-[32px]">
          Skill-Gap Assessment & Roadmap
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[#667887]">
          Compare your active operational capabilities against the standard competency benchmarks for the <strong>Senior Forecast Analyst</strong> role.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* Radar Chart Section */}
        <section className="rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow">
          <SectionHeading
            title="Operational Competency Profile"
            action={
              <span className="rounded-full bg-[#e6f3f2] px-3 py-1 text-[10px] font-bold text-[#23747b]">
                Updated Today · 6 Dimensions
              </span>
            }
          />
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#cddce1" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#536b7a', fontWeight: 600 }} />
                <RadarShape
                  name="Your Active Profile"
                  dataKey="current"
                  stroke="#157c7f"
                  fill="#76c9c5"
                  fillOpacity={0.35}
                  strokeWidth={2.5}
                />
                <RadarShape
                  name="Target Benchmark"
                  dataKey="target"
                  stroke="#3d6f91"
                  fill="#b6d0dc"
                  fillOpacity={0.15}
                  strokeDasharray="5 3"
                  strokeWidth={1.5}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <ChartTooltip contentStyle={{ borderRadius: 12, border: '1px solid #c8d7dc', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Priority Gaps List */}
        <section className="rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow flex flex-col justify-between">
          <div>
            <SectionHeading title="Priority Skill Gaps" />
            <div className="space-y-5">
              {priorityGaps.map((item) => {
                const gap = item.target - item.current;
                return (
                  <div key={item.skill} className="rounded-xl bg-[#f9fbfc] border border-[#e4ecf0] p-4">
                    <div className="flex justify-between items-center text-xs font-bold text-[#40596b]">
                      <span className="text-sm font-bold text-[#203a50]">{item.skill}</span>
                      <span className="rounded bg-[#ffebe6] text-[#b34c3b] px-2 py-0.5 text-[11px]">
                        −{gap} pt gap
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 rounded-full bg-[#e3ebf0]">
                      <div
                        className="h-full rounded-full bg-[#d49c56]"
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] text-[#778895] font-mono">
                      <span>Current: {item.current} pts</span>
                      <span>Target: {item.target} pts</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#637887]">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setLocation('/catalog')}
            data-testid="button-browse-gap-courses"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#075fa6] py-3 text-xs font-bold text-white hover:bg-[#064f8b] transition-colors"
          >
            Browse Targeted Gap-Closing Pathways <ArrowRight size={14} />
          </button>
        </section>
      </div>

      {/* Recommended Courses to Close Gaps */}
      <section className="mt-8">
        <SectionHeading
          eyebrow="Targeted Interventions"
          title="Recommended Pathways to Close Your Gap Points"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {recommendedCourses.map((c) => (
            <button
              onClick={() => setLocation(`/courses/${c.id}`)}
              key={c.id}
              data-testid={`button-skill-course-${c.id}`}
              className="rounded-2xl border border-[#d6e0e7] bg-white p-5 text-left panel-shadow transition-all hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e2f0f1] text-[#1b7479]">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-[#738590]">{c.duration}</span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#29465a] leading-snug">{c.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-[#718390] line-clamp-3">{c.description}</p>
              </div>
              <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#26727a] pt-3 border-t border-[#edf1f4]">
                Launch module <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
