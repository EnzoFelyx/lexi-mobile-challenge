import { useColorScheme } from 'react-native';

import { createTheme, type Theme, type ThemeMode } from './theme';

const themes: Record<ThemeMode, Theme> = {
  light: createTheme('light'),
  dark: createTheme('dark'),
};

/** Tema do sistema (`userInterfaceStyle: automatic`); claro quando o sistema não informa. */
export function useThemeMode(): ThemeMode {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

/** Tokens do tema ativo, para o que não aceita `className` (ex.: cor de ícone do Lucide). */
export function useTheme(): Theme {
  return themes[useThemeMode()];
}
