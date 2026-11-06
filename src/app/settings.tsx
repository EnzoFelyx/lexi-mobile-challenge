import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsScreen } from '@/features/settings/components/SettingsScreen';
import { AppHeader } from '@/shared/components/AppHeader';

export default function SettingsRoute() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <AppHeader onBack={router.back} />
      <SettingsScreen />
    </SafeAreaView>
  );
}
