import { SamplePort } from 'src/domain';

type Doc = {
  category: string;
  words: string[];
};

export function makeVector(
  words: string[],
  idf: Map<string, number>,
): Map<string, number> {
  if (words.length === 0) {
    return new Map();
  }

  const counts = new Map<string, number>();
  words.forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  const result = new Map<string, number>();
  counts.forEach((count, word) => {
    const tf = count / words.length;
    result.set(word, tf * (idf.get(word) || 0));
  });

  return result;
}

export function sim(
  left: Map<string, number>,
  right: Map<string, number>,
): number {
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  left.forEach((value, key) => {
    dotProduct += value * (right.get(key) || 0);
    leftMagnitude += value * value;
  });

  right.forEach((value) => {
    rightMagnitude += value * value;
  });

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export function makeIdf(
  vocabulary: Set<string>,
  docs: Doc[],
): Map<string, number> {
  const docFrequencies = new Map<string, number>();

  docs.forEach(({ words }) => {
    new Set(words).forEach((word) => {
      docFrequencies.set(word, (docFrequencies.get(word) || 0) + 1);
    });
  });

  const totalDocs = docs.length;
  const idf = new Map<string, number>();
  vocabulary.forEach((word) => {
    const docFrequency = docFrequencies.get(word) || 0;
    idf.set(word, Math.log((totalDocs + 1) / (docFrequency + 1)) + 1);
  });

  return idf;
}

export function makeCategoryVectors(
  categories: string[],
  docs: Doc[],
  idf: Map<string, number>,
  categoryCounts: Map<string, number>,
): Map<string, Map<string, number>> {
  const categorySums = new Map<string, Map<string, number>>();
  categories.forEach((category) => {
    categorySums.set(category, new Map());
  });

  docs.forEach(({ category, words }) => {
    const vector = makeVector(words, idf);
    const sumVector = categorySums.get(category)!;

    vector.forEach((value, word) => {
      sumVector.set(word, (sumVector.get(word) || 0) + value);
    });
  });

  const categoryVectors = new Map<string, Map<string, number>>();
  categories.forEach((category) => {
    const sumVector = categorySums.get(category)!;
    const sampleCount = categoryCounts.get(category) || 1;
    const centroid = new Map<string, number>();

    sumVector.forEach((value, word) => {
      centroid.set(word, value / sampleCount);
    });

    categoryVectors.set(category, centroid);
  });

  return categoryVectors;
}

export function makeDocs(
  data: SamplePort[],
  splitWords: (text: string) => string[],
) {
  return data.map(({ text, category }) => ({
    category,
    words: splitWords(text),
  }));
}
