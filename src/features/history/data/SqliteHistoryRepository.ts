import { and, desc, eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import type { Database } from '@/core/database/client';
import { ownedBy } from '@/core/database/ownership';
import { recordPendingChange } from '@/core/database/pendingSync';
import { history } from '@/core/database/schema';
import { historyRowSchema, parseRows } from '@/core/database/validation';
import { TOKENS } from '@/core/di/tokens';

import type { HistoryRepository } from '../domain/HistoryRepository';

const historyWordSchema = historyRowSchema.pick({ word: true });

@injectable()
export class SqliteHistoryRepository implements HistoryRepository {
  constructor(@inject(TOKENS.Database) private readonly database: Database) {}

  /**
   * Atualiza e, se não havia linha, insere. O upsert direto precisaria apontar para o índice com
   * a expressão do visitante, que os tipos do Drizzle não aceitam. Se dois registros chegarem
   * juntos, o índice único barra o segundo (`onConflictDoNothing`).
   */
  async recordView(word: string, userId: string | null): Promise<void> {
    const viewedAt = new Date();

    this.database.transaction((transaction) => {
      const updated = transaction
        .update(history)
        .set({ viewedAt })
        .where(and(ownedBy(history.userId, userId), eq(history.word, word)))
        .returning({ id: history.id })
        .all();
      if (updated.length === 0) {
        transaction.insert(history).values({ userId, word, viewedAt }).onConflictDoNothing().run();
      }
      recordPendingChange(transaction, userId, 'history', word, 'upsert');
    });
  }

  /** Lista inteira, sem paginação: é o próprio usuário que a monta (CLAUDE.md 6.3). */
  async list(userId: string | null): Promise<string[]> {
    const rows = await this.database
      .select({ word: history.word })
      .from(history)
      .where(ownedBy(history.userId, userId))
      // O id desempata duas visitas no mesmo milissegundo: a gravada depois vem antes.
      .orderBy(desc(history.viewedAt), desc(history.id));

    return parseRows('history', historyWordSchema, rows).map((row) => row.word);
  }

  async clear(userId: string | null): Promise<void> {
    this.database.transaction((transaction) => {
      const viewed = transaction
        .select({ word: history.word })
        .from(history)
        .where(ownedBy(history.userId, userId))
        .all();
      viewed.forEach(({ word }) =>
        recordPendingChange(transaction, userId, 'history', word, 'delete'),
      );
      transaction.delete(history).where(ownedBy(history.userId, userId)).run();
    });
  }
}
