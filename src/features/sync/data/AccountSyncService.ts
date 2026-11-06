import { inject, injectable } from 'tsyringe';

import { TOKENS } from '@/core/di/tokens';

import type { AccountSync, LocalAccountData, RemoteAccountData } from '../domain/AccountSync';

/** Busca o servidor, junta com o aparelho e envia a fila. Só roda uma de cada vez. */
@injectable()
export class AccountSyncService implements AccountSync {
  private running: Promise<void> | null = null;
  private runAgain = false;

  constructor(
    @inject(TOKENS.LocalAccountData) private readonly local: LocalAccountData,
    @inject(TOKENS.RemoteAccountData) private readonly remote: RemoteAccountData,
  ) {}

  sync(userId: string): Promise<void> {
    if (this.running) {
      // Uma mudança durante o envio entra na próxima passada, sem começar outra em paralelo.
      this.runAgain = true;
      return this.running;
    }
    this.running = this.runUntilSettled(userId).finally(() => {
      this.running = null;
    });
    return this.running;
  }

  private async runUntilSettled(userId: string): Promise<void> {
    do {
      this.runAgain = false;
      await this.local.mergeGuestData(userId);
      const remoteData = await this.remote.fetch(userId);
      const plan = await this.local.reconcile(userId, remoteData);
      await this.remote.push(userId, plan);
      await this.local.markSynced(plan);
    } while (this.runAgain);
  }
}
