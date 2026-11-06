import Storage from 'expo-sqlite/kv-store';
import { injectable } from 'tsyringe';

import { PREFERENCE_KEYS } from '@/constants/preferences';

import type { AuthEntryStorage } from '../domain/AuthEntryStorage';

const CHOSEN = 'true';

/** A escolha no armazenamento chave-valor do `expo-sqlite`; qualquer outro valor vale como "não". */
@injectable()
export class KvAuthEntryStorage implements AuthEntryStorage {
  hasChosenGuest(): boolean {
    return Storage.getItemSync(PREFERENCE_KEYS.guestEntry) === CHOSEN;
  }

  async saveGuestChoice(): Promise<void> {
    await Storage.setItem(PREFERENCE_KEYS.guestEntry, CHOSEN);
  }
}
