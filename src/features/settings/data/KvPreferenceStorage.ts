import Storage from 'expo-sqlite/kv-store';
import { injectable } from 'tsyringe';
import { z } from 'zod';

import { PREFERENCE_KEYS } from '@/constants/preferences';

import type { PreferenceStorage } from '../domain/PreferenceStorage';
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_PREFERENCES,
  type ThemePreference,
} from '../domain/ThemePreference';

const themeSchema = z.enum(THEME_PREFERENCES);

/**
 * Preferências no armazenamento chave-valor do `expo-sqlite` (funciona no Expo Go). Valor
 * desconhecido ou corrompido vale como o padrão.
 */
@injectable()
export class KvPreferenceStorage implements PreferenceStorage {
  getTheme(): ThemePreference {
    const parsed = themeSchema.safeParse(Storage.getItemSync(PREFERENCE_KEYS.theme));
    return parsed.success ? parsed.data : DEFAULT_THEME_PREFERENCE;
  }

  async saveTheme(theme: ThemePreference): Promise<void> {
    await Storage.setItem(PREFERENCE_KEYS.theme, theme);
  }
}
