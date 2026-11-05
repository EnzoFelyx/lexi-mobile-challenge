/** Tema escolhido nas configurações; `system` segue o celular (o padrão). */
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

/** Valor que o `Appearance.setColorScheme` do React Native espera (`auto` = seguir o sistema). */
export function colorSchemeOverrideFor(preference: ThemePreference): 'light' | 'dark' | 'auto' {
  return preference === 'system' ? 'auto' : preference;
}
