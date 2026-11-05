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

  it('lists the guest history from the most recent view', async () => {
    jest.setSystemTime(1000);
    await repository.recordView('hello', null);
    jest.setSystemTime(2000);
    await repository.recordView('today', null);
    await repository.recordView('other', 'user-1');
    jest.setSystemTime(3000);
    await repository.recordView('hello', null);

    expect(await repository.list(null)).toEqual(['hello', 'today']);
    expect(await repository.list('user-1')).toEqual(['other']);
  });

  it('lists the last recorded first when two views share the same instant', async () => {
    jest.setSystemTime(1000);
    await repository.recordView('hello', null);
    await repository.recordView('today', null);

    expect(await repository.list(null)).toEqual(['today', 'hello']);
  });

  it('lists nothing before the first view', async () => {
    expect(await repository.list(null)).toEqual([]);
  });

  it('clears the guest history and keeps the other users', async () => {
    await repository.recordView('hello', null);
    await repository.recordView('today', null);
    await repository.recordView('other', 'user-1');

    await repository.clear(null);

    expect(await repository.list(null)).toEqual([]);
    expect(await repository.list('user-1')).toEqual(['other']);
  });
});
