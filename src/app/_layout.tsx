import '@/global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { registerDependencies } from '@/core/di/container';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { useThemeFonts } from '@/core/theme/useThemeFonts';

registerDependencies();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsReady = useThemeFonts();

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
