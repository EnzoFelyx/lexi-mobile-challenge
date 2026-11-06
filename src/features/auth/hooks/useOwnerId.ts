import { GUEST_USER_ID } from '@/constants/auth';

import { useSessionStore } from './sessionStore';

/** De quem são os favoritos e o histórico na tela: a conta aberta ou o visitante. */
export function useOwnerId(): string | null {
  return useSessionStore((state) => state.user?.id ?? GUEST_USER_ID);
}
