import type { WordLookup } from './WordDetail';

/** Cache persistente das buscas (inclusive o 404), para abrir na hora e offline. */
export interface WordCacheRepository {
  get(word: string): Promise<WordLookup | null>;
  save(lookup: WordLookup): Promise<void>;
  /** As palavras com um 404 guardado que ainda vale. */
  listNotFound(): Promise<string[]>;
}
