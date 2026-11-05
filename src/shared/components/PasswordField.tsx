import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';

import { TextField, type TextFieldProps } from './TextField';

type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'trailing'>;

/** Campo de senha do Figma: oculta o texto e mostra com o olho; desabilitado, fica sem o botão. */
export function PasswordField(props: PasswordFieldProps) {
  const t = useTexts();
  const { colors, sizes } = useTheme();
  const [isRevealed, setIsRevealed] = useState(false);
  const RevealIcon = isRevealed ? Eye : EyeOff;

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      icon={Lock}
      {...props}
      secureTextEntry={!isRevealed}
      trailing={
        props.disabled ? null : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isRevealed ? t.field.hidePassword : t.field.showPassword}
            onPress={() => setIsRevealed((revealed) => !revealed)}
            className="h-touch-target w-touch-target items-center justify-center active:opacity-80"
          >
            <RevealIcon
              size={sizes.icon}
              color={colors.textSecondary}
              strokeWidth={sizes.iconStrokeWidth}
            />
          </Pressable>
        )
      }
    />
  );
}
