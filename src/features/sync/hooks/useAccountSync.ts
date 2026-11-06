import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useOwnerId } from '@/features/auth/hooks/useOwnerId';

import { requestAccountSync } from './requestAccountSync';

/** Sincroniza ao entrar na conta e sempre que o app volta para a frente. */
export function useAccountSync(): void {
  const queryClient = useQueryClient();
  const ownerId = useOwnerId();

  useEffect(() => {
    if (ownerId === null) {
      return;
    }
    void requestAccountSync(queryClient, ownerId);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void requestAccountSync(queryClient, ownerId);
      }
    });
    return () => subscription.remove();
  }, [ownerId, queryClient]);
}
