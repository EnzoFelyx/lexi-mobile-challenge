import { isListableWord } from '../listableWord';

describe('isListableWord', () => {
  it('keeps plain lowercase words', () => {
    expect(isListableWord('hello')).toBe(true);
  });

  it('leaves out words with hyphens, symbols, digits or capitals', () => {
    expect(isListableWord('jean-pierre')).toBe(false);
    expect(isListableWord("o'clock")).toBe(false);
    expect(isListableWord('mp3')).toBe(false);
    expect(isListableWord('Hello')).toBe(false);
  });
});
