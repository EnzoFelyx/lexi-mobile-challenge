import { Platform, View } from 'react-native';

import { supportsNativeSheet } from '@/shared/utils/nativeSheet';

/** Puxador do Material 3 no topo da folha: o Android não desenha um. É só visual. */
export function SheetHandle() {
  // Sem a folha nativa, o detalhe abre em tela cheia, sem nada para puxar.
  if (!supportsNativeSheet(Platform.OS, Platform.Version)) {
    return null;
  }
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="items-center"
    >
      <View className="h-sheet-handle-thickness w-sheet-handle-width rounded-pill bg-text-secondary/40" />
    </View>
  );
}
