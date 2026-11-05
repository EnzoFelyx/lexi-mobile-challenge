import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { HistoryRepository } from '../domain/HistoryRepository';
import { historyQueryKeys } from './queryKeys';

/**
 * Registra no histórico a palavra aberta no detalhe, uma vez por palavra (CLAUDE.md 6.2), e
 * atualiza a aba History. Só entram palavras encontradas (decisão do autor): o detalhe passa
 * `null` enquanto carrega ou no "Word not found"; se o "Retry" encontrar a palavra depois, ela é
 * registrada nesse momento.
 */
export function useRecordWordView(foundWord: string | null): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (foundWord === null) {
      return;
    }
    container
      .resolve<HistoryRepository>(TOKENS.HistoryRepository)
      .recordView(foundWord, GUEST_USER_ID)
      .then(() => queryClient.invalidateQueries({ queryKey: historyQueryKeys.list }))
      .catch((error: unknown) => {
        // Falhar ao gravar o histórico não pode atrapalhar a leitura da palavra.
        logger.warn('history', `Could not record "${foundWord}" as viewed.`, error);
      });
  }, [foundWord, queryClient]);
}
