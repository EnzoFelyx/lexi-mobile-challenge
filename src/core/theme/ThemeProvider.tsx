import { vars } from 'nativewind';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colorVariablesFor } from './colorVariables';
import type { ThemeMode } from './theme';
import { useThemeMode } from './useTheme';

// vars() devolve um estilo: as classes (bg-surface…) leem as variáveis do tema ativo.
const colorVariables: Record<ThemeMode, ReturnType<typeof vars>> = {
  light: vars(colorVariablesFor('light')),
  dark: vars(colorVariablesFor('dark')),
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const mode = useThemeMode();
  return (
    <View style={colorVariables[mode]} className="flex-1 bg-background">
      {children}
    </View>
  );
}
