import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
import type { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';

/**
 * Simula a conexão do expo-sqlite sobre o better-sqlite3, com só o que o seed usa:
 * `withExclusiveTransactionAsync` (BEGIN/COMMIT, ROLLBACK se a tarefa falhar) e `runAsync`.
 */
export function createTestConnection(sqlite: BetterSqliteDatabase): SQLiteDatabase {
  const transaction = {
    runAsync: async (source: string, params: SQLiteBindValue[]) => {
      const result = sqlite.prepare(source).run(params);
      return { changes: result.changes, lastInsertRowId: Number(result.lastInsertRowid) };
    },
  };

  const connection = {
    withExclusiveTransactionAsync: async (task: (txn: typeof transaction) => Promise<void>) => {
      sqlite.exec('BEGIN EXCLUSIVE');
      try {
        await task(transaction);
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };

  return connection as unknown as SQLiteDatabase;
}
