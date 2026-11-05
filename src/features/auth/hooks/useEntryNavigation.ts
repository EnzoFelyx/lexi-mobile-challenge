import { useEffect, useRef } from 'react';

import { AUTH_DESIGN_PREVIEW } from '@/constants/navigation';
import { enterApp } from '@/shared/utils/navigation';

import { useSessionStore } from './sessionStore';

interface EntryState {
  canEnterApp: boolean;
  signedIn: boolean;
}

interface EntryNavigation {
  /** A sessão salva já foi lida: a primeira tela pode ser decidida. */
  isReady: boolean;
  /** Com conta ou visitante, o app abre as telas principais; senão, só o login e o cadastro. */
  canEnterApp: boolean;
}

/** Com conta ou visitante escolhido, as telas principais estão abertas. */
export function useCanEnterApp(): boolean {
  const signedIn = useSessionStore((state) => state.status === 'signedIn');
  const hasChosenGuest = useSessionStore((state) => state.hasChosenGuest);
  return !AUTH_DESIGN_PREVIEW && (signedIn || hasChosenGuest);
}

/**
 * Decide a entrada no app (login como primeira tela, CLAUDE.md 6.7) e, ao entrar ou escolher o
 * visitante, leva para a lista. Espera a tela seguinte existir: só navega depois do commit.
 */
export function useEntryNavigation(): EntryNavigation {
  const status = useSessionStore((state) => state.status);
  const signedIn = status === 'signedIn';
  const canEnterApp = useCanEnterApp();
  const previous = useRef<EntryState | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    const before = previous.current;
    previous.current = { canEnterApp, signedIn };
    const justEntered =
      before && canEnterApp && (!before.canEnterApp || (signedIn && !before.signedIn));
    if (justEntered) {
      enterApp();
    }
  }, [status, canEnterApp, signedIn]);

  return { isReady: status !== 'loading', canEnterApp };
}
