import { View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';

import type { Meaning } from '../domain/WordDetail';
import { MeaningGroup } from './MeaningGroup';

interface MeaningsSectionProps {
  meanings: readonly Meaning[];
}

/** Seção "Meanings" do Figma: um grupo por classe gramatical. */
export function MeaningsSection({ meanings }: MeaningsSectionProps) {
  const t = useTexts();
  return (
    <View className="gap-lg">
      <AppText variant="heading" accessibilityRole="header">
        {t.wordDetail.meanings}
      </AppText>
      {meanings.map((meaning) => (
        <MeaningGroup key={meaning.partOfSpeech} meaning={meaning} />
      ))}
    </View>
  );
}
