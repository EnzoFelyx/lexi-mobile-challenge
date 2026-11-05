import { create } from 'zustand';

import type { AuthUser } from '../domain/AuthService';

/** `loading` só no primeiro instante, enquanto a sessão salva é lida. */
export type SessionStatus = 'loading' | 'guest' | 'signedIn';

interface SessionState {
  status: SessionStatus;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

/**
 * Sessão compartilhada entre as telas (Zustand, como previsto no CLAUDE.md). Quem escreve aqui é
 * só o `useSessionSync`, que acompanha o `AuthService`; as telas leem pelo `useAccount`.
 */
export const useSessionStore = create<SessionState>()((set) => ({
  status: 'loading',
  user: null,
  setUser: (user) => set({ user, status: user ? 'signedIn' : 'guest' }),
}));
