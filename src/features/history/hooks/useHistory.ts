import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import {
  type SavedWords,
  useSavedWords,
  type UseSavedWordsOptions,
} from '@/shared/hooks/useSavedWords';

import type { HistoryRepository } from '../domain/HistoryRepository';
import { historyQueryKeys } from './queryKeys';

const loadHistory = () =>
  container.resolve<HistoryRepository>(TOKENS.HistoryRepository).list(GUEST_USER_ID);

/** Palavras já vistas, da mais recente para a mais antiga (CLAUDE.md 6.3). */
export function useHistory(options?: UseSavedWordsOptions): SavedWords {
  return useSavedWords(historyQueryKeys.list, loadHistory, options);
}
