import type { DimensionValue } from 'react-native';
import { View } from 'react-native';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
}

/** Bloco de carregamento do Figma (cor `playerIdle`, raio 8). Decorativo: quem usa dá o rótulo. */
export function Skeleton({ width, height }: SkeletonProps) {
  // Medidas vêm de quem usa (cada placeholder tem o tamanho do conteúdo que substitui).
  const size = { width, height };
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="rounded-sm bg-player-idle"
      style={size}
    />
  );
}
