import { resolveIndex } from '../wordNavigation';

const WORDS = ['hello', 'today', 'great'];

describe('resolveIndex', () => {
  it('keeps the index when the word is where the route says', () => {
    expect(resolveIndex(WORDS, 'today', 1)).toBe(1);
  });

  it('finds the word when the list changed since the detail opened', () => {
    expect(resolveIndex(WORDS, 'great', 0)).toBe(2);
  });

  it('has no position for a word that is not in the list', () => {
    expect(resolveIndex(WORDS, 'peace', 0)).toBeNull();
  });
});
