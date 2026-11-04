import { WORD_SORT_KEY_RANGE } from '@/constants/words';

import type { WordEntry } from './WordEntry';

/**
 * Dá a cada palavra um `sortKey` inteiro aleatório: a Word list ordena por (sortKey, word),
 * então a ordem é variada mas estável entre sessões (CLAUDE.md 6.1).
 */
export function toWordSeedRows(words: readonly string[], random: () => number): WordEntry[] {
  return words.map((word) => ({ word, sortKey: Math.floor(random() * WORD_SORT_KEY_RANGE) }));
}
