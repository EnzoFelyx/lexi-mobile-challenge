import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { WORD_LIST_PAGE_SIZE } from '@/constants/words';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';

import type { WordCursor, WordRepository } from '../domain/WordRepository';
import { wordQueryKeys } from './queryKeys';

export interface WordList {
  words: string[];
  /** Primeira página ainda carregando (a tela inteira espera). */
  isLoading: boolean;
  /** Próxima página carregando ("Finding more words…" no fim da grade). */
  isLoadingMore: boolean;
  /** Falha na primeira página (tela de erro) ou na próxima (aviso no fim da grade). */
  error: 'firstPage' | 'nextPage' | null;
  hasMore: boolean;
  loadNextPage: () => void;
  retry: () => void;
}

/**
 * Word list com rolagem infinita: páginas de 60 palavras (keyset) pelo React Query.
 * `loadNextPage` pode ser chamado à vontade pelo `onEndReached`: só busca quando há próxima
 * página e nenhuma busca em andamento, então nunca carrega a mesma página duas vezes.
 */
export function useWordList(): WordList {
  const query = useInfiniteQuery({
    queryKey: wordQueryKeys.list,
    queryFn: ({ pageParam }) =>
      container
        .resolve<WordRepository>(TOKENS.WordRepository)
        .getPage(pageParam, WORD_LIST_PAGE_SIZE),
    initialPageParam: null as WordCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // A lista é local e só muda num novo seed: não há o que revalidar.
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.error) {
      console.warn('[words] Could not load the word list.', query.error);
    }
  }, [query.error]);

  const loadNextPage = () => {
    if (!query.hasNextPage || query.isFetching || query.isError) {
      return;
    }
    void query.fetchNextPage({ cancelRefetch: false });
  };

  const retry = () => {
    if (query.isFetchNextPageError) {
      void query.fetchNextPage({ cancelRefetch: false });
      return;
    }
    void query.refetch();
  };

  const error = query.isFetchNextPageError ? 'nextPage' : query.isError ? 'firstPage' : null;

  return {
    words: query.data?.pages.flatMap((page) => page.words) ?? [],
    isLoading: query.isPending,
    isLoadingMore: query.isFetchingNextPage,
    error,
    hasMore: query.hasNextPage,
    loadNextPage,
    retry,
  };
}
