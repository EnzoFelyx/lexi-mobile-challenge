import { NOT_FOUND_CACHE_TTL_MS } from '@/constants/words';
import { wordCache } from '@/core/database/schema';
import { createTestDatabase, type TestDatabase } from '@/core/database/testing/createTestDatabase';

import type { WordLookup } from '../../domain/WordDetail';
import { SqliteWordCacheRepository } from '../SqliteWordCacheRepository';

const FOUND: WordLookup = {
  status: 'found',
  detail: {
    word: 'hello',
    phonetic: '/həˈləʊ/',
    audioUrls: ['https://audio/hello-uk.mp3'],
    meanings: [
      { partOfSpeech: 'noun', definitions: [{ definition: 'A greeting.', example: null }] },
    ],
  },
};

describe('SqliteWordCacheRepository', () => {
  let testDatabase: TestDatabase;
  let repository: SqliteWordCacheRepository;

  beforeEach(() => {
    testDatabase = createTestDatabase();
    repository = new SqliteWordCacheRepository(testDatabase.database);
  });

  afterEach(() => testDatabase.close());

  it('lists only the words with a valid not found result', async () => {
    await repository.save(FOUND);
    await repository.save({ status: 'not_found', word: 'recent' });
    await repository.save({ status: 'not_found', word: 'expired' });
    testDatabase.sqlite
      .prepare('UPDATE word_cache SET fetched_at = ? WHERE word = ?')
      .run(Date.now() - NOT_FOUND_CACHE_TTL_MS - 1000, 'expired');

    await expect(repository.listNotFound()).resolves.toEqual(['recent']);
  });

  it('has nothing for a word never looked up', async () => {
    await expect(repository.get('hello')).resolves.toBeNull();
  });

  it('stores a found word and reads it back', async () => {
    await repository.save(FOUND);

    await expect(repository.get('hello')).resolves.toEqual(FOUND);
  });

  it('stores a word not found, without payload', async () => {
    await repository.save({ status: 'not_found', word: 'maucherite' });

    await expect(repository.get('maucherite')).resolves.toEqual({
      status: 'not_found',
      word: 'maucherite',
    });
  });

  it('replaces a cached 404 when the word is found later', async () => {
    await repository.save({ status: 'not_found', word: 'hello' });
    await repository.save(FOUND);

    await expect(repository.get('hello')).resolves.toEqual(FOUND);
  });

  it('forgets a "Word not found" after it expires, so the API is asked again', async () => {
    const expired = new Date(Date.now() - NOT_FOUND_CACHE_TTL_MS - 1000);
    await testDatabase.database
      .insert(wordCache)
      .values({ word: 'every', status: 'not_found', payload: null, fetchedAt: expired });

    await expect(repository.get('every')).resolves.toBeNull();
  });

  it('keeps a found word with no expiry', async () => {
    const longAgo = new Date(Date.now() - NOT_FOUND_CACHE_TTL_MS * 10);
    await testDatabase.database.insert(wordCache).values({
      word: 'hello',
      status: 'ok',
      payload: JSON.stringify(FOUND.status === 'found' ? FOUND.detail : null),
      fetchedAt: longAgo,
    });

    await expect(repository.get('hello')).resolves.toEqual(FOUND);
  });

  it('ignores a cached payload in an unexpected format', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await testDatabase.database
      .insert(wordCache)
      .values({ word: 'hello', status: 'ok', payload: '{"word":1}', fetchedAt: new Date() });

    await expect(repository.get('hello')).resolves.toBeNull();
  });
});
