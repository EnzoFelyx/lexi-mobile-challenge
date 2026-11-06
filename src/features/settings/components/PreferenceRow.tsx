import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { AppText } from '@/shared/components/AppText';

interface PreferenceRowProps {
  label: string;
  value: string;
  /** Sem ação, a linha só mostra o valor (ex.: dentro do menu nativo do iOS, que cuida do toque). */
  onPress?: () => void;
  accessibilityHint?: string;
}

const ROW = 'min-h-row flex-row items-center justify-between gap-md px-lg py-sm';

/** Linha de preferência do Figma (56pt): rótulo à esquerda, valor atual e seta à direita. */
export function PreferenceRow({ label, value, onPress, accessibilityHint }: PreferenceRowProps) {
  const { colors, sizes } = useTheme();
  const content = (
    <>
      <AppText variant="body" className="flex-shrink">
        {label}
      </AppText>
      <View className="flex-shrink flex-row items-center gap-sm">
        <AppText variant="subtitle" tone="secondary" className="flex-shrink">
          {value}
        </AppText>
        <ChevronRight
          size={sizes.noteIcon}
          color={colors.textSecondary}
          strokeWidth={sizes.iconStrokeWidth}
        />
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={`${label}, ${value}`} className={ROW}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      className={`${ROW} active:bg-surface-muted`}
    >
      {content}
    </Pressable>
  );
}
