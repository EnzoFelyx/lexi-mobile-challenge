import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { useOwnerId } from '@/features/auth/hooks/useOwnerId';
import { useRequestAccountSync } from '@/features/sync/hooks/useRequestAccountSync';
import { useTexts } from '@/i18n/useTexts';
import { logger } from '@/shared/utils/logger';

import type { HistoryRepository } from '../domain/HistoryRepository';
import { historyQueryKeys } from './queryKeys';

export interface ClearHistory {
  /** Pergunta antes de apagar; só apaga se o usuário confirmar. */
  requestClear: () => void;
  isClearing: boolean;
}

/**
 * "Clear" da aba History (pedido do autor, 2026-11-05): confirma com um alerta do sistema e, se o
 * usuário aceitar, apaga o histórico e a aba mostra o estado vazio. Os favoritos não mudam.
 */
export function useClearHistory(): ClearHistory {
  const t = useTexts();
  const queryClient = useQueryClient();
  const ownerId = useOwnerId();
  const requestSync = useRequestAccountSync();
  const listKey = historyQueryKeys.list(ownerId);

  const mutation = useMutation({
    mutationFn: () => container.resolve<HistoryRepository>(TOKENS.HistoryRepository).clear(ownerId),
    onSuccess: () => {
      queryClient.setQueryData<string[]>(listKey, []);
      requestSync();
    },
    onError: (error) => {
      logger.warn('history', 'Could not clear the history.', error);
      Alert.alert(t.history.clearErrorTitle, t.history.clearErrorMessage);
    },
    // Confere com o banco no fim, certo ou errado.
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
  });

  const requestClear = () =>
    Alert.alert(t.history.clearConfirm.title, t.history.clearConfirm.message, [
      { text: t.history.clearConfirm.cancel, style: 'cancel' },
      {
        text: t.history.clearConfirm.confirm,
        style: 'destructive',
        onPress: () => mutation.mutate(),
      },
    ]);

  return { requestClear, isClearing: mutation.isPending };
}
