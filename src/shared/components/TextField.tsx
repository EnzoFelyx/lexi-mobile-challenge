import type { ReactNode } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';

import { AppText } from './AppText';

export interface TextFieldProps extends Omit<TextInputProps, 'editable' | 'style' | 'className'> {
  label: string;
  /** Mensagem abaixo do campo; também pinta o contorno. */
  error?: string;
  disabled?: boolean;
  /** Ação à direita do texto (ex.: mostrar a senha). */
  trailing?: ReactNode;
}

type FieldState = 'default' | 'error' | 'disabled';

const controlClass: Record<FieldState, string> = {
  default: 'border border-border bg-surface',
  error: 'border-field-error border-error bg-surface',
  disabled: 'border border-border bg-surface-disabled',
};

const stateOf = (disabled: boolean, error?: string): FieldState => {
  if (disabled) {
    return 'disabled';
  }
  return error ? 'error' : 'default';
};

/** Campo de texto do Figma (Email / Password field): rótulo, controle de 56pt e erro abaixo. */
export function TextField({
  label,
  error,
  disabled = false,
  trailing,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useTheme();
  const state = stateOf(disabled, error);

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
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={disabled ? undefined : error}
          accessibilityState={{ disabled }}
          editable={!disabled}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent}
          className={`h-full flex-1 font-sans-regular text-body ${disabled ? 'text-text-disabled' : 'text-text-primary'}`}
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
