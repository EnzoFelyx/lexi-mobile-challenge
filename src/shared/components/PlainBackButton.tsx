import { ArrowLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';

export interface BackButtonProps {
  onPress: () => void;
}

export const ROUND_BUTTON_CLASS =
  'h-touch-target w-touch-target items-center justify-center rounded-pill bg-surface-muted';

/** Seta de voltar do header (44pt), para onde não há vidro nativo. */
export function PlainBackButton({ onPress }: BackButtonProps) {
  const t = useTexts();
  const { colors, sizes } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.header.back}
      onPress={onPress}
      className={`${ROUND_BUTTON_CLASS} active:opacity-80`}
    >
      <ArrowLeft
        size={sizes.closeIcon}
        color={colors.textPrimary}
        strokeWidth={sizes.iconStrokeWidth}
      />
    </Pressable>
  );
}
