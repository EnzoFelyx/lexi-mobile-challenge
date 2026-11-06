import { SYNC_BATCH_SIZE, SYNC_PAGE_SIZE } from '@/constants/sync';
import type { LexiSupabaseClient } from '@/core/supabase/client';

import type { SyncPlan } from '../../domain/AccountData';
import { SupabaseRemoteAccountData } from '../SupabaseRemoteAccountData';

type Result = { data?: unknown; error: unknown };

/** Imita a consulta encadeada do Supabase; `await` devolve o próximo resultado da tabela. */
function createClient(results: Record<string, Result[]> = {}) {
  const calls: { table: string; method: string; args: unknown[] }[] = [];
  const from = (table: string) => {
    const query: Record<string, unknown> = {};
    ['select', 'eq', 'order', 'range', 'upsert', 'delete', 'in'].forEach((method) => {
      query[method] = (...args: unknown[]) => {
        calls.push({ table, method, args });
        return query;
      };
    });
    query.then = (resolve: (value: Result) => void) =>
      resolve(results[table]?.shift() ?? { data: [], error: null });
    return query;
  };
  return { client: { from } as unknown as LexiSupabaseClient, calls };
}

const EMPTY_PLAN: SyncPlan = {
  changes: [],
  favoritesToSave: [],
  favoritesToDelete: [],
  historyToSave: [],
  historyToDelete: [],
};

describe('SupabaseRemoteAccountData', () => {
  it('reads every page of both lists', async () => {
    const fullPage = Array.from({ length: SYNC_PAGE_SIZE }, (_, index) => ({
      word: `word${index}`,
      created_at: '2026-11-06T10:00:00+00:00',
    }));
    const { client } = createClient({
      favorites: [
        { data: fullPage, error: null },
        { data: [{ word: 'last', created_at: '2026-11-06T10:00:00+00:00' }], error: null },
      ],
      history: [{ data: [{ word: 'seen', viewed_at: '2026-11-06T10:00:00Z' }], error: null }],
    });

    const data = await new SupabaseRemoteAccountData(client).fetch('alex');

    expect(data.favorites).toHaveLength(SYNC_PAGE_SIZE + 1);
    expect(data.history).toEqual([{ word: 'seen', viewedAt: new Date('2026-11-06T10:00:00Z') }]);
  });

  it('rejects a server failure and a row out of format', async () => {
    const failure = new Error('offline');
    await expect(
      new SupabaseRemoteAccountData(createClient({ favorites: [{ error: failure }] }).client).fetch(
        'alex',
      ),
    ).rejects.toBe(failure);

    await expect(
      new SupabaseRemoteAccountData(
        createClient({ favorites: [{ data: [{ word: 1 }], error: null }] }).client,
      ).fetch('alex'),
    ).rejects.toThrow();
  });

  it('sends saves and deletions in batches, for this user', async () => {
    const { client, calls } = createClient();
    const createdAt = new Date('2026-11-06T10:00:00Z');
    const favoritesToSave = Array.from({ length: SYNC_BATCH_SIZE + 1 }, (_, index) => ({
      word: `word${index}`,
      createdAt,
    }));

    await new SupabaseRemoteAccountData(client).push('alex', {
      ...EMPTY_PLAN,
      favoritesToSave,
      historyToDelete: ['old'],
    });

    const upserts = calls.filter((call) => call.method === 'upsert');
    expect(upserts).toHaveLength(2);
    expect((upserts[0]?.args[0] as unknown[])[0]).toEqual({
      user_id: 'alex',
      word: 'word0',
      created_at: createdAt.toISOString(),
    });
    expect(calls).toContainEqual({ table: 'history', method: 'in', args: ['word', ['old']] });
    expect(calls).toContainEqual({ table: 'history', method: 'eq', args: ['user_id', 'alex'] });
  });

  it('stops when sending fails, so the queue stays', async () => {
    const failure = new Error('offline');
    const { client } = createClient({ favorites: [{ error: failure }] });

    await expect(
      new SupabaseRemoteAccountData(client).push('alex', {
        ...EMPTY_PLAN,
        favoritesToDelete: ['gone'],
      }),
    ).rejects.toBe(failure);
  });
});
