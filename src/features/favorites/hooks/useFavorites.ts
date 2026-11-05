import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { type SavedWords, useSavedWords } from '@/shared/hooks/useSavedWords';

import type { FavoritesRepository } from '../domain/FavoritesRepository';
import { favoriteQueryKeys } from './queryKeys';

const loadFavorites = () =>
  container.resolve<FavoritesRepository>(TOKENS.FavoritesRepository).list(GUEST_USER_ID);

/** Palavras favoritas, da mais recente para a mais antiga. */
export function useFavorites(): SavedWords {
  return useSavedWords(favoriteQueryKeys.list, loadFavorites);
}
