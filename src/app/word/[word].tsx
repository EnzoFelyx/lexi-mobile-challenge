import { router, useLocalSearchParams } from 'expo-router';

import { WordDetailScreen } from '@/features/words/components/WordDetailScreen';

export default function WordDetailRoute() {
  const { word } = useLocalSearchParams<{ word: string }>();
  return <WordDetailScreen word={word ?? ''} onClose={router.back} />;
}
