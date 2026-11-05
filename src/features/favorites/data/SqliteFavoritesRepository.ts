import { and, desc, eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import type { Database } from '@/core/database/client';
import { ownedBy } from '@/core/database/ownership';
import { favorites } from '@/core/database/schema';
import { favoriteRowSchema, parseRows } from '@/core/database/validation';
import { TOKENS } from '@/core/di/tokens';

import type { FavoritesRepository } from '../domain/FavoritesRepository';

const favoriteWordSchema = favoriteRowSchema.pick({ word: true });

@injectable()
export class SqliteFavoritesRepository implements FavoritesRepository {
  constructor(@inject(TOKENS.Database) private readonly database: Database) {}

  async list(userId: string | null): Promise<string[]> {
    const rows = await this.database
      .select({ word: favorites.word })
      .from(favorites)
      .where(ownedBy(favorites.userId, userId))
      // O id desempata dois favoritos no mesmo milissegundo: o gravado depois vem antes.
      .orderBy(desc(favorites.createdAt), desc(favorites.id));

    return parseRows('favorites', favoriteWordSchema, rows).map((row) => row.word);
  }

  /**
   * O índice único (usuário, palavra) usa a expressão do visitante, que o alvo do upsert do
   * Drizzle não aceita; `onConflictDoNothing` sem alvo vale para qualquer índice único e mantém
   * a data do primeiro favorito.
   */
  async add(word: string, userId: string | null): Promise<void> {
    await this.database
      .insert(favorites)
      .values({ userId, word, createdAt: new Date() })
      .onConflictDoNothing();
  }

  async remove(word: string, userId: string | null): Promise<void> {
    await this.database
      .delete(favorites)
      .where(and(ownedBy(favorites.userId, userId), eq(favorites.word, word)));
  }
}
