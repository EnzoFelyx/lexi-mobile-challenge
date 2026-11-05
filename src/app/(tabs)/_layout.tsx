import { TopTabs } from 'expo-router/js-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DictionaryGate } from '@/features/words/components/DictionaryGate';
import { AppHeader } from '@/shared/components/AppHeader';
import { SegmentedTabBar } from '@/shared/components/SegmentedTabBar';
import { useTexts } from '@/i18n/useTexts';
import { openSettings } from '@/shared/utils/navigation';

export default function TabsLayout() {
  const t = useTexts();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <AppHeader onAccountPress={openSettings} />
      <DictionaryGate>
        <TopTabs tabBar={SegmentedTabBar} screenOptions={{ lazy: true }}>
          <TopTabs.Screen name="index" options={{ title: t.tabs.words }} />
          <TopTabs.Screen name="history" options={{ title: t.tabs.history }} />
          <TopTabs.Screen name="favorites" options={{ title: t.tabs.favorites }} />
        </TopTabs>
      </DictionaryGate>
    </SafeAreaView>
  );
}
