import { Text, type TextProps } from 'react-native';

import type { typography } from '@/core/theme/theme';

export type TextVariant = keyof typeof typography;
export type TextTone = 'primary' | 'secondary' | 'accent' | 'onAccent';

// Classes literais: o NativeWind só gera o CSS das classes que encontra escritas no código.
export const textVariantClass: Record<TextVariant, string> = {
  display: 'font-serif-semi-bold text-display',
  logo: 'font-serif-semi-bold text-logo',
  headwordLarge: 'font-serif-semi-bold text-headword-large',
  heading: 'font-serif-semi-bold text-heading',
  title: 'font-serif-semi-bold text-title',
  emptyTitle: 'font-serif-semi-bold text-empty-title',
  headwordCard: 'font-serif-semi-bold text-headword-card',
  body: 'font-sans-regular text-body',
  button: 'font-sans-semi-bold text-button',
  label: 'font-sans-medium text-label',
  labelStrong: 'font-sans-semi-bold text-label-strong',
  description: 'font-sans-regular text-description',
  subtitle: 'font-sans-regular text-subtitle',
  definition: 'font-sans-regular text-definition',
  phonetic: 'font-sans-italic text-phonetic',
  example: 'font-sans-italic text-example',
  note: 'font-sans-regular text-note',
  meta: 'font-sans-semi-bold text-meta',
  message: 'font-sans-regular text-message',
  hint: 'font-sans-regular text-hint',
  chip: 'font-sans-semi-bold text-chip',
  caption: 'font-sans-regular text-caption',
  eyebrow: 'font-sans-semi-bold text-eyebrow uppercase',
  overline: 'font-sans-semi-bold text-overline uppercase',
};

const toneClass: Record<TextTone, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  accent: 'text-accent',
  onAccent: 'text-on-accent',
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
}

/** Texto com a tipografia do Figma: a variante junta fonte, tamanho, entrelinha e tracking. */
export function AppText({ variant = 'body', tone = 'primary', className, ...props }: AppTextProps) {
  return (
    <Text
      className={`${textVariantClass[variant]} ${toneClass[tone]} ${className ?? ''}`}
      {...props}
    />
  );
}
