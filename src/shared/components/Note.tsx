import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import type { ColorToken } from '@/core/theme/colorVariables';
import { useTheme } from '@/core/theme/useTheme';

import { AppText, type TextTone } from './AppText';

export type NoteTone = 'neutral' | 'accent';

interface NoteProps {
  icon: LucideIcon;
  text: string;
  tone?: NoteTone;
  /** O Figma usa 16 nas abas e 18 no erro do detalhe. */
  iconSize?: number;
}

const containerClass: Record<NoteTone, string> = {
  neutral: 'bg-surface-muted',
  accent: 'bg-accent-soft',
};

const textTone: Record<NoteTone, TextTone> = {
  neutral: 'secondary',
  accent: 'accent',
};

const iconColor: Record<NoteTone, ColorToken> = {
  neutral: 'textSecondary',
  accent: 'accent',
};

/** Caixa de nota do Figma: ícone e um texto curto, neutra (cinza) ou de acento (verde). */
export function Note({ icon: Icon, text, tone = 'neutral', iconSize }: NoteProps) {
  const { colors, sizes } = useTheme();

  return (
    <View className={`w-full flex-row items-center gap-sm rounded-md p-lg ${containerClass[tone]}`}>
      <Icon
        size={iconSize ?? sizes.noteIcon}
        color={colors[iconColor[tone]]}
        strokeWidth={sizes.iconStrokeWidth}
      />
      <AppText variant="hint" tone={textTone[tone]} className="flex-1">
        {text}
      </AppText>
    </View>
  );
}
