import type { AccountData, SyncPlan } from './AccountData';

/** Os dados da conta no servidor. */
export interface RemoteAccountData {
  fetch(userId: string): Promise<AccountData>;
  push(userId: string, plan: SyncPlan): Promise<void>;
}

/** Os dados da conta no aparelho. */
export interface LocalAccountData {
  /** Passa os dados do visitante para a conta: favoritos por união; histórico, o mais recente. */
  mergeGuestData(userId: string): Promise<void>;
  /** Grava o estado final no aparelho e devolve o que falta enviar ao servidor. */
  reconcile(userId: string, remote: AccountData): Promise<SyncPlan>;
  /** Tira da fila as mudanças enviadas, se não mudaram de novo durante o envio. */
  markSynced(plan: SyncPlan): Promise<void>;
  /** Apaga do aparelho os dados e a fila da conta; os do visitante não mudam. */
  deleteAccountData(userId: string): Promise<void>;
}

/** Sincroniza a conta com o servidor. */
export interface AccountSync {
  /** Falha sem conexão; os dados continuam no aparelho e a próxima sincronização os envia. */
  sync(userId: string): Promise<void>;
}
