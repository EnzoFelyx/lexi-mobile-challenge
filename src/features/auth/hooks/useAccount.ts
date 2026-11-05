import { AUTH_DESIGN_PREVIEW } from '@/constants/navigation';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';
import { openWordList } from '@/shared/utils/navigation';

import type { AuthService, AuthUser, Credentials } from '../domain/AuthService';
import { chooseGuestEntry } from './guestEntry';
import { type SessionStatus, useSessionStore } from './sessionStore';

export interface Account {
  status: SessionStatus;
  user: AuthUser | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signUp: (credentials: Credentials) => Promise<void>;
  /** Na primeira abertura, entra como visitante; aberto pelo perfil, volta para a lista. */
  continueAsGuest: () => void;
  signOut: () => void;
}

const auth = () => container.resolve<AuthService>(TOKENS.AuthService);

/** A conta para as telas: o estado da sessão e as ações de entrar e sair. */
export function useAccount(): Account {
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);
  const hasChosenGuest = useSessionStore((state) => state.hasChosenGuest);

  return {
    status,
    user,
    signIn: async (credentials) => {
      await auth().signIn(credentials);
    },
    signUp: async (credentials) => {
      await auth().signUp(credentials);
    },
    continueAsGuest: () => {
      if (AUTH_DESIGN_PREVIEW) {
        return;
      }
      if (hasChosenGuest || user) {
        openWordList();
      } else {
        chooseGuestEntry();
      }
    },
    signOut: () => {
      // Sair mantém no app, como visitante, em vez de voltar ao login.
      chooseGuestEntry();
      auth()
        .signOut()
        .catch((error: unknown) => logger.warn('auth', 'Could not log out.', error));
    },
  };
}
