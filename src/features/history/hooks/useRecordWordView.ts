import { useEffect } from 'react';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { HistoryRepository } from '../domain/HistoryRepository';

// Até a etapa 5 (login), todo registro é do visitante.
const GUEST_USER_ID = null;

/**
 * Registra no histórico a palavra aberta no detalhe, uma vez por palavra (CLAUDE.md 6.2).
 * Só entram palavras encontradas (decisão do autor): o detalhe passa `null` enquanto carrega ou
 * no "Word not found"; se o "Retry" encontrar a palavra depois, ela é registrada nesse momento.
 */
export function useRecordWordView(foundWord: string | null): void {
  useEffect(() => {
    if (foundWord === null) {
      return;
    }
    container
      .resolve<HistoryRepository>(TOKENS.HistoryRepository)
      .recordView(foundWord, GUEST_USER_ID)
      .catch((error: unknown) => {
        // Falhar ao gravar o histórico não pode atrapalhar a leitura da palavra.
        logger.warn('history', `Could not record "${foundWord}" as viewed.`, error);
      });
  }, [foundWord]);
}
