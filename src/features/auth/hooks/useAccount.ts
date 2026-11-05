import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { AuthService, AuthUser, Credentials } from '../domain/AuthService';
import { type SessionStatus, useSessionStore } from './sessionStore';

export interface Account {
  status: SessionStatus;
  user: AuthUser | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => void;
}

const auth = () => container.resolve<AuthService>(TOKENS.AuthService);

/** A conta para as telas: o estado da sessão e as ações de entrar e sair. */
export function useAccount(): Account {
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);

  return {
    status,
    user,
    signIn: async (credentials) => {
      await auth().signIn(credentials);
    },
    signOut: () => {
      auth()
        .signOut()
        .catch((error: unknown) => logger.warn('auth', 'Could not log out.', error));
    },
  };
}
