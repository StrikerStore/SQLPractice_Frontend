export type Difficulty = 'easy' | 'medium' | 'hard';

/** Public question shape — matches what /api/questions returns (no canonicalSql) */
export interface Question {
  id: string;
  db: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  hint: string;
  starterSql?: string;
}

export interface QuestionsResponse {
  count: number;
  filters: {
    databases: string[];
    topics: string[];
  };
  questions: Question[];
}
