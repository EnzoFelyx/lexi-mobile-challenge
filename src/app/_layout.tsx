import '@/global.css';

import { Stack } from 'expo-router';

import { ThemeProvider } from '@/core/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
