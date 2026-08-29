export const scenario: {
  title: string;
  subtitle: string;
  duration: string;
  maxScore: number;
  info: { id: string; at: string; title: string; body: string; tag: string }[];
  mcq: { id: string; at: string; title: string; prompt: string; category: string; score: number; options: string[]; answer: number; feedback: string };
  allocation: { id: string; at: string; title: string; prompt: string; category: string; score: number; zones: string[]; recommended: number[]; feedback: string };
  ranking: { id: string; at: string; title: string; prompt: string; category: string; score: number; items: string[]; recommended: string[]; feedback: string };
  freetext: { id: string; at: string; title: string; prompt: string; category: string; score: number; keywords: string[]; feedback: string };
};
