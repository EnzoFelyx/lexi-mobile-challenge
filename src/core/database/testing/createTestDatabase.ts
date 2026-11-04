import BetterSqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Database } from '../client';
import journal from '../migrations/meta/_journal.json';
import * as schema from '../schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

/**
 * Banco SQLite em memória (better-sqlite3) com as mesmas migrations do app, só para testes:
 * o expo-sqlite não roda fora do aparelho. As consultas do Drizzle são as mesmas.
 */
export function createTestDatabase(): { database: Database; close: () => void } {
  const sqlite = new BetterSqlite3(':memory:');
  journal.entries.forEach(({ tag }) => {
    const migration = readFileSync(join(MIGRATIONS_DIR, `${tag}.sql`), 'utf8');
    migration.split('--> statement-breakpoint').forEach((statement) => sqlite.exec(statement));
  });
  const database = drizzle(sqlite, { schema }) as unknown as Database;
  return { database, close: () => sqlite.close() };
}
