import { act, renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import { DictionaryRateLimitError } from '../../domain/DictionaryRateLimitError';
import type { DictionaryService } from '../../domain/DictionaryService';
import type { WordCacheRepository } from '../../domain/WordCacheRepository';
import type { WordDetail, WordLookup } from '../../domain/WordDetail';
import { useWordDetail } from '../useWordDetail';

const HELLO: WordDetail = { word: 'hello', phonetic: '/həˈləʊ/', audioUrls: [], meanings: [] };

const register = (cached: WordLookup | null, lookup: DictionaryService['lookup']) => {
  const cache: WordCacheRepository = {
    get: jest.fn().mockResolvedValue(cached),
    save: jest.fn().mockResolvedValue(undefined),
  };
  const service: DictionaryService = { lookup: jest.fn(lookup) };
  container.registerInstance<WordCacheRepository>(TOKENS.WordCacheRepository, cache);
  container.registerInstance<DictionaryService>(TOKENS.DictionaryService, service);
  return { cache, service };
};

describe('useWordDetail', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('starts loading and then shows the word found', async () => {
    register(null, async () => ({ status: 'found', detail: HELLO }));

    const { result } = await renderHook(() => useWordDetail('hello'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.state).toEqual({ status: 'found', detail: HELLO }));
  });

  it('opens from the device cache without calling the API', async () => {
    const { service } = register({ status: 'found', detail: HELLO }, jest.fn());

    const { result } = await renderHook(() => useWordDetail('hello'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.state.status).toBe('found'));
    expect(service.lookup).not.toHaveBeenCalled();
  });

  it('keeps the word in memory, so opening it again skips the device cache', async () => {
    const { cache } = register(null, async () => ({ status: 'found', detail: HELLO }));
    const wrapper = createQueryClientWrapper();
    const first = await renderHook(() => useWordDetail('hello'), { wrapper });
    await waitFor(() => expect(first.result.current.state.status).toBe('found'));

    const second = await renderHook(() => useWordDetail('hello'), { wrapper });

    expect(second.result.current.state.status).toBe('found');
    expect(cache.get).toHaveBeenCalledTimes(1);
  });

  it('retries a word not found by asking the API again, past the cached 404', async () => {
    const { service } = register({ status: 'not_found', word: 'colour' }, async () => ({
      status: 'found',
      detail: { ...HELLO, word: 'colour' },
    }));
    const { result } = await renderHook(() => useWordDetail('colour'), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.state.status).toBe('not_found'));

    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.state.status).toBe('found'));
    expect(service.lookup).toHaveBeenCalledWith('colour');
  });

  it('tells apart the API rate limit from other failures', async () => {
    register(null, async () => {
      throw new DictionaryRateLimitError('hello');
    });

    const { result } = await renderHook(() => useWordDetail('hello'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'error', reason: 'rate_limited' }),
    );
  });

  it('shows an error on a network failure and recovers on retry', async () => {
    let online = false;
    register(null, async () => {
      if (!online) {
        throw new Error('Network request failed');
      }
      return { status: 'found', detail: HELLO };
    });
    const { result } = await renderHook(() => useWordDetail('hello'), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() =>
      expect(result.current.state).toEqual({ status: 'error', reason: 'unavailable' }),
    );

    online = true;
    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.state.status).toBe('found'));
  });
});
