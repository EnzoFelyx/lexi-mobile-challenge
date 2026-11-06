import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WordPosition } from '@/features/words/domain/wordNavigation';
import { WordDetailScreen } from '@/features/words/components/WordDetailScreen';
import { parseWordDetailParams } from '@/features/words/hooks/wordDetailParams';
import { supportsNativeSheet } from '@/shared/utils/nativeSheet';

// Troca de palavra dentro da mesma folha: sem fechar e reabrir o formSheet.
const navigateTo = (word: string, { source, index }: WordPosition) =>
  router.setParams({ word, source, index: String(index) });

export default function WordDetailRoute() {
  const params = parseWordDetailParams(useLocalSearchParams());
  if (!params) {
    return <Redirect href="/" />;
  }
  const screen = (
    <WordDetailScreen
      word={params.word}
      position={params.position}
      onClose={router.back}
      onNavigate={navigateTo}
    />
  );
  // Em tela cheia, sem a folha nativa: o conteúdo não pode ficar sob as barras do sistema.
  return supportsNativeSheet(Platform.OS, Platform.Version) ? (
    screen
  ) : (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      {screen}
    </SafeAreaView>
  );
}
