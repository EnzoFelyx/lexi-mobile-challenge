import { parseWordDetailParams } from '../wordDetailParams';

describe('parseWordDetailParams', () => {
  it('reads the word with its source list and position', () => {
    expect(parseWordDetailParams({ word: 'hello', source: 'words', index: '12' })).toEqual({
      word: 'hello',
      position: { source: 'words', index: 12 },
    });
  });

  it('opens the word without navigation when the route does not say where it came from', () => {
    expect(parseWordDetailParams({ word: 'hello' })).toEqual({ word: 'hello', position: null });
  });

  it('keeps the word but drops an invalid source or position', () => {
    expect(parseWordDetailParams({ word: 'hello', source: 'search', index: '-1' })).toEqual({
      word: 'hello',
      position: null,
    });
  });

  it('has nothing to open without a word', () => {
    expect(parseWordDetailParams({ source: 'words', index: '0' })).toBeNull();
  });
});
