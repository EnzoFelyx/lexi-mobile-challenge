import { formatDuration } from '../formatDuration';

describe('formatDuration', () => {
  it('formats seconds as m:ss, like the Figma player', () => {
    expect(formatDuration(2)).toBe('0:02');
    expect(formatDuration(1.6)).toBe('0:02');
    expect(formatDuration(75)).toBe('1:15');
  });

  it('never shows a negative time', () => {
    expect(formatDuration(-3)).toBe('0:00');
  });
});
