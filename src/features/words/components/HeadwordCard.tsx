import type { ReactNode } from 'react';
import { View } from 'react-native';

import { DICTIONARY_LANGUAGE } from '@/constants/accessibility';
import { AppText } from '@/shared/components/AppText';

interface HeadwordCardProps {
  word: string;
  phonetic: string | null;
  /** Player de áudio (parte 4 da etapa 3). */
  children?: ReactNode;
}

/** Card de destaque do Figma: palavra em Fraunces 48 e fonética em itálico, sobre `accentSoft`. */
export function HeadwordCard({ word, phonetic, children }: HeadwordCardProps) {
  return (
    <View className="gap-sm rounded-lg bg-accent-soft p-lg-plus">
      <AppText
        variant="headwordLarge"
        accessibilityRole="header"
        accessibilityLanguage={DICTIONARY_LANGUAGE}
      >
        {word}
      </AppText>
      {phonetic ? (
        <AppText variant="phonetic" tone="secondary">
          {phonetic}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}
