import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import type { ColorToken } from '@/core/theme/colorVariables';
import { useTheme } from '@/core/theme/useTheme';

import { AppText, type TextTone } from './AppText';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  accessibilityHint?: string;
  /** Sem ação no momento (ex.: "Previous" na primeira palavra). O Figma não define o visual. */
  disabled?: boolean;
  /** Ação em andamento: spinner no lugar do ícone, sem novo toque e sem apagar o botão (Figma). */
  loading?: boolean;
  className?: string;
}

const containerClass: Record<ButtonVariant, string> = {
  primary: 'border-accent bg-accent',
  secondary: 'border-border bg-surface',
  outline: 'border-accent bg-surface',
};

const labelTone: Record<ButtonVariant, TextTone> = {
  primary: 'onAccent',
  secondary: 'primary',
  outline: 'accent',
};

const iconColor: Record<ButtonVariant, ColorToken> = {
  primary: 'onAccent',
  secondary: 'textPrimary',
  outline: 'accent',
};

/**
 * Botão do Figma (Primary / Secondary): 52pt de altura, ícone opcional à esquerda do texto. O
 * `outline`, com contorno e texto de acento, não está no Figma (pedido do autor).
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon: Icon,
  accessibilityHint,
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const { colors, sizes } = useTheme();
  const feedbackClass = disabled ? 'opacity-40' : loading ? '' : 'active:opacity-80';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      className={`min-h-button flex-row items-center justify-center gap-sm rounded-md border px-lg py-sm ${feedbackClass} ${containerClass[variant]} ${className ?? ''}`}
    >
      {loading ? (
        <Spinner color={iconColor[variant]} size={sizes.icon} />
      ) : Icon ? (
        <Icon
          size={sizes.icon}
          color={colors[iconColor[variant]]}
          strokeWidth={sizes.iconStrokeWidth}
        />
      ) : null}
      <AppText variant="button" tone={labelTone[variant]} className="flex-shrink text-center">
        {label}
      </AppText>
    </Pressable>
  );
}
