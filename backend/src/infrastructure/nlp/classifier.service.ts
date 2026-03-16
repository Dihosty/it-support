import { Injectable } from '@nestjs/common';
import {
  checkAccuracy,
  makeEmptyResult,
  makeProbs,
} from './classifier.metrics';
import {
  ClassifyResultPort,
  SamplePort,
  TestResultPort,
  TrainResultPort,
} from 'src/domain';
import {
  makeCategoryVectors,
  makeDocs,
  makeIdf,
  makeVector,
  sim,
} from './tfidf.util';
import { splitWords } from './tokenizer.util';

@Injectable()
export class ClassifierService {
  private trained = false;
  private vocabulary = new Set<string>();
  private categoryCounts: Map<string, number> = new Map();
  private categories: string[] = [];
  private totalDocs = 0;
  private idf: Map<string, number> = new Map();
  private categoryVectors: Map<string, Map<string, number>> = new Map();
  private readonly priorWeight = 0.1;

  private reset() {
    this.vocabulary.clear();
    this.categoryCounts.clear();
    this.idf.clear();
    this.categoryVectors.clear();
  }

  private words(text: string): string[] {
    return splitWords(text);
  }

  private fillCounts(data: SamplePort[]) {
    data.forEach(({ text, category }) => {
      const words = this.words(text);
      this.categoryCounts.set(
        category,
        (this.categoryCounts.get(category) || 0) + 1,
      );
      words.forEach((word) => this.vocabulary.add(word));
    });
  }

  train(data: SamplePort[]): TrainResultPort {
    this.reset();

    this.categories = [...new Set(data.map((item) => item.category))];
    this.totalDocs = data.length;

    this.fillCounts(data);
    const docs = makeDocs(data, (text) => this.words(text));
    docs.forEach(({ words }) => {
      words.forEach((word) => this.vocabulary.add(word));
    });

    this.idf = makeIdf(this.vocabulary, docs);
    this.categoryVectors = makeCategoryVectors(
      this.categories,
      docs,
      this.idf,
      this.categoryCounts,
    );

    this.trained = true;

    return {
      success: true,
      vocabularySize: this.vocabulary.size,
      categories: this.categories,
      samples: data.length,
    };
  }

  classify(text: string): string {
    return this.classifyWithConfidence(text).category;
  }

  classifyWithConfidence(text: string): ClassifyResultPort {
    if (!this.trained) throw new Error('Model not trained');

    const words = this.words(text);
    if (words.length === 0) {
      return makeEmptyResult(this.categories, this.categoryCounts);
    }

    const input = makeVector(words, this.idf);
    const scores: Record<string, number> = {};

    this.categories.forEach((category) => {
      const prior = Math.log(
        (this.categoryCounts.get(category) || 1) / this.totalDocs,
      );
      const score = sim(input, this.categoryVectors.get(category)!);
      scores[category] = score + prior * this.priorWeight;
    });

    const bestCategory = this.categories.reduce((best, cat) =>
      scores[cat] > scores[best] ? cat : best,
    );
    const probabilities = makeProbs(scores, this.categories);

    return {
      category: bestCategory,
      confidence: probabilities[bestCategory],
      probabilities,
    };
  }

  evaluate(testData: SamplePort[]): TestResultPort {
    if (!this.trained) throw new Error('Model not trained');

    return checkAccuracy(this.categories, testData, (text) =>
      this.classify(text),
    );
  }

  isTrained(): boolean {
    return this.trained;
  }
}
