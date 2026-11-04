import type { SQLiteDatabase } from 'expo-sqlite';

import { database, type Database, sqliteConnection } from '@/core/database/client';
import { SqliteHistoryRepository } from '@/features/history/data/SqliteHistoryRepository';
import type { HistoryRepository } from '@/features/history/domain/HistoryRepository';
import type { DictionarySeeder } from '@/features/words/domain/DictionarySeeder';
import type { DictionaryService } from '@/features/words/domain/DictionaryService';
import type { WordCacheRepository } from '@/features/words/domain/WordCacheRepository';
import type { WordListSource } from '@/features/words/domain/WordListSource';
import type { WordRepository } from '@/features/words/domain/WordRepository';
import { DwylWordListSource } from '@/features/words/data/DwylWordListSource';
import { FreeDictionaryService } from '@/features/words/data/FreeDictionaryService';
import { SqliteDictionarySeeder } from '@/features/words/data/SqliteDictionarySeeder';
import { SqliteWordCacheRepository } from '@/features/words/data/SqliteWordCacheRepository';
import { SqliteWordRepository } from '@/features/words/data/SqliteWordRepository';

import { container } from './container';
import { TOKENS } from './tokens';

/**
 * Único lugar que conhece as implementações de `data/` (e o único que abre o banco).
 * Cada feature registra aqui as suas, ex.:
 * container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
 */
export function registerDependencies(): void {
  container.registerInstance<Database>(TOKENS.Database, database);
  container.registerInstance<SQLiteDatabase>(TOKENS.SqliteConnection, sqliteConnection);

  container.registerSingleton<WordListSource>(TOKENS.WordListSource, DwylWordListSource);
  container.registerSingleton<DictionarySeeder>(TOKENS.DictionarySeeder, SqliteDictionarySeeder);
  container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
  container.registerSingleton<DictionaryService>(TOKENS.DictionaryService, FreeDictionaryService);
  container.registerSingleton<WordCacheRepository>(
    TOKENS.WordCacheRepository,
    SqliteWordCacheRepository,
  );
  container.registerSingleton<HistoryRepository>(TOKENS.HistoryRepository, SqliteHistoryRepository);
}
