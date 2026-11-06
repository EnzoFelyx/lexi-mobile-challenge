import { View } from 'react-native';

import { AppText } from '@/shared/components/AppText';

interface PartOfSpeechChipProps {
  label: string;
}

/** Chip de classe gramatical do Figma (noun, verb…): informativo, não é botão. */
export function PartOfSpeechChip({ label }: PartOfSpeechChipProps) {
  return (
    <View className="min-h-chip justify-center rounded-sm bg-accent-soft px-md py-xxs">
      <AppText variant="chip" tone="accent">
        {label}
      </AppText>
    </View>
  );
}
