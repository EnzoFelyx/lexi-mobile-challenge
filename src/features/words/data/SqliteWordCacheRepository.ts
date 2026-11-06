import { and, eq, gt } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import type { Database } from '@/core/database/client';
import { wordCache } from '@/core/database/schema';
import { parseRows, wordCacheRowSchema } from '@/core/database/validation';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import { isNotFoundStillValid, notFoundCutoff } from '../domain/notFoundExpiry';
import type { WordCacheRepository } from '../domain/WordCacheRepository';
import type { WordLookup } from '../domain/WordDetail';
import { wordDetailSchema } from './dictionarySchemas';

@injectable()
export class SqliteWordCacheRepository implements WordCacheRepository {
  constructor(@inject(TOKENS.Database) private readonly database: Database) {}

  async get(word: string): Promise<WordLookup | null> {
    const rows = await this.database
      .select()
      .from(wordCache)
      .where(eq(wordCache.word, word))
      .limit(1);
    const [row] = parseRows('word_cache', wordCacheRowSchema, rows);
    if (!row) {
      return null;
    }
    if (row.status === 'not_found') {
      // 404 vencido: trata como ausente, para a API ser consultada de novo.
      return isNotFoundStillValid(row.fetchedAt, new Date())
        ? { status: 'not_found', word: row.word }
        : null;
    }
    const detail = wordDetailSchema.safeParse(JSON.parse(row.payload ?? 'null'));
    if (!detail.success) {
      // Cache corrompido ou de outro formato: trata como ausente e busca na API de novo.
      logger.warn('words', `Ignoring an invalid cached entry for "${word}".`, detail.error);
      return null;
    }
    return { status: 'found', detail: detail.data };
  }

  async listNotFound(): Promise<string[]> {
    const rows = await this.database
      .select({ word: wordCache.word })
      .from(wordCache)
      .where(
        and(eq(wordCache.status, 'not_found'), gt(wordCache.fetchedAt, notFoundCutoff(new Date()))),
      );
    return parseRows('word_cache', wordCacheRowSchema.pick({ word: true }), rows).map(
      (row) => row.word,
    );
  }

  async save(lookup: WordLookup): Promise<void> {
    const row =
      lookup.status === 'found'
        ? {
            word: lookup.detail.word,
            status: 'ok' as const,
            payload: JSON.stringify(lookup.detail),
          }
        : { word: lookup.word, status: 'not_found' as const, payload: null };
    const values = { ...row, fetchedAt: new Date() };

    await this.database
      .insert(wordCache)
      .values(values)
      .onConflictDoUpdate({ target: wordCache.word, set: values });
  }
}
