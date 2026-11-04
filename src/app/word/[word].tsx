import { Redirect, router, useLocalSearchParams } from 'expo-router';

import type { WordPosition } from '@/features/words/domain/wordNavigation';
import { WordDetailScreen } from '@/features/words/components/WordDetailScreen';
import { parseWordDetailParams } from '@/features/words/hooks/wordDetailParams';

// Troca de palavra dentro da mesma folha: sem fechar e reabrir o formSheet.
const navigateTo = (word: string, { source, index }: WordPosition) =>
  router.setParams({ word, source, index: String(index) });

export default function WordDetailRoute() {
  const params = parseWordDetailParams(useLocalSearchParams());
  if (!params) {
    return <Redirect href="/" />;
  }
  return (
    <WordDetailScreen
      word={params.word}
      position={params.position}
      onClose={router.back}
      onNavigate={navigateTo}
    />
  );
}
