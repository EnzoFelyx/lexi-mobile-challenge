import { WORD_SORT_KEY_RANGE } from '@/constants/words';

import { toWordSeedRows } from '../wordSeedRows';

describe('toWordSeedRows', () => {
  it('gives each word an integer sort key within the range', () => {
    const randoms = [0, 0.5, 0.999999];
    const random = jest.fn(() => randoms.shift() ?? 0);

    const rows = toWordSeedRows(['a', 'hello', 'zebra'], random);

    expect(rows).toEqual([
      { word: 'a', sortKey: 0 },
      { word: 'hello', sortKey: WORD_SORT_KEY_RANGE / 2 },
      { word: 'zebra', sortKey: Math.floor(0.999999 * WORD_SORT_KEY_RANGE) },
    ]);
    rows.forEach((row) => expect(Number.isInteger(row.sortKey)).toBe(true));
  });

  it('puts each priority tier before the next one and the other words last', () => {
    const tiers = [new Set(['hello']), new Set(['peace'])];
    // Mesmo sorteio para todas: só a camada decide a ordem.
    const rows = toWordSeedRows(['maucherite', 'peace', 'hello'], () => 0.9, tiers);

    const order = [...rows].sort((a, b) => a.sortKey - b.sortKey).map((row) => row.word);

    expect(order).toEqual(['hello', 'peace', 'maucherite']);
    expect(rows.find((row) => row.word === 'maucherite')?.sortKey).toBeGreaterThanOrEqual(
      2 * WORD_SORT_KEY_RANGE,
    );
  });
});
