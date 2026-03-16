import {
  CategoryStatsPort,
  ClassifyResultPort,
  SamplePort,
  TestResultPort,
} from 'src/domain';

export function getTopCategory(
  categories: string[],
  categoryCounts: Map<string, number>,
): string {
  return categories.reduce((bestCategory, category) =>
    (categoryCounts.get(category) || 0) >
    (categoryCounts.get(bestCategory) || 0)
      ? category
      : bestCategory,
  );
}

export function makeProbs(
  scores: Record<string, number>,
  categories: string[],
): Record<string, number> {
  const bestCategory = categories.reduce((best, category) =>
    scores[category] > scores[best] ? category : best,
  );

  const maxScore = scores[bestCategory];
  let scoreSum = 0;
  const exponentials: Record<string, number> = {};

  categories.forEach((category) => {
    exponentials[category] = Math.exp(scores[category] - maxScore);
    scoreSum += exponentials[category];
  });

  const probabilities: Record<string, number> = {};
  categories.forEach((category) => {
    probabilities[category] = exponentials[category] / scoreSum;
  });

  return probabilities;
}

export function makeEmptyResult(
  categories: string[],
  categoryCounts: Map<string, number>,
): ClassifyResultPort {
  const majorityCategory = getTopCategory(categories, categoryCounts);
  const probabilities: Record<string, number> = {};

  categories.forEach((category) => {
    probabilities[category] = category === majorityCategory ? 1 : 0;
  });

  return {
    category: majorityCategory,
    confidence: 1,
    probabilities,
  };
}

export function checkAccuracy(
  categories: string[],
  testData: SamplePort[],
  classify: (text: string) => string,
): TestResultPort {
  const rawStats: Record<string, { total: number; correct: number }> = {};
  categories.forEach((category) => {
    rawStats[category] = { total: 0, correct: 0 };
  });

  let correctPredictions = 0;
  testData.forEach(({ text, category }) => {
    rawStats[category].total++;

    if (classify(text) === category) {
      correctPredictions++;
      rawStats[category].correct++;
    }
  });

  const perCategory: Record<string, CategoryStatsPort> = {};
  Object.entries(rawStats).forEach(([category, stats]) => {
    perCategory[category] = {
      ...stats,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
    };
  });

  return {
    accuracy: testData.length > 0 ? correctPredictions / testData.length : 0,
    details: {
      total: testData.length,
      correct: correctPredictions,
      incorrect: testData.length - correctPredictions,
      perCategory,
    },
  };
}
