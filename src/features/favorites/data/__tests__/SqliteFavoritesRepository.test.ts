import { createTestDatabase, type TestDatabase } from '@/core/database/testing/createTestDatabase';

import { SqliteFavoritesRepository } from '../SqliteFavoritesRepository';

describe('SqliteFavoritesRepository', () => {
  let testDatabase: TestDatabase;
  let repository: SqliteFavoritesRepository;
  const rowCount = () =>
    (
      testDatabase.sqlite.prepare('SELECT count(*) AS total FROM favorites').get() as {
        total: number;
      }
    ).total;

  beforeEach(() => {
    jest.useFakeTimers();
    testDatabase = createTestDatabase();
    repository = new SqliteFavoritesRepository(testDatabase.database);
  });

  afterEach(() => {
    testDatabase.close();
    jest.useRealTimers();
  });

  it('lists the guest favorites from the most recent', async () => {
    jest.setSystemTime(1000);
    await repository.add('hello', null);
    jest.setSystemTime(2000);
    await repository.add('today', null);

    expect(await repository.list(null)).toEqual(['today', 'hello']);
  });

  it('does not duplicate a word saved twice, keeping its first date', async () => {
    jest.setSystemTime(1000);
    await repository.add('hello', null);
    jest.setSystemTime(2000);
    await repository.add('today', null);
    jest.setSystemTime(3000);
    await repository.add('hello', null);

    expect(rowCount()).toBe(2);
    expect(await repository.list(null)).toEqual(['today', 'hello']);
  });

  it('removes a favorite, and ignores a word that was not saved', async () => {
    await repository.add('hello', null);
    await repository.add('today', null);

    await repository.remove('hello', null);
    await repository.remove('never-saved', null);

    expect(await repository.list(null)).toEqual(['today']);
  });

  it('keeps the guest and each user apart', async () => {
    await repository.add('hello', null);
    await repository.add('hello', 'user-1');
    await repository.add('today', 'user-2');

    await repository.remove('hello', 'user-1');

    expect(await repository.list(null)).toEqual(['hello']);
    expect(await repository.list('user-1')).toEqual([]);
    expect(await repository.list('user-2')).toEqual(['today']);
  });
});
