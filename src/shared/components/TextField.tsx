import type { LucideIcon } from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import type { ColorToken } from '@/core/theme/colorVariables';
import { useTheme } from '@/core/theme/useTheme';

import { AppText } from './AppText';

export interface TextFieldProps extends Omit<TextInputProps, 'editable' | 'style' | 'className'> {
  label: string;
  /** Mensagem abaixo do campo; também pinta o contorno. */
  error?: string;
  disabled?: boolean;
  /** Ícone à esquerda do texto (fora do Figma, pedido do autor). */
  icon?: LucideIcon;
  /** Ação à direita do texto (ex.: mostrar a senha). */
  trailing?: ReactNode;
}

export type FieldState = 'default' | 'focused' | 'error' | 'disabled';

const controlClass: Record<FieldState, string> = {
  default: 'border border-border bg-surface',
  focused: 'border-field-active border-accent bg-surface',
  error: 'border-field-active border-error bg-surface',
  disabled: 'border border-border bg-surface-disabled',
};

/** O estado do contorno: o erro continua visível mesmo com o campo em foco. */
export function fieldStateOf(disabled: boolean, focused: boolean, error?: string): FieldState {
  if (disabled) {
    return 'disabled';
  }
  if (error) {
    return 'error';
  }
  return focused ? 'focused' : 'default';
}

/** O ícone acompanha o contorno em foco; sem foco, fica cinza como o placeholder. */
export function fieldIconColor(state: FieldState, focused: boolean): ColorToken {
  if (state === 'disabled') {
    return 'textDisabled';
  }
  if (!focused) {
    return 'textSecondary';
  }
  return state === 'error' ? 'error' : 'accent';
}

/** Campo de texto do Figma (Email / Password field): rótulo, controle de 56pt e erro abaixo. */
export function TextField({
  label,
  error,
  disabled = false,
  icon: Icon,
  trailing,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const { colors, sizes } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const state = fieldStateOf(disabled, isFocused, error);

  return (
    <View className="gap-sm">
      {/* O campo já se anuncia pelo rótulo: o texto visível fica fora do leitor de tela. */}
      <AppText
        variant="label"
        tone={disabled ? 'disabled' : 'primary'}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {label}
      </AppText>
      <View
        className={`h-input flex-row items-center gap-md rounded-md px-lg ${controlClass[state]}`}
      >
        {Icon ? (
          <Icon
            size={sizes.icon}
            color={colors[fieldIconColor(state, isFocused)]}
            strokeWidth={sizes.iconStrokeWidth}
          />
        ) : null}
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={disabled ? undefined : error}
          accessibilityState={{ disabled }}
          editable={!disabled}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent}
          className={`h-full flex-1 font-sans-regular text-body ${disabled ? 'text-text-disabled' : 'text-text-primary'}`}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {trailing}
      </View>
      {state === 'error' ? (
        <AppText variant="fieldError" tone="error" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
