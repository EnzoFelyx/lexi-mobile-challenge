import { memo } from 'react';
import { Pressable } from 'react-native';

import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';

// Palavras longas quebram em até 2 linhas no tamanho do Figma (cabem quase todas: ~8 letras
// por linha). Só as raríssimas com mais de ~16 letras encolhem, até este fator.
const MAX_LINES = 2;
const MIN_FONT_SCALE = 0.6;

interface WordCardProps {
  word: string;
  /** Posição na lista, para o Previous/Next do detalhe. */
  index: number;
  onPress: (word: string, index: number) => void;
}

/**
 * Card de palavra do Figma (104pt de altura, borda `border`, Fraunces 19). Mostra só a palavra:
 * a fonética fica no detalhe (decisão do autor). Palavra longa quebra de linha em vez de encolher
 * (decisão do autor): no Android com hífen; no iOS por letra, sem hífen (o React Native não expõe
 * a hifenização do iOS). Recebe `onPress(word, index)` para a lista não
 * criar uma função por item.
 */
export const WordCard = memo(function WordCard({ word, index, onPress }: WordCardProps) {
  const handlePress = () => onPress(word, index);

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
        numberOfLines={MAX_LINES}
        adjustsFontSizeToFit
        minimumFontScale={MIN_FONT_SCALE}
        android_hyphenationFrequency="full"
        textBreakStrategy="highQuality"
      >
        {word}
      </AppText>
    </Pressable>
  );
});
