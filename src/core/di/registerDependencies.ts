import type { SQLiteDatabase } from 'expo-sqlite';

import { database, type Database, sqliteConnection } from '@/core/database/client';
import type { DictionarySeeder } from '@/features/words/domain/DictionarySeeder';
import type { WordListSource } from '@/features/words/domain/WordListSource';
import { DwylWordListSource } from '@/features/words/data/DwylWordListSource';
import { SqliteDictionarySeeder } from '@/features/words/data/SqliteDictionarySeeder';

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
}
