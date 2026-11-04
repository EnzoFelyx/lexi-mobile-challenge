import { View } from 'react-native';

import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';

import type { Meaning } from '../domain/WordDetail';
import { MeaningGroup } from './MeaningGroup';

interface MeaningsSectionProps {
  meanings: readonly Meaning[];
}

/** Seção "Meanings" do Figma: um grupo por classe gramatical. */
export function MeaningsSection({ meanings }: MeaningsSectionProps) {
  return (
    <View className="gap-lg">
      <AppText variant="heading" accessibilityRole="header">
        {en.wordDetail.meanings}
      </AppText>
      {meanings.map((meaning) => (
        <MeaningGroup key={meaning.partOfSpeech} meaning={meaning} />
      ))}
    </View>
  );
}
