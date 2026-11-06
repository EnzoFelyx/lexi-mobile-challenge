/** Uma palavra favorita da conta. */
export interface AccountFavorite {
  word: string;
  createdAt: Date;
}

/** Uma palavra vista pela conta. */
export interface AccountView {
  word: string;
  viewedAt: Date;
}

/** Os dados de uma conta, no aparelho ou no servidor. */
export interface AccountData {
  favorites: AccountFavorite[];
  history: AccountView[];
}

/** Uma mudança ainda não enviada ao servidor. */
export interface PendingChange {
  id: number;
  kind: 'favorite' | 'history';
  word: string;
  operation: 'upsert' | 'delete';
  changedAt: Date;
}

/** O que enviar ao servidor numa sincronização. */
export interface SyncPlan {
  /** As mudanças atendidas por este envio: saem da fila quando ele der certo. */
  changes: PendingChange[];
  favoritesToSave: AccountFavorite[];
  favoritesToDelete: string[];
  historyToSave: AccountView[];
  historyToDelete: string[];
}
