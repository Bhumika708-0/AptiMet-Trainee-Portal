import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Clock3, Search, SlidersHorizontal, UserRound } from 'lucide-react';
import { courses as defaultCourses, Course } from '@/mockData/courses';
import { useToast } from '@/hooks/use-toast';
import { fetchCourses, enrollCourseApi } from '@/lib/api';

function CourseCard({ course, onEnroll }: { course: Course; onEnroll?: (id: string) => void }) {
  const [, setLocation] = useLocation();
  return (
    <div
      className="panel-shadow group flex flex-col overflow-hidden rounded-xl border border-[#d6e0e7] bg-white transition-transform hover:-translate-y-0.5"
      data-testid={`card-course-${course.id}`}
    >
      <button
        onClick={() => setLocation(`/courses/${course.id}`)}
        className="block w-full text-left"
        data-testid={`button-open-course-${course.id}`}
      >
        <div
          className="relative h-[100px] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${course.color} 0%, #d9e8ed 100%)` }}
        >
          <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border-[18px] border-white/20" />
          <div className="absolute bottom-3 left-4 max-w-[80%] text-[11px] font-bold uppercase tracking-[.1em] text-white/90">
            {course.category}
          </div>
          {course.progress > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-[#c6efed] px-2 py-0.5 text-[10px] font-bold text-[#1e6b73]">
              Enrolled ({course.progress}%)
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-[15px] font-bold text-[#21384d] leading-snug">{course.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#70808e]">
            <UserRound size={13} /> {course.trainer} · {course.role}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#596e7e] line-clamp-2">{course.description}</p>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {course.tags.map((tag) => (
              <span key={tag} className="rounded bg-[#edf4f6] px-2 py-0.5 text-[10px] font-semibold text-[#2c7077]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </button>

      <div className="mt-auto flex items-center justify-between border-t border-[#edf1f3] px-4 py-3 bg-[#fafcfd]">
        <span className="text-xs text-[#71818e] flex items-center gap-1">
          <Clock3 size={13} /> {course.duration} · {course.level}
        </span>
        <button
          onClick={() => onEnroll?.(course.id)}
          disabled={course.progress > 0}
          data-testid={`button-enroll-${course.id}`}
          className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors ${
            course.progress > 0
              ? 'bg-[#e4f1ee] text-[#25726b] cursor-default'
              : 'bg-[#075fa6] text-white hover:bg-[#064f8b]'
          }`}
        >
          {course.progress > 0 ? 'Enrolled' : 'Enroll'}
        </button>
      </div>
    </div>
  );
}

export default function Catalog() {
  const [courseList, setCourseList] = useState<Course[]>(defaultCourses);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [enrolledMap, setEnrolledMap] = useState<Record<string, boolean>>({ synoptic: true });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses().then((data) => {
      if (data && data.length > 0) setCourseList(data);
    });
  }, []);

  const filtered = useMemo(
    () =>
      courseList.filter(
        (c) =>
          (!query || `${c.title} ${c.trainer} ${c.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())) &&
          (category === 'All' || c.category === category) &&
          (level === 'All' || c.level === level)
      ),
    [courseList, query, category, level]
  );

  const enroll = (id: string) => {
    setEnrolledMap((s) => ({ ...s, [id]: true }));
    enrollCourseApi(id);
    toast({
      title: 'Course Enrolled Successfully',
      description: 'The pathway has been added to your dashboard and learning plan.',
    });
  };

  return (
    <div className="mx-auto max-w-[1240px] p-5 md:p-8">
      <div className="mb-6">
        <div className="tiny-label mb-1">IMD Learning Library</div>
        <h1 className="text-[28px] font-bold tracking-[-.04em] text-[#124b78] md:text-[30px]">
          Course Catalog & Pathways
        </h1>
        <p className="mt-1 text-sm text-[#667887]">
          Structured operational curricula designed for forecasting officers and scientific assistants.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#d6e0e7] bg-white p-3.5 panel-shadow lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-2.5 text-[#7e909d]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-course-search"
            placeholder="Search courses, trainers, or concepts (e.g. Synoptic, NWP, Risk)"
            className="h-9 w-full rounded-lg border border-[#d7e1e7] bg-[#f9fbfc] pl-9 pr-3 text-xs outline-none focus:border-[#6eafb1]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#6f818f]" />
          {['All', 'Forecasting', 'Data Analysis', 'Climate', 'Communication'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              data-testid={`button-filter-category-${cat.toLowerCase().replace(' ', '-')}`}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                category === cat ? 'bg-[#16698a] text-white' : 'bg-[#eef3f5] text-[#617482] hover:bg-[#e4ecf0]'
              }`}
            >
              {cat}
            </button>
          ))}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            data-testid="select-level"
            className="rounded-full border border-[#d4dfe6] bg-white px-3 py-1.5 text-[11px] font-bold text-[#617482] outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-[#748594]">{filtered.length} pathways found</span>
        <span className="text-xs font-bold text-[#1d607b]">Target Role: Senior Forecast Analyst</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CourseCard
            key={c.id}
            course={{ ...c, progress: enrolledMap[c.id] ? Math.max(c.progress, 1) : c.progress }}
            onEnroll={enroll}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#afc3cd] bg-[#f8fbfc] p-12 text-center">
          <Search className="mx-auto text-[#5d9aa0]" size={32} />
          <p className="mt-3 text-sm font-bold text-[#35536a]">No pathways match those search criteria</p>
          <button
            onClick={() => {
              setQuery('');
              setCategory('All');
              setLevel('All');
            }}
            data-testid="button-clear-filters"
            className="mt-3 text-xs font-bold text-[#176e83] underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
