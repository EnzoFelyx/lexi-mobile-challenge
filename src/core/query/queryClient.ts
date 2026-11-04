import { QueryClient } from '@tanstack/react-query';

import { QUERY_RETRY_COUNT } from '@/constants/query';

/** Client do React Query do app: toda requisição passa por ele (REGRAS.md, regra 6). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: QUERY_RETRY_COUNT },
    },
  });
}
