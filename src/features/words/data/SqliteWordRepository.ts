import { sql } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import type { Database } from '@/core/database/client';
import { words } from '@/core/database/schema';
import { parseRows, wordRowSchema } from '@/core/database/validation';
import { TOKENS } from '@/core/di/tokens';

import { buildWordPage } from '../domain/buildWordPage';
import type { WordCursor, WordPage, WordRepository } from '../domain/WordRepository';

@injectable()
export class SqliteWordRepository implements WordRepository {
  constructor(@inject(TOKENS.Database) private readonly database: Database) {}

  /**
   * Paginação keyset (nunca OFFSET): usa o índice (sort_key, word) e custa o mesmo
   * na primeira página e na milésima.
   */
  async getPage(cursor: WordCursor | null, limit: number): Promise<WordPage> {
    const after = cursor
      ? sql`(${words.sortKey}, ${words.word}) > (${cursor.sortKey}, ${cursor.word})`
      : undefined;

    const rows = await this.database
      .select({ word: words.word, sortKey: words.sortKey })
      .from(words)
      .where(after)
      .orderBy(words.sortKey, words.word)
      .limit(limit + 1);

    return buildWordPage(parseRows('words', wordRowSchema, rows), limit);
  }
}
