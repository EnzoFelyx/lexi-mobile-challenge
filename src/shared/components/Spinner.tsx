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
import { useTheme } from '@/core/theme/useTheme';

interface SpinnerProps {
  accessibilityLabel: string;
}

/** Ícone `loader-circle` do Figma girando; fica parado se o sistema pede menos movimento. */
export function Spinner({ accessibilityLabel }: SpinnerProps) {
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
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={rotationStyle}
    >
      <LoaderCircle
        size={sizes.spinner}
        color={colors.accent}
        strokeWidth={sizes.iconStrokeWidth}
      />
    </Animated.View>
  );
}
