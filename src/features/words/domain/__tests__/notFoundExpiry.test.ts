import { NOT_FOUND_CACHE_TTL_MS } from '@/constants/words';

import { isNotFoundStillValid, notFoundCutoff } from '../notFoundExpiry';

const NOW = new Date('2026-11-04T12:00:00Z');

describe('not found expiry', () => {
  it('keeps a recent "Word not found"', () => {
    const yesterday = new Date(NOW.getTime() - 24 * 60 * 60 * 1000);

    expect(isNotFoundStillValid(yesterday, NOW)).toBe(true);
  });

  it('lets a "Word not found" older than the expiry go, so the word can come back', () => {
    const tooOld = new Date(NOW.getTime() - NOT_FOUND_CACHE_TTL_MS - 1);

    expect(isNotFoundStillValid(tooOld, NOW)).toBe(false);
    expect(notFoundCutoff(NOW).getTime()).toBe(NOW.getTime() - NOT_FOUND_CACHE_TTL_MS);
  });
});
