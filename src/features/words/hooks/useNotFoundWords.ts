import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { WordCacheRepository } from '../domain/WordCacheRepository';
import { wordQueryKeys } from './queryKeys';

const NO_WORDS: readonly string[] = [];

const loadNotFoundWords = () =>
  container.resolve<WordCacheRepository>(TOKENS.WordCacheRepository).listNotFound();

/**
 * Palavras que a API não encontrou na última busca, para apagar o card delas (decisão do autor).
 * É só um detalhe visual: se a leitura falhar, os cards aparecem normais.
 */
export function useNotFoundWords(): ReadonlySet<string> {
  const query = useQuery({
    queryKey: wordQueryKeys.notFound,
    queryFn: loadNotFoundWords,
    // Muda só quando o detalhe de uma palavra responde, e o detalhe invalida esta chave.
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.error) {
      logger.warn('words', 'Could not read the words without a result.', query.error);
    }
  }, [query.error]);

  const words = query.data ?? NO_WORDS;
  return useMemo(() => new Set(words), [words]);
}
