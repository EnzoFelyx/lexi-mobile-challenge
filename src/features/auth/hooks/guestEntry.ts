import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { AuthEntryStorage } from '../domain/AuthEntryStorage';
import { useSessionStore } from './sessionStore';

const storage = () => container.resolve<AuthEntryStorage>(TOKENS.AuthEntryStorage);

/** Aplica a escolha salva antes da primeira tela (leitura síncrona). Chamado no layout raiz. */
export function applySavedGuestEntry(): void {
  try {
    useSessionStore.getState().setHasChosenGuest(storage().hasChosenGuest());
  } catch (error: unknown) {
    // Sem a escolha, o app abre no login, de onde o visitante segue com um toque.
    logger.warn('auth', 'Could not read the guest choice.', error);
  }
}

/** Entra como visitante e salva a escolha; se salvar falhar, vale só até fechar o app. */
export function chooseGuestEntry(): void {
  useSessionStore.getState().setHasChosenGuest(true);
  storage()
    .saveGuestChoice()
    .catch((error: unknown) => logger.warn('auth', 'Could not save the guest choice.', error));
}
