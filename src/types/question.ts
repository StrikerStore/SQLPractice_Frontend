export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BuildConceptStep {
  step: number;
  title: string;
  body: string;
}

export interface Level {
  level_id: number;
  sort_order: number;
  slug: string;
  title: string;
  description: string;
  syntax: string;
  patterns: string;
  tips: string;
  question_count: number;
}

/** Public question shape — matches what /api/questions returns (no canonical_sql) */
export interface Question {
  id: string;
  level_id: number;
  sort_order: number;
  db: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
  hint: string;
  starter_sql?: string | null;
}

export interface LevelSummary {
  level_id: number;
  slug: string;
  title: string;
}

export interface QuestionsResponse {
  count: number;
  filters: {
    databases: string[];
    levels: LevelSummary[];
  };
  questions: Question[];
}

export interface LevelsResponse {
  count: number;
  levels: Level[];
}
