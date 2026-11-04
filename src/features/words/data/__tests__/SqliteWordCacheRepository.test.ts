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

  it('ignores a cached payload in an unexpected format', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await testDatabase.database
      .insert(wordCache)
      .values({ word: 'hello', status: 'ok', payload: '{"word":1}', fetchedAt: new Date() });

    await expect(repository.get('hello')).resolves.toBeNull();
  });
});
