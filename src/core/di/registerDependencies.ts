import { database, type Database } from '@/core/database/client';

import { container } from './container';
import { TOKENS } from './tokens';

/**
 * Único lugar que conhece as implementações de `data/` (e o único que abre o banco).
 * Cada feature registra aqui as suas, ex.:
 * container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
 */
export function registerDependencies(): void {
  container.registerInstance<Database>(TOKENS.Database, database);
}
