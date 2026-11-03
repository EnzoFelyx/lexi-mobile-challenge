import { X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { AppText } from '@/shared/components/AppText';
import { en } from '@/i18n/en';

interface WordDetailPlaceholderProps {
  word: string;
  onClose: () => void;
}

/** Detalhe provisório (etapa 1): prova a folha `formSheet`; o conteúdo real vem na etapa 3. */
export function WordDetailPlaceholder({ word, onClose }: WordDetailPlaceholderProps) {
  const { colors, sizes } = useTheme();

  return (
    <View className="flex-1 gap-xl bg-background px-xl pt-xl">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={en.wordDetail.close}
        onPress={onClose}
        className="h-touch-target w-touch-target items-center justify-center rounded-pill bg-surface-muted active:opacity-80"
      >
        <X size={sizes.icon} color={colors.textPrimary} strokeWidth={sizes.iconStrokeWidth} />
      </Pressable>
      <AppText variant="display" accessibilityRole="header">
        {word}
      </AppText>
      <AppText variant="description" tone="secondary">
        {en.placeholder.note}
      </AppText>
    </View>
  );
}
