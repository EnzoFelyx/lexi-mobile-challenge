import type { DictionaryService } from '../DictionaryService';
import { lookUpWord } from '../lookUpWord';
import type { WordCacheRepository } from '../WordCacheRepository';
import type { WordLookup } from '../WordDetail';

const FOUND: WordLookup = {
  status: 'found',
  detail: { word: 'hello', phonetic: '/həˈləʊ/', audioUrls: [], meanings: [] },
};
const NOT_FOUND: WordLookup = { status: 'not_found', word: 'maucherite' };

const memoryCache = (initial: WordLookup[] = []): WordCacheRepository & { saved: WordLookup[] } => {
  const saved = [...initial];
  const keyOf = (lookup: WordLookup) =>
    lookup.status === 'found' ? lookup.detail.word : lookup.word;
  return {
    saved,
    get: async (word) => saved.findLast((lookup) => keyOf(lookup) === word) ?? null,
    save: async (lookup) => {
      saved.push(lookup);
    },
    listNotFound: async () => [],
  };
};

describe('lookUpWord', () => {
  it('answers from the cache without calling the API', async () => {
    const service: DictionaryService = { lookup: jest.fn() };

    const result = await lookUpWord('hello', memoryCache([FOUND]), service);

    expect(result).toEqual(FOUND);
    expect(service.lookup).not.toHaveBeenCalled();
  });

  it('calls the API on a cache miss and stores the answer', async () => {
    const cache = memoryCache();
    const service: DictionaryService = { lookup: jest.fn().mockResolvedValue(FOUND) };

    const result = await lookUpWord('hello', cache, service);

    expect(result).toEqual(FOUND);
    expect(cache.saved).toEqual([FOUND]);
  });

  it('caches a 404 so the API is not called again for that word', async () => {
    const cache = memoryCache();
    const service: DictionaryService = { lookup: jest.fn().mockResolvedValue(NOT_FOUND) };

    await lookUpWord('maucherite', cache, service);
    const second = await lookUpWord('maucherite', cache, service);

    expect(second).toEqual(NOT_FOUND);
    expect(service.lookup).toHaveBeenCalledTimes(1);
  });

  it('asks the API again when refreshing, even with a cached 404', async () => {
    const cache = memoryCache([NOT_FOUND]);
    const service: DictionaryService = {
      lookup: jest.fn().mockResolvedValue({ status: 'not_found', word: 'maucherite' }),
    };

    await lookUpWord('maucherite', cache, service, { refresh: true });

    expect(service.lookup).toHaveBeenCalledWith('maucherite');
  });

  it('does not cache a network failure, so the next try can succeed', async () => {
    const cache = memoryCache();
    const service: DictionaryService = {
      lookup: jest.fn().mockRejectedValue(new Error('Network request failed')),
    };

    await expect(lookUpWord('hello', cache, service)).rejects.toThrow('Network request failed');
    expect(cache.saved).toEqual([]);
  });
});
