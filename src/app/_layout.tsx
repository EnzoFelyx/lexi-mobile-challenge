import '@/global.css';

import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { WORD_DETAIL_SHEET_HEIGHT } from '@/constants/navigation';
import { useDatabaseMigrations } from '@/core/database/useDatabaseMigrations';
import { registerDependencies } from '@/core/di/registerDependencies';
import { createNavigationTheme } from '@/core/theme/navigationTheme';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { useTheme } from '@/core/theme/useTheme';
import { useThemeFonts } from '@/core/theme/useThemeFonts';
import { en } from '@/i18n/en';
import { MessageScreen } from '@/shared/components/MessageScreen';

registerDependencies();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const fontsReady = useThemeFonts();
  const database = useDatabaseMigrations();
  const databaseSettled = database.ready || database.error !== undefined;
  const appReady = fontsReady && databaseSettled;

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
          title={en.database.unavailableTitle}
          message={en.database.unavailableMessage}
        />
      </ThemeProvider>
    );
  }

  return (
    <NavigationThemeProvider value={createNavigationTheme(theme)}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
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
            options={{ headerShown: true, title: en.auth.loginTitle }}
          />
        </Stack>
      </ThemeProvider>
    </NavigationThemeProvider>
  );
}
