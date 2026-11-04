/** De qual lista o detalhe foi aberto: o Previous/Next anda dentro dela (CLAUDE.md 6.2). */
export const WORD_SOURCES = ['words', 'history', 'favorites'] as const;
export type WordSource = (typeof WORD_SOURCES)[number];

/** Onde a palavra aberta está na lista de origem. */
export interface WordPosition {
  source: WordSource;
  index: number;
}

/**
 * Posição atual da palavra na lista carregada. Confere o índice recebido e, se a lista mudou
 * (ex.: um favorito removido), procura a palavra; fora da lista, não há navegação.
 */
export function resolveIndex(words: readonly string[], word: string, index: number): number | null {
  if (words[index] === word) {
    return index;
  }
  const found = words.indexOf(word);
  return found === -1 ? null : found;
}
