import { buildWordPage } from '../buildWordPage';

const rows = [
  { word: 'hello', sortKey: 1 },
  { word: 'today', sortKey: 2 },
  { word: 'great', sortKey: 3 },
];

describe('buildWordPage', () => {
  it('returns the page and a cursor at its last word when there are more rows', () => {
    expect(buildWordPage(rows, 2)).toEqual({
      words: ['hello', 'today'],
      nextCursor: { word: 'today', sortKey: 2 },
    });
  });

  it('has no next cursor when the rows fit in the page', () => {
    expect(buildWordPage(rows, 3)).toEqual({
      words: ['hello', 'today', 'great'],
      nextCursor: null,
    });
  });

  it('returns an empty last page without a cursor', () => {
    expect(buildWordPage([], 60)).toEqual({ words: [], nextCursor: null });
  });
});
