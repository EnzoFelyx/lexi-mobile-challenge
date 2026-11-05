import { Alert, type AlertButton, Platform } from 'react-native';

import { en } from '@/i18n/en';

import { THEME_PREFERENCES, type ThemePreference } from '../domain/ThemePreference';
import { chooseThemePreference } from './themePreference';
import { useThemePreferenceStore } from './themePreferenceStore';

export interface ThemePreferenceChoice {
  preference: ThemePreference;
  /** Abre o diálogo nativo para escolher entre Light, Dark e System. */
  openThemeDialog: () => void;
}

const themeButtons: AlertButton[] = THEME_PREFERENCES.map((preference) => ({
  text: en.settings.themeName[preference],
  onPress: () => chooseThemePreference(preference),
}));

/**
 * Appearance das configurações (pedido do autor, 2026-11-05): diálogo nativo no meio da tela com
 * Light, Dark e System. No iOS ganha "Cancel"; o Android aceita até 3 botões, então lá cancela
 * tocando fora do diálogo.
 */
export function useThemePreference(): ThemePreferenceChoice {
  const preference = useThemePreferenceStore((state) => state.preference);

  return {
    preference,
    openThemeDialog: () =>
      Alert.alert(
        en.settings.appearance,
        undefined,
        Platform.OS === 'ios'
          ? [...themeButtons, { text: en.settings.cancel, style: 'cancel' }]
          : themeButtons,
        { cancelable: true },
      ),
  };
}
