import {
  makeCategoryVectors,
  makeDocs,
  makeIdf,
  makeVector,
  sim,
} from './tfidf.util';

describe('tfidf.util', () => {
  describe('makeVector', () => {
    it('returns empty map for empty input words', () => {
      const idf = new Map<string, number>([['internet', 1.2]]);

      const vector = makeVector([], idf);

      expect(vector.size).toBe(0);
    });

    it('calculates tf-idf for repeated words', () => {
      const idf = new Map<string, number>([['internet', 2]]);

      const vector = makeVector(['internet', 'internet'], idf);

      expect(vector.get('internet')).toBeCloseTo(2, 6);
    });
  });

  describe('sim', () => {
    it('returns 1 for identical vectors', () => {
      const left = new Map<string, number>([
        ['a', 1],
        ['b', 2],
      ]);
      const right = new Map<string, number>([
        ['a', 1],
        ['b', 2],
      ]);

      expect(sim(left, right)).toBeCloseTo(1, 6);
    });

    it('returns 0 when one vector has zero magnitude', () => {
      const left = new Map<string, number>();
      const right = new Map<string, number>([['a', 3]]);

      expect(sim(left, right)).toBe(0);
    });
  });

  describe('makeIdf', () => {
    it('gives lower idf to words that appear in more documents', () => {
      const vocabulary = new Set(['common', 'rare']);
      const docs = [
        { category: 'technical', words: ['common'] },
        { category: 'financial', words: ['common', 'rare'] },
      ];

      const idf = makeIdf(vocabulary, docs);

      expect(idf.get('common')!).toBeLessThan(idf.get('rare')!);
    });
  });

  describe('makeCategoryVectors', () => {
    it('builds category centroids from per-document vectors', () => {
      const categories = ['technical', 'financial'];
      const docs = [
        { category: 'technical', words: ['internet', 'internet'] },
        { category: 'financial', words: ['invoice'] },
      ];
      const idf = new Map<string, number>([
        ['internet', 2],
        ['invoice', 3],
      ]);
      const categoryCounts = new Map<string, number>([
        ['technical', 1],
        ['financial', 1],
      ]);

      const vectors = makeCategoryVectors(
        categories,
        docs,
        idf,
        categoryCounts,
      );

      expect(vectors.get('technical')?.get('internet')).toBeCloseTo(2, 6);
      expect(vectors.get('financial')?.get('invoice')).toBeCloseTo(3, 6);
    });
  });

  describe('makeDocs', () => {
    it('uses provided tokenizer for each sample', () => {
      const samples = [
        { text: 'Internet issue', category: 'technical' },
        { text: 'Billing problem', category: 'financial' },
      ];
      const splitWords = (text: string) => text.toLowerCase().split(' ');

      const docs = makeDocs(samples, splitWords);

      expect(docs).toEqual([
        { category: 'technical', words: ['internet', 'issue'] },
        { category: 'financial', words: ['billing', 'problem'] },
      ]);
    });
  });
});
