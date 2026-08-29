import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { getCourse, courses } from '@/mockData/courses';
import { submitQuizApi } from '@/lib/api';

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const course = getCourse(id ?? '') ?? courses[0];
  const [, setLocation] = useLocation();

  const questions = [
    {
      q: 'Which signal most directly indicates a rapidly strengthening barometric pressure gradient?',
      options: ['Widening distance between isobars', 'Tightly packed isobars with falling central pressure', 'A high-level cirrus cloud canopy', 'A stationary surface dew point'],
      answer: 1,
      tag: 'Synoptic Analysis',
    },
    {
      q: 'When deterministic numerical models diverge significantly during a forecast cycle, the duty officer should first:',
      options: ['Present only a single confident deterministic path', 'Communicate ensemble spread, probabilistic envelope, and driver of divergence', 'Discard the latest run and rely purely on climatology', 'Withhold all advisories until 100% certainty is reached'],
      answer: 1,
      tag: 'NWP Interpretation',
    },
    {
      q: 'An operational automated quality-control check on an AWS rainfall archive should immediately flag:',
      options: ['Missing records and physically impossible spikes exceeding regional climatological maxima', 'Stations with the highest elevations', 'Any day with zero recorded rainfall', 'Sensors older than five years regardless of calibration'],
      answer: 0,
      tag: 'Data Quality Control',
    },
    {
      q: 'When an impact-based extreme weather threshold is crossed in early guidance, the correct operational protocol is to:',
      options: ['Wait for post-landfall observations before issuing alerts', 'Document the threshold trigger and activate inter-agency disaster management coordination', 'Revoke all previous advisories without explanation', 'Lower the alert color code to avoid panic'],
      answer: 1,
      tag: 'Emergency Decision Practice',
    },
  ];

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState(false);

  const current = questions[index];
  const score = answers.reduce((sum, a, i) => sum + (a === questions[i].answer ? 1 : 0), 0);

  if (result) {
    const passed = score >= 3;
    return (
      <div className="mx-auto max-w-3xl p-5 md:p-10">
        <Link
          href={`/courses/${course.id}`}
          data-testid="link-back-result"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#557284] hover:text-[#125d78]"
        >
          <ArrowLeft size={14} /> Return to Course Overview
        </Link>

        <div className="mt-6 rounded-2xl border border-[#d6e0e7] bg-white p-8 text-center panel-shadow animate-rise-in">
          <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
            passed ? 'bg-[#e0f2ef] text-[#167775]' : 'bg-[#fff0eb] text-[#c15d48]'
          }`}>
            <Award size={32} />
          </div>
          <div className="tiny-label mt-4">Assessment Evaluation Complete</div>
          <h1 className="mt-2 text-3xl font-bold text-[#24465c]">
            {passed ? 'Strong Operational Grasp' : 'Foundational Review Recommended'}
          </h1>

          <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-10">
            <div>
              <div className="text-4xl font-bold text-[#167577]">{score * 25}%</div>
              <div className="tiny-label mt-1">Score ({score}/{questions.length})</div>
            </div>
            <div className="h-10 border-l border-[#d9e4e8]" />
            <div>
              <div className={`text-base font-bold ${passed ? 'text-[#28786e]' : 'text-[#af6c3d]'}`}>
                {passed ? 'Passed & Certified' : 'Review Required'}
              </div>
              <div className="tiny-label mt-1">Certification Status</div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-[#f2f7f7] border border-[#dce8e8] p-5 text-left">
            <div className="text-xs font-bold text-[#385a67]">Explainable Operational Feedback</div>
            <p className="mt-2 text-xs leading-5 text-[#6c8089]">
              {passed
                ? 'Your answers reflect an accurate understanding of synoptic pressure gradients, model uncertainty handling, and protocol escalation. You are qualified for the next competency milestone.'
                : 'Revisit the data quality validation workflow and synoptic interpretation case studies before retrying the assessment.'}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setIndex(0);
                setAnswers([]);
                setResult(false);
              }}
              data-testid="button-retry-quiz"
              className="rounded-lg border border-[#6aa9ad] px-5 py-2.5 text-xs font-bold text-[#247078] hover:bg-[#eff8f8] transition-colors"
            >
              Retry Assessment
            </button>
            {passed && (
              <button
                onClick={() => setLocation('/profile')}
                data-testid="button-view-quiz-certificate"
                className="rounded-lg bg-[#075fa6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#064f8b] transition-colors flex items-center gap-1.5"
              >
                <Award size={15} /> View Verified Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const choose = (optionIndex: number) => {
    const updated = [...answers];
    updated[index] = optionIndex;
    setAnswers(updated);
  };

  return (
    <div className="mx-auto max-w-3xl p-5 md:p-10">
      <div className="flex items-center justify-between">
        <Link
          href={`/courses/${course.id}`}
          data-testid="link-exit-quiz"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#557284] hover:text-[#125d78]"
        >
          <ArrowLeft size={14} /> Exit Assessment
        </Link>
        <span className="font-mono text-xs font-bold text-[#6d818f] bg-[#eef4f7] px-2.5 py-1 rounded-md">
          Timer: 20:00
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="tiny-label">
            Question {index + 1} of {questions.length}
          </div>
          <div className="text-xs font-bold text-[#31787e]">{course.title}</div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-[#e0e8eb]">
          <div
            className="h-full rounded-full bg-[#177b80] transition-all duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow md:p-8">
          <div className="inline-block rounded bg-[#e7f3f3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#28747a]">
            {current.tag}
          </div>
          <h1 className="mt-4 text-xl font-bold leading-7 text-[#29465b]">{current.q}</h1>

          <div className="mt-6 space-y-3">
            {current.options.map((option, i) => (
              <button
                onClick={() => choose(i)}
                key={option}
                data-testid={`button-answer-${i}`}
                className={`flex w-full items-center gap-3.5 rounded-xl border p-4 text-left text-sm font-semibold transition-all ${
                  answers[index] === i
                    ? 'border-[#187d81] bg-[#eaf7f5] text-[#1d656d]'
                    : 'border-[#dce5e9] text-[#536a79] hover:border-[#74aeb1] hover:bg-[#fbfdfd]'
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                    answers[index] === i
                      ? 'border-[#187d81] bg-[#187d81] text-white'
                      : 'border-current text-[#798e9c]'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between border-t border-[#edf2f5] pt-5">
            <button
              onClick={() => setIndex(Math.max(0, index - 1))}
              disabled={index === 0}
              data-testid="button-previous-question"
              className="flex items-center gap-2 rounded-lg border border-[#d6e1e6] px-4 py-2.5 text-xs font-bold text-[#607585] hover:bg-[#f4f7f9] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <button
              onClick={() => {
                if (index === questions.length - 1) {
                  setResult(true);
                  const finalScore = answers.reduce((sum, a, i) => sum + (a === questions[i].answer ? 1 : 0), 0);
                  submitQuizApi(course.id, finalScore * 25);
                } else {
                  setIndex(index + 1);
                }
              }}
              disabled={answers[index] === undefined}
              data-testid="button-next-question"
              className="flex items-center gap-2 rounded-lg bg-[#075fa6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#064f8b] disabled:bg-[#b9c8d0] disabled:cursor-not-allowed transition-colors"
            >
              {index === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
