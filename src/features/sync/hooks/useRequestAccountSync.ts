import { useQueryClient } from '@tanstack/react-query';

import { useOwnerId } from '@/features/auth/hooks/useOwnerId';

import { requestAccountSync } from './requestAccountSync';

/** Envia as mudanças da conta logo depois de gravar; o visitante não sincroniza. */
export function useRequestAccountSync(): () => void {
  const queryClient = useQueryClient();
  const ownerId = useOwnerId();

  return () => {
    if (ownerId !== null) {
      void requestAccountSync(queryClient, ownerId);
    }
  };
}
