/**
 * A Free Dictionary API recusou por excesso de consultas (HTTP 429, ~450 a cada 5 min por IP).
 * Não é guardado em cache e não deve ser repetido sozinho: repetir só prolonga o bloqueio.
 */
export class DictionaryRateLimitError extends Error {
  /** Lido pelo QueryClient: este erro não é repetido automaticamente. */
  readonly retryable = false;

  constructor(word: string) {
    super(`The dictionary API is rate limiting lookups (HTTP 429) for "${word}"`);
    this.name = 'DictionaryRateLimitError';
  }
}
