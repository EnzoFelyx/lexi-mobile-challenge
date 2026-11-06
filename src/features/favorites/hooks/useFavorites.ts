import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { useOwnerId } from '@/features/auth/hooks/useOwnerId';
import {
  type SavedWords,
  useSavedWords,
  type UseSavedWordsOptions,
} from '@/shared/hooks/useSavedWords';

import type { FavoritesRepository } from '../domain/FavoritesRepository';
import { favoriteQueryKeys } from './queryKeys';

/** Palavras favoritas, da mais recente para a mais antiga. */
export function useFavorites(options?: UseSavedWordsOptions): SavedWords {
  const ownerId = useOwnerId();
  const loadFavorites = () =>
    container.resolve<FavoritesRepository>(TOKENS.FavoritesRepository).list(ownerId);

  return useSavedWords(favoriteQueryKeys.list(ownerId), loadFavorites, options);
}
