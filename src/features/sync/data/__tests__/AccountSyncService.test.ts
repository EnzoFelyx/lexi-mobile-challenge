import type { AccountData, SyncPlan } from '../../domain/AccountData';
import { AccountSyncService } from '../AccountSyncService';

const PLAN: SyncPlan = {
  changes: [],
  favoritesToSave: [],
  favoritesToDelete: [],
  historyToSave: [],
  historyToDelete: [],
};
const REMOTE_DATA = { favorites: [], history: [] };

const createLocal = () => ({
  mergeGuestData: jest.fn<Promise<void>, [string]>(async () => undefined),
  reconcile: jest.fn<Promise<SyncPlan>, [string, AccountData]>(async () => PLAN),
  markSynced: jest.fn<Promise<void>, [SyncPlan]>(async () => undefined),
  deleteAccountData: jest.fn<Promise<void>, [string]>(async () => undefined),
});

const createRemote = () => ({
  fetch: jest.fn<Promise<AccountData>, [string]>(async () => REMOTE_DATA),
  push: jest.fn<Promise<void>, [string, SyncPlan]>(async () => undefined),
});

describe('AccountSyncService', () => {
  it('merges the guest, reads the server, reconciles, sends and clears the queue', async () => {
    const local = createLocal();
    const remote = createRemote();

    await new AccountSyncService(local, remote).sync('alex');

    expect(local.mergeGuestData).toHaveBeenCalledWith('alex');
    expect(local.reconcile).toHaveBeenCalledWith('alex', REMOTE_DATA);
    expect(remote.push).toHaveBeenCalledWith('alex', PLAN);
    expect(local.markSynced).toHaveBeenCalledWith(PLAN);
  });

  it('keeps the queue when the server is down, with the guest data already merged', async () => {
    const local = createLocal();
    const remote = createRemote();
    remote.fetch.mockRejectedValueOnce(new Error('offline'));

    await expect(new AccountSyncService(local, remote).sync('alex')).rejects.toThrow('offline');

    expect(local.mergeGuestData).toHaveBeenCalled();
    expect(local.markSynced).not.toHaveBeenCalled();
  });

  it('keeps the queue when sending fails', async () => {
    const local = createLocal();
    const remote = createRemote();
    remote.push.mockRejectedValueOnce(new Error('offline'));

    await expect(new AccountSyncService(local, remote).sync('alex')).rejects.toThrow('offline');

    expect(local.markSynced).not.toHaveBeenCalled();
  });

  it('runs once more for a request made during a sync, never two at once', async () => {
    const local = createLocal();
    const remote = createRemote();
    const service = new AccountSyncService(local, remote);

    await Promise.all([service.sync('alex'), service.sync('alex'), service.sync('alex')]);

    expect(remote.fetch).toHaveBeenCalledTimes(2);
  });

  it('can sync again after a failure', async () => {
    const local = createLocal();
    const remote = createRemote();
    remote.fetch.mockRejectedValueOnce(new Error('offline'));
    const service = new AccountSyncService(local, remote);
    await expect(service.sync('alex')).rejects.toThrow('offline');

    await service.sync('alex');

    expect(local.markSynced).toHaveBeenCalledTimes(1);
  });
});
