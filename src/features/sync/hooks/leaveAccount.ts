import { SIGN_OUT_SYNC_TIMEOUT_MS } from '@/constants/sync';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import type { AuthService } from '@/features/auth/domain/AuthService';
import { logger } from '@/shared/utils/logger';

import type { AccountSync, LocalAccountData } from '../domain/AccountSync';

const syncBeforeLeaving = async (userId: string): Promise<void> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, SIGN_OUT_SYNC_TIMEOUT_MS);
  });
  try {
    await Promise.race([container.resolve<AccountSync>(TOKENS.AccountSync).sync(userId), timeout]);
  } catch (error: unknown) {
    logger.debug('sync', 'Could not send the last changes before logging out.', error);
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Sai da conta (decisão do autor, 2026-11-06): tenta enviar o que falta, encerra a sessão e apaga
 * do aparelho os dados dela, que voltam ao entrar de novo. Sem conexão, o que ainda não foi
 * enviado se perde junto.
 */
export async function leaveAccount(userId: string): Promise<void> {
  await syncBeforeLeaving(userId);
  await container.resolve<AuthService>(TOKENS.AuthService).signOut();
  await container.resolve<LocalAccountData>(TOKENS.LocalAccountData).deleteAccountData(userId);
}
