import { type SQL, sql } from 'drizzle-orm';
import {
  index,
  integer,
  type SQLiteColumn,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

/**
 * Fonte única das tabelas locais: os tipos e os schemas Zod derivam daqui.
 * `user_id` nulo = visitante (CLAUDE.md 6.7).
 */

/**
 * Chave do usuário para índices únicos: no SQLite, NULLs não colidem num índice único, então o
 * visitante poderia repetir a palavra. Usa CASE em vez de coalesce(): o drizzle-kit 0.31 quebra
 * expressões com vírgula ao gerar a migration.
 */
const userKey = (userId: SQLiteColumn): SQL =>
  sql`(CASE WHEN ${userId} IS NULL THEN '' ELSE ${userId} END)`;

/** Lista do dwyl, com a ordem aleatória e estável gravada no seed. */
export const words = sqliteTable(
  'words',
  {
    word: text('word').primaryKey(),
    sortKey: integer('sort_key').notNull(),
  },
  (table) => [index('words_sort_key_word_idx').on(table.sortKey, table.word)],
);

export const WORD_CACHE_STATUSES = ['ok', 'not_found'] as const;

/** Respostas da Free Dictionary API, inclusive o 404 (para não chamar a API de novo). */
export const wordCache = sqliteTable('word_cache', {
  word: text('word').primaryKey(),
  payload: text('payload'),
  status: text('status', { enum: WORD_CACHE_STATUSES }).notNull(),
  fetchedAt: integer('fetched_at', { mode: 'timestamp_ms' }).notNull(),
});

export const favorites = sqliteTable(
  'favorites',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id'),
    word: text('word').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [uniqueIndex('favorites_user_word_idx').on(userKey(table.userId), table.word)],
);

export const history = sqliteTable(
  'history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id'),
    word: text('word').notNull(),
    viewedAt: integer('viewed_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('history_user_word_idx').on(userKey(table.userId), table.word),
    index('history_viewed_at_idx').on(table.viewedAt),
  ],
);

export const PENDING_SYNC_KINDS = ['favorite', 'history'] as const;
export const PENDING_SYNC_OPERATIONS = ['upsert', 'delete'] as const;

/**
 * Fila das mudanças da conta ainda não enviadas ao Supabase: uma linha por palavra, com a última
 * mudança. Só para quem tem conta; é o que mantém o app usável offline (CLAUDE.md 6.7).
 */
export const pendingSync = sqliteTable(
  'pending_sync',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull(),
    kind: text('kind', { enum: PENDING_SYNC_KINDS }).notNull(),
    word: text('word').notNull(),
    operation: text('operation', { enum: PENDING_SYNC_OPERATIONS }).notNull(),
    changedAt: integer('changed_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('pending_sync_user_kind_word_idx').on(table.userId, table.kind, table.word),
  ],
);
