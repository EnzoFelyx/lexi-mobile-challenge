import { Heart } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  FAVORITE_BURST_HOLD_MS,
  FAVORITE_BURST_IN_MS,
  FAVORITE_BURST_OUT_MS,
} from '@/constants/animation';
import { useTheme } from '@/core/theme/useTheme';

// Escala de entrada: começa menor, passa um pouco do tamanho e assenta (sensação de "pulo").
const START_SCALE = 0.6;
const OVERSHOOT_SCALE = 1.1;

/**
 * Coração grande e preenchido que aparece com o toque duplo que favorita e some sozinho. Com "Reduzir
 * movimento", não cresce: só aparece e some. Decorativo: o leitor de tela usa o coração da barra.
 * Monte com `key` a cada toque duplo, para a animação recomeçar.
 */
export function FavoriteBurstHeart() {
  const { colors, sizes } = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(reduceMotion ? 1 : START_SCALE);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.set(
      withSequence(
        withTiming(1, { duration: FAVORITE_BURST_IN_MS }),
        withDelay(FAVORITE_BURST_HOLD_MS, withTiming(0, { duration: FAVORITE_BURST_OUT_MS })),
      ),
    );
    if (!reduceMotion) {
      scale.set(
        withSequence(
          withTiming(OVERSHOOT_SCALE, { duration: FAVORITE_BURST_IN_MS }),
          withTiming(1, { duration: FAVORITE_BURST_IN_MS }),
        ),
      );
    }
  }, [opacity, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  return (
    // A View posiciona (className); a Animated.View só anima (style do Reanimated).
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute inset-0 items-center justify-center"
    >
      <Animated.View style={animatedStyle}>
        <Heart
          size={sizes.favoriteBurst}
          color={colors.accent}
          fill={colors.accent}
          strokeWidth={sizes.iconStrokeWidth}
        />
      </Animated.View>
    </View>
  );
}
