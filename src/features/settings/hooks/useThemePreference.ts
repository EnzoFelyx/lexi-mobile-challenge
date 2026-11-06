import { useTexts } from '@/i18n/useTexts';

import { THEME_PREFERENCES, type ThemePreference } from '../domain/ThemePreference';
import type { PreferenceChoice } from './preferenceChoice';
import { chooseThemePreference } from './themePreference';
import { useThemePreferenceStore } from './themePreferenceStore';

/** Appearance das configurações: Light, Dark e System, com o texto no idioma atual. */
export function useThemePreference(): PreferenceChoice<ThemePreference> {
  const t = useTexts();
  const selected = useThemePreferenceStore((state) => state.preference);

  return {
    selected,
    options: THEME_PREFERENCES.map((value) => ({ value, label: t.settings.themeName[value] })),
    choose: chooseThemePreference,
  };
}
