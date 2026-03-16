export interface TrainResultPort {
  success: boolean;
  vocabularySize: number;
  categories: string[];
  samples: number;
}
