import type { WordEntry } from './WordEntry';

/** Posição na lista: a próxima página começa depois deste (sortKey, word). */
export type WordCursor = WordEntry;

export interface WordPage {
  words: string[];
  /** `null` quando não há mais palavras. */
  nextCursor: WordCursor | null;
}

export interface WordRepository {
  /** Página da Word list em ordem (sortKey, word); `cursor` nulo = primeira página. */
  getPage(cursor: WordCursor | null, limit: number): Promise<WordPage>;
}
