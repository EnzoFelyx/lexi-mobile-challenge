import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { favorites, history, pendingSync, wordCache, words } from './schema';

/** Schemas Zod derivados do schema do Drizzle: toda leitura passa por eles antes do domínio. */
export const wordRowSchema = createSelectSchema(words);
export const wordCacheRowSchema = createSelectSchema(wordCache);
export const favoriteRowSchema = createSelectSchema(favorites);
export const historyRowSchema = createSelectSchema(history);
export const pendingSyncRowSchema = createSelectSchema(pendingSync);

export type WordRow = z.infer<typeof wordRowSchema>;
export type WordCacheRow = z.infer<typeof wordCacheRowSchema>;
export type FavoriteRow = z.infer<typeof favoriteRowSchema>;
export type HistoryRow = z.infer<typeof historyRowSchema>;

/** Valida as linhas lidas do banco; o erro diz qual tabela veio fora do formato. */
export function parseRows<T>(table: string, schema: z.ZodType<T>, rows: unknown[]): T[] {
  const result = z.array(schema).safeParse(rows);
  if (!result.success) {
    throw new Error(`Invalid rows read from "${table}": ${result.error.message}`);
  }
  return result.data;
}
