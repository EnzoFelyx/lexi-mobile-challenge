import { SIGN_OUT_SYNC_TIMEOUT_MS } from '@/constants/sync';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import type { AuthService } from '@/features/auth/domain/AuthService';
import { logger } from '@/shared/utils/logger';

import type { AccountSync, LocalAccountData } from '../domain/AccountSync';

/** Tenta enviar o que falta, sem travar a saída; diz se o servidor ficou em dia. */
const syncBeforeLeaving = async (userId: string): Promise<boolean> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => resolve(false), SIGN_OUT_SYNC_TIMEOUT_MS);
  });
  try {
    const sync = container
      .resolve<AccountSync>(TOKENS.AccountSync)
      .sync(userId)
      .then(() => true);
    return await Promise.race([sync, timeout]);
  } catch (error: unknown) {
    logger.debug('sync', 'Could not send the last changes before logging out.', error);
    return false;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Sai da conta (decisões do autor, 2026-11-06): tenta enviar o que falta, encerra a sessão e apaga
 * do aparelho os dados dela, que voltam ao entrar de novo. Se o envio não terminar, os dados e a
 * fila ficam guardados, sem aparecer para ninguém, e são enviados no próximo login dessa conta.
 */
export async function leaveAccount(userId: string): Promise<void> {
  const isServerUpToDate = await syncBeforeLeaving(userId);
  await container.resolve<AuthService>(TOKENS.AuthService).signOut();
  if (isServerUpToDate) {
    await container.resolve<LocalAccountData>(TOKENS.LocalAccountData).deleteAccountData(userId);
  }
}
