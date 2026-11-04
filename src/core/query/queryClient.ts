import { QueryClient } from '@tanstack/react-query';

import { QUERY_RETRY_COUNT } from '@/constants/query';

/**
 * Erros com `retryable: false` não são repetidos sozinhos (ex.: limite de consultas de uma API,
 * em que repetir só prolonga o bloqueio). O usuário tenta de novo pela tela.
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  const retryable = !(error instanceof Error && 'retryable' in error && error.retryable === false);
  return retryable && failureCount < QUERY_RETRY_COUNT;
}

/** Client do React Query do app: toda requisição passa por ele (REGRAS.md, regra 6). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry },
    },
  });
}
