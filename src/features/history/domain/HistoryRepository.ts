/** Palavras já vistas. `userId` nulo = visitante (CLAUDE.md 6.7). */
export interface HistoryRepository {
  /** Registra que a palavra foi aberta agora: sem duplicados, só atualiza a data se já existir. */
  recordView(word: string, userId: string | null): Promise<void>;
}
