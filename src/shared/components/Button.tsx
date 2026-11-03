import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import type { ColorToken } from '@/core/theme/colorVariables';
import { useTheme } from '@/core/theme/useTheme';

import { AppText, type TextTone } from './AppText';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  accessibilityHint?: string;
  className?: string;
}

const containerClass: Record<ButtonVariant, string> = {
  primary: 'border-accent bg-accent',
  secondary: 'border-border bg-surface',
};

const labelTone: Record<ButtonVariant, TextTone> = {
  primary: 'onAccent',
  secondary: 'primary',
};

const iconColor: Record<ButtonVariant, ColorToken> = {
  primary: 'onAccent',
  secondary: 'textPrimary',
};

/** Botão do Figma (Primary / Secondary): 52pt de altura, ícone opcional à esquerda do texto. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon: Icon,
  accessibilityHint,
  className,
}: ButtonProps) {
  const { colors, sizes } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      className={`h-button flex-row items-center justify-center gap-sm rounded-md border px-lg active:opacity-80 ${containerClass[variant]} ${className ?? ''}`}
    >
      {Icon ? (
        <Icon
          size={sizes.icon}
          color={colors[iconColor[variant]]}
          strokeWidth={sizes.iconStrokeWidth}
        />
      ) : null}
      <AppText variant="button" tone={labelTone[variant]}>
        {label}
      </AppText>
    </Pressable>
  );
}
