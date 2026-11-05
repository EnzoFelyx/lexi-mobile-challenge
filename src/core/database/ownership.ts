import { eq, isNull, type SQL } from 'drizzle-orm';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';

/** Filtra as linhas de um dono: `user_id` nulo é o visitante, e `= NULL` nunca casa no SQL. */
export const ownedBy = (userIdColumn: SQLiteColumn, userId: string | null): SQL =>
  userId === null ? isNull(userIdColumn) : eq(userIdColumn, userId);
