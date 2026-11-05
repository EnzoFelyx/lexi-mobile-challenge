import type { ThemePreference } from './ThemePreference';

/** Preferências salvas no aparelho. A leitura é síncrona para aplicar o tema antes da 1ª tela. */
export interface PreferenceStorage {
  getTheme(): ThemePreference;
  saveTheme(theme: ThemePreference): Promise<void>;
}
