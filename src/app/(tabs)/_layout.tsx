import { TopTabs } from 'expo-router/js-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DictionaryGate } from '@/features/words/components/DictionaryGate';
import { AppHeader } from '@/shared/components/AppHeader';
import { SegmentedTabBar } from '@/shared/components/SegmentedTabBar';
import { en } from '@/i18n/en';
import { openLogin } from '@/shared/utils/navigation';

export default function TabsLayout() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <AppHeader onAccountPress={openLogin} />
      <DictionaryGate>
        <TopTabs tabBar={SegmentedTabBar} screenOptions={{ lazy: true }}>
          <TopTabs.Screen name="index" options={{ title: en.tabs.words }} />
          <TopTabs.Screen name="history" options={{ title: en.tabs.history }} />
          <TopTabs.Screen name="favorites" options={{ title: en.tabs.favorites }} />
        </TopTabs>
      </DictionaryGate>
    </SafeAreaView>
  );
}
