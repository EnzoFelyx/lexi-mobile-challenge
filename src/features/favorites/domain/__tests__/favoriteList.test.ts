import { withFavorite } from '../favoriteList';

describe('withFavorite', () => {
  it('puts a new favorite at the top', () => {
    expect(withFavorite(['today', 'hello'], 'great', true)).toEqual(['great', 'today', 'hello']);
  });

  it('removes an unfavorited word', () => {
    expect(withFavorite(['today', 'hello'], 'today', false)).toEqual(['hello']);
  });

  it('never repeats a word already in the list', () => {
    expect(withFavorite(['today', 'hello'], 'hello', true)).toEqual(['hello', 'today']);
  });

  it('does not change the original list', () => {
    const words = ['today'];

    withFavorite(words, 'hello', true);

    expect(words).toEqual(['today']);
  });
});
