import { useState } from 'react';

import { logger } from '@/shared/utils/logger';

import { resolveIndex, type WordPosition } from '../domain/wordNavigation';
import { useSavedListSnapshot } from './useSavedListSnapshot';
import { useWordList } from './useWordList';

export interface WordNavigation {
  canGoPrevious: boolean;
  canGoNext: boolean;
  /** O "Next" está buscando a próxima página da lista. */
  isLoadingNext: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
}

interface UseWordNavigationOptions {
  word: string;
  position: WordPosition | null;
  onNavigate: (word: string, position: WordPosition) => void;
}

/**
 * Previous/Next dentro da lista de onde o detalhe foi aberto (CLAUDE.md 6.2). Na Word list, o
 * "Next" no fim do que já foi carregado busca a próxima página. Em History e Favorites, anda pela
 * lista como estava ao abrir o detalhe (`useSavedListSnapshot`). Nas pontas, desabilitado.
 */
export function useWordNavigation({
  word,
  position,
  onNavigate,
}: UseWordNavigationOptions): WordNavigation {
  const fromWordList = position?.source === 'words';
  const list = useWordList({ enabled: fromWordList });
  const savedWords = useSavedListSnapshot(position?.source);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const words = fromWordList ? list.words : savedWords;
  const index = position ? resolveIndex(words, word, position.index) : null;
  const hasMore = fromWordList && list.hasMore;

  const goTo = (target: number, available: readonly string[]) => {
    const targetWord = available[target];
    if (position && targetWord !== undefined) {
      onNavigate(targetWord, { source: position.source, index: target });
    }
  };

  const goToPrevious = () => {
    if (index !== null && index > 0) {
      goTo(index - 1, words);
    }
  };

  const goToNext = () => {
    if (index === null) {
      return;
    }
    if (index + 1 < words.length) {
      goTo(index + 1, words);
      return;
    }
    if (!hasMore || isLoadingNext) {
      return;
    }
    setIsLoadingNext(true);
    list
      .loadMore()
      .then((loaded) => goTo(index + 1, loaded))
      .catch((error: unknown) => logger.warn('words', 'Could not load the next words.', error))
      .finally(() => setIsLoadingNext(false));
  };

  return {
    canGoPrevious: index !== null && index > 0,
    canGoNext: index !== null && (index + 1 < words.length || hasMore),
    isLoadingNext,
    goToPrevious,
    goToNext,
  };
}
