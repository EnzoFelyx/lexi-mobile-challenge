import { createTestDatabase, type TestDatabase } from '@/core/database/testing/createTestDatabase';

import { SqliteHistoryRepository } from '../SqliteHistoryRepository';

interface HistoryRow {
  user_id: string | null;
  word: string;
  viewed_at: number;
}

describe('SqliteHistoryRepository', () => {
  let testDatabase: TestDatabase;
  let repository: SqliteHistoryRepository;
  const rows = () =>
    testDatabase.sqlite
      .prepare('SELECT user_id, word, viewed_at FROM history ORDER BY id')
      .all() as HistoryRow[];

  beforeEach(() => {
    jest.useFakeTimers();
    testDatabase = createTestDatabase();
    repository = new SqliteHistoryRepository(testDatabase.database);
  });

  afterEach(() => {
    testDatabase.close();
    jest.useRealTimers();
  });

  it('records a word the guest opened', async () => {
    jest.setSystemTime(1000);

    await repository.recordView('hello', null);

    expect(rows()).toEqual([{ user_id: null, word: 'hello', viewed_at: 1000 }]);
  });

  it('updates the date instead of duplicating a word seen again', async () => {
    jest.setSystemTime(1000);
    await repository.recordView('hello', null);
    jest.setSystemTime(5000);

    await repository.recordView('hello', null);

    expect(rows()).toEqual([{ user_id: null, word: 'hello', viewed_at: 5000 }]);
  });

  it('keeps the guest and each user apart', async () => {
    jest.setSystemTime(1000);

    await repository.recordView('hello', null);
    await repository.recordView('hello', 'user-1');
    await repository.recordView('hello', 'user-2');
    await repository.recordView('hello', 'user-1');

    expect(rows().map((row) => row.user_id)).toEqual([null, 'user-1', 'user-2']);
  });
});
