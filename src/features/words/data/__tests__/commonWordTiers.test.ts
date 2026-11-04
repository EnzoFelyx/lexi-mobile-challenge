import { COMMON_WORD_TIERS } from '../commonWordTiers';

describe('COMMON_WORD_TIERS', () => {
  const [basicEnglish, frequent] = COMMON_WORD_TIERS;

  it('starts with Basic English, followed by the most frequent words', () => {
    expect(COMMON_WORD_TIERS).toHaveLength(2);
    expect(basicEnglish?.has('hello')).toBe(false);
    expect(basicEnglish?.has('apple')).toBe(true);
    expect(frequent?.size).toBeGreaterThan(basicEnglish?.size ?? 0);
  });

  it('keeps every word lowercase letters only and in a single tier', () => {
    const all = COMMON_WORD_TIERS.flatMap((tier) => [...tier]);

    expect(all.every((word) => /^[a-z]+$/.test(word))).toBe(true);
    expect(new Set(all).size).toBe(all.length);
  });
});
