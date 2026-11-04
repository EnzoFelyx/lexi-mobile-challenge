import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { MEANING_PREVIEW_COUNT } from '@/constants/words';
import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';

import type { Meaning } from '../domain/WordDetail';
import { PartOfSpeechChip } from './PartOfSpeechChip';

interface MeaningGroupProps {
  meaning: Meaning;
}

/**
 * Significados de uma classe gramatical: chip com a linha divisória, depois cada definição com o
 * exemplo em itálico. Mostra até 3 e um "Show more" para o resto (decisão do autor).
 */
export function MeaningGroup({ meaning }: MeaningGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = meaning.definitions.length - MEANING_PREVIEW_COUNT;
  const visible = expanded
    ? meaning.definitions
    : meaning.definitions.slice(0, MEANING_PREVIEW_COUNT);

  return (
    <View className="gap-sm">
      <View className="flex-row items-center gap-md">
        <PartOfSpeechChip label={meaning.partOfSpeech} />
        <View className="h-px flex-1 bg-border" />
      </View>
      {visible.map((item, index) => (
        <View key={`${meaning.partOfSpeech}-${index}`} className="gap-xxs">
          <AppText variant="definition">{item.definition}</AppText>
          {item.example ? (
            <AppText variant="example" tone="secondary">
              {en.wordDetail.example(item.example)}
            </AppText>
          ) : null}
        </View>
      ))}
      {hiddenCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((current) => !current)}
          className="min-h-touch-target justify-center self-start active:opacity-80"
        >
          <AppText variant="labelStrong" tone="accent">
            {expanded ? en.wordDetail.showLess : en.wordDetail.showMore(hiddenCount)}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
