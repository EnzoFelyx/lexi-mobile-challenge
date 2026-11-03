import type { SQLiteDatabase } from 'expo-sqlite';
import { inject, injectable } from 'tsyringe';

import { SEED_BATCH_SIZE } from '@/constants/words';
import type { Database } from '@/core/database/client';
import { words } from '@/core/database/schema';
import { parseRows, wordRowSchema } from '@/core/database/validation';
import { TOKENS } from '@/core/di/tokens';
import { chunk } from '@/shared/utils/chunk';
import { yieldToEventLoop } from '@/shared/utils/yieldToEventLoop';

import type { DictionarySeeder, SeedProgressListener } from '../domain/DictionarySeeder';
import { toWordSeedRows } from '../domain/wordSeedRows';

const seededCheckSchema = wordRowSchema.pick({ word: true });

/** INSERT de várias linhas de uma vez: bem mais rápido que uma linha por comando. */
const insertWordsSql = (rowCount: number): string =>
  `INSERT OR IGNORE INTO words (word, sort_key) VALUES ${Array(rowCount).fill('(?, ?)').join(', ')}`;

@injectable()
export class SqliteDictionarySeeder implements DictionarySeeder {
  constructor(
    @inject(TOKENS.Database) private readonly database: Database,
    @inject(TOKENS.SqliteConnection) private readonly connection: SQLiteDatabase,
  ) {}

  async isSeeded(): Promise<boolean> {
    const rows = await this.database.select({ word: words.word }).from(words).limit(1);
    return parseRows('words', seededCheckSchema, rows).length > 0;
  }

  /**
   * Tudo numa transação: se o app fechar no meio, nada fica pela metade e o seed recomeça.
   * A transação exclusiva usa outra conexão, por isso o SQL é escrito à mão (o Drizzle usa a principal).
   */
  async seed(wordList: readonly string[], onProgress: SeedProgressListener): Promise<void> {
    const batches = chunk(toWordSeedRows(wordList, Math.random), SEED_BATCH_SIZE);

    await this.connection.withExclusiveTransactionAsync(async (transaction) => {
      for (const [index, batch] of batches.entries()) {
        const params = batch.flatMap((row) => [row.word, row.sortKey]);
        await transaction.runAsync(insertWordsSql(batch.length), params);
        onProgress((index + 1) / batches.length);
        await yieldToEventLoop();
      }
    });
  }
}
