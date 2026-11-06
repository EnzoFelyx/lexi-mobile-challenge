import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { SYNC_BATCH_SIZE, SYNC_PAGE_SIZE } from '@/constants/sync';
import { TOKENS } from '@/core/di/tokens';
import type { LexiSupabaseClient } from '@/core/supabase/client';

import type { AccountData, SyncPlan } from '../domain/AccountData';
import type { RemoteAccountData } from '../domain/AccountSync';

const favoriteRowSchema = z.object({
  word: z.string(),
  created_at: z.iso.datetime({ offset: true }),
});
const historyRowSchema = z.object({
  word: z.string(),
  viewed_at: z.iso.datetime({ offset: true }),
});

const inBatches = <T>(items: readonly T[]): T[][] =>
  Array.from({ length: Math.ceil(items.length / SYNC_BATCH_SIZE) }, (_, index) =>
    items.slice(index * SYNC_BATCH_SIZE, (index + 1) * SYNC_BATCH_SIZE),
  );

/** Lê todas as páginas de uma consulta; uma página incompleta é a última. */
async function fetchAllPages<T>(
  loadPage: (from: number, to: number) => PromiseLike<{ data: unknown; error: unknown }>,
  schema: z.ZodType<T>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += SYNC_PAGE_SIZE) {
    const { data, error } = await loadPage(from, from + SYNC_PAGE_SIZE - 1);
    if (error) {
      throw error;
    }
    const page = z.array(schema).parse(data);
    rows.push(...page);
    if (page.length < SYNC_PAGE_SIZE) {
      return rows;
    }
  }
}

const throwOnError = ({ error }: { error: unknown }) => {
  if (error) {
    throw error;
  }
};

@injectable()
export class SupabaseRemoteAccountData implements RemoteAccountData {
  constructor(@inject(TOKENS.SupabaseClient) private readonly client: LexiSupabaseClient) {}

  async fetch(userId: string): Promise<AccountData> {
    const [favorites, history] = await Promise.all([
      fetchAllPages(
        (from, to) =>
          this.client
            .from('favorites')
            .select('word, created_at')
            .eq('user_id', userId)
            .order('word')
            .range(from, to),
        favoriteRowSchema,
      ),
      fetchAllPages(
        (from, to) =>
          this.client
            .from('history')
            .select('word, viewed_at')
            .eq('user_id', userId)
            .order('word')
            .range(from, to),
        historyRowSchema,
      ),
    ]);
    return {
      favorites: favorites.map(({ word, created_at }) => ({
        word,
        createdAt: new Date(created_at),
      })),
      history: history.map(({ word, viewed_at }) => ({ word, viewedAt: new Date(viewed_at) })),
    };
  }

  async push(userId: string, plan: SyncPlan): Promise<void> {
    for (const batch of inBatches(plan.favoritesToSave)) {
      throwOnError(
        await this.client.from('favorites').upsert(
          batch.map(({ word, createdAt }) => ({
            user_id: userId,
            word,
            created_at: createdAt.toISOString(),
          })),
          { onConflict: 'user_id,word', ignoreDuplicates: true },
        ),
      );
    }
    for (const batch of inBatches(plan.favoritesToDelete)) {
      throwOnError(
        await this.client.from('favorites').delete().eq('user_id', userId).in('word', batch),
      );
    }
    for (const batch of inBatches(plan.historyToSave)) {
      throwOnError(
        await this.client.from('history').upsert(
          batch.map(({ word, viewedAt }) => ({
            user_id: userId,
            word,
            viewed_at: viewedAt.toISOString(),
          })),
          { onConflict: 'user_id,word' },
        ),
      );
    }
    for (const batch of inBatches(plan.historyToDelete)) {
      throwOnError(
        await this.client.from('history').delete().eq('user_id', userId).in('word', batch),
      );
    }
  }
}
