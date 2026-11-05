import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { WORD_DETAIL_SHEET_HEIGHT } from '@/constants/navigation';
import { useDatabaseMigrations } from '@/core/database/useDatabaseMigrations';
import { registerDependencies } from '@/core/di/registerDependencies';
import { useSessionSync } from '@/features/auth/hooks/useSessionSync';
import { applySavedLanguage } from '@/features/settings/hooks/languagePreference';
import { applySavedThemePreference } from '@/features/settings/hooks/themePreference';
import { createQueryClient } from '@/core/query/queryClient';
import { createNavigationTheme } from '@/core/theme/navigationTheme';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { useTheme } from '@/core/theme/useTheme';
import { useThemeFonts } from '@/core/theme/useThemeFonts';
import { useTexts } from '@/i18n/useTexts';
import { MessageScreen } from '@/shared/components/MessageScreen';

registerDependencies();
applySavedThemePreference();
applySavedLanguage();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const t = useTexts();
  const [queryClient] = useState(createQueryClient);
  const theme = useTheme();
  const fontsReady = useThemeFonts();
  const database = useDatabaseMigrations();
  const databaseSettled = database.ready || database.error !== undefined;
  const appReady = fontsReady && databaseSettled;
  useSessionSync();
  // Ícones claros sobre o tema escuro e escuros sobre o claro.
  const statusBarStyle = theme.mode === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  if (database.error) {
    return (
      <ThemeProvider>
        <MessageScreen
          title={t.database.unavailableTitle}
          message={t.database.unavailableMessage}
        />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationThemeProvider value={createNavigationTheme(theme)}>
        <ThemeProvider>
          {/* A barra de status segue o tema do app, não o do celular: com o tema escolhido nas
              configurações, os dois podem ser diferentes. No iOS, com
              UIViewControllerBasedStatusBarAppearance ligado (react-native-screens), quem manda
              é cada tela da Stack (statusBarStyle); o StatusBar vale para o Android. */}
          <StatusBar style={statusBarStyle} />
          <Stack screenOptions={{ headerShown: false, statusBarStyle }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="word/[word]"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [WORD_DETAIL_SHEET_HEIGHT],
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: true, title: t.auth.loginTitle }}
            />
          </Stack>
        </ThemeProvider>
      </NavigationThemeProvider>
    </QueryClientProvider>
  );
}
