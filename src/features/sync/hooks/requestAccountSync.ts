import type { QueryClient } from '@tanstack/react-query';

import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { favoriteQueryKeys } from '@/features/favorites/hooks/queryKeys';
import { historyQueryKeys } from '@/features/history/hooks/queryKeys';
import { logger } from '@/shared/utils/logger';

import type { AccountSync } from '../domain/AccountSync';

/**
 * Sincroniza em segundo plano e atualiza as abas no fim, mesmo sem conexão: os dados do visitante
 * já passaram para a conta. Falhar é esperado offline; a próxima sincronização envia a fila.
 */
export async function requestAccountSync(queryClient: QueryClient, userId: string): Promise<void> {
  try {
    await container.resolve<AccountSync>(TOKENS.AccountSync).sync(userId);
  } catch (error: unknown) {
    logger.debug('sync', 'Could not sync the account; it will try again later.', error);
  }
  // Os dados do visitante passaram para a conta: a lista dele em memória não vale mais.
  queryClient.removeQueries({ queryKey: favoriteQueryKeys.list(GUEST_USER_ID) });
  queryClient.removeQueries({ queryKey: historyQueryKeys.list(GUEST_USER_ID) });
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.list(userId) }),
    queryClient.invalidateQueries({ queryKey: historyQueryKeys.list(userId) }),
  ]);
}
