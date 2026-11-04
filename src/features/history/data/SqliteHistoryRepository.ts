import { and, eq, isNull } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import type { Database } from '@/core/database/client';
import { history } from '@/core/database/schema';
import { TOKENS } from '@/core/di/tokens';

import type { HistoryRepository } from '../domain/HistoryRepository';

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
    const owner = userId === null ? isNull(history.userId) : eq(history.userId, userId);

    const updated = await this.database
      .update(history)
      .set({ viewedAt })
      .where(and(owner, eq(history.word, word)))
      .returning({ id: history.id });
    if (updated.length > 0) {
      return;
    }
    await this.database.insert(history).values({ userId, word, viewedAt }).onConflictDoNothing();
  }
}
