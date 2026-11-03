import '@/global.css';

import { Stack } from 'expo-router';

import { registerDependencies } from '@/core/di/container';
import { ThemeProvider } from '@/core/theme/ThemeProvider';

registerDependencies();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
