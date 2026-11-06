import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { useOwnerId } from '@/features/auth/hooks/useOwnerId';
import {
  type SavedWords,
  useSavedWords,
  type UseSavedWordsOptions,
} from '@/shared/hooks/useSavedWords';

import type { HistoryRepository } from '../domain/HistoryRepository';
import { historyQueryKeys } from './queryKeys';

/** Palavras já vistas, da mais recente para a mais antiga (CLAUDE.md 6.3). */
export function useHistory(options?: UseSavedWordsOptions): SavedWords {
  const ownerId = useOwnerId();
  const loadHistory = () =>
    container.resolve<HistoryRepository>(TOKENS.HistoryRepository).list(ownerId);

  return useSavedWords(historyQueryKeys.list(ownerId), loadHistory, options);
}
