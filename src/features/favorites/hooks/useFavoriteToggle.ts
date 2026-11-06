import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { useOwnerId } from '@/features/auth/hooks/useOwnerId';
import { useRequestAccountSync } from '@/features/sync/hooks/useRequestAccountSync';
import { useTexts } from '@/i18n/useTexts';
import { logger } from '@/shared/utils/logger';

import type { FavoritesRepository } from '../domain/FavoritesRepository';
import { withFavorite } from '../domain/favoriteList';
import { favoriteQueryKeys } from './queryKeys';
import { useFavorites } from './useFavorites';

export interface FavoriteToggle {
  isFavorite: boolean;
  /** A lista de favoritas já foi lida: antes disso, o coração não sabe o próprio estado. */
  isReady: boolean;
  toggleFavorite: () => void;
}

interface FavoriteChange {
  word: string;
  favorite: boolean;
}

/**
 * Coração do detalhe com atualização otimista pelo React Query (decisão do autor, 2026-11-05):
 * o coração e a aba Favorites mudam na hora; se a gravação falhar, os dois voltam e um alerta
 * avisa (CLAUDE.md 6.4).
 */
export function useFavoriteToggle(word: string): FavoriteToggle {
  const t = useTexts();
  const queryClient = useQueryClient();
  const ownerId = useOwnerId();
  const requestSync = useRequestAccountSync();
  const favorites = useFavorites();
  const listKey = favoriteQueryKeys.list(ownerId);
  const isFavorite = favorites.words.includes(word);

  const mutation = useMutation({
    mutationFn: ({ word: changedWord, favorite }: FavoriteChange) => {
      const repository = container.resolve<FavoritesRepository>(TOKENS.FavoritesRepository);
      return favorite
        ? repository.add(changedWord, ownerId)
        : repository.remove(changedWord, ownerId);
    },
    onMutate: async (change: FavoriteChange) => {
      // Uma leitura em andamento não pode sobrescrever a mudança otimista ao chegar.
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<string[]>(listKey);
      queryClient.setQueryData<string[]>(listKey, (words = []) =>
        withFavorite(words, change.word, change.favorite),
      );
      return { previous };
    },
    onError: (error, change, context) => {
      queryClient.setQueryData(listKey, context?.previous);
      logger.warn('favorites', `Could not save "${change.word}" as a favorite.`, error);
      Alert.alert(t.favorites.saveErrorTitle, t.favorites.saveErrorMessage);
    },
    // Confere com o banco no fim, certo ou errado (ex.: dois toques rápidos).
    onSuccess: requestSync,
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
  });

  return {
    isFavorite,
    isReady: !favorites.isLoading && !favorites.isError,
    toggleFavorite: () => mutation.mutate({ word, favorite: !isFavorite }),
  };
}
