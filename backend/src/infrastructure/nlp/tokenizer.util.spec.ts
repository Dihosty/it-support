import { splitWords } from './tokenizer.util';

describe('tokenizer.util', () => {
  it('normalizes casing and removes punctuation', () => {
    const words = splitWords('My, INTERNET!!! is not working.');

    expect(words).toEqual(['my', 'internet', 'is', 'not', 'working']);
  });

  it('supports ukrainian letters and drops one-character tokens', () => {
    const words = splitWords('Я не маю wi-fi, а інтернет є');

    expect(words).toEqual(['не', 'маю', 'wi', 'fi', 'інтернет']);
  });

  it('returns empty list when text contains only separators', () => {
    const words = splitWords('...   !!!   ???');

    expect(words).toEqual([]);
  });
});
