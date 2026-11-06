import type { AccountData, PendingChange } from '../AccountData';
import { buildSyncPlan, reconcileAccountData } from '../reconcileAccountData';

const at = (time: number) => new Date(time);

const change = (
  kind: PendingChange['kind'],
  word: string,
  operation: PendingChange['operation'],
): PendingChange => ({ id: 1, kind, word, operation, changedAt: at(1) });

const EMPTY: AccountData = { favorites: [], history: [] };

describe('reconcileAccountData', () => {
  it('joins the favorites of the server and the unsent ones of the device', () => {
    const remote = { ...EMPTY, favorites: [{ word: 'hello', createdAt: at(1) }] };
    const local = { ...EMPTY, favorites: [{ word: 'today', createdAt: at(2) }] };

    const final = reconcileAccountData(remote, local, [change('favorite', 'today', 'upsert')]);

    expect(final.favorites.map((item) => item.word)).toEqual(['hello', 'today']);
  });

  it('keeps a favorite removed on this device out, even if the server still has it', () => {
    const remote = { ...EMPTY, favorites: [{ word: 'hello', createdAt: at(1) }] };

    const final = reconcileAccountData(remote, EMPTY, [change('favorite', 'hello', 'delete')]);

    expect(final.favorites).toEqual([]);
  });

  it('removes what was deleted on another device', () => {
    const local = { ...EMPTY, favorites: [{ word: 'hello', createdAt: at(1) }] };

    expect(reconcileAccountData(EMPTY, local, []).favorites).toEqual([]);
  });

  it('keeps the most recent view of a word, on either side', () => {
    const remote = {
      ...EMPTY,
      history: [
        { word: 'newer-here', viewedAt: at(1) },
        { word: 'newer-there', viewedAt: at(9) },
      ],
    };
    const local = {
      ...EMPTY,
      history: [
        { word: 'newer-here', viewedAt: at(5) },
        { word: 'newer-there', viewedAt: at(5) },
      ],
    };

    const final = reconcileAccountData(remote, local, [
      change('history', 'newer-here', 'upsert'),
      change('history', 'newer-there', 'upsert'),
    ]);

    expect(final.history).toEqual([
      { word: 'newer-here', viewedAt: at(5) },
      { word: 'newer-there', viewedAt: at(9) },
    ]);
  });
});

describe('buildSyncPlan', () => {
  it('sends only what is in the queue, with the final values', () => {
    const final = {
      favorites: [
        { word: 'hello', createdAt: at(1) },
        { word: 'already-there', createdAt: at(1) },
      ],
      history: [{ word: 'hello', viewedAt: at(9) }],
    };
    const changes = [
      change('favorite', 'hello', 'upsert'),
      change('favorite', 'gone', 'delete'),
      change('history', 'hello', 'upsert'),
      change('history', 'old', 'delete'),
    ];

    expect(buildSyncPlan(final, changes)).toEqual({
      changes,
      favoritesToSave: [{ word: 'hello', createdAt: at(1) }],
      favoritesToDelete: ['gone'],
      historyToSave: [{ word: 'hello', viewedAt: at(9) }],
      historyToDelete: ['old'],
    });
  });
});
