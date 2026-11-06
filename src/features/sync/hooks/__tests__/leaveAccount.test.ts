import { SIGN_OUT_SYNC_TIMEOUT_MS } from '@/constants/sync';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';

import type { AccountSync, LocalAccountData } from '../../domain/AccountSync';
import { leaveAccount } from '../leaveAccount';

const setUp = (sync: AccountSync['sync']) => {
  const order: string[] = [];
  container.registerInstance(TOKENS.AccountSync, {
    sync: async (userId: string) => {
      order.push('sync');
      return sync(userId);
    },
  });
  container.registerInstance(TOKENS.AuthService, {
    signOut: async () => {
      order.push('signOut');
    },
  });
  const local: Pick<LocalAccountData, 'deleteAccountData'> = {
    deleteAccountData: jest.fn(async () => {
      order.push('delete');
    }),
  };
  container.registerInstance(TOKENS.LocalAccountData, local);
  return { order, local };
};

describe('leaveAccount', () => {
  it('sends what is left, ends the session and only then deletes the account data', async () => {
    const { order, local } = setUp(async () => undefined);

    await leaveAccount('alex');

    expect(order).toEqual(['sync', 'signOut', 'delete']);
    expect(local.deleteAccountData).toHaveBeenCalledWith('alex');
  });

  it('logs out but keeps the unsent data on the device when the sync fails', async () => {
    const { order, local } = setUp(async () => {
      throw new Error('offline');
    });

    await leaveAccount('alex');

    expect(order).toEqual(['sync', 'signOut']);
    expect(local.deleteAccountData).not.toHaveBeenCalled();
  });

  it('does not wait forever for a slow connection, and keeps the unsent data', async () => {
    jest.useFakeTimers();
    const { order } = setUp(() => new Promise<void>(() => undefined));

    const leaving = leaveAccount('alex');
    await jest.advanceTimersByTimeAsync(SIGN_OUT_SYNC_TIMEOUT_MS);
    await leaving;

    expect(order).toEqual(['sync', 'signOut']);
    jest.useRealTimers();
  });
});
