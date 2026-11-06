import type { Database } from './client';
import { type PENDING_SYNC_KINDS, type PENDING_SYNC_OPERATIONS, pendingSync } from './schema';

export type PendingSyncKind = (typeof PENDING_SYNC_KINDS)[number];
export type PendingSyncOperation = (typeof PENDING_SYNC_OPERATIONS)[number];

/** O banco ou a transação em andamento: a mudança e a fila são gravadas juntas. */
export type DatabaseWriter = Pick<Database, 'select' | 'insert' | 'update' | 'delete'>;

/** Anota a mudança na fila de envio; o visitante não sincroniza, então não entra nela. */
export function recordPendingChange(
  writer: DatabaseWriter,
  userId: string | null,
  kind: PendingSyncKind,
  word: string,
  operation: PendingSyncOperation,
): void {
  if (userId === null) {
    return;
  }
  const changedAt = new Date();
  writer
    .insert(pendingSync)
    .values({ userId, kind, word, operation, changedAt })
    .onConflictDoUpdate({
      target: [pendingSync.userId, pendingSync.kind, pendingSync.word],
      set: { operation, changedAt },
    })
    .run();
}
