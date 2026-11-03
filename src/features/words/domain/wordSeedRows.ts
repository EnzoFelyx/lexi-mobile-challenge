import { WORD_SORT_KEY_RANGE } from '@/constants/words';

export interface WordSeedRow {
  word: string;
  sortKey: number;
}

/**
 * Dá a cada palavra um `sortKey` inteiro aleatório: a Word list ordena por (sortKey, word),
 * então a ordem é variada mas estável entre sessões (CLAUDE.md 6.1).
 */
export function toWordSeedRows(words: readonly string[], random: () => number): WordSeedRow[] {
  return words.map((word) => ({ word, sortKey: Math.floor(random() * WORD_SORT_KEY_RANGE) }));
}
