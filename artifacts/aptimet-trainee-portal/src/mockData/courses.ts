export type Course = {
  id: string;
  title: string;
  trainer: string;
  role: string;
  duration: string;
  level: string;
  category: string;
  progress: number;
  color: string;
  tags: string[];
  description: string;
  lessons?: { title: string; type: 'video' | 'reading'; duration: string }[];
};

export const courses: Course[] = [
  {
    id: 'synoptic',
    title: 'Advanced Synoptic Meteorology',
    trainer: 'Dr. A. Sharma',
    role: 'Senior Scientist, IMD',
    duration: '6h 20m',
    level: 'Advanced',
    category: 'Forecasting',
    progress: 65,
    color: '#2f8091',
    tags: ['Forecasting', 'Analysis'],
    description: 'Read the atmosphere as a connected system. This applied programme brings synoptic charts, pressure patterns and operational judgement together.',
    lessons: [
      { title: 'Foundations and framing of synoptic systems', type: 'reading', duration: 'PDF · 12 pages' },
      { title: 'Reading the operational surface and upper-air chart', type: 'video', duration: 'Video lecture · 18 min' },
      { title: 'Case study: rapid cyclogenesis in the Bay of Bengal', type: 'reading', duration: 'Technical note · 8 pages' },
      { title: 'Knowledge check and operational reflection', type: 'reading', duration: 'Interactive exercise' },
    ],
  },
  {
    id: 'numerical',
    title: 'Numerical Weather Prediction',
    trainer: 'Prof. K. Verma',
    role: 'NCMRWF Faculty',
    duration: '8h 10m',
    level: 'Intermediate',
    category: 'Forecasting',
    progress: 0,
    color: '#3c6f9d',
    tags: ['Forecasting', 'Models'],
    description: 'Build confidence interpreting model guidance and communicate uncertainty in operational forecast discussions.',
    lessons: [
      { title: 'Governing primitive equations & grid parameterisation', type: 'reading', duration: 'PDF · 15 pages' },
      { title: 'Ensemble Prediction Systems (EPS) spread & clustering', type: 'video', duration: 'Video lecture · 24 min' },
      { title: 'Model bias correction in tropical regimes', type: 'reading', duration: 'Guide · 10 pages' },
    ],
  },
  {
    id: 'data',
    title: 'Climate Data & Quality Control',
    trainer: 'Dr. R. Iyer',
    role: 'Climate Services Division',
    duration: '4h 05m',
    level: 'Beginner',
    category: 'Data Analysis',
    progress: 0,
    color: '#719a86',
    tags: ['Data Analysis', 'Climate'],
    description: 'Turn observation archives into trustworthy climate insights through practical data validation workflows.',
    lessons: [
      { title: 'Automated Weather Station (AWS) data pipeline', type: 'video', duration: 'Video lecture · 15 min' },
      { title: 'Homogeneity testing & outlier detection', type: 'reading', duration: 'Standard Operating Procedure' },
      { title: 'Gridded rainfall datasets (IMD 0.25° grid)', type: 'reading', duration: 'Dataset tutorial' },
    ],
  },
  {
    id: 'assimilation',
    title: 'Introduction to Data Assimilation',
    trainer: 'Dr. M. Nair',
    role: 'Atmospheric Research Unit',
    duration: '4h 00m',
    level: 'Intermediate',
    category: 'Data Analysis',
    progress: 0,
    color: '#698da9',
    tags: ['Data Analysis', 'Models'],
    description: 'A structured introduction to combining observations and model state for better forecasts.',
    lessons: [
      { title: 'Variational methods (3D-Var and 4D-Var)', type: 'video', duration: 'Video lecture · 20 min' },
      { title: 'Satellite radiance & Doppler radar ingestion', type: 'reading', duration: 'Technical report' },
      { title: 'Kalman filtering in operational NWP', type: 'reading', duration: 'Reference paper' },
    ],
  },
  {
    id: 'communication',
    title: 'Public Weather Communication',
    trainer: 'Ms. P. Rao',
    role: 'Public Weather Services',
    duration: '2h 30m',
    level: 'Beginner',
    category: 'Communication',
    progress: 0,
    color: '#b69a70',
    tags: ['Communication', 'Briefings'],
    description: 'Make technical forecasts useful, clear and actionable for the communities who depend on them.',
    lessons: [
      { title: 'Impact-based warning matrix (Colour codes)', type: 'video', duration: 'Video lecture · 14 min' },
      { title: 'Framing uncertainty for disaster managers', type: 'reading', duration: 'Protocol checklist' },
      { title: 'Media briefings during extreme weather', type: 'reading', duration: 'Case study' },
    ],
  },
  {
    id: 'climate-risk',
    title: 'Climate Risk & Impact Briefing',
    trainer: 'Dr. S. Menon',
    role: 'Climate Applications',
    duration: '3h 45m',
    level: 'Advanced',
    category: 'Climate',
    progress: 0,
    color: '#7486a4',
    tags: ['Climate', 'Analysis'],
    description: 'Frame climate intelligence for policy, planning and regional resilience decisions.',
    lessons: [
      { title: 'CMIP6 projection interpretation for India', type: 'video', duration: 'Video lecture · 22 min' },
      { title: 'Extreme precipitation return period calculation', type: 'reading', duration: 'Workbook' },
      { title: 'District vulnerability mapping', type: 'reading', duration: 'Policy briefing' },
    ],
  },
];

export const getCourse = (id: string) => courses.find((course) => course.id === id);
