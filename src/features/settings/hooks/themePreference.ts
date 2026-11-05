import { Appearance } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { PreferenceStorage } from '../domain/PreferenceStorage';
import { colorSchemeOverrideFor, type ThemePreference } from '../domain/ThemePreference';
import { useThemePreferenceStore } from './themePreferenceStore';

const storage = () => container.resolve<PreferenceStorage>(TOKENS.PreferenceStorage);

const apply = (preference: ThemePreference) => {
  Appearance.setColorScheme(colorSchemeOverrideFor(preference));
  useThemePreferenceStore.getState().setPreference(preference);
};

/**
 * Aplica o tema salvo antes da primeira tela (leitura síncrona), para o app não abrir no tema
 * errado e trocar em seguida. Chamado uma vez, no layout raiz.
 */
export function applySavedThemePreference(): void {
  try {
    apply(storage().getTheme());
  } catch (error: unknown) {
    // Sem a preferência, o app segue o sistema, como antes.
    logger.warn('settings', 'Could not read the saved theme.', error);
  }
}

/** Troca o tema na hora e salva a escolha; se salvar falhar, vale só até fechar o app. */
export function chooseThemePreference(preference: ThemePreference): void {
  apply(preference);
  storage()
    .saveTheme(preference)
    .catch((error: unknown) => logger.warn('settings', 'Could not save the theme.', error));
}
