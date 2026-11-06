import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { sizes } from '@/core/theme/theme';
import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';

import { type BackButtonProps, PlainBackButton } from './PlainBackButton';

// GlassView não aceita className.
const styles = StyleSheet.create({
  glass: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: sizes.touchTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Seta de voltar com o Liquid Glass do iOS 26 (pedido do autor, 2026-11-06). Em iOS mais antigo,
 * fica o botão comum. Sem `active:opacity`: a Apple não recomenda opacidade no pai do vidro, e o
 * `isInteractive` já dá o retorno do toque.
 */
export function BackButton({ onPress }: BackButtonProps) {
  const t = useTexts();
  const theme = useTheme();

  if (!isGlassEffectAPIAvailable() || !isLiquidGlassAvailable()) {
    return <PlainBackButton onPress={onPress} />;
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={t.header.back} onPress={onPress}>
      <GlassView isInteractive colorScheme={theme.mode} style={styles.glass}>
        <ArrowLeft
          size={theme.sizes.closeIcon}
          color={theme.colors.textPrimary}
          strokeWidth={theme.sizes.iconStrokeWidth}
        />
      </GlassView>
    </Pressable>
  );
}
