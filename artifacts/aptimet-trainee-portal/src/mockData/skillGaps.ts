export type SkillGap = {
  skill: string;
  current: number;
  target: number;
  description: string;
  courseId: string;
};

export const radarData = [
  { skill: 'Data analysis', current: 78, target: 90 },
  { skill: 'Forecasting', current: 61, target: 88 },
  { skill: 'Climatology', current: 42, target: 78 },
  { skill: 'Communication', current: 72, target: 80 },
  { skill: 'Modelling', current: 38, target: 72 },
  { skill: 'Leadership', current: 55, target: 68 },
];

export const priorityGaps: SkillGap[] = [
  {
    skill: 'Modelling',
    current: 38,
    target: 72,
    description: 'Build confidence with ensemble spread, parameterisation schemes, and model bias correction.',
    courseId: 'numerical',
  },
  {
    skill: 'Climatology',
    current: 42,
    target: 78,
    description: 'Connect historical climate normals and anomaly detection to daily operational risk briefings.',
    courseId: 'data',
  },
  {
    skill: 'Forecasting',
    current: 61,
    target: 88,
    description: 'Sharpen judgement at critical decision points during rapid cyclogenesis and nowcasting.',
    courseId: 'synoptic',
  },
];
