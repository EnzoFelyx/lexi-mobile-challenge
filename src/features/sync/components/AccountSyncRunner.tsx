import { useAccountSync } from '../hooks/useAccountSync';

/** Liga a sincronização dentro do provider do React Query; não desenha nada. */
export function AccountSyncRunner() {
  useAccountSync();
  return null;
}
