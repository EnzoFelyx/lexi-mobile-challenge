import { QUERY_RETRY_COUNT } from '@/constants/query';
import { DictionaryRateLimitError } from '@/features/words/domain/DictionaryRateLimitError';

import { shouldRetry } from '../queryClient';

describe('shouldRetry', () => {
  it('retries ordinary failures a few times', () => {
    expect(shouldRetry(0, new Error('Network request failed'))).toBe(true);
    expect(shouldRetry(QUERY_RETRY_COUNT, new Error('Network request failed'))).toBe(false);
  });

  it('never retries an error marked as not retryable, like the API rate limit', () => {
    expect(shouldRetry(0, new DictionaryRateLimitError('hello'))).toBe(false);
  });
});
