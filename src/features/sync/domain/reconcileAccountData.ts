import type {
  AccountData,
  AccountFavorite,
  AccountView,
  PendingChange,
  SyncPlan,
} from './AccountData';

const pendingOf = (changes: readonly PendingChange[], kind: PendingChange['kind']) =>
  new Map(changes.filter((change) => change.kind === kind).map((change) => [change.word, change]));

/**
 * Junta uma lista do servidor com a do aparelho. O que está na fila venceu no aparelho; o que não
 * está na fila e não existe no servidor foi apagado em outro aparelho, então sai daqui também.
 */
function reconcileList<T extends { word: string }>(
  remote: readonly T[],
  local: readonly T[],
  pending: ReadonlyMap<string, PendingChange>,
  choose: (remoteItem: T, localItem: T) => T,
): T[] {
  const remoteByWord = new Map(remote.map((item) => [item.word, item]));
  const kept = remote.filter((item) => pending.get(item.word)?.operation !== 'delete');
  const reconciled = new Map(kept.map((item) => [item.word, item]));

  local.forEach((item) => {
    if (pending.get(item.word)?.operation !== 'upsert') {
      return;
    }
    const remoteItem = remoteByWord.get(item.word);
    reconciled.set(item.word, remoteItem ? choose(remoteItem, item) : item);
  });
  return [...reconciled.values()];
}

const earlierFavorite = (first: AccountFavorite, second: AccountFavorite) =>
  first.createdAt <= second.createdAt ? first : second;

const laterView = (first: AccountView, second: AccountView) =>
  first.viewedAt >= second.viewedAt ? first : second;

/** O estado final da conta no aparelho: favoritos por união e, no histórico, a visita mais recente. */
export function reconcileAccountData(
  remote: AccountData,
  local: AccountData,
  changes: readonly PendingChange[],
): AccountData {
  return {
    favorites: reconcileList(
      remote.favorites,
      local.favorites,
      pendingOf(changes, 'favorite'),
      earlierFavorite,
    ),
    history: reconcileList(remote.history, local.history, pendingOf(changes, 'history'), laterView),
  };
}

/** O que falta no servidor para ele ficar igual ao estado final. */
export function buildSyncPlan(final: AccountData, changes: readonly PendingChange[]): SyncPlan {
  const wordsWith = (kind: PendingChange['kind'], operation: PendingChange['operation']) =>
    new Set(
      changes
        .filter((change) => change.kind === kind && change.operation === operation)
        .map((change) => change.word),
    );
  const favoritesToSave = wordsWith('favorite', 'upsert');
  const historyToSave = wordsWith('history', 'upsert');

  return {
    changes: [...changes],
    favoritesToSave: final.favorites.filter((item) => favoritesToSave.has(item.word)),
    favoritesToDelete: [...wordsWith('favorite', 'delete')],
    historyToSave: final.history.filter((item) => historyToSave.has(item.word)),
    historyToDelete: [...wordsWith('history', 'delete')],
  };
}
