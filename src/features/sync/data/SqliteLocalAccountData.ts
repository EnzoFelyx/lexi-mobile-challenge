import { and, eq, isNull, sql } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import type { Database } from '@/core/database/client';
import { type DatabaseWriter, recordPendingChange } from '@/core/database/pendingSync';
import { favorites, history, pendingSync } from '@/core/database/schema';
import { TOKENS } from '@/core/di/tokens';

import type { AccountData, SyncPlan } from '../domain/AccountData';
import type { LocalAccountData } from '../domain/AccountSync';
import { buildSyncPlan, reconcileAccountData } from '../domain/reconcileAccountData';

const readLocal = (writer: DatabaseWriter, userId: string): AccountData => ({
  favorites: writer
    .select({ word: favorites.word, createdAt: favorites.createdAt })
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .all(),
  history: writer
    .select({ word: history.word, viewedAt: history.viewedAt })
    .from(history)
    .where(eq(history.userId, userId))
    .all(),
});

@injectable()
export class SqliteLocalAccountData implements LocalAccountData {
  constructor(@inject(TOKENS.Database) private readonly database: Database) {}

  async mergeGuestData(userId: string): Promise<void> {
    this.database.transaction((transaction) => {
      const guestFavorites = transaction
        .select({ word: favorites.word, createdAt: favorites.createdAt })
        .from(favorites)
        .where(isNull(favorites.userId))
        .all();
      guestFavorites.forEach(({ word, createdAt }) => {
        transaction
          .insert(favorites)
          .values({ userId, word, createdAt })
          .onConflictDoNothing()
          .run();
        recordPendingChange(transaction, userId, 'favorite', word, 'upsert');
      });

      const guestHistory = transaction
        .select({ word: history.word, viewedAt: history.viewedAt })
        .from(history)
        .where(isNull(history.userId))
        .all();
      guestHistory.forEach(({ word, viewedAt }) => {
        transaction
          .update(history)
          .set({ viewedAt: sql`max(${history.viewedAt}, ${viewedAt.getTime()})` })
          .where(and(eq(history.userId, userId), eq(history.word, word)))
          .run();
        transaction.insert(history).values({ userId, word, viewedAt }).onConflictDoNothing().run();
        recordPendingChange(transaction, userId, 'history', word, 'upsert');
      });

      transaction.delete(favorites).where(isNull(favorites.userId)).run();
      transaction.delete(history).where(isNull(history.userId)).run();
    });
  }

  async reconcile(userId: string, remote: AccountData): Promise<SyncPlan> {
    return this.database.transaction((transaction) => {
      const changes = transaction
        .select()
        .from(pendingSync)
        .where(eq(pendingSync.userId, userId))
        .all();
      const final = reconcileAccountData(remote, readLocal(transaction, userId), changes);

      transaction.delete(favorites).where(eq(favorites.userId, userId)).run();
      transaction.delete(history).where(eq(history.userId, userId)).run();
      final.favorites.forEach((favorite) =>
        transaction
          .insert(favorites)
          .values({ userId, ...favorite })
          .run(),
      );
      final.history.forEach((view) =>
        transaction
          .insert(history)
          .values({ userId, ...view })
          .run(),
      );
      return buildSyncPlan(final, changes);
    });
  }

  async markSynced({ changes }: SyncPlan): Promise<void> {
    this.database.transaction((transaction) => {
      changes.forEach(({ id, changedAt }) =>
        transaction
          .delete(pendingSync)
          .where(and(eq(pendingSync.id, id), eq(pendingSync.changedAt, changedAt)))
          .run(),
      );
    });
  }

  async deleteAccountData(userId: string): Promise<void> {
    this.database.transaction((transaction) => {
      transaction.delete(favorites).where(eq(favorites.userId, userId)).run();
      transaction.delete(history).where(eq(history.userId, userId)).run();
      transaction.delete(pendingSync).where(eq(pendingSync.userId, userId)).run();
    });
  }
}
