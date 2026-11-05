/** Palavras favoritas. `userId` nulo = visitante (CLAUDE.md 6.7). */
export interface FavoritesRepository {
  /** As favoritas, da mais recente para a mais antiga. */
  list(userId: string | null): Promise<string[]>;
  /** Favorita a palavra; se já for favorita, não faz nada. */
  add(word: string, userId: string | null): Promise<void>;
  /** Tira a palavra dos favoritos; se não for favorita, não faz nada. */
  remove(word: string, userId: string | null): Promise<void>;
}
