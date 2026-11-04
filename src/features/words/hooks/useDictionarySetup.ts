import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { DictionarySeeder } from '../domain/DictionarySeeder';
import type { WordListSource } from '../domain/WordListSource';
import { wordQueryKeys } from './queryKeys';

export type DictionarySetupStatus = 'checking' | 'downloading' | 'saving' | 'ready' | 'error';

type ActivePhase = Extract<DictionarySetupStatus, 'checking' | 'downloading' | 'saving'>;

export interface DictionarySetup {
  status: DictionarySetupStatus;
  /** Fração gravada no aparelho (0 a 1), só durante `saving`. */
  progress: number;
  retry: () => void;
}

/**
 * Garante a lista de palavras no aparelho: na primeira execução baixa do dwyl e grava no SQLite.
 * Passa pelo React Query (deduplica execuções e guarda o resultado); o usuário tenta de novo pelo `retry`.
 */
export function useDictionarySetup(): DictionarySetup {
  const [phase, setPhase] = useState<ActivePhase>('checking');
  const [progress, setProgress] = useState(0);

  const query = useQuery({
    queryKey: wordQueryKeys.dictionarySetup,
    queryFn: async () => {
      const seeder = container.resolve<DictionarySeeder>(TOKENS.DictionarySeeder);
      if (await seeder.isSeeded()) {
        return true;
      }
      setPhase('downloading');
      const words = await container.resolve<WordListSource>(TOKENS.WordListSource).fetchWords();
      setPhase('saving');
      await seeder.seed(words, setProgress);
      return true;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    // O download é grande: em vez de repetir sozinho, mostra o erro e deixa o usuário decidir.
    retry: false,
  });

  useEffect(() => {
    if (query.error) {
      logger.warn('words', 'Could not prepare the dictionary.', query.error);
    }
  }, [query.error]);

  const retry = () => {
    setPhase('checking');
    setProgress(0);
    void query.refetch();
  };

  const status: DictionarySetupStatus = query.isSuccess
    ? 'ready'
    : query.isError && !query.isFetching
      ? 'error'
      : phase;

  return { status, progress, retry };
}
