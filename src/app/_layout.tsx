import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { type ComponentProps, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { WORD_DETAIL_SHEET_HEIGHT } from '@/constants/navigation';
import { useDatabaseMigrations } from '@/core/database/useDatabaseMigrations';
import { registerDependencies } from '@/core/di/registerDependencies';
import { applySavedGuestEntry } from '@/features/auth/hooks/guestEntry';
import { useEntryNavigation } from '@/features/auth/hooks/useEntryNavigation';
import { useSessionSync } from '@/features/auth/hooks/useSessionSync';
import { applySavedLanguage } from '@/features/settings/hooks/languagePreference';
import { applySavedThemePreference } from '@/features/settings/hooks/themePreference';
import { createQueryClient } from '@/core/query/queryClient';
import { createNavigationTheme } from '@/core/theme/navigationTheme';
import { radius } from '@/core/theme/theme';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { useTheme } from '@/core/theme/useTheme';
import { useThemeFonts } from '@/core/theme/useThemeFonts';
import { AccountSyncRunner } from '@/features/sync/components/AccountSyncRunner';
import { useTexts } from '@/i18n/useTexts';
import { MessageScreen } from '@/shared/components/MessageScreen';
import { supportsNativeSheet } from '@/shared/utils/nativeSheet';

registerDependencies();
applySavedThemePreference();
applySavedLanguage();
applySavedGuestEntry();
SplashScreen.preventAutoHideAsync();

const wordDetailOptions: ComponentProps<typeof Stack.Screen>['options'] = supportsNativeSheet(
  Platform.OS,
  Platform.Version,
)
  ? {
      presentation: 'formSheet',
      sheetAllowedDetents: [WORD_DETAIL_SHEET_HEIGHT],
      sheetGrabberVisible: true,
      // Só o Android: no iOS, fica o visual nativo escolhido pelo autor (CLAUDE.md 6.2).
      sheetCornerRadius: Platform.OS === 'android' ? radius.sheet : undefined,
    }
  : { presentation: 'modal' };

export default function RootLayout() {
  const t = useTexts();
  const [queryClient] = useState(createQueryClient);
  const theme = useTheme();
  const fontsReady = useThemeFonts();
  const database = useDatabaseMigrations();
  const databaseSettled = database.ready || database.error !== undefined;
  useSessionSync();
  const entry = useEntryNavigation();
  // Espera a sessão salva para o login não piscar antes da lista.
  const appReady = fontsReady && databaseSettled && entry.isReady;
  // Ícones claros sobre o tema escuro e escuros sobre o claro.
  const statusBarStyle = theme.mode === 'dark' ? 'light' : 'dark';

  // No Android, a barra de gestos deixa ver o fundo da janela, que seguiria branco: usa a cor do tema.
  useEffect(() => {
    if (Platform.OS === 'android') {
      void SystemUI.setBackgroundColorAsync(theme.colors.background);
    }
  }, [theme.colors.background]);

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
        <MessageScreen title={t.recoverableError.title} message={t.database.unavailableMessage} />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AccountSyncRunner />
      <NavigationThemeProvider value={createNavigationTheme(theme)}>
        <ThemeProvider>
          {/* A barra de status segue o tema do app, não o do celular: com o tema escolhido nas
              configurações, os dois podem ser diferentes. Só pelo StatusBar: o Expo Go tem
              UIViewControllerBasedStatusBarAppearance desligado e acusa erro se as telas da Stack
              tentarem mudar a barra (statusBarStyle); o app.json desliga a chave também no build,
              para os dois se comportarem igual. */}
          <StatusBar style={statusBarStyle} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/sign-up" />
            <Stack.Protected guard={entry.canEnterApp}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="word/[word]" options={wordDetailOptions} />
              <Stack.Screen name="settings" />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
      </NavigationThemeProvider>
    </QueryClientProvider>
  );
}
