import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { FastScrollThumb } from '@/shared/hooks/useFastScroll';

interface FastScrollbarProps {
  thumb: FastScrollThumb;
}

/**
 * Barrinha da rolagem rápida, no gutter direito (24pt): a área de toque não cobre os cards.
 * Atalho só de toque; leitores de tela têm a própria navegação, então fica oculta para eles.
 */
export function FastScrollbar({ thumb }: FastScrollbarProps) {
  return (
    <Animated.View
      {...thumb.panHandlers}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      className="absolute right-0 top-0 w-xl items-end pr-xxs"
      style={thumb.style}
    >
      <View className="w-scroll-thumb flex-1 rounded-pill bg-text-secondary" />
    </Animated.View>
  );
}
