import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import {
  ArrowLeft, Award, CheckCircle2, ChevronRight,
  Clock3, FileText, Play, Target, UserRound, X
} from 'lucide-react';
import { getCourse, courses } from '@/mockData/courses';
import { useToast } from '@/hooks/use-toast';

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-4">
      {eyebrow && <div className="tiny-label mb-1">{eyebrow}</div>}
      <h2 className="text-[17px] font-bold tracking-[-.02em] text-[#203a52]">{title}</h2>
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const course = getCourse(id ?? '') ?? courses[0];
  const [tab, setTab] = useState<'Overview' | 'Lectures / Materials' | 'Assessment' | 'Feedback'>('Overview');
  const [viewer, setViewer] = useState<{ title: string; type: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const enrolled = course.progress > 0;
  const lessons = course.lessons ?? [
    { title: 'Foundations and operational framework', type: 'reading', duration: 'PDF · 10 pages' },
    { title: 'Reading the operational chart and satellite feed', type: 'video', duration: 'Video lecture · 18 min' },
    { title: 'Case study: fast-moving convective system', type: 'reading', duration: 'Technical brief' },
    { title: 'Knowledge check and operational reflection', type: 'reading', duration: 'Interactive review' },
  ];

  return (
    <div className="mx-auto max-w-[1140px] p-5 md:p-8">
      <Link
        href="/catalog"
        data-testid="link-back-catalog"
        className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#557284] hover:text-[#125d78]"
      >
        <ArrowLeft size={14} /> Back to Course Catalog
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[#d6e0e7] bg-white panel-shadow">
        {/* Hero Header */}
        <div
          className="relative min-h-[210px] p-6 md:p-9 text-white"
          style={{ background: `linear-gradient(115deg, ${course.color}, #2a4c63)` }}
        >
          <div className="max-w-[640px]">
            <span className="rounded bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              {course.category} · {course.level}
            </span>
            <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-[-.03em] md:text-[34px]">
              {course.title}
            </h1>
            <p className="mt-2.5 max-w-[540px] text-sm leading-6 text-white/90">
              {course.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-1.5">
                <UserRound size={15} /> {course.trainer} ({course.role})
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={15} /> {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Award size={15} /> IMD Certificate Eligible
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto border-b border-[#e4eaee] px-5 pt-2 md:px-8 bg-[#fafcfd]">
          {(['Overview', 'Lectures / Materials', 'Assessment', 'Feedback'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              data-testid={`button-tab-${t.split(' ')[0].toLowerCase()}`}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
                tab === t
                  ? 'border-[#177c80] text-[#177278]'
                  : 'border-transparent text-[#758594] hover:text-[#2d495d]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 md:p-8">
          {tab === 'Overview' && (
            <div className="grid gap-8 md:grid-cols-[1.35fr_1fr]">
              <div>
                <SectionHeading eyebrow="Curriculum Breakdown" title="What You Will Master" />
                <p className="text-sm leading-6 text-[#5e7181]">
                  {course.description} You will work through verified operational case studies, evaluate model variance, and establish practical decision thresholds.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    'Interpret multi-level isobaric and streamline charts',
                    'Execute systematic automated data validation protocols',
                    'Communicate forecast uncertainty to regional disaster cells',
                    'Connect observation signatures directly to early warning bulletins',
                  ].map((bullet) => (
                    <div key={bullet} className="flex gap-2.5 text-xs font-medium text-[#425a6c]">
                      <CheckCircle2 size={16} className="shrink-0 text-[#208288]" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-[#f0f7f7] border border-[#d2e7e7] p-5">
                <div className="tiny-label mb-2">Trainee Progress</div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-[#195e6d]">{course.progress}%</span>
                  <span className="text-xs text-[#607986]">of pathway completed</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#d9e7e7]">
                  <div className="h-full rounded-full bg-[#157c7f]" style={{ width: `${course.progress}%` }} />
                </div>
                <button
                  onClick={() => setTab('Lectures / Materials')}
                  data-testid="button-continue-course"
                  className="mt-6 w-full rounded-lg bg-[#075fa6] py-2.5 text-xs font-bold text-white hover:bg-[#064f8b] transition-colors"
                >
                  {course.progress > 0 ? 'Continue Lesson' : 'Start Pathway'}
                </button>
              </div>
            </div>
          )}

          {tab === 'Lectures / Materials' && (
            <div className="max-w-2xl">
              <SectionHeading eyebrow="Curated Resources" title="Lectures and Operational Readings" />
              <div className="space-y-2.5">
                {lessons.map((item, i) => (
                  <button
                    onClick={() => setViewer(item)}
                    key={item.title}
                    data-testid={`button-lecture-${i}`}
                    className="flex w-full items-center gap-3.5 rounded-xl border border-[#dae4e9] bg-[#fbfcfd] p-3.5 text-left hover:border-[#74aeb0] transition-colors"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#e2f0f1] text-[#18717a]">
                      {item.type === 'video' ? <Play size={17} /> : <FileText size={17} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#30495e] truncate">{item.title}</div>
                      <div className="mt-1 text-[11px] text-[#7c8c99]">{item.duration}</div>
                    </div>
                    <ChevronRight size={15} className="text-[#81929f]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'Assessment' && (
            <div className="max-w-xl rounded-2xl border border-[#d6e0e7] bg-[#f8fbfc] p-6 panel-shadow">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#d8eff0] text-[#126c76]">
                <Target size={24} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[#294359]">Pathway Competency Quiz</h2>
              <p className="mt-2 text-sm leading-6 text-[#667a89]">
                Complete 4 applied operational questions covering pressure gradients, model uncertainty, quality control checks, and escalation triggers.
              </p>
              <div className="mt-5 flex gap-6 text-xs text-[#6a7d8a] font-semibold">
                <span>4 questions</span>
                <span>20 minutes duration</span>
                <span>Certificate qualifying</span>
              </div>
              <button
                onClick={() => setLocation(`/courses/${course.id}/assessment`)}
                disabled={!enrolled}
                data-testid="button-assessment-start"
                className="mt-6 rounded-lg bg-[#075fa6] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#064f8b] disabled:cursor-not-allowed disabled:bg-[#b7c7d0] transition-colors"
              >
                {enrolled ? 'Launch Assessment Now' : 'Enroll in Course to Unlock'}
              </button>
            </div>
          )}

          {tab === 'Feedback' && (
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
              <div>
                <SectionHeading eyebrow="Operational Feedback" title="Rate this Training Module" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      data-testid={`button-rating-${n}`}
                      className={`text-2xl transition-colors ${n <= rating ? 'text-[#d59b3e]' : 'text-[#c7d2d7]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  data-testid="textarea-feedback"
                  placeholder="What operational insights were most useful for your daily shift duties?"
                  className="mt-4 h-28 w-full resize-none rounded-xl border border-[#d5e0e6] p-3 text-sm outline-none focus:border-[#6caeb0]"
                />
                <button
                  onClick={() => {
                    toast({
                      title: 'Feedback Submitted',
                      description: 'Thank you for helping us continually calibrate the IMD curriculum.',
                    });
                    setComment('');
                    setRating(0);
                  }}
                  data-testid="button-submit-feedback"
                  className="mt-3 rounded-lg bg-[#075fa6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#064f8b] transition-colors"
                >
                  Submit Review
                </button>
              </div>

              <div className="rounded-xl bg-[#f2f7f8] border border-[#dae6e7] p-5">
                <div className="tiny-label mb-2">Trainee Community Notes</div>
                <p className="text-xs leading-6 text-[#5e7181] italic">
                  “The synoptic case studies provided clear guidance for our morning district briefing routines.”
                </p>
                <div className="mt-3 text-xs font-bold text-[#2f6470]">— R. Kapoor, Pune Meteorological Centre</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Material Viewer Modal */}
      {viewer && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#19364c]/45 p-5 backdrop-blur-xs"
          onClick={() => setViewer(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-white p-6 panel-shadow animate-rise-in"
          >
            <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3">
              <div>
                <div className="tiny-label">Interactive Lesson Viewer</div>
                <h3 className="mt-1 text-base font-bold text-[#27445a]">{viewer.title}</h3>
              </div>
              <button
                onClick={() => setViewer(null)}
                data-testid="button-close-viewer"
                className="p-1 rounded-lg hover:bg-[#edf2f5]"
              >
                <X size={19} />
              </button>
            </div>
            <div className="mt-5 grid h-60 place-items-center rounded-xl bg-[#eaf1f3] text-center border border-[#dbe6e8]">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#c9e4e5] text-[#176e77]">
                  {viewer.type === 'video' ? <Play size={22} className="ml-0.5" /> : <FileText size={22} />}
                </div>
                <p className="mt-3 text-sm font-bold text-[#355467]">
                  {viewer.type === 'video' ? 'Interactive Video Session' : 'Technical Reference Document'}
                </p>
                <p className="mt-1 text-xs text-[#7e909b]">
                  Full multimedia stream integrated for IMD Training Portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
