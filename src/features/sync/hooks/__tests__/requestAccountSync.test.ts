import { QueryClient } from '@tanstack/react-query';

import { GUEST_USER_ID } from '@/constants/auth';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { favoriteQueryKeys } from '@/features/favorites/hooks/queryKeys';
import { historyQueryKeys } from '@/features/history/hooks/queryKeys';

import { requestAccountSync } from '../requestAccountSync';

const USER = 'alex';

const setUp = (sync: () => Promise<void>) => {
  container.registerInstance(TOKENS.AccountSync, { sync });
  const queryClient = new QueryClient();
  queryClient.setQueryData(favoriteQueryKeys.list(GUEST_USER_ID), ['guest-word']);
  queryClient.setQueryData(historyQueryKeys.list(GUEST_USER_ID), ['guest-word']);
  queryClient.setQueryData(favoriteQueryKeys.list(USER), ['account-word']);
  return queryClient;
};

describe('requestAccountSync', () => {
  it('forgets the guest lists in memory, so they do not come back after logging out', async () => {
    const queryClient = setUp(async () => undefined);

    await requestAccountSync(queryClient, USER);

    expect(queryClient.getQueryData(favoriteQueryKeys.list(GUEST_USER_ID))).toBeUndefined();
    expect(queryClient.getQueryData(historyQueryKeys.list(GUEST_USER_ID))).toBeUndefined();
    queryClient.clear();
  });

  it('marks the account lists to be read again, even when the sync fails offline', async () => {
    const queryClient = setUp(async () => {
      throw new Error('offline');
    });

    await requestAccountSync(queryClient, USER);

    expect(queryClient.getQueryState(favoriteQueryKeys.list(USER))?.isInvalidated).toBe(true);
    expect(queryClient.getQueryData(favoriteQueryKeys.list(GUEST_USER_ID))).toBeUndefined();
    queryClient.clear();
  });
});
