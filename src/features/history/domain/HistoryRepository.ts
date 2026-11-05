/** Palavras já vistas. `userId` nulo = visitante (CLAUDE.md 6.7). */
export interface HistoryRepository {
  /** Registra que a palavra foi aberta agora: sem duplicados, só atualiza a data se já existir. */
  recordView(word: string, userId: string | null): Promise<void>;
  /** As palavras vistas, da mais recente para a mais antiga. */
  list(userId: string | null): Promise<string[]>;
  /** Apaga todo o histórico do dono; os favoritos não mudam. */
  clear(userId: string | null): Promise<void>;
}
