import type { ReactNode } from 'react';
import { View } from 'react-native';

import { type HorizontalSwipeOptions, useHorizontalSwipe } from '@/shared/hooks/useHorizontalSwipe';

interface HorizontalSwipeAreaProps extends HorizontalSwipeOptions {
  children: ReactNode;
}

/** Área que troca de página com arrasto horizontal, sem mexer na tela (ver `useHorizontalSwipe`). */
export function HorizontalSwipeArea({ children, ...options }: HorizontalSwipeAreaProps) {
  const responderProps = useHorizontalSwipe(options);

  return (
    <View className="flex-1" {...responderProps}>
      {children}
    </View>
  );
}
