import { LoaderCircle } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { SPINNER_ROTATION_MS } from '@/constants/animation';
import type { ColorToken } from '@/core/theme/colorVariables';
import { useTheme } from '@/core/theme/useTheme';

interface SpinnerProps {
  /** Sem rótulo, o leitor de tela ignora o spinner (ex.: dentro de um botão, que já diz o estado). */
  accessibilityLabel?: string;
  color?: ColorToken;
  size?: number;
}

/** Ícone `loader-circle` do Figma girando; fica parado se o sistema pede menos movimento. */
export function Spinner({ accessibilityLabel, color = 'accent', size }: SpinnerProps) {
  const { colors, sizes } = useTheme();
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    rotation.set(
      withRepeat(withTiming(360, { duration: SPINNER_ROTATION_MS, easing: Easing.linear }), -1),
    );
    return () => cancelAnimation(rotation);
  }, [reduceMotion, rotation]);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  return (
    <Animated.View
      accessible={Boolean(accessibilityLabel)}
      accessibilityRole={accessibilityLabel ? 'progressbar' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={rotationStyle}
    >
      <LoaderCircle
        size={size ?? sizes.spinner}
        color={colors[color]}
        strokeWidth={sizes.iconStrokeWidth}
      />
    </Animated.View>
  );
}
