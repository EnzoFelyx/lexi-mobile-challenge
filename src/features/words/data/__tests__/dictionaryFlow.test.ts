import { SEED_BATCH_SIZE, WORD_LIST_PAGE_SIZE } from '@/constants/words';
import type { Database } from '@/core/database/client';
import { createTestConnection } from '@/core/database/testing/createTestConnection';
import { createTestDatabase, type TestDatabase } from '@/core/database/testing/createTestDatabase';

import type { WordCursor } from '../../domain/WordRepository';
import { COMMON_WORD_TIERS } from '../commonWordTiers';
import { SqliteDictionarySeeder } from '../SqliteDictionarySeeder';
import { SqliteWordRepository } from '../SqliteWordRepository';

/**
 * Seed e paginação juntos, num SQLite de verdade: o SQL de inserção em lotes roda como no app e a
 * Word list lê o que ele gravou.
 */

// Mais de dois lotes, para cobrir lote cheio e lote final menor.
const RARE_WORD_COUNT = SEED_BATCH_SIZE * 2 + 1;
// Um pouco mais que uma página de palavras do Basic English.
const COMMON_WORDS = [...(COMMON_WORD_TIERS[0] ?? [])].slice(0, WORD_LIST_PAGE_SIZE + 10);
const RARE_WORDS = Array.from({ length: RARE_WORD_COUNT }, (_, index) => `zzrare${index}`);
const ALL_WORDS = [...RARE_WORDS, ...COMMON_WORDS];

const readWholeList = async (repository: SqliteWordRepository): Promise<string[]> => {
  const words: string[] = [];
  let cursor: WordCursor | null = null;
  do {
    const page = await repository.getPage(cursor, WORD_LIST_PAGE_SIZE);
    words.push(...page.words);
    cursor = page.nextCursor;
  } while (cursor);
  return words;
};

describe('dictionary seed and word list pagination', () => {
  let testDatabase: TestDatabase;
  let database: Database;
  let seeder: SqliteDictionarySeeder;
  let repository: SqliteWordRepository;

  beforeEach(() => {
    testDatabase = createTestDatabase();
    database = testDatabase.database;
    seeder = new SqliteDictionarySeeder(database, createTestConnection(testDatabase.sqlite));
    repository = new SqliteWordRepository(database);
  });

  afterEach(() => testDatabase.close());

  it('stores every word in batches and is seeded afterwards', async () => {
    const progress: number[] = [];

    await expect(seeder.isSeeded()).resolves.toBe(false);
    await seeder.seed(ALL_WORDS, (fraction) => progress.push(fraction));

    await expect(seeder.isSeeded()).resolves.toBe(true);
    const { count } = testDatabase.sqlite.prepare('SELECT count(*) AS count FROM words').get() as {
      count: number;
    };
    expect(count).toBe(ALL_WORDS.length);
    expect(progress).toEqual([1 / 3, 2 / 3, 1]);
  });

  it('keeps nothing when a batch fails, so the next launch seeds again', async () => {
    const connection = createTestConnection(testDatabase.sqlite);
    let batches = 0;
    const failing = {
      withExclusiveTransactionAsync: (
        task: Parameters<typeof connection.withExclusiveTransactionAsync>[0],
      ) =>
        connection.withExclusiveTransactionAsync(async (transaction) =>
          task({
            ...transaction,
            runAsync: async (...args: Parameters<typeof transaction.runAsync>) => {
              batches += 1;
              if (batches === 2) {
                throw new Error('disk full');
              }
              return transaction.runAsync(...args);
            },
          } as typeof transaction),
        ),
    } as typeof connection;
    const failingSeeder = new SqliteDictionarySeeder(database, failing);

    await expect(failingSeeder.seed(ALL_WORDS, jest.fn())).rejects.toThrow('disk full');

    await expect(seeder.isSeeded()).resolves.toBe(false);
  });

  it('opens the list with the common words and walks every word once', async () => {
    await seeder.seed(ALL_WORDS, jest.fn());

    const firstPage = await repository.getPage(null, WORD_LIST_PAGE_SIZE);
    const wholeList = await readWholeList(repository);

    const commonWords = new Set(COMMON_WORDS);
    expect(firstPage.words).toHaveLength(WORD_LIST_PAGE_SIZE);
    expect(firstPage.words.every((word) => commonWords.has(word))).toBe(true);
    expect(wholeList).toHaveLength(ALL_WORDS.length);
    expect(new Set(wholeList).size).toBe(ALL_WORDS.length);
    expect(wholeList.slice(0, COMMON_WORDS.length).every((word) => commonWords.has(word))).toBe(
      true,
    );
  });

  it('keeps the same order on every read', async () => {
    await seeder.seed(ALL_WORDS, jest.fn());

    const firstRead = await readWholeList(repository);
    const secondRead = await readWholeList(repository);

    expect(secondRead).toEqual(firstRead);
  });
});
