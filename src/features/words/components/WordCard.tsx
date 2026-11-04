import { memo } from 'react';
import { Pressable } from 'react-native';

import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';

// Palavras longas encolhem até este fator em vez de quebrar no meio.
const MIN_FONT_SCALE = 0.6;

interface WordCardProps {
  word: string;
  onPress: (word: string) => void;
}

/**
 * Card de palavra do Figma (104pt de altura, borda `border`, Fraunces 19). Mostra só a palavra:
 * a fonética fica no detalhe (decisão do autor). Recebe `onPress(word)` para a lista não criar
 * uma função por item.
 */
export const WordCard = memo(function WordCard({ word, onPress }: WordCardProps) {
  const handlePress = () => onPress(word);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={word}
      accessibilityHint={en.words.openWordHint}
      onPress={handlePress}
      className="h-word-card justify-center rounded-md border border-border bg-surface p-md active:opacity-80"
    >
      <AppText
        variant="headwordCard"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={MIN_FONT_SCALE}
      >
        {word}
      </AppText>
    </Pressable>
  );
});
