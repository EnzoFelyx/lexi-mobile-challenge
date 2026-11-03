import { router, useLocalSearchParams } from 'expo-router';

import { WordDetailPlaceholder } from '@/features/words/components/WordDetailPlaceholder';

export default function WordDetailRoute() {
  const { word } = useLocalSearchParams<{ word: string }>();
  return <WordDetailPlaceholder word={word ?? ''} onClose={router.back} />;
}
