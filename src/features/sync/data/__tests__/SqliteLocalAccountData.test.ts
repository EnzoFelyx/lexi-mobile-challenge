import { createTestDatabase, type TestDatabase } from '@/core/database/testing/createTestDatabase';
import { SqliteFavoritesRepository } from '@/features/favorites/data/SqliteFavoritesRepository';
import { SqliteHistoryRepository } from '@/features/history/data/SqliteHistoryRepository';

import { SqliteLocalAccountData } from '../SqliteLocalAccountData';

const ALEX = 'user-alex';
const SAM = 'user-sam';

describe('SqliteLocalAccountData', () => {
  let testDatabase: TestDatabase;
  let favorites: SqliteFavoritesRepository;
  let history: SqliteHistoryRepository;
  let local: SqliteLocalAccountData;

  const emptyRemote = { favorites: [], history: [] };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(1000);
    testDatabase = createTestDatabase();
    favorites = new SqliteFavoritesRepository(testDatabase.database);
    history = new SqliteHistoryRepository(testDatabase.database);
    local = new SqliteLocalAccountData(testDatabase.database);
  });

  afterEach(() => {
    testDatabase.close();
    jest.useRealTimers();
  });

  it('queues the changes of an account, but not the ones of a guest', async () => {
    await favorites.add('guest-word', null);
    await favorites.add('hello', ALEX);
    await history.recordView('today', ALEX);

    const plan = await local.reconcile(ALEX, emptyRemote);

    expect(plan.favoritesToSave.map((item) => item.word)).toEqual(['hello']);
    expect(plan.historyToSave.map((item) => item.word)).toEqual(['today']);
  });

  it('queues a removal and the words of a cleared history', async () => {
    await favorites.add('hello', ALEX);
    await history.recordView('today', ALEX);
    await local.markSynced(await local.reconcile(ALEX, emptyRemote));

    await favorites.remove('hello', ALEX);
    await history.clear(ALEX);

    const remote = {
      favorites: [{ word: 'hello', createdAt: new Date(1000) }],
      history: [{ word: 'today', viewedAt: new Date(1000) }],
    };
    const plan = await local.reconcile(ALEX, remote);
    expect(plan.favoritesToDelete).toEqual(['hello']);
    expect(plan.historyToDelete).toEqual(['today']);
    expect(await favorites.list(ALEX)).toEqual([]);
    expect(await history.list(ALEX)).toEqual([]);
  });

  it('moves the guest data to the account: union of favorites, most recent view', async () => {
    await favorites.add('both', ALEX);
    await history.recordView('both', ALEX);
    jest.setSystemTime(5000);
    await favorites.add('both', null);
    await favorites.add('guest-only', null);
    await history.recordView('both', null);

    await local.mergeGuestData(ALEX);

    expect(await favorites.list(null)).toEqual([]);
    expect(await history.list(null)).toEqual([]);
    expect((await favorites.list(ALEX)).sort()).toEqual(['both', 'guest-only']);
    const plan = await local.reconcile(ALEX, emptyRemote);
    expect(plan.historyToSave).toEqual([{ word: 'both', viewedAt: new Date(5000) }]);
  });

  it('keeps an older guest view from replacing a newer account view', async () => {
    await history.recordView('both', null);
    jest.setSystemTime(9000);
    await history.recordView('both', ALEX);

    await local.mergeGuestData(ALEX);

    const plan = await local.reconcile(ALEX, emptyRemote);
    expect(plan.historyToSave).toEqual([{ word: 'both', viewedAt: new Date(9000) }]);
  });

  it('brings what the server has to the device and leaves the queue empty after sending', async () => {
    const remote = {
      favorites: [{ word: 'from-server', createdAt: new Date(1) }],
      history: [{ word: 'seen-there', viewedAt: new Date(1) }],
    };

    const plan = await local.reconcile(ALEX, remote);
    await local.markSynced(plan);

    expect(await favorites.list(ALEX)).toEqual(['from-server']);
    expect(await history.list(ALEX)).toEqual(['seen-there']);
    expect((await local.reconcile(ALEX, remote)).changes).toEqual([]);
  });

  it('keeps in the queue a word that changed again during the send', async () => {
    await favorites.add('hello', ALEX);
    const plan = await local.reconcile(ALEX, emptyRemote);

    jest.setSystemTime(2000);
    await favorites.remove('hello', ALEX);
    await local.markSynced(plan);

    const next = await local.reconcile(ALEX, emptyRemote);
    expect(next.favoritesToDelete).toEqual(['hello']);
  });

  it('deletes only the data of the account that left', async () => {
    await favorites.add('guest-word', null);
    await favorites.add('alex-word', ALEX);
    await favorites.add('sam-word', SAM);
    await history.recordView('alex-word', ALEX);

    await local.deleteAccountData(ALEX);

    expect(await favorites.list(ALEX)).toEqual([]);
    expect(await history.list(ALEX)).toEqual([]);
    expect(await favorites.list(null)).toEqual(['guest-word']);
    expect(await favorites.list(SAM)).toEqual(['sam-word']);
    expect((await local.reconcile(ALEX, emptyRemote)).changes).toEqual([]);
  });
});
