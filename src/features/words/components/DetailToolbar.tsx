import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';

interface DetailToolbarProps {
  onClose: () => void;
  /** Ação à direita (o coração); sem ela, um espaço do mesmo tamanho mantém o título no centro. */
  action?: ReactNode;
}

/** Barra do detalhe (Figma): "X" à esquerda, o título "Word explorer" no centro e o coração à direita. */
export function DetailToolbar({ onClose, action }: DetailToolbarProps) {
  const t = useTexts();
  const { colors, sizes } = useTheme();

  return (
    <View className="h-touch-target flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.wordDetail.close}
        onPress={onClose}
        className="h-touch-target w-touch-target items-center justify-center rounded-pill bg-surface-muted active:opacity-80"
      >
        <X size={sizes.closeIcon} color={colors.textPrimary} strokeWidth={sizes.iconStrokeWidth} />
      </Pressable>
      <AppText variant="eyebrow" tone="secondary">
        {t.wordDetail.title}
      </AppText>
      {action ?? <View className="w-touch-target" />}
    </View>
  );
}
