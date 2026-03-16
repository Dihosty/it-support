import { CategoryStatsPort } from './category-stats.port';

export interface TestResultPort {
  accuracy: number;
  details: {
    total: number;
    correct: number;
    incorrect: number;
    perCategory: Record<string, CategoryStatsPort>;
  };
}
