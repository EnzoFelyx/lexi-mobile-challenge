import type { SQLiteDatabase } from 'expo-sqlite';

import { SEED_BATCH_SIZE } from '@/constants/words';
import type { Database } from '@/core/database/client';

import { SqliteDictionarySeeder } from '../SqliteDictionarySeeder';

const databaseReturning = (rows: unknown[]): Database =>
  ({
    select: () => ({ from: () => ({ limit: async () => rows }) }),
  }) as unknown as Database;

const fakeConnection = () => {
  const runAsync = jest.fn().mockResolvedValue({ changes: 0, lastInsertRowId: 0 });
  const connection = {
    withExclusiveTransactionAsync: jest.fn(
      async (task: (transaction: { runAsync: typeof runAsync }) => Promise<void>) =>
        task({ runAsync }),
    ),
  } as unknown as SQLiteDatabase;
  return { connection, runAsync };
};

describe('SqliteDictionarySeeder', () => {
  it('is seeded when the words table already has rows', async () => {
    const { connection } = fakeConnection();
    const seeder = new SqliteDictionarySeeder(databaseReturning([{ word: 'a' }]), connection);

    await expect(seeder.isSeeded()).resolves.toBe(true);
  });

  it('is not seeded when the words table is empty', async () => {
    const { connection } = fakeConnection();
    const seeder = new SqliteDictionarySeeder(databaseReturning([]), connection);

    await expect(seeder.isSeeded()).resolves.toBe(false);
  });

  it('writes every word in batches inside one transaction, reporting progress', async () => {
    const { connection, runAsync } = fakeConnection();
    const seeder = new SqliteDictionarySeeder(databaseReturning([]), connection);
    const words = Array.from({ length: SEED_BATCH_SIZE * 2 + 1 }, (_, index) => `word${index}`);
    const onProgress = jest.fn();

    await seeder.seed(words, onProgress);

    expect(connection.withExclusiveTransactionAsync).toHaveBeenCalledTimes(1);
    expect(runAsync).toHaveBeenCalledTimes(3);
    const [lastSql, lastParams] = runAsync.mock.calls[2];
    expect(lastSql).toBe('INSERT OR IGNORE INTO words (word, sort_key) VALUES (?, ?)');
    expect(lastParams).toEqual([`word${SEED_BATCH_SIZE * 2}`, expect.any(Number)]);
    expect(onProgress.mock.calls.map(([fraction]) => fraction)).toEqual([1 / 3, 2 / 3, 1]);
  });

  it('propagates a write failure so the transaction rolls back', async () => {
    const { connection, runAsync } = fakeConnection();
    runAsync.mockRejectedValueOnce(new Error('disk full'));
    const seeder = new SqliteDictionarySeeder(databaseReturning([]), connection);

    await expect(seeder.seed(['a'], jest.fn())).rejects.toThrow('disk full');
  });
});
