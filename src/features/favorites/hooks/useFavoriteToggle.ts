import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
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

const saveFavorite = ({ word, favorite }: FavoriteChange) => {
  const repository = container.resolve<FavoritesRepository>(TOKENS.FavoritesRepository);
  return favorite ? repository.add(word, GUEST_USER_ID) : repository.remove(word, GUEST_USER_ID);
};

/**
 * Coração do detalhe com atualização otimista pelo React Query (decisão do autor, 2026-11-05):
 * o coração e a aba Favorites mudam na hora; se a gravação falhar, os dois voltam e um alerta
 * avisa (CLAUDE.md 6.4).
 */
export function useFavoriteToggle(word: string): FavoriteToggle {
  const t = useTexts();
  const queryClient = useQueryClient();
  const favorites = useFavorites();
  const isFavorite = favorites.words.includes(word);

  const mutation = useMutation({
    mutationFn: saveFavorite,
    onMutate: async (change: FavoriteChange) => {
      // Uma leitura em andamento não pode sobrescrever a mudança otimista ao chegar.
      await queryClient.cancelQueries({ queryKey: favoriteQueryKeys.list });
      const previous = queryClient.getQueryData<string[]>(favoriteQueryKeys.list);
      queryClient.setQueryData<string[]>(favoriteQueryKeys.list, (words = []) =>
        withFavorite(words, change.word, change.favorite),
      );
      return { previous };
    },
    onError: (error, change, context) => {
      queryClient.setQueryData(favoriteQueryKeys.list, context?.previous);
      logger.warn('favorites', `Could not save "${change.word}" as a favorite.`, error);
      Alert.alert(t.favorites.saveErrorTitle, t.favorites.saveErrorMessage);
    },
    // Confere com o banco no fim, certo ou errado (ex.: dois toques rápidos).
    onSettled: () => queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.list }),
  });

  return {
    isFavorite,
    isReady: !favorites.isLoading && !favorites.isError,
    toggleFavorite: () => mutation.mutate({ word, favorite: !isFavorite }),
  };
}
