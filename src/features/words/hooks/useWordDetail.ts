import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';

import type { DictionaryService } from '../domain/DictionaryService';
import { lookUpWord } from '../domain/lookUpWord';
import type { WordCacheRepository } from '../domain/WordCacheRepository';
import type { WordDetail } from '../domain/WordDetail';
import { wordQueryKeys } from './queryKeys';

export type WordDetailState =
  | { status: 'loading' }
  | { status: 'found'; detail: WordDetail }
  | { status: 'not_found' }
  | { status: 'error' };

export interface WordDetailResult {
  state: WordDetailState;
  /** Uma nova tentativa está em andamento (o "Retry" mostra o carregamento). */
  isRetrying: boolean;
  retry: () => void;
}

const lookUp = (word: string, refresh: boolean) =>
  lookUpWord(
    word,
    container.resolve<WordCacheRepository>(TOKENS.WordCacheRepository),
    container.resolve<DictionaryService>(TOKENS.DictionaryService),
    { refresh },
  );

/**
 * Detalhe da palavra: React Query (memória) → SQLite → API (CLAUDE.md 6.6). No "Word not found",
 * o `retry` ignora o 404 guardado e consulta a API de novo; num erro de rede, só tenta outra vez.
 */
export function useWordDetail(word: string): WordDetailResult {
  const queryClient = useQueryClient();
  const queryKey = wordQueryKeys.detail(word);
  const query = useQuery({
    queryKey,
    queryFn: () => lookUp(word, false),
    // O dicionário quase não muda: uma palavra buscada vale para a sessão inteira.
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.error) {
      console.warn(`[words] Could not look up "${word}".`, query.error);
    }
  }, [query.error, word]);

  const retry = () => {
    if (query.data?.status === 'not_found') {
      void queryClient
        .fetchQuery({ queryKey, queryFn: () => lookUp(word, true), staleTime: 0 })
        .catch((error: unknown) => {
          console.warn(`[words] Retrying "${word}" failed.`, error);
        });
      return;
    }
    void query.refetch();
  };

  const state: WordDetailState = query.data
    ? query.data.status === 'found'
      ? { status: 'found', detail: query.data.detail }
      : { status: 'not_found' }
    : query.isError
      ? { status: 'error' }
      : { status: 'loading' };

  return { state, isRetrying: query.isFetching && state.status !== 'loading', retry };
}
