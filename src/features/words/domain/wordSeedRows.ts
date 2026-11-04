import { WORD_SORT_KEY_RANGE } from '@/constants/words';

import type { WordEntry } from './WordEntry';

/**
 * Dá a cada palavra um `sortKey` aleatório dentro da faixa da sua camada: as palavras da primeira
 * camada vêm antes, depois as da segunda, e as que não estão em nenhuma ficam no fim. A Word list
 * ordena por (sortKey, word), então a ordem é variada mas estável entre sessões (CLAUDE.md 6.1).
 */
export function toWordSeedRows(
  words: readonly string[],
  random: () => number,
  priorityTiers: readonly ReadonlySet<string>[] = [],
): WordEntry[] {
  return words.map((word) => {
    const tier = priorityTiers.findIndex((tierWords) => tierWords.has(word));
    const tierIndex = tier === -1 ? priorityTiers.length : tier;
    return {
      word,
      sortKey: tierIndex * WORD_SORT_KEY_RANGE + Math.floor(random() * WORD_SORT_KEY_RANGE),
    };
  });
}
