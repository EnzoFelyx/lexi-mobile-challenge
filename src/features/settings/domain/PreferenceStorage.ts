import type { Language } from '@/i18n/languages';

import type { ThemePreference } from './ThemePreference';

/**
 * Preferências salvas no aparelho. A leitura é síncrona para aplicar o tema e o idioma antes da
 * primeira tela.
 */
export interface PreferenceStorage {
  getTheme(): ThemePreference;
  saveTheme(theme: ThemePreference): Promise<void>;
  getLanguage(): Language;
  saveLanguage(language: Language): Promise<void>;
}
