import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { logger } from '@/shared/utils/logger';

import type { HistoryRepository } from '../domain/HistoryRepository';
import { historyQueryKeys } from './queryKeys';

export interface ClearHistory {
  /** Pergunta antes de apagar; só apaga se o usuário confirmar. */
  requestClear: () => void;
  isClearing: boolean;
}

const clearHistory = () =>
  container.resolve<HistoryRepository>(TOKENS.HistoryRepository).clear(GUEST_USER_ID);

/**
 * "Clear" da aba History (pedido do autor, 2026-11-05): confirma com um alerta do sistema e, se o
 * usuário aceitar, apaga o histórico e a aba mostra o estado vazio. Os favoritos não mudam.
 */
export function useClearHistory(): ClearHistory {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: clearHistory,
    onSuccess: () => queryClient.setQueryData<string[]>(historyQueryKeys.list, []),
    onError: (error) => {
      logger.warn('history', 'Could not clear the history.', error);
      Alert.alert(en.history.clearErrorTitle, en.history.clearErrorMessage);
    },
    // Confere com o banco no fim, certo ou errado.
    onSettled: () => queryClient.invalidateQueries({ queryKey: historyQueryKeys.list }),
  });

  const requestClear = () =>
    Alert.alert(en.history.clearConfirm.title, en.history.clearConfirm.message, [
      { text: en.history.clearConfirm.cancel, style: 'cancel' },
      {
        text: en.history.clearConfirm.confirm,
        style: 'destructive',
        onPress: () => mutation.mutate(),
      },
    ]);

  return { requestClear, isClearing: mutation.isPending };
}
