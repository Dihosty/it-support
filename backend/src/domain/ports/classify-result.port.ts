export interface ClassifyResultPort {
  category: string;
  confidence: number;
  probabilities: Record<string, number>;
}
