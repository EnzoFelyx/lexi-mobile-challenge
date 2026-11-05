import { useEffect } from 'react';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { AuthService } from '../domain/AuthService';
import { useSessionStore } from './sessionStore';

/**
 * Mantém o store da sessão igual ao `AuthService`: lê a sessão salva ao abrir e acompanha cada
 * entrada e saída. Usado uma vez, no layout raiz.
 */
export function useSessionSync(): void {
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    const auth = container.resolve<AuthService>(TOKENS.AuthService);
    let active = true;
    const unsubscribe = auth.onUserChange(setUser);
    auth
      .getUser()
      .then((user) => {
        if (active) {
          setUser(user);
        }
      })
      .catch((error: unknown) => {
        // Sem sessão legível, o app segue como visitante.
        logger.warn('auth', 'Could not read the saved session.', error);
        if (active) {
          setUser(null);
        }
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [setUser]);
}
